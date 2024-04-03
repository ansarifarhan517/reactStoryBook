import { Metadata } from 'next'

import MultiplePickupsDropsManagementSoftware from '@/common-pages/multiple-pickups-drops-management-software'

const title = 'LogiNext | Pickup and Drop Optimization Software'
const description = 'Automate pick-up & deliveries & manage them on a single dashboard. Ensure right driver mapping, easy order allocation and fast order dispatch using LogiNext.'
const url = 'https://www.loginextsolutions.com/industries/food-and-beverages/multiple-pickups-drops-management-software'

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
    canonical: '/products/reverse/multiple-pickups-drops-management-software'
  }
}

export {
  MultiplePickupsDropsManagementSoftware as default,
  metadata
}
