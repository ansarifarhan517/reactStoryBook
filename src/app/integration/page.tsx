import { Metadata } from 'next'

import IntegrationCoverSection from './_components/integration-cover-section'
import IntergrationMenu from './_components/integration-menu'

const ApiIntegration = () => (
  <>
    <IntegrationCoverSection />
    <IntergrationMenu />
  </>
)

const title = 'LogiNext Integrations | Comprehensive Integration Support'
const description = 'LogiNext\'s comprehensive suite of Integration support lets you seamlessly connect your existing operational systems for plug & play operating system for your logistics.'
const url = 'https://www.loginextsolutions.com/integration'

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
  ApiIntegration as default,
  metadata
}
