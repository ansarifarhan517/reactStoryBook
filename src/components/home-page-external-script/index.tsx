import Script from 'next/script'
import LoadExternalScript from '../load-external-script'

const HomePageExternalScript = () => (
  <LoadExternalScript delay={7000}>
    <>
      <Script
        src="https://js.usemessages.com/conversations-embed.js"
        id="hubspot-messages-loader"
        strategy="lazyOnload"
        data-loader="hs-scriptloader"
        data-hsjs-portal="2704626"
        data-hsjs-env="prod"
        data-hsjs-hublet="na1"
      />
      <Script
        src="https://js.hsadspixel.net/fb.js"
        id="hs-ads-pixel-2704626"
        strategy="lazyOnload"
        data-ads-portal-id="2704626"
        data-ads-env="prod"
        data-loader="hs-scriptloader"
        data-hsjs-portal="2704626"
        data-hsjs-env="prod"
        data-hsjs-hublet="na1"
      />
      <Script
        src="https://js.hsleadflows.net/leadflows.js"
        id="LeadFlows-2704626"
        strategy="lazyOnload"
        data-leadin-portal-id="2704626"
        data-leadin-env="prod"
        data-loader="hs-scriptloader"
        data-hsjs-portal="2704626"
        data-hsjs-env="prod"
        data-hsjs-hublet="na1"
      />
      <Script
        src="https://js.hs-analytics.net/analytics/1709908500000/2704626.js"
        strategy="lazyOnload"
        id="hs-analytics"
      />
      <Script
        src="https://js.hs-banner.com/v2/2704626/banner.js"
        strategy="lazyOnload"
        id="cookieBanner-2704626"
        data-cookieconsent="ignore"
        data-hs-ignore="true"
        data-loader="hs-scriptloader"
        data-hsjs-portal="2704626"
        data-hsjs-env="prod"
        data-hsjs-hublet="na1"
      />
      <Script
        id="linkedin-insight-tag"
        strategy="lazyOnload"
      >
        {`
          _linkedin_partner_id = "3700057";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}
      </Script>
      <Script
        id="analytics-insight"
        strategy="lazyOnload"
      >
        {`
        (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          var s = document.getElementsByTagName("script")[0];
          var b = document.createElement("script");
          b.type = "text/javascript";b.async = false;
          b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
          s.parentNode.insertBefore(b, s);})(window.lintrk);
        `}
      </Script>
      <Script
        id="ms-clarity-tag"
        strategy="lazyOnload"
      >
        {`
          (function(c, l, a, r, i, t, y) {
              c[a] = c[a] || function() {
                  (c[a].q = c[a].q || []).push(arguments)
              };
              t = l.createElement(r);
              t.async = 0;
              t.src = "https://www.clarity.ms/tag/" + i;
              y = l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t, y);
          })(window, document, "clarity", "script", "brl39lsn4t")
          `}
      </Script>
    </>
  </LoadExternalScript>
)

export default HomePageExternalScript
