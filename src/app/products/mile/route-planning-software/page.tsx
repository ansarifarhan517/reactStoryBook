import { Metadata } from 'next'

import RoutePlanningSoftware from '@/common-pages/route-planning-software'

const title = 'LogiNext | Route Planning Software | Last Mile Delivery'
const description = 'Plan faster & optimized routes to meet customer delivery window time with LogiNext. Call us to cover the shortest route, avoid traffic & dynamic rerouting.'
const url = 'https://www.loginextsolutions.com/products/mile/route-planning-software'

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
  RoutePlanningSoftware as default,
  metadata
}

