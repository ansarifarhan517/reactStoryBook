import dynamic from 'next/dynamic'
import Script from 'next/script'
import { Montserrat } from 'next/font/google'
import { ReactNode } from 'react'

import Header from '@/components/header'

import JoinPrListPopup from '@/components/join-pr-list-popup'
import SubscribeToNewsletter from '@/components/subscribe-to-newsletter-popup'
import VideoModal from '@/components/video-modal'
import TalkTousPopup from '@/components/talk-to-us-popup'
import SignUpPopup from '@/components/sign-up-popup'
import ScheduleADemoPopup from '@/components/schedule-a-demo-popup'

import AppProvider from '@/context/provider'

import CookieConsent from '@/components/cookie-consent'
import HomePageExternalScript from '@/components/home-page-external-script'

import '../sass/global.scss'

const Footer = dynamic(() => import('@/components/footer'))

const monteserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '500', '600'],
  display: 'swap',
})

type layoutProps = {
  children: ReactNode
}

const Layout = ({ children }: layoutProps) => (
  <html lang="en">
    <head>
      <style>
        {` #hubspot-messages-iframe-container {
          min-height: 96px;
          min-width: 100px;
          width: 100px;
          height: 120px;
        }`}
      </style>
      <link rel="icon" href="/public/favicon.ico" sizes="any" />
    </head>
    <body className={monteserrat.className}>
      <CookieConsent />
      <AppProvider>
        <>
          <Header />
          <main>{children}</main>
          <Footer />
          <SignUpPopup />
          <ScheduleADemoPopup />
          <TalkTousPopup />
          <JoinPrListPopup />
          <SubscribeToNewsletter />
          <VideoModal />
        </>
      </AppProvider>
      <HomePageExternalScript />
      <Script id="google-analytics" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MHLSCM3');`}
      </Script>
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KZLR6RMYBN"
      />
      <Script id="google-analytics-script-code">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-KZLR6RMYBN');`}
      </Script>
    </body>
  </html>
)

export default Layout
