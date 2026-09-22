// Languages, frameworks, servers, proxies, CDNs, hosting, security.
// Extra sources: headers (lowercase names), cookies (regex on name), proto (HTTP protocol of the document / resources).

// ───────────── Languages & runtimes ─────────────
T("PHP","Programming Languages","https://php.net",{d:"Server-side language behind WordPress, Laravel and a huge slice of the web. Pages are generated per request by the PHP runtime.",headers:{"x-powered-by":r`PHP(?:/([\d.]+))?##v=\1`,server:r`PHP(?:/([\d.]+))?##v=\1`},cookies:{PHPSESSID:""},url:[r`\.php(\?|$|#)##c=60`]});
T("Node.js","Programming Languages","https://nodejs.org",{d:"JavaScript runtime on the server, letting teams share language and tooling across front and back end.",headers:{"x-powered-by":r`Express|Next\.js|Nuxt|Koa|Hapi##c=70`},cookies:{"connect\\.sid":""}});
T("Python","Programming Languages","https://python.org",{d:"General-purpose language behind Django, Flask and FastAPI.",headers:{server:r`Python(?:/([\d.]+))?|gunicorn|Werkzeug|uvicorn|Hypercorn|WSGIServer##v=\1`,"x-powered-by":r`Python|Flask|Django`}});
T("Ruby","Programming Languages","https://ruby-lang.org",{d:"Dynamic language famous for Rails.",headers:{server:r`Phusion Passenger|Puma|Thin|WEBrick|Unicorn`,"x-runtime":r`^\d+\.\d+$`,"x-powered-by":r`Phusion Passenger`}});
T("Java","Programming Languages","https://openjdk.org",{d:"Enterprise-standard language and JVM ecosystem (Spring, Jakarta EE).",cookies:{JSESSIONID:""},url:[r`\.(jsp|jspx|do|action)(\?|$|;)##c=60`],headers:{"x-powered-by":r`Servlet|JSP`,server:r`Tomcat|Jetty|Coyote|Undertow|WildFly|WebLogic|WebSphere`}});
T("ASP.NET","Programming Languages","https://dotnet.microsoft.com/apps/aspnet",{d:"Microsoft's web framework on the .NET runtime.",headers:{"x-powered-by":r`ASP\.NET`,"x-aspnet-version":r`([\d.]+)##v=\1`,"x-aspnetmvc-version":r`([\d.]+)##v=\1`},cookies:{"ASP\\.NET_SessionId":"","\\.AspNetCore\\..+":"","\\.ASPXAUTH":""},html:[r`__VIEWSTATE|__EVENTVALIDATION`],url:[r`\.aspx?(\?|$)##c=60`]});
T("Go","Programming Languages","https://go.dev",{d:"Compiled language popular for fast, simple network services.",headers:{server:r`^(Go-http-server|Caddy|Traefik)`}});
T("Elixir","Programming Languages","https://elixir-lang.org",{d:"Functional language on the Erlang VM built for concurrency.",headers:{server:r`Cowboy##c=40`}});
T("Dart","Programming Languages","https://dart.dev",{d:"Google's client-optimised language behind Flutter."});
T("TypeScript","Programming Languages","https://typescriptlang.org",{d:"Typed superset of JavaScript that compiles away before reaching the browser — inferred from the frameworks used."});
T("Twig","Programming Languages","https://twig.symfony.com",{d:"PHP template engine used by Symfony and Craft CMS."});
T("Deno","Programming Languages","https://deno.com",{d:"Secure JavaScript/TypeScript runtime.",headers:{server:r`deno`,"x-deno-ray":""}});

// ───────────── Databases (inferred) ─────────────
T("MySQL","Databases","https://mysql.com",{d:"Relational database that stores WordPress, Drupal and Magento content. Inferred from the platform, not directly observed."});
T("PostgreSQL","Databases","https://postgresql.org",{d:"Advanced open-source relational database. Inferred from the platform in use."});
T("MongoDB","Databases","https://mongodb.com",{d:"Document database common in JavaScript stacks. Inferred from the platform."});
T("SQLite","Databases","https://sqlite.org",{d:"Embedded file-based SQL database. Inferred from the platform."});

// ───────────── Web frameworks ─────────────
T("Express","Web Frameworks","https://expressjs.com",{d:"Minimal Node.js web framework — the foundation for many APIs and servers.",headers:{"x-powered-by":r`^Express$`},cookies:{"connect\\.sid":""},implies:["Node.js"]});
T("Laravel","Web Frameworks","https://laravel.com",{d:"Elegant PHP framework with Eloquent ORM, Blade templates and a rich ecosystem.",cookies:{laravel_session:"","XSRF-TOKEN":"##c=40"},html:[r`csrf-token`,r`_token`],implies:["PHP"]});
T("Symfony","Web Frameworks","https://symfony.com",{d:"Mature PHP framework whose components power Drupal, Laravel and more.",headers:{"x-debug-token":"","x-symfony-cache":""},cookies:{sf_redirect:"",PHPSESSID:"##c=0"},html:[r`sf-toolbar`],implies:["PHP"]});
T("CodeIgniter","Web Frameworks","https://codeigniter.com",{d:"Lightweight PHP framework.",cookies:{ci_session:"",csrf_cookie_name:"",ci_csrf_token:""},implies:["PHP"]});
T("Yii","Web Frameworks","https://yiiframework.com",{d:"High-performance PHP framework.",cookies:{YII_CSRF_TOKEN:"",_csrf:"##c=30"},html:[r`YII_CSRF_TOKEN|yii\.js`],implies:["PHP"]});
T("CakePHP","Web Frameworks","https://cakephp.org",{d:"Convention-based PHP framework.",cookies:{CAKEPHP:"",csrfToken:"##c=20"},implies:["PHP"]});
T("Django","Web Frameworks","https://djangoproject.com",{d:"Batteries-included Python framework with an ORM and admin.",tip:"Try /admin/ — Django's built-in admin login is a common sight.",cookies:{csrftoken:"",sessionid:"##c=30"},html:[r`csrfmiddlewaretoken`,r`/static/admin/`],implies:["Python"]});
T("Flask","Web Frameworks","https://flask.palletsprojects.com",{d:"Micro Python web framework.",headers:{server:r`Werkzeug(?:/([\d.]+))?##v=\1`},implies:["Python"]});
T("FastAPI","Web Frameworks","https://fastapi.tiangolo.com",{d:"Modern async Python API framework with automatic OpenAPI docs.",headers:{server:r`uvicorn`},url:[r`/docs$|/redoc$##c=20`],implies:["Python"]});
T("Ruby on Rails","Web Frameworks","https://rubyonrails.org",{d:"Convention-over-configuration Ruby framework that popularised MVC on the web.",meta:{"csrf-param":r`authenticity_token`},html:[r`csrf-param" content="authenticity_token"`,r`data-turbo-track|rails-ujs|/assets/application-[a-f0-9]{8,}`],headers:{"x-runtime":r`^\d+\.\d+$`,"x-request-id":"##c=10"},cookies:{"_session_id":"","_[\\w-]+_session":""},implies:["Ruby"]});
T("Spring","Web Frameworks","https://spring.io",{d:"The dominant Java application framework.",headers:{"x-application-context":""},html:[r`Whitelabel Error Page`],implies:["Java"]});
T("Phoenix","Web Frameworks","https://phoenixframework.org",{d:"Elixir web framework with LiveView.",cookies:{"_[\\w-]+_key":"##c=10"},html:[r`phx-`],meta:{"csrf-token":"##c=15"},implies:["Elixir"]});
T("NestJS","Web Frameworks","https://nestjs.com",{d:"Angular-inspired TypeScript framework for Node.js servers.",headers:{"x-powered-by":r`NestJS`},implies:["Node.js","TypeScript"]});
T("Fastify","Web Frameworks","https://fastify.dev",{d:"Fast, low-overhead Node.js framework.",headers:{"x-powered-by":r`Fastify`},implies:["Node.js"]});
T("Koa","Web Frameworks","https://koajs.com",{d:"Next-generation Node.js framework from the Express team.",headers:{"x-powered-by":r`^Koa$`},implies:["Node.js"]});
T("Hono","Web Frameworks","https://hono.dev",{d:"Ultrafast web-standards framework for edge runtimes.",headers:{"x-powered-by":r`Hono`}});

// ───────────── Web servers ─────────────
T("Nginx","Web Servers","https://nginx.org",{d:"High-performance web server and reverse proxy; the most common front door on the internet.",headers:{server:r`nginx(?:/([\d.]+))?##v=\1`}});
T("Apache HTTP Server","Web Servers","https://httpd.apache.org",{d:"The veteran open-source web server, configured per-directory with .htaccess files.",headers:{server:r`Apache(?:/([\d.]+))?(?! Coyote)##v=\1`}});
T("Microsoft IIS","Web Servers","https://iis.net",{d:"Microsoft's web server for Windows.",headers:{server:r`Microsoft-IIS(?:/([\d.]+))?##v=\1`}});
T("LiteSpeed","Web Servers","https://litespeedtech.com",{d:"Apache-compatible server known for speed and built-in caching.",headers:{server:r`LiteSpeed|OpenLiteSpeed`,"x-litespeed-cache":""}});
T("Caddy","Web Servers","https://caddyserver.com",{d:"Go web server with automatic HTTPS.",headers:{server:r`Caddy`}});
T("OpenResty","Web Servers","https://openresty.org",{d:"Nginx bundled with Lua for programmable edge logic.",headers:{server:r`openresty(?:/([\d.]+))?##v=\1`}});
T("Apache Tomcat","Web Servers","https://tomcat.apache.org",{d:"Java servlet container.",headers:{server:r`Apache-Coyote|Tomcat`},implies:["Java"]});
T("Jetty","Web Servers","https://jetty.org",{d:"Lightweight Java HTTP server.",headers:{server:r`Jetty(?:\(([\d.]+)\))?##v=\1`},implies:["Java"]});
T("Kestrel","Web Servers","https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel",{d:"ASP.NET Core's cross-platform web server.",headers:{server:r`Kestrel`},implies:["ASP.NET"]});
T("Gunicorn","Web Servers","https://gunicorn.org",{d:"Python WSGI HTTP server.",headers:{server:r`gunicorn(?:/([\d.]+))?##v=\1`},implies:["Python"]});
T("Phusion Passenger","Web Servers","https://phusionpassenger.com",{d:"Application server for Ruby, Node.js and Python.",headers:{server:r`Phusion Passenger(?: ([\d.]+))?##v=\1`,"x-powered-by":r`Phusion Passenger`}});
T("Google Web Server","Web Servers","https://cloud.google.com",{d:"Google's custom front-end server (gws / Google Frontend).",headers:{server:r`^(gws|GSE|Google Frontend|ESF)$`}});
T("Cowboy","Web Servers","https://ninenines.eu",{d:"Small, fast Erlang HTTP server used by Phoenix and Heroku.",headers:{server:r`Cowboy`}});

// ───────────── Proxies & caches ─────────────
T("Varnish","Caching & Proxies","https://varnish-cache.org",{d:"HTTP accelerator that caches pages in memory in front of the origin.",headers:{via:r`varnish(?: \(Varnish/([\d.]+)\))?##v=\1`,"x-varnish":"","x-varnish-cache":""}});
T("Envoy","Caching & Proxies","https://envoyproxy.io",{d:"Cloud-native proxy behind many service meshes and API gateways.",headers:{server:r`envoy`,"x-envoy-upstream-service-time":""}});
T("HAProxy","Caching & Proxies","https://haproxy.org",{d:"High-availability load balancer.",headers:{via:r`haproxy`,server:r`HAProxy`}});
T("Traefik","Caching & Proxies","https://traefik.io",{d:"Container-native reverse proxy.",headers:{server:r`Traefik`}});
T("Squid","Caching & Proxies","https://squid-cache.org",{d:"Caching forward/reverse proxy.",headers:{via:r`squid`,"x-squid-error":""}});
T("Kong","Caching & Proxies","https://konghq.com",{d:"API gateway.",headers:{via:r`kong(?:/([\d.]+))?##v=\1`,"x-kong-upstream-latency":"","x-kong-proxy-latency":""}});
T("Amazon ALB / ELB","Caching & Proxies","https://aws.amazon.com/elasticloadbalancing/",{d:"AWS load balancer; sticky sessions use AWSALB cookies.",cookies:{"AWSALB(CORS)?":"",AWSELB:""},headers:{server:r`awselb`}});

// ───────────── CDNs ─────────────
T("Cloudflare","CDN","https://cloudflare.com",{
  d:"Global edge network offering CDN, DDoS protection, DNS and a WAF. Sites behind it show cf-* headers and hide the origin IP.",
  tip:"cf-cache-status: HIT means the response came from cache; DYNAMIC means Cloudflare fetched it from the origin. The cf-ray suffix (e.g. -LHR) is the airport code of the serving data centre.",
  headers:{server:r`^cloudflare$`,"cf-ray":"","cf-cache-status":"","cf-request-id":"","cf-mitigated":""},
  cookies:{"__cf_bm":"","__cfduid":"","cf_clearance":"","__cflb":""},
  html:[r`/cdn-cgi/`],requests:[r`/cdn-cgi/`],
  extract:{"Edge location":r`header:cf-ray:-([A-Z]{3})$`,"Cache":"header:cf-cache-status"}
});
T("Fastly","CDN","https://fastly.com",{d:"Programmable edge cloud built on Varnish, used by many large publishers.",headers:{"x-served-by":r`cache-[\w-]+`,"fastly-debug-digest":"","x-fastly-request-id":"",via:r`varnish.*|1\.1 varnish##c=20`},extract:{"Edge POP":r`header:x-served-by:cache-([a-z0-9-]+)`}});
T("Amazon CloudFront","CDN","https://aws.amazon.com/cloudfront/",{d:"AWS's CDN, typically fronting S3 buckets or load balancers.",headers:{via:r`CloudFront`,"x-amz-cf-id":"","x-amz-cf-pop":"","x-cache":r`(Hit|Miss|Error|Refresh Hit) from cloudfront`},extract:{"Edge POP":"header:x-amz-cf-pop"}});
T("Akamai","CDN","https://akamai.com",{d:"The largest enterprise CDN with bot and security services.",headers:{server:r`AkamaiGHost|AkamaiNetStorage`,"x-akamai-transformed":"","akamai-grn":"","x-akamai-request-id":"","x-akamai-staging":""},cookies:{ak_bmsc:"",bm_sz:"",_abck:""}});
T("Azure Front Door / CDN","CDN","https://azure.microsoft.com/products/frontdoor",{d:"Microsoft's global edge for web apps.",headers:{"x-azure-ref":"","x-msedge-ref":"","x-fd-healthprobe":""}});
T("Google Cloud CDN","CDN","https://cloud.google.com/cdn",{d:"Google's edge caching for Cloud Load Balancing.",headers:{via:r`1\.1 google`,server:r`Google Frontend##c=40`}});
T("Bunny CDN","CDN","https://bunny.net",{d:"Low-cost global CDN.",headers:{server:r`BunnyCDN`,"cdn-pullzone":"","cdn-cachedat":""},requests:[r`\.b-cdn\.net`]});
T("KeyCDN","CDN","https://keycdn.com",{d:"Performance-focused CDN.",headers:{server:r`keycdn-engine`}});
T("CDN77","CDN","https://cdn77.com",{d:"Global CDN.",headers:{server:r`CDN77`,"x-77-pop":"","x-77-cache":""}});
T("Alibaba Cloud CDN","CDN","https://alibabacloud.com/product/cdn",{d:"Alibaba's CDN, common for sites serving mainland China.",headers:{"ali-swift-global-savetime":"","x-swift-cachetime":"","eagleid":""}});
T("jsDelivr","CDN","https://jsdelivr.com",{d:"Free open-source CDN serving npm and GitHub files.",requests:[r`cdn\.jsdelivr\.net`]});
T("cdnjs","CDN","https://cdnjs.com",{d:"Cloudflare-powered library CDN.",requests:[r`cdnjs\.cloudflare\.com`]});
T("unpkg","CDN","https://unpkg.com",{d:"CDN for everything published to npm.",requests:[r`unpkg\.com`]});
T("esm.sh / Skypack","CDN","https://esm.sh",{d:"CDNs that deliver npm packages as native ES modules.",requests:[r`esm\.sh|cdn\.skypack\.dev|ga\.jspm\.io`]});
T("Google Hosted Libraries","CDN","https://developers.google.com/speed/libraries",{d:"Google-hosted copies of popular libraries.",requests:[r`ajax\.googleapis\.com/ajax/libs`]});

// ───────────── Hosting ─────────────
T("Vercel","Hosting","https://vercel.com",{d:"Front-end cloud with git-push deploys, preview URLs and edge functions; the home of Next.js.",tip:"x-vercel-id starts with the region code (e.g. iad1) that handled the request.",headers:{server:r`^Vercel$`,"x-vercel-id":"","x-vercel-cache":""},requests:[r`/_vercel/`],url:[r`\.vercel\.app$|\.vercel\.app/`],extract:{Region:r`header:x-vercel-id:^([a-z0-9]+)::`}});
T("Netlify","Hosting","https://netlify.com",{d:"Git-based hosting with deploy previews, forms and serverless functions.",headers:{server:r`^Netlify$`,"x-nf-request-id":""},url:[r`\.netlify\.app`],requests:[r`/\.netlify/`]});
T("GitHub Pages","Hosting","https://pages.github.com",{d:"Free static hosting straight from a GitHub repository.",headers:{server:r`^GitHub\.com$`,"x-github-request-id":""},url:[r`\.github\.io`]});
T("Cloudflare Pages","Hosting","https://pages.cloudflare.com",{d:"Static and full-stack hosting on Cloudflare's network.",url:[r`\.pages\.dev`],implies:["Cloudflare"]});
T("Render","Hosting","https://render.com",{d:"Unified cloud for web services and static sites.",headers:{"x-render-origin-server":"","rndr-id":""},url:[r`\.onrender\.com`]});
T("Heroku","Hosting","https://heroku.com",{d:"Pioneer PaaS: git-push deploys, dynos and add-ons.",headers:{via:r`vegur`},url:[r`\.herokuapp\.com`]});
T("Fly.io","Hosting","https://fly.io",{d:"Runs containers close to users worldwide.",headers:{server:r`^Fly`,"fly-request-id":""},url:[r`\.fly\.dev`]});
T("Railway","Hosting","https://railway.com",{d:"Infrastructure platform that deploys straight from a repo.",headers:{"x-railway-request-id":"","x-railway-edge":""},url:[r`\.up\.railway\.app`]});
T("Firebase Hosting","Hosting","https://firebase.google.com/products/hosting",{d:"Google's fast static/dynamic hosting with a global CDN.",url:[r`\.(web\.app|firebaseapp\.com)`],headers:{"x-firebase-hosting-version":"","x-served-by":"##c=0"}});
T("Google Cloud Run / App Engine","Hosting","https://cloud.google.com/run",{d:"Serverless containers and app hosting on Google Cloud.",headers:{"x-cloud-trace-context":"",server:r`Google Frontend`,"x-appengine-request-log-id":""}});
T("Amazon Web Services","Hosting","https://aws.amazon.com",{d:"The largest cloud provider. Response headers reveal S3, API Gateway, Lambda or ELB.",headers:{server:r`AmazonS3|awselb|Amazon`,"x-amz-request-id":"","x-amz-id-2":"","x-amzn-requestid":"","x-amzn-trace-id":"","x-amz-apigw-id":""},url:[r`\.amazonaws\.com|\.elasticbeanstalk\.com`]});
T("Microsoft Azure","Hosting","https://azure.microsoft.com",{d:"Microsoft's cloud platform.",headers:{server:r`Microsoft-Azure|Windows-Azure`,"x-ms-request-id":"","x-azure-ref":""},url:[r`\.azurewebsites\.net|\.azurestaticapps\.net|\.blob\.core\.windows\.net`]});
T("DigitalOcean","Hosting","https://digitalocean.com",{d:"Developer cloud and App Platform.",headers:{"x-do-app-origin":"","x-do-orig-status":""},url:[r`\.ondigitalocean\.app`]});
T("Kinsta","Hosting","https://kinsta.com",{d:"Managed WordPress hosting on Google Cloud.",headers:{"x-kinsta-cache":""},html:[r`kinsta`]});
T("WP Engine","Hosting","https://wpengine.com",{d:"Managed WordPress hosting.",headers:{"x-powered-by":r`WP Engine`,"x-cacheable":"","wpe-backend":""},cookies:{"wpe-auth":""}});
T("Pantheon","Hosting","https://pantheon.io",{d:"WebOps platform for Drupal and WordPress.",headers:{"x-pantheon-styx-hostname":"","x-styx-req-id":""}});
T("Acquia","Hosting","https://acquia.com",{d:"Enterprise Drupal hosting.",headers:{"x-ah-environment":""}});
T("SiteGround","Hosting","https://siteground.com",{d:"Shared and managed hosting.",headers:{"x-siteground-cache":"",server:r`SiteGround`},html:[r`sg-cachepress|sg-optimizer`]});
T("Deno Deploy","Hosting","https://deno.com/deploy",{d:"Edge hosting for Deno.",headers:{server:r`^deno/`,"x-deno-ray":""},url:[r`\.deno\.dev`]});
T("Replit","Hosting","https://replit.com",{d:"Browser IDE that can host apps.",url:[r`\.repl\.co|\.replit\.(app|dev)`]});
T("Surge","Hosting","https://surge.sh",{d:"Simple static hosting.",headers:{server:r`SurgeCDN`},url:[r`\.surge\.sh`]});

// ───────────── Security ─────────────
T("reCAPTCHA","Security","https://google.com/recaptcha",{d:"Google's bot-vs-human challenge; v3 scores requests invisibly.",scripts:[r`(google\.com|gstatic\.com|recaptcha\.net)/recaptcha/`],js:{grecaptcha:""},iframes:[r`google\.com/recaptcha`],extract:{Version:r`scripts:recaptcha/(enterprise|api)\.js\?render=(?!explicit)##t=v3 / Enterprise`}});
T("hCaptcha","Security","https://hcaptcha.com",{d:"Privacy-focused CAPTCHA alternative.",scripts:[r`hcaptcha\.com/1/api\.js`],js:{hcaptcha:""},iframes:[r`hcaptcha\.com`]});
T("Cloudflare Turnstile","Security","https://developers.cloudflare.com/turnstile/",{d:"Cloudflare's privacy-preserving CAPTCHA replacement.",scripts:[r`challenges\.cloudflare\.com/turnstile`],js:{turnstile:""},iframes:[r`challenges\.cloudflare\.com`]});
T("Sucuri","Security","https://sucuri.net",{d:"Website firewall and malware protection.",headers:{server:r`Sucuri`,"x-sucuri-id":"","x-sucuri-cache":""}});
T("Imperva","Security","https://imperva.com",{d:"WAF and bot protection (formerly Incapsula).",headers:{"x-iinfo":"","x-cdn":r`Imperva|Incapsula`},cookies:{"incap_ses_.+":"","visid_incap_.+":"",nlbi_:""}});
T("AWS WAF","Security","https://aws.amazon.com/waf/",{d:"Amazon's managed web application firewall.",cookies:{"aws-waf-token":"",awswaf_session_storage:""},headers:{"x-amzn-waf-action":""}});
T("DataDome","Security","https://datadome.co",{d:"Bot and fraud protection.",cookies:{datadome:""},scripts:[r`datadome\.co|js\.datadome`],headers:{server:r`DataDome`,"x-datadome":""}});
T("HUMAN (PerimeterX)","Security","https://humansecurity.com",{d:"Bot defence platform.",cookies:{"_px\\w*":"","_pxhd":""},scripts:[r`perimeterx|px-cdn\.net|px-cloud\.net|px-client\.net`]});
T("Akamai Bot Manager","Security","https://akamai.com/products/bot-manager",{d:"Behavioural bot detection using sensor data.",cookies:{_abck:"",bm_sz:"",bm_sv:""}});
T("Arkose Labs","Security","https://arkoselabs.com",{d:"Interactive challenges for account abuse prevention.",scripts:[r`arkoselabs\.com|funcaptcha`]});
T("Friendly Captcha","Security","https://friendlycaptcha.com",{d:"Proof-of-work CAPTCHA.",scripts:[r`friendlycaptcha`],classes:[r`^frc-captcha$`]});
T("Subresource Integrity","Security","https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity",{d:"integrity= hashes on script/style tags so browsers reject tampered third-party files.",html:[r`integrity="sha(256|384|512)-`]});

// ───────────── Web platform & performance ─────────────
T("HTTP/3 (QUIC)","Performance","https://developer.mozilla.org/docs/Glossary/HTTP_3",{d:"HTTP over QUIC/UDP: faster connection setup and no head-of-line blocking on lossy networks.",proto:[r`^h3`],headers:{"alt-svc":r`\bh3(-\d+)?=##c=70`}});
T("HTTP/2","Performance","https://developer.mozilla.org/docs/Glossary/HTTP_2",{d:"Multiplexed connections that let many requests share one TCP connection.",proto:[r`^h2$`]});
T("Brotli","Performance","https://github.com/google/brotli",{d:"Modern compression that usually beats gzip by 15–25% on text assets.",headers:{"content-encoding":r`\bbr\b`}});
T("Gzip","Performance","https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Encoding",{d:"The classic compression for text responses.",headers:{"content-encoding":r`\bgzip\b`}});
T("Zstandard","Performance","https://facebook.github.io/zstd/",{d:"Fast, high-ratio compression now supported in browsers.",headers:{"content-encoding":r`\bzstd\b`}});
T("Resource hints","Performance","https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preconnect",{d:"preconnect / dns-prefetch / preload / prefetch tell the browser what it will need soon so it can start early.",html:[r`<link[^>]+rel=["'](preconnect|dns-prefetch|preload|prefetch|modulepreload)["']`],headers:{link:r`rel="?(preload|preconnect)`}});
T("Speculation Rules","Performance","https://developer.chrome.com/docs/web-platform/prerender-pages",{d:"JSON rules that let Chrome prefetch or fully prerender likely next pages so navigation feels instant.",html:[r`type=["']speculationrules["']`],headers:{"speculation-rules":""}});
T("Native lazy loading","Performance","https://developer.mozilla.org/docs/Web/Performance/Lazy_loading",{d:"loading=lazy on images and iframes defers offscreen media until needed.",html:[r`\sloading=["']lazy["']`]});
T("Priority Hints","Performance","https://web.dev/articles/fetch-priority",{d:"fetchpriority tells the browser which resources matter most (e.g. the LCP image).",html:[r`\sfetchpriority=["'](high|low)["']`]});
T("WebP images","Performance","https://developers.google.com/speed/webp",{d:"Modern image format with smaller files than JPEG/PNG.",requests:[r`\.webp(\?|$)`],html:[r`type=["']image/webp["']`]});
T("AVIF images","Performance","https://developer.mozilla.org/docs/Web/Media/Formats/Image_types#avif_image",{d:"Newer image format with better compression than WebP.",requests:[r`\.avif(\?|$)`],html:[r`type=["']image/avif["']`]});
T("Service Worker","Performance","https://developer.mozilla.org/docs/Web/API/Service_Worker_API",{d:"A background script that intercepts requests, enabling offline mode, caching strategies and push.",sw:[r`.`]});
T("Workbox","Performance","https://developer.chrome.com/docs/workbox",{d:"Google's library for service-worker caching strategies.",sw:[r`workbox`],storage:[r`workbox-`],scripts:[r`workbox-(sw|window|core)`]});
T("Progressive Web App","Web Platform","https://web.dev/progressive-web-apps/",{d:"A site that can be installed and work offline thanks to a web manifest plus a service worker.",html:[r`<link[^>]+rel=["']manifest["']##c=50`],sw:[r`.##c=50`]});
T("ES Modules","Web Platform","https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules",{d:"Native import/export in the browser via <script type=module> — deferred by default.",html:[r`<script[^>]+type=["']module["']`]});
T("Import maps","Web Platform","https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap",{d:"Lets bare specifiers like 'react' resolve to URLs without a bundler.",html:[r`type=["']importmap["']`]});
T("Web Components","Web Platform","https://developer.mozilla.org/docs/Web/API/Web_components",{d:"Custom elements (<my-widget>) with optional Shadow DOM encapsulation — framework-independent reusable UI.",tags:[r`^[a-z][a-z0-9]*-[a-z0-9-]+$`],html:[r`customElements\.define`]});
T("Shadow DOM","Web Platform","https://developer.mozilla.org/docs/Web/API/Web_components/Using_shadow_DOM",{d:"Encapsulated DOM and CSS subtrees inside an element.",stats:{shadowRoots:1},html:[r`shadowrootmode=`]});
T("JSON-LD structured data","Web Platform","https://developers.google.com/search/docs/appearance/structured-data",{d:"Machine-readable Schema.org data that powers rich results in search.",html:[r`application/ld\+json`]});
T("Schema.org microdata","Web Platform","https://schema.org",{d:"Inline itemscope/itemtype markup describing entities.",html:[r`itemscope[^>]+itemtype=["']https?://schema\.org`]});
T("Open Graph","Web Platform","https://ogp.me",{d:"og:* meta tags that control link previews on social platforms and chat apps.",html:[r`property=["']og:(title|image|type)["']`]});
T("Twitter / X Cards","Web Platform","https://developer.x.com/en/docs/twitter-for-websites/cards",{d:"twitter:* meta tags for rich link previews on X.",meta:{"twitter:card":""}});
T("RSS / Atom feed","Web Platform","https://en.wikipedia.org/wiki/RSS",{d:"Syndication feed advertised via <link rel=alternate>.",html:[r`<link[^>]+type=["']application/(rss|atom)\+xml["']`]});
T("hreflang (multilingual)","Web Platform","https://developers.google.com/search/docs/specialty/international/localized-versions",{d:"Tells search engines which URL serves which language/region.",html:[r`<link[^>]+hreflang=`]});
T("AMP","Web Platform","https://amp.dev",{d:"Accelerated Mobile Pages, a restricted HTML format with a shared runtime.",html:[r`<html[^>]*\s(amp|⚡)[\s=>]`,r`cdn\.ampproject\.org`]});
T("Dark mode support","Web Platform","https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme",{d:"Adapts styles to the visitor's light/dark system preference.",css:[r`prefers-color-scheme\s*:\s*dark`],meta:{"color-scheme":r`dark`}});
T("View Transitions","Web Platform","https://developer.mozilla.org/docs/Web/API/View_Transition_API",{d:"Browser-native animated transitions between states or pages.",css:[r`view-transition`],meta:{"view-transition":""}});
T("WebAssembly","Web Platform","https://webassembly.org",{d:"Near-native-speed binary modules running in the browser.",requests:[r`\.wasm(\?|$)`]});
T("Client Hints","Web Platform","https://developer.mozilla.org/docs/Web/HTTP/Client_hints",{d:"Servers ask browsers for device details via Accept-CH headers.",headers:{"accept-ch":""}});
T("HSTS","Security","https://developer.mozilla.org/docs/Web/HTTP/Headers/Strict-Transport-Security",{d:"Forces browsers to use HTTPS for the domain, defeating downgrade attacks.",headers:{"strict-transport-security":""},extract:{Policy:"header:strict-transport-security"}});
T("Content Security Policy","Security","https://developer.mozilla.org/docs/Web/HTTP/CSP",{d:"An allow-list of sources for scripts, styles and frames — a strong second line of defence against XSS.",headers:{"content-security-policy":"","content-security-policy-report-only":""},html:[r`http-equiv=["']Content-Security-Policy["']`]});
T("Cross-origin isolation","Security","https://web.dev/articles/coop-coep",{d:"COOP + COEP headers that unlock SharedArrayBuffer and high-resolution timers.",headers:{"cross-origin-opener-policy":r`same-origin`,"cross-origin-embedder-policy":r`require-corp|credentialless`}});
T("Permissions Policy","Security","https://developer.mozilla.org/docs/Web/HTTP/Permissions_Policy",{d:"Toggles powerful browser features (camera, geolocation…) for the page and its iframes.",headers:{"permissions-policy":"","feature-policy":""}});
