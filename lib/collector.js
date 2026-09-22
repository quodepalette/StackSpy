// JoErl StackSpy — in-page collectors.
// Both functions are injected with chrome.scripting.executeScript({func}), so each one must be
// completely self-contained: no references to anything outside its own body.

/* ISOLATED world: DOM, CSS, performance, storage names. Returns plain JSON. */
async function collectPage(cfg) {
  const out = {};
  const doc = document;
  const de = doc.documentElement;
  const cap = (s, n) => (s && s.length > n ? s.slice(0, n) : s || "");
  const safe = (fn, dflt) => { try { const v = fn(); return v === undefined ? dflt : v; } catch (e) { return dflt; } };

  // ── Basics ────────────────────────────────────────────────
  out.url = location.href;
  out.title = doc.title || "";
  out.lang = de.getAttribute("lang") || "";
  out.dir = de.getAttribute("dir") || "";
  out.charset = doc.characterSet;
  out.compat = doc.compatMode;
  out.doctype = doc.doctype ? "<!DOCTYPE " + doc.doctype.name + (doc.doctype.publicId ? ' PUBLIC "' + doc.doctype.publicId + '"' : "") + ">" : "";
  out.readyState = doc.readyState;

  // ── HTML source (head + tail so footers such as "Powered by" survive the cap) ──
  const fullHtml = de ? de.outerHTML : "";
  out.htmlLength = fullHtml.length;
  const HC = cfg.htmlCap || 1200000;
  out.html = fullHtml.length > HC ? fullHtml.slice(0, HC * 0.75) + "\n" + fullHtml.slice(-HC * 0.25) : fullHtml;

  const all = Array.from(doc.getElementsByTagName("*"));
  out.domNodes = all.length;
  const sample = all.length > 6000 ? all.slice(0, 6000) : all;

  // DOM depth (bounded)
  let maxDepth = 0;
  for (let i = 0; i < Math.min(all.length, 20000); i++) {
    let d = 0, n = all[i];
    while (n && n.parentElement) { d++; n = n.parentElement; }
    if (d > maxDepth) maxDepth = d;
  }
  out.maxDepth = maxDepth;

  // ── Scripts ───────────────────────────────────────────────
  const scripts = Array.from(doc.scripts);
  out.scripts = scripts.slice(0, 400).map((s) => ({
    src: s.src || "", type: s.type || "", async: s.async && !!s.src, defer: s.defer, module: s.type === "module",
    nomodule: s.noModule, integrity: !!s.integrity, cors: s.crossOrigin || "", inline: !s.src,
    len: s.src ? 0 : (s.text || "").length, head: !!(s.closest && s.closest("head")), nonce: !!(s.nonce || s.getAttribute("nonce"))
  }));
  out.scriptSrcs = out.scripts.map((s) => s.src).filter(Boolean);
  out.inlineScriptCount = scripts.filter((s) => !s.src && (!s.type || /javascript|module/.test(s.type))).length;
  out.inlineScriptBytes = scripts.filter((s) => !s.src && (!s.type || /javascript|module/.test(s.type))).reduce((a, s) => a + (s.text || "").length, 0);

  // JSON-LD types
  const ld = new Set();
  const walkLd = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walkLd);
    const t = o["@type"]; if (t) (Array.isArray(t) ? t : [t]).forEach((x) => typeof x === "string" && ld.add(x));
    if (o["@graph"]) walkLd(o["@graph"]);
  };
  scripts.filter((s) => /ld\+json/i.test(s.type)).forEach((s) => { try { walkLd(JSON.parse(s.textContent)); } catch (e) {} });
  out.jsonLdTypes = Array.from(ld).slice(0, 30);
  out.speculationRules = scripts.some((s) => s.type === "speculationrules");
  out.importMap = scripts.some((s) => s.type === "importmap");

  // ── Links / styles ────────────────────────────────────────
  const links = Array.from(doc.querySelectorAll("link")).slice(0, 300);
  out.links = links.map((l) => ({
    rel: (l.getAttribute("rel") || "").toLowerCase(), href: l.href || "", as: l.getAttribute("as") || "", type: l.getAttribute("type") || "",
    cors: l.getAttribute("crossorigin"), media: l.getAttribute("media") || "", hreflang: l.getAttribute("hreflang") || "",
    sizes: l.getAttribute("sizes") || "", integrity: !!l.integrity, fetchpriority: l.getAttribute("fetchpriority") || ""
  }));
  out.styleHrefs = out.links.filter((l) => /\bstylesheet\b/.test(l.rel)).map((l) => l.href);
  out.inlineStyleTags = doc.querySelectorAll("style").length;
  out.styleAttrCount = doc.querySelectorAll("[style]").length;

  // ── Meta ──────────────────────────────────────────────────
  const metas = Array.from(doc.querySelectorAll("meta"));
  out.metaList = metas.slice(0, 200).map((m) => ({ k: (m.getAttribute("name") || m.getAttribute("property") || m.getAttribute("http-equiv") || (m.hasAttribute("charset") ? "charset" : "")).toLowerCase(), v: cap(m.getAttribute("content") || m.getAttribute("charset") || "", 400) })).filter((m) => m.k);
  out.meta = {};
  out.metaList.forEach((m) => { if (!(m.k in out.meta)) out.meta[m.k] = m.v; });

  // ── Classes, attributes, custom elements ──────────────────
  const classCount = new Map();
  const attrCount = new Map();
  const tagCount = new Map();
  let shadowRoots = 0;
  for (const el of sample) {
    const tn = el.tagName.toLowerCase();
    if (tn.indexOf("-") > 0) tagCount.set(tn, (tagCount.get(tn) || 0) + 1);
    if (el.shadowRoot) shadowRoots++;
    const cn = el.getAttribute("class");
    if (cn) for (const c of cn.split(/\s+/)) if (c) classCount.set(c, (classCount.get(c) || 0) + 1);
    if (el.attributes) for (let i = 0; i < el.attributes.length; i++) {
      const an = el.attributes[i].name;
      if (an === "class" || an === "style" || an === "id" || an === "href" || an === "src") continue;
      attrCount.set(an, (attrCount.get(an) || 0) + 1);
    }
  }
  out.classes = Array.from(classCount.keys()).slice(0, 2500);
  out.classTotal = Array.from(classCount.values()).reduce((a, b) => a + b, 0);
  out.classUnique = classCount.size;
  out.attrNames = Array.from(attrCount.keys()).slice(0, 600);
  out.dataAttrs = Array.from(attrCount.entries()).filter((e) => e[0].startsWith("data-")).sort((a, b) => b[1] - a[1]).slice(0, 25);
  out.customElements = Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 60);
  out.tags = out.customElements.map((e) => e[0]);
  out.shadowRoots = shadowRoots;

  // Styling-approach statistics
  const twVariant = /^(?:sm|md|lg|xl|2xl|hover|focus|active|dark|group-hover|focus-within|focus-visible|disabled|peer-[\w-]+|first|last|odd|even|motion-safe|motion-reduce|aria-[\w-]+|data-\[[^\]]+\]):/;
  const twUtil = /^-?(?:p[xytblrse]?|m[xytblrse]?|gap(?:-[xy])?|space-[xy]|w|h|size|min-[wh]|max-[wh]|text|bg|border|rounded(?:-[a-z]+)?|shadow|font|leading|tracking|items|justify|self|flex|grid|col-span|row-span|z|top|left|right|bottom|inset|opacity|ring|divide|overflow|object|aspect|transition|duration|ease|translate-[xy]|scale|rotate|order|basis|grow|shrink|cursor|select|pointer-events|whitespace|break|line-clamp|outline|fill|stroke|backdrop-blur|blur|sr-only|truncate|hidden|block|inline-block|inline-flex|absolute|relative|fixed|sticky)(?:-[\w./\[\]#%:,()-]+)?$/;
  const bs = /^(?:col(?:-(?:sm|md|lg|xl|xxl))?-(?:\d{1,2}|auto)|btn(?:-[\w-]+)?|navbar(?:-[\w-]+)?|d-(?:flex|none|block|grid|inline|inline-block)|(?:justify-content|align-items)-[\w-]+|form-(?:control|select|check|group|label)|card(?:-body|-title|-header|-footer)?|container(?:-fluid)?|row|modal(?:-[\w]+)?|badge|alert(?:-[\w]+)?|(?:m|p)[xytbse]?-[0-5]|text-(?:muted|center|end|start|primary|secondary))$/;
  const bem = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:__[a-z0-9]+(?:-[a-z0-9]+)*)(?:--[a-z0-9-]+)?$|^[a-z][a-z0-9-]*--[a-z0-9-]+$/;
  const cssMod = /^(?:[A-Za-z0-9]+_[A-Za-z0-9-]+__[A-Za-z0-9_-]{5,}|_[A-Za-z0-9_-]{5,}_[A-Za-z0-9_-]{2,})$/;
  const st = { tailwindVariant: 0, tailwindUtil: 0, bootstrapish: 0, bem: 0, cssModules: 0, emotion: 0, styled: 0, hashed: 0 };
  for (const c of classCount.keys()) {
    if (twVariant.test(c)) st.tailwindVariant++;
    if (twUtil.test(c)) st.tailwindUtil++;
    if (bs.test(c)) st.bootstrapish++;
    if (bem.test(c)) st.bem++;
    if (cssMod.test(c)) st.cssModules++;
    if (/^css-[a-z0-9]{5,8}(-[A-Za-z0-9]+)?$/.test(c)) st.emotion++;
    if (/^sc-[a-zA-Z]{5,}/.test(c)) st.styled++;
    if (/^[a-z]{1,3}_?[A-Za-z0-9]{6,8}$/.test(c) && /\d/.test(c) && /[A-Za-z]/.test(c)) st.hashed++;
  }
  out.classStats = st;

  // ── CSS (readable stylesheets only) ───────────────────────
  let cssText = "", cssRules = 0, cross = 0, sheets = 0, fontFaces = [];
  const varPrefixes = new Map();
  const CSSCAP = cfg.cssCap || 450000;
  for (const sh of Array.from(doc.styleSheets)) {
    sheets++;
    let rules;
    try { rules = sh.cssRules; } catch (e) { cross++; continue; }
    if (!rules) continue;
    const walk = (list, depth) => {
      for (let i = 0; i < list.length; i++) {
        const rule = list[i]; cssRules++;
        if (cssText.length < CSSCAP) cssText += rule.cssText.slice(0, 4000) + "\n";
        if (rule.type === 5) {
          const s = rule.style;
          fontFaces.push({ family: (s.getPropertyValue("font-family") || "").replace(/["']/g, ""), display: s.getPropertyValue("font-display"), weight: s.getPropertyValue("font-weight"), style: s.getPropertyValue("font-style"), src: cap(s.getPropertyValue("src"), 240) });
        }
        if (rule.style && rule.style.length) {
          for (let k = 0; k < rule.style.length; k++) {
            const p = rule.style[k];
            if (p.startsWith("--")) { const m = p.match(/^--([a-z]+(?:-[a-z]+)?)/i); const key = m ? m[1] : p; varPrefixes.set(key, (varPrefixes.get(key) || 0) + 1); }
          }
        }
        if (rule.cssRules && depth < 3) walk(rule.cssRules, depth + 1);
        if (cssRules > 12000) return;
      }
    };
    walk(rules, 0);
    if (cssRules > 12000) break;
  }
  out.css = cssText;
  out.cssMeta = { sheets, crossOrigin: cross, rules: cssRules, bytes: cssText.length };
  out.fontFaces = fontFaces.slice(0, 60);
  out.cssVarPrefixes = Array.from(varPrefixes.entries()).sort((a, b) => b[1] - a[1]).slice(0, 25);
  const cssVarTotal = (cssText.match(/--[\w-]+\s*:/g) || []).length;
  out.cssVarTotal = cssVarTotal;
  out.focusOutlineRemoved = (cssText.match(/:focus[^{}]*\{[^}]*outline\s*:\s*(none|0)/g) || []).length;

  // ── Fonts actually used ───────────────────────────────────
  const fam = (sel) => { const el = doc.querySelector(sel); return el ? getComputedStyle(el).fontFamily : ""; };
  out.fontsUsed = { body: fam("body"), heading: fam("h1, h2, h3"), code: fam("code, pre, kbd"), button: fam("button") };
  out.fontsLoaded = safe(() => Array.from(doc.fonts).filter((f) => f.status === "loaded").map((f) => (f.family || "").replace(/["']/g, "") + " " + f.weight + (f.style !== "normal" ? " " + f.style : "")), []).slice(0, 40);

  // ── Images & media ────────────────────────────────────────
  const imgs = Array.from(doc.images);
  out.images = {
    total: imgs.length, noAlt: imgs.filter((i) => !i.hasAttribute("alt")).length, emptyAlt: imgs.filter((i) => i.getAttribute("alt") === "").length,
    lazy: imgs.filter((i) => i.loading === "lazy").length, srcset: imgs.filter((i) => i.hasAttribute("srcset")).length,
    sizeAttrs: imgs.filter((i) => i.hasAttribute("width") && i.hasAttribute("height")).length, async: imgs.filter((i) => i.decoding === "async").length,
    highPriority: imgs.filter((i) => i.getAttribute("fetchpriority") === "high").length,
    picture: doc.querySelectorAll("picture").length, svgInline: doc.querySelectorAll("svg").length, canvas: doc.querySelectorAll("canvas").length,
    video: doc.querySelectorAll("video").length, audio: doc.querySelectorAll("audio").length,
    pictureTypes: Array.from(new Set(Array.from(doc.querySelectorAll("picture source[type]")).map((s) => s.type))).slice(0, 6),
    below: imgs.filter((i) => { const r = i.getBoundingClientRect(); return r.top > innerHeight * 1.2; }).length,
    belowEager: imgs.filter((i) => { const r = i.getBoundingClientRect(); return r.top > innerHeight * 1.2 && i.loading !== "lazy"; }).length
  };
  out.videoAttrs = Array.from(doc.querySelectorAll("video")).slice(0, 5).map((v) => ({ autoplay: v.autoplay, muted: v.muted, loop: v.loop, playsinline: v.playsInline, poster: !!v.poster, controls: v.controls, preload: v.preload }));
  out.iframes = Array.from(doc.querySelectorAll("iframe")).slice(0, 60).map((f) => ({ src: f.src || f.getAttribute("data-src") || "", title: f.title || "", loading: f.loading || "", sandbox: f.hasAttribute("sandbox"), allow: cap(f.getAttribute("allow") || "", 120) }));

  // ── Accessibility & semantics ─────────────────────────────
  const q = (s) => doc.querySelectorAll(s);
  const hs = Array.from(q("h1,h2,h3,h4,h5,h6")).map((h) => +h.tagName[1]);
  let skips = 0; for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) skips++;
  const inputs = Array.from(q("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=image]), select, textarea"));
  const unlabeled = inputs.filter((i) => !(i.labels && i.labels.length) && !i.getAttribute("aria-label") && !i.getAttribute("aria-labelledby") && !i.title).length;
  const buttons = Array.from(q("button, [role=button]"));
  const btnNoName = buttons.filter((b) => !(b.textContent || "").trim() && !b.getAttribute("aria-label") && !b.getAttribute("aria-labelledby") && !b.title && !b.querySelector("img[alt]:not([alt=''])")).length;
  const anchors = Array.from(q("a[href]"));
  const linkNoName = anchors.filter((a) => !(a.textContent || "").trim() && !a.getAttribute("aria-label") && !a.getAttribute("aria-labelledby") && !a.title && !a.querySelector("img[alt]:not([alt=''])")).length;
  const firstLinks = anchors.slice(0, 6);
  const vp = out.meta["viewport"] || "";
  out.a11y = {
    landmarks: { header: q("header,[role=banner]").length, nav: q("nav,[role=navigation]").length, main: q("main,[role=main]").length, footer: q("footer,[role=contentinfo]").length, aside: q("aside,[role=complementary]").length, search: q("[role=search]").length },
    h1: q("h1").length, headingLevels: hs.slice(0, 80), headingSkips: skips,
    ariaLabel: q("[aria-label]").length, ariaLabelledby: q("[aria-labelledby]").length, ariaHidden: q("[aria-hidden=true]").length, ariaLive: q("[aria-live]").length, roles: q("[role]").length, ariaExpanded: q("[aria-expanded]").length,
    skipLink: firstLinks.some((a) => /skip/i.test(a.textContent || "") && (a.getAttribute("href") || "").startsWith("#")),
    inputs: inputs.length, unlabeledInputs: unlabeled, buttons: buttons.length, buttonsNoName: btnNoName, links: anchors.length, linksNoName: linkNoName,
    positiveTabindex: q("[tabindex]").length ? Array.from(q("[tabindex]")).filter((e) => +e.getAttribute("tabindex") > 0).length : 0,
    zoomBlocked: /user-scalable\s*=\s*(no|0)/i.test(vp) || /maximum-scale\s*=\s*1(\.0)?\b/i.test(vp),
    autofocus: q("[autofocus]").length, tables: q("table").length, tablesNoHeader: Array.from(q("table")).filter((t) => !t.querySelector("th")).length,
    dialogs: q("dialog").length, details: q("details").length, popovers: q("[popover]").length
  };

  // ── Forms ─────────────────────────────────────────────────
  const inputTypes = {};
  Array.from(q("input")).forEach((i) => { const t = (i.getAttribute("type") || "text").toLowerCase(); inputTypes[t] = (inputTypes[t] || 0) + 1; });
  out.forms = {
    count: q("form").length, inputTypes, autocomplete: q("[autocomplete]").length, inputmode: q("[inputmode]").length, required: q("[required]").length,
    password: q("input[type=password]").length, insecureAction: Array.from(q("form[action]")).filter((f) => /^http:\/\//i.test(f.getAttribute("action"))).length,
    novalidate: q("form[novalidate]").length, datalist: q("datalist").length
  };

  // ── HTML platform features ────────────────────────────────
  out.features = {
    picture: out.images.picture, dialog: q("dialog").length, popover: q("[popover]").length, details: q("details").length, template: q("template").length, slot: q("slot").length,
    inert: q("[inert]").length, contenteditable: q("[contenteditable]").length, lazyIframes: q("iframe[loading=lazy]").length, noscript: q("noscript").length,
    dataTestId: q("[data-testid],[data-test],[data-cy],[data-qa]").length, microdata: q("[itemscope]").length, ariaCurrent: q("[aria-current]").length,
    hiddenUntilFound: q("[hidden=until-found]").length, srOnly: q(".sr-only,.visually-hidden,.screen-reader-text").length
  };

  // ── Security-related DOM facts ────────────────────────────
  const pageOrigin = location.origin;
  const isExt = (u) => { try { return new URL(u, location.href).origin !== pageOrigin; } catch (e) { return false; } };
  const extScripts = out.scripts.filter((s) => s.src && isExt(s.src));
  const extStyles = out.links.filter((l) => /\bstylesheet\b/.test(l.rel) && l.href && isExt(l.href));
  out.security = {
    https: location.protocol === "https:",
    sriScripts: extScripts.filter((s) => s.integrity).length, extScripts: extScripts.length,
    sriStyles: extStyles.filter((l) => l.integrity).length, extStyles: extStyles.length,
    blankNoRel: Array.from(q('a[target=_blank]')).filter((a) => !/\b(noopener|noreferrer)\b/i.test(a.getAttribute("rel") || "")).length,
    blankTotal: q('a[target=_blank]').length,
    inlineHandlers: (fullHtml.slice(0, 900000).match(/\son(click|load|error|submit|change|mouseover|focus|blur|keydown|keyup)\s*=/gi) || []).length,
    javascriptUrls: (fullHtml.slice(0, 900000).match(/href=["']\s*javascript:/gi) || []).length,
    mixed: Array.from(q("img[src],script[src],link[href],iframe[src],source[src],video[src],audio[src]")).filter((e) => /^http:\/\//i.test(e.getAttribute("src") || e.getAttribute("href") || "")).length,
    cspMeta: !!doc.querySelector('meta[http-equiv="Content-Security-Policy" i]'),
    nonces: out.scripts.filter((s) => s.nonce).length
  };

  // ── Comments ──────────────────────────────────────────────
  const comments = [];
  try {
    const tw = doc.createTreeWalker(doc, NodeFilter.SHOW_COMMENT);
    let n, total = 0;
    while ((n = tw.nextNode())) { total++; const t = (n.nodeValue || "").trim(); if (t && comments.length < 40 && !/^\[if |^<!\[endif/.test(t)) comments.push(cap(t.replace(/\s+/g, " "), 160)); }
    out.commentCount = total;
  } catch (e) { out.commentCount = 0; }
  out.comments = comments;

  // ── Storage names (never values) ──────────────────────────
  out.localStorageKeys = safe(() => Object.keys(localStorage).slice(0, 100), []);
  out.sessionStorageKeys = safe(() => Object.keys(sessionStorage).slice(0, 100), []);
  out.documentCookies = safe(() => document.cookie.split(";").map((c) => c.trim().split("=")[0]).filter(Boolean), []);
  const asyncBits = await Promise.all([
    safe(() => indexedDB.databases ? indexedDB.databases().then((d) => d.map((x) => x.name)).catch(() => []) : [], []),
    safe(() => caches.keys().catch(() => []), []),
    safe(() => navigator.serviceWorker.getRegistrations().then((rs) => rs.map((r) => { const w = r.active || r.waiting || r.installing; return { script: w ? w.scriptURL : "", scope: r.scope, state: w ? w.state : "" }; })).catch(() => []), [])
  ]);
  out.indexedDbNames = (asyncBits[0] || []).slice(0, 30);
  out.cacheNames = (asyncBits[1] || []).slice(0, 30);
  out.serviceWorkers = asyncBits[2] || [];
  out.swControlled = !!(navigator.serviceWorker && navigator.serviceWorker.controller);

  // ── DOM queries requested by the rule engine ──────────────
  out.dom = {};
  for (const qy of cfg.domQueries || []) {
    try {
      const els = doc.querySelectorAll(qy.sel);
      if (!els.length) continue;
      const r = { n: els.length, a: [] };
      if (qy.attr) for (let i = 0; i < Math.min(els.length, 5); i++) { const v = els[i].getAttribute(qy.attr); if (v != null) r.a.push(v); }
      out.dom[qy.key] = r;
    } catch (e) {}
  }

  // ── Performance ───────────────────────────────────────────
  const perf = {};
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav) {
    perf.nav = {
      type: nav.type, protocol: nav.nextHopProtocol, redirectCount: nav.redirectCount, ttfb: Math.round(nav.responseStart - nav.startTime), dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
      connect: Math.round(nav.connectEnd - nav.connectStart), tls: nav.secureConnectionStart ? Math.round(nav.connectEnd - nav.secureConnectionStart) : 0,
      download: Math.round(nav.responseEnd - nav.responseStart), domInteractive: Math.round(nav.domInteractive), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd),
      transfer: nav.transferSize, encoded: nav.encodedBodySize, decoded: nav.decodedBodySize, workerStart: Math.round(nav.workerStart || 0),
      serverTiming: (nav.serverTiming || []).map((s) => ({ name: s.name, duration: s.duration, description: s.description })).slice(0, 12)
    };
  }
  const paint = {};
  performance.getEntriesByType("paint").forEach((p) => (paint[p.name] = Math.round(p.startTime)));
  perf.paint = paint;

  const vitals = await new Promise((resolve) => {
    const v = { lcp: null, cls: 0, longTasks: 0, longTaskTime: 0 };
    const obs = [];
    const watch = (type, cb) => { try { const o = new PerformanceObserver((l) => l.getEntries().forEach(cb)); o.observe({ type, buffered: true }); obs.push(o); } catch (e) {} };
    watch("largest-contentful-paint", (e) => { const el = e.element; v.lcp = { time: Math.round(e.startTime), size: e.size, tag: el ? el.tagName.toLowerCase() : "", url: e.url || "", id: el && el.id ? el.id : "" }; });
    watch("layout-shift", (e) => { if (!e.hadRecentInput) v.cls += e.value; });
    watch("longtask", (e) => { v.longTasks++; v.longTaskTime += e.duration; });
    setTimeout(() => { obs.forEach((o) => { try { o.disconnect(); } catch (e) {} }); v.cls = Math.round(v.cls * 1000) / 1000; v.longTaskTime = Math.round(v.longTaskTime); resolve(v); }, 120);
  });
  perf.vitals = vitals;

  // Resources: aggregate here so the payload stays small
  const regDomain = (h) => { const p = h.split("."); if (p.length <= 2) return h; const sl = p[p.length - 2]; return (p[p.length - 1].length === 2 && /^(co|com|org|net|gov|ac|edu|or|ne|go)$/.test(sl)) ? p.slice(-3).join(".") : p.slice(-2).join("."); };
  const pageReg = regDomain(location.hostname);
  const res = performance.getEntriesByType("resource");
  const byType = {}, byProto = {}, hosts = {};
  let totalTransfer = 0, cachedHits = 0, hiddenSizes = 0, uncompressed = [], blocking = [];
  const biggest = [];
  const urlsSeen = [];
  for (const e of res) {
    const t = e.initiatorType || "other";
    const size = e.transferSize || 0;
    const b = byType[t] || (byType[t] = { n: 0, bytes: 0 }); b.n++; b.bytes += size;
    totalTransfer += size;
    const pr = e.nextHopProtocol || "unknown"; byProto[pr] = (byProto[pr] || 0) + 1;
    let host = "";
    try { host = new URL(e.name).hostname; } catch (er) {}
    if (host) { const h = hosts[host] || (hosts[host] = { n: 0, bytes: 0, third: regDomain(host) !== pageReg }); h.n++; h.bytes += size; }
    if (e.transferSize === 0 && e.decodedBodySize > 0) cachedHits++;
    if (e.transferSize === 0 && e.decodedBodySize === 0 && host && host !== location.hostname) hiddenSizes++;
    if (e.renderBlockingStatus === "blocking") blocking.push({ url: e.name, type: t });
    if (e.decodedBodySize > 2048 && e.encodedBodySize >= e.decodedBodySize * 0.97 && /\.(js|css|html|json|svg)(\?|$)/i.test(e.name) && e.transferSize > 0) uncompressed.push({ url: e.name, bytes: e.decodedBodySize });
    biggest.push({ url: e.name, type: t, bytes: size || e.encodedBodySize || 0, duration: Math.round(e.duration) });
    if (urlsSeen.length < 1500) urlsSeen.push(e.name);
  }
  biggest.sort((a, b) => b.bytes - a.bytes);
  perf.resources = { count: res.length, totalTransfer, byType, byProto, hosts, cachedHits, hiddenSizes, uncompressed: uncompressed.slice(0, 8), blocking: blocking.slice(0, 12), biggest: biggest.slice(0, 8), pageRegDomain: pageReg };
  out.resourceUrls = urlsSeen;
  perf.memory = safe(() => performance.memory ? { used: performance.memory.usedJSHeapSize, total: performance.memory.totalJSHeapSize } : null, null);
  out.perf = perf;

  return out;
}

/* MAIN world: page globals, framework probes and custom global names. */
function collectMain(cfg) {
  const out = { js: {}, globals: [] };
  const w = window;
  const val = (v) => {
    if (v === undefined) return undefined;
    if (v === null) return undefined;
    const t = typeof v;
    if (t === "string") return v.slice(0, 80);
    if (t === "number" || t === "boolean") return String(v);
    if (Array.isArray(v) && v.length && v.every((x) => typeof x === "string" || typeof x === "number")) return v.slice(0, 5).join(",");
    return true;
  };
  for (const path of cfg.paths || []) {
    if (path.startsWith("probe:")) continue;
    try {
      let o = w;
      const parts = path.split(".");
      for (let i = 0; i < parts.length; i++) { if (o == null) { o = undefined; break; } o = o[parts[i]]; }
      const v = val(o);
      if (v !== undefined) out.js[path] = v;
    } catch (e) {}
  }

  // Framework probes (things a plain global check cannot see)
  const probes = {};
  try {
    const roots = [];
    const cands = document.querySelectorAll("#root, #app, #__next, #__nuxt, #__svelte, #app-root, [data-reactroot], body > div, body > main, body");
    for (let i = 0; i < Math.min(cands.length, 40); i++) roots.push(cands[i]);
    const fiberNames = [];
    const seenFibers = new Set();
    const motionNames = /^(?:motion|m|MotionComponent|ForwardRef\(motion|AnimatePresence|PresenceChild|LayoutGroup|LazyMotion|MotionConfig|Reorder)(?:$|[.\(])/i;
    const inspectType = (type) => {
      if (!type) return;
      const names = [];
      try {
        if (typeof type === "string") names.push(type);
        if (typeof type === "function") names.push(type.displayName, type.name);
        if (typeof type === "object") {
          names.push(type.displayName, type.name);
          if (type.render) names.push(type.render.displayName, type.render.name);
          if (type.type) names.push(type.type.displayName, type.type.name);
        }
      } catch (e) {}
      for (const n of names) {
        if (typeof n === "string" && motionNames.test(n)) { if (!fiberNames.includes(n)) fiberNames.push(n); break; }
      }
    };
    const walkFiber = (fiber, budget) => {
      if (!fiber || budget <= 0 || seenFibers.has(fiber)) return budget;
      seenFibers.add(fiber); inspectType(fiber.type);
      budget--;
      if (fiber.child) budget = walkFiber(fiber.child, budget);
      if (fiber.sibling) budget = walkFiber(fiber.sibling, budget);
      return budget;
    };
    for (const el of roots) {
      const keys = Object.keys(el);
      if (!probes.react && keys.some((k) => k.startsWith("__reactContainer$") || k.startsWith("__reactFiber$") || k === "_reactRootContainer")) probes.react = true;
      if (!probes.reactFiber) {
        for (const k of keys) {
          if (k.startsWith("__reactContainer$") || k.startsWith("__reactFiber$")) {
            try { const f = el[k]; if (f) { walkFiber(f, 6000); probes.reactFiber = true; } } catch (e) {}
            if (fiberNames.length) break;
          }
        }
      }
      if (el.__vue_app__) { probes.vue3 = true; if (el.__vue_app__.version) probes.vue3Version = String(el.__vue_app__.version); }
      if (el.__vue__ && !probes.vue2Version) {
        try { let C = el.__vue__.constructor; while (C && C.super) C = C.super; if (C && C.version) probes.vue2Version = String(C.version); } catch (e) {}
      }
    }

    // React's private fiber/container properties are attached to whichever DOM nodes
    // React owns. In some production builds (especially RSC/Next.js) the root container
    // is not one of the conventional #root/#app candidates above. Search a bounded DOM
    // sample for the same signatures so React detection does not depend on dev globals.
    if (!probes.reactFiber) {
      try {
        const els = document.getElementsByTagName("*");
        const limit = Math.min(els.length, 10000);
        for (let i = 0; i < limit; i++) {
          const el = els[i], keys = Object.keys(el);
          const rk = keys.find((k) => k.startsWith("__reactContainer$") || k.startsWith("__reactFiber$") || k === "_reactRootContainer");
          if (rk) {
            probes.react = true;
            try { const f = el[rk]; if (f) { walkFiber(f, 6000); probes.reactFiber = true; } } catch (e) {}
            if (fiberNames.length) break;
          }
        }
      } catch (e) {}
    }

    const hook = w.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook && hook.renderers && hook.renderers.size) {
      const r = hook.renderers.values().next().value;
      if (r && r.version) { probes.reactVersion = String(r.version); probes.react = true; }
    }
  } catch (e) {}
  if (fiberNames.length) { probes.framerMotion = true; probes.framerMotionComponents = fiberNames.slice(0, 12).join(", "); }
  for (const k in probes) out.js["probe:" + k] = probes[k] === true ? true : String(probes[k]);

  // Site-defined globals = window properties that a pristine iframe does not have.
  try {
    const fr = document.createElement("iframe");
    fr.style.cssText = "display:none!important;width:0;height:0;position:absolute;left:-9999px";
    fr.setAttribute("aria-hidden", "true");
    (document.body || document.documentElement).appendChild(fr);
    const base = new Set(Object.getOwnPropertyNames(fr.contentWindow));
    fr.remove();
    const skip = /^(__REACT_DEVTOOLS|__REDUX_DEVTOOLS|__VUE_DEVTOOLS|__APOLLO_DEVTOOLS|__JOERL|webkit|chrome$|onwebkit|cookieStore|navigation$|documentPictureInPicture|__gCrWeb|__firefox__|__playwright|__pw)/;
    out.globals = Object.getOwnPropertyNames(w).filter((n) => !base.has(n) && !/^\d+$/.test(n) && !skip.test(n)).slice(0, 500);
  } catch (e) { out.globals = []; }
  return out;
}

if (typeof module !== "undefined") module.exports = { collectPage, collectMain };
