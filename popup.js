// JoErl StackSpy — popup UI. All page-derived strings are inserted via textContent (never innerHTML).
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const NS = "http://www.w3.org/2000/svg";

  const params = new URLSearchParams(location.search);
  const state = { tab: "stack", result: null, tabId: null, tabUrl: "", settings: { auto: true, theme: "auto" }, saved: {}, scanning: false };
  if (params.get("full")) document.body.classList.add("full");

  // ───────────── tiny DOM helper ─────────────
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    return el;
  }
  function svg(paths, opts) {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", (opts && opts.vb) || "0 0 24 24");
    for (const d of paths) { const p = document.createElementNS(NS, "path"); p.setAttribute("d", d); if (opts && opts.fill) p.setAttribute("fill", opts.fill); s.append(p); }
    return s;
  }
  const ICO = {
    star: ["M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8L3.5 9.7l5.9-.9z"],
    refresh: ["M20 11a8 8 0 1 0-2.3 5.7", "M20 4v7h-7"],
    sun: ["M12 4V2m0 20v-2m8-8h2M2 12h2m13.7-5.7l1.4-1.4M4.9 19.1l1.4-1.4m0-11.4L4.9 4.9m14.2 14.2l-1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"],
    moon: ["M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"],
    auto: ["M12 3a9 9 0 1 0 0 18V3z"],
    dots: ["M5 12h.01M12 12h.01M19 12h.01"],
    chev: ["M6 9l6 6 6-6"]
  };
  const ic = (name) => svg(ICO[name]);

  // ───────────── brand tiles ─────────────
  function lum(hex) { const n = parseInt(hex, 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
  function tile(name, big) {
    const cls = "ic" + (big ? " lg" : "");
    const icon = (self.ICONS || {})[name];
    if (icon) {
      const color = lum(icon[0]) > 0.82 ? "#1B2A3D" : "#" + icon[0];
      const s = svg([icon[1]], { fill: color });
      return h("span", { class: cls, "aria-hidden": "true" }, s);
    }
    let hash = 0; for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
    const words = name.replace(/[^A-Za-z0-9 .]/g, "").split(/[ .]+/).filter(Boolean);
    const txt = (words.length > 1 ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
    const t = h("span", { class: cls + " mono", "aria-hidden": "true", text: txt });
    t.style.background = "hsl(" + (hash % 360) + " 48% 42%)";
    return t;
  }
  const layerVar = (id) => "var(--l-" + id + ")";
  const layerOf = (t) => t.layer || "platform";

  // ───────────── helpers ─────────────
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 1800); }
  const fmtBytes = (n) => (n == null ? "–" : n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(0) + " KB" : (n / 1048576).toFixed(1) + " MB");
  const fmtMs = (n) => (n == null ? "–" : n >= 1000 ? (n / 1000).toFixed(1) + " s" : Math.round(n) + " ms");
  // Direct fingerprints always outrank inferred dependencies. Inference remains useful,
  // but it must never look like direct proof in the UI.
  const confLabel = (t) => t.inferred ? "Inferred" : (t.confidence >= 85 ? "Strong evidence" : t.confidence >= 65 ? "Good evidence" : "Corroborated evidence");
  const techSort = (a, b) => (Number(!!a.inferred) - Number(!!b.inferred)) || (b.confidence - a.confidence) || a.name.localeCompare(b.name);
  const send = (msg) => new Promise((res) => { try { chrome.runtime.sendMessage(msg, (r) => res(chrome.runtime.lastError ? null : r)); } catch (e) { res(null); } });
  const layerMeta = (id) => (self.LAYERS || []).find((l) => l.id === id) || { name: id, hint: "" };

  // ───────────── settings, theme, saved ─────────────
  async function loadStore() {
    const s = await chrome.storage.local.get(["settings", "saved"]);
    Object.assign(state.settings, s.settings || {});
    state.saved = s.saved || {};
    applyTheme();
    $("#opt-auto").checked = state.settings.auto !== false;
  }
  const persistSettings = () => chrome.storage.local.set({ settings: state.settings });
  function applyTheme() {
    document.documentElement.dataset.theme = state.settings.theme || "auto";
    const btn = $("#btn-theme"); btn.replaceChildren(ic(state.settings.theme === "light" ? "sun" : state.settings.theme === "dark" ? "moon" : "auto"));
    btn.title = "Theme: " + (state.settings.theme || "auto");
  }
  function updateSaveBtn() {
    const b = $("#btn-save"); const host = state.result && state.result.host;
    const on = !!(host && state.saved[host]);
    b.classList.toggle("on", on); b.replaceChildren(ic("star")); b.title = on ? "Remove from collection" : "Save this site to your collection";
  }

  // ───────────── site header ─────────────
  function renderSite() {
    const r = state.result, box = $("#site"); box.replaceChildren();
    if (!r || !r.host) { box.append(h("div", { class: "host" }, h("h1", { text: "Ready to inspect" }))); return; }
    const o = r.overview || {};
    box.append(
      h("div", { class: "host" }, h("h1", { text: r.host }), o.https === false ? h("span", { class: "chip bad" }, h("span", { class: "dot" }), "HTTP") : null),
      h("div", { class: "ttl", text: o.title || r.url }),
      h("div", { class: "chips" },
        o.https ? h("span", { class: "chip" }, h("span", { class: "dot" }), "HTTPS") : null,
        o.protocol ? h("span", { class: "chip" }, h("b", { text: o.protocol === "h3" ? "HTTP/3" : o.protocol === "h2" ? "HTTP/2" : o.protocol })) : null,
        o.status ? h("span", { class: "chip" }, "status ", h("b", { text: o.status })) : null,
        o.ttfb != null ? h("span", { class: "chip" }, "TTFB ", h("b", { text: fmtMs(o.ttfb) })) : null,
        o.weight ? h("span", { class: "chip" }, h("b", { text: fmtBytes(o.weight) }), " · " + o.requests + " req") : null,
        o.ip ? h("span", { class: "chip", title: "Server IP" }, h("b", { text: o.ip })) : null
      )
    );
  }

  // ───────────── Stack tab ─────────────
  function openTech(name) {
    const card = document.querySelector('.card[data-name="' + CSS.escape(name) + '"]');
    if (!card) return;
    $("#q").value = ""; applyFilter();
    card.classList.add("open"); card.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function techCard(t) {
    const lc = layerVar(layerOf(t));
    const cat = (self.CATS || {})[t.category] || {};
    const filled = t.confidence >= 85 ? 3 : t.confidence >= 65 ? 2 : 1;
    const card = h("div", { class: "card" + (t.inferred ? " inferred" : ""), "data-name": t.name, "data-search": (t.name + " " + t.category + " " + (t.version || "") + " " + t.description + " " + (t.inferred ? "inferred implied" : "direct")).toLowerCase() });
    card.style.setProperty("--lc", lc);
    const row = h("button", { class: "row", "aria-expanded": "false", onclick: () => { const o = card.classList.toggle("open"); row.setAttribute("aria-expanded", o); } },
      tile(t.name, true),
      h("div", { class: "grow" }, h("div", { class: "nm" }, t.name, t.version ? h("span", { class: "ver", text: "v" + t.version }) : null, t.inferred ? h("span", { class: "inferred-pill", text: "INFERRED" }) : null), h("div", { class: "sub", text: t.category + (t.inferred ? " · implied by " + ((t.evidence && t.evidence[0] && t.evidence[0].source) || "another detected technology") : " · directly detected") })),
      h("div", { class: "conf" }, h("span", { class: "lbl", text: confLabel(t) }), h("span", { class: "meter" }, [1, 2, 3].map((i) => h("i", { class: i <= filled ? "f" : "" })))),
      (() => { const s = ic("chev"); s.classList.add("chev"); return s; })()
    );
    const body = h("div", { class: "body" });
    body.append(h("p", { text: t.description || "No description yet." }));
    body.append(h("div", { class: "why" + (t.inferred ? " inferred-why" : "") }, h("b", { text: t.inferred ? "Inference · " : "Evidence · " }), t.inferred ? ("inferred from " + ((t.evidence && t.evidence[0] && t.evidence[0].source) || "another detected technology") + " · " + String(t.confidence || 0) + " inference score") : (String(t.confidence || 0) + " score · " + String(t.evidenceFamilies || 0) + " signal type" + ((t.evidenceFamilies || 0) === 1 ? "" : "s") + " · " + (t.evidenceQuality || "unknown"))));
    if (cat.why) body.append(h("div", { class: "why" }, h("b", { text: t.category + " · " }), cat.why));
    if (t.details && t.details.length) {
      body.append(h("div", { class: "kicker", text: "Extracted details" }));
      const d = h("div", { class: "det" });
      t.details.forEach((x) => d.append(h("span", { class: "k", text: x.label }), h("span", { class: "vs" }, x.values.map((v) => h("code", { text: v })))));
      body.append(d);
    }
    if (t.evidence && t.evidence.length) {
      body.append(h("div", { class: "kicker", text: "How it was spotted" }));
      const ev = h("div", { class: "ev" });
      t.evidence.forEach((e) => ev.append(h("span", { class: "t", text: e.label ? e.type + ": " + e.label : e.type }), h("code", { text: e.snippet })));
      body.append(ev);
    }
    if (t.tip) body.append(h("div", { class: "tip" }, h("b", { text: "Try it · " }), t.tip));
    body.append(h("div", { class: "links" }, t.website ? h("a", { href: t.website, target: "_blank", rel: "noopener" }, "Website ↗") : null, h("a", { href: "https://www.google.com/search?q=" + encodeURIComponent(t.name + " " + "how it works"), target: "_blank", rel: "noopener" }, "Learn more ↗")));
    card.append(row, body);
    return card;
  }

  function renderStack(view) {
    const r = state.result;
    const techs = (r.techs || []).slice().sort(techSort);
    if (!techs.length) { view.append(h("div", { class: "empty" }, h("h2", { text: "Nothing fingerprinted yet" }), h("p", { text: "This page looks custom or heavily minimised. Check the Insights and Inside tabs for finer clues." }))); return; }
    if (r.summary) view.append(h("p", { class: "lead", text: r.summary }));

    // 1) Every technology — direct detections first, inferred dependencies second.
    view.append(h("div", { class: "h" }, "Every technology", h("small", { text: "direct detections first · tap to learn" })));
    for (const L of self.LAYERS) {
      const cats = {};
      techs.filter((t) => layerOf(t) === L.id).forEach((t) => (cats[t.category] = cats[t.category] || []).push(t));
      for (const c of Object.keys(cats)) {
        const g = h("div", { class: "group", "data-group": "1" });
        g.style.setProperty("--lc", layerVar(L.id));
        g.append(h("div", { class: "gname" }, h("i"), c, h("small", { text: (self.CATS[c] || {}).blurb || "" })));
        cats[c].sort(techSort).forEach((t) => g.append(techCard(t)));
        view.append(g);
      }
    }

    // 2) Stack cross-section — preserve the architectural layer view, but put direct
    // fingerprints ahead of inferred dependencies inside every layer.
    const map = h("div", { class: "stackmap" });
    for (const L of self.LAYERS) {
      const list = techs.filter((t) => layerOf(t) === L.id).sort(techSort);
      if (!list.length) continue;
      const band = h("div", { class: "band", "data-search": list.map((t) => t.name.toLowerCase()).join(" ") });
      band.style.setProperty("--lc", layerVar(L.id));
      band.append(h("div", null, h("div", { class: "lname" }, L.name), h("div", { class: "lhint" }, L.hint)));
      const items = h("div", { class: "items" });
      list.forEach((t) => items.append(h("button", { class: "tchip" + (t.inferred ? " inferred" : ""), title: t.inferred ? "Inferred from " + ((t.evidence && t.evidence[0] && t.evidence[0].source) || "another detected technology") : "Directly detected", onclick: () => openTech(t.name) }, tile(t.name), t.name, t.version ? h("span", { class: "v", text: t.version }) : null, t.inferred ? h("span", { class: "v inferred-v", text: "inferred" }) : null)));
      band.append(items);
      map.append(band);
    }
    view.append(h("div", { class: "h" }, "Stack cross-section", h("small", { text: techs.length + " technologies" })), map);

    // 3) Worth studying — kept last so the evidence inventory remains the primary view.
    if (r.highlights && r.highlights.length) {
      view.append(h("div", { class: "h", text: "Worth studying" }));
      const hl = h("div", { class: "hl" });
      r.highlights.forEach((x) => hl.append(h("div", { "data-search": (x.title + " " + x.text).toLowerCase() }, h("b", { text: x.title }), h("span", { text: x.text }))));
      view.append(hl);
    }
  }

  // ───────────── section based tabs ─────────────
  function sectionBody(s) {
    const body = h("div", { class: "sb" });
    if (s.note) body.append(h("div", { class: "snote", text: s.note }));
    if (s.kind === "metrics") {
      s.items.forEach((m) => {
        const el = h("div", { class: "m " + m.status + (m.note ? " has" : ""), "data-search": (m.label + " " + m.value + " " + m.note).toLowerCase(), onclick: m.note ? () => el.classList.toggle("open") : null },
          h("span", { class: "sd" }), h("span", { text: m.label }), h("span", { class: "v", text: m.value }), m.note ? h("div", { class: "note", text: m.note }) : null);
        body.append(el);
      });
    } else if (s.kind === "kv") {
      if (!s.items.length) body.append(h("div", { class: "snote", text: "Nothing found." }));
      s.items.forEach((x) => {
        const el = h("div", { class: "kv" + (x.note ? " has" : ""), "data-search": (x.k + " " + x.v + " " + x.tag + " " + x.note).toLowerCase(), onclick: x.note ? () => el.classList.toggle("open") : null },
          h("span", { class: "k" + (x.mono ? " mono" : ""), text: x.k }), h("span", { class: "val" + (x.mono && x.v.length < 60 ? " mono" : "") }, x.v, x.tag ? h("span", { class: "pill", text: x.tag }) : null), x.note ? h("div", { class: "note", text: x.note }) : null);
        body.append(el);
      });
    } else if (s.kind === "chips") {
      if (!s.items.length) body.append(h("div", { class: "snote", text: "None detected." }));
      const wrap = h("div", { class: "cw" }); const note = h("div", { class: "cnote", hidden: true });
      s.items.forEach((c) => {
        const has = !!(c.note || c.href);
        wrap.append(h("span", { class: "cp" + (has ? " has" : ""), "data-search": (c.text + " " + (c.note || "")).toLowerCase(), onclick: has ? () => { note.hidden = false; note.replaceChildren(c.note || "", c.href ? h("span", null, " ", h("a", { href: c.href, target: "_blank", rel: "noopener", text: "MDN ↗" })) : ""); } : null, text: c.text }));
      });
      wrap.append(note); body.append(wrap);
    }
    return body;
  }
  function renderSections(view, sections, openFirst) {
    sections.forEach((s, i) => {
      const sec = h("section", { class: "sec" + (openFirst && i === 0 ? " open" : ""), "data-id": s.id });
      const head = h("button", { class: "sh", "aria-expanded": openFirst && i === 0 ? "true" : "false", onclick: () => { const o = sec.classList.toggle("open"); head.setAttribute("aria-expanded", o); } },
        h("span", { class: "st", text: s.title }), s.summary ? h("span", { class: "sm", text: s.summary }) : null, (() => { const c = ic("chev"); c.classList.add("chev"); return c; })());
      sec.append(head, sectionBody(s));
      view.append(sec);
    });
  }

  // ───────────── saved tab ─────────────
  function renderSaved(view) {
    const entries = Object.values(state.saved).sort((a, b) => b.ts - a.ts);
    if (!entries.length) { view.append(h("div", { class: "empty" }, h("h2", { text: "Your collection is empty" }), h("p", { text: "Tap the star on any site you want to remember. Later you can search this list by technology — e.g. “Astro” or “container queries”." }))); return; }
    const wrap = h("div", { class: "saved" });
    entries.forEach((e) => {
      const card = h("div", { class: "card open", "data-search": (e.host + " " + e.summary + " " + e.techs.map((t) => t.name).join(" ")).toLowerCase() });
      card.style.setProperty("--lc", "var(--amber)");
      card.append(h("div", { class: "row" }, tile(e.host.replace(/^www\./, ""), true), h("div", { class: "grow" }, h("div", { class: "nm" }, h("a", { href: e.url, target: "_blank", rel: "noopener", text: e.host })), h("div", { class: "sub", text: new Date(e.ts).toLocaleDateString() + " · " + e.techs.length + " technologies" })),
        h("button", { class: "x", title: "Remove", "aria-label": "Remove " + e.host, onclick: async () => { delete state.saved[e.host]; await chrome.storage.local.set({ saved: state.saved }); updateSaveBtn(); render(); } }, "✕")),
        h("div", { class: "body", style: "display:block;padding-top:0" }, e.summary ? h("p", { class: "sub", text: e.summary }) : null, h("div", { class: "chips" }, e.techs.slice(0, 24).map((t) => h("span", { class: "chip" }, t.name, t.version ? " " + t.version : "")))));
      wrap.append(card);
    });
    view.append(wrap);
  }

  // ───────────── render / filter ─────────────
  function applyFilter() {
    const q = $("#q").value.trim().toLowerCase();
    const view = $("#view");
    view.querySelectorAll("[data-search]").forEach((el) => { el.hidden = !!q && !el.dataset.search.includes(q); });
    view.querySelectorAll(".sec").forEach((sec) => {
      const any = !q || !!sec.querySelector("[data-search]:not([hidden])") || sec.querySelector(".st").textContent.toLowerCase().includes(q);
      sec.hidden = !any; if (q && any) sec.classList.add("open");
    });
    view.querySelectorAll("[data-group]").forEach((g) => { g.hidden = !!q && !g.querySelector(".card:not([hidden])"); });
  }

  function render() {
    const view = $("#view"); view.replaceChildren();
    $("#tabs").querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.tab === state.tab));
    const r = state.result;
    if (state.tab === "saved") renderSaved(view);
    else if (!r) { for (let i = 0; i < 5; i++) view.append(h("div", { class: "skel" })); }
    else if (r.unsupported) view.append(h("div", { class: "empty" }, h("h2", { text: "Open a website to inspect it" }), h("p", { text: "StackSpy works on http(s) pages. Browser pages, the Web Store and file URLs can't be scanned." })));
    else if (r.error) view.append(h("div", { class: "empty" }, h("h2", { text: "Couldn't inspect this page" }), h("p", { text: r.error }), h("button", { onclick: () => scan(true), text: "Try again" })));
    else if (state.tab === "stack") renderStack(view);
    else if (state.tab === "insights") renderSections(view, r.tabs.insights, true);
    else if (state.tab === "network") renderSections(view, r.tabs.network, true);
    else if (state.tab === "inside") renderSections(view, r.tabs.hood, false);
    applyFilter();
    const n = r && r.techs ? r.techs.length : 0;
    const tb = $('[data-tab="stack"]'); tb.replaceChildren("Stack", n ? h("span", { class: "n", text: n }) : "");
    const sv = $('[data-tab="saved"]'); const sc = Object.keys(state.saved).length; sv.replaceChildren("Saved", sc ? h("span", { class: "n", text: sc }) : "");
    renderFoot();
  }
  function renderFoot() {
    const r = state.result, f = $("#foot"); f.replaceChildren();
    if (!r || !r.techs) { f.append(h("span", { text: "JoErl StackSpy v" + chrome.runtime.getManifest().version })); return; }
    f.append(h("span", { text: state.scanning ? "Deep scan running…" : r.deep ? "Deep scan complete — bundles & files inspected" : "Passive scan" }), h("span", { text: r.techs.length + " technologies · " + new Date(r.scannedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }));
  }

  // ───────────── scanning ─────────────
  async function scan(deep) {
    if (state.scanning) return;
    state.scanning = true; $("#progress").hidden = false; $("#btn-rescan").classList.add("spin"); renderFoot();
    const r = await send({ type: "SCAN", tabId: state.tabId, deep: !!deep });
    state.scanning = false; $("#progress").hidden = true; $("#btn-rescan").classList.remove("spin");
    if (r) { state.result = r; renderSite(); render(); updateSaveBtn(); }
  }

  // ───────────── exports ─────────────
  function toMarkdown(r) {
    const L = [];
    L.push("# " + r.host + " — StackSpy report", "", r.summary || "", "", "_" + r.url + " · scanned " + new Date(r.scannedAt).toLocaleString() + "_", "");
    for (const layer of self.LAYERS) {
      const list = r.techs.filter((t) => layerOf(t) === layer.id); if (!list.length) continue;
      L.push("## " + layer.name, "");
      list.slice().sort(techSort).forEach((t) => { L.push("- **" + t.name + "**" + (t.version ? " " + t.version : "") + " — " + t.category + (t.inferred ? (" · INFERRED from " + (t.inferredFrom || "another detected technology")) : (" · " + t.confidence + " evidence score"))); if (t.description) L.push("  - " + t.description); (t.details || []).forEach((d) => L.push("  - " + d.label + ": " + d.values.join(", "))); });
      L.push("");
    }
    if (r.highlights && r.highlights.length) { L.push("## Worth studying", ""); r.highlights.forEach((x) => L.push("- **" + x.title + "** — " + x.text)); L.push(""); }
    for (const s of r.tabs.insights.slice(0, 4)) { L.push("## " + s.title, ""); s.items.forEach((m) => L.push("- " + m.label + ": " + m.value + " (" + m.status + ")")); L.push(""); }
    return L.join("\n");
  }
  async function copy(text, msg) { try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { toast("Copy failed"); } }

  // ───────────── saved sites import/export ─────────────
  function exportSaved() {
    const entries = Object.values(state.saved).sort((a, b) => b.ts - a.ts);
    if (!entries.length) { toast("No saved sites to export"); return; }
    const payload = { type: "stackspy-saved-sites", version: 1, exportedAt: Date.now(), sites: entries };
    const a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })), download: "stackspy-saved-sites.json" });
    a.click();
    toast("Exported " + entries.length + " site" + (entries.length === 1 ? "" : "s"));
  }
  function sanitizeSavedEntry(entry) {
    if (!entry || typeof entry.host !== "string" || !entry.host) return null;
    return {
      host: entry.host,
      url: typeof entry.url === "string" && entry.url ? entry.url : "https://" + entry.host,
      ts: typeof entry.ts === "number" && isFinite(entry.ts) ? entry.ts : Date.now(),
      summary: typeof entry.summary === "string" ? entry.summary : "",
      techs: Array.isArray(entry.techs) ? entry.techs.filter((t) => t && typeof t.name === "string").map((t) => ({ name: t.name, category: typeof t.category === "string" ? t.category : "", version: typeof t.version === "string" ? t.version : null })) : []
    };
  }
  async function importSavedFile(file) {
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { toast("Import failed — not valid JSON"); return; }
    const list = Array.isArray(data) ? data : Array.isArray(data && data.sites) ? data.sites : null;
    if (!list) { toast("Import failed — unrecognized file"); return; }
    let added = 0, updated = 0;
    for (const raw of list) {
      const clean = sanitizeSavedEntry(raw); if (!clean) continue;
      if (state.saved[clean.host]) updated++; else added++;
      state.saved[clean.host] = clean;
    }
    if (!added && !updated) { toast("No valid entries found"); return; }
    await chrome.storage.local.set({ saved: state.saved });
    updateSaveBtn(); render();
    toast("Imported " + added + " new, updated " + updated);
  }

  // ───────────── init ─────────────
  async function init() {
    $("#btn-rescan").replaceChildren(ic("refresh"));
    $("#btn-menu").replaceChildren(ic("dots"));
    await loadStore();
    const active = params.get("tabId") ? await chrome.tabs.get(+params.get("tabId")) : (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
    if (!active) return;
    state.tabId = active.id; state.tabUrl = active.url || "";
    const cached = await send({ type: "GET_RESULT", tabId: state.tabId });
    if (cached && cached.techs) { state.result = cached; renderSite(); }
    updateSaveBtn(); render();
    scan(true);
  }

  $("#tabs").addEventListener("click", (e) => { const b = e.target.closest("button[data-tab]"); if (!b) return; state.tab = b.dataset.tab; $("#q").value = ""; render(); $("#view").scrollTop = 0; });
  $("#q").addEventListener("input", applyFilter);
  $("#btn-rescan").addEventListener("click", () => scan(true));
  $("#btn-theme").addEventListener("click", () => { const order = ["auto", "light", "dark"]; state.settings.theme = order[(order.indexOf(state.settings.theme || "auto") + 1) % 3]; applyTheme(); persistSettings(); });
  $("#btn-menu").addEventListener("click", (e) => { e.stopPropagation(); $("#menu").hidden = !$("#menu").hidden; });
  document.addEventListener("click", (e) => { if (!e.target.closest("#menu")) $("#menu").hidden = true; });
  $("#opt-auto").addEventListener("change", (e) => { state.settings.auto = e.target.checked; persistSettings(); });
  $("#btn-save").addEventListener("click", async () => {
    const r = state.result; if (!r || !r.techs) return;
    if (state.saved[r.host]) { delete state.saved[r.host]; toast("Removed from collection"); }
    else { state.saved[r.host] = { host: r.host, url: r.url, ts: Date.now(), summary: r.summary, techs: r.techs.map((t) => ({ name: t.name, category: t.category, version: t.version })) }; toast("Saved to collection"); }
    await chrome.storage.local.set({ saved: state.saved }); updateSaveBtn(); render();
  });
  $("#menu").addEventListener("click", async (e) => {
    const act = e.target.dataset && e.target.dataset.act; if (!act) return;
    if (act === "export-saved") { $("#menu").hidden = true; exportSaved(); return; }
    if (act === "import-saved") { $("#menu").hidden = true; $("#import-file").click(); return; }
    if (!state.result || !state.result.techs) return;
    $("#menu").hidden = true; const r = state.result;
    if (act === "md") copy(toMarkdown(r), "Markdown copied");
    if (act === "json") copy(JSON.stringify({ url: r.url, scannedAt: r.scannedAt, techs: r.techs, insights: r.tabs }, null, 2), "JSON copied");
    if (act === "download") { const a = h("a", { href: URL.createObjectURL(new Blob([toMarkdown(r)], { type: "text/markdown" })), download: r.host + "-stackspy.md" }); a.click(); }
    if (act === "full") chrome.tabs.create({ url: chrome.runtime.getURL("popup.html?full=1&tabId=" + state.tabId) });
  });
  $("#import-file").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0]; e.target.value = "";
    if (file) importSavedFile(file);
  });

  // Fail visibly (and helpfully) instead of silently if the popup files are mismatched or stale.
  const required = ["#tabs", "#view", "#site", "#foot", "#q", "#btn-save", "#btn-rescan", "#btn-theme", "#btn-menu", "#menu", "#progress", "#toast", "#opt-auto", "#import-file"];
  const missing = required.filter((s) => !$(s));
  if (missing.length) {
    document.body.textContent = "JoErl StackSpy: popup.html and popup.js don't match (missing " + missing.join(", ") + "). Delete the old extension folder, unzip the new one fresh, and reload the extension.";
    return;
  }
  init().catch((e) => { $("#view").replaceChildren(h("div", { class: "empty" }, h("h2", { text: "Something went wrong" }), h("p", { text: String((e && e.message) || e) }))); });
})();
