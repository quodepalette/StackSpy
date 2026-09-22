# JoErl StackSpy 2.0

X-ray any website and learn how it was built. StackSpy detects **760+ technologies** (frameworks, CMSs, servers, CDNs, analytics, payment, auth…), shows the **evidence** behind every detection, and explains each one in plain English — with "Try it in DevTools" tips to teach you as you browse.

## Install (Chrome / Edge / Brave)
1. Unzip this folder.
2. Open `chrome://extensions`, switch on **Developer mode**.
3. Click **Load unpacked** and select the `JoErl-StackSpy` folder.
4. Pin the icon. The badge shows how many technologies each tab uses.

## What you get
| Tab | What's inside |
|---|---|
| **Stack** | A layered cross-section (Experience → Application → Content → Backend → Edge → Services → Web platform), "Worth studying" highlights, and an expandable card per technology: what it is, why sites use it, extracted details (WordPress theme & plugins, Next.js build ID/router, GTM & GA IDs, Stripe live/test mode, Vercel region, Cloudflare edge…), and the exact evidence. |
| **Insights** | Performance (TTFB, FCP, LCP + element, CLS, weight, render-blocking), security-header hygiene, SEO & sharing, accessibility signals, modern CSS in use (container queries, `:has()`, view transitions…), typography, images, DOM size. Tap any row for the lesson. |
| **Network** | Document/redirect chain, server IP, every response header with an explanation, third-party hosts mapped to technologies, cookies (names + flags only), resource breakdown, heaviest files, Server-Timing, resource hints. |
| **Inside** | Deep-scan results: version banners and **source-map** detection in bundles, `robots.txt`, `humans.txt`, `security.txt`, web-app manifest; site-defined `window` globals, custom elements, storage key names, `data-*` attributes, scripts, meta tags, HTML comments. |
| **Saved** | Star a site to keep it; search your collection by technology. |

Extras: light/dark/auto theme, filter box on every tab, copy/download report as Markdown, copy JSON, full-page view.

## How detection works
* **Passive scan** (automatic on page load, powers the badge): response headers, cookies (incl. HttpOnly names), HTML/DOM, script/style/link URLs, inline CSS, class-name statistics, custom elements, `window` globals (diffed against a blank iframe), framework probes (React roots, Vue app versions…), storage key names, service workers, Performance API and network requests.
* **Deep scan** (only when you open the popup): inspects application and dynamically loaded JavaScript chunks, not just `<script src>` tags, plus stylesheets. Candidate bundles are read in full up to a bounded per-file limit, and exposed source maps are fetched and inspected for package paths. This is important for bundled libraries such as Motion/Framer Motion, where the package name may not appear in a script URL.
* **Evidence-first scoring:** rule weights are signal strengths, not percentages to add together. Repeated matches from the same evidence family have diminishing returns; different families (for example source map + bundle + script URL) reinforce each other. A weak single clue is never promoted to a detection. The UI labels detections by evidence strength.

## Privacy
Everything runs locally. No analytics, no remote calls of your own; deep-scan requests go only to the site you're viewing. Cookie **values** and storage **values** are never included in reports (Set-Cookie values are redacted). Your saved list lives in `chrome.storage.local`.

## Extending the knowledge base
Add entries to `data/tech-*.js`:

```js
T("My Tech", "JS Libraries", "https://example.com", {
  d: "What it is and why teams use it.",
  tip: "Something to try in DevTools.",
  scripts: [r`mytech(?:@|/)([\d.]+)##v=\1`],   // ##v= version, ##c= confidence weight
  js: { "MyTech.version": r`^([\d.]+)##v=\1` },
  headers: { "x-powered-by": r`MyTech` },
  implies: ["Node.js"],
  extract: { "Build ID": "js:MyTech.build" }
});
```
Rule sources: `url html css scripts styles links requests classes attrs tags globals storage sw iframes serverTiming body sourceMaps proto headers meta cookies js dom stats`.

Brand glyphs © their owners, via [Simple Icons](https://simpleicons.org) (CC0). Fonts: Bricolage Grotesque, Instrument Sans, JetBrains Mono (SIL OFL).


## Evidence policy (2.2)
StackSpy reports a technology only when that technology has its own evidence on the inspected page. It does not infer WordPress from a WordPress plugin, React from an animation library, or any other dependency from an `implies` relationship. Lazy JavaScript chunks are inspected directly, source maps are inspected when available, and React runtime fibers may provide additional Motion evidence. Weak isolated clues are not promoted to detections.
