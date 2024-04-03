import { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { bemClass } from '@/utils'

import LoadWhenInView from '@/components/load-when-in-view'

import Awards from '@/components/awards'
import Text from '@/components/text'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import SectionTitle from '@/components/section-title'
import Container from '@/components/container'

import gartnerInsight from '/public/gartner-insight-2.webp'
import ReviewRating from './_home/_components/review-rating'

const TabSlider = dynamic(() => import('@/components/tab-slider'), { ssr: false })
const LoginextEmpowerBrands = dynamic(() => import('@/components/loginext-empower-brands'), { ssr: false })
const AutomatedOrderLifeCycle = dynamic(() => import('./_home/_components/automated-order-life-cycle'), { ssr: false })
const WhyLoginext = dynamic(() => import('./_home/_components/why-loginext'), { ssr: false })
const EasyIntegrations = dynamic(() => import('./_home/_components/easy-integrations'), { ssr: false })

import { carouselItems } from './_home/data'

import './style.scss'

const blk = 'home'

const Home = () => (
  <div className={blk} data-auto-id="home">
    <div className={bemClass([blk, 'video'])} data-auto-id="home_section_1">
      <video
        preload="none"
        autoPlay
        playsInline
        loop
        muted
        id="video"
        poster="/public/home-page-video-poster.webp"
        data-auto-id="home_section_1_video"
      >
        <source src="/home-page-video.mp4" />
      </video>
      <div className={bemClass([blk, 'cover-section'])}>
        <Text
          tag="h1"
          typography="xxxl"
          color="white"
          fontWeight="bold"
          className={bemClass([blk, 'cover-section-text'])}
        >
          <span data-auto-id="home_section_1_title_1">Deliver Smart.</span>
          <span
            className={bemClass([blk, 'cover-section-deliver-fast'])}
            data-auto-id="home_section_1_title_2"
          >
            Deliver Fast.
          </span>
        </Text>
        <Text
          tag="p"
          typography="m"
          color="white"
          className={bemClass([blk, 'cover-section-description'])}
          dataAutoId="home_section_1_desc"
        >
          Automate your operations to deliver a satisfying customer experience, each time.
        </Text>
        <ButtonGroup isCenter>
          <ModalTriggerButton
            modalType="talk-to-us"
            category="secondary"
            size="large"
            dataAutoId="home_section_1_schedule_a_demo"
          >
            Schedule a demo
          </ModalTriggerButton>
          <ModalTriggerButton
            modalType="sign-up"
            category="primary"
            size="large"
            dataAutoId="home_section_1_sign_up"
          >
            Sign up
          </ModalTriggerButton>
        </ButtonGroup>
      </div>
    </div>
    <LoginextEmpowerBrands dataAutoId="home_section_2"/>
    <div className={bemClass([blk, 'gartner-logo'])} data-auto-id="home_section_3">
      <Image
        src={gartnerInsight}
        alt="Gartner Insights"
        loading="lazy"
        data-auto-id="home_section_3_image_gartner"
      />
    </div>
    <ReviewRating />
    <Container className={bemClass([blk, 'top-rated'])} dataAutoId="home_section_5">
      <a
        href="https://www.gartner.com/reviews/market/vehicle-routing-and-scheduling-and-last-mile-technologies"
        target="_blank"
        className={bemClass([blk, 'top-rated-link'])}
      >
        <Text tag="span" typography="l" color="secondary">
          Top Rated In Vehicle Routing and Scheduling and Last-Mile Technologies
        </Text>
      </a>
    </Container>
    <LoadWhenInView>
      <AutomatedOrderLifeCycle />
    </LoadWhenInView>
    <SectionTitle
      category="dual"
      className={bemClass([blk, 'section-title'])}
      dataAutoId="home_section_7_title"
    >
      Why Loginext?
    </SectionTitle>
    <WhyLoginext dataAutoId="home_section_7"/>
    <SectionTitle
      category="dual"
      className={bemClass([blk, 'section-title'])}
      dataAutoId="home_section_8_title"
    >
      Industries We Serve
    </SectionTitle>
    <LoadWhenInView dataAutoId="home_section_8">
      <TabSlider page="home" data={carouselItems} dataAutoId="home_section_8" />
    </LoadWhenInView>
    <LoadWhenInView dataAutoId="home_section_9">
      <EasyIntegrations dataAutoId="home_section_9" />
    </LoadWhenInView>
    <ButtonGroup isCenter className={bemClass([blk, 'bottom-action'])}>
      <ModalTriggerButton
        modalType="schedule-a-demo"
        category="secondary"
        size="large"
        dataAutoId="home_section_10_schedule_a_demo"
      >
        schedule a demo
      </ModalTriggerButton>
      <ModalTriggerButton
        modalType="sign-up"
        category="primary"
        size="large"
        dataAutoId="home_section_10_sign_up"
      >
        Sign up
      </ModalTriggerButton>
    </ButtonGroup>
    <Awards dataAutoId="home_section_11" />
  </div>
)

const title = 'LogiNext Solutions | Logistics Automation Software'
const description = `LogiNext helps automate your operations to help with real-time tracking,
route optimization, transportation and logistics management software. Setup a demo now!`
const url = 'https://www.loginextsolutions.com/'

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
    images: [{
      url: 'https://info.loginextsolutions.com/hubfs/Imported%20sitepage%20images/ogImage.jpg',
      alt: 'LogiNext Solutions | Logistics Automation Software'
    }]
  },
  twitter: {
    title,
    description,
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export { Home as default, metadata }
