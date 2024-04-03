import { Metadata } from 'next'
import Image from 'next/image'

import { bemClass } from '@/utils'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import ConfigurationSection from '@/components/configuration-section'
import Parallax from '@/components/parallax'
import Container from '@/components/container'

import coverPageBanner from '/public/field-workforce-schedule-planning.webp'
import takeYourRoutesForARide from '/public/take-your-routes-for-a-ride.webp'
import makePlansThatWorkForYou from '/public/make-plans-that-work-for-you.webp'
import improveTaskAllocationWithAutomation from '/public/improve-task-allocation-with-automation.webp'

import './style.scss'

const blk = 'field-workforce-schedule-planning-software'

const FieldWorkforceSchedulePlanningSoftware = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])}>
      <div className={bemClass([blk, 'cover-bg'])} />
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Field Workforce Schedule Planning"
          description="Increase the productivity of your field service representatives with advanced schedule or journey planning."
          className={bemClass([blk, 'content'])}
        >
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large">
            Request a demo
          </ModalTriggerButton>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Field Workforce Schedule Planning"
            className={bemClass([blk, 'image'])}
            loading="eager"
          />
        </Parallax>
      </Container>
      {/* <div className={bemClass([blk, 'cover-section-bottom'])} /> */}
    </div>
    <ProductInformativeLayout
      hAlign="right"
      image={takeYourRoutesForARide}
      imageAlt="Take Your Routes for a Ride"
    >
      <ProductInformativeContent
        title="Take Your Routes for a Ride"
        description={`Expertly plan the routes of all your field professionals to help them
        visit more venues or outlets in a shorter time, taking the most optimized path,
        avoiding traffic prone areas, and reaching each outlet on-time.`}
        features={[]}
      />
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={makePlansThatWorkForYou}
      imageAlt="Make Plans that Work for You"
    >
      <ProductInformativeContent
        title="Make Plans that Work for You"
        description={`Plan perfect schedules for all field visits taking into consideration
        multiple considerations such as preferred time slots, visits to outlets at regular
        intervals for better relations, etc.`}
        features={[{
          id: 'map-all-details-of-the_areas-you-serve',
          title: 'Map All Details of The Areas You Serve',
          description: `Create virtual demarcations called geofences where each section represents
          an area of well-defined strategic interests. Divide large territories into important
          geofenced areas for better planning and control.`,
        }, {
          id: 'maximizeAllin-coming-revenue',
          title: 'Maximize All In-Coming Revenue',
          description: `Identify the revenue and business coming in from each area or outlet to
          figure which parts of the planning or areas need more focus and how best to direct field
          agents to maximize work in these areas.`,
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Get in touch
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/pricing/signup" category="default" outline>
              sign up for trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Multiple Constraints to Create the Best Plans"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="gray-dark"
      className={bemClass([blk, 'config-section'])}
      widthBg
      data={[{
        id: 'shorter-distances',
        icon: 'small-field-field-workforce-schedule-planning-shorter-distances',
        title: 'Shorter Distances',
        description: 'Create faster routes traveling smaller distances while covering more outlets.'
      }, {
        id: 'preferred-time-slots',
        icon: 'small-field-field-workforce-schedule-planning-preferred-time-slots',
        title: 'Preferred Time-Slots',
        description: 'Plan visits to outlets as per the preferred times requested by the clients.'
      }, {
        id: 'multiple-choices-in-plans',
        icon: 'small-field-field-workforce-schedule-planning-multiple-choices-in-plans',
        title: 'Multiple Choices in Plans',
        description: 'Visually compare field movement schedule options and pick the best one.'
      }, {
        id: 'optimal-service-time',
        icon: 'small-field-field-workforce-schedule-planning-optimal-service-time',
        title: 'Optimal Service Time',
        description: 'Schedule visits with a clear option to optimize the time spent at each outlet.'
      }, {
        id: 'regular-interval-visits',
        icon: 'small-field-field-workforce-schedule-planning-regular-interval-visits',
        title: 'Regular Interval Visits',
        description: 'Plan regular field agent visits to key outlets to improve their engagement.'
      }, {
        id: 'unique-schedules',
        icon: 'small-field-field-workforce-schedule-planning-unique-schedules',
        title: 'Unique Schedules',
        description: 'Ensure each agent has a unique schedule avoiding any overlap with other agents.'
      }]}
    />
    <ProductInformativeLayout
      hAlign="left"
      image={improveTaskAllocationWithAutomation}
      imageAlt="Improve Task Allocation with Automation"
    >
      <ProductInformativeContent
        title="Improve Task Allocation with Automation"
        description={`Increase the performance of all field service professionals by automatically
        assigning tasks while balancing incoming revenue and orders across agents.`}
        features={[{
          id: 'assign-right-task-to-the-right-agent',
          title: 'Assign Right Task to the Right Agent',
          description: `Tasks are automatically assigned to field agents who have more local
          knowledge and better relationships with clients in that area. This increases their
          chance of conversion and engagement.`,
        }, {
          id: 'create-the-perfect-field-service-ecosystem',
          title: 'Create the Perfect Field Service Ecosystem',
          description: `Plan visits to different outlets with a view to balance the incoming
          orders and manage the lead time, time taken to fulfill the order, accordingly. This
          helps streamline the production and delivery movement.`,
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/pricing/signup" category="default" outline>
             14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Reverse | Schedule Planning | Field Service Solution'
const description = 'Improve the performance of field service professionals and create the perfect automated field service ecosystem with LogiNext Reverse. Call us for a demo.'
const url = 'https://www.loginextsolutions.com/feature'

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
  FieldWorkforceSchedulePlanningSoftware as default,
  metadata
}
