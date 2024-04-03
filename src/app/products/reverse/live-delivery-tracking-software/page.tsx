import { Metadata } from 'next'

import LiveDeliveryTrackingSoftware from '@/common-pages/live-delivery-tracking-software'

const title = 'LogiNext | Logistics Delivery Tracking Software | ETA'
const description = 'LogiNext offers the best live delivery tracking from allocation to fulfillment of orders. Get ground level visibility with real time notification. Call now!'
const url = 'https://www.loginextsolutions.com/products/reverse/live-delivery-tracking-software'

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
  alternates: {
    canonical: '/products/mile/live-delivery-tracking-software'
  }
}

export {
  LiveDeliveryTrackingSoftware as default,
  metadata
}

