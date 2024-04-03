import { Metadata } from 'next'

import ResourceCoverSection from '../_components/resource-cover-section'

import WhitePaperContainer from './_components/whitepaper-container'

const WhitePaper = () => (
  <>
    <ResourceCoverSection resource="white paper" dataAutoId="resources_white_paper">
      <WhitePaperContainer dataAutoId="resources_white_paper_section_2" />
    </ResourceCoverSection>
  </>
)

const title = 'LogiNext Resources | Whitepaper'
const description = 'Find the best resources related to first-mile, middle-mile, and last-mile deliveries, field workforce management, and on-demand deliveries in logistics.'
const url = 'https://www.loginextsolutions.com/resource/whitepaper'

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
  WhitePaper as default,
  metadata
}
