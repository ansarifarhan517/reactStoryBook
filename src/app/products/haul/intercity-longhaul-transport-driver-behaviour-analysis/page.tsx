import { Metadata } from 'next'

import IntercityLonghaulTransportDriverBehaviourAnalysis from '@/common-pages/intercity-longhaul-transport-driver-behaviour-analysis'

const title = 'LogiNext | Driver Behavior Tracking Software'
const description = 'Want to understand driver performance, identify bottlenecks & compliance issues? Analyze driver behavior patterns with LogiNext for safer deliveries. Call now!'
const url = 'https://www.loginextsolutions.com/products/haul/intercity-longhaul-transport-driver-behaviour-analysis'

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
  IntercityLonghaulTransportDriverBehaviourAnalysis as default,
  metadata
}

