// StackSpy technology signature database — expansion pack.
// Adds long-tail CMS, ecommerce, payment, auth, search, JS/backend frameworks,
// hosting, security and marketing tools not covered in tech-1..4.
// Same T() DSL as the core files (see data/_init.js).

// ============ CMS / Site Builders ============
T("Contentstack","Headless CMS","https://contentstack.com",{d:"Enterprise headless CMS and content platform.",html:[r`contentstack\.io|cdn\.contentstack\.io`],js:{ContentstackLivePreview:""}});
T("Agility CMS","Headless CMS","https://agilitycms.com",{d:"Headless CMS with a hybrid page-management model.",html:[r`agilitycms\.com|cdn\.aglty\.io`]});
T("ButterCMS","Headless CMS","https://buttercms.com",{d:"Headless CMS delivered as an API with a hosted content dashboard.",html:[r`buttercms\.com|cdn\.buttercms\.com`],js:{Butter:""}});
T("Cosmic","Headless CMS","https://cosmicjs.com",{d:"API-first headless CMS for structured content.",html:[r`cosmicjs\.com|cdn\.cosmicjs\.com`]});
T("Decap CMS","Headless CMS","https://decapcms.org",{d:"Git-backed CMS (formerly Netlify CMS) that edits content as files in a repo.",html:[r`decap-cms|netlify-cms`],js:{CMS:"",netlifyIdentity:""}});
T("Statamic","CMS","https://statamic.com",{d:"Flat-file, Laravel-powered CMS.",html:[r`statamic`],headers:{"x-statamic-version":""},cookies:{statamic_session:""}});
T("Grav","CMS","https://getgrav.org",{d:"Flat-file PHP CMS with no database.",meta:{generator:r`GravCMS|Grav\s`},html:[r`/user/themes/`]});
T("October CMS","CMS","https://octobercms.com",{d:"Laravel-based CMS built around a plugin marketplace.",html:[r`/modules/system/assets/|october\.oc-`],cookies:{october_session:""}});
T("Wagtail","CMS","https://wagtail.org",{d:"Django-based CMS favoured for editorial control.",meta:{generator:r`Wagtail`},html:[r`wagtail-userbar`]});
T("Kirby","CMS","https://getkirby.com",{d:"File-based PHP CMS with no database requirement.",html:[r`/assets/kirby|kirbyuse`]});
T("Perch","CMS","https://perch.co",{d:"Lightweight PHP CMS aimed at designers.",html:[r`/perch/|perch_content`]});
T("SilverStripe","CMS","https://silverstripe.org",{d:"PHP MVC framework and CMS.",html:[r`silverstripe`],cookies:{SilverStripeSessionID:""}});
T("ProcessWire","CMS","https://processwire.com",{d:"PHP CMS/CMF built around a flexible page-tree API.",meta:{generator:r`ProcessWire`},cookies:{wire_challenge:""}});
T("ExpressionEngine","CMS","https://expressionengine.com",{d:"Flexible PHP publishing platform.",cookies:{exp_last_activity:"",exp_tracker:""}});
T("MODX","CMS","https://modx.com",{d:"PHP CMS/CMF focused on custom content structures.",meta:{generator:r`MODX`},cookies:{"PHPSESSID.+modx":""}});
T("Neos CMS","CMS","https://neos.io",{d:"PHP/Flow-based enterprise CMS.",html:[r`typo3-neos|neos-backend`]});
T("Bolt CMS","CMS","https://bolt.cm",{d:"Lightweight, Symfony-based CMS.",meta:{generator:r`Bolt`}});
T("PyroCMS","CMS","https://pyrocms.com",{d:"Laravel-based modular CMS.",html:[r`pyrocms`]});
T("Plone","CMS","https://plone.org",{d:"Python (Zope) based enterprise CMS.",html:[r`plone\.org|@@plone`],headers:{"x-caching-rule":r`Plone`}});
T("Bubble","Site Builders","https://bubble.io",{d:"No-code visual app builder that runs entirely in the browser.",html:[r`bubble\.io/appid|cdn\.bubble\.io`],js:{bubble_fn:""}});
T("Tilda","Site Builders","https://tilda.cc",{d:"Visual block-based website builder popular for landing pages.",html:[r`tilda\.ws|static\.tildacdn\.com`]});
T("Jimdo","Site Builders","https://jimdo.com",{d:"All-in-one hosted website builder.",html:[r`jimdo\.com|jimstatic\.com`]});
T("Strikingly","Site Builders","https://strikingly.com",{d:"One-page website builder aimed at small businesses.",html:[r`strikingly\.com|static\.strikinglycdn\.com`]});
T("GoDaddy Website Builder","Site Builders","https://godaddy.com/websites/website-builder",{d:"GoDaddy's drag-and-drop hosted site builder.",html:[r`websitebuilder\.godaddy\.com|godaddysites\.com`]});
T("Sitecore XP","CMS","https://sitecore.com",{d:"Enterprise .NET digital experience platform.",cookies:{SC_ANALYTICS_GLOBAL_COOKIE:""},headers:{"x-powered-by":r`Sitecore`}});
T("Episerver / Optimizely CMS","CMS","https://www.optimizely.com/products/content-management",{d:"Enterprise .NET CMS (formerly Episerver).",cookies:{EPiTrace:"","ASP.NET_SessionId.+episerver":""},headers:{"x-episerver-version":""}});
T("Kentico","CMS","https://kentico.com",{d:"Enterprise .NET CMS and digital experience platform.",cookies:{CMSPreferredCulture:"",CMSCsrfCookie:""}});
T("Liferay DXP","CMS","https://liferay.com",{d:"Java-based enterprise digital experience platform.",html:[r`liferay\.com|_liferay_`],cookies:{COOKIE_SUPPORT:""}});
T("Squiz Matrix","CMS","https://squiz.net",{d:"Enterprise PHP CMS used by government and education sites.",html:[r`__data/assets|squiz\.net`]});
T("BigCartel","Ecommerce","https://bigcartel.com",{d:"Simple hosted storefront for independent artists and makers.",html:[r`bigcartel\.com|cdn\.bigcartel\.com`]});
T("nopCommerce","Ecommerce","https://nopcommerce.com",{d:"Open-source ASP.NET ecommerce platform.",html:[r`nopcommerce|/plugins/nop\.`],meta:{generator:r`nopCommerce`}});
T("Spree Commerce","Ecommerce","https://spreecommerce.org",{d:"Open-source Ruby on Rails ecommerce platform.",html:[r`spree(-storefront)?|/assets/spree`],cookies:{_spree_session:""}});
T("Saleor","Ecommerce","https://saleor.io",{d:"Headless, GraphQL-first ecommerce platform.",html:[r`saleor`],requests:[r`/graphql/.*saleor`]});
T("Medusa","Ecommerce","https://medusajs.com",{d:"Open-source headless commerce engine built on Node.js.",requests:[r`/store/(products|carts)\b`],headers:{"x-powered-by":r`Medusa`}});
T("Swell","Ecommerce","https://swell.is",{d:"Headless commerce API and storefront platform.",html:[r`swell\.store|cdn\.swell\.store`],js:{swell:""}});
T("Commerce Layer","Ecommerce","https://commercelayer.io",{d:"Composable, API-first commerce backend.",requests:[r`commercelayer\.io`]});
T("VTEX","Ecommerce","https://vtex.com",{d:"Enterprise composable commerce platform popular in Latin America.",html:[r`vteximg\.com\.br|vtexassets\.com`],headers:{"x-vtex-request-id":""}});
T("Shift4Shop","Ecommerce","https://shift4shop.com",{d:"Hosted ecommerce platform (formerly 3dcart).",html:[r`shift4shop\.com|3dcartstores\.com`]});
T("Volusion","Ecommerce","https://volusion.com",{d:"Hosted ecommerce storefront platform.",html:[r`volusion\.com|cdn\.volusion\.com`]});
T("X-Cart","Ecommerce","https://x-cart.com",{d:"PHP-based ecommerce platform.",html:[r`x-cart|xcart_`]});
T("CS-Cart","Ecommerce","https://cs-cart.com",{d:"PHP ecommerce platform for multi-vendor marketplaces.",html:[r`cs-cart|cscart`],cookies:{cscart_user_id:""}});
T("Ecwid by Lightspeed","Ecommerce","https://ecwid.com",{d:"Embeddable storefront widget added to any website.",html:[r`app\.ecwid\.com|ecwid-platform`],js:{Ecwid:""}});
T("Wix Stores","Ecommerce","https://wix.com/stores",{d:"Wix's built-in ecommerce module.",html:[r`wixapps\.net.*stores`],js:{"Wix.Stores":""}});

// ============ Payment ============
T("Mercado Pago","Payment","https://mercadopago.com",{d:"Payment processor dominant across Latin America.",scripts:[r`sdk\.mercadopago\.com`],js:{MercadoPago:""}});
T("Alipay","Payment","https://global.alipay.com",{d:"Chinese mobile and online payment platform.",scripts:[r`gw\.alipay(objects)?\.com`],html:[r`alipay\.com/pay`]});
T("WeChat Pay","Payment","https://pay.weixin.qq.com",{d:"Payment method embedded in the WeChat super-app.",html:[r`wechatpay|weixin\.qq\.com/pay`]});
T("Sezzle","Payment","https://sezzle.com",{d:"Buy-now-pay-later checkout widget.",scripts:[r`gateway\.sezzle\.com|sdk\.sezzle\.com`],js:{Sezzle:""}});
T("Zip (Quadpay)","Payment","https://zip.co",{d:"Buy-now-pay-later payment option.",scripts:[r`zip\.co|cdn\.quadpay\.com`],js:{Zip:""}});
T("Authorize.Net","Payment","https://authorize.net",{d:"Legacy card-processing gateway widely used in the US.",scripts:[r`js\.authorize\.net`],js:{Accept:""}});
T("Worldpay","Payment","https://worldpay.com",{d:"Global card-payment processor and gateway.",scripts:[r`libs\.worldpay\.com`]});
T("Checkout.com","Payment","https://checkout.com",{d:"Unified global payments platform.",scripts:[r`cdn\.checkout\.com`],js:{Frames:""}});
T("2Checkout / Verifone","Payment","https://verifone.com",{d:"Digital-goods focused payment processor.",scripts:[r`secure\.2checkout\.com`],js:{TCO:""}});
T("Skrill","Payment","https://skrill.com",{d:"Digital wallet and payment processor.",html:[r`pay\.skrill\.com`]});
T("GoCardless","Payment","https://gocardless.com",{d:"Recurring bank-debit payment collection.",scripts:[r`js\.gocardless\.com`],js:{GoCardless:""}});
T("Wise (payments)","Payment","https://wise.com",{d:"Cross-border payment and payout provider.",html:[r`wise\.com/pay`]});
T("PayU","Payment","https://payu.com",{d:"Payment gateway strong across emerging markets.",scripts:[r`checkout\.payu\.(com|in)`],js:{payuresponse:""}});
T("Cashfree","Payment","https://cashfree.com",{d:"Indian payment gateway and payout platform.",scripts:[r`sdk\.cashfree\.com`],js:{Cashfree:""}});
T("Xendit","Payment","https://xendit.co",{d:"Payment infrastructure for Southeast Asia.",scripts:[r`js\.xendit\.co`],js:{Xendit:""}});
T("Midtrans","Payment","https://midtrans.com",{d:"Indonesian payment gateway.",scripts:[r`app\.midtrans\.com/snap`],js:{snap:""}});
T("Iyzico","Payment","https://iyzico.com",{d:"Turkish payment gateway.",scripts:[r`static\.iyzipay\.com`]});

// ============ Authentication ============
T("Frontegg","Authentication","https://frontegg.com",{d:"User-management and auth platform for B2B SaaS.",scripts:[r`frontegg\.com`],js:{frontegg:""}});
T("Descope","Authentication","https://descope.com",{d:"Passwordless and CIAM authentication platform.",scripts:[r`descope\.com`],js:{Descope:""}});
T("Ory","Authentication","https://ory.sh",{d:"Open-source identity and access-management stack.",requests:[r`\.projects\.oryapis\.com`]});
T("SuperTokens","Authentication","https://supertokens.com",{d:"Open-source authentication SDK and service.",js:{supertokens:""},requests:[r`/auth/session/refresh`]});
T("Stytch","Authentication","https://stytch.com",{d:"Passwordless and passkey authentication API.",scripts:[r`stytch\.com`],js:{StytchB2B:"","Stytch":""}});
T("Magic (magic.link)","Authentication","https://magic.link",{d:"Passwordless login SDK using magic links and wallets.",scripts:[r`auth\.magic\.link`],js:{Magic:""}});
T("FusionAuth","Authentication","https://fusionauth.io",{d:"Self-hostable customer identity and access management.",cookies:{"fusionauth\\.sso":""}});
T("OneLogin","Authentication","https://onelogin.com",{d:"Enterprise single sign-on and identity platform.",html:[r`onelogin\.com`]});
T("Ping Identity","Authentication","https://pingidentity.com",{d:"Enterprise identity and access management.",html:[r`pingone\.com|pingidentity\.com`]});
T("JumpCloud","Authentication","https://jumpcloud.com",{d:"Cloud directory and SSO platform.",html:[r`jumpcloud\.com`]});
T("WorkOS AuthKit","Authentication","https://workos.com",{d:"Drop-in auth flow built on WorkOS.",html:[r`authkit\.workos\.com`]});

// ============ Search ============
T("Swiftype","Search","https://swiftype.com",{d:"Hosted site-search widget (Elastic App Search predecessor).",scripts:[r`s\.swiftypecdn\.com`],js:{Swiftype:""}});
T("Elastic App Search","Search","https://elastic.co/app-search",{d:"Hosted search-as-a-service built on Elasticsearch.",requests:[r`\.ent-search\.aws\.elastic-cloud\.com`]});
T("Coveo","Search","https://coveo.com",{d:"Enterprise AI-powered search and recommendations.",scripts:[r`static\.cloud\.coveo\.com`],js:{Coveo:""}});
T("Klevu","Search","https://klevu.com",{d:"AI search and merchandising for ecommerce.",scripts:[r`js\.klevu\.com`],js:{KlevuJS:""}});
T("Doofinder","Search","https://doofinder.com",{d:"Site-search widget aimed at ecommerce sites.",scripts:[r`doofinder\.com`],js:{doofinderApp:""}});
T("Constructor.io","Search","https://constructor.io",{d:"Ecommerce search and product-discovery API.",requests:[r`ac\.cnstrc\.com`]});
T("Searchspring","Search","https://searchspring.com",{d:"Ecommerce site search and merchandising.",scripts:[r`searchspring\.(com|io)`],js:{SearchspringSearchBar:""}});

// ============ JS Frameworks / Libraries ============
T("Riot.js","JS Frameworks","https://riot.js.org",{d:"Minimal, component-based UI library.",js:{riot:""}});
T("Marko","JS Frameworks","https://markojs.com",{d:"Fast, HTML-based UI language and compiler from eBay.",html:[r`data-marko-key`]});
T("Elm","JS Frameworks","https://elm-lang.org",{d:"Purely functional language that compiles to JavaScript.",js:{Elm:""},scripts:[r`elm\.js`]});
T("Polymer","JS Frameworks","https://polymer-project.org",{d:"Google's early web-components library.",js:{Polymer:""}});
T("Stencil","JS Frameworks","https://stenciljs.com",{d:"Compiler that generates standards-based web components.",html:[r`data-stencil-build`]});
T("FAST (Microsoft)","JS Frameworks","https://fast.design",{d:"Microsoft's web-component and design-system toolkit.",js:{FAST:""}});
T("Aurelia","JS Frameworks","https://aurelia.io",{d:"Modular front-end framework with two-way binding.",js:{aurelia:""}});
T("Vaadin","JS Frameworks","https://vaadin.com",{d:"Java-based full-stack web-app framework.",html:[r`vaadin-connect|VAADIN/`]});
T("Dojo Toolkit","JS Frameworks","https://dojotoolkit.org",{d:"Legacy modular JavaScript toolkit.",js:{dojo:"",dijit:""}});
T("ExtJS","JS Frameworks","https://sencha.com/products/extjs",{d:"Enterprise JavaScript framework for data-heavy UIs.",js:{Ext:""}});
T("YUI (Yahoo UI)","JS Frameworks","https://yuilibrary.com",{d:"Legacy Yahoo JavaScript library.",js:{YUI:""}});

// ============ Charting ============
T("ApexCharts","JS Libraries","https://apexcharts.com",{d:"Modern interactive SVG chart library.",js:{ApexCharts:""},scripts:[r`apexcharts(\.min)?\.js`]});
T("Recharts","JS Libraries","https://recharts.org",{d:"Composable charting library built on React and D3.",html:[r`recharts-wrapper`]});
T("Victory","JS Libraries","https://formidable.com/open-source/victory",{d:"React charting component library.",html:[r`VictoryContainer`]});
T("Nivo","JS Libraries","https://nivo.rocks",{d:"Rich set of React data-visualisation components.",html:[r`nivo-`]});
T("amCharts","JS Libraries","https://amcharts.com",{d:"Interactive chart and map library.",scripts:[r`cdn\.amcharts\.com`],js:{am4core:"",am5:""}});
T("Chartist.js","JS Libraries","https://gionkunz.github.io/chartist-js",{d:"Lightweight responsive SVG chart library.",js:{Chartist:""}});
T("Google Charts","JS Libraries","https://developers.google.com/chart",{d:"Google's hosted charting library.",scripts:[r`www\.gstatic\.com/charts/loader\.js`],js:{google:{visualization:""}}});
T("FusionCharts","JS Libraries","https://fusioncharts.com",{d:"Enterprise JavaScript charting library.",js:{FusionCharts:""}});
T("CanvasJS","JS Libraries","https://canvasjs.com",{d:"HTML5 canvas-based chart library.",js:{CanvasJS:""}});

// ============ Animation ============
T("Motion One","Animation","https://motion.dev",{d:"Lightweight animation library built on the Web Animations API.",js:{Motion:""}});
T("Rellax","Animation","https://dixonandmoe.com/rellax",{d:"Vanilla-JS parallax scroll library.",js:{Rellax:""}});
T("ScrollReveal","Animation","https://scrollrevealjs.org",{d:"Scroll-triggered animation library.",js:{ScrollReveal:""}});
T("Vivus.js","Animation","https://maxwellito.github.io/vivus",{d:"Animates SVG paths as if being drawn.",js:{Vivus:""}});
T("Velocity.js","Animation","http://velocityjs.org",{d:"Fast animation engine that works alongside jQuery.",js:{Velocity:""}});

// ============ State management ============
T("Recoil","State Management","https://recoiljs.org",{d:"Experimental state-management library for React from Meta.",html:[r`recoil-`]});
T("Jotai","State Management","https://jotai.org",{d:"Primitive, atomic state-management library for React.",js:{jotaiDevtoolsStore:""}});
T("Valtio","State Management","https://valtio.pmnd.rs",{d:"Proxy-based state management for React.",js:{__VALTIO_DEVTOOLS_HOOK__:""}});
T("XState","State Management","https://stately.ai/docs/xstate",{d:"State-machine and statechart library.",js:{__xstate__:""}});
T("Pinia","State Management","https://pinia.vuejs.org",{d:"Official Vue.js state-management library.",js:{__pinia:""}});
T("Vuex","State Management","https://vuex.vuejs.org",{d:"Legacy state-management library for Vue.js.",js:{"Vue.$store":""}});
T("NgRx","State Management","https://ngrx.io",{d:"Reactive-state library for Angular built on RxJS.",html:[r`ngrx-store-devtools`]});

// ============ CSS Frameworks ============
T("UIkit","UI Frameworks","https://getuikit.com",{d:"Lightweight modular front-end framework.",js:{UIkit:""},classes:[r`^uk-`]});
T("Pure.css","UI Frameworks","https://purecss.io",{d:"Minimal responsive CSS module set from Yahoo.",classes:[r`^pure-`]});
T("Skeleton","UI Frameworks","http://getskeleton.com",{d:"Minimal responsive boilerplate CSS.",classes:[r`^(one|two|three)-(half|third|fourth|fifth|sixth)$##c=40`],html:[r`skeleton(\.min)?\.css`]});
T("Milligram","UI Frameworks","https://milligram.io",{d:"Minimalist CSS framework focused on readability.",html:[r`milligram`]});
T("Spectre.css","UI Frameworks","https://picturepan2.github.io/spectre",{d:"Lightweight, responsive CSS framework.",classes:[r`^(chip|toast|tile)$`],html:[r`spectre(\.min)?\.css`]});
T("Water.css","UI Frameworks","https://watercss.kognise.dev",{d:"Classless CSS framework that styles bare HTML.",html:[r`water\.css`]});
T("Simple.css","UI Frameworks","https://simplecss.org",{d:"Classless CSS framework for readable default styling.",html:[r`simple\.min\.css`]});

// ============ Icon Sets ============
T("Heroicons","Icon Sets","https://heroicons.com",{d:"Hand-crafted SVG icon set from the Tailwind team.",html:[r`heroicons`]});
T("Iconoir","Icon Sets","https://iconoir.com",{d:"Open-source SVG icon library.",html:[r`iconoir`]});
T("Octicons","Icon Sets","https://primer.style/octicons",{d:"GitHub's open-source icon set.",classes:[r`^octicon(-|$)`]});
T("Ant Design Icons","Icon Sets","https://ant.design/components/icon",{d:"Icon set bundled with the Ant Design component library.",classes:[r`^anticon(-|$)`]});
T("Devicon","Icon Sets","https://devicon.dev",{d:"Icon set representing programming languages and tools.",classes:[r`^devicon-`]});
T("Weather Icons","Icon Sets","https://erikflowers.github.io/weather-icons",{d:"Icon font for weather conditions.",classes:[r`^wi-`]});

// ============ Video & Media ============
T("Brightcove","Video & Media","https://brightcove.com",{d:"Enterprise video hosting and streaming platform.",scripts:[r`players\.brightcove\.net`],js:{videojs:{"getPlayers":""}}});
T("Kaltura","Video & Media","https://kaltura.com",{d:"Video platform used for streaming and video management.",scripts:[r`cdnapisec\.kaltura\.com`],js:{kWidget:""}});
T("Panopto","Video & Media","https://panopto.com",{d:"Video platform used mainly for education and corporate training.",html:[r`panopto\.com`]});
T("Cloudflare Stream","Video & Media","https://developers.cloudflare.com/stream",{d:"Video hosting and delivery built on Cloudflare's network.",scripts:[r`embed\.cloudflarestream\.com`]});
T("Vidyard","Video & Media","https://vidyard.com",{d:"Video hosting platform aimed at sales and marketing.",scripts:[r`play\.vidyard\.com`],js:{VidyardV4:""}});
T("Loom","Video & Media","https://loom.com",{d:"Screen-recording video embed widget.",scripts:[r`cdn\.loom\.com`]});

// ============ Maps ============
T("HERE Maps","Maps","https://here.com",{d:"Mapping and location-data platform.",scripts:[r`js\.api\.here\.com`],js:{H:""}});
T("TomTom Maps","Maps","https://developer.tomtom.com/maps-sdk-web-js",{d:"Mapping SDK from TomTom.",scripts:[r`api\.tomtom\.com/maps-sdk`],js:{tt:""}});
T("Baidu Maps","Maps","https://lbsyun.baidu.com",{d:"Chinese mapping platform from Baidu.",scripts:[r`api\.map\.baidu\.com`],js:{BMap:""}});
T("Amap (Gaode)","Maps","https://lbs.amap.com",{d:"Chinese mapping platform from Alibaba (Gaode).",scripts:[r`webapi\.amap\.com`],js:{AMap:""}});
T("Yandex Maps","Maps","https://yandex.com/maps-api",{d:"Mapping platform from Yandex.",scripts:[r`api-maps\.yandex\.(ru|com)`],js:{ymaps:""}});

// ============ Reviews ============
T("Bazaarvoice","Reviews","https://bazaarvoice.com",{d:"Enterprise ratings and reviews platform.",scripts:[r`apps\.bazaarvoice\.com`],js:{BV:""}});
T("PowerReviews","Reviews","https://powerreviews.com",{d:"Ratings and reviews platform for retailers.",scripts:[r`ui\.powerreviews\.com`],js:{POWERREVIEWS:""}});
T("Okendo","Reviews","https://okendo.io",{d:"Reviews and loyalty platform built for Shopify.",scripts:[r`cdn\.okendo\.io`],js:{okeReviewsWidget:""}});
T("Loox","Reviews","https://loox.io",{d:"Photo-review app popular on Shopify.",scripts:[r`loox(cdn)?\.(io|com)`],js:{LOOX:""}});
T("Stamped.io","Reviews","https://stamped.io",{d:"Ratings, reviews and loyalty platform.",scripts:[r`cdn\d?\.stamped\.io`],js:{StampedFn:""}});
T("Feefo","Reviews","https://feefo.com",{d:"Independent customer-reviews platform.",scripts:[r`api\.feefo\.com|cdn\.feefo\.com`]});

// ============ Live Chat ============
T("Olark","Live Chat","https://olark.com",{d:"Live chat widget for sales and support.",scripts:[r`static\.olark\.com`],js:{olark:""}});
T("HelpCrunch","Live Chat","https://helpcrunch.com",{d:"Live chat and customer-communication platform.",scripts:[r`widget\.helpcrunch\.com`],js:{HelpCrunch:""}});
T("Chatra","Live Chat","https://chatra.com",{d:"Live chat widget aimed at small businesses.",scripts:[r`call\.chatra\.io`],js:{Chatra:""}});
T("Userlike","Live Chat","https://userlike.com",{d:"Live chat and chatbot software for websites.",scripts:[r`userlike\.com/widget`],js:{userlike:""}});
T("Smartsupp","Live Chat","https://smartsupp.com",{d:"Live chat with recordings and chatbot support.",scripts:[r`smartsuppchat\.com`],js:{smartsupp:""}});
T("Kayako","Live Chat","https://kayako.com",{d:"Customer-support and live-chat platform.",scripts:[r`kayako\.com/messenger`]});

// ============ Marketing / CRM / Email ============
T("Iterable","Marketing","https://iterable.com",{d:"Cross-channel marketing automation platform.",scripts:[r`api\.iterable\.com`],js:{iterableApi:""}});
T("Sailthru","Marketing","https://sailthru.com",{d:"Marketing automation and personalization platform.",scripts:[r`ak\.sail-horizon\.com`],js:{Sailthru:""}});
T("Omnisend","Marketing","https://omnisend.com",{d:"Ecommerce email and SMS marketing automation.",scripts:[r`omnisrc\.com|cdn\.omnisend\.com`],js:{omnisend:""}});
T("MoEngage","Marketing","https://moengage.com",{d:"Customer engagement and marketing automation platform.",scripts:[r`cdn\.moengage\.com`],js:{Moengage:""}});
T("Salesforce Marketing Cloud","Marketing","https://salesforce.com/products/marketing-cloud",{d:"Enterprise marketing-automation suite from Salesforce.",scripts:[r`cl2\.exacttarget\.com|c\.evergage\.com`]});
T("Constant Contact","Marketing","https://constantcontact.com",{d:"Email marketing and small-business marketing platform.",scripts:[r`img\.constantcontact\.com`]});
T("GetResponse","Marketing","https://getresponse.com",{d:"Email marketing and marketing-automation platform.",scripts:[r`gr-cdn\.com`]});
T("AWeber","Marketing","https://aweber.com",{d:"Email marketing platform aimed at small businesses.",scripts:[r`forms\.aweber\.com`]});
T("Zoho Campaigns","Marketing","https://zoho.com/campaigns",{d:"Email marketing tool from the Zoho suite.",scripts:[r`csz\.zohopublic\.com`]});
T("Sendgrid Marketing Campaigns","Marketing","https://sendgrid.com",{d:"Email delivery and marketing-campaign tool.",html:[r`sendgrid\.net`]});

// ============ Consent management ============
T("Cookie-Script","Consent Management","https://cookie-script.com",{d:"Cookie consent banner service.",scripts:[r`cdn\.cookie-script\.com`],js:{CookieScript:""}});
T("Civic Cookie Control","Consent Management","https://civicuk.com/cookie-control",{d:"Cookie consent management widget.",scripts:[r`cc\.cdn\.civiccomputing\.com`],js:{CookieControl:""}});
T("Cookie Information","Consent Management","https://cookieinformation.com",{d:"Nordic-focused cookie consent management platform.",scripts:[r`policy\.cookieinformation\.(com|org)`]});
T("Ketch","Consent Management","https://ketch.com",{d:"Data-privacy and consent-management platform.",scripts:[r`global\.ketchcdn\.com`],js:{semaphore:""}});
T("Sourcepoint","Consent Management","https://sourcepoint.com",{d:"Consent management platform used by publishers.",scripts:[r`cdn\.privacy-mgmt\.com`],js:{_sp_:""}});

// ============ A/B testing / feature flags ============
T("Split.io","A/B Testing","https://split.io",{d:"Feature-flagging and experimentation platform.",js:{splitio:""}});
T("Kameleoon","A/B Testing","https://kameleoon.com",{d:"A/B testing and personalization platform.",scripts:[r`kameleoon\.(eu|com)`],js:{Kameleoon:""}});
T("Convert.com","A/B Testing","https://convert.com",{d:"A/B testing and conversion-optimization platform.",scripts:[r`cdn-\d+\.convertexperiments\.com`],js:{convert:""}});
T("Unbounce","A/B Testing","https://unbounce.com",{d:"Landing-page builder with built-in A/B testing.",scripts:[r`static\.unbounce\.com`],js:{Unbounce:""}});
T("Instapage","A/B Testing","https://instapage.com",{d:"Landing-page platform with experimentation tools.",html:[r`instapage\.com|instapagecdn\.com`]});
T("Flagsmith","A/B Testing","https://flagsmith.com",{d:"Open-source feature-flag and remote-config service.",requests:[r`edge\.api\.flagsmith\.com|api\.flagsmith\.com`]});
T("ConfigCat","A/B Testing","https://configcat.com",{d:"Feature-flag service for gradual rollouts.",requests:[r`cdn-global\.configcat\.com`]});

// ============ Monitoring ============
T("AppDynamics Browser RUM","Monitoring","https://appdynamics.com",{d:"Real-user monitoring agent from Cisco AppDynamics.",scripts:[r`cdn\.appdynamics\.com`],js:{adrum:""}});
T("Instana","Monitoring","https://instana.com",{d:"Real-user monitoring and observability agent from IBM.",js:{ineum:""}});
T("Highlight.io","Monitoring","https://highlight.io",{d:"Open-source session-replay and error-monitoring platform.",js:{H:{init:""}}});
T("Sematext","Monitoring","https://sematext.com",{d:"Real-user monitoring and logging platform.",scripts:[r`rum\.sematext\.com`]});
T("Airbrake","Monitoring","https://airbrake.io",{d:"Error and exception tracking service.",scripts:[r`d3fyz3l6i5vaf0\.cloudfront\.net.*airbrake`],js:{Airbrake:""}});
T("Atatus","Monitoring","https://atatus.com",{d:"Application performance and real-user monitoring.",scripts:[r`cdn\.atatus\.com`],js:{atatus:""}});

// ============ Security / Bot management / CAPTCHA ============
T("Kasada","Security","https://kasada.io",{d:"Bot-mitigation and anti-automation platform.",scripts:[r`\.kasada\.io`]});
T("Radware Bot Manager","Security","https://radware.com/solutions/bot-manager",{d:"Bot-detection and mitigation service.",cookies:{"_rbzid|_rbzsessionid":""}});
T("GeeTest","Security","https://geetest.com",{d:"Interactive CAPTCHA widget popular in Asia.",scripts:[r`static\.geetest\.com`],js:{initGeetest:""}});
T("F5 Distributed Cloud Bot Defense","Security","https://f5.com/products/distributed-cloud-services/bot-defense",{d:"Bot-defence service (formerly Shape Security).",html:[r`shape-security|f5\.com.*bot`]});

// ============ CDN / Hosting ============
T("StackPath","CDN","https://stackpath.com",{d:"Edge and CDN network for security and performance.",headers:{"x-hw":r`StackPath`,server:r`\bnetdna\b`}});
T("G-Core Labs","CDN","https://gcore.com",{d:"Global CDN and edge-computing provider.",headers:{server:r`gcore`}});
T("Edgio (Limelight)","CDN","https://edg.io",{d:"Edge platform and CDN (formerly Limelight/Layer0).",headers:{"x-ec-custom-error":"","server":r`ECS \(`}});
T("CacheFly","CDN","https://cachefly.com",{d:"Content-delivery network specialising in low-latency delivery.",headers:{server:r`CFS`}});
T("Azure Static Web Apps","Hosting","https://azure.microsoft.com/products/app-service/static",{d:"Microsoft's managed static-site and API hosting service.",headers:{"x-azure-ref":""}});
T("GitLab Pages","Hosting","https://docs.gitlab.com/ee/user/project/pages",{d:"Static site hosting built into GitLab.",headers:{"x-gitlab-meta":""}});
T("Cloudways","Hosting","https://cloudways.com",{d:"Managed cloud hosting platform for PHP applications.",headers:{"x-cloudways":""}});
T("Hostinger","Hosting","https://hostinger.com",{d:"Budget shared and cloud hosting provider.",headers:{server:r`\bhostinger\b`}});
T("Bluehost","Hosting","https://bluehost.com",{d:"WordPress-focused shared hosting provider.",headers:{"x-served-by":r`bluehost`}});
T("Vultr","Hosting","https://vultr.com",{d:"Cloud-compute and VPS hosting provider.",headers:{server:r`\bvultr\b`}});
T("OVHcloud","Hosting","https://ovhcloud.com",{d:"European cloud-infrastructure and hosting provider.",headers:{server:r`\bovh\b`}});
T("Scalingo","Hosting","https://scalingo.com",{d:"European PaaS for deploying applications with git push.",headers:{"x-request-id":r`.*`,server:r`scalingo`}});
T("Platform.sh","Hosting","https://platform.sh",{d:"PaaS for building and deploying complex applications.",headers:{"x-platform-cluster":""}});

// ============ Backend Frameworks ============
T("Micronaut","Web Frameworks","https://micronaut.io",{d:"JVM framework for building lightweight, fast microservices.",headers:{"x-powered-by":r`Micronaut`}});
T("Quarkus","Web Frameworks","https://quarkus.io",{d:"Kubernetes-native Java framework tuned for fast startup.",headers:{"x-powered-by":r`Quarkus`}});
T("Play Framework","Web Frameworks","https://playframework.com",{d:"Scala/Java web framework built for high-concurrency apps.",cookies:{PLAY_SESSION:""}});
T("Ktor","Web Frameworks","https://ktor.io",{d:"Kotlin framework for building asynchronous servers and clients.",headers:{server:r`ktor`}});
T("Actix","Web Frameworks","https://actix.rs",{d:"High-performance Rust web framework.",headers:{server:r`actix-web`}});
T("Rocket (Rust)","Web Frameworks","https://rocket.rs",{d:"Type-safe Rust web framework.",headers:{server:r`Rocket`}});
T("Gin (Go)","Web Frameworks","https://gin-gonic.com",{d:"Fast HTTP web framework written in Go.",headers:{"x-powered-by":r`Gin`}});
T("Echo (Go)","Web Frameworks","https://echo.labstack.com",{d:"High-performance, minimalist Go web framework.",headers:{server:r`echo`}});
T("Fiber (Go)","Web Frameworks","https://gofiber.io",{d:"Express-inspired Go web framework built on fasthttp.",headers:{server:r`fiber`}});
T("Sails.js","Web Frameworks","https://sailsjs.com",{d:"MVC Node.js framework built on Express.",cookies:{"sails\\.sid":""}});
T("AdonisJS","Web Frameworks","https://adonisjs.com",{d:"Full-stack Node.js framework with a Laravel-like structure.",cookies:{adonis_session:""}});
T("Feathers.js","Web Frameworks","https://feathersjs.com",{d:"Lightweight Node.js framework for real-time APIs.",headers:{"x-powered-by":r`Feathers`}});
T("LoopBack","Web Frameworks","https://loopback.io",{d:"Node.js framework for building REST APIs quickly.",headers:{"x-powered-by":r`LoopBack`}});
T("Hanami","Web Frameworks","https://hanamirb.org",{d:"Lightweight Ruby web framework alternative to Rails.",cookies:{"_hanami\\.session":""}});
T("CherryPy","Web Frameworks","https://cherrypy.dev",{d:"Minimalist Python object-oriented web framework.",headers:{server:r`CherryPy`}});
T("Tornado","Web Frameworks","https://www.tornadoweb.org",{d:"Python async web framework and networking library.",headers:{server:r`TornadoServer`}});
T("Pyramid","Web Frameworks","https://trypyramid.com",{d:"Flexible Python web framework for small and large apps.",cookies:{"pyramid\\.session":""}});

// ============ Web Servers ============
T("Puma","Web Servers","https://puma.io",{d:"Concurrent Ruby web server used by Rails apps.",headers:{server:r`^Puma`}});
T("Unicorn","Web Servers","https://yhbt.net/unicorn",{d:"Rack HTTP server for Ruby web applications.",headers:{server:r`Unicorn`}});
T("lighttpd","Web Servers","https://lighttpd.net",{d:"Lightweight, high-performance web server.",headers:{server:r`lighttpd`}});
T("H2O","Web Servers","https://h2o.examp1e.net",{d:"HTTP server optimised for HTTP/2 performance.",headers:{server:r`^h2o\b`}});
T("Undertow","Web Servers","https://undertow.io",{d:"Lightweight, high-performance Java web server (used by WildFly).",headers:{server:r`Undertow`}});

// ============ Documentation / SSG ============
T("Docsify","Documentation","https://docsify.js.org",{d:"Docs site generator that renders Markdown at runtime with no build step.",js:{$docsify:""}});
T("Nextra","Documentation","https://nextra.site",{d:"Next.js-based static site generator for docs.",html:[r`nextra-`]});
T("Read the Docs theme","Documentation","https://readthedocs.org",{d:"Documentation hosting platform built around Sphinx.",html:[r`readthedocs`]});
T("Middleman","Static Site Generators","https://middlemanapp.com",{d:"Ruby-based static site generator.",html:[r`Middleman`]});
T("Metalsmith","Static Site Generators","https://metalsmith.io",{d:"Pluggable Node.js static-site generator.",html:[r`metalsmith`]});
T("Publii","Static Site Generators","https://getpublii.com",{d:"Desktop app for building static CMS-driven sites.",meta:{generator:r`Publii`}});
T("Bridgetown","Static Site Generators","https://bridgetownrb.com",{d:"Ruby static-site generator built on Jekyll's foundation.",meta:{generator:r`Bridgetown`}});

