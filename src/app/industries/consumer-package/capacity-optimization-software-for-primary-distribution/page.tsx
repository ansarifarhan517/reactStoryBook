import { Metadata } from 'next'

import CapacityOptimizationSoftwareForPrimaryDistribution from '@/common-pages/capacity-optimization-software-for-primary-distribution'

const title = 'LogiNext | Capacity Management & Optimization '
const description = 'Automate your capacity management to make your primary distribution faster and improve overall logistics efficiency with LogiNext. Schedule a demo now!'
const url = 'https://www.loginextsolutions.com/industries/consumer-package/capacity-optimization-software-for-primary-distribution'

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
    canonical: '/industries/retail-and-ecommerce/capacity-optimization-software-for-primary-distribution'
  }
}

export {
  CapacityOptimizationSoftwareForPrimaryDistribution as default,
  metadata
}
