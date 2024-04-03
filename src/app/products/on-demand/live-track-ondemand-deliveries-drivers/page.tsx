import { Metadata } from 'next'

import LiveTrackOnDemandDeliveriesDrivers from '@/common-pages/live-track-ondemand-deliveries-drivers'

const title = 'LogiNext | Live Fleet & Workforce Tracking System'
const description = 'Get live tracking of on-demand deliveries for increased visibility and accurate ETAs with live traffic analysis using LogiNext. Call us to set up a free demo!'
const url = 'https://www.loginextsolutions.com/products/on-demand/live-track-ondemand-deliveries-drivers'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  LiveTrackOnDemandDeliveriesDrivers as default,
  metadata
}

