import { Metadata } from 'next'

import FinalMileMeliveryOptimizationSoftware from '@/common-pages/final-mile-delivery-optimization-software'

const title = 'LogiNext | Last Mile Delivery'
const description = 'LogiNext helps customers with the best software for last mile delivery, ensuring all the orders are delivered on time and meet customer satisfaction. Call now!'
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels/final-mile-delivery-optimization-software'

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
  FinalMileMeliveryOptimizationSoftware as default,
  metadata
}
