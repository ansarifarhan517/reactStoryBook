import { Metadata } from 'next'

import LogisticsSoftwareForDriverAndVehicleManagement from '@/common-pages/logistics-software-for-driver-and-vehicle-management'

const title = 'LogiNext | Vehicle Management | Boost Delivery'
const description = 'Make maximum utilization of your fleet by using their capacity, driver skill sets, and potential to the fullest to boost delivery efficiency with LogiNext.'
const url = 'https://www.loginextsolutions.com/industries/food-and-beverages/logistics-software-for-driver-and-vehicle-management'

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
    canonical: '/industries/consumer-package/logistics-software-for-driver-and-vehicle-management'
  }
}

export {
  LogisticsSoftwareForDriverAndVehicleManagement as default,
  metadata
}

