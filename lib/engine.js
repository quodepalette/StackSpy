// JoErl StackSpy — detection engine.
// Turns collected "facts" about a page into a list of detected technologies with evidence.
(function (g) {
  const RULE_ARRAYS = { url: "url", html: "html", css: "css", scripts: "scripts", styles: "styles", links: "links", requests: "requests", classes: "classes", attrs: "attrs", tags: "tags", globals: "globals", storage: "storage", sw: "sw", iframes: "iframes", serverTiming: "serverTiming", body: "body", sourceMaps: "sourceMaps", sourceNames: "sourceNames", proto: "proto", robots: "robots", humans: "humans" };
  const MULTILINE = new Set(["scripts", "styles", "links", "requests", "classes", "attrs", "tags", "globals", "storage", "sw", "iframes", "serverTiming", "proto"]);
  const EVIDENCE_LABEL = { url: "page URL", html: "HTML", css: "CSS", scripts: "script URL", styles: "stylesheet URL", links: "link tag", requests: "network request", classes: "CSS class", attrs: "HTML attribute", tags: "custom element", globals: "global variable", storage: "browser storage", sw: "service worker", iframes: "iframe", serverTiming: "Server-Timing", body: "bundle contents", sourceMaps: "source map", sourceNames: "source-map package path", proto: "protocol", robots: "robots.txt", humans: "humans.txt" };

  const cache = new Map();
  function parsePattern(str, defC) {
    const key = str + "\u0001" + defC;
    if (cache.has(key)) return cache.get(key);
    const parts = str.split("##");
    const p = { src: parts[0], c: defC == null ? 100 : defC, v: null, all: false, t: null, re: {} };
    for (let i = 1; i < parts.length; i++) {
      const o = parts[i];
      if (o.startsWith("v=")) p.v = o.slice(2);
      else if (o.startsWith("c=")) p.c = +o.slice(2);
      else if (o.startsWith("t=")) p.t = o.slice(2);
      else if (o === "all") p.all = true;
    }
    cache.set(key, p);
    return p;
  }
  function regexFor(p, flags) {
    if (p.re[flags]) return p.re[flags];
    let re = null;
    try { re = new RegExp(p.src, flags); } catch (e) { re = null; }
    return (p.re[flags] = re || false);
  }
  function version(m, tmpl) {
    if (!m || !tmpl) return null;
    let out = tmpl.replace(/\\(\d)/g, (_, i) => m[+i] || "");
    out = out.trim();
    if (!out || out.length > 24 || !/^[\w.+\-~]+$/.test(out)) return null;
    return out;
  }
  const clip = (s, n) => { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > (n || 90) ? s.slice(0, n || 90) + "…" : s; };
  const snippetOf = (str, m) => { if (!m) return ""; const i = m.index || 0; const s = Math.max(0, i - 12); return clip(str.slice(s, i + m[0].length + 24), 100); };

  // Collect the unique window paths and DOM queries the rule set needs, so the collectors only run what is required.
  function buildQueries(db) {
    const paths = new Set(), dom = new Map();
    for (const t of db) {
      if (t.js) for (const k of Object.keys(t.js)) paths.add(k);
      if (t.extract) for (const spec of Object.values(t.extract)) { const m = String(spec).match(/^js:([^#]+)/); if (m) paths.add(m[1]); }
      if (t.dom) for (const k of Object.keys(t.dom)) {
        const at = k.lastIndexOf("@");
        const ends = k.endsWith("]") ? -1 : at;
        const sel = ends > 0 ? k.slice(0, ends) : k;
        const attr = ends > 0 ? k.slice(ends + 1) : null;
        dom.set(k, { key: k, sel, attr });
      }
    }
    // dom rules of the form "[attr]@attr" are handled above (sel may itself end with ']' followed by @attr)
    for (const t of db) if (t.dom) for (const k of Object.keys(t.dom)) {
      const at = k.lastIndexOf("@");
      if (at > 0) dom.set(k, { key: k, sel: k.slice(0, at), attr: k.slice(at + 1) });
    }
    return { paths: Array.from(paths), domQueries: Array.from(dom.values()) };
  }

  // Normalise every fact source into strings/maps the rules can test.
  function prepare(facts) {
    const P = facts.page || {}, M = facts.main || {}, N = facts.net || {}, D = facts.deep || {};
    const S = {};
    S.url = facts.url || P.url || "";
    S.html = P.html || "";
    const bodies = D.bodies || [];
    S.css = (P.css || "") + "\n" + bodies.filter((b) => /\.css(\?|$)/i.test(b.url)).map((b) => b.text).join("\n");
    S.bodies = bodies;
    S.sourceMaps = (D.sourceMaps || []).map((m) => m.text || "").filter(Boolean).join("\n");
    S.sourceMapRecords = D.sourceMaps || [];
    S.sourceNameRecords = (D.sourceNames || []).map((m) => ({ url: m.bundleUrl || m.url || "", text: (m.names || []).join("\n") })).filter((m) => m.text);
    const linkScripts = (P.links || []).filter((l) => /modulepreload|preload/.test(l.rel) && (l.as === "script" || /modulepreload/.test(l.rel))).map((l) => l.href);
    S.scripts = (P.scriptSrcs || []).concat(linkScripts).join("\n");
    S.styles = (P.styleHrefs || []).join("\n");
    S.links = (P.links || []).map((l) => l.href).filter(Boolean).join("\n");
    const reqSet = new Set();
    (N.requests || []).forEach((r) => reqSet.add(r.u));
    (P.resourceUrls || []).forEach((u) => reqSet.add(u));
    (P.scriptSrcs || []).forEach((u) => reqSet.add(u));
    S.requests = Array.from(reqSet).join("\n");
    S.classes = (P.classes || []).join("\n");
    S.attrs = (P.attrNames || []).join("\n");
    S.tags = (P.tags || []).join("\n");
    S.globals = (M.globals || []).join("\n");
    S.storage = [].concat(P.localStorageKeys || [], P.sessionStorageKeys || [], P.indexedDbNames || [], P.cacheNames || []).join("\n");
    S.sw = (P.serviceWorkers || []).map((s) => s.script).filter(Boolean).join("\n");
    S.iframes = (P.iframes || []).map((f) => f.src).filter(Boolean).join("\n");
    S.serverTiming = ((P.perf && P.perf.nav && P.perf.nav.serverTiming) || []).map((s) => s.name).join("\n");
    S.body = bodies.map((b) => b.text).join("\n");
    const protos = new Set();
    if (P.perf && P.perf.nav && P.perf.nav.protocol) protos.add(P.perf.nav.protocol);
    S.proto = Array.from(protos).join("\n");
    S.robots = (D.files && D.files.robots) || "";
    S.humans = (D.files && D.files.humans) || "";
    S.headers = N.headers || {};
    S.meta = P.meta || {};
    S.js = M.js || {};
    S.dom = P.dom || {};
    S.stats = Object.assign({}, P.classStats || {}, { shadowRoots: P.shadowRoots || 0 });
    S.cookieMap = {};
    (facts.cookies || []).forEach((c) => { S.cookieMap[c.name] = c.value == null ? "" : c.value; });
    (P.documentCookies || []).forEach((n) => { if (!(n in S.cookieMap)) S.cookieMap[n] = ""; });
    return S;
  }

  // Evidence-first scoring. A detector should become stronger when independent signals agree,
  // but repeated matches from the same signal family must have diminishing returns.
  function scoreEvidence(evidence) {
    const groups = new Map();
    for (const e of evidence) {
      const family = e.type || "unknown";
      const arr = groups.get(family) || [];
      arr.push(Math.max(0, Math.min(100, e.rawConfidence == null ? 0 : e.rawConfidence)));
      groups.set(family, arr);
    }
    const familyScores = [];
    for (const arr of groups.values()) {
      arr.sort((a, b) => b - a);
      // First hit carries the detector's advertised strength. Additional hits from the
      // same family are corroboration, not independent proof.
      let s = arr[0] || 0;
      for (let i = 1; i < arr.length; i++) s += arr[i] * Math.pow(0.28, i);
      familyScores.push(Math.min(100, s));
    }
    // Independent families combine like probabilities: two different fingerprints
    // should reinforce one another, while never exceeding 100.
    let score = 0;
    for (const s of familyScores) score = 100 - (100 - score) * (1 - s / 100);
    return Math.round(Math.min(100, score));
  }

  function evalTech(t, S) {
    const ev = [];
    let ver = null;
    const add = (type, label, snip, c, v, source) => {
      if (!(c > 0)) return;
      ev.push({ type, label, snippet: clip(snip), rawConfidence: Math.min(100, c), source: source || "" });
      if (v && !ver) ver = v;
    };

    // Single-string sources. The rule's c is a signal strength, not a percentage
    // that should simply be added to other matches.
    for (const key of Object.keys(RULE_ARRAYS)) {
      const list = t[key];
      if (!list) continue;
      const flags = MULTILINE.has(key) ? "im" : "i";
      for (const raw of list) {
        const p = parsePattern(raw);
        const re = regexFor(p, flags);
        if (!re) continue;
        if (key === "body" || key === "sourceMaps" || key === "sourceNames") {
          const records = key === "body" ? S.bodies : key === "sourceMaps" ? S.sourceMapRecords : S.sourceNameRecords;
          for (const b of records) {
            const m = String(b.text || "").match(re);
            if (m) {
              const label = key === "sourceMaps" ? ((b.url || "").split("/").pop().split("?")[0].slice(-48) || "source map") : key === "sourceNames" ? ((b.url || "").split("/").pop().split("?")[0].slice(-48) || "source names") : ((b.url || "").split("/").pop().split("?")[0].slice(-48) || "bundle");
              add(key, label, snippetOf(b.text, m), p.c, version(m, p.v), b.url || "");
              // One rule matching several bundles is corroboration. Keep collecting so
              // the scorer can see independent files, but avoid flooding the UI.
              if (ev.length > 20) break;
            }
          }
          continue;
        }
        const str = S[key] || "";
        if (!str) continue;
        const m = str.match(re);
        if (m) add(key, EVIDENCE_LABEL[key], snippetOf(str, m), p.c, version(m, p.v));
      }
    }

    if (t.headers) for (const [name, raw] of Object.entries(t.headers)) {
      const v = S.headers[name.toLowerCase()];
      if (v === undefined) continue;
      const p = parsePattern(raw);
      if (p.src === "") { add("header", name, name + ": " + v, p.c); continue; }
      const re = regexFor(p, "i"); if (!re) continue;
      const m = String(v).match(re);
      if (m) add("header", name, name + ": " + v, p.c, version(m, p.v));
    }
    if (t.meta) for (const [name, raw] of Object.entries(t.meta)) {
      const v = S.meta[name.toLowerCase()];
      if (v === undefined) continue;
      const p = parsePattern(raw);
      if (p.src === "") { add("meta", name, name + " = " + v, p.c); continue; }
      const re = regexFor(p, "i"); if (!re) continue;
      const m = String(v).match(re);
      if (m) add("meta", name, name + " = " + v, p.c, version(m, p.v));
    }
    if (t.cookies) for (const [name, raw] of Object.entries(t.cookies)) {
      const p = parsePattern(raw);
      if (!(p.c > 0)) continue;
      const kre = regexFor(parsePattern("^(?:" + name + ")$"), "i"); if (!kre) continue;
      const hit = Object.keys(S.cookieMap).find((n) => kre.test(n));
      if (!hit) continue;
      if (p.src === "") { add("cookie", hit, "cookie " + hit, p.c); continue; }
      const re = regexFor(p, "i"); const m = re && String(S.cookieMap[hit]).match(re);
      if (m) add("cookie", hit, "cookie " + hit, p.c, version(m, p.v));
    }
    if (t.js) for (const [path, raw] of Object.entries(t.js)) {
      const v = S.js[path];
      if (v === undefined) continue;
      const p = parsePattern(raw);
      if (p.src === "") { add(path.startsWith("probe:") ? "probe" : "js", path.replace(/^probe:/, ""), "window." + path + (typeof v === "string" ? " = " + v : ""), p.c); continue; }
      if (typeof v !== "string") continue;
      const re = regexFor(p, "i"); const m = re && v.match(re);
      if (m) add(path.startsWith("probe:") ? "probe" : "js", path.replace(/^probe:/, ""), "window." + path + " = " + v, p.c, version(m, p.v));
    }
    if (t.dom) for (const [key, raw] of Object.entries(t.dom)) {
      const r = S.dom[key]; if (!r) continue;
      const p = parsePattern(raw);
      const at = key.lastIndexOf("@");
      if (at > 0 && r.a && r.a.length) {
        if (p.src === "") { add("dom", key, key + " = " + r.a[0], p.c); continue; }
        const re = regexFor(p, "i");
        for (const a of r.a) { const m = re && a.match(re); if (m) { add("dom", key, key + " = " + a, p.c, version(m, p.v)); break; } }
      } else add("dom", key, key + " (×" + r.n + ")", p.c);
    }
    if (t.stats) for (const [k, min] of Object.entries(t.stats)) {
      const n = S.stats[k] || 0;
      if (n >= min) add("stats", k, n + " matching class names", k === "shadowRoots" ? 100 : 60);
    }
    const confidence = scoreEvidence(ev);
    const families = new Set(ev.map((e) => e.type));
    const strongest = ev.reduce((m, e) => Math.max(m, e.rawConfidence || 0), 0);
    // A detection must contain real package/platform evidence. One weak DOM/class clue
    // is never enough. Exact fingerprints (70+) may stand alone; weaker fingerprints
    // need corroboration from at least two independent signal families.
    const detected = strongest >= 70 || (families.size >= 2 && confidence >= 55 && strongest >= 30);
    return { ev, conf: confidence, version: ver, detected, families: families.size };
  }

  function extractDetails(t, S) {
    if (!t.extract) return [];
    const byLabel = {};
    for (const [rawLabel, spec] of Object.entries(t.extract)) {
      const label = rawLabel.split("|")[0];
      const parts = String(spec).split("##");
      const opts = parsePattern(String(spec));
      const body = parts[0];
      const ci = body.indexOf(":");
      const source = body.slice(0, ci);
      let rest = body.slice(ci + 1);
      let values = [];
      const grab = (str, reSrc) => {
        if (str === undefined || str === null) return;
        str = String(str);
        if (!reSrc) { if (str) values.push(clip(opts.t || str, 80)); return; }
        let re; try { re = new RegExp(reSrc, opts.all ? "gi" : "i"); } catch (e) { return; }
        if (opts.all) { for (const m of str.matchAll(re)) { values.push(clip(opts.t || (m[1] !== undefined ? m[1] : m[0]), 80)); if (values.length >= 12) break; } }
        else { const m = str.match(re); if (m) values.push(clip(opts.t || (m[1] !== undefined ? m[1] : m[0]), 80)); }
      };
      if (source === "js") { const v = S.js[rest]; if (v !== undefined) values.push(clip(opts.t || (v === true ? "yes" : v), 80)); }
      else if (source === "header" || source === "meta") {
        const j = rest.indexOf(":"); const name = (j > 0 ? rest.slice(0, j) : rest).toLowerCase(); const reSrc = j > 0 ? rest.slice(j + 1) : "";
        grab((source === "header" ? S.headers : S.meta)[name], reSrc);
      } else if (S[source] !== undefined) grab(S[source], rest.replace(/##.*$/, ""));
      values = Array.from(new Set(values));
      if (values.length) { const cur = byLabel[label] || (byLabel[label] = []); values.forEach((v) => { if (!cur.includes(v)) cur.push(v); }); }
    }
    return Object.keys(byLabel).map((label) => ({ label, values: byLabel[label].slice(0, 12) }));
  }

  function detect(facts, db, cats) {
    const S = prepare(facts);
    const found = new Map();
    for (const t of db) {
      const r = evalTech(t, S);
      if (r.detected) found.set(t.name, { tech: t, conf: r.conf, ev: r.ev, version: r.version, families: r.families });
    }
    // Deliberately do NOT infer dependencies. Every technology shown in StackSpy must
    // have its own evidence on the inspected page. A plugin may suggest another stack
    // to a human, but that suggestion is not itself a detection.
    for (const f of Array.from(found.values())) for (const ex of f.tech.excludes || []) if (found.has(ex)) found.delete(ex);

    const out = [];
    for (const f of found.values()) {
      const t = f.tech, cat = (cats || {})[t.cat] || {};
      out.push({
        name: t.name, category: t.cat, layer: cat.layer || "platform", website: t.website, description: t.d || "", tip: t.tip || "",
        version: f.version, confidence: f.conf, evidence: f.ev.slice(0, 8), evidenceFamilies: f.families || new Set(f.ev.map((e) => e.type)).size, evidenceQuality: f.conf >= 85 ? "strong" : f.conf >= 65 ? "good" : "corroborated", details: extractDetails(t, S)
      });
    }
    out.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));
    return out;
  }

  g.Engine = { detect, buildQueries, prepare, parsePattern, scoreEvidence };
  if (typeof module !== "undefined") module.exports = g.Engine;
})(typeof self !== "undefined" ? self : globalThis);
