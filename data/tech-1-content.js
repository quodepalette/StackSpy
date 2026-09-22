// CMS, headless CMS, site builders, ecommerce, payments, auth, search.
// Pattern suffixes: "##v=\1" version template, "##c=40" confidence weight, "##all" collect every match (extract only).

// ───────────── CMS ─────────────
T("WordPress","CMS","https://wordpress.org",{
  d:"Open-source PHP CMS behind roughly four in ten websites. Content lives in MySQL; themes control presentation and plugins add features.",
  tip:"Themes and plugins load from /wp-content/. Add /wp-json/ to the URL to explore the built-in REST API.",
  meta:{generator:r`WordPress(?: ([\d.]+))?##v=\1`},
  html:[r`/wp-content/`,r`/wp-includes/`,r`api\.w\.org`,r`wp-emoji-release\.min\.js\?ver=([\d.]+)##v=\1`],
  headers:{"x-pingback":r`xmlrpc\.php`,link:r`api\.w\.org`},
  cookies:{"wordpress_(logged_in|test_cookie).*":"","wp-settings-.+":""},
  implies:["PHP","MySQL"],
  extract:{Theme:r`html:/wp-content/themes/([\w.-]+)/`,Plugins:r`html:/wp-content/plugins/([\w.-]+)/##all`}
});
T("Drupal","CMS","https://drupal.org",{
  d:"Enterprise-grade PHP CMS with a powerful content model and fine-grained permissions, popular with governments, universities and media.",
  tip:"Look for /sites/default/files/ or /core/ paths and a drupalSettings JSON blob in the HTML.",
  meta:{generator:r`Drupal (\d+)?##v=\1`},
  headers:{"x-drupal-cache":"","x-generator":r`Drupal (\d+)?##v=\1`,"x-drupal-dynamic-cache":""},
  html:[r`/sites/default/files/`,r`/core/misc/drupal\.js`,r`drupalSettings`,r`Drupal\.settings`],
  js:{Drupal:"",drupalSettings:""},
  implies:["PHP","MySQL"]
});
T("Joomla","CMS","https://joomla.org",{
  d:"Long-running PHP CMS with a component/module architecture and built-in multilingual support.",
  meta:{generator:r`Joomla!?(?: ([\d.]+))?##v=\1`},
  html:[r`/media/system/js/`,r`/components/com_\w+/`,r`/media/jui/`],
  js:{Joomla:""},
  implies:["PHP","MySQL"]
});
T("Ghost","CMS","https://ghost.org",{
  d:"Node.js publishing platform focused on newsletters, memberships and clean editorial design.",
  tip:"Ghost exposes a Content API at /ghost/api/content/ — handy for headless setups.",
  meta:{generator:r`Ghost ?([\d.]+)?##v=\1`},
  html:[r`ghost-portal|/ghost/portal`,r`content/themes/[\w-]+/assets`,r`ghost-sdk`],
  headers:{"x-ghost-cache-status":""},
  implies:["Node.js"]
});
T("Craft CMS","CMS","https://craftcms.com",{
  d:"Flexible PHP CMS beloved by design studios for its custom content modelling and Twig templates.",
  headers:{"x-powered-by":r`Craft CMS`},cookies:{CraftSessionId:""},
  implies:["PHP","Twig"]
});
T("TYPO3","CMS","https://typo3.org",{
  d:"Mature, enterprise-focused PHP CMS common across European organisations.",
  meta:{generator:r`TYPO3`},html:[r`typo3conf/|typo3temp/`],implies:["PHP"]
});
T("Umbraco","CMS","https://umbraco.com",{
  d:".NET CMS with a friendly editor experience and strong developer extensibility.",
  meta:{generator:r`umbraco`},html:[r`/umbraco/|/App_Plugins/`],implies:["ASP.NET"]
});
T("Adobe Experience Manager","CMS","https://business.adobe.com/products/experience-manager/adobe-experience-manager.html",{
  d:"Adobe's enterprise CMS/DAM for large brands. Java-based, with component libraries served from clientlibs.",
  html:[r`/etc\.clientlibs/`,r`/content/dam/`,r`/etc/designs/`],implies:["Java"]
});
T("Sitecore","CMS","https://www.sitecore.com",{
  d:"Enterprise .NET digital experience platform with personalisation and marketing tooling.",
  html:[r`/-/media/`,r`sitecore`],cookies:{"SC_ANALYTICS_GLOBAL_COOKIE":""},implies:["ASP.NET"]
});
T("Liferay","CMS","https://liferay.com",{
  d:"Java portal and CMS platform used for intranets and customer portals.",
  js:{"Liferay.ThemeDisplay":""},headers:{"liferay-portal":""},html:[r`/o/[\w-]+/(css|js)/`],implies:["Java"]
});
T("Concrete CMS","CMS","https://www.concretecms.org",{
  d:"PHP CMS with in-context editing directly on the page.",
  meta:{generator:r`concrete5|Concrete CMS`},js:{CCM_IMAGE_PATH:""},implies:["PHP"]
});
T("1C-Bitrix","CMS","https://www.1c-bitrix.ru",{
  d:"Russian CMS and business suite widely used for storefronts in CIS markets.",
  html:[r`/bitrix/(js|templates|cache)/`],js:{BX:""},implies:["PHP"]
});
T("Blogger","CMS","https://www.blogger.com",{
  d:"Google's free blogging platform.",meta:{generator:r`Blogger`},html:[r`blogger\.com/static`,r`<b:skin`]
});
T("Substack","CMS","https://substack.com",{
  d:"Newsletter and publishing platform with built-in subscriptions and payments.",
  html:[r`substackcdn\.com`,r`substack\.com/api`]
});
T("Medium","CMS","https://medium.com",{
  d:"Hosted publishing network with a reader-first layout.",
  html:[r`cdn-client\.medium\.com`,r`miro\.medium\.com`]
});
T("HubSpot CMS","CMS","https://hubspot.com/products/cms",{
  d:"Marketing-oriented CMS from HubSpot with drag-and-drop modules and CRM-powered personalisation.",
  meta:{generator:r`HubSpot`},html:[r`hs-sites\.com|hubspotusercontent\d*\.net|/hs/hsstatic/`],headers:{"x-hs-hub-id":"","x-powered-by":r`HubSpot`}
});

// ───────────── Site builders & WordPress add-ons ─────────────
T("Wix","Site Builders","https://wix.com",{
  d:"Hosted drag-and-drop site builder. Sites are rendered by Wix's own runtime and served from its infrastructure.",
  tip:"Wix pages ship a lot of JavaScript — a good case study in the cost of visual builders.",
  meta:{generator:r`Wix\.com Website Builder`},html:[r`static\.parastorage\.com|static\.wixstatic\.com|wix-code`],
  headers:{"x-wix-request-id":""},js:{wixBiSession:"",wixPerformanceMeasurement:""}
});
T("Squarespace","Site Builders","https://squarespace.com",{
  d:"All-in-one website builder popular with creatives and small businesses.",
  html:[r`static1\.squarespace\.com|squarespace-cdn\.com|sqs-block|sqsp-`],js:{"Static.SQUARESPACE_CONTEXT":""},headers:{server:r`Squarespace`}
});
T("Webflow","Site Builders","https://webflow.com",{
  d:"Visual builder that outputs clean semantic HTML/CSS, popular with designers who want code-level control without writing code.",
  tip:"Look for data-wf-page and data-wf-site attributes on the <html> element.",
  html:[r`data-wf-(page|site)`,r`webflow\.js|webflow\.[a-f0-9]+\.js`,r`(assets-global\.website-files\.com|cdn\.prod\.website-files\.com)`],
  meta:{generator:r`Webflow`}
});
T("Framer","Site Builders","https://framer.com",{
  d:"Design tool that publishes sites directly, with React-powered animations and interactions.",
  meta:{generator:r`Framer(?: ([\d.]+))?##v=\1`},html:[r`framerusercontent\.com`,r`data-framer-(name|component-type|hydrate-v2)`],implies:["React"]
});
T("Weebly","Site Builders","https://weebly.com",{d:"Square-owned drag-and-drop website builder.",html:[r`weebly\.com|editmysite\.com`],js:{"_W.configDomain":""}});
T("Duda","Site Builders","https://duda.co",{d:"White-label website builder used by agencies.",html:[r`multiscreensite\.com|dmcdn\.net|irp\.cdn-website\.com`]});
T("Carrd","Site Builders","https://carrd.co",{d:"One-page site builder for simple landing pages.",html:[r`carrd\.co|data-carrd`]});
T("Elementor","Site Builders","https://elementor.com",{
  d:"Popular WordPress page builder with a visual drag-and-drop editor.",
  // The plugin-asset path and the data-elementor-* runtime attributes are unique to a real
  // Elementor/WordPress install, so they alone are enough to confirm it (and to imply WordPress).
  // Bare "elementor-section"/"elementor-widget"/"elementor-default" class names are NOT unique —
  // they turn up on sites that were only ever *designed* in Elementor and then hand-built with a
  // different stack (e.g. Next.js) while some legacy class names were carried over. Those get a
  // low confidence each so a single stray class can't cross the detection threshold or cascade
  // into a false WordPress/PHP/MySQL stack; they only count once corroborated by another match.
  html:[
    r`/wp-content/plugins/elementor(-pro)?/assets/[^"']*?\?ver=([\d.]+)##v=\2##c=100`,
    r`elementor-(section|widget|element)##c=15`,
    r`class="[^"]*\belementor-default##c=15`
  ],
  attrs:[r`^data-elementor-##c=70`],
  implies:["WordPress"]
});
T("Divi","Site Builders","https://www.elegantthemes.com/gallery/divi/",{
  d:"Elegant Themes' WordPress theme and visual builder.",
  html:[r`/wp-content/themes/Divi/`,r`et_pb_(section|row|module)`,r`et-boc`],implies:["WordPress"]
});
T("WPBakery","Site Builders","https://wpbakery.com",{
  d:"Shortcode-based drag-and-drop page builder bundled with many WordPress themes.",
  html:[r`/plugins/js_composer/`,r`vc_(row|column|col-sm)`],meta:{generator:r`Powered by WPBakery Page Builder`},implies:["WordPress"]
});
T("Gutenberg (block editor)","Web Platform","https://wordpress.org/gutenberg/",{
  d:"WordPress's block editor. Pages are built from typed blocks, rendered with wp-block-* classes.",
  html:[r`wp-block-[\w-]+`,r`/wp-includes/blocks/`],implies:["WordPress"]
});
T("Yoast SEO","Web Platform","https://yoast.com/wordpress/plugins/seo/",{
  d:"WordPress SEO plugin that outputs meta tags, canonical URLs, schema graphs and sitemaps.",
  html:[r`optimized with the Yoast SEO plugin v([\d.]+)##v=\1`,r`yoast-schema-graph`],implies:["WordPress"]
});
T("Rank Math","Web Platform","https://rankmath.com",{
  d:"WordPress SEO plugin with schema, redirects and keyword tools.",
  html:[r`Rank Math SEO plugin - https|rank-math-schema`],implies:["WordPress"]
});
T("WP Rocket","Performance","https://wp-rocket.me",{
  d:"Premium WordPress caching plugin: page cache, minification, lazy load and critical-CSS generation.",
  html:[r`Performance optimized by WP Rocket`,r`wp-content/cache/(wp-rocket|min)/`],headers:{"x-powered-by":r`WP Rocket(?:/([\d.]+))?##v=\1`,"x-rocket-nginx-serving-static":""},implies:["WordPress"]
});
T("LiteSpeed Cache","Performance","https://wordpress.org/plugins/litespeed-cache/",{
  d:"WordPress plugin that talks to LiteSpeed's server-level cache for fast page delivery.",
  html:[r`Page generated by LiteSpeed Cache`],headers:{"x-litespeed-cache":"","x-litespeed-cache-control":""},implies:["WordPress"]
});
T("Contact Form 7","Web Platform","https://contactform7.com",{
  d:"The most-installed WordPress form plugin.",html:[r`wpcf7`,r`/plugins/contact-form-7/`],implies:["WordPress"]
});
T("Gravity Forms","Web Platform","https://www.gravityforms.com",{
  d:"Premium WordPress form builder with conditional logic and payments.",html:[r`gform_(wrapper|body|confirmation)`,r`/plugins/gravityforms/`],implies:["WordPress"]
});
T("Slider Revolution","JS Libraries","https://www.sliderrevolution.com",{
  d:"Animated slider/hero plugin bundled into many WordPress themes.",html:[r`revslider|rs-module-wrap|rev_slider`],js:{"RevSlider":"","revapi1":""}
});
T("Jetpack","Web Platform","https://jetpack.com",{
  d:"Automattic's WordPress plugin bundle: stats, CDN images, security and social sharing.",
  html:[r`/plugins/jetpack/`,r`i[0-2]\.wp\.com/`,r`stats\.wp\.com`],implies:["WordPress"]
});

// ───────────── Headless CMS ─────────────
T("Contentful","Headless CMS","https://contentful.com",{d:"API-first content platform with structured content models and a strong ecosystem.",requests:[r`cdn\.contentful\.com|images\.ctfassets\.net|videos\.ctfassets\.net`],html:[r`images\.ctfassets\.net`]});
T("Sanity","Headless CMS","https://sanity.io",{d:"Customisable real-time content platform with a React-based Studio and the GROQ query language.",requests:[r`cdn\.sanity\.io|\.apicdn\.sanity\.io`],html:[r`cdn\.sanity\.io`]});
T("Strapi","Headless CMS","https://strapi.io",{d:"Open-source Node.js headless CMS with an auto-generated REST/GraphQL API.",headers:{"x-powered-by":r`Strapi`},implies:["Node.js"]});
T("Prismic","Headless CMS","https://prismic.io",{d:"Headless CMS built around reusable 'slices' of page content.",requests:[r`images\.prismic\.io|prismic\.io/api`],html:[r`images\.prismic\.io|prismic-io`]});
T("Storyblok","Headless CMS","https://storyblok.com",{d:"Headless CMS with a visual editor for component-driven pages.",html:[r`a\.storyblok\.com|storyblok`],requests:[r`api\.storyblok\.com|a\.storyblok\.com`]});
T("DatoCMS","Headless CMS","https://datocms.com",{d:"GraphQL-first headless CMS with a powerful image API.",html:[r`datocms-assets\.com`],requests:[r`graphql\.datocms\.com|datocms-assets\.com`]});
T("Hygraph","Headless CMS","https://hygraph.com",{d:"GraphQL-native headless CMS (formerly GraphCMS).",html:[r`media\.graphassets\.com|graphassets\.com`],requests:[r`graphassets\.com|hygraph\.com`]});
T("Directus","Headless CMS","https://directus.io",{d:"Open-source data platform that wraps any SQL database in an API and admin app.",headers:{"x-powered-by":r`Directus`}});
T("Payload CMS","Headless CMS","https://payloadcms.com",{d:"TypeScript-first, code-configured headless CMS that lives inside your Next.js app.",headers:{"x-powered-by":r`Payload`}});
T("Builder.io","Headless CMS","https://builder.io",{d:"Visual headless CMS that lets marketers drag-and-drop pages built from your own components.",requests:[r`cdn\.builder\.io`],html:[r`cdn\.builder\.io|builder-blocks`]});
T("Kontent.ai","Headless CMS","https://kontent.ai",{d:"Enterprise headless CMS from Kentico.",requests:[r`kc-usercontent\.com|deliver\.kontent\.ai`]});

// ───────────── Ecommerce ─────────────
T("Shopify","Ecommerce","https://shopify.com",{
  d:"Hosted commerce platform. Storefronts are Liquid templates rendered by Shopify; checkout is centrally hosted, which makes it very reliable.",
  tip:"Try /products.json on any Shopify store to see its catalogue as JSON.",
  html:[r`cdn\.shopify\.com`,r`Shopify\.theme`,r`shopify-section`],
  js:{Shopify:"","Shopify.theme.name":""},
  headers:{"x-shopid":"","x-shopify-stage":"","x-sorting-hat-shopid":""},
  cookies:{"_shopify_[a-z]+":"",cart_sig:""},
  meta:{"shopify-checkout-api-token":"","shopify-digital-wallet":""},
  extract:{Theme:"js:Shopify.theme.name","Shop domain":"js:Shopify.shop",Currency:"js:Shopify.currency.active"}
});
T("WooCommerce","Ecommerce","https://woocommerce.com",{
  d:"The WordPress ecommerce plugin — turns a WordPress site into a store with carts, products and payments.",
  html:[r`/plugins/woocommerce/assets/[^"']*\?ver=([\d.]+)##v=\1`,r`class="[^"]*\bwoocommerce(-page|-no-js)?\b`,r`wc-block-`],
  meta:{generator:r`WooCommerce ([\d.]+)##v=\1`},
  js:{woocommerce_params:"",wc_add_to_cart_params:""},
  cookies:{"woocommerce_(cart_hash|items_in_cart)":"","wp_woocommerce_session_.+":""},
  implies:["WordPress"]
});
T("Magento","Ecommerce","https://business.adobe.com/products/magento/magento-commerce.html",{
  d:"Adobe Commerce/Magento: a powerful, extensible PHP ecommerce platform for complex catalogues.",
  html:[r`/static/(version\d+/)?frontend/`,r`/skin/frontend/`,r`Mage\.Cookies`,r`mage/(cookies|requirejs)`],
  js:{Mage:"",requirejs:""},storage:[r`mage-cache-storage`],cookies:{"mage-cache-sessid":"",PHPSESSID:"##c=0"},
  implies:["PHP","MySQL"]
});
T("BigCommerce","Ecommerce","https://bigcommerce.com",{d:"SaaS ecommerce platform with an open API and headless options.",html:[r`cdn\d*\.bigcommerce\.com`],js:{BCData:""}});
T("PrestaShop","Ecommerce","https://prestashop.com",{d:"Open-source PHP ecommerce platform popular in Europe.",meta:{generator:r`PrestaShop`},js:{prestashop:""},html:[r`/modules/ps_`],implies:["PHP","MySQL"]});
T("OpenCart","Ecommerce","https://opencart.com",{d:"Lightweight PHP ecommerce platform.",html:[r`index\.php\?route=(common|product)/`,r`catalog/view/(theme|javascript)/`],implies:["PHP","MySQL"]});
T("Salesforce Commerce Cloud","Ecommerce","https://salesforce.com/products/commerce-cloud/",{d:"Enterprise commerce platform formerly Demandware.",html:[r`demandware\.(static|edgesuite)|/on/demandware\.store/`],requests:[r`/on/demandware\.static/`]});
T("Shopware","Ecommerce","https://shopware.com",{d:"German open-source PHP commerce platform.",meta:{generator:r`Shopware`},cookies:{"sw-cache-hash":"","sw-states":""},html:[r`shopware`],implies:["PHP","Symfony"]});
T("Ecwid","Ecommerce","https://ecwid.com",{d:"Embeddable store widget that adds a shop to any site.",html:[r`app\.ecwid\.com|ecwid-`],js:{Ecwid:""}});
T("Snipcart","Ecommerce","https://snipcart.com",{d:"Developer-friendly cart you attach to any static or custom site with data attributes.",html:[r`cdn\.snipcart\.com|snipcart-`],js:{Snipcart:""}});

// ───────────── Payment ─────────────
T("Stripe","Payment","https://stripe.com",{
  d:"Developer-first payments platform. Stripe.js renders card fields in an iframe so raw card numbers never touch the merchant's servers.",
  tip:"Stripe's publishable keys start with pk_test_ or pk_live_ — the prefix tells you if the site is in test mode.",
  scripts:[r`js\.stripe\.com`],js:{Stripe:""},iframes:[r`js\.stripe\.com`],requests:[r`api\.stripe\.com|m\.stripe\.(network|com)`],
  cookies:{"__stripe_(mid|sid)":""},extract:{"Key mode":r`html:pk_(live|test)_[A-Za-z0-9]{8,}`}
});
T("PayPal","Payment","https://paypal.com",{d:"Payments with wallet buttons and pay-later options.",scripts:[r`paypal\.com/sdk/js|paypalobjects\.com`],js:{paypal:""},iframes:[r`paypal\.com`]});
T("Square","Payment","https://squareup.com",{d:"Payments and point-of-sale platform with an online SDK.",scripts:[r`web\.squarecdn\.com|squareup\.com/`],html:[r`square\.site|squarecdn\.com`],js:{Square:""}});
T("Braintree","Payment","https://braintreepayments.com",{d:"PayPal-owned gateway with drop-in UI.",scripts:[r`js\.braintreegateway\.com`],js:{braintree:""}});
T("Adyen","Payment","https://adyen.com",{d:"Enterprise payments platform used by global marketplaces.",scripts:[r`checkoutshopper-(live|test)\.adyen\.com`],js:{AdyenCheckout:""}});
T("Klarna","Payment","https://klarna.com",{d:"Buy-now-pay-later provider.",scripts:[r`klarnaservices\.com|klarna\.com`],js:{Klarna:""}});
T("Google Pay","Payment","https://pay.google.com",{d:"Google's wallet for one-tap checkout.",scripts:[r`pay\.google\.com/gp/p/js/pay\.js`],js:{"google.payments":""}});
T("Razorpay","Payment","https://razorpay.com",{d:"Payments gateway popular in India.",scripts:[r`checkout\.razorpay\.com`],js:{Razorpay:""}});
T("Paystack","Payment","https://paystack.com",{d:"African payments gateway supporting cards, bank transfers and mobile money.",scripts:[r`js\.paystack\.co`],js:{PaystackPop:""}});
T("Flutterwave","Payment","https://flutterwave.com",{d:"Pan-African payments infrastructure.",scripts:[r`checkout\.flutterwave\.com|api\.ravepay\.co`],js:{FlutterwaveCheckout:""}});
T("Mollie","Payment","https://mollie.com",{d:"European payment service provider.",scripts:[r`js\.mollie\.com`],js:{Mollie:""}});
T("Afterpay","Payment","https://afterpay.com",{d:"Buy-now-pay-later widget.",scripts:[r`js\.afterpay\.com|static\.afterpay\.com`]});
T("Affirm","Payment","https://affirm.com",{d:"Instalment payments provider.",scripts:[r`cdn1\.affirm\.com`],js:{affirm:""}});
T("Paddle","Payment","https://paddle.com",{d:"Merchant-of-record for SaaS billing and tax.",scripts:[r`cdn\.paddle\.com`],js:{Paddle:""}});
T("Lemon Squeezy","Payment","https://lemonsqueezy.com",{d:"Merchant-of-record for digital products.",scripts:[r`assets\.lemonsqueezy\.com|lmsqueezy\.com`]});

// ───────────── Authentication ─────────────
T("Auth0","Authentication","https://auth0.com",{d:"Identity platform for logins, SSO and MFA.",scripts:[r`cdn\.auth0\.com`],requests:[r`\.auth0\.com/(authorize|oauth/token|userinfo)`],storage:[r`@@auth0spajs@@`],cookies:{"auth0(_compat)?":""}});
T("Okta","Authentication","https://okta.com",{d:"Workforce and customer identity provider.",scripts:[r`okta-signin-widget|global\.oktacdn\.com`],requests:[r`\.okta(preview)?\.com/(oauth2|api/v1)`],js:{OktaAuth:""}});
T("Clerk","Authentication","https://clerk.com",{d:"Drop-in user management components for React and Next.js.",scripts:[r`@clerk/clerk-js|clerk\.accounts\.dev|clerk\.[\w.-]+/npm/@clerk`],cookies:{"__clerk_db_jwt":"","__client_uat":""},js:{Clerk:""}});
T("Firebase Authentication","Authentication","https://firebase.google.com/products/auth",{d:"Google's managed auth with email, social and phone sign-in.",requests:[r`identitytoolkit\.googleapis\.com|securetoken\.googleapis\.com`],storage:[r`firebase:authUser`]});
T("AWS Cognito","Authentication","https://aws.amazon.com/cognito/",{d:"AWS's user pools and identity federation.",requests:[r`cognito-idp\.[\w-]+\.amazonaws\.com|amazoncognito\.com`],storage:[r`CognitoIdentityServiceProvider`]});
T("Microsoft Entra ID (MSAL)","Authentication","https://learn.microsoft.com/entra/",{d:"Microsoft's identity platform for work and personal accounts.",requests:[r`login\.microsoftonline\.com`],storage:[r`^msal\.`],scripts:[r`msal-browser|alcdn\.msauth\.net`]});
T("Google Sign-In","Authentication","https://developers.google.com/identity",{d:"One-tap and button sign-in with Google accounts.",scripts:[r`accounts\.google\.com/gsi/client|apis\.google\.com/js/(platform|api)\.js`],iframes:[r`accounts\.google\.com/gsi`],js:{"google.accounts":""}});
T("Sign in with Apple","Authentication","https://developer.apple.com/sign-in-with-apple/",{d:"Apple's privacy-focused sign-in.",scripts:[r`appleid\.cdn-apple\.com`],js:{AppleID:""}});
T("Facebook Login","Authentication","https://developers.facebook.com/docs/facebook-login/",{d:"Social login through the Facebook JavaScript SDK.",scripts:[r`connect\.facebook\.net/[\w_]+/sdk\.js`],js:{FB:""}});
T("Supabase Auth","Authentication","https://supabase.com/auth",{d:"Open-source auth from Supabase with row-level-security integration.",storage:[r`^sb-.+-auth-token`],requests:[r`\.supabase\.co/auth/v1/`],cookies:{"sb-.+-auth-token(\\.\\d+)?":""}});
T("NextAuth.js / Auth.js","Authentication","https://authjs.dev",{d:"Authentication library for Next.js and other frameworks.",requests:[r`/api/auth/(session|csrf|providers|callback)`],cookies:{"(__Secure-)?next-auth\\.[\\w-]+":"","authjs\\.[\\w-]+":""},implies:["Next.js"]});
T("Keycloak","Authentication","https://keycloak.org",{d:"Open-source identity and access management server.",scripts:[r`keycloak(\.min)?\.js`],requests:[r`/realms/[\w-]+/protocol/openid-connect`],js:{Keycloak:""}});
T("WorkOS","Authentication","https://workos.com",{d:"Enterprise-ready SSO and directory sync as an API.",requests:[r`api\.workos\.com|authkit\.app`]});

// ───────────── Search ─────────────
T("Algolia","Search","https://algolia.com",{d:"Hosted search-as-you-type API. Results return in milliseconds from edge replicas.",scripts:[r`algoliasearch|instantsearch|cdn\.jsdelivr\.net/npm/@algolia`],requests:[r`\.algolia(net\.com|\.net)|algolia\.io`],js:{algoliasearch:""},html:[r`ais-(SearchBox|Hits)`]});
T("Typesense","Search","https://typesense.org",{d:"Open-source typo-tolerant search engine.",requests:[r`typesense`],scripts:[r`typesense`]});
T("Meilisearch","Search","https://meilisearch.com",{d:"Open-source, fast, developer-friendly search engine.",scripts:[r`meilisearch`],requests:[r`meilisearch|/indexes/[\w-]+/search`]});
T("Elasticsearch / Elastic","Search","https://elastic.co",{d:"Distributed search and analytics engine.",requests:[r`/_search\b|/_msearch\b|elastic-cloud\.com`],scripts:[r`elastic-app-search|swiftype`]});
T("Pagefind","Search","https://pagefind.app",{d:"Static search library that indexes at build time — no server needed.",scripts:[r`pagefind(-ui)?\.js`],requests:[r`/pagefind/`]});
T("Google Programmable Search","Search","https://programmablesearchengine.google.com",{d:"Embeddable Google search box for your own site.",scripts:[r`cse\.google\.com/cse`],html:[r`gsc-input|gcse-search`]});
T("Fuse.js","Search","https://fusejs.io",{d:"Tiny client-side fuzzy-search library.",js:{Fuse:""},scripts:[r`fuse(\.min)?\.js|fuse\.js@([\d.]+)##v=\2`]});
