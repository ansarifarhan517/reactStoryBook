import { Metadata } from 'next'
import Script from 'next/script'

import PageCoverSection from '@/components/page-cover-section'
import Text from '@/components/text'
import Container from '@/components/container'

import { bemClass } from '@/utils'

import resourceCarbonEmissionBg from '/public/resource-carbonemission-bg.webp'

import './style.scss'
import CarbonScripts from '../_components/carbon-scripts'

const blk = 'carbon-emission'

const CarbonEmission = () => (
  <>
    <PageCoverSection
      image={resourceCarbonEmissionBg}
      imageAlt="Resource carbon emission"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="resources_carbon_emission_calculator_section_1"
    >
      <Text tag="h1" typography="xxxl" fontWeight="bold" color="white" dataAutoId="resources_carbon_emission_calculator_section_1_header">
        Carbon Emission Calculator
      </Text>
    </PageCoverSection>

    <Container className={bemClass([blk, 'content'])} dataAutoId="resources_carbon_emission_calculator_section_2">
      <CarbonScripts/>
    </Container>
  </>
)

const title = 'Sustainability & GHG Emission Calculator | LogiNext'
const description = 'Try LogiNext\'s free GHG emission calculator that will showcase the total reduction in GHG using our novel software to meet your logistics needs. Check now!'
const url = 'https://www.loginextsolutions.com/resource/carbonemission'

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
  CarbonEmission as default,
  metadata
}
