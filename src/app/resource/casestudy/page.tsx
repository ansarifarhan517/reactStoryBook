import { Metadata } from 'next'

import ResourceCoverSection from '../_components/resource-cover-section'

import CaseStudyContainer from './_components/case-study-container'

const CaseStudy = () => (
  <ResourceCoverSection
    resource="case study"
    dataAutoId="resources_case_study"
  >
    <CaseStudyContainer dataAutoId="resources_case_study_section_2" />
  </ResourceCoverSection>
)

const title = 'LogiNext Resources | Case Study'
const description = 'Find the best resources related to first-mile, middle-mile, and last-mile deliveries, field workforce management, and on-demand deliveries in logistics.'
const url = 'https://www.loginextsolutions.com/resource/casestudy'

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
  CaseStudy as default,
  metadata
}
