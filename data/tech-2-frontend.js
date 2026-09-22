// JS frameworks, meta-frameworks, build tools, libraries, UI systems, icons, fonts, animation, media, maps, widgets.
// Sources: "js" = window path (value tested when a pattern is given); "probe:*" = built-in DOM probes;
// "stats" = class statistics gathered by the page collector (min count).

// ───────────── JS frameworks ─────────────
T("React","JS Frameworks","https://react.dev",{
  d:"Component-based UI library from Meta. UI is described as a function of state; React updates the DOM efficiently via a virtual tree.",
  tip:"Install the React DevTools extension: it adds Components and Profiler panels that show the live component tree.",
  js:{"React.version":r`^([\d.]+)##v=\1`,"probe:react":"","probe:reactVersion":r`^([\d.]+)##v=\1`},
  html:[r`data-reactroot|data-reactid`],
  scripts:[r`react(?:-dom)?@([\d.]+)##v=\1`,r`/react/([\d.]+)/(umd/)?react(\.production)?(\.min)?\.js##v=\1`,r`react-dom(\.production)?(\.min)?\.js`],
  body:[r`@license React v?([\d.]+)##v=\1`,r`react\.(production|development)(\.min)?\.js##c=40`,r`react-dom(\.production)?\.min##c=40`]
});
T("Vue.js","JS Frameworks","https://vuejs.org",{
  d:"Progressive framework with an approachable template syntax and fine-grained reactivity.",
  tip:"Scoped styles add data-v-xxxxxxx attributes to elements — a telltale sign in the Elements panel.",
  js:{"Vue.version":r`^([\d.]+)##v=\1`,"probe:vue3":"","probe:vue3Version":r`^([\d.]+)##v=\1`,"probe:vue2Version":r`^([\d.]+)##v=\1`,"__VUE__":""},
  attrs:[r`^data-v-[0-9a-f]{6,8}$##c=70`,r`^data-server-rendered$##c=80`,r`^data-v-app$`],
  scripts:[r`vue@([\d.]+)##v=\1`,r`/vue/([\d.]+)/vue(\.runtime)?(\.global)?(\.prod)?(\.min)?\.js##v=\1`,r`vue(\.runtime)?(\.global)?(\.prod)?\.min\.js`],
  body:[r`Vue\.js v([\d.]+)##v=\1`,r`@vue/(runtime-dom|shared|reactivity)##c=60`]
});
T("Angular","JS Frameworks","https://angular.dev",{
  d:"Google's batteries-included TypeScript framework: DI, routing, forms and RxJS-based reactivity in one opinionated package.",
  tip:"The ng-version attribute on the root element tells you the exact Angular version. In the console, ng.getComponent($0) inspects a component.",
  dom:{"[ng-version]@ng-version":r`^(.+)$##v=\1`},
  attrs:[r`^_ngcontent-`,r`^_nghost-`,r`^ng-server-context$`],
  js:{getAllAngularRootElements:"","ng.getComponent":""},
  body:[r`@license Angular v([\d.]+)##v=\1`],implies:["TypeScript"]
});
T("AngularJS","JS Frameworks","https://angularjs.org",{
  d:"The original Angular (1.x), now end-of-life. Two-way binding and directives like ng-repeat.",
  js:{"angular.version.full":r`^(.+)$##v=\1`},attrs:[r`^ng-(app|controller|repeat|model|click)$`],
  scripts:[r`angular(\.min)?\.js|angular\.js/([\d.]+)##v=\2`]
});
T("Svelte","JS Frameworks","https://svelte.dev",{
  d:"A compiler-based framework: components are compiled to small imperative JS with no virtual DOM at runtime.",
  tip:"Svelte scopes CSS with svelte-<hash> classes, visible on almost every element.",
  classes:[r`^svelte-[a-z0-9]{5,8}$##c=90`],globals:[r`^__svelte`],
  body:[r`svelte/internal|\$\$invalidate##c=50`]
});
T("Solid","JS Frameworks","https://solidjs.com",{d:"Fine-grained reactive UI library with JSX and no virtual DOM.",attrs:[r`^data-hk$`],js:{"_$HY":""},scripts:[r`solid-js`]});
T("Preact","JS Frameworks","https://preactjs.com",{d:"A 3 KB alternative to React with the same API.",scripts:[r`preact(\.min)?\.js|preact@([\d.]+)##v=\2`],js:{preact:"","__PREACT_DEVTOOLS__":""},body:[r`preact/hooks|__PREACT##c=50`]});
T("Lit","JS Frameworks","https://lit.dev",{d:"Google's lightweight library for building standards-based Web Components.",js:{litElementVersions:r`^([\d.]+)##v=\1`,litHtmlVersions:r`^([\d.]+)##v=\1`,reactiveElementVersions:""},scripts:[r`lit(-element|-html)?[@/.]`]});
T("Alpine.js","JS Frameworks","https://alpinejs.dev",{d:"A rugged, minimal framework for adding reactivity directly in HTML with x-data attributes.",attrs:[r`^x-(data|init|show|bind:\w+|on:\w+)$`,r`^@click$##c=20`],js:{"Alpine.version":r`^([\d.]+)##v=\1`,Alpine:""},scripts:[r`alpinejs|alpine(\.min)?\.js`]});
T("htmx","JS Frameworks","https://htmx.org",{d:"Extends HTML with attributes (hx-get, hx-swap…) so servers can return HTML fragments instead of JSON — a 'hypermedia' approach to interactivity.",tip:"Watch the Network tab: htmx responses are small HTML snippets swapped into the page.",attrs:[r`^hx-(get|post|put|delete|trigger|target|swap|boost|push-url)$`],js:{"htmx.version":r`^([\d.]+)##v=\1`,htmx:""},scripts:[r`htmx(\.min)?\.js|htmx\.org@([\d.]+)##v=\2`],headers:{"hx-request":"","hx-trigger":"","vary":r`hx-request`}});
T("Hotwire (Turbo & Stimulus)","JS Frameworks","https://hotwired.dev",{d:"Rails-born approach that speeds up server-rendered apps with Turbo page/frame updates and Stimulus controllers.",tags:[r`^turbo-(frame|stream|cable-stream-source)$`],attrs:[r`^data-turbo(-[\w-]+)?$`,r`^data-controller$##c=40`],js:{Turbo:"",Stimulus:""},scripts:[r`@hotwired/(turbo|stimulus)|turbo(\.min)?\.js`]});
T("Livewire","JS Frameworks","https://livewire.laravel.com",{d:"Laravel package for building dynamic UIs in PHP without writing much JavaScript.",attrs:[r`^wire:(click|model|id|snapshot|initial-data)`],js:{Livewire:""},scripts:[r`livewire(\.min)?\.js|/livewire/livewire`],implies:["Laravel","PHP"]});
T("Inertia.js","JS Frameworks","https://inertiajs.com",{d:"Glue that lets classic server frameworks (Laravel, Rails) drive React/Vue/Svelte pages without a separate API.",headers:{"x-inertia":"",vary:r`x-inertia`},html:[r`data-page="\{&quot;component&quot;`]});
T("Phoenix LiveView","JS Frameworks","https://phoenixframework.org",{d:"Server-rendered realtime UI over WebSockets, from Elixir's Phoenix framework.",attrs:[r`^phx-`,r`^data-phx-(main|session|static)$`],js:{liveSocket:""},implies:["Elixir","Phoenix"]});
T("Ember.js","JS Frameworks","https://emberjs.com",{d:"Convention-over-configuration framework for ambitious web apps, with a strong long-term stability story.",js:{"Ember.VERSION":r`^(.+)$##v=\1`,Ember:""},classes:[r`^ember-view$|^ember-application$`],meta:{"[\\w-]+/config/environment":""}});
T("Backbone.js","JS Frameworks","https://backbonejs.org",{d:"Minimal MVC structure for JavaScript apps — a 2010s classic.",js:{"Backbone.VERSION":r`^(.+)$##v=\1`,Backbone:""}});
T("Knockout","JS Frameworks","https://knockoutjs.com",{d:"MVVM library with declarative bindings.",js:{"ko.version":r`^(.+)$##v=\1`},attrs:[r`^data-bind$##c=50`]});
T("Meteor","JS Frameworks","https://meteor.com",{d:"Full-stack JavaScript platform with realtime data.",js:{Meteor:"",__meteor_runtime_config__:""},implies:["Node.js","MongoDB"]});
T("Blazor","JS Frameworks","https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor",{d:"Microsoft's framework for building interactive UIs in C# — via WebAssembly or a SignalR connection.",scripts:[r`_framework/blazor\.(web|webassembly|server)\.js`],html:[r`<!--Blazor:`,r`_framework/`],implies:["ASP.NET"]});
T("Flutter Web","JS Frameworks","https://flutter.dev",{d:"Google's UI toolkit compiled to the web; renders to canvas (CanvasKit) or the DOM.",tags:[r`^flt-(glass-pane|scene-host)$`],scripts:[r`flutter(_bootstrap)?\.js|canvaskit`],js:{_flutter:""},implies:["Dart"]});
T("Mithril","JS Frameworks","https://mithril.js.org",{d:"Tiny, fast framework with hyperscript-style views.",js:{"m.version":r`^(.+)$##v=\1`},scripts:[r`mithril(\.min)?\.js`]});

// ───────────── Meta-frameworks ─────────────
T("Next.js","Meta-frameworks","https://nextjs.org",{
  d:"React framework from Vercel adding file-based routing, server rendering, static generation and API routes.",
  tip:"__NEXT_DATA__ in the HTML means the Pages Router; self.__next_f.push(...) chunks mean the App Router with React Server Components. Try /_next/image?url=… to see built-in image optimisation.",
  html:[r`/_next/static/`,r`id="__next"`,r`self\.__next_f`],
  js:{__NEXT_DATA__:"","next.version":r`^([\d.]+)##v=\1`,__next_f:""},
  headers:{"x-powered-by":r`Next\.js(?: ([\d.]+))?##v=\1`,"x-nextjs-cache":"","x-nextjs-page":"","x-nextjs-prerender":"","x-nextjs-matched-path":""},
  requests:[r`/_next/(data|image)/`],
  extract:{"Build ID":"js:__NEXT_DATA__.buildId","Router|a":r`js:__NEXT_DATA__##t=Pages Router`,"Router|b":r`html:self\.__next_f##t=App Router (React Server Components)`,"Locale":"js:__NEXT_DATA__.locale"},
  implies:["React","Node.js"]
});
T("Nuxt","Meta-frameworks","https://nuxt.com",{
  d:"The Vue equivalent of Next.js: auto-imports, file-based routing, server routes and hybrid rendering.",
  html:[r`/_nuxt/`,r`id="__nuxt"`,r`window\.__NUXT__`],js:{__NUXT__:"",$nuxt:"",useNuxtApp:""},
  headers:{"x-powered-by":r`Nuxt`},implies:["Vue.js","Node.js"]
});
T("Gatsby","Meta-frameworks","https://gatsbyjs.com",{
  d:"React-based static site generator with a GraphQL data layer and a large plugin ecosystem.",
  meta:{generator:r`Gatsby(?: ([\d.]+))?##v=\1`},html:[r`id="___gatsby"`,r`/page-data/[^"']*page-data\.json`],js:{"___gatsby":""},implies:["React","Node.js"]
});
T("Remix","Meta-frameworks","https://remix.run",{d:"Full-stack React framework centred on web standards, nested routes, loaders and actions.",js:{__remixContext:"",__remixManifest:"",__remixRouteModules:""},html:[r`window\.__remixContext`],implies:["React"]});
T("Astro","Meta-frameworks","https://astro.build",{
  d:"Content-focused framework that ships zero JavaScript by default and hydrates interactive 'islands' on demand.",
  tip:"Look for <astro-island> elements: each one is a hydrated component with its own client:* directive (load, idle, visible).",
  meta:{generator:r`Astro v?([\d.]+)##v=\1`},tags:[r`^astro-(island|slot|template-slot)$`],attrs:[r`^data-astro-(cid|source-file|reload|transition-\w+|prefetch)$`],html:[r`/_astro/`]
});
T("SvelteKit","Meta-frameworks","https://kit.svelte.dev",{d:"The official application framework for Svelte with routing, SSR and adapters for many hosts.",globals:[r`^__sveltekit_`],attrs:[r`^data-sveltekit-`],html:[r`/_app/immutable/`,r`__sveltekit`],implies:["Svelte"]});
T("Qwik","Meta-frameworks","https://qwik.dev",{d:"Resumable framework: no hydration — the server serialises state and the browser resumes lazily on interaction.",html:[r`q:container="(paused|resumed|html)"`,r`q:version="([\d.]+)"##v=\1`],attrs:[r`^q:(container|version|render|key)$`],scripts:[r`qwikloader`]});
T("Angular Universal / SSR","Meta-frameworks","https://angular.dev/guide/ssr",{d:"Server-side rendering for Angular apps.",attrs:[r`^ng-server-context$`],implies:["Angular"]});
T("Vike / vite-plugin-ssr","Meta-frameworks","https://vike.dev",{d:"Flexible SSR framework built on Vite.",html:[r`id="page-view"|__vike|window\.__vite_plugin_ssr`]});
T("RedwoodJS","Meta-frameworks","https://redwoodjs.com",{d:"Opinionated full-stack framework combining React, GraphQL and Prisma.",html:[r`id="redwood-app"`],implies:["React","GraphQL"]});
T("Docusaurus","Documentation","https://docusaurus.io",{d:"Meta's React-based documentation site generator with versioning and i18n.",meta:{generator:r`Docusaurus(?: v?([\d.]+))?##v=\1`},html:[r`__docusaurus`],implies:["React"]});
T("VitePress","Documentation","https://vitepress.dev",{d:"Vite- and Vue-powered static site generator for documentation.",meta:{generator:r`VitePress v?([\d.]+)##v=\1`},html:[r`class="[^"]*\bVP(Doc|Nav|Sidebar)`,r`__VP_HASH_MAP__`],implies:["Vue.js","Vite"]});
T("MkDocs","Documentation","https://mkdocs.org",{d:"Python static site generator for project docs, often with the Material theme.",meta:{generator:r`mkdocs-([\d.]+)##v=\1`},html:[r`md-(header|content|sidebar)|mkdocs-material`]});
T("Sphinx","Documentation","https://sphinx-doc.org",{d:"Python documentation generator behind Read the Docs and Python's own docs.",html:[r`_static/(documentation_options|sphinx_highlight)\.js|Created using <a href="https?://(www\.)?sphinx-doc\.org`],js:{DOCUMENTATION_OPTIONS:""}});
T("GitBook","Documentation","https://gitbook.com",{d:"Hosted documentation platform.",meta:{generator:r`GitBook(?: ([\d.]+))?##v=\1`},html:[r`gitbook-(root|core)|static-1\.gitbook\.com`]});
T("Mintlify","Documentation","https://mintlify.com",{d:"Hosted docs platform with API playgrounds.",html:[r`mintlify|mintcdn\.com`]});
T("Swagger UI","Documentation","https://swagger.io/tools/swagger-ui/",{d:"Interactive API documentation generated from OpenAPI specs.",html:[r`swagger-ui`],js:{SwaggerUIBundle:""},scripts:[r`swagger-ui`]});
T("Redoc","Documentation","https://redocly.com/redoc/",{d:"Three-panel OpenAPI reference renderer.",html:[r`<redoc|redoc-wrap`],js:{Redoc:""}});
T("ReadMe","Documentation","https://readme.com",{d:"Hosted API documentation with usage metrics.",html:[r`readme\.io|cdn\.readme\.io`],js:{"__README_ENV__":""}});
T("Storybook","Documentation","https://storybook.js.org",{d:"Workshop for building and documenting UI components in isolation.",html:[r`sb-show-main|storybook-preview-iframe`],js:{__STORYBOOK_ADDONS:""}});

// ───────────── Static site generators ─────────────
T("Jekyll","Static Site Generators","https://jekyllrb.com",{d:"Ruby-based static generator that powers GitHub Pages.",meta:{generator:r`Jekyll v?([\d.]+)##v=\1`}});
T("Hugo","Static Site Generators","https://gohugo.io",{d:"Extremely fast Go-based static site generator.",meta:{generator:r`Hugo ([\d.]+)##v=\1`}});
T("Eleventy","Static Site Generators","https://11ty.dev",{d:"Simple, flexible JavaScript static site generator.",meta:{generator:r`Eleventy v?([\d.]+)##v=\1`}});
T("Hexo","Static Site Generators","https://hexo.io",{d:"Node.js blog framework.",meta:{generator:r`Hexo v?([\d.]+)##v=\1`}});
T("VuePress","Static Site Generators","https://vuepress.vuejs.org",{d:"Vue-powered static site generator.",meta:{generator:r`VuePress v?([\d.]+)##v=\1`},implies:["Vue.js"]});
T("Zola","Static Site Generators","https://getzola.org",{d:"Rust-based static site generator in a single binary.",meta:{generator:r`Zola`}});
T("Pelican","Static Site Generators","https://getpelican.com",{d:"Python static site generator.",meta:{generator:r`Pelican`}});

// ───────────── Build tools ─────────────
T("webpack","Build Tools","https://webpack.js.org",{d:"The long-standing JavaScript bundler. Its runtime registers a global chunk array and loads code-split chunks on demand.",tip:"Search Sources for webpack:// to find the original module tree when source maps are available.",globals:[r`^webpackChunk`,r`^webpackJsonp`,r`^__webpack`],js:{webpackJsonp:"",__webpack_require__:"",__webpack_public_path__:""},body:[r`__webpack_require__|webpackChunk`]});
T("Vite","Build Tools","https://vitejs.dev",{d:"Next-generation dev server and Rollup-based bundler. Serves native ES modules in dev and hashed assets in production.",scripts:[r`/@vite/client|/assets/index-[\w-]{8}\.js##c=50`],html:[r`<script type="module" crossorigin src="/assets/[\w-]+-[\w-]{8}\.js"##c=70`],body:[r`__vitePreload|__vite__mapDeps|modulepreload-polyfill##c=70`]});
T("Parcel","Build Tools","https://parceljs.org",{d:"Zero-config bundler.",globals:[r`^parcelRequire`],js:{parcelRequire:""},body:[r`parcelRequire`]});
T("Turbopack","Build Tools","https://turbo.build/pack",{d:"Rust-based bundler from Vercel, used by Next.js.",globals:[r`^TURBOPACK`,r`^__turbopack`],body:[r`TURBOPACK|__turbopack_`],implies:["Next.js"]});
T("Rspack","Build Tools","https://rspack.dev",{d:"Rust port of webpack for much faster builds.",globals:[r`^rspackChunk`],body:[r`__rspack_require__`]});
T("esbuild","Build Tools","https://esbuild.github.io",{d:"Extremely fast Go-based bundler and minifier.",body:[r`__esbuild_|// [\w./-]+\.tsx?\n?##c=30`]});
T("core-js","JS Libraries","https://github.com/zloirock/core-js",{d:"Polyfills for modern ECMAScript features so older browsers keep working.",js:{"__core-js_shared__":"","__core-js_shared__.versions.0.version":r`^([\d.]+)##v=\1`},body:[r`core-js(-pure)?[/@]([\d.]+)##v=\2`]});
T("Zone.js","JS Libraries","https://github.com/angular/angular/tree/main/packages/zone.js",{d:"Execution-context tracking used by Angular's change detection.",js:{Zone:""},implies:["Angular"]});
T("Modernizr","JS Libraries","https://modernizr.com",{d:"Feature-detection library (older sites).",js:{"Modernizr._version":r`^(.+)$##v=\1`},scripts:[r`modernizr`],classes:[r`^(no-)?(js|flexbox|csstransforms|webp)$##c=20`]});

// ───────────── Core libraries ─────────────
T("jQuery","JS Libraries","https://jquery.com",{d:"The classic DOM/AJAX helper. Still on a huge share of the web thanks to WordPress and legacy code.",js:{"jQuery.fn.jquery":r`^([\d.]+)##v=\1`,jQuery:""},scripts:[r`jquery[/.-]v?([\d.]+)(\.min)?\.js##v=\1`,r`jquery(\.min)?\.js`],body:[r`jQuery (?:JavaScript Library )?v([\d.]+)##v=\1`]});
T("jQuery UI","JS Libraries","https://jqueryui.com",{d:"Widgets and interactions on top of jQuery.",js:{"jQuery.ui.version":r`^([\d.]+)##v=\1`},scripts:[r`jquery-ui`],implies:["jQuery"]});
T("jQuery Migrate","JS Libraries","https://github.com/jquery/jquery-migrate",{d:"Compatibility shim that keeps old jQuery plugins working with newer jQuery.",js:{"jQuery.migrateVersion":r`^([\d.]+)##v=\1`},scripts:[r`jquery-migrate`],implies:["jQuery"]});
T("Lodash","JS Libraries","https://lodash.com",{d:"Utility belt for arrays, objects and functions.",js:{"_.chunk":"","_.VERSION":r`^([\d.]+)##v=\1##c=30`},scripts:[r`lodash(\.min)?\.js|lodash@([\d.]+)##v=\2`],body:[r`lodash\.com/license|Lodash <https://lodash\.com/>`]});
T("Underscore.js","JS Libraries","https://underscorejs.org",{d:"Functional programming helpers, the inspiration for Lodash.",js:{"_.pluck":"","_.VERSION":r`^([\d.]+)##v=\1##c=20`},scripts:[r`underscore(-min)?\.js`]});
T("Axios","JS Libraries","https://axios-http.com",{d:"Promise-based HTTP client for the browser and Node.",js:{"axios.VERSION":r`^([\d.]+)##v=\1`,"axios.defaults":""},scripts:[r`axios(\.min)?\.js|axios@([\d.]+)##v=\2`],body:[r`Axios v([\d.]+)##v=\1`]});
T("Moment.js","JS Libraries","https://momentjs.com",{d:"Date/time parsing and formatting library (now in maintenance mode).",js:{"moment.version":r`^([\d.]+)##v=\1`},scripts:[r`moment(\.min)?\.js|moment@([\d.]+)##v=\2`]});
T("Day.js","JS Libraries","https://day.js.org",{d:"Tiny Moment-compatible date library.",js:{dayjs:""},scripts:[r`dayjs(\.min)?\.js|dayjs@([\d.]+)##v=\2`]});
T("date-fns","JS Libraries","https://date-fns.org",{d:"Modular date utility functions.",scripts:[r`date-fns`]});
T("Luxon","JS Libraries","https://moment.github.io/luxon/",{d:"Immutable date library built on Intl.",js:{luxon:""},scripts:[r`luxon`]});
T("D3.js","JS Libraries","https://d3js.org",{d:"Low-level toolkit for data-driven SVG/Canvas visualisation.",js:{"d3.version":r`^([\d.]+)##v=\1`},scripts:[r`d3(\.v(\d+))?(\.min)?\.js|d3@([\d.]+)##v=\5`]});
T("Chart.js","JS Libraries","https://chartjs.org",{d:"Simple canvas-based charts.",js:{"Chart.version":r`^([\d.]+)##v=\1`},scripts:[r`chart(\.umd)?(\.min)?\.js|chart\.js@([\d.]+)##v=\4`]});
T("Highcharts","JS Libraries","https://highcharts.com",{d:"Commercial SVG charting library.",js:{"Highcharts.version":r`^([\d.]+)##v=\1`},scripts:[r`highcharts`],classes:[r`^highcharts-`]});
T("ECharts","JS Libraries","https://echarts.apache.org",{d:"Apache's declarative charting library.",js:{"echarts.version":r`^([\d.]+)##v=\1`},scripts:[r`echarts`]});
T("Plotly","JS Libraries","https://plotly.com/javascript/",{d:"Scientific and interactive charts.",js:{"Plotly.version":r`^([\d.]+)##v=\1`},scripts:[r`plotly`],classes:[r`^plotly$|^js-plotly-plot$`]});
T("Three.js","JS Libraries","https://threejs.org",{d:"The standard JavaScript 3D library on top of WebGL/WebGPU.",tip:"Use the Spector.js extension to capture the WebGL calls behind a scene.",js:{"THREE.REVISION":r`^(\d+)##v=r\1`,__THREE__:r`^(\d+)##v=r\1`},scripts:[r`three(\.module)?(\.min)?\.js|three@([\d.]+)##v=\4`]});
T("Babylon.js","Animation","https://babylonjs.com",{d:"Full-featured 3D engine.",js:{"BABYLON.Engine.Version":r`^([\d.]+)##v=\1`,BABYLON:""}});
T("PixiJS","Animation","https://pixijs.com",{d:"Fast 2D WebGL renderer.",js:{"PIXI.VERSION":r`^([\d.]+)##v=\1`}});
T("p5.js","Animation","https://p5js.org",{d:"Creative-coding library inspired by Processing.",js:{"p5.prototype.constructor":"",p5:""},scripts:[r`p5(\.min)?\.js`]});
T("Spline","Animation","https://spline.design",{d:"3D design tool whose scenes embed as interactive web components.",tags:[r`^spline-viewer$`],requests:[r`prod\.spline\.design`],scripts:[r`@splinetool`]});
T("Rive","Animation","https://rive.app",{d:"Interactive vector animations with state machines.",scripts:[r`@rive-app|rive\.wasm`],requests:[r`\.riv(\?|$)`]});
T("GSAP","Animation","https://gsap.com",{d:"Industry-standard animation library for timelines, easing and scroll-triggered effects.",tip:"Look for ScrollTrigger: pinned sections and scrubbed animations on scroll are its hallmark.",js:{"gsap.version":r`^([\d.]+)##v=\1`,"TweenMax.version":r`^([\d.]+)##v=\1`,gsap:""},scripts:[r`gsap(\.min)?\.js|gsap@([\d.]+)##v=\2|TweenMax|TweenLite`],body:[r`GSAP ([\d.]+)##v=\1`]});
T("ScrollTrigger","Animation","https://gsap.com/docs/v3/Plugins/ScrollTrigger/",{d:"GSAP plugin for scroll-linked animation and pinning.",js:{"ScrollTrigger.version":r`^([\d.]+)##v=\1`,ScrollTrigger:""},scripts:[r`ScrollTrigger`],implies:["GSAP"]});
T("Lenis","Animation","https://lenis.darkroom.engineering",{d:"Lightweight smooth-scroll library used on many award-style sites.",classes:[r`^lenis(-smooth|-stopped|-scrolling)?$`],js:{lenis:"",Lenis:""},scripts:[r`lenis|@studio-freight/lenis`]});
T("Locomotive Scroll","Animation","https://locomotivemtl.github.io/locomotive-scroll/",{d:"Smooth scrolling with parallax via data attributes.",attrs:[r`^data-scroll(-container|-section|-speed)?$`],classes:[r`^has-scroll-(init|smooth)$`],scripts:[r`locomotive-scroll`]});
T("Framer Motion","Animation","https://motion.dev",{
  d:"Declarative animation library for React. Modern releases are published as Motion and can be imported from motion/react; older applications commonly import from framer-motion.",
  attrs:[r`^data-projection-id$##c=12`,r`^data-framer-motion##c=12`],
  scripts:[r`(?:^|[/@])framer-motion(?:[./@]|$)##c=75`,r`(?:^|[/@])motion-dom(?:[./@]|$)##c=65`,r`(?:^|[/@])motion-utils(?:[./@]|$)##c=65`],
  body:[
    r`(?:from|require\()\s*["']framer-motion["']##c=88`,
    r`(?:from|require\()\s*["']motion/react["']##c=88`,
    r`(?:from|require\()\s*["']motion["']##c=82`,
    r`(?:^|["'\/@])framer-motion(?:[/@"'\.]|$)##c=82`,
    r`(?:^|["'\/@])motion-dom(?:[/@"'\.]|$)##c=76`,
    r`(?:^|["'\/@])motion-utils(?:[/@"'\.]|$)##c=76`
  ],
  sourceMaps:[
    r`(?:^|[/\\])node_modules[/\\](?:framer-motion|motion)(?:[/\\])##c=98`,
    r`(?:^|[/\\])(?:framer-motion|motion)(?:[/\\](?:react|dom|utils))[/\\]##c=98`,
    r`(?:^|["'])(?:framer-motion|motion/react|motion-dom|motion-utils)(?:["']|[/])##c=96`
  ],
  sourceNames:[
    r`(?:^|[/\\])node_modules[/\\](?:framer-motion|motion)(?:[/\\])##c=100`,
    r`(?:^|[/\\])(?:framer-motion|motion)(?:[/\\](?:react|dom|utils))[/\\]##c=100`
  ],
  js:{"probe:framerMotion":"##c=96"}
});
T("anime.js","Animation","https://animejs.com",{d:"Lightweight JavaScript animation engine.",js:{"anime.version":r`^([\d.]+)##v=\1`},scripts:[r`anime(\.min)?\.js`]});
T("Lottie","Animation","https://airbnb.io/lottie/",{d:"Renders After Effects animations exported as JSON.",tip:"Lottie files are plain JSON — open the request in Network to study the animation.",js:{lottie:"",bodymovin:""},tags:[r`^(lottie-player|dotlottie-player|lottie-web)$`],scripts:[r`lottie|bodymovin|dotlottie`],requests:[r`\.lottie(\?|$)`]});
T("AOS","Animation","https://michalsnik.github.io/aos/",{d:"Animate-on-scroll via data-aos attributes.",js:{AOS:""},attrs:[r`^data-aos$`],scripts:[r`aos(\.min)?\.js`]});
T("ScrollMagic","Animation","https://scrollmagic.io",{d:"Scroll interaction library.",js:{ScrollMagic:""}});
T("Barba.js","Animation","https://barba.js.org",{d:"Smooth page transitions between server-rendered pages.",js:{barba:""},attrs:[r`^data-barba(-namespace)?$`],scripts:[r`barba`]});
T("Swiper","JS Libraries","https://swiperjs.com",{d:"Touch slider used for carousels and galleries.",js:{Swiper:""},classes:[r`^swiper(-wrapper|-slide)?$`],scripts:[r`swiper(-bundle)?(\.min)?\.js|swiper@([\d.]+)##v=\3`],css:[r`--swiper-`]});
T("Slick","JS Libraries","https://kenwheeler.github.io/slick/",{d:"jQuery carousel plugin.",js:{"jQuery.fn.slick":""},classes:[r`^slick-(slider|slide|track|list)$`],implies:["jQuery"]});
T("Splide","JS Libraries","https://splidejs.com",{d:"Lightweight accessible slider.",classes:[r`^splide(__track|__slide|__list)?$`],scripts:[r`splide`]});
T("Flickity","JS Libraries","https://flickity.metafizzy.co",{d:"Touch-friendly carousel.",js:{Flickity:""},classes:[r`^flickity-`]});
T("Owl Carousel","JS Libraries","https://owlcarousel2.github.io/OwlCarousel2/",{d:"jQuery carousel plugin.",classes:[r`^owl-(carousel|stage|item)$`],implies:["jQuery"]});
T("Isotope","JS Libraries","https://isotope.metafizzy.co",{d:"Filterable, sortable masonry layouts.",js:{Isotope:""},classes:[r`^isotope(-item)?$`]});
T("Masonry","JS Libraries","https://masonry.desandro.com",{d:"Cascading grid layout library.",js:{Masonry:""}});
T("Fancybox","JS Libraries","https://fancyapps.com",{d:"Lightbox for images, video and iframes.",js:{Fancybox:"","jQuery.fancybox":""},classes:[r`^fancybox__`,r`^fancybox-`]});
T("PhotoSwipe","JS Libraries","https://photoswipe.com",{d:"Mobile-friendly image gallery lightbox.",classes:[r`^pswp(__\w+)?$`],js:{PhotoSwipe:""}});
T("lazysizes","JS Libraries","https://github.com/aFarkas/lazysizes",{d:"Lazy loader for images and iframes.",js:{lazySizes:""},classes:[r`^lazyload(ed|ing)?$##c=50`]});
T("Select2","JS Libraries","https://select2.org",{d:"Searchable enhanced select boxes for jQuery.",js:{"jQuery.fn.select2":""},classes:[r`^select2(-container|-selection)?$`]});
T("Popper / Floating UI","JS Libraries","https://floating-ui.com",{d:"Positioning engine for tooltips, popovers and dropdowns.",js:{Popper:""},scripts:[r`popper(\.min)?\.js|@popperjs|floating-ui`]});
T("Tippy.js","JS Libraries","https://atomiks.github.io/tippyjs/",{d:"Tooltip and popover library.",js:{tippy:""},attrs:[r`^data-tippy-root$`]});
T("Socket.IO","APIs & Data","https://socket.io",{d:"Realtime bidirectional messaging with automatic fallbacks.",tip:"In DevTools → Network → WS, click the socket.io connection to watch frames.",js:{"io.protocol":""},scripts:[r`socket\.io(\.min)?\.js|socket\.io-client`],requests:[r`/socket\.io/\?.*EIO=\d`]});
T("Pusher","APIs & Data","https://pusher.com",{d:"Hosted realtime WebSocket channels.",js:{Pusher:""},requests:[r`ws-[\w-]+\.pusher\.com|sockjs-[\w-]+\.pusher\.com`],scripts:[r`js\.pusher\.com`]});
T("GraphQL","APIs & Data","https://graphql.org",{d:"Query language where the client asks for exactly the fields it needs from a single endpoint.",tip:"In Network, filter by 'graphql' and inspect the query in the request payload.",requests:[r`/graphql(\?|$|/)|/gql(\?|$)`],js:{__APOLLO_STATE__:"",__APOLLO_CLIENT__:""}});
T("Apollo GraphQL","APIs & Data","https://apollographql.com",{d:"Popular GraphQL client and server toolkit with normalised caching.",js:{__APOLLO_CLIENT__:"",__APOLLO_STATE__:""},body:[r`apollo-client|@apollo/client##c=50`],implies:["GraphQL"]});
T("tRPC","APIs & Data","https://trpc.io",{d:"End-to-end typesafe APIs without schemas or codegen.",requests:[r`/api/trpc/`]});
T("Firebase","Backend Platforms","https://firebase.google.com",{d:"Google's app platform: hosting, auth, Firestore, storage and analytics.",js:{firebase:"","firebase.SDK_VERSION":r`^([\d.]+)##v=\1`},scripts:[r`firebase(-app|-auth|-firestore)?(\.js|-compat)?|gstatic\.com/firebasejs/([\d.]+)/##v=\3`],requests:[r`firestore\.googleapis\.com|firebaseio\.com|firebaseinstallations\.googleapis\.com`],storage:[r`^firebase:`,r`firebaseLocalStorageDb`]});
T("Supabase","Backend Platforms","https://supabase.com",{d:"Open-source Firebase alternative on Postgres with auth, storage and realtime.",requests:[r`[\w-]+\.supabase\.(co|in)/(rest|auth|storage|realtime)/v1`],scripts:[r`@supabase/supabase-js|supabase(\.min)?\.js`],implies:["PostgreSQL"]});
T("Appwrite","Backend Platforms","https://appwrite.io",{d:"Open-source backend server.",requests:[r`/v1/(account|databases|storage)/.*|cloud\.appwrite\.io`]});
T("Convex","Backend Platforms","https://convex.dev",{d:"Reactive backend with TypeScript functions.",requests:[r`\.convex\.(cloud|site)`]});
T("PocketBase","Backend Platforms","https://pocketbase.io",{d:"Single-file Go backend with SQLite.",requests:[r`/api/collections/[\w-]+/records`],implies:["Go","SQLite"]});
T("Hasura","Backend Platforms","https://hasura.io",{d:"Instant GraphQL APIs over databases.",requests:[r`/v1/graphql|hasura\.app`],implies:["GraphQL","PostgreSQL"]});
T("AWS Amplify","Backend Platforms","https://aws.amazon.com/amplify/",{d:"Full-stack toolkit and hosting on AWS.",js:{aws_amplify:""},requests:[r`amplifyapp\.com|amplify-[\w.-]+\.amazonaws\.com`],headers:{"x-amz-cf-id":"##c=0"}});

// ───────────── State management ─────────────
T("Redux","State Management","https://redux.js.org",{d:"Predictable global state container based on actions and reducers.",tip:"Install Redux DevTools to time-travel through actions.",js:{__PRELOADED_STATE__:"##c=40",__REDUX_STATE__:"##c=40"},storage:[r`^persist:root$`],body:[r`Redux(\.|:)|redux\.js\.org/Errors\?code=`]});
T("MobX","State Management","https://mobx.js.org",{d:"Transparent reactive state management.",js:{__mobxGlobals:"",__mobxInstanceCount:""}});
T("Zustand","State Management","https://zustand-demo.pmnd.rs",{d:"Small, fast hook-based store for React.",storage:[r`zustand`],body:[r`zustand##c=40`]});
T("TanStack Query","State Management","https://tanstack.com/query",{d:"Server-state library that handles fetching, caching and background refetching.",js:{__TANSTACK_QUERY_CLIENT__:"",__REACT_QUERY_STATE__:""},storage:[r`REACT_QUERY_OFFLINE_CACHE|tanstack-query`],scripts:[r`@tanstack/(react-)?query`]});
T("SWR","State Management","https://swr.vercel.app",{d:"React hooks for data fetching with stale-while-revalidate.",body:[r`swr/(core|infinite)##c=40`]});

// ───────────── UI frameworks ─────────────
T("Tailwind CSS","UI Frameworks","https://tailwindcss.com",{
  d:"Utility-first CSS framework: styling is done with small single-purpose classes composed directly in markup.",
  tip:"Utility strings like 'flex items-center gap-4 md:grid-cols-3' are the giveaway. Tailwind v3/v4 also defines --tw-* custom properties.",
  css:[r`--tw-(ring|shadow|border-spacing|translate|rotate|blur|gradient)[\w-]*\s*:##c=90`,r`tailwindcss v([\d.]+)##v=\1`,r`\*, ::before, ::after\s*\{\s*--tw-`],
  body:[r`tailwindcss v([\d.]+)##v=\1`],
  stats:{tailwindVariant:8,tailwindUtil:40}
});
T("Bootstrap","UI Frameworks","https://getbootstrap.com",{
  d:"The most widely used component and grid framework. Ships ready-made buttons, navbars, modals and a 12-column responsive grid.",
  css:[r`Bootstrap v([\d.]+)##v=\1`,r`--bs-(blue|body-font-family|gutter-x)\s*:##c=80`],
  js:{"bootstrap.Tooltip.VERSION":r`^([\d.]+)##v=\1`,"bootstrap.Alert.VERSION":r`^([\d.]+)##v=\1`,"jQuery.fn.tooltip.Constructor.VERSION":r`^([\d.]+)##v=\1`},
  scripts:[r`bootstrap(\.bundle)?(\.min)?\.js|bootstrap@([\d.]+)##v=\3`],styles:[r`bootstrap(\.min)?\.css|bootstrap@([\d.]+)##v=\2`],
  attrs:[r`^data-bs-(toggle|target|dismiss|ride)$`],stats:{bootstrapish:12},body:[r`Bootstrap v([\d.]+)##v=\1`]
});
T("Bulma","UI Frameworks","https://bulma.io",{d:"Modern flexbox-based CSS framework with no JavaScript.",css:[r`bulma(\.min)?\.css|\.is-(primary|link|info)\b.*\.button##c=30`],styles:[r`bulma`],classes:[r`^(columns|column|hero-body|navbar-(brand|menu|burger))$`,r`^is-(primary|link|info|success|warning|danger)$`]});
T("Foundation","UI Frameworks","https://get.foundation",{d:"Zurb's responsive front-end framework.",classes:[r`^(top-bar|grid-x|grid-container|cell)$`],js:{"Foundation.version":r`^([\d.]+)##v=\1`},styles:[r`foundation(\.min)?\.css`]});
T("Material UI (MUI)","UI Frameworks","https://mui.com",{d:"React component library implementing Google's Material Design.",classes:[r`^Mui[A-Z]\w+-\w+$`,r`^MuiButtonBase-root$`],implies:["React","Emotion"]});
T("Ant Design","UI Frameworks","https://ant.design",{d:"Enterprise-class React UI kit from Ant Group.",classes:[r`^ant-(btn|layout|menu|table|input|form|card|modal)`,r`^ant-`],css:[r`\.ant-btn`],implies:["React"]});
T("Chakra UI","UI Frameworks","https://chakra-ui.com",{d:"Accessible, themeable React component library.",classes:[r`^chakra-[\w-]+$`],css:[r`--chakra-(colors|space|fonts)`],implies:["React","Emotion"]});
T("Mantine","UI Frameworks","https://mantine.dev",{d:"Full-featured React component and hooks library.",classes:[r`^mantine-[\w-]+$`,r`^m_[0-9a-f]{8,}$##c=70`],css:[r`--mantine-(color|font|spacing)`],implies:["React"]});
T("Radix UI","UI Frameworks","https://radix-ui.com",{d:"Unstyled, accessible primitives for React (dialogs, dropdowns, tabs) — the foundation under shadcn/ui.",attrs:[r`^data-radix-`,r`^data-state$##c=25`],css:[r`--radix-`],ids:0,html:[r`id="radix-[:\w-]+"`],implies:["React"]});
T("shadcn/ui","UI Frameworks","https://ui.shadcn.com",{d:"Copy-paste component collection built on Radix UI and Tailwind — you own the code rather than importing a package.",attrs:[r`^data-slot$##c=45`],css:[r`--(muted-foreground|card-foreground|popover-foreground)\s*:##c=70`,r`--radius\s*:\s*[\d.]+rem##c=15`]});
T("Headless UI","UI Frameworks","https://headlessui.com",{d:"Unstyled accessible components for React/Vue from the Tailwind team.",attrs:[r`^data-headlessui-(state|focus-visible)$`],html:[r`id="headlessui-[\w:-]+"`]});
T("daisyUI","UI Frameworks","https://daisyui.com",{d:"Tailwind component plugin that adds semantic class names like btn and card.",classes:[r`^(drawer-content|modal-box|hero-content|navbar-(start|center|end)|menu-(title|horizontal)|btn-(ghost|neutral|outline))$`],css:[r`daisyUI`],implies:["Tailwind CSS"]});
T("Flowbite","UI Frameworks","https://flowbite.com",{d:"Tailwind-based component library.",attrs:[r`^data-(dropdown|modal|collapse|drawer)-(toggle|target)$`],scripts:[r`flowbite`]});
T("Angular Material","UI Frameworks","https://material.angular.io",{d:"Material Design components for Angular.",tags:[r`^mat-(toolbar|sidenav|card|form-field|table)$`],classes:[r`^mat-(mdc-)?(button|form-field|toolbar|card)`],implies:["Angular"]});
T("Vuetify","UI Frameworks","https://vuetifyjs.com",{d:"Material Design component framework for Vue.",classes:[r`^v-(application|btn|card|app-bar|main)$`],implies:["Vue.js"]});
T("Quasar","UI Frameworks","https://quasar.dev",{d:"Vue framework for SPA, SSR, mobile and desktop from one codebase.",classes:[r`^q-(btn|layout|page|header|drawer)$`],implies:["Vue.js"]});
T("Element Plus","UI Frameworks","https://element-plus.org",{d:"Vue 3 component library.",classes:[r`^el-(button|input|menu|table|dialog)$`],implies:["Vue.js"]});
T("PrimeReact / PrimeNG / PrimeVue","UI Frameworks","https://primefaces.org",{d:"Component suites for React, Angular and Vue.",classes:[r`^p-(component|button|inputtext|datatable|dialog)$`]});
T("Fluent UI","UI Frameworks","https://fluentui.dev",{d:"Microsoft's design system components.",classes:[r`^(ms-Button|ms-Fabric|fui-[A-Z]\w+)$`]});
T("Carbon Design System","UI Frameworks","https://carbondesignsystem.com",{d:"IBM's open-source design system.",classes:[r`^(cds|bx)--[\w-]+$`]});
T("Semantic UI","UI Frameworks","https://semantic-ui.com",{d:"Human-readable class-name framework.",html:[r`class="ui (segment|button|grid|menu|container)`],styles:[r`semantic(\.min)?\.css`]});
T("Materialize","UI Frameworks","https://materializecss.com",{d:"Material Design CSS framework.",classes:[r`^(materialize-css|waves-effect|collection-item)$`],scripts:[r`materialize(\.min)?\.js`]});
T("UnoCSS","UI Frameworks","https://unocss.dev",{d:"Instant on-demand atomic CSS engine.",css:[r`--un-(ring|shadow|translate|rotate)[\w-]*\s*:`,r`layer: unocss`]});
T("Pico CSS","UI Frameworks","https://picocss.com",{d:"Minimal semantic CSS framework.",css:[r`--pico-[\w-]+\s*:`],styles:[r`pico(\.min)?\.css|@picocss`]});
T("Emotion","UI Frameworks","https://emotion.sh",{d:"CSS-in-JS library that injects generated class names (css-abc123) at runtime.",attrs:[r`^data-emotion$`],classes:[r`^css-[a-z0-9]{5,8}(-[A-Za-z0-9]+)?$##c=60`],html:[r`<style data-emotion=`]});
T("styled-components","UI Frameworks","https://styled-components.com",{d:"CSS-in-JS for React using tagged template literals; injects sc-* classes.",attrs:[r`^data-styled(-version)?$`],classes:[r`^sc-[a-zA-Z]{5,}(-\d+)?$##c=70`],html:[r`<style data-styled=`]});
T("styled-jsx","UI Frameworks","https://github.com/vercel/styled-jsx",{d:"Scoped CSS-in-JS bundled with Next.js.",classes:[r`^jsx-\d{6,}$`]});
T("CSS Modules","UI Frameworks","https://github.com/css-modules/css-modules",{d:"Locally scoped class names, hashed at build time.",stats:{cssModules:12}});
T("Sass / SCSS output","UI Frameworks","https://sass-lang.com",{d:"CSS preprocessor; only sourcemap comments reveal it in production.",css:[r`sourceMappingURL=[^*]*\.scss\.map|\/\*# sourceMappingURL=.*\.css\.map`,r`\.scss`]});

// ───────────── Icon sets ─────────────
T("Font Awesome","Icon Sets","https://fontawesome.com",{d:"The most popular icon font and SVG set.",css:[r`Font Awesome (?:Free |Pro )?([\d.]+)##v=\1`],styles:[r`font-?awesome(?:/|@|-)?v?([\d.]+)?##v=\1`,r`kit\.fontawesome\.com|use\.fontawesome\.com`],classes:[r`^fa[srlbdt]?$`,r`^fa-(solid|regular|brands|light|duotone)$`],js:{FontAwesome:"",FontAwesomeKitConfig:""},requests:[r`fa-(solid|regular|brands)-\d+\.woff2`]});
T("Material Icons / Symbols","Icon Sets","https://fonts.google.com/icons",{d:"Google's icon font ligatures (write 'home' → 🏠 icon).",classes:[r`^material-(icons|symbols)(-\w+)?$`],styles:[r`fonts\.googleapis\.com/(icon|css2?)\?family=Material`]});
T("Bootstrap Icons","Icon Sets","https://icons.getbootstrap.com",{d:"Official Bootstrap SVG icon set.",classes:[r`^bi-[\w-]+$`,r`^bi$`],styles:[r`bootstrap-icons`]});
T("Feather Icons","Icon Sets","https://feathericons.com",{d:"Simple 24px stroke icons.",js:{feather:""},attrs:[r`^data-feather$`]});
T("Lucide","Icon Sets","https://lucide.dev",{d:"Community fork of Feather with a much larger set.",attrs:[r`^data-lucide$`],classes:[r`^lucide(-[\w-]+)?$`],scripts:[r`lucide`]});
T("Ionicons","Icon Sets","https://ionic.io/ionicons",{d:"Icons from the Ionic team as web components.",tags:[r`^ion-icon$`],scripts:[r`ionicons`]});
T("Remix Icon","Icon Sets","https://remixicon.com",{d:"Neutral-style open-source icon library.",classes:[r`^ri-[\w-]+$`],styles:[r`remixicon`]});
T("Boxicons","Icon Sets","https://boxicons.com",{d:"Icon set with regular, solid and logo styles.",classes:[r`^bx(s|l)?-[\w-]+$`,r`^bx$`],styles:[r`boxicons`]});
T("Tabler Icons","Icon Sets","https://tabler.io/icons",{d:"Over 5,000 free SVG icons.",classes:[r`^ti(-[\w-]+)?$`],styles:[r`tabler-icons`]});
T("Phosphor Icons","Icon Sets","https://phosphoricons.com",{d:"Flexible icon family with six weights.",classes:[r`^ph(-(bold|fill|light|thin|duotone))?$`],scripts:[r`@phosphor-icons`]});
T("Iconify","Icon Sets","https://iconify.design",{d:"Unified access to 200k+ icons from many sets.",tags:[r`^iconify-icon$`],scripts:[r`iconify`],requests:[r`api\.(iconify\.design|simplesvg\.com|unisvg\.com)`]});
T("Dashicons","Icon Sets","https://developer.wordpress.org/resource/dashicons/",{d:"WordPress admin icon font.",classes:[r`^dashicons(-[\w-]+)?$`],styles:[r`dashicons`]});
T("Glyphicons","Icon Sets","https://glyphicons.com",{d:"Icon font bundled with Bootstrap 3.",classes:[r`^glyphicon(-[\w-]+)?$`]});
T("IcoMoon","Icon Sets","https://icomoon.io",{d:"Custom icon-font generator.",css:[r`font-family:\s*['"]?icomoon`],styles:[r`icomoon`]});

// ───────────── Fonts ─────────────
T("Google Fonts","Fonts","https://fonts.google.com",{d:"Free hosted typefaces via CSS API. Serving from Google adds DNS/TLS connections — many teams self-host instead.",tip:"Look for display=swap in the CSS URL, and preconnect hints to fonts.gstatic.com.",styles:[r`fonts\.googleapis\.com`],requests:[r`fonts\.(googleapis|gstatic)\.com`],html:[r`fonts\.googleapis\.com`],extract:{Families:r`styles:family=([^&:@]+)##all`}});
T("Adobe Fonts","Fonts","https://fonts.adobe.com",{d:"Adobe's subscription font service (Typekit).",styles:[r`use\.typekit\.net`],scripts:[r`use\.typekit\.(net|com)`],requests:[r`use\.typekit\.net|p\.typekit\.net`],js:{Typekit:""}});
T("Bunny Fonts","Fonts","https://fonts.bunny.net",{d:"Privacy-friendly Google Fonts drop-in from Bunny.net.",styles:[r`fonts\.bunny\.net`],requests:[r`fonts\.bunny\.net`]});
T("Fontshare","Fonts","https://fontshare.com",{d:"Free quality fonts from Indian Type Foundry.",styles:[r`api\.fontshare\.com`],requests:[r`cdn\.fontshare\.com`]});
T("Fonts.com / Monotype","Fonts","https://fonts.com",{d:"Monotype's web font service.",styles:[r`fast\.fonts\.net|fonts\.com`]});
T("Hoefler&Co Cloud.typography","Fonts","https://typography.com",{d:"Web fonts from Hoefler&Co.",styles:[r`cloud\.typography\.com`]});
T("next/font","Fonts","https://nextjs.org/docs/app/api-reference/components/font",{d:"Next.js font optimisation: fonts are downloaded at build time, self-hosted and given a size-adjusted fallback to avoid layout shift.",tip:"Look for font-family names like __Inter_a1b2c3 and __Inter_Fallback_a1b2c3 in the CSS.",css:[r`font-family:\s*['"]?__[A-Za-z_]+_(Fallback_)?[a-f0-9]{6,8}`],implies:["Next.js"]});
T("Fontsource / self-hosted fonts","Fonts","https://fontsource.org",{d:"Fonts bundled with the site itself, avoiding third-party requests.",requests:[r`@fontsource|/fonts?/[\w-]+\.woff2##c=30`]});

// ───────────── Video & media ─────────────
T("YouTube","Video & Media","https://youtube.com",{d:"Embedded YouTube video player.",iframes:[r`youtube(-nocookie)?\.com/embed`],scripts:[r`youtube\.com/iframe_api`],requests:[r`i\.ytimg\.com|youtube\.com/(embed|youtubei)`],js:{YT:""}});
T("Vimeo","Video & Media","https://vimeo.com",{d:"Professional video hosting and player.",iframes:[r`player\.vimeo\.com`],scripts:[r`player\.vimeo\.com/api`],requests:[r`vimeocdn\.com`]});
T("Wistia","Video & Media","https://wistia.com",{d:"Marketing-focused video hosting.",scripts:[r`fast\.wistia\.(com|net)`],js:{Wistia:"",_wq:""}});
T("JW Player","Video & Media","https://jwplayer.com",{d:"Commercial video player and streaming platform.",js:{"jwplayer.version":r`^(.+)$##v=\1`,jwplayer:""},scripts:[r`jwplayer|jwpcdn\.com`]});
T("Video.js","Video & Media","https://videojs.com",{d:"Open-source HTML5 video player framework.",js:{"videojs.VERSION":r`^([\d.]+)##v=\1`,videojs:""},classes:[r`^video-js$`],scripts:[r`video(js)?(\.min)?\.js|video\.js@([\d.]+)##v=\3`]});
T("Plyr","Video & Media","https://plyr.io",{d:"Simple, accessible HTML5 media player.",js:{Plyr:""},classes:[r`^plyr(--\w+)?$`]});
T("hls.js","Video & Media","https://github.com/video-dev/hls.js",{d:"Plays HLS adaptive streams in browsers using Media Source Extensions.",js:{"Hls.version":r`^([\d.]+)##v=\1`,Hls:""},scripts:[r`hls(\.min)?\.js|hls\.js@([\d.]+)##v=\2`],requests:[r`\.m3u8(\?|$)`]});
T("Shaka Player","Video & Media","https://github.com/shaka-project/shaka-player",{d:"Google's DASH/HLS player.",js:{"shaka.Player.version":r`^(.+)$##v=\1`,shaka:""}});
T("Mux","Video & Media","https://mux.com",{d:"Video API for streaming and analytics.",tags:[r`^mux-(player|video)$`],requests:[r`stream\.mux\.com|image\.mux\.com`],scripts:[r`mux`]});
T("Cloudinary","CDN","https://cloudinary.com",{d:"Media platform that transforms and delivers images/video on the fly via URL parameters.",tip:"Change the transformation string in a res.cloudinary.com URL (w_400,f_auto,q_auto) to see it re-render.",requests:[r`res\.cloudinary\.com`],html:[r`res\.cloudinary\.com`]});
T("imgix","CDN","https://imgix.com",{d:"Real-time image processing CDN.",requests:[r`\.imgix\.net`],html:[r`\.imgix\.net`]});
T("ImageKit","CDN","https://imagekit.io",{d:"Image and video optimisation CDN.",requests:[r`ik\.imagekit\.io`]});
T("Cloudflare Images","CDN","https://developers.cloudflare.com/images/",{d:"Image storage and resizing at Cloudflare's edge.",requests:[r`imagedelivery\.net|/cdn-cgi/image/`]});
T("Uploadcare","CDN","https://uploadcare.com",{d:"File upload and image CDN.",requests:[r`ucarecdn\.com`]});

// ───────────── Maps ─────────────
T("Google Maps","Maps","https://developers.google.com/maps",{d:"Google's maps, places and directions APIs.",scripts:[r`maps\.(google|googleapis)\.com/maps/api/js`],iframes:[r`google\.com/maps/embed`],js:{"google.maps.version":r`^([\d.]+)##v=\1`,"google.maps":""},extract:{"API key":r`scripts:maps/api/js\?[^"']*key=([\w-]{20,})`}});
T("Mapbox","Maps","https://mapbox.com",{d:"Customisable vector maps and geocoding.",js:{"mapboxgl.version":r`^([\d.]+)##v=\1`,mapboxgl:""},scripts:[r`api\.mapbox\.com/mapbox-gl-js/v([\d.]+)##v=\1`],requests:[r`api\.mapbox\.com|tiles\.mapbox\.com`]});
T("MapLibre GL","Maps","https://maplibre.org",{d:"Open-source fork of Mapbox GL JS.",js:{"maplibregl.version":r`^([\d.]+)##v=\1`,maplibregl:""}});
T("Leaflet","Maps","https://leafletjs.com",{d:"Lightweight open-source interactive maps.",js:{"L.version":r`^([\d.]+)##v=\1`},classes:[r`^leaflet-(container|pane|tile)$`],scripts:[r`leaflet(\.min)?\.js|leaflet@([\d.]+)##v=\2`]});
T("OpenStreetMap","Maps","https://openstreetmap.org",{d:"Community-built map data and tiles.",requests:[r`tile\.openstreetmap\.org|[abc]\.tile\.openstreetmap`],iframes:[r`openstreetmap\.org/export/embed`]});
T("Apple MapKit JS","Maps","https://developer.apple.com/maps/mapkitjs/",{d:"Apple Maps on the web.",js:{mapkit:""},scripts:[r`cdn\.apple-mapkit\.com`]});

// ───────────── Widgets ─────────────
T("Disqus","Widgets","https://disqus.com",{d:"Hosted comment threads.",js:{DISQUS:"",disqus_shortname:""},scripts:[r`disqus\.com/embed`],iframes:[r`disqus\.com/embed`]});
T("X / Twitter embeds","Widgets","https://developer.x.com/en/docs/twitter-for-websites",{d:"Embedded tweets and timelines.",scripts:[r`platform\.twitter\.com/widgets\.js`],js:{twttr:""},classes:[r`^twitter-(tweet|timeline)$`]});
T("Instagram embeds","Widgets","https://developers.facebook.com/docs/instagram/embedding",{d:"Embedded Instagram posts.",scripts:[r`instagram\.com/embed\.js`],classes:[r`^instagram-media$`]});
T("Facebook SDK","Widgets","https://developers.facebook.com/docs/javascript",{d:"Facebook's JavaScript SDK for plugins and login.",scripts:[r`connect\.facebook\.net/[\w_]+/(sdk|all)\.js`],js:{FB:""},html:[r`id="fb-root"`]});
T("AddThis","Widgets","https://addthis.com",{d:"Social sharing buttons.",scripts:[r`addthis(_widget)?\.com|addthis_widget\.js`],js:{addthis:""}});
T("Calendly","Widgets","https://calendly.com",{d:"Embedded scheduling widget.",scripts:[r`assets\.calendly\.com`],iframes:[r`calendly\.com`],js:{Calendly:""}});
T("Typeform","Widgets","https://typeform.com",{d:"Conversational forms.",scripts:[r`embed\.typeform\.com`],iframes:[r`typeform\.com`]});
T("Tally","Widgets","https://tally.so",{d:"Free form builder.",scripts:[r`tally\.so/widgets`],iframes:[r`tally\.so/embed`]});
T("Trustpilot","Reviews","https://trustpilot.com",{d:"Review platform whose TrustBox widgets are loaded from Trustpilot's CDN.",scripts:[r`widget\.trustpilot\.com`],classes:[r`^trustpilot-widget$`]});
T("Yotpo","Reviews","https://yotpo.com",{d:"Reviews and loyalty for ecommerce.",scripts:[r`staticw2\.yotpo\.com|yotpo\.com`],js:{yotpo:""}});
T("Judge.me","Reviews","https://judge.me",{d:"Product reviews for Shopify.",scripts:[r`judge\.me|judgeme`],js:{jdgm:""}});
T("Reviews.io","Reviews","https://reviews.io",{d:"Review collection and display.",scripts:[r`reviews\.io`]});

// ───────────── Accessibility ─────────────
T("UserWay","Accessibility","https://userway.org",{d:"Accessibility overlay widget.",scripts:[r`cdn\.userway\.org`],js:{UserWay:""}});
T("accessiBe","Accessibility","https://accessibe.com",{d:"AI-driven accessibility overlay.",scripts:[r`acsbapp\.com|acsbap\.com`],js:{acsbJS:""}});
T("AudioEye","Accessibility","https://audioeye.com",{d:"Accessibility monitoring and overlay.",scripts:[r`audioeye\.com`]});
