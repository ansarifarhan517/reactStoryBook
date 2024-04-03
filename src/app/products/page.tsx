import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import Awards from '@/components/awards'
import Parallax from '@/components/parallax'
import Text from '@/components/text'
import SectionTitle from '@/components/section-title'
import TabSlider from '@/components/tab-slider'
import LoadWhenInView from '@/components/load-when-in-view'

import { bemClass } from '@/utils'

import PlatformConfigCard from './_components/platform-config-card'
import platformConfigCards from './_data/platform-config-cards'
import OperatingSystem from './_components/operating-system'
import { carouselItems } from './_data'

import platformBg from '/public/platform-bg.webp'
import coverPageBanner from '/public/loginext-mile-platform.webp'

const blk = 'products'

import './style.scss'

import ProductsCarousel from './_components/products-carousel'

const Products = () => (
  <>
    <PageCoverSection
      image={platformBg}
      imageAlt="LogiNext Platform"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="products_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <div className={bemClass([blk, 'content'])}>
          <Text
            tag="h1"
            typography="xxxl"
            color="white"
            fontWeight="bold"
            className="slide-fade-in-delay-1"
            dataAutoId="products_section_1_title"
          >
            <>
              <span className={bemClass([blk, 'loginext'])}>LogiNext</span>{' '}
              <span>Platform</span>
            </>
          </Text>
          <Text
            tag="p"
            typography="m"
            color="white"
            className={bemClass([
              blk,
              'description',
              {},
              'slide-fade-in-delay-1',
            ])}
            dataAutoId="products_section_1_description"
          >
            Simplify and automate all aspects of your logistics operations to
            deliver efficiently, at scale.
          </Text>
          <ButtonGroup className="slide-fade-in-delay-1">
            <ModalTriggerButton
              modalType="talk-to-us"
              category="secondary"
              size="large"
              dataAutoId="products_section_1_talk-to-us_button"
            >
              Talk to us
            </ModalTriggerButton>
            <ModalTriggerButton
              modalType="sign-up"
              category="primary"
              size="large"
              dataAutoId="products_section_1_sign-up_button"
            >
              Sign up
            </ModalTriggerButton>
          </ButtonGroup>
        </div>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Loginext mile"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id = "products_section_1_cover_image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <Container className={bemClass([blk, 'mid-section'])} dataAutoId="products_section_2">
      <SectionTitle category="secondary" color="black" dataAutoId="products_section_2_title">
        Comprehensive Logistics Enablement Platform that Scales with Your Growth
      </SectionTitle>
      <Text
        tag="p"
        typography="m"
        color="black"
        className={bemClass([blk, 'mid-section-text'])}
        dataAutoId="products_section_2_description"
      >
        <>
          Whether you are in <strong>food delivery business</strong> looking to
          ensure your customers get food that is hot and crisp, or a{' '}
          <strong>postal company</strong> transforming from documents to
          parcels, or a <strong>logistics company</strong> wanting to empower
          their customers deliver superior customer experience, or in the{' '}
          <strong>eCommerce business</strong> looking at ways to beat global
          giants at order ETAs, LogiNext’s platform helps you digitize and
          automate operations to ensure you can{' '}
          <strong>Deliver Fast, Deliver Smart</strong>.
        </>
      </Text>
    </Container>
    <div className={bemClass([blk, 'platform-config'])} data-auto-id="products_section_3">
      <SectionTitle
        color="black"
        className={bemClass([blk, 'platform-config-title'])}
        data-auto-id="products_section_3_title"
      >
        A Platform Built with Your Business in Mind
      </SectionTitle>
      <div className={bemClass([blk, 'platform-config-content'])} data-auto-id="products_section_3_cards">
        {platformConfigCards.map(({ icon, title, description }, index) => (
          <div key={icon} className={bemClass([blk, 'platform-config-card'])} data-auto-id={`products_section_3_card_${index}`}>
            <PlatformConfigCard
              name={icon}
              title={title}
              description={description}
              iconDataAutoId={`products_section_3_card_${index}_icon`}
              titleDataAutoId={`products_section_3_card_${index}_title`}
              descriptionDataAutoId={`products_section_3_card_${index}_description`}
            />
          </div>
        ))}
      </div>
    </div>
    <LoadWhenInView>
      <OperatingSystem />
    </LoadWhenInView>
    <LoadWhenInView>
      <ProductsCarousel/>
    </LoadWhenInView>
    <SectionTitle
      category="dual-reverse"
      className={bemClass([blk, 'section-title'])}
      dataAutoId="products_section_6_title"
    >
      LogiNext Platform
    </SectionTitle>
    <LoadWhenInView>
      <TabSlider page="platform" data={carouselItems} dataAutoId="products_section_6" />
    </LoadWhenInView>
    <Awards dataAutoId="home_section_7" />
  </>
)

const title = 'LogiNext Platform | Logistics Management & Operations System'
const description = `LogiNext offers a comprehensive TMS solution to help CEP, CPG, F&B, Retail
and eCommerce, and Transportation industries meet their logistics hurdles. Call now!`
const url = 'https://www.loginextsolutions.com/products'

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

export {
  Products as default,
  metadata
}
