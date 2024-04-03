import { Metadata } from 'next'
import dynamic from 'next/dynamic'

import LoadWhenInView from '@/components/load-when-in-view'

import SecurityHeader from './_components/security-header'
import SecurityFeatures from './_components/security-features'

const DataSecurity = dynamic(() => import('./_components/data-security'))
const SecurityCertifications = dynamic(() => import('./_components/security-certifications'))
const DataProtection = dynamic(() => import('./_components/data-protection'))
const SecurityHackProof = dynamic(() => import('./_components/system-hack-proof'))
const AllSecure = dynamic(() => import('./_components/all-secure'))

const Security = () => (
  <>
    <SecurityHeader />
    <SecurityFeatures/>
    <LoadWhenInView>
      <DataSecurity />
    </LoadWhenInView>
    <LoadWhenInView>
      <SecurityCertifications />
    </LoadWhenInView>
    <LoadWhenInView>
      <DataProtection />
    </LoadWhenInView>
    <LoadWhenInView>
      <SecurityHackProof />
    </LoadWhenInView>
    <LoadWhenInView>
      <AllSecure />
    </LoadWhenInView>
  </>
)

const title = 'Security'
const description = 'LogiNext has set the best security and privacy standards with multiple AWS & ISO certifications to ensure cloud data for logistics operations is safe and secure.'
const url = 'https://www.loginextsolutions.com/security'

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
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export { Security as default, metadata }
