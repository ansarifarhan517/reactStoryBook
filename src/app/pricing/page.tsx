import { Metadata } from 'next'
import { bemClass } from '@/utils'

import Container from '@/components/container'
import Awards from '@/components/awards'

import PricingHeader from './_components/pricing-header'
import PricingCardSection from './_components/pricing-card-section'
import PricingFeatures from './_components/pricing-features'
import PricingFAQ from './_components/pricing-FAQ'

import './style.scss'

const blk = 'pricing'

const Pricing = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])}>
      <PricingHeader
        title="You're Just One Step Away From Optimizing Your Logistics Operations"
        subTitle="Get the Ideal Plan For Your Business Needs"
        dataAutoId="pricing_section_1"
      />
      <Container fluid>
        <PricingCardSection dataAutoId="pricing_section_2" />
      </Container>
    </div>
    <Container>
      <>
        <PricingFeatures dataAutoId="pricing_section_3" />
        <PricingFAQ dataAutoId="pricing_section_4" />
      </>
    </Container>
    <Awards dataAutoId="pricing_section_5" />
  </>
)

const title = 'LogiNext Pricing'
const description = 'Contact us or fill out the form to get the best  pricing for automating your logistics and supply chain operations. Take advantage of the opportunity today!'
const url = 'https://www.loginextsolutions.com/privacy-policy'

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
  Pricing as default,
  metadata
}
