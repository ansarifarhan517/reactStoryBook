import { Metadata } from 'next'

import DeliverySchedulePlanningSoftware from '@/common-pages/delivery-schedule-planning-software'

const title = 'LogiNext | Schedule Planning | Logistics Scheduling'
const description = 'Need help with planning & scheduling for pick-up & delivery? LogiNext is the smart technology needed to improve fleet utilization & capacity optimization.'
const url = 'https://www.loginextsolutions.com/products/reverse/delivery-schedule-planning-software'

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
    canonical: '/products/mile/delivery-schedule-planning-software'
  }
}

export {
  DeliverySchedulePlanningSoftware as default,
  metadata
}
