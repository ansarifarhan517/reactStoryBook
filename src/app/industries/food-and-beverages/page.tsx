import { Metadata } from 'next'

import { bemClass } from '@/utils'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import Container from '@/components/container'
import EmpoweringBrands from '@/components/empowering-brands'
import Text from '@/components/text'
import ImageContentLayout from '@/components/image-content-layout'
import SectionTitle from '@/components/section-title'
import FeatureCarousel from '@/components/feature-carousel'

import brandImages from '@/config/empowering-brands'

import foodAndBeveragesBg from '/public/industries-food-and-beverages-bg.webp'
import keyFeaturesFoodBeveragesImg from '/public/industries/food-and-beverages/key-features-food-and-beverages-img.webp'

import industriesFoodBeveragesInformation from './_data/food_and_beverages_information'
import { carouselItems, featureTag } from './_carousel-data'

import './style.scss'

const blk = 'food-and-beverages'

const FoodAndBeverages = () => (
  <>
    <PageCoverSection
      image={foodAndBeveragesBg}
      imageAlt="food and beverages"
      dataAutoId="food_and_beverages_section_1"
    >
      <Container fluid>
        <PageCoverSectionContent
          title="Food and Beverage"
          description={`Be it home delivery of food, beverages or groceries, customers are expecting faster
          deliveries with real time tracking. And your operations manager needs a flexible delivery software
          to cater to these demands. LogiNext’s delivery scheduling software which is powered by the best route
          optimization and automated trip planning modules lets you achieve your business goals.`}
          dataAutoId="food_and_beverages_section_1_content"
        >
          <Text
            tag="p"
            typography="m"
            color="white"
            className={bemClass([blk, 'sub-text'])}
            dataAutoId="food_and_beverages_section_1_title"
          >
            From last mile deliveries to store fulfillment, LogiNext’s comprehensive last mile solutions sets you up for success.
          </Text>
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="food_and_beverages_section_1_lets_talk">
              Lets talk
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
    </PageCoverSection>
    <ImageContentLayout content={industriesFoodBeveragesInformation[0]} dataAutoId="food_and_beverages_section_2">
      <ModalTriggerButton modalType="schedule-a-demo" category="primary" size="large" dataAutoId="food_and_beverages_section_2_schedule_demo" >
        Schedule a demo
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesFoodBeveragesInformation[1]} dataAutoId="food_and_beverages_section_3">
      <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="food_and_beverages_section_3_sign_up">
        Sign up
      </ModalTriggerButton>
    </ImageContentLayout>
    <ImageContentLayout content={industriesFoodBeveragesInformation[2]} dataAutoId="food_and_beverages_section_4">
      <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="food_and_beverages_section_4_talk_to_us">
       Talk to us
      </ModalTriggerButton>
    </ImageContentLayout>
    <SectionTitle
      category="dual"
      className={bemClass([blk, 'carousal-title'])}
      dataAutoId="retail_and_ecommerce_section_5_title"
    >
      Key Features
    </SectionTitle>
    <FeatureCarousel
      dataAutoId="retail_and_ecommerce_section_5"
      carouselItems={carouselItems}
      featureTag={featureTag}
      imageSrc={keyFeaturesFoodBeveragesImg}
    />
    <EmpoweringBrands
      brandsImages={brandImages['food-beverages']}
      industry="food-beverages"
      dataAutoId="food_and_beverages_section_5"
    />
  </>
)

const title = 'Food & Beverage | Last Mile Delivery Tracking | 3PL Solution'
const description = 'Look no further than LogiNext to help with last mile deliveries for your food & beverages. Get smart features like carrier integration, trip planning, ETA, etc.'
const url = 'https://www.loginextsolutions.com/industries/food-and-beverages'

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
  FoodAndBeverages as default,
  metadata
}
