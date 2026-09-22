// JoErl StackSpy — turns raw facts + detected technologies into teachable insight sections.
(function (g) {
  const fmtBytes = (n) => { if (n == null || isNaN(n)) return "–"; if (n < 1024) return n + " B"; if (n < 1048576) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + " KB"; return (n / 1048576).toFixed(1) + " MB"; };
  const fmtMs = (n) => (n == null ? "–" : n >= 1000 ? (n / 1000).toFixed(2) + " s" : Math.round(n) + " ms");
  const short = (s, n) => { s = String(s || ""); return s.length > (n || 70) ? s.slice(0, n || 70) + "…" : s; };
  const band = (v, good, poor) => (v == null ? "na" : v <= good ? "good" : v <= poor ? "warn" : "bad");
  const hostOf = (u) => { try { return new URL(u).hostname; } catch (e) { return ""; } };
  const pathOf = (u) => { try { const x = new URL(u); return x.pathname.split("/").pop() || x.hostname; } catch (e) { return u; } };
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");

  function M(label, value, status, note) { return { label, value: String(value), status: status || "info", note: note || "" }; }
  function KV(k, v, note, extra) { return Object.assign({ k, v: String(v == null ? "" : v), note: note || "" }, extra || {}); }

  function parseCacheControl(v) {
    const o = {}; String(v || "").toLowerCase().split(",").forEach((p) => { const [k, val] = p.trim().split("="); if (k) o[k] = val === undefined ? true : val; });
    return o;
  }

  function performance(P, H, techNames) {
    const n = (P.perf && P.perf.nav) || {}, paint = (P.perf && P.perf.paint) || {}, v = (P.perf && P.perf.vitals) || {}, R = (P.perf && P.perf.resources) || {};
    const items = [];
    items.push(M("Time to first byte", fmtMs(n.ttfb), band(n.ttfb, 800, 1800), "TTFB — how long the server (plus network) took to start answering. Under 800 ms is good. High values point at slow backends, missing caching or distant servers."));
    if (paint["first-contentful-paint"] != null) items.push(M("First contentful paint", fmtMs(paint["first-contentful-paint"]), band(paint["first-contentful-paint"], 1800, 3000), "When the first text or image appeared. Feels like 'the page started loading'."));
    if (v.lcp) {
      const el = v.lcp.tag ? "<" + v.lcp.tag + ">" : "element";
      items.push(M("Largest contentful paint", fmtMs(v.lcp.time), band(v.lcp.time, 2500, 4000), "Time until the biggest visible element rendered (" + el + (v.lcp.url ? " " + short(pathOf(v.lcp.url), 40) : "") + "). Good is ≤ 2.5 s. Preload or fetchpriority=high on the LCP image is the usual fix."));
    }
    items.push(M("Layout shift (CLS)", v.cls == null ? "–" : v.cls, band(v.cls, 0.1, 0.25), "How much content jumped around while loading. Reserve space with width/height or aspect-ratio to keep it under 0.1."));
    if (v.longTasks != null) items.push(M("Long main-thread tasks", v.longTasks ? v.longTasks + " (" + fmtMs(v.longTaskTime) + ")" : "none", v.longTasks > 5 ? "warn" : "good", "Tasks over 50 ms block input. Many long tasks usually mean heavy JavaScript."));
    items.push(M("DOM content loaded", fmtMs(n.dcl), band(n.dcl, 2000, 4000), "When HTML parsing and deferred scripts finished."));
    items.push(M("Full load", fmtMs(n.load), band(n.load, 3000, 6000), "When every subresource finished, including images."));
    items.push(M("Page weight", fmtBytes(R.totalTransfer) + " · " + plural(R.count || 0, "request"), band(R.totalTransfer, 1500000, 4000000), "Bytes actually transferred (cached and cross-origin resources without Timing-Allow-Origin may report 0)."));
    const enc = H["content-encoding"];
    items.push(M("Document compression", enc ? enc : n.encoded && n.decoded && n.encoded < n.decoded * 0.9 ? "compressed" : "none detected", enc ? (/br|zstd/.test(enc) ? "good" : "info") : "warn", "Brotli (br) and Zstandard shrink text better than gzip. HTML, CSS and JS should always be compressed."));
    if (n.protocol) items.push(M("HTTP version", n.protocol === "h3" ? "HTTP/3" : n.protocol === "h2" ? "HTTP/2" : n.protocol, n.protocol === "h3" || n.protocol === "h2" ? "good" : "warn", "HTTP/2 multiplexes requests over one connection; HTTP/3 (QUIC) also removes TCP head-of-line blocking."));
    const cc = parseCacheControl(H["cache-control"]);
    if (H["cache-control"]) {
      const kind = cc["no-store"] ? "never stored" : cc["no-cache"] ? "always revalidated" : cc["max-age"] !== undefined ? "fresh for " + fmtMs(+cc["max-age"] * 1000).replace(/ ms$/, " ms") : "custom";
      items.push(M("Document caching", kind, "info", "Cache-Control: " + short(H["cache-control"], 80) + ". HTML is usually revalidated; fingerprinted CSS/JS should be cached for a year with immutable."));
    }
    if (R.blocking && R.blocking.length) items.push(M("Render-blocking resources", R.blocking.length, R.blocking.length > 4 ? "warn" : "info", "CSS and synchronous scripts that delay first paint: " + R.blocking.slice(0, 3).map((b) => pathOf(b.url)).join(", ") + ". Inline critical CSS, defer scripts, or use media attributes."));
    if (R.uncompressed && R.uncompressed.length) items.push(M("Possibly uncompressed assets", R.uncompressed.length, "warn", "Text files served without compression: " + R.uncompressed.slice(0, 3).map((u) => pathOf(u.url)).join(", ")));
    const I = P.images || {};
    if (I.total) items.push(M("Images lazy-loaded", I.lazy + " / " + I.total, I.belowEager > 2 ? "warn" : "info", I.belowEager ? I.belowEager + " below-the-fold images load eagerly. Add loading=lazy to defer them." : "Native lazy loading keeps offscreen images from competing with critical content."));
    if (I.total) items.push(M("Images with width & height", I.sizeAttrs + " / " + I.total, I.total && I.sizeAttrs / I.total < 0.5 ? "warn" : "good", "Explicit dimensions let the browser reserve space before the image arrives, preventing layout shift."));
    if (P.perf && P.perf.memory) items.push(M("JS heap in use", fmtBytes(P.perf.memory.used), "info", "Memory held by JavaScript objects — a rough proxy for framework and data weight."));
    return { id: "performance", title: "Performance", summary: (v.lcp ? "LCP " + fmtMs(v.lcp.time) : "TTFB " + fmtMs(n.ttfb)), kind: "metrics", note: "Measured from this visit with the browser's Performance APIs. A single load on your machine — treat as a snapshot, not a lab test.", items };
  }

  const SEC_HEADERS = [
    ["content-security-policy", "Content-Security-Policy", "Restricts where scripts, styles and frames can load from — the best defence against XSS.", "Content-Security-Policy: default-src 'self'; …"],
    ["strict-transport-security", "Strict-Transport-Security", "Forces HTTPS so users can't be downgraded to plain HTTP.", "max-age=31536000; includeSubDomains; preload"],
    ["x-content-type-options", "X-Content-Type-Options", "Stops browsers from MIME-sniffing responses into something executable.", "nosniff"],
    ["referrer-policy", "Referrer-Policy", "Limits how much of the URL leaks to other sites.", "strict-origin-when-cross-origin"],
    ["permissions-policy", "Permissions-Policy", "Turns off powerful features (camera, geolocation…) the page doesn't need.", "camera=(), microphone=(), geolocation=()"],
    ["cross-origin-opener-policy", "Cross-Origin-Opener-Policy", "Isolates the page from cross-origin popups.", "same-origin"]
  ];

  function security(P, H, cookies, url) {
    const S = P.security || {};
    const items = [];
    items.push(M("HTTPS", S.https ? "yes" : "no", S.https ? "good" : "bad", "Encrypts traffic and is required for service workers, geolocation and most modern APIs."));
    let pass = 0;
    for (const [h, label, note, rec] of SEC_HEADERS) {
      const has = H[h] !== undefined || (h === "content-security-policy" && (S.cspMeta || H["content-security-policy-report-only"] !== undefined));
      if (has) pass++;
      items.push(M(label, has ? short(H[h] || (S.cspMeta ? "set via <meta>" : "report-only"), 60) : "missing", has ? "good" : (h === "content-security-policy" || h === "strict-transport-security" ? "bad" : "warn"), note + (has ? "" : " Typical value: " + rec)));
    }
    const framed = H["x-frame-options"] !== undefined || /frame-ancestors/i.test(H["content-security-policy"] || "");
    if (framed) pass++;
    items.push(M("Clickjacking protection", framed ? (H["x-frame-options"] || "frame-ancestors") : "missing", framed ? "good" : "warn", "X-Frame-Options or CSP frame-ancestors stops other sites embedding this page in a hidden iframe."));
    const leak = [H["server"] && /\d/.test(H["server"]) ? "Server: " + H["server"] : "", H["x-powered-by"] ? "X-Powered-By: " + H["x-powered-by"] : "", H["x-aspnet-version"] ? "X-AspNet-Version" : ""].filter(Boolean);
    items.push(M("Technology disclosure", leak.length ? leak.join(", ") : "minimal", leak.length ? "warn" : "good", "Version banners help attackers pick exploits. Trim them at the server or proxy."));
    if (S.extScripts) items.push(M("Subresource Integrity", S.sriScripts + " / " + S.extScripts + " external scripts", S.sriScripts === S.extScripts ? "good" : S.sriScripts ? "warn" : "info", "integrity=\"sha384-…\" makes the browser reject a third-party file that was tampered with. Most valuable for CDN-hosted libraries."));
    if (S.blankTotal) items.push(M("target=_blank links", S.blankTotal - S.blankNoRel + " / " + S.blankTotal + " with rel=noopener", S.blankNoRel ? "info" : "good", "Modern browsers imply noopener, but explicit rel=\"noopener\" protects older ones."));
    items.push(M("Mixed content", S.mixed ? S.mixed + " http:// resources" : "none", S.mixed ? "bad" : "good", "HTTP subresources on an HTTPS page get blocked or downgrade security."));
    if (S.inlineHandlers) items.push(M("Inline event handlers", S.inlineHandlers, "info", "onclick=… attributes force CSP to allow 'unsafe-inline'. Prefer addEventListener."));
    if (S.nonces) items.push(M("CSP nonces on scripts", S.nonces, "good", "Nonces allow specific inline scripts without opening the door to injected ones — a hallmark of a strict CSP."));
    if (cookies && cookies.length) {
      const bad = cookies.filter((c) => !c.secure).length, noHttp = cookies.filter((c) => !c.httpOnly).length, noSame = cookies.filter((c) => !c.sameSite || c.sameSite === "unspecified").length;
      items.push(M("Cookie flags", cookies.length + " cookies", bad || noSame > cookies.length / 2 ? "warn" : "good", bad + " without Secure, " + noHttp + " readable by JavaScript (no HttpOnly), " + noSame + " without SameSite. Session cookies should be Secure + HttpOnly + SameSite=Lax."));
    }
    return { id: "security", title: "Security hygiene", summary: pass + "/" + (SEC_HEADERS.length + 1) + " headers", kind: "metrics", note: "Passive checks on the response headers and markup — not a penetration test.", items };
  }

  function seo(P, H) {
    const m = P.meta || {}, items = [];
    const tl = (P.title || "").length;
    items.push(M("Title", tl ? short(P.title, 56) : "missing", tl >= 20 && tl <= 65 ? "good" : "warn", tl + " characters. Search results show roughly 50–60."));
    const dl = (m["description"] || "").length;
    items.push(M("Meta description", dl ? dl + " chars" : "missing", dl >= 70 && dl <= 170 ? "good" : "warn", dl ? short(m["description"], 120) : "Shown as the snippet in search results; aim for 70–160 characters."));
    const canon = (P.links || []).find((l) => l.rel === "canonical");
    items.push(M("Canonical URL", canon ? short(canon.href, 50) : "none", canon ? "good" : "info", "Tells search engines which URL is the master copy when the same content is reachable several ways."));
    const robots = m["robots"] || H["x-robots-tag"];
    items.push(M("Robots directives", robots || "default (indexable)", /noindex/i.test(robots || "") ? "warn" : "info", "noindex keeps a page out of search; nofollow tells crawlers not to follow links."));
    items.push(M("Language", P.lang || "not set", P.lang ? "good" : "warn", "<html lang> helps search engines, translators and screen readers pick the right voice."));
    items.push(M("Viewport meta", m["viewport"] ? short(m["viewport"], 50) : "missing", m["viewport"] ? "good" : "bad", "Without it mobile browsers render a zoomed-out desktop layout."));
    const og = ["og:title", "og:description", "og:image", "og:url", "og:type"].filter((k) => m[k]);
    items.push(M("Open Graph", og.length + " / 5 core tags", og.length >= 4 ? "good" : og.length ? "warn" : "info", "Controls the preview card when the link is shared in chat apps and social networks. Missing: " + (["og:title", "og:description", "og:image", "og:url", "og:type"].filter((k) => !m[k]).join(", ") || "none")));
    items.push(M("Twitter / X card", m["twitter:card"] || "none", m["twitter:card"] ? "good" : "info", "summary_large_image gives the big preview image on X."));
    if (P.jsonLdTypes && P.jsonLdTypes.length) items.push(M("Structured data", P.jsonLdTypes.slice(0, 6).join(", "), "good", "Schema.org JSON-LD enables rich results (ratings, breadcrumbs, FAQs) in search."));
    else items.push(M("Structured data", "none", "info", "JSON-LD lets search engines understand entities like Organization, Product or Article."));
    const hl = (P.links || []).filter((l) => l.hreflang).length;
    if (hl) items.push(M("Language alternates", hl + " hreflang links", "info", "Serves the right language/region version to the right searchers."));
    const icons = (P.links || []).filter((l) => /icon/.test(l.rel));
    items.push(M("Icons", icons.length ? icons.map((i) => i.rel.replace("shortcut ", "")).filter((v, i, a) => a.indexOf(v) === i).join(", ") : "none linked", icons.length ? "good" : "info", "favicon, apple-touch-icon and mask-icon cover browsers, iOS home screens and pinned tabs."));
    if (m["theme-color"]) items.push(M("Theme colour", m["theme-color"], "info", "Tints the browser UI on mobile to match the brand."));
    if (P.a11y) items.push(M("H1 headings", P.a11y.h1, P.a11y.h1 === 1 ? "good" : "warn", "One clear H1 per page helps both SEO and screen-reader navigation."));
    return { id: "seo", title: "SEO & sharing", summary: og.length + "/5 OG", kind: "metrics", note: "What crawlers and link-preview bots see.", items };
  }

  function a11y(P) {
    const A = P.a11y || {}, I = P.images || {}, items = [], L = A.landmarks || {};
    items.push(M("Page language", P.lang || "missing", P.lang ? "good" : "bad", "Screen readers switch pronunciation based on lang."));
    items.push(M("Main landmark", L.main ? "present" : "missing", L.main ? "good" : "warn", "<main> lets assistive tech users jump straight to the content."));
    items.push(M("Landmarks", ["header", "nav", "main", "footer", "aside"].map((k) => k + " " + (L[k] || 0)).join(" · "), L.nav && L.footer ? "good" : "info", "Semantic regions form a navigable outline for screen-reader users."));
    items.push(M("Heading structure", A.headingSkips ? A.headingSkips + " skipped level" + (A.headingSkips > 1 ? "s" : "") : "no skipped levels", A.headingSkips ? "warn" : "good", "Levels should descend one step at a time (h2 → h3, not h2 → h4)."));
    items.push(M("Images missing alt", I.noAlt ? I.noAlt + " / " + I.total : "none", I.noAlt ? "bad" : "good", "alt=\"\" marks decorative images; a missing attribute makes screen readers read the file name."));
    items.push(M("Form fields without label", A.unlabeledInputs ? A.unlabeledInputs + " / " + A.inputs : "none", A.unlabeledInputs ? "bad" : "good", "Every input needs a <label>, aria-label or aria-labelledby."));
    items.push(M("Buttons without name", A.buttonsNoName || "none", A.buttonsNoName ? "bad" : "good", "Icon-only buttons need aria-label or visually hidden text."));
    items.push(M("Links without name", A.linksNoName || "none", A.linksNoName ? "warn" : "good", "Empty links are announced as just 'link'."));
    items.push(M("Skip link", A.skipLink ? "present" : "not found", A.skipLink ? "good" : "info", "A 'Skip to content' link saves keyboard users from tabbing through the whole header."));
    items.push(M("Pinch-zoom", A.zoomBlocked ? "blocked" : "allowed", A.zoomBlocked ? "bad" : "good", "user-scalable=no or maximum-scale=1 stops low-vision users enlarging text."));
    if (A.positiveTabindex) items.push(M("Positive tabindex", A.positiveTabindex, "warn", "tabindex greater than 0 overrides the natural tab order and is almost always a bug."));
    items.push(M("ARIA usage", (A.roles || 0) + " roles · " + (A.ariaLabel || 0) + " labels · " + (A.ariaHidden || 0) + " hidden", "info", "No ARIA is better than bad ARIA — native elements come with semantics for free."));
    const css = P.css || "";
    items.push(M("Reduced-motion support", /prefers-reduced-motion/.test(css) ? "yes" : "not found", /prefers-reduced-motion/.test(css) ? "good" : "info", "Respecting prefers-reduced-motion prevents nausea for people with vestibular disorders."));
    if (P.focusOutlineRemoved) items.push(M("Focus outlines removed", P.focusOutlineRemoved + " rules", /:focus-visible/.test(css) ? "info" : "warn", "outline:none on :focus hides where keyboard users are, unless a :focus-visible style replaces it."));
    return { id: "a11y", title: "Accessibility signals", summary: (A.h1 === 1 ? "" : "") + (I.noAlt || A.unlabeledInputs || A.buttonsNoName ? "issues found" : "looks tidy"), kind: "metrics", note: "Automated hints only; they can't judge colour contrast or real usability.", items };
  }

  function craft(P, H) {
    const css = P.css || "", meta = P.cssMeta || {}, items = [];
    const feats = [];
    for (const f of g.CSS_FEATURES || []) if (f.re.test(css)) feats.push({ text: f.name, note: f.what, href: "https://developer.mozilla.org/docs/" + f.mdn });
    const st = P.classStats || {}, total = P.classUnique || 0;
    const approach = [];
    if (st.tailwindVariant >= 8 || st.tailwindUtil >= 40) approach.push("utility-first (Tailwind-style)");
    if (st.bootstrapish >= 12) approach.push("component framework (Bootstrap-style)");
    if (st.bem >= 10) approach.push("BEM naming");
    if (st.cssModules >= 12) approach.push("CSS Modules (hashed)");
    if (st.emotion >= 5) approach.push("Emotion CSS-in-JS");
    if (st.styled >= 5) approach.push("styled-components");
    const nodes = P.domNodes || 0;
    const sections = [];
    sections.push({ id: "craft-style", title: "Styling approach", kind: "metrics", note: "Inferred from class names, custom properties and readable stylesheets.", items: [
      M("Approach", approach.length ? approach.join(" + ") : "hand-written / semantic classes", "info", "Utility classes trade markup size for speed of styling; semantic/BEM classes keep HTML clean but need more CSS."),
      M("Unique classes", total + " (" + (P.classTotal || 0) + " uses)", "info", "A low unique count with high reuse suggests utilities or a strict component system."),
      M("Design tokens", P.cssVarTotal ? P.cssVarTotal + " custom properties" : "none in readable CSS", P.cssVarTotal ? "good" : "info", (P.cssVarPrefixes || []).length ? "Common prefixes: " + P.cssVarPrefixes.slice(0, 6).map((p) => "--" + p[0] + "-* (" + p[1] + ")").join(", ") : "CSS variables are the backbone of themes and dark mode."),
      M("Readable CSS", (meta.rules || 0).toLocaleString() + " rules · " + fmtBytes(meta.bytes || 0), "info", (meta.crossOrigin ? meta.crossOrigin + " cross-origin stylesheet(s) could not be read by the browser (CORS), so counts are a lower bound." : "All stylesheets were readable.")),
      M("Inline styles", (P.styleAttrCount || 0) + " style attributes · " + (P.inlineStyleTags || 0) + " <style> tags", (P.styleAttrCount || 0) > 200 ? "warn" : "info", "Many inline style attributes make CSP harder and overrides messier.")
    ] });
    sections.push({ id: "craft-css", title: "Modern CSS in use", summary: feats.length + " features", kind: "chips", note: "Detected in the stylesheets this page allowed us to read. Click one to open the MDN docs.", items: feats });
    const fu = P.fontsUsed || {}, faces = P.fontFaces || [];
    const fontItems = [];
    const first = (s) => (s || "").split(",")[0].replace(/["']/g, "").trim();
    if (fu.body) fontItems.push(KV("Body", fu.body, "First family in the stack is the one you actually see; the rest are fallbacks."));
    if (fu.heading && fu.heading !== fu.body) fontItems.push(KV("Headings", fu.heading, "A different heading face is a deliberate typographic pairing."));
    if (fu.code) fontItems.push(KV("Code", fu.code));
    const disp = Array.from(new Set(faces.map((f) => f.display).filter(Boolean)));
    fontItems.push(KV("@font-face rules", faces.length ? faces.length + " (" + (disp.length ? "font-display: " + disp.join(", ") : "no font-display set") + ")" : "none readable", "font-display: swap shows fallback text immediately instead of invisible text while a web font loads."));
    if ((P.fontsLoaded || []).length) fontItems.push(KV("Loaded faces", P.fontsLoaded.slice(0, 8).join(" · "), "Only faces that were actually used get downloaded."));
    sections.push({ id: "craft-fonts", title: "Typography", summary: first(fu.body) || "", kind: "kv", items: fontItems });
    const I = P.images || {};
    const mediaItems = [
      KV("Images", I.total + " (" + I.svgInline + " inline SVG, " + I.canvas + " canvas)", "Inline SVG is crisp and stylable, but heavy if repeated."),
      KV("Responsive images", I.srcset + " with srcset · " + I.picture + " <picture>", "srcset/sizes let the browser pick the smallest suitable file for the screen."),
    ];
    if ((I.pictureTypes || []).length) mediaItems.push(KV("Next-gen formats", I.pictureTypes.join(", "), "AVIF/WebP via <picture> keep fallbacks for old browsers."));
    if (I.video) mediaItems.push(KV("Video", I.video + " element" + (I.video > 1 ? "s" : "") + (P.videoAttrs && P.videoAttrs[0] ? " (autoplay:" + P.videoAttrs[0].autoplay + ", muted:" + P.videoAttrs[0].muted + ", playsinline:" + P.videoAttrs[0].playsinline + ")" : ""), "Muted + playsinline is required for autoplay on mobile."));
    sections.push({ id: "craft-media", title: "Images & media", kind: "kv", items: mediaItems });
    const F = P.features || {}, fl = [];
    if (F.dialog) fl.push({ text: "<dialog>", note: "Native modal dialogs with built-in focus trapping." });
    if (F.popover) fl.push({ text: "Popover API", note: "Declarative popovers with the popover attribute." });
    if (F.details) fl.push({ text: "<details>", note: "Native accordions with no JavaScript." });
    if (F.template) fl.push({ text: "<template>", note: "Inert markup cloned by JavaScript." });
    if (F.inert) fl.push({ text: "inert", note: "Disables interaction and focus for a subtree." });
    if (P.importMap) fl.push({ text: "Import map", note: "Bare module specifiers resolved without a bundler." });
    if (P.speculationRules) fl.push({ text: "Speculation Rules", note: "Prerender/prefetch of likely next pages." });
    if (F.microdata) fl.push({ text: "Microdata", note: "Schema.org itemscope markup." });
    if (F.dataTestId) fl.push({ text: "Test hooks (" + F.dataTestId + ")", note: "data-testid / data-cy attributes left in production — a sign of automated UI tests." });
    if (F.srOnly) fl.push({ text: "Screen-reader-only text (" + F.srOnly + ")", note: "Visually hidden helper text for assistive tech." });
    sections.push({ id: "craft-html", title: "HTML platform features", summary: fl.length + " found", kind: "chips", items: fl });
    sections.push({ id: "craft-size", title: "Document size", kind: "metrics", items: [
      M("DOM nodes", nodes.toLocaleString(), band(nodes, 1500, 3000), "Lighthouse warns above ~1,500 nodes; big DOMs slow style calculation and memory."),
      M("Max DOM depth", P.maxDepth, band(P.maxDepth, 20, 32), "Deeply nested markup is a common by-product of wrapper-heavy frameworks and page builders."),
      M("HTML size", fmtBytes(P.htmlLength), "info", "Size of the live DOM serialised — larger than the network response when JavaScript renders content."),
      M("Inline scripts", (P.inlineScriptCount || 0) + " · " + fmtBytes(P.inlineScriptBytes || 0), (P.inlineScriptBytes || 0) > 200000 ? "warn" : "info", "Inline JSON state (e.g. __NEXT_DATA__) is common in server-rendered apps.")
    ] });
    return sections;
  }

  function scriptsSection(P) {
    const s = P.scripts || [], ext = s.filter((x) => x.src);
    const items = [
      KV("Total", s.length + " (" + ext.length + " external · " + (s.length - ext.length) + " inline)"),
      KV("Loading strategy", ext.filter((x) => x.module).length + " module · " + ext.filter((x) => x.async).length + " async · " + ext.filter((x) => x.defer).length + " defer · " + ext.filter((x) => !x.async && !x.defer && !x.module && x.head).length + " blocking in <head>", "Blocking scripts in <head> delay first paint. defer keeps order; async runs as soon as ready; modules defer by default."),
    ];
    ext.slice(0, 40).forEach((x) => items.push(KV(pathOf(x.src), hostOf(x.src), "", { mono: true, tag: x.module ? "module" : x.async ? "async" : x.defer ? "defer" : x.head ? "blocking" : "" })));
    return { id: "scripts", title: "Scripts", summary: String(ext.length), kind: "kv", items };
  }

  function hints(P) {
    const L = (P.links || []).filter((l) => /^(preconnect|dns-prefetch|preload|prefetch|modulepreload|prerender)$/.test(l.rel));
    const items = L.slice(0, 40).map((l) => KV(l.rel + (l.as ? " · " + l.as : ""), short(l.href.replace(/^https?:\/\//, ""), 60), "", { mono: true }));
    return { id: "hints", title: "Resource hints", summary: String(L.length), kind: "kv", note: "preconnect warms up a connection, preload fetches something needed now, prefetch something needed next, modulepreload does the same for ES modules.", items };
  }

  function documentSection(facts, P, H) {
    const N = facts.net || {}, items = [];
    items.push(KV("URL", facts.url, "", { mono: true }));
    if (N.status) items.push(KV("Status", N.status + (N.statusLine ? " · " + N.statusLine : "")));
    if (N.ip) items.push(KV("Server IP", N.ip, "The address that answered. Behind a CDN this is an edge server, not the origin. Look it up with a WHOIS/ASN tool to see who hosts it."));
    if (P.perf && P.perf.nav) { items.push(KV("Protocol", P.perf.nav.protocol || "–")); items.push(KV("Navigation", P.perf.nav.type + (P.perf.nav.redirectCount ? " · " + P.perf.nav.redirectCount + " redirect(s)" : ""))); }
    (N.redirects || []).forEach((r, i) => items.push(KV("Redirect " + (i + 1), r.status + " → " + short(r.to, 70), "Each redirect adds a full round trip. Common ones: http→https and apex→www.", { mono: true })));
    items.push(KV("Doctype", P.doctype || "missing (quirks mode)", P.compat === "CSS1Compat" ? "Standards mode." : "Quirks mode — the browser emulates old bugs."));
    items.push(KV("Charset", P.charset || ""));
    return { id: "document", title: "Document", kind: "kv", items };
  }

  function headersSection(H) {
    const KB = g.HEADER_KB || {};
    const order = Object.keys(H).sort((a, b) => (KB[b] ? 1 : 0) - (KB[a] ? 1 : 0) || a.localeCompare(b));
    const items = order.map((k) => { const kb = KB[k]; return KV(k, short(H[k], 140), kb ? kb[0] + (kb[1] ? "  Tip: " + kb[1] : "") : "", { mono: true, tag: kb ? "" : "custom" }); });
    return { id: "headers", title: "Response headers", summary: String(order.length), kind: "kv", note: "Click a row for a plain-English explanation. Headers marked 'custom' are non-standard or vendor-specific.", items };
  }

  function thirdParties(P, techs, db) {
    const R = (P.perf && P.perf.resources) || {}, hosts = R.hosts || {};
    const list = Object.entries(hosts).filter((e) => e[1].third).sort((a, b) => b[1].n - a[1].n);
    const detected = techs;
    const owner = (host) => {
      for (const t of detected) {
        const src = (db.find((x) => x.name === t.name) || {});
        for (const key of ["requests", "scripts", "styles", "iframes", "html"]) for (const raw of src[key] || []) {
          try { if (new RegExp(raw.split("##")[0], "i").test(host)) return t.name; } catch (e) {}
        }
      }
      return "";
    };
    const items = list.slice(0, 40).map(([h, v]) => KV(h, v.n + " req" + (v.bytes ? " · " + fmtBytes(v.bytes) : ""), "", { mono: true, tag: owner(h) }));
    const totalReq = list.reduce((a, e) => a + e[1].n, 0);
    return { id: "third", title: "Third-party hosts", summary: list.length + " hosts · " + totalReq + " req", kind: "kv", note: "Domains outside the site's own registrable domain that the page contacted. Sizes show 0 when the host doesn't send Timing-Allow-Origin.", items };
  }

  function cookiesSection(cookies, P) {
    const KB = g.COOKIE_KB || [];
    const known = (n) => { for (const [re, who, what] of KB) if (re.test(n)) return { who, what }; return null; };
    const items = (cookies || []).map((c) => {
      const k = known(c.name);
      const flags = [c.secure ? "Secure" : "", c.httpOnly ? "HttpOnly" : "", c.sameSite && c.sameSite !== "unspecified" ? "SameSite=" + c.sameSite : "", c.session ? "session" : ""].filter(Boolean).join(" · ");
      return KV(c.name, flags || "no flags", k ? k.who + ": " + k.what : "Unrecognised cookie.", { mono: true, tag: k ? k.who : "" });
    });
    (P.documentCookies || []).forEach((n) => { if (!(cookies || []).some((c) => c.name === n)) { const k = known(n); items.push(KV(n, "readable by JS", k ? k.who + ": " + k.what : "", { mono: true, tag: k ? k.who : "" })); } });
    return { id: "cookies", title: "Cookies", summary: String(items.length), kind: "kv", note: "Names and flags only — values are never read into the report.", items };
  }

  function resourceBreakdown(P) {
    const R = (P.perf && P.perf.resources) || {};
    const items = Object.entries(R.byType || {}).sort((a, b) => b[1].bytes - a[1].bytes).map(([t, v]) => KV(t, v.n + " req · " + fmtBytes(v.bytes), ""));
    const prot = Object.entries(R.byProto || {}).map(([p, n]) => p + " ×" + n).join("  ");
    if (prot) items.push(KV("Protocols", prot, "h2 = HTTP/2, h3 = HTTP/3, http/1.1 = legacy. Mixed values are normal when third parties are involved."));
    return { id: "breakdown", title: "Resource breakdown", summary: fmtBytes(R.totalTransfer), kind: "kv", items };
  }

  function biggest(P) {
    const R = (P.perf && P.perf.resources) || {};
    const items = (R.biggest || []).filter((b) => b.bytes).map((b) => KV(short(pathOf(b.url), 44), fmtBytes(b.bytes) + " · " + fmtMs(b.duration), b.url, { mono: true, tag: b.type }));
    return { id: "biggest", title: "Heaviest resources", kind: "kv", items };
  }

  function serverTiming(P) {
    const st = (P.perf && P.perf.nav && P.perf.nav.serverTiming) || [];
    if (!st.length) return null;
    return { id: "servertiming", title: "Server-Timing", kind: "kv", note: "Timings the backend chose to expose — a rare peek at server-side work.", items: st.map((s) => KV(s.name, (s.duration ? fmtMs(s.duration) : "") + (s.description ? " " + s.description : ""), "")) };
  }

  function storageSection(P) {
    const KB = g.COOKIE_KB || [];
    const known = (n) => { for (const [re, who] of KB) if (re.test(n)) return who; return ""; };
    const mk = (title, id, list) => ({ id, title, summary: String(list.length), kind: "kv", items: list.map((n) => KV(n, "", "", { mono: true, tag: known(n) })) });
    const out = [];
    if ((P.localStorageKeys || []).length) out.push(Object.assign(mk("localStorage keys", "ls", P.localStorageKeys), { note: "Key names only. They often reveal libraries (persist:root = redux-persist, ajs_* = Segment) and what the app remembers." }));
    if ((P.sessionStorageKeys || []).length) out.push(mk("sessionStorage keys", "ss", P.sessionStorageKeys));
    if ((P.indexedDbNames || []).length) out.push(mk("IndexedDB databases", "idb", P.indexedDbNames));
    if ((P.cacheNames || []).length) out.push(Object.assign(mk("Cache Storage", "cs", P.cacheNames), { note: "Caches created by a service worker (Workbox names them workbox-precache-…)." }));
    if ((P.serviceWorkers || []).length) out.push({ id: "sw", title: "Service workers", summary: String(P.serviceWorkers.length), kind: "kv", items: P.serviceWorkers.map((s) => KV(pathOf(s.script), "scope " + s.scope, s.script, { mono: true, tag: s.state })) });
    return out;
  }

  function metaSection(P) {
    const items = (P.metaList || []).slice(0, 60).map((m) => KV(m.k, short(m.v, 100), "", { mono: true }));
    return { id: "meta", title: "Meta tags", summary: String(items.length), kind: "kv", items };
  }

  function filesSections(D) {
    const out = [], F = (D && D.files) || {};
    if (F.robots) {
      const lines = F.robots.split(/\r?\n/);
      const sitemaps = lines.filter((l) => /^sitemap:/i.test(l)).map((l) => l.replace(/^sitemap:\s*/i, ""));
      const dis = lines.filter((l) => /^disallow:\s*\S/i.test(l)).map((l) => l.replace(/^disallow:\s*/i, ""));
      const agents = Array.from(new Set(lines.filter((l) => /^user-agent:/i.test(l)).map((l) => l.replace(/^user-agent:\s*/i, "")))).slice(0, 8);
      const items = [KV("User-agents", agents.join(", ") || "–", "GPTBot, CCBot or ClaudeBot rules show how the site treats AI crawlers.")];
      sitemaps.slice(0, 5).forEach((s) => items.push(KV("Sitemap", s, "", { mono: true })));
      dis.slice(0, 20).forEach((d) => items.push(KV("Disallow", d, "Disallowed paths often reveal admin areas or the CMS in use (/wp-admin/, /_next/, /cdn-cgi/).", { mono: true })));
      out.push({ id: "robots", title: "robots.txt", summary: dis.length + " rules", kind: "kv", items });
    }
    if (F.humans) out.push({ id: "humans", title: "humans.txt", kind: "kv", note: "A friendly credits file — sometimes lists the team and tools.", items: F.humans.split(/\r?\n/).filter(Boolean).slice(0, 25).map((l) => KV("", l)) });
    if (F.security) out.push({ id: "securitytxt", title: "security.txt", kind: "kv", note: "RFC 9116: where to report vulnerabilities.", items: F.security.split(/\r?\n/).filter((l) => l && !l.startsWith("#")).slice(0, 12).map((l) => { const i = l.indexOf(":"); return KV(l.slice(0, i), l.slice(i + 1).trim(), "", { mono: true }); }) });
    if (F.manifest) {
      let mf = null; try { mf = JSON.parse(F.manifest); } catch (e) {}
      if (mf) out.push({ id: "manifest", title: "Web app manifest", kind: "kv", note: "Makes the site installable as a PWA.", items: [
        KV("Name", mf.name || mf.short_name || "–"), KV("Display", mf.display || "browser", "standalone/fullscreen hide the browser UI when installed."), KV("Theme colour", mf.theme_color || "–"), KV("Background", mf.background_color || "–"),
        KV("Icons", (mf.icons || []).length + " (" + (mf.icons || []).slice(0, 4).map((i) => i.sizes).join(", ") + ")", "Include a 512px and a maskable icon."), KV("Shortcuts", (mf.shortcuts || []).length), KV("Start URL", mf.start_url || "–", "", { mono: true })
      ] });
    }
    return out;
  }

  function bundlesSection(D) {
    const b = (D && D.bundles) || [];
    if (!b.length) return null;
    const items = b.map((x) => KV(pathOf(x.url), fmtBytes(x.size) + (x.truncated ? "+" : ""), (x.sourceMap ? "Source map referenced — open DevTools → Sources to read the original, unminified code. " : "") + (x.banner ? "Banner: " + x.banner : ""), { mono: true, tag: x.sourceMap ? "source map" : x.minified ? "minified" : "" }));
    return { id: "bundles", title: "Bundles (deep scan)", summary: String(b.length), kind: "kv", note: "Scripts and stylesheets fetched (from cache when possible) and searched for version banners, framework markers and source-map comments.", items };
  }

  function highlights(P, H, techs) {
    const has = (n) => techs.some((t) => t.name === n);
    const css = P.css || "", h = [];
    const add = (title, text) => { if (h.length < 6) h.push({ title, text }); };
    if (P.speculationRules) add("Speculation Rules", "Prerenders likely next pages so clicks feel instant. See DevTools → Application → Speculative loads.");
    if (/@container\b|container-type/.test(css)) add("Container queries", "Components adapt to their own width rather than the viewport — study how the cards reflow.");
    if (/view-transition/.test(css)) add("View Transitions", "Animated navigation handled by the browser. Search the CSS for ::view-transition.");
    if (/animation-timeline|scroll-timeline|view-timeline/.test(css)) add("Scroll-driven animation", "Scroll effects in pure CSS — no scroll listeners, no jank.");
    if (/:has\(/.test(css)) add(":has() selector", "Parent-aware styling replaces JavaScript class toggling.");
    if (/@layer\b/.test(css)) add("Cascade layers", "Style order is managed explicitly with @layer, taming specificity.");
    if (/clamp\(/.test(css) && /--[\w-]*(fluid|step|size)/.test(css)) add("Fluid type & space scale", "clamp()-based tokens scale smoothly with the viewport.");
    if (/oklch|color-mix/.test(css)) add("Modern colour", "oklch()/color-mix() give perceptually even palettes and easy theming.");
    if ((P.images || {}).highPriority) add("fetchpriority on hero image", "The LCP image is prioritised, a cheap and effective performance trick.");
    if (has("AVIF images")) add("AVIF images", "Next-generation image format — check the Network tab for the size difference vs JPEG.");
    if (has("HTTP/3 (QUIC)")) add("HTTP/3", "Served over QUIC for faster, more resilient connections.");
    if (/nonce/.test(H["content-security-policy"] || "") || /strict-dynamic/.test(H["content-security-policy"] || "")) add("Strict CSP", "Nonce/strict-dynamic policy — the modern recommended approach to XSS defence.");
    if (has("Astro") ) add("Islands architecture", "Only interactive components ship JavaScript; everything else is static HTML.");
    if ((P.serviceWorkers || []).length) add("Service worker", "Offline/caching layer registered at " + short(pathOf(P.serviceWorkers[0].script), 30) + ". Inspect it under Application → Service Workers.");
    if (has("Web Components") && (P.customElements || []).length) add("Custom elements", "Uses framework-independent components like <" + P.customElements[0][0] + ">.");
    if (/text-wrap\s*:\s*(balance|pretty)/.test(css)) add("Balanced headlines", "text-wrap: balance gives tidy multi-line headings without manual breaks.");
    return h;
  }

  function summarize(techs) {
    const pick = (cats) => techs.find((t) => cats.includes(t.category));
    const parts = [];
    const platform = pick(["CMS", "Ecommerce", "Site Builders"]);
    const fw = pick(["Meta-frameworks"]) || pick(["JS Frameworks"]);
    const ui = pick(["UI Frameworks"]);
    const host = pick(["Hosting"]) || pick(["CDN"]);
    const lang = pick(["Web Frameworks"]) || pick(["Programming Languages"]);
    if (platform) parts.push("runs on " + platform.name + (platform.version ? " " + platform.version : ""));
    if (fw) parts.push("built with " + fw.name + (fw.version ? " " + fw.version : ""));
    else if (lang) parts.push("powered by " + lang.name);
    if (ui) parts.push("styled with " + ui.name);
    if (host) parts.push("delivered via " + host.name);
    if (!parts.length) return techs.length ? "A mostly custom or lightly fingerprinted stack." : "";
    const last = parts.length > 1 ? " and " + parts.pop() : "";
    const sentence = parts.join(", ") + last + ".";
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  function build(facts, techs, db) {
    const P = facts.page || {}, N = facts.net || {}, H = N.headers || {}, D = facts.deep || {};
    const cookies = (facts.cookies || []).map((c) => ({ name: c.name, secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite, session: c.session, domain: c.domain }));
    const network = [documentSection(facts, P, H), headersSection(H), thirdParties(P, techs, db), cookiesSection(cookies, P), resourceBreakdown(P), biggest(P), serverTiming(P), hints(P)].filter(Boolean);
    const insights = [performance(P, H), security(P, H, cookies), seo(P, H), a11y(P)].concat(craft(P, H));
    const hood = [];
    const b = bundlesSection(D); if (b) hood.push(b);
    hood.push.apply(hood, filesSections(D));
    if ((P.globals || (facts.main && facts.main.globals) || []).length) { const gl = (facts.main && facts.main.globals) || []; hood.push({ id: "globals", title: "Site-defined globals", summary: String(gl.length), kind: "chips", note: "window properties that a blank page does not have. Libraries announce themselves here — try typing one in the console.", items: gl.slice(0, 120).map((n) => ({ text: n, note: "" })) }); }
    if ((P.customElements || []).length) hood.push({ id: "ce", title: "Custom elements", summary: String(P.customElements.length), kind: "chips", note: "Hyphenated tag names — usually Web Components or framework-specific elements.", items: P.customElements.map((e) => ({ text: "<" + e[0] + "> ×" + e[1], note: "" })) });
    hood.push.apply(hood, storageSection(P));
    if ((P.dataAttrs || []).length) hood.push({ id: "data", title: "data-* attributes", summary: String(P.dataAttrs.length), kind: "chips", note: "Most-used data attributes. Frameworks and test tools leave their signature here.", items: P.dataAttrs.map((e) => ({ text: e[0] + " ×" + e[1], note: "" })) });
    hood.push(scriptsSection(P), metaSection(P));
    if ((P.comments || []).length) hood.push({ id: "comments", title: "HTML comments", summary: String(P.commentCount || P.comments.length), kind: "kv", note: "Comments left in the markup: build stamps, plugin banners, occasional easter eggs.", items: P.comments.map((c) => KV("", c)) });

    const layers = {};
    techs.forEach((t) => { (layers[t.layer] = layers[t.layer] || []).push(t.name); });
    return {
      summary: summarize(techs),
      overview: { host: hostOf(facts.url), title: P.title || "", status: N.status || null, ip: N.ip || "", protocol: P.perf && P.perf.nav ? P.perf.nav.protocol : "", https: /^https:/.test(facts.url), ttfb: P.perf && P.perf.nav ? P.perf.nav.ttfb : null, load: P.perf && P.perf.nav ? P.perf.nav.load : null, weight: P.perf && P.perf.resources ? P.perf.resources.totalTransfer : null, requests: P.perf && P.perf.resources ? P.perf.resources.count : null, nodes: P.domNodes || 0 },
      highlights: highlights(P, H, techs),
      tabs: { insights, network, hood },
      layers
    };
  }

  g.Insights = { build, fmtBytes, fmtMs };
  if (typeof module !== "undefined") module.exports = g.Insights;
})(typeof self !== "undefined" ? self : globalThis);
