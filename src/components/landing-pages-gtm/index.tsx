import Script from 'next/script'
import LoadExternalScript from '../load-external-script'

const LandingPagesGtm = () => (
  <>
    <LoadExternalScript>
      <>
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-KZLR6RMYBN"
        />
        <Script id="landing-pages-gtm" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KZLR6RMYBN');
          `}
        </Script>
      </>
    </LoadExternalScript>
  </>
)

export default LandingPagesGtm
