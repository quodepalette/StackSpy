// Analytics, tag managers, advertising, marketing, chat, consent, experimentation, monitoring.

// ───────────── Tag managers ─────────────
T("Google Tag Manager","Tag Managers","https://tagmanager.google.com",{
  d:"A container snippet that lets marketers add and change tracking tags without a code deploy. Whatever loads through it is invisible in the page source.",
  tip:"In Network, filter by 'gtm.js' then watch what it pulls in afterwards. Add ?gtm_debug=x to preview a container.",
  scripts:[r`googletagmanager\.com/gtm\.js`],iframes:[r`googletagmanager\.com/ns\.html`],js:{google_tag_manager:"",dataLayer:"##c=30"},
  extract:{"Container IDs":r`html:GTM-[A-Z0-9]{4,8}##all`}
});
T("Adobe Experience Platform Launch","Tag Managers","https://experienceleague.adobe.com/docs/experience-platform/tags/home.html",{d:"Adobe's tag manager (formerly Launch / DTM).",scripts:[r`assets\.adobedtm\.com`],js:{_satellite:""}});
T("Tealium","Tag Managers","https://tealium.com",{d:"Enterprise tag manager and customer data hub.",scripts:[r`tags\.tiqcdn\.com|tealiumiq\.com`],js:{utag:"",utag_data:""}});
T("Segment","Analytics","https://segment.com",{d:"Customer-data pipeline: collect events once, forward them to many tools.",scripts:[r`cdn\.segment\.(com|io)/analytics\.js`],requests:[r`api\.segment\.io|cdn\.segment\.com`],js:{"analytics.SNIPPET_VERSION":r`^(.+)$##v=\1`,"analytics.Integrations":""},cookies:{"ajs_(user|anonymous)_id":""},storage:[r`^ajs_`]});
T("RudderStack","Analytics","https://rudderstack.com",{d:"Open-source Segment alternative.",scripts:[r`cdn\.rudderlabs\.com`],js:{rudderanalytics:""}});

// ───────────── Analytics ─────────────
T("Google Analytics 4","Analytics","https://analytics.google.com",{
  d:"Google's event-based analytics. The G- measurement ID identifies which property receives the data.",
  scripts:[r`googletagmanager\.com/gtag/js\?id=G-`],requests:[r`google-analytics\.com/g/collect|analytics\.google\.com/g/collect|/g/collect\?v=2`],
  cookies:{"_ga_[A-Z0-9]+":""},html:[r`gtag\(\s*['"]config['"]\s*,\s*['"]G-`],
  extract:{"Measurement IDs":r`html:G-[A-Z0-9]{8,12}##all`}
});
T("Universal Analytics","Analytics","https://support.google.com/analytics/answer/11583528",{d:"Google's previous analytics generation (UA-…), sunset in 2023 — its presence suggests an unmaintained site.",scripts:[r`google-analytics\.com/(ga|analytics)\.js`],js:{GoogleAnalyticsObject:""},html:[r`UA-\d{4,10}-\d{1,3}`],extract:{"Property IDs":r`html:UA-\d{4,10}-\d{1,3}##all`}});
T("Google Ads","Advertising","https://ads.google.com",{d:"Conversion tracking and remarketing for Google Ads.",scripts:[r`googleadservices\.com/pagead/conversion|googletagmanager\.com/gtag/js\?id=AW-`],requests:[r`googleads\.g\.doubleclick\.net|googleadservices\.com`],cookies:{"_gcl_(au|aw|dc)":""},extract:{"Conversion IDs":r`html:AW-\d{6,12}##all`}});
T("Google AdSense","Advertising","https://adsense.google.com",{d:"Display ads monetised through Google.",scripts:[r`pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js`],js:{adsbygoogle:""},classes:[r`^adsbygoogle$`],extract:{"Publisher ID":r`html:ca-pub-\d{10,20}`}});
T("Google Publisher Tag","Advertising","https://developers.google.com/publisher-tag",{d:"Ad Manager's tag for dynamic ad slots and header bidding.",scripts:[r`googletagservices\.com/tag/js/gpt\.js|securepubads\.g\.doubleclick\.net`],js:{googletag:""}});
T("Meta Pixel","Advertising","https://facebook.com/business/tools/meta-pixel",{d:"Facebook/Instagram conversion and retargeting pixel.",scripts:[r`connect\.facebook\.net/[\w_]+/fbevents\.js`],requests:[r`facebook\.com/tr\b`],js:{fbq:""},cookies:{_fbp:"",_fbc:""},extract:{"Pixel ID":r`html:fbq\(\s*['"]init['"]\s*,\s*['"](\d{10,20})['"]`}});
T("TikTok Pixel","Advertising","https://ads.tiktok.com",{d:"TikTok ad attribution.",scripts:[r`analytics\.tiktok\.com`],js:{ttq:""},cookies:{_ttp:""}});
T("Pinterest Tag","Advertising","https://business.pinterest.com",{d:"Pinterest conversion tracking.",scripts:[r`s\.pinimg\.com/ct/core\.js`],js:{pintrk:""}});
T("LinkedIn Insight Tag","Advertising","https://business.linkedin.com/marketing-solutions/insight-tag",{d:"LinkedIn conversion tracking and audiences.",scripts:[r`snap\.licdn\.com/li\.lms-analytics`],js:{_linkedin_data_partner_ids:"",lintrk:""},extract:{"Partner IDs":r`html:_linkedin_partner_id\s*=\s*["'](\d+)`}});
T("X (Twitter) Ads pixel","Advertising","https://ads.x.com",{d:"Conversion tracking for X ads.",scripts:[r`static\.ads-twitter\.com/uwt\.js`],js:{twq:""}});
T("Snapchat Pixel","Advertising","https://businesshelp.snapchat.com",{d:"Snap ad attribution.",scripts:[r`sc-static\.net/scevent`],js:{snaptr:""}});
T("Reddit Pixel","Advertising","https://ads.reddit.com",{d:"Reddit ad conversion tracking.",scripts:[r`redditstatic\.com/ads/pixel\.js`],js:{rdt:""}});
T("Microsoft Advertising UET","Advertising","https://ads.microsoft.com",{d:"Bing Ads conversion tag.",scripts:[r`bat\.bing\.com/bat\.js`],js:{uetq:""},cookies:{"_uet(sid|vid)":""}});
T("Criteo","Advertising","https://criteo.com",{d:"Retargeting and commerce media.",scripts:[r`static\.criteo\.net|dynamic\.criteo\.com|widget\.criteo\.com`],js:{criteo_q:""}});
T("Taboola","Advertising","https://taboola.com",{d:"Content recommendation and native ads.",scripts:[r`cdn\.taboola\.com`],js:{_taboola:""}});
T("Outbrain","Advertising","https://outbrain.com",{d:"Native advertising and recommendations.",scripts:[r`outbrain\.com/outbrain\.js|widgets\.outbrain\.com`],js:{OBR:""}});
T("Hotjar","Analytics","https://hotjar.com",{d:"Heatmaps, session recordings and feedback polls.",scripts:[r`static\.hotjar\.com|script\.hotjar\.com`],js:{hj:"",_hjSettings:""},cookies:{"_hj.+":""},extract:{"Site ID":"js:_hjSettings.hjid"}});
T("Microsoft Clarity","Analytics","https://clarity.microsoft.com",{d:"Free heatmaps and session replay from Microsoft.",scripts:[r`clarity\.ms/tag/([\w]+)`],js:{clarity:""},cookies:{_clck:"",_clsk:""},extract:{"Project ID":r`scripts:clarity\.ms/tag/(\w+)`}});
T("FullStory","Analytics","https://fullstory.com",{d:"Session replay and digital experience analytics.",scripts:[r`fullstory\.com/s/fs\.js|edge\.fullstory\.com`],js:{FS:"",_fs_host:""}});
T("Mouseflow","Analytics","https://mouseflow.com",{d:"Session replay and heatmaps.",scripts:[r`cdn\.mouseflow\.com`],js:{mouseflow:""}});
T("Crazy Egg","Analytics","https://crazyegg.com",{d:"Heatmaps and A/B testing.",scripts:[r`script\.crazyegg\.com`],js:{CE2:""}});
T("Lucky Orange","Analytics","https://luckyorange.com",{d:"Session recordings and live chat.",scripts:[r`luckyorange\.(com|net)`],js:{__lo_site_id:""}});
T("Smartlook","Analytics","https://smartlook.com",{d:"Session replay for web and mobile.",scripts:[r`smartlook\.(com|cloud)`],js:{smartlook:""}});
T("Mixpanel","Analytics","https://mixpanel.com",{d:"Product analytics focused on events and funnels.",scripts:[r`cdn\.mxpnl\.com|mixpanel(\.min)?\.js`],requests:[r`api(-js)?\.mixpanel\.com`],js:{"mixpanel.__SV":"",mixpanel:""},cookies:{"mp_.+_mixpanel":""}});
T("Amplitude","Analytics","https://amplitude.com",{d:"Product analytics and experimentation.",scripts:[r`cdn\.amplitude\.com`],requests:[r`api2?\.amplitude\.com`],js:{amplitude:""},cookies:{"amp_[a-z0-9]+":""}});
T("Heap","Analytics","https://heap.io",{d:"Auto-captures every interaction for retroactive analysis.",scripts:[r`heap-\d+\.js|heapanalytics\.com`],js:{heap:"","heap.version":r`^(.+)$##v=\1`}});
T("PostHog","Analytics","https://posthog.com",{d:"Open-source product analytics, session replay and feature flags.",scripts:[r`posthog(\.min)?\.js|posthog-js`],requests:[r`(app|us|eu)\.i\.posthog\.com|/e/\?.*ip=`],js:{"posthog.__loaded":"","posthog.version":r`^(.+)$##v=\1`},storage:[r`^ph_.+_posthog$`]});
T("Plausible","Analytics","https://plausible.io",{d:"Lightweight, cookie-free, privacy-friendly analytics.",scripts:[r`plausible\.io/js/`],js:{plausible:""},requests:[r`plausible\.io/api/event`]});
T("Fathom","Analytics","https://usefathom.com",{d:"Privacy-first analytics.",scripts:[r`cdn\.usefathom\.com`],js:{fathom:""}});
T("Matomo","Analytics","https://matomo.org",{d:"Open-source, self-hostable analytics (formerly Piwik).",scripts:[r`matomo\.js|piwik\.js`],js:{Matomo:"",Piwik:"",_paq:""},cookies:{"_pk_(id|ses)\\..+":""}});
T("Simple Analytics","Analytics","https://simpleanalytics.com",{d:"Cookie-free analytics.",scripts:[r`scripts\.simpleanalyticscdn\.com`],js:{sa_event:""}});
T("Umami","Analytics","https://umami.is",{d:"Self-hostable privacy-friendly analytics.",attrs:[r`^data-website-id$`],scripts:[r`umami(\.js)?`],js:{umami:""}});
T("Pirsch","Analytics","https://pirsch.io",{d:"Privacy-friendly analytics.",scripts:[r`api\.pirsch\.io|pirsch(-extended)?\.js`]});
T("Cloudflare Web Analytics","Analytics","https://www.cloudflare.com/web-analytics/",{d:"Privacy-first analytics via a small beacon.",scripts:[r`static\.cloudflareinsights\.com/beacon`],attrs:[r`^data-cf-beacon$`]});
T("Vercel Analytics","Analytics","https://vercel.com/analytics",{d:"Privacy-friendly visitor analytics.",scripts:[r`/_vercel/insights/script\.js|va\.vercel-scripts\.com`],js:{va:""}});
T("Vercel Speed Insights","Monitoring","https://vercel.com/docs/speed-insights",{d:"Real-user Core Web Vitals.",scripts:[r`/_vercel/speed-insights/`]});
T("Yandex Metrica","Analytics","https://metrica.yandex.com",{d:"Yandex's analytics with Webvisor session replay.",scripts:[r`mc\.yandex\.(ru|com)/metrika`],js:{"Ya.Metrika":"",ym:""},cookies:{"_ym_.+":""}});
T("Baidu Analytics","Analytics","https://tongji.baidu.com",{d:"Analytics for the Chinese market.",scripts:[r`hm\.baidu\.com/hm\.js`],js:{_hmt:""}});
T("Adobe Analytics","Analytics","https://business.adobe.com/products/analytics/adobe-analytics.html",{d:"Enterprise analytics (Omniture).",scripts:[r`AppMeasurement(\.min)?\.js|omniture|s_code\.js`],requests:[r`omtrdc\.net|2o7\.net`],js:{s_gi:"",Visitor:"","s.version":r`^(.+)$##v=\1`}});
T("Snowplow","Analytics","https://snowplow.io",{d:"Behavioural data creation platform.",scripts:[r`snowplow|sp\.js`],js:{snowplow:""}});
T("Kissmetrics","Analytics","https://kissmetrics.io",{d:"Customer-level analytics.",scripts:[r`i\.kissmetrics\.(com|io)`],js:{KM:"",_kmq:""}});
T("Chartbeat","Analytics","https://chartbeat.com",{d:"Realtime analytics for publishers.",scripts:[r`static\.chartbeat\.com`],js:{_sf_async_config:""}});
T("Parse.ly","Analytics","https://parse.ly",{d:"Content analytics for publishers.",scripts:[r`cdn\.parsely\.com`],js:{PARSELY:""}});
T("Statcounter","Analytics","https://statcounter.com",{d:"Simple hit counter and stats.",scripts:[r`statcounter\.com/counter`],js:{_statcounter:""}});

// ───────────── Marketing / email / CRM ─────────────
T("HubSpot","Marketing","https://hubspot.com",{d:"Inbound marketing, CRM, forms and chat suite.",scripts:[r`js\.hs-scripts\.com|js\.hsforms\.net|js\.hs-analytics\.net|js\.hs-banner\.com|js\.usemessages\.com`],js:{_hsq:"",hbspt:""},cookies:{"__hstc":"",hubspotutk:""},extract:{"Portal ID":r`scripts:hs-scripts\.com/(\d+)\.js`}});
T("Mailchimp","Email","https://mailchimp.com",{d:"Email marketing with embeddable signup forms.",scripts:[r`chimpstatic\.com|list-manage\.com`],html:[r`mc-embedded-subscribe|list-manage\.com`]});
T("Klaviyo","Marketing","https://klaviyo.com",{d:"Email/SMS marketing built for ecommerce.",scripts:[r`static\.klaviyo\.com|a\.klaviyo\.com`],js:{klaviyo:"",_learnq:""}});
T("Marketo","Marketing","https://marketo.com",{d:"Adobe's marketing automation.",scripts:[r`munchkin\.marketo\.net|mktoForms2`],js:{Munchkin:"",MktoForms2:""}});
T("Pardot","Marketing","https://salesforce.com/products/marketing-cloud/",{d:"Salesforce B2B marketing automation.",scripts:[r`pi\.pardot\.com|pardot\.com/pd\.js`],js:{piAId:""}});
T("ActiveCampaign","Marketing","https://activecampaign.com",{d:"Email marketing and CRM automation.",scripts:[r`trackcmp\.net|activehosted\.com`]});
T("Brevo (Sendinblue)","Email","https://brevo.com",{d:"Email, SMS and CRM.",scripts:[r`sibautomation|sendinblue\.com|brevo\.com`],js:{sib:"",sendinblue:""}});
T("Kit (ConvertKit)","Email","https://kit.com",{d:"Email tools for creators.",scripts:[r`convertkit\.com|ck\.page`],attrs:[r`^data-uid$##c=10`]});
T("Customer.io","Marketing","https://customer.io",{d:"Behavioural messaging platform.",scripts:[r`track\.customer\.io|assets\.customer\.io`],js:{_cio:""}});
T("Drip","Marketing","https://drip.com",{d:"Ecommerce email marketing.",scripts:[r`tag\.getdrip\.com`],js:{_dcq:""}});
T("Braze","Marketing","https://braze.com",{d:"Customer engagement platform.",scripts:[r`js\.appboycdn\.com|braze`],js:{braze:"",appboy:""}});
T("OneSignal","Marketing","https://onesignal.com",{d:"Web push notifications.",scripts:[r`cdn\.onesignal\.com`],js:{OneSignal:"",OneSignalDeferred:""},sw:[r`OneSignalSDK`]});
T("Beehiiv","Email","https://beehiiv.com",{d:"Newsletter platform.",scripts:[r`embeds\.beehiiv\.com`],iframes:[r`embeds\.beehiiv\.com`]});
T("Salesforce","CRM","https://salesforce.com",{d:"CRM giant; web-to-lead forms and embedded services show up on many sites.",scripts:[r`force\.com|salesforce\.com/servlet|service\.force\.com`],html:[r`salesforce\.com/servlet/servlet\.WebToLead`]});
T("Zoho","CRM","https://zoho.com",{d:"Business software suite (CRM, forms, SalesIQ chat).",scripts:[r`zohopublic\.com|salesiq\.zoho|zohocdn\.com|zsiqchat`],js:{"$zoho":""}});

// ───────────── Live chat ─────────────
T("Intercom","Live Chat","https://intercom.com",{d:"Messenger, help centre and customer support platform.",scripts:[r`widget\.intercom\.io|js\.intercomcdn\.com`],js:{Intercom:"",intercomSettings:""},cookies:{"intercom-(id|session|device-id)-.+":""},extract:{"Workspace ID":"js:intercomSettings.app_id"}});
T("Zendesk","Live Chat","https://zendesk.com",{d:"Customer service suite; web widget for chat and help centre.",scripts:[r`static\.zdassets\.com|zopim`],js:{zE:"",zESettings:""}});
T("Drift","Live Chat","https://drift.com",{d:"Conversational marketing chat.",scripts:[r`js\.driftt\.com|drift\.com`],js:{drift:"",driftt:""}});
T("Tawk.to","Live Chat","https://tawk.to",{d:"Free live chat.",scripts:[r`embed\.tawk\.to`],js:{Tawk_API:""}});
T("Crisp","Live Chat","https://crisp.chat",{d:"Chat and customer messaging.",scripts:[r`client\.crisp\.chat`],js:{"$crisp":"",CRISP_WEBSITE_ID:""}});
T("LiveChat","Live Chat","https://livechat.com",{d:"Live chat for sales and support.",scripts:[r`cdn\.livechatinc\.com`],js:{LiveChatWidget:"",__lc:""}});
T("Freshchat / Freshdesk","Live Chat","https://freshworks.com",{d:"Freshworks chat and helpdesk.",scripts:[r`wchat\.freshchat\.com|freshdesk\.com|freshworks\.com`],js:{fcWidget:"",FreshworksWidget:""}});
T("HubSpot Conversations","Live Chat","https://hubspot.com/products/crm/live-chat",{d:"HubSpot's chat widget.",js:{HubSpotConversations:""},scripts:[r`js\.usemessages\.com`]});
T("Tidio","Live Chat","https://tidio.com",{d:"Chatbots and live chat.",scripts:[r`code\.tidio\.co`],js:{tidioChatApi:""}});
T("Help Scout Beacon","Live Chat","https://helpscout.com",{d:"Help widget with docs search and messaging.",scripts:[r`beacon-v2\.helpscout\.net`],js:{Beacon:""}});
T("Gorgias","Live Chat","https://gorgias.com",{d:"Ecommerce helpdesk and chat.",scripts:[r`gorgias\.chat|config\.gorgias`],js:{GorgiasChat:""}});
T("Facebook Messenger plugin","Live Chat","https://developers.facebook.com/docs/messenger-platform",{d:"Messenger chat bubble for pages.",html:[r`fb-customerchat|class="fb-messenger`]});
T("WhatsApp click-to-chat","Live Chat","https://faq.whatsapp.com/5913398998672934",{d:"Links that open a WhatsApp conversation — the de-facto support channel in many markets.",html:[r`href=["']https?://(wa\.me|api\.whatsapp\.com/send|web\.whatsapp\.com/send)`]});

// ───────────── Consent ─────────────
T("OneTrust","Consent Management","https://onetrust.com",{d:"Enterprise privacy and consent platform.",scripts:[r`cdn\.cookielaw\.org|onetrust\.com`],js:{OneTrust:"",OptanonWrapper:""},cookies:{OptanonConsent:"",OptanonAlertBoxClosed:""}});
T("Cookiebot","Consent Management","https://cookiebot.com",{d:"GDPR/CCPA consent banner with cookie scanning.",scripts:[r`consent\.cookiebot\.com`],js:{Cookiebot:""},cookies:{CookieConsent:""}});
T("Osano","Consent Management","https://osano.com",{d:"Consent management and privacy compliance.",scripts:[r`cmp\.osano\.com`],js:{Osano:""}});
T("Termly","Consent Management","https://termly.io",{d:"Consent banner and policy generator.",scripts:[r`app\.termly\.io`],js:{Termly:""}});
T("Usercentrics","Consent Management","https://usercentrics.com",{d:"European consent management platform.",scripts:[r`app\.usercentrics\.eu|usercentrics`],js:{UC_UI:"",usercentrics:""}});
T("CookieYes","Consent Management","https://cookieyes.com",{d:"Cookie banner popular on WordPress.",scripts:[r`cdn-cookieyes\.com`],js:{"getCkyConsent":""},cookies:{"cookieyes-consent":""}});
T("Didomi","Consent Management","https://didomi.io",{d:"Consent and preference management.",scripts:[r`sdk\.privacy-center\.org|didomi`],js:{Didomi:""}});
T("iubenda","Consent Management","https://iubenda.com",{d:"Privacy policies and cookie solution.",scripts:[r`cdn\.iubenda\.com`],js:{_iub:""}});
T("Quantcast Choice","Consent Management","https://quantcast.com/products/choice-consent-management-platform/",{d:"IAB TCF consent platform.",scripts:[r`quantcast\.mgr\.consensu\.org|cmp\.quantcast\.com`],js:{__tcfapi:"##c=40"}});
T("TrustArc","Consent Management","https://trustarc.com",{d:"Privacy compliance platform.",scripts:[r`consent\.trustarc\.com`],js:{truste:""}});
T("Complianz","Consent Management","https://complianz.io",{d:"WordPress consent plugin.",html:[r`complianz|cmplz-`],implies:["WordPress"]});
T("Klaro","Consent Management","https://kiprotect.com/klaro",{d:"Open-source consent manager.",js:{klaro:"",klaroConfig:""},classes:[r`^klaro$`]});

// ───────────── Experimentation ─────────────
T("Optimizely","A/B Testing","https://optimizely.com",{d:"Experimentation and personalisation platform.",scripts:[r`cdn\.optimizely\.com`],js:{optimizely:""}});
T("VWO","A/B Testing","https://vwo.com",{d:"A/B testing and conversion optimisation.",scripts:[r`dev\.visualwebsiteoptimizer\.com`],js:{_vwo_code:"",VWO:""}});
T("Google Optimize","A/B Testing","https://optimize.google.com",{d:"Google's (retired) A/B testing tool.",scripts:[r`googleoptimize\.com/optimize\.js`],js:{google_optimize:""}});
T("AB Tasty","A/B Testing","https://abtasty.com",{d:"Experimentation and personalisation.",scripts:[r`abtasty\.com`],js:{ABTasty:""}});
T("LaunchDarkly","A/B Testing","https://launchdarkly.com",{d:"Feature-flag management.",scripts:[r`launchdarkly`],requests:[r`app\.launchdarkly\.com|clientstream\.launchdarkly\.com|events\.launchdarkly\.com`],storage:[r`^ld:`]});
T("Statsig","A/B Testing","https://statsig.com",{d:"Feature gates, experiments and analytics.",requests:[r`featuregates\.org|statsig\.com`],scripts:[r`statsig`]});
T("GrowthBook","A/B Testing","https://growthbook.io",{d:"Open-source feature flags and experiments.",scripts:[r`growthbook`],js:{growthbook:""}});
T("Dynamic Yield","A/B Testing","https://dynamicyield.com",{d:"Personalisation and testing.",scripts:[r`dynamicyield\.com`],js:{DY:""}});

// ───────────── Monitoring ─────────────
T("Sentry","Monitoring","https://sentry.io",{d:"Error tracking and performance monitoring; captures stack traces (often with source maps) from real users.",scripts:[r`browser\.sentry-cdn\.com|js\.sentry-cdn\.com`],js:{"Sentry.SDK_VERSION":r`^(.+)$##v=\1`,Sentry:"",__SENTRY__:""},requests:[r`ingest(\.[a-z]+)?\.sentry\.io|sentry\.io/api/\d+/(envelope|store)`],body:[r`@sentry/(browser|react|nextjs|vue)|Sentry\.init##c=60`],attrs:[r`^data-sentry-`]});
T("Datadog RUM","Monitoring","https://datadoghq.com",{d:"Real-user monitoring, logs and session replay from Datadog.",scripts:[r`datadoghq-browser-agent\.com`],js:{DD_RUM:"",DD_LOGS:""},requests:[r`browser-intake-datadoghq\.(com|eu)|rum\.browser-intake`]});
T("New Relic Browser","Monitoring","https://newrelic.com",{d:"Browser monitoring and APM.",scripts:[r`js-agent\.newrelic\.com|nr-data\.net`],js:{NREUM:"",newrelic:""},requests:[r`bam(-cell)?\.nr-data\.net`]});
T("LogRocket","Monitoring","https://logrocket.com",{d:"Session replay with console and network capture.",scripts:[r`cdn\.logr-ingest\.com|cdn\.lr-ingest\.io|logrocket`],js:{LogRocket:""}});
T("Bugsnag","Monitoring","https://bugsnag.com",{d:"Error monitoring.",scripts:[r`bugsnag|d2wy8f7a9ursnm\.cloudfront\.net`],js:{Bugsnag:"",bugsnag:""}});
T("Rollbar","Monitoring","https://rollbar.com",{d:"Error tracking.",scripts:[r`cdn\.rollbar\.com`],js:{Rollbar:"","_rollbarConfig":""}});
T("Raygun","Monitoring","https://raygun.com",{d:"Crash reporting and RUM.",scripts:[r`cdn\.raygun\.io`],js:{rg4js:""}});
T("Honeybadger","Monitoring","https://honeybadger.io",{d:"Error and uptime monitoring.",scripts:[r`js\.honeybadger\.io`],js:{Honeybadger:""}});
T("TrackJS","Monitoring","https://trackjs.com",{d:"JavaScript error monitoring.",scripts:[r`cdn\.trackjs\.com`],js:{trackJs:"",TrackJS:""}});
T("Elastic APM RUM","Monitoring","https://elastic.co/apm",{d:"Elastic's browser performance monitoring.",scripts:[r`elastic-apm-rum`],js:{elasticApm:""}});
T("Grafana Faro","Monitoring","https://grafana.com/oss/faro/",{d:"Frontend observability SDK.",scripts:[r`faro-web-sdk|grafana-faro`],js:{faro:""}});
T("OpenTelemetry","Monitoring","https://opentelemetry.io",{d:"Vendor-neutral tracing standard; browsers send traces to a collector.",body:[r`@opentelemetry/`],requests:[r`/v1/traces`]});
T("SpeedCurve LUX","Monitoring","https://speedcurve.com",{d:"Real-user web performance monitoring.",scripts:[r`lux\.speedcurve\.com`],js:{LUX:""}});
T("Akamai mPulse (Boomerang)","Monitoring","https://akamai.com/products/mpulse",{d:"Real-user monitoring through the Boomerang library.",scripts:[r`go-mpulse\.net|boomerang`],js:{BOOMR:""}});
