import { Metadata } from 'next'
import SoftwareForCapacityManagementAndHubLoadBalancing from '@/common-pages/software-for-capacity-management-and-hub-load-balancing'

const title = 'LogiNext | Hub Load Balancing | Fleet Management System'
const description = 'Plan your fleet capacity to perfection to fulfill incoming orders, reduce downtime, sort all types of load, match load with truck type and more. Call LogiNext.'
const url = 'https://www.loginextsolutions.com/products/haul/software-for-capacity-management-and-hub-load-balancing'

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
  SoftwareForCapacityManagementAndHubLoadBalancing as default,
  metadata
}

