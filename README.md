# StackSpy

StackSpy is a Chrome extension that looks at the site you're on and tells you what it's actually built with. Point it at a page and it'll dig through the HTML, network requests, cookies, headers, and even JavaScript bundles to figure out the CMS, frameworks, hosting, CDN, analytics tools, and a lot more, then explain what it found in plain English instead of just dumping a list of names at you.

Think of it as popping the hood on any website.

## What it does

- **Detects technologies across the whole stack.** Nearly 760 signatures covering CMSs, JS frameworks, meta-frameworks, build tools, backend languages, databases, hosting, CDNs, security tools, analytics, payments, and more, organized into 8 layers and 60+ categories.
- **Explains its evidence.** Every detection shows *why* StackSpy thinks it's there, whether that's a script URL, a cookie, an HTML class, a header, or a name buried in a source map, along with a confidence level (inferred, corroborated, good, or strong).
- **Teaches as it goes.** Each category comes with a short note on what it means and why it matters, so you're not just collecting trivia, you're learning how the site was put together.
- **Digs into performance.** TTFB, FCP, LCP, CLS, long tasks, page weight, compression, HTTP version, caching headers, all pulled straight from the Performance API and explained with plain-language thresholds.
- **Checks security and SEO basics.** Cookie flags, security headers, HTTPS, meta tags, robots.txt, sitemap presence, that sort of thing.
- **Looks under the hood.** A dedicated tab shows JS bundles, source maps, global variables the page defines, custom elements, data attributes, and leftover HTML comments, useful for actually reverse-engineering how something works.
- **Does a deep scan on request.** The passive scan runs automatically on page load. A deep scan (triggered from the popup) fetches JS bundles and their source maps to catch dependencies that only show up in lazy-loaded chunks.
- **Lets you save and export sites.** Bookmark interesting sites, export your collection as JSON, and copy or download any report as Markdown.

## How it works

StackSpy is a Manifest V3 extension with a few moving pieces:

- **`background.js`** is the service worker. It watches network traffic per tab (headers, redirects, IPs, requests), runs the actual scans, and caches results per tab and per URL.
- **`lib/collector.js`** runs inside the page (both the isolated content-script world and the page's own main world) to pull out DOM structure, computed CSS, performance timings, storage keys, global variables, and more.
- **`lib/engine.js`** takes all of that collected data plus the technology database and matches patterns against it to produce a list of detected technologies with evidence and confidence scores.
- **`lib/insights.js`** turns the raw facts and detections into the readable sections you see in the popup: performance, security, SEO, accessibility, network, and the "under the hood" tab.
- **`data/*.js`** holds the technology signatures themselves, split across a few files by category (content platforms, frontend, backend/edge, services, and a growing "expansion" file), plus the metadata that defines layers, categories, and teaching copy.
- **`popup.html` / `popup.js` / `popup.css`** render the actual UI you interact with, built with plain DOM APIs rather than a framework.

Nothing here calls out to a third-party server. Detection is fully local, based on what your browser already loaded.

## Installing it

1. Clone or download this repo.
2. Open `chrome://extensions` in Chrome (or another Chromium-based browser).
3. Turn on **Developer mode** in the top right.
4. Click **Load unpacked** and select the `StackSpy` folder.
5. Pin the extension and click it on any site.

Requires Chrome 110 or newer.

## Using it

Open the popup on any page and StackSpy runs a quick passive scan automatically. From there:

- **Stack** shows everything detected, grouped by layer, with confidence and evidence for each.
- **Insights** covers performance, security, SEO, and accessibility findings.
- **Network** breaks down headers, cookies, third-party requests, and resource sizes.
- **Inside** shows JS bundles, source maps, globals, and other things picked up during a deep scan.
- **Saved** holds any sites you've bookmarked for later.

Hit rescan for a deeper look that fetches and inspects JS bundles directly, or use the menu to copy a report as Markdown or JSON, download it, or open the full-page view.

## Permissions

StackSpy asks for `activeTab`, `scripting`, `webRequest`, `storage`, `cookies`, and host access to all URLs. It needs all of that to inspect network traffic and page content on whatever site you're visiting, but it doesn't send anything off your machine. Everything is analyzed and stored locally.


