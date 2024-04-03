import { Metadata } from 'next'

import ColdChainLogisticsManagementSoftware from '@/common-pages/cold-chain-logistics-management-software'

const title = ' LogiNext | Temperture Controlled Transport'
const description = 'Want to monitor your cold chain logistics in real time? With LogiNext, get real time visibility & tracking for all your in-transit vehicles. Call us for a demo!'
const url = 'https://www.loginextsolutions.com/industries/consumer-package/cold-chain-logistics-management-software'

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
  ColdChainLogisticsManagementSoftware as default,
  metadata
}
