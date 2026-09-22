// JoErl StackSpy — service worker.
// Watches network traffic per tab, runs scans (passive on page load, deep when the popup asks) and caches results.
importScripts(
  "data/_init.js", "data/meta.js",
  "data/tech-1-content.js", "data/tech-2-frontend.js", "data/tech-3-backend-edge.js", "data/tech-4-services.js", "data/tech-5-expansion.js",
  "lib/collector.js", "lib/engine.js", "lib/insights.js"
);

const QUERIES = Engine.buildQueries(TECH_DB);
const net = new Map();            // tabId -> network record for the current navigation
const scans = new Map();          // tabId -> in-flight scan promise
const deepCache = new Map();      // url -> { t, data }
const persistTimers = new Map();
const MAX_REQUESTS = 2000;

// ───────────── network capture ─────────────
const blank = (url) => ({ url, status: 0, statusLine: "", ip: "", headers: {}, redirects: [], requests: [], started: Date.now() });

async function getNet(tabId) {
  if (net.has(tabId)) return net.get(tabId);
  try {
    const s = await chrome.storage.session.get("net:" + tabId);
    if (s["net:" + tabId]) { net.set(tabId, s["net:" + tabId]); return net.get(tabId); }
  } catch (e) {}
  const n = blank("");
  net.set(tabId, n);
  return n;
}
function persist(tabId) {
  if (persistTimers.has(tabId)) return;
  persistTimers.set(tabId, setTimeout(() => {
    persistTimers.delete(tabId);
    const n = net.get(tabId);
    if (n) chrome.storage.session.set({ ["net:" + tabId]: n }).catch(() => {});
  }, 1500));
}
const usable = (d) => d.tabId >= 0 && /^https?:/.test(d.url);

function redactSetCookie(v) { return String(v).split("\n").map((c) => c.replace(/^([^=;]+)=[^;]*/, "$1=•••")).join("\n"); }

chrome.webRequest.onBeforeRequest.addListener((d) => {
  if (!usable(d)) return;
  if (d.type === "main_frame") net.set(d.tabId, blank(d.url));
  else {
    const n = net.get(d.tabId);
    if (n && n.requests.length < MAX_REQUESTS) n.requests.push({ u: d.url.split("#")[0].slice(0, 400), t: d.type });
    else if (!n) getNet(d.tabId).then((m) => m.requests.length < MAX_REQUESTS && m.requests.push({ u: d.url.slice(0, 400), t: d.type }));
  }
  persist(d.tabId);
}, { urls: ["<all_urls>"] });

chrome.webRequest.onBeforeRedirect.addListener((d) => {
  if (d.type !== "main_frame" || !usable(d)) return;
  getNet(d.tabId).then((n) => { n.redirects.push({ from: d.url, to: d.redirectUrl, status: d.statusCode }); persist(d.tabId); });
}, { urls: ["<all_urls>"] });

chrome.webRequest.onHeadersReceived.addListener((d) => {
  if (d.type !== "main_frame" || !usable(d)) return;
  getNet(d.tabId).then((n) => {
    const h = {};
    for (const x of d.responseHeaders || []) {
      const k = x.name.toLowerCase();
      const v = k === "set-cookie" ? redactSetCookie(x.value || "") : x.value || "";
      h[k] = h[k] !== undefined ? h[k] + "\n" + v : v;
    }
    n.headers = h; n.status = d.statusCode; n.statusLine = d.statusLine || ""; n.url = d.url;
    persist(d.tabId);
  });
}, { urls: ["<all_urls>"] }, ["responseHeaders", "extraHeaders"]);

chrome.webRequest.onCompleted.addListener((d) => {
  if (!usable(d)) return;
  getNet(d.tabId).then((n) => {
    if (d.type === "main_frame") { n.ip = d.ip || n.ip; n.status = d.statusCode || n.status; }
    else if (d.ip) { const r = n.requests.findLast ? n.requests.findLast((x) => x.u === d.url.split("#")[0].slice(0, 400)) : null; if (r) { r.ip = d.ip; r.s = d.statusCode; } }
    persist(d.tabId);
  });
}, { urls: ["<all_urls>"] });

chrome.tabs.onRemoved.addListener((tabId) => {
  net.delete(tabId);
  chrome.storage.session.remove(["net:" + tabId, "res:" + tabId]).catch(() => {});
});

// ───────────── deep probes (only when the popup is opened) ─────────────
async function fetchLimited(url, opts) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), (opts && opts.timeout) || 5000);
  try {
    const res = await fetch(url, { signal: ctl.signal, credentials: "omit", cache: (opts && opts.cache) || "default", redirect: "follow" });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    const max = (opts && opts.max) || 60000;
    const reader = res.body.getReader();
    const chunks = []; let size = 0, truncated = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); size += value.length;
      if (size > max) { truncated = true; try { await reader.cancel(); } catch (e) {} break; }
    }
    const buf = new Uint8Array(size); let o = 0; for (const c of chunks) { buf.set(c, o); o += c.length; }
    return { text: new TextDecoder("utf-8", { fatal: false }).decode(buf), ct, size, truncated, headers: { sourcemap: res.headers.get("sourcemap") || res.headers.get("x-sourcemap") || "" } };
  } catch (e) { return null; } finally { clearTimeout(timer); }
}
const looksHtml = (r) => !r || /html/i.test(r.ct) || /^\s*<(!doctype|html)/i.test(r.text);

async function fetchBundle(url) {
  // Keep the complete candidate bundle. The old scanner sampled the first ~600 KB and
  // the tail, which can miss a dependency buried in a large Next.js/Webpack chunk.
  const head = await fetchLimited(url, { cache: "force-cache", max: 4200000, timeout: 12000 });
  if (!head) return null;
  const t = head.text;
  const sm = t.match(/[#@]\s*sourceMappingURL=([^\s*]+)/g);
  const inlineSm = t.match(/[#@]\s*sourceMappingURL=data:application\/json[^,]*,([^\s*]+)/);
  const lastSm = sm && sm.length ? sm[sm.length - 1].replace(/^[#@]\s*sourceMappingURL=/, "") : "";
  const headerSm = head.headers.sourcemap || "";
  const mapRef = headerSm || lastSm;
  let mapUrl = "";
  let mapText = "";
  if (mapRef && !/^data:/i.test(mapRef)) {
    try { mapUrl = new URL(mapRef, url).href; } catch (e) { mapUrl = ""; }
  }
  if (inlineSm) {
    try { mapText = decodeURIComponent(escape(atob(inlineSm[1]))); } catch (e) { mapText = ""; }
  }
  if (!mapText && mapUrl) {
    const map = await fetchLimited(mapUrl, { cache: "force-cache", max: 4200000, timeout: 9000 });
    if (map && !looksHtml(map)) mapText = map.text;
  }
  const bm = t.slice(0, 1200).match(/\/\*[!*]?\s*([^\n*]{3,140}?\d+\.\d+\.\d+[^\n*]{0,50})/);
  const lines = t.split("\n").length;
  let sourceNames = [];
  if (mapText) {
    try {
      const smj = JSON.parse(mapText);
      if (Array.isArray(smj.sources)) sourceNames = smj.sources.slice(0, 500).map(String);
      if (Array.isArray(smj.names)) sourceNames.push(...smj.names.slice(0, 100).map(String));
    } catch (e) {}
  }
  return {
    url,
    text: t,
    size: head.size,
    truncated: head.truncated,
    sourceMap: !!(mapRef || mapText),
    sourceMapUrl: mapUrl,
    sourceMapText: mapText,
    sourceNames,
    banner: bm ? bm[1].trim() : "",
    minified: t.length / Math.max(1, lines) > 400
  };
}

async function deepProbe(url, page) {
  const cached = deepCache.get(url);
  if (cached && Date.now() - cached.t < 600000) return cached.data;
  const origin = new URL(url).origin;
  const files = {};
  const manifestLink = ((page && page.links) || []).find((l) => l.rel === "manifest");
  const jobs = [
    fetchLimited(origin + "/robots.txt", { max: 40000, timeout: 4000 }).then((r) => { if (r && !looksHtml(r)) files.robots = r.text; }),
    fetchLimited(origin + "/humans.txt", { max: 8000, timeout: 4000 }).then((r) => { if (r && !looksHtml(r)) files.humans = r.text; }),
    fetchLimited(origin + "/.well-known/security.txt", { max: 8000, timeout: 4000 }).then((r) => { if (r && !looksHtml(r)) files.security = r.text; }),
    manifestLink ? fetchLimited(manifestLink.href, { max: 40000, timeout: 4000 }).then((r) => { if (r && !looksHtml(r)) files.manifest = r.text; }) : null
  ].filter(Boolean);

  // Do not rely only on <script src>. Next.js/React lazy chunks are often injected after
  // initial HTML and are visible only through PerformanceResourceTiming.
  const scriptUrls = ((page && page.scriptSrcs) || []).filter((u) => /^https?:/i.test(u));
  const resourceScripts = ((page && page.resourceUrls) || []).filter((u) => /^https?:/i.test(u) && /\.(?:js|mjs)(?:[?#]|$)/i.test(u));
  const scripts = Array.from(new Set(scriptUrls.concat(resourceScripts)));
  const same = scripts.filter((u) => u.startsWith(origin)), other = scripts.filter((u) => !u.startsWith(origin));
  // App/framework bundle chunks (e.g. Next.js/Nuxt/webpack "static/chunks" output) are where UI
  // libraries like framer-motion actually live, so they're prioritized ahead of plain DOM order.
  const isAppChunk = (u) => /\/(?:_next|_nuxt|static)\/(?:static\/)?chunks\//i.test(u) || /\.[0-9a-f]{6,}\.(?:js|mjs)(?:\?|$)/i.test(u);
  const rank = (list) => { const a = list.filter(isAppChunk), b = list.filter((u) => !isAppChunk(u)); return a.concat(b); };
  // Accuracy comes before a small fixed sample. A dependency can be in any lazy chunk,
  // including a third-party bundle, so inspect every JS/MJS resource that the page actually
  // loaded. The fetch itself is bounded per file, and concurrency is limited below.
  const pick = Array.from(new Set(rank(same).concat(rank(other)))).filter((u) => /\.(?:js|mjs)(?:[?#]|$)/i.test(u));
  const styles = ((page && page.styleHrefs) || []).filter((u) => /^https?:/.test(u)).slice(0, 5);
  const bundles = [];
  const candidates = pick.concat(styles);
  const workers = Array.from({ length: 8 }, async (_, wi) => {
    for (let i = wi; i < candidates.length; i += 8) {
      const b = await fetchBundle(candidates[i]).catch(() => null);
      if (b) bundles.push(b);
    }
  });
  await Promise.allSettled(jobs.concat(workers));
  const bodies = bundles.map((b) => ({ url: b.url, text: b.text, kind: "bundle", size: b.size, truncated: b.truncated }));
  const sourceMaps = bundles.filter((b) => b.sourceMapText).map((b) => ({
    url: b.sourceMapUrl || (b.url + "#source-map"),
    text: b.sourceMapText,
    kind: "source-map",
    bundleUrl: b.url,
    sourceNames: b.sourceNames || []
  }));
  const sourceNames = bundles.filter((b) => b.sourceNames && b.sourceNames.length).map((b) => ({
    url: b.sourceMapUrl || b.url,
    bundleUrl: b.url,
    names: b.sourceNames
  }));
  const data = {
    files,
    bodies,
    sourceMaps,
    sourceNames,
    bundles: bundles.map((b) => ({ url: b.url, size: b.size, truncated: b.truncated, sourceMap: b.sourceMap, sourceMapUrl: b.sourceMapUrl, sourceNames: b.sourceNames || [], banner: b.banner, minified: b.minified }))
  };
  deepCache.set(url, { t: Date.now(), data });
  return data;
}

// ───────────── scanning ─────────────
const scannable = (u) => /^https?:\/\//i.test(u || "") && !/^https?:\/\/(chrome\.google\.com\/webstore|chromewebstore\.google\.com)/i.test(u);

async function runScan(tabId, opts) {
  const tab = await chrome.tabs.get(tabId);
  if (!scannable(tab.url)) return { unsupported: true, url: tab.url || "" };
  let page, main;
  try {
    const r = await chrome.scripting.executeScript({ target: { tabId }, func: collectPage, args: [{ domQueries: QUERIES.domQueries }] });
    page = r && r[0] && r[0].result;
    const m = await chrome.scripting.executeScript({ target: { tabId }, world: "MAIN", func: collectMain, args: [{ paths: QUERIES.paths }] });
    main = m && m[0] && m[0].result;
  } catch (e) { return { error: "This page can't be inspected (" + (e.message || e) + ")", url: tab.url }; }
  if (!page) return { error: "No data returned from the page.", url: tab.url };

  const n = await getNet(tabId);
  let cookies = [];
  try { cookies = (await chrome.cookies.getAll({ url: tab.url })).map((c) => ({ name: c.name, value: c.value, secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite, session: c.session, domain: c.domain })); } catch (e) {}
  const deep = opts && opts.deep ? await deepProbe(tab.url, page).catch(() => ({})) : (deepCache.get(tab.url) || {}).data || {};

  const facts = { url: tab.url, page, main: main || {}, net: n, cookies, deep };
  const techs = Engine.detect(facts, TECH_DB, CATS);
  const built = Insights.build(facts, techs, TECH_DB);
  const result = { url: tab.url, host: built.overview.host, scannedAt: Date.now(), deep: !!(deep && deep.bundles), techs, ...built };
  try { await chrome.storage.session.set({ ["res:" + tabId]: result }); } catch (e) {}
  setBadge(tabId, techs.filter((t) => t.confidence >= 50).length);
  return result;
}

function scan(tabId, opts) {
  const key = tabId + (opts && opts.deep ? ":d" : "");
  if (scans.has(key)) return scans.get(key);
  const p = runScan(tabId, opts).finally(() => scans.delete(key));
  scans.set(key, p);
  return p;
}

function setBadge(tabId, count) {
  chrome.action.setBadgeText({ tabId, text: count ? String(count) : "" }).catch(() => {});
  chrome.action.setBadgeBackgroundColor({ tabId, color: "#F5B544" }).catch(() => {});
  if (chrome.action.setBadgeTextColor) chrome.action.setBadgeTextColor({ tabId, color: "#0B1A2C" }).catch(() => {});
  chrome.action.setTitle({ tabId, title: "JoErl StackSpy — " + count + " technologies detected" }).catch(() => {});
}

async function settings() {
  const s = await chrome.storage.local.get("settings");
  return Object.assign({ auto: true }, s.settings || {});
}

const timers = new Map();
function queueAuto(tabId, delay) {
  clearTimeout(timers.get(tabId));
  timers.set(tabId, setTimeout(async () => {
    timers.delete(tabId);
    if (!(await settings()).auto) return;
    try { await scan(tabId, { deep: false }); } catch (e) {}
  }, delay));
}
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "loading") {
    chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {});
    if (tab.url) deepCache.delete(tab.url);
  }
  if (info.status === "complete" && scannable(tab.url)) queueAuto(tabId, 1500);
});

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (!msg || !msg.type) return;
  if (msg.type === "GET_RESULT") {
    chrome.storage.session.get("res:" + msg.tabId).then((s) => respond(s["res:" + msg.tabId] || null)).catch(() => respond(null));
    return true;
  }
  if (msg.type === "SCAN") {
    scan(msg.tabId, { deep: !!msg.deep }).then(respond).catch((e) => respond({ error: String(e && e.message || e) }));
    return true;
  }
});
