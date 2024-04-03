import { Metadata } from 'next'

import RoutePlanningForSecondryDistribution from '@/common-pages/route-planning-for-secondary-distribution'

const title = 'LogiNext | Middle Mile | Warehouse to Store Plan'
const description = 'LogiNext offers the best route optimization software to plan and optimize your secondary distribution, reducing turnaround time and ensuring on-time deliveries.'
const url = 'https://www.loginextsolutions.com/industries/retail-and-ecommerce/route-planning-for-secondary-distribution'

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
  RoutePlanningForSecondryDistribution as default,
  metadata
}

