import { Metadata } from 'next'

import ApplicationForDeliveryValidationThroughEPOD from '@/common-pages/application-for-delivery-validation-through-epod'

const title = 'LogiNext | Delivery Validation Software | EPOD'
const description = 'Need to authenticate your deliveries? LogiNext helps with secure ePOD, eSign, & customer feedback when delivered to the right address. Call us & set up a call.'
const url = 'https://www.loginextsolutions.com/products/on-demand/application-for-delivery-validation-through-epod'

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
  ApplicationForDeliveryValidationThroughEPOD as default,
  metadata
}

