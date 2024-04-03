import { Metadata } from 'next'

import HubToHubMiddleMileOptimizationSoftware from '@/common-pages/hub-to-hub-middle-mile-optimization-software'

const title = 'LogiNext | Middle Mile Movement Optimization'
const description = 'Get the best visibility for middle mile movement with delivery schedules, fast dispatch, route optimization, SLA compliance & more. Set up a call with LogiNext.'
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels/hub-to-hub-middle-mile-optimization-software'

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
  HubToHubMiddleMileOptimizationSoftware as default,
  metadata
}
