// StackSpy technology signature database v2
// Each signal can be a plain regex string, or { regex, version } where version
// is a template like "\\1" referencing the regex's capture group.
// Fields: html, scripts, meta:{name:sig}, cookies, headers:{name:sig}, js (dot-paths,
// existence-only, no version capture)

const TECHNOLOGIES = [
// ============ CMS ============
{ name:"WordPress", category:"CMS", html:["wp-content/","wp-includes/","/wp-json/"], meta:{generator:{regex:"WordPress\\s*([\\d.]+)?",version:"\\1"}}, website:"https://wordpress.org" },
{ name:"WooCommerce", category:"Ecommerce", html:["woocommerce"], js:["woocommerce_params"], website:"https://woocommerce.com" },
{ name:"Shopify", category:"CMS", html:["cdn\\.shopify\\.com","Shopify\\.theme"], js:["Shopify"], cookies:["_shopify_"], website:"https://shopify.com" },
{ name:"Wix", category:"CMS", html:["static\\.wixstatic\\.com","wix-code"], js:["wixBiSession"], website:"https://wix.com" },
{ name:"Squarespace", category:"CMS", html:["squarespace\\.com"], js:["Static.SQUARESPACE_CONTEXT"], website:"https://squarespace.com" },
{ name:"Drupal", category:"CMS", html:["Drupal\\.settings","/sites/default/files"], meta:{generator:"Drupal\\s*([\\d.]+)?"}, js:["Drupal"], website:"https://drupal.org" },
{ name:"Joomla", category:"CMS", meta:{generator:"Joomla!?\\s*([\\d.]+)?"}, html:["/media/jui/"], website:"https://joomla.org" },
{ name:"Ghost", category:"CMS", meta:{generator:"Ghost\\s*([\\d.]+)?"}, html:["ghost-sdk"], website:"https://ghost.org" },
{ name:"Sanity", category:"CMS", html:["cdn\\.sanity\\.io"], website:"https://sanity.io" },
{ name:"Contentful", category:"CMS", html:["cdn\\.contentful\\.com","images\\.ctfassets\\.net"], website:"https://contentful.com" },
{ name:"Webflow", category:"CMS", html:["webflow\\.js","data-wf-site"], website:"https://webflow.com" },
{ name:"Strapi", category:"CMS", headers:{"x-powered-by":"Strapi"}, html:["strapi"], website:"https://strapi.io" },
{ name:"Prismic", category:"CMS", html:["prismic\\.io"], website:"https://prismic.io" },
{ name:"HubSpot CMS", category:"CMS", html:["hs-sites\\.com","hubspotusercontent"], website:"https://hubspot.com/products/cms" },
{ name:"Magento", category:"Ecommerce", html:["Mage\\.Cookies","/skin/frontend/"], js:["Mage"], cookies:["frontend"], website:"https://magento.com" },
{ name:"BigCommerce", category:"Ecommerce", html:["cdn\\d*\\.bigcommerce\\.com"], js:["BCData"], website:"https://bigcommerce.com" },
{ name:"PrestaShop", category:"Ecommerce", js:["prestashop"], meta:{generator:"PrestaShop"}, website:"https://prestashop.com" },
{ name:"OpenCart", category:"Ecommerce", html:["index\\.php\\?route="], website:"https://opencart.com" },
{ name:"Salesforce Commerce Cloud", category:"Ecommerce", html:["demandware\\.static"], website:"https://salesforce.com/commerce" },

// ============ JS Frameworks ============
{ name:"React", category:"JS Frameworks", html:["data-reactroot","data-reactid","__reactContainer"], js:["React"], scripts:[{regex:"react@([\\d.]+)",version:"\\1"},"react(\\.production|\\.development)?(\\.min)?\\.js"], website:"https://react.dev" },
{ name:"Next.js", category:"JS Frameworks", html:["__NEXT_DATA__","/_next/static/"], js:["__NEXT_DATA__"], website:"https://nextjs.org" },
{ name:"Vue.js", category:"JS Frameworks", html:["data-v-app","__vue__"], js:["Vue"], scripts:[{regex:"vue@([\\d.]+)",version:"\\1"}], website:"https://vuejs.org" },
{ name:"Nuxt.js", category:"JS Frameworks", html:["__NUXT__","/_nuxt/"], js:["__NUXT__"], website:"https://nuxt.com" },
{ name:"Angular", category:"JS Frameworks", html:["ng-version=\"([\\d.]+)\"","ng-app"], js:["getAllAngularRootElements"], website:"https://angular.io" },
{ name:"AngularJS", category:"JS Frameworks", js:["angular.version.full"], website:"https://angularjs.org" },
{ name:"Svelte", category:"JS Frameworks", html:["svelte-"], website:"https://svelte.dev" },
{ name:"SvelteKit", category:"JS Frameworks", html:["__sveltekit"], website:"https://kit.svelte.dev" },
{ name:"jQuery", category:"JS Libraries", scripts:[{regex:"jquery[/-]([\\d.]+)",version:"\\1"},"jquery(\\.min)?\\.js"], js:["jQuery.fn.jquery"], website:"https://jquery.com" },
{ name:"jQuery UI", category:"JS Libraries", scripts:["jquery-ui"], js:["jQuery.ui.version"], website:"https://jqueryui.com" },
{ name:"TanStack Query", category:"JS Libraries", scripts:["@tanstack/react-query","@tanstack/query"], website:"https://tanstack.com" },
{ name:"Gatsby", category:"JS Frameworks", html:["___gatsby","/page-data/"], js:["___gatsby"], website:"https://gatsbyjs.com" },
{ name:"Remix", category:"JS Frameworks", html:["__remixContext"], js:["__remixContext"], website:"https://remix.run" },
{ name:"Astro", category:"JS Frameworks", html:["astro-island"], website:"https://astro.build" },
{ name:"Ember.js", category:"JS Frameworks", js:["Ember"], html:["ember-application"], website:"https://emberjs.com" },
{ name:"Backbone.js", category:"JS Frameworks", js:["Backbone"], website:"https://backbonejs.org" },
{ name:"Alpine.js", category:"JS Frameworks", html:["x-data="], js:["Alpine"], website:"https://alpinejs.dev" },
{ name:"Solid.js", category:"JS Frameworks", scripts:["solid-js"], website:"https://solidjs.com" },
{ name:"Qwik", category:"JS Frameworks", html:["q:container"], website:"https://qwik.dev" },
{ name:"Preact", category:"JS Frameworks", js:["preact"], website:"https://preactjs.com" },

// ============ JS Libraries ============
{ name:"Framer Motion", category:"JS Libraries", html:["data-framer"], scripts:["framer-motion"], website:"https://framer.com/motion" },
{ name:"D3.js", category:"JS Libraries", js:["d3.version"], scripts:[{regex:"d3\\.v(\\d+)",version:"\\1"},"d3(\\.min)?\\.js"], website:"https://d3js.org" },
{ name:"Lodash", category:"JS Libraries", js:["_.VERSION"], scripts:["lodash(\\.min)?\\.js"], website:"https://lodash.com" },
{ name:"Underscore.js", category:"JS Libraries", js:["_.VERSION"], scripts:["underscore(\\.min)?\\.js"], website:"https://underscorejs.org" },
{ name:"Three.js", category:"JS Libraries", js:["THREE"], scripts:["three(\\.min)?\\.js"], website:"https://threejs.org" },
{ name:"Moment.js", category:"JS Libraries", js:["moment.version"], scripts:["moment(\\.min)?\\.js"], website:"https://momentjs.com" },
{ name:"date-fns", category:"JS Libraries", scripts:["date-fns"], website:"https://date-fns.org" },
{ name:"Chart.js", category:"JS Libraries", js:["Chart.version"], scripts:["chart(\\.min)?\\.js"], website:"https://www.chartjs.org" },
{ name:"Highcharts", category:"JS Libraries", js:["Highcharts.version"], scripts:["highcharts"], website:"https://highcharts.com" },
{ name:"GSAP", category:"JS Libraries", js:["gsap.version"], scripts:["gsap"], website:"https://gsap.com" },
{ name:"Axios", category:"JS Libraries", scripts:["axios(\\.min)?\\.js"], website:"https://axios-http.com" },
{ name:"RxJS", category:"JS Libraries", scripts:["rxjs"], website:"https://rxjs.dev" },
{ name:"Immer", category:"JS Libraries", scripts:["immer"], website:"https://immerjs.github.io" },
{ name:"Redux", category:"JS Libraries", js:["__REDUX_DEVTOOLS_EXTENSION__"], scripts:["redux"], website:"https://redux.js.org" },
{ name:"Zustand", category:"JS Libraries", scripts:["zustand"], website:"https://zustand-demo.pmnd.rs" },
{ name:"Socket.IO", category:"JS Libraries", scripts:["socket\\.io"], js:["io"], website:"https://socket.io" },
{ name:"Video.js", category:"Video Players", scripts:["video\\.js"], js:["videojs"], website:"https://videojs.com" },
{ name:"Swiper", category:"JS Libraries", scripts:["swiper"], html:["swiper-container"], website:"https://swiperjs.com" },
{ name:"Slick Carousel", category:"JS Libraries", scripts:["slick\\.min\\.js"], html:["slick-slider"], website:"https://kenwheeler.github.io/slick" },
{ name:"AOS (Animate on Scroll)", category:"JS Libraries", scripts:["aos\\.js"], html:["data-aos="], website:"https://michalsnik.github.io/aos" },
{ name:"Lottie", category:"JS Libraries", scripts:["lottie"], website:"https://airbnb.io/lottie" },

// ============ UI Frameworks ============
{ name:"Bootstrap", category:"UI Frameworks", scripts:[{regex:"bootstrap@([\\d.]+)",version:"\\1"},"bootstrap(\\.min)?\\.js"], html:["class=\"[^\"]*\\bcontainer(-fluid)?\\b"], website:"https://getbootstrap.com" },
{ name:"Tailwind CSS", category:"UI Frameworks", html:["tailwindcss","class=\"[^\"]*\\b(flex|grid)\\b[^\"]*\\b(items-center|justify-between)\\b"], website:"https://tailwindcss.com" },
{ name:"Material UI", category:"UI Frameworks", html:["MuiBox-root","MuiButton-root"], website:"https://mui.com" },
{ name:"Radix UI", category:"UI Frameworks", html:["data-radix-"], website:"https://radix-ui.com" },
{ name:"Base UI", category:"UI Frameworks", html:["data-base-ui"], website:"https://base-ui.com" },
{ name:"Ant Design", category:"UI Frameworks", html:["ant-btn","ant-layout"], website:"https://ant.design" },
{ name:"Chakra UI", category:"UI Frameworks", html:["chakra-"], website:"https://chakra-ui.com" },
{ name:"Foundation", category:"UI Frameworks", html:["foundation-"], js:["Foundation"], website:"https://get.foundation" },
{ name:"Bulma", category:"UI Frameworks", html:["class=\"[^\"]*\\bnavbar-burger\\b"], website:"https://bulma.io" },
{ name:"Semantic UI", category:"UI Frameworks", html:["ui\\s+segment","semantic\\.min\\.css"], website:"https://semantic-ui.com" },
{ name:"shadcn/ui", category:"UI Frameworks", html:["data-radix-","class=\"[^\"]*\\bring-offset-background\\b"], website:"https://ui.shadcn.com" },
{ name:"DaisyUI", category:"UI Frameworks", html:["class=\"[^\"]*\\bdaisyui\\b|\\bbtn-primary\\b[^\"]*\\bbtn\\b"], website:"https://daisyui.com" },

// ============ Analytics ============
{ name:"Google Analytics (GA4)", category:"Analytics", scripts:["googletagmanager\\.com/gtag/js"], js:["gtag"], cookies:["_ga"], website:"https://analytics.google.com" },
{ name:"Google Universal Analytics", category:"Analytics", scripts:["google-analytics\\.com/analytics\\.js"], js:["ga"], cookies:["_gid"], website:"https://analytics.google.com" },
{ name:"Google Tag Manager", category:"Tag Managers", scripts:["googletagmanager\\.com/gtm\\.js"], html:["www\\.googletagmanager\\.com/ns\\.html"], website:"https://tagmanager.google.com" },
{ name:"Segment", category:"Analytics", scripts:["cdn\\.segment\\.com"], js:["analytics.SNIPPET_VERSION"], website:"https://segment.com" },
{ name:"Mixpanel", category:"Analytics", scripts:["cdn\\.mxpnl\\.com"], js:["mixpanel"], website:"https://mixpanel.com" },
{ name:"Hotjar", category:"Analytics", scripts:["static\\.hotjar\\.com"], js:["hj"], website:"https://hotjar.com" },
{ name:"Plausible", category:"Analytics", scripts:["plausible\\.io/js"], website:"https://plausible.io" },
{ name:"Sift", category:"Analytics", scripts:["cdn\\.sift\\.com"], js:["_sift"], website:"https://sift.com" },
{ name:"Datadog RUM", category:"Analytics", scripts:["datadoghq-browser-agent"], js:["DD_RUM"], website:"https://datadoghq.com" },
{ name:"Amplitude", category:"Analytics", scripts:["cdn\\.amplitude\\.com"], js:["amplitude"], website:"https://amplitude.com" },
{ name:"Matomo", category:"Analytics", scripts:["matomo\\.js|piwik\\.js"], js:["_paq"], website:"https://matomo.org" },
{ name:"Heap", category:"Analytics", scripts:["cdn\\.heapanalytics\\.com"], js:["heap"], website:"https://heap.io" },
{ name:"FullStory", category:"Analytics", scripts:["fullstory\\.com/s/fs\\.js"], js:["FS"], website:"https://fullstory.com" },
{ name:"Microsoft Clarity", category:"Analytics", scripts:["clarity\\.ms"], js:["clarity"], website:"https://clarity.microsoft.com" },
{ name:"Kissmetrics", category:"Analytics", scripts:["i\\.kissmetrics\\.com"], website:"https://kissmetrics.io" },
{ name:"Crazy Egg", category:"Analytics", scripts:["script\\.crazyegg\\.com"], website:"https://crazyegg.com" },
{ name:"Adobe Analytics", category:"Analytics", scripts:["/AppMeasurement\\.js"], js:["s_gi"], website:"https://business.adobe.com/products/analytics" },

// ============ CDN ============
{ name:"Cloudflare", category:"CDN", headers:{server:"cloudflare","cf-ray":""}, cookies:["__cf_bm","__cfduid"], website:"https://cloudflare.com" },
{ name:"Fastly", category:"CDN", headers:{"x-served-by":"cache-",via:"varnish"}, website:"https://fastly.com" },
{ name:"Amazon CloudFront", category:"CDN", headers:{"x-amz-cf-id":"",via:"CloudFront"}, website:"https://aws.amazon.com/cloudfront" },
{ name:"Akamai", category:"CDN", headers:{"x-akamai-transformed":""}, website:"https://akamai.com" },
{ name:"jsDelivr", category:"CDN", scripts:["cdn\\.jsdelivr\\.net"], website:"https://jsdelivr.com" },
{ name:"cdnjs (Cloudflare)", category:"CDN", scripts:["cdnjs\\.cloudflare\\.com"], website:"https://cdnjs.com" },
{ name:"unpkg", category:"CDN", scripts:["unpkg\\.com"], website:"https://unpkg.com" },
{ name:"KeyCDN", category:"CDN", headers:{server:"keycdn"}, website:"https://keycdn.com" },
{ name:"StackPath", category:"CDN", headers:{server:"NetDNA-cache"}, website:"https://stackpath.com" },
{ name:"Bunny CDN", category:"CDN", headers:{server:"BunnyCDN"}, website:"https://bunny.net" },

// ============ PaaS / Hosting ============
{ name:"Vercel", category:"PaaS", headers:{server:"Vercel","x-vercel-id":""}, website:"https://vercel.com" },
{ name:"Netlify", category:"PaaS", headers:{server:"Netlify","x-nf-request-id":""}, website:"https://netlify.com" },
{ name:"Amazon Web Services", category:"PaaS", headers:{"x-amz-request-id":"","x-amzn-requestid":""}, website:"https://aws.amazon.com" },
{ name:"Google Cloud", category:"PaaS", headers:{server:"Google Frontend"}, website:"https://cloud.google.com" },
{ name:"Heroku", category:"PaaS", headers:{via:"heroku"}, website:"https://heroku.com" },
{ name:"GitHub Pages", category:"PaaS", headers:{server:"GitHub.com"}, website:"https://pages.github.com" },
{ name:"Render", category:"PaaS", headers:{server:"render","x-render-origin-server":""}, website:"https://render.com" },
{ name:"Fly.io", category:"PaaS", headers:{server:"Fly/","fly-request-id":""}, website:"https://fly.io" },
{ name:"DigitalOcean App Platform", category:"PaaS", headers:{server:"DOAppPlatform"}, website:"https://digitalocean.com" },
{ name:"Firebase Hosting", category:"PaaS", headers:{server:"Google Frontend"}, html:["firebaseapp\\.com","firebaseio\\.com"], website:"https://firebase.google.com" },

// ============ Web Servers ============
{ name:"Nginx", category:"Web Servers", headers:{server:{regex:"nginx/?([\\d.]+)?",version:"\\1"}}, website:"https://nginx.org" },
{ name:"Apache", category:"Web Servers", headers:{server:{regex:"Apache/?([\\d.]+)?",version:"\\1"}}, website:"https://httpd.apache.org" },
{ name:"Microsoft IIS", category:"Web Servers", headers:{server:{regex:"Microsoft-IIS/([\\d.]+)?",version:"\\1"}}, website:"https://iis.net" },
{ name:"LiteSpeed", category:"Web Servers", headers:{server:"LiteSpeed"}, website:"https://litespeedtech.com" },
{ name:"Caddy", category:"Web Servers", headers:{server:"Caddy"}, website:"https://caddyserver.com" },
{ name:"OpenResty", category:"Web Servers", headers:{server:"openresty"}, website:"https://openresty.org" },

// ============ Programming Languages / Backend ============
{ name:"PHP", category:"Programming Languages", headers:{"x-powered-by":{regex:"PHP/?([\\d.]+)?",version:"\\1"}}, website:"https://php.net" },
{ name:"ASP.NET", category:"Programming Languages", headers:{"x-powered-by":"ASP\\.NET","x-aspnet-version":""}, website:"https://dotnet.microsoft.com" },
{ name:"Ruby on Rails", category:"Web Frameworks", headers:{"x-powered-by":"Phusion Passenger","x-runtime":""}, cookies:["_rails_session"], website:"https://rubyonrails.org" },
{ name:"Express", category:"Web Frameworks", headers:{"x-powered-by":"Express"}, website:"https://expressjs.com" },
{ name:"Django", category:"Web Frameworks", cookies:["csrftoken","django"], website:"https://djangoproject.com" },
{ name:"Flask", category:"Web Frameworks", cookies:["session"], headers:{server:"Werkzeug"}, website:"https://flask.palletsprojects.com" },
{ name:"Laravel", category:"Web Frameworks", cookies:["laravel_session","XSRF-TOKEN"], website:"https://laravel.com" },
{ name:"Spring", category:"Web Frameworks", cookies:["JSESSIONID"], headers:{"x-application-context":""}, website:"https://spring.io" },
{ name:"FastAPI", category:"Web Frameworks", headers:{server:"uvicorn"}, website:"https://fastapi.tiangolo.com" },

// ============ Security / WAF ============
{ name:"reCAPTCHA", category:"Security", scripts:["google\\.com/recaptcha","gstatic\\.com/recaptcha"], website:"https://google.com/recaptcha" },
{ name:"hCaptcha", category:"Security", scripts:["hcaptcha\\.com"], website:"https://hcaptcha.com" },
{ name:"Cloudflare Turnstile", category:"Security", scripts:["challenges\\.cloudflare\\.com/turnstile"], website:"https://cloudflare.com" },
{ name:"Cloudflare Bot Management", category:"Security", headers:{"cf-mitigated":""}, website:"https://cloudflare.com" },
{ name:"Sucuri WAF", category:"Security", headers:{server:"Sucuri/Cloudproxy","x-sucuri-id":""}, website:"https://sucuri.net" },
{ name:"Imperva", category:"Security", headers:{"x-iinfo":""}, cookies:["visid_incap"], website:"https://imperva.com" },
{ name:"AWS WAF", category:"Security", headers:{"x-amzn-waf-action":""}, website:"https://aws.amazon.com/waf" },
{ name:"HSTS", category:"Security", headers:{"strict-transport-security":""}, website:"https://hstspreload.org" },

// ============ Payment ============
{ name:"Stripe", category:"Payment", scripts:["js\\.stripe\\.com"], js:["Stripe"], website:"https://stripe.com" },
{ name:"PayPal", category:"Payment", scripts:["paypal\\.com/sdk/js","paypalobjects\\.com"], website:"https://paypal.com" },
{ name:"Square", category:"Payment", scripts:["squareup\\.com"], website:"https://squareup.com" },
{ name:"Braintree", category:"Payment", scripts:["braintreegateway\\.com","js\\.braintreegateway\\.com"], website:"https://braintreepayments.com" },
{ name:"Klarna", category:"Payment", scripts:["x\\.klarnacdn\\.net"], website:"https://klarna.com" },
{ name:"Adyen", category:"Payment", scripts:["checkoutshopper-live\\.adyen\\.com"], website:"https://adyen.com" },

// ============ Documentation ============
{ name:"Swagger UI", category:"Documentation", html:["swagger-ui"], js:["SwaggerUIBundle"], website:"https://swagger.io/tools/swagger-ui" },
{ name:"Docusaurus", category:"Documentation", html:["docusaurus"], website:"https://docusaurus.io" },
{ name:"GitBook", category:"Documentation", html:["gitbook"], website:"https://gitbook.com" },
{ name:"ReadMe", category:"Documentation", html:["readme\\.io","readme-embeds"], website:"https://readme.com" },
{ name:"Redoc", category:"Documentation", html:["redoc"], js:["Redoc"], website:"https://redocly.com" },

// ============ Fonts ============
{ name:"Google Fonts", category:"Fonts", html:["fonts\\.googleapis\\.com","fonts\\.gstatic\\.com"], website:"https://fonts.google.com" },
{ name:"Adobe Fonts", category:"Fonts", html:["use\\.typekit\\.net"], website:"https://fonts.adobe.com" },
{ name:"Font Awesome", category:"Fonts", html:["font-awesome","fontawesome"], website:"https://fontawesome.com" },

// ============ Marketing / Tag / Chat / CRM ============
{ name:"HubSpot", category:"Marketing Automation", scripts:["js\\.hs-scripts\\.com","js\\.hsforms\\.net"], js:["_hsq"], website:"https://hubspot.com" },
{ name:"Marketo", category:"Marketing Automation", scripts:["munchkin\\.marketo\\.net"], js:["Munchkin"], website:"https://marketo.com" },
{ name:"Salesforce Pardot", category:"Marketing Automation", scripts:["pi\\.pardot\\.com"], website:"https://pardot.com" },
{ name:"ActiveCampaign", category:"Marketing Automation", scripts:["diffuser-cdn\\.app-us1\\.com"], website:"https://activecampaign.com" },
{ name:"Klaviyo", category:"Marketing Automation", scripts:["static\\.klaviyo\\.com"], js:["_klOnsite","klaviyo"], website:"https://klaviyo.com" },
{ name:"Mailchimp", category:"Email", scripts:["chimpstatic\\.com"], website:"https://mailchimp.com" },
{ name:"Intercom", category:"Live Chat", scripts:["widget\\.intercom\\.io"], js:["Intercom"], website:"https://intercom.com" },
{ name:"Zendesk", category:"Live Chat", scripts:["static\\.zdassets\\.com"], js:["zE"], website:"https://zendesk.com" },
{ name:"Drift", category:"Live Chat", scripts:["js\\.driftt\\.com"], js:["drift"], website:"https://drift.com" },
{ name:"Tawk.to", category:"Live Chat", scripts:["embed\\.tawk\\.to"], website:"https://tawk.to" },
{ name:"Crisp", category:"Live Chat", scripts:["client\\.crisp\\.chat"], js:["$crisp"], website:"https://crisp.chat" },
{ name:"LiveChat", category:"Live Chat", scripts:["cdn\\.livechatinc\\.com"], js:["LiveChatWidget"], website:"https://livechat.com" },
{ name:"Salesforce", category:"CRM", html:["force\\.com","salesforce-communities"], website:"https://salesforce.com" },
{ name:"Freshdesk", category:"Live Chat", scripts:["widget\\.freshworks\\.com"], website:"https://freshworks.com" },

// ============ Maps ============
{ name:"Google Maps", category:"Maps", scripts:["maps\\.googleapis\\.com/maps/api"], website:"https://maps.google.com" },
{ name:"Mapbox", category:"Maps", scripts:["api\\.mapbox\\.com"], js:["mapboxgl"], website:"https://mapbox.com" },
{ name:"Leaflet", category:"Maps", scripts:["leaflet\\.js"], js:["L.version"], website:"https://leafletjs.com" },

// ============ Video ============
{ name:"YouTube", category:"Video Players", html:["youtube\\.com/embed","youtube-nocookie\\.com"], website:"https://youtube.com" },
{ name:"Vimeo", category:"Video Players", html:["player\\.vimeo\\.com"], website:"https://vimeo.com" },
{ name:"Wistia", category:"Video Players", scripts:["fast\\.wistia\\.(com|net)"], website:"https://wistia.com" },
{ name:"JW Player", category:"Video Players", scripts:["jwplayer\\.com|jwpltx\\.com"], js:["jwplayer"], website:"https://jwplayer.com" },

// ============ Cookie Consent ============
{ name:"OneTrust", category:"Consent Management", scripts:["cdn\\.cookielaw\\.org","onetrust"], website:"https://onetrust.com" },
{ name:"Cookiebot", category:"Consent Management", scripts:["consent\\.cookiebot\\.com"], website:"https://cookiebot.com" },
{ name:"Osano", category:"Consent Management", scripts:["cmp\\.osano\\.com"], website:"https://osano.com" },
{ name:"Termly", category:"Consent Management", scripts:["app\\.termly\\.io"], website:"https://termly.io" },

// ============ A/B Testing / Personalization ============
{ name:"Optimizely", category:"A/B Testing", scripts:["cdn\\.optimizely\\.com"], js:["optimizely"], website:"https://optimizely.com" },
{ name:"VWO", category:"A/B Testing", scripts:["dev\\.visualwebsiteoptimizer\\.com"], js:["_vwo_code"], website:"https://vwo.com" },
{ name:"Google Optimize", category:"A/B Testing", scripts:["googleoptimize\\.com"], website:"https://optimize.google.com" },
{ name:"LaunchDarkly", category:"A/B Testing", scripts:["app\\.launchdarkly\\.com","unpkg\\.com/launchdarkly"], website:"https://launchdarkly.com" },

// ============ Miscellaneous / Backend-as-a-Service ============
{ name:"GraphQL", category:"Miscellaneous", html:["graphql"], headers:{"x-graphql":""}, website:"https://graphql.org" },
{ name:"Apollo GraphQL", category:"Miscellaneous", js:["__APOLLO_CLIENT__"], website:"https://apollographql.com" },
{ name:"Firebase", category:"Miscellaneous", scripts:["firebasejs","firebaseio\\.com"], js:["firebase"], website:"https://firebase.google.com" },
{ name:"Supabase", category:"Miscellaneous", scripts:["supabase"], js:["supabase"], website:"https://supabase.com" },
{ name:"Sentry", category:"Miscellaneous", scripts:["browser\\.sentry-cdn\\.com","sentry\\.io"], js:["Sentry"], website:"https://sentry.io" },
{ name:"LogRocket", category:"Miscellaneous", scripts:["cdn\\.logrocket\\.io"], js:["LogRocket"], website:"https://logrocket.com" },
{ name:"Bugsnag", category:"Miscellaneous", scripts:["d2wy8f7a9ursnm\\.cloudfront\\.net/bugsnag"], js:["Bugsnag"], website:"https://bugsnag.com" },

// ============ Accessibility ============
{ name:"UserWay", category:"Accessibility", scripts:["cdn\\.userway\\.org"], website:"https://userway.org" },
{ name:"accessiBe", category:"Accessibility", scripts:["acsbapp\\.com"], website:"https://accessibe.com" },

// ============ Static Site Generators ============
{ name:"Jekyll", category:"Static Site Generator", meta:{generator:"Jekyll\\s*v?([\\d.]+)?"}, website:"https://jekyllrb.com" },
{ name:"Hugo", category:"Static Site Generator", meta:{generator:"Hugo\\s*([\\d.]+)?"}, website:"https://gohugo.io" },
{ name:"Eleventy", category:"Static Site Generator", meta:{generator:"Eleventy(\\s*v?[\\d.]+)?"}, website:"https://11ty.dev" },

// ============ Widgets / Reviews ============
{ name:"Trustpilot", category:"Widgets", scripts:["widget\\.trustpilot\\.com"], website:"https://trustpilot.com" },
{ name:"Yotpo", category:"Widgets", scripts:["staticw2\\.yotpo\\.com"], website:"https://yotpo.com" },
{ name:"Judge.me", category:"Widgets", scripts:["judge\\.me"], website:"https://judge.me" },

// ============ Authentication ============
{ name:"Sign in with Apple", category:"Authentication", scripts:["appleid\\.cdn-apple\\.com"], html:["appleid\\.auth"], website:"https://developer.apple.com/sign-in-with-apple" },
{ name:"Google Sign-In", category:"Authentication", scripts:["accounts\\.google\\.com/gsi/client"], html:["g_id_signin","data-client_id"], website:"https://developers.google.com/identity" },
{ name:"Facebook Login", category:"Authentication", scripts:["connect\\.facebook\\.net.*\\/sdk\\.js"], html:["fb-login-button"], website:"https://developers.facebook.com/docs/facebook-login" },
{ name:"Auth0", category:"Authentication", scripts:["cdn\\.auth0\\.com"], js:["auth0","webAuth"], website:"https://auth0.com" },
{ name:"Okta", category:"Authentication", scripts:["okta\\.com|oktacdn\\.com"], js:["OktaSignIn","OktaAuth"], website:"https://okta.com" },
{ name:"Clerk", category:"Authentication", scripts:["clerk\\.(dev|com|accounts\\.dev)"], js:["Clerk"], website:"https://clerk.com" },
{ name:"Firebase Authentication", category:"Authentication", scripts:["firebaseauth"], js:["firebase.auth"], website:"https://firebase.google.com/products/auth" },
{ name:"AWS Cognito", category:"Authentication", scripts:["amazon-cognito-identity"], website:"https://aws.amazon.com/cognito" },
{ name:"Microsoft Identity (MSAL)", category:"Authentication", scripts:["alcdn\\.msauth\\.net","@azure/msal"], js:["msal"], website:"https://learn.microsoft.com/entra/identity-platform" },
{ name:"WorkOS", category:"Authentication", scripts:["workos\\.com"], website:"https://workos.com" },
{ name:"Supabase Auth", category:"Authentication", js:["supabase"], html:["supabase\\.co/auth"], website:"https://supabase.com/auth" },

// ============ RUM / Performance monitoring ============
{ name:"New Relic Browser", category:"RUM", scripts:["js-agent\\.newrelic\\.com"], js:["NREUM"], website:"https://newrelic.com" },
{ name:"SpeedCurve LUX", category:"RUM", scripts:["cdn\\.speedcurve\\.com/js/lux"], js:["LUX"], website:"https://speedcurve.com" },
{ name:"Cloudflare Web Analytics", category:"RUM", scripts:["static\\.cloudflareinsights\\.com"], website:"https://cloudflare.com/web-analytics" },
{ name:"Vercel Speed Insights", category:"RUM", scripts:["vercel\\.com/speed-insights|vitals\\.vercel-insights\\.com"], website:"https://vercel.com/docs/speed-insights" },

// ============ Performance techniques ============
{ name:"Priority Hints (fetchpriority)", category:"Performance", html:["fetchpriority=[\"']"], website:"https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority" },
{ name:"Lazy Loading (native)", category:"Performance", html:["loading=[\"']lazy[\"']"], website:"https://developer.mozilla.org/docs/Web/Performance/Lazy_loading" },
{ name:"Resource Hints (preconnect/prefetch)", category:"Performance", html:["rel=[\"'](preconnect|dns-prefetch|prefetch|preload)[\"']"], website:"https://developer.mozilla.org/docs/Web/Performance/dns-prefetch" },
{ name:"HTTP/3 (QUIC)", category:"Performance", headers:{"alt-svc":"h3"}, website:"https://developer.mozilla.org/docs/Glossary/HTTP_3" },
{ name:"Brotli Compression", category:"Performance", headers:{"content-encoding":"br"}, website:"https://developer.mozilla.org/docs/Glossary/Brotli_compression" },
{ name:"Early Hints (103)", category:"Performance", headers:{"x-early-hints":""}, website:"https://developer.mozilla.org/docs/Web/HTTP/Status/103" },

// ============ Web Platform / Miscellaneous ============
{ name:"Progressive Web App (PWA)", category:"Miscellaneous", html:["rel=[\"']manifest[\"']","serviceWorker\\.register"], website:"https://web.dev/progressive-web-apps" },
{ name:"Open Graph Protocol", category:"Miscellaneous", html:["property=[\"']og:"], website:"https://ogp.me" },
{ name:"Twitter Cards", category:"Miscellaneous", meta:{"twitter:card":""}, website:"https://developer.x.com/en/docs/twitter-for-websites/cards" },
{ name:"Schema.org / JSON-LD", category:"Miscellaneous", html:["application/ld\\+json","itemscope\\s+itemtype=[\"']https?://schema\\.org"], website:"https://schema.org" },
{ name:"Web Components", category:"Miscellaneous", html:["customElements\\.define"], website:"https://developer.mozilla.org/docs/Web/API/Web_components" },
{ name:"AMP (Accelerated Mobile Pages)", category:"Miscellaneous", html:["<html[^>]+\\samp\\b","cdn\\.ampproject\\.org"], website:"https://amp.dev" },
{ name:"Dark Mode Support", category:"Miscellaneous", html:["prefers-color-scheme"], website:"https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme" },
];

// One-line educational context shown under each category header in the popup —
// this tool is meant to help developers learn *why* a category matters, not just spot logos.
const CATEGORY_BLURBS = {
  "CMS": "The system used to author and publish the site's content.",
  "Ecommerce": "Platform powering product catalog, cart, and checkout.",
  "JS Frameworks": "The core library the app's UI is built and rendered with.",
  "JS Libraries": "Smaller utilities the page pulls in for specific tasks.",
  "UI Frameworks": "Pre-built component/styling systems for layout and design.",
  "Analytics": "Tracks visitor behavior — page views, events, funnels.",
  "Tag Managers": "Lets teams add/manage marketing & analytics tags without code changes.",
  "CDN": "Distributes static assets from edge servers close to visitors for speed.",
  "PaaS": "Where the app is hosted/deployed — infers scaling & deploy model.",
  "Web Servers": "The software directly handling HTTP requests on the origin.",
  "Programming Languages": "Server-side language inferred from response headers.",
  "Web Frameworks": "Backend framework structuring routes, sessions, and views.",
  "Security": "Bot protection, CAPTCHAs, and abuse-prevention layers.",
  "Payment": "Checkout/payment processing provider.",
  "Documentation": "Tooling used to render API or product docs.",
  "Fonts": "Where custom typefaces are served from.",
  "Marketing Automation": "Email/lead nurturing and campaign tooling.",
  "Email": "Transactional or marketing email delivery service.",
  "Live Chat": "Customer support widget embedded on the page.",
  "CRM": "Customer relationship management platform integration.",
  "Maps": "Interactive map / geolocation provider.",
  "Video Players": "Embedded video hosting or player library.",
  "Consent Management": "Cookie/privacy consent banner provider (GDPR/CCPA tooling).",
  "A/B Testing": "Experimentation or feature-flagging platform.",
  "Accessibility": "Third-party accessibility overlay or widget.",
  "Static Site Generator": "Build tool that pre-renders pages at build time.",
  "Widgets": "Embedded third-party review or social proof widget.",
  "Authentication": "How users sign in — social login, IdP, or auth-as-a-service.",
  "RUM": "Real User Monitoring — measures real visitors' actual load performance.",
  "Performance": "Techniques the site uses to load faster (hints, compression, protocols).",
  "Miscellaneous": "Web platform features and metadata worth knowing about.",
};
