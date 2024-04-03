import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSubSection from '@/components/page-cover-sub-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Parallax from '@/components/parallax'
import ImageContentLayout from '@/components/image-content-layout'
import Awards from '@/components/awards'
import ButtonGroup from '@/components/button-group'

import { bemClass } from '@/utils'

import productMileBg from '/public/platform-mile-bg.webp'
import loginextMileRouteOptimizationSoftwareRoutePlanner from '/public/products/mile/loginext-mile-route-optimization-software-route-planner.webp'
import coverPageBanner from '/public/loginext-mile-platform.webp'

import productMileInformation from './_data/mile_information'

import './style.scss'

const blk = 'product-mile'

const Mile = () => (
  <>
    <PageCoverSection
      image={productMileBg}
      imageAlt="Product mile"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="product_mile_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="LogiNext Mile"
          description="Optimize and automate pick-up, planning, scheduling and routing for efficient delivery operations seamlessly with the best routing software."
          withGartner
          withTrademark
          dataAutoId="product_mile_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="product_mile_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="secondary" size="large" dataAutoId="product_mile_section_1_sign_up">
              Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Loginext mile"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="product_mile_section_1_cover-image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <PageCoverSubSection
      title="Increase Logistics Efficiency by More Than 20% Using the Best Routing Software"
      description={`Advanced route planning helps companies optimize their pickups and deliveries by
      improving resource capacity utilization, bringing down costs,
      logistics analytics and predicting accurate ETAs for increased on-time deliveries.`}
      buttonLabel="view infographic"
      buttonCategory="secondary"
      redirectUrl={`https://f.hubspotusercontent20.net/hubfs/2704626/Infographics/LastMile_Infographic_March2022.pdf?
      utm_campaign=QSR_US&utm_source=Organic%20Traffic&utm_medium=Website%20Banner&utm_term=Infographic&utm_content=Infographic`}
      image={loginextMileRouteOptimizationSoftwareRoutePlanner}
      video="https://www.youtube.com/embed/DHWY_OSOjM0?autoplay=1&mute=0&controls=0&showinfo=0&modestbranding=1&rel=0&enablejsapi=1"
      videoTitle="Increase Logistics Efficiency by More Than 20% Using the Best Routing Software"
      videoTrackingId="920910210"
      dataAutoId="product_mile_section_2"
    />

    <ImageContentLayout
      content={productMileInformation[0]}
      withFeatureBullet
      dataAutoId="product_mile_section_3"
    />
    <ImageContentLayout
      content={productMileInformation[1]}
      withFeatureBullet
      dataAutoId="product_mile_section_4"
    />
    <ImageContentLayout
      content={productMileInformation[2]}
      withFeatureBullet
      dataAutoId="product_mile_section_5"
    />

    <Awards dataAutoId="product_mile_section_6" />
  </>
)

const title = 'LogiNext Mile | Route Optimization Software | Route Planner'
const description = 'Optimize your delivery routes with the best routing software. Streamline efficiency and reduce costs with top-notch delivery route optimization software.'
const url = 'https://www.loginextsolutions.com/products/mile'

const metadata: Metadata = {
  title,
  description,
  keywords: 'best routing software,delivery route optimization software,delivery routing software',
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
  Mile as default,
  metadata,
}
