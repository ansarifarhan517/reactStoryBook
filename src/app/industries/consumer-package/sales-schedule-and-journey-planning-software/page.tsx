import { Metadata } from 'next'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/schedule-optimization-for-sales-representatives.webp'
import effectiveSalesVisitScheduling from '/public/effective-sales-visit-scheduling.webp'
import outletSalesMapping from '/public/outlet-sales-mapping.webp'


import './style.scss'

const blk = 'sales-schedule-and-journey-planning-software'

const SalesScheduleAndJourneyPlanningSoftware = () => (
  <>
    <ProductInformativeLayout
      image={coverPageBanner}
      imageAlt="Schedule Optimization for Sales Representatives"
      loading="eager"
      hAlign="right"
      vAlign="bottom"
      contentAlign="start"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="sales_schedule_and_journey_planning_software_section_1"
      isCoverSection
    >
      <PageCoverSectionContent
        fluid
        title="Schedule Optimization for Sales Representatives"
        description={`Plan better delivery routes which reduce overall turnaround time for
        resources and ensure on-time deliveries.`}
        className={bemClass([blk, 'cover-content'])}
        dataAutoId="sales_schedule_and_journey_planning_software_section_1_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="sales_schedule_and_journey_planning_software_section_1_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="sales_schedule_and_journey_planning_software_section_1_try_free">
              try out free
          </ModalTriggerButton>
        </ButtonGroup>
      </PageCoverSectionContent>
    </ProductInformativeLayout>
    <MidContentSection
      title="Field Sales Performance Booster"
      description={`Plan optimal schedules for all field sales agents by increasing total service time
      spent at retailer’s outlet, decreasing the total distance traveled, assigning the
      top revenue-generating outlet to the best field agent, etc.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="sales_schedule_and_journey_planning_software_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="sales_schedule_and_journey_planning_software_section_2_talk_to_us">
          talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="sales_schedule_and_journey_planning_software_section_2_free_trail">
            14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      iconColor="primary"
      data={[
        {
          id: 'territory-mapping',
          icon: 'large-mile-delivery-schedule-planning-territory-mapping',
          title: 'Territory Mapping',
          description: 'Categorize retailers or outlets as per revenue, volume, or product lines.'
        },
        {
          id: 'preferred-time-slots',
          icon: 'large-on-demand-web-preferred-time-slots',
          title: 'Preferred Time-Slots',
          description: 'Plan schedules factoring-in preferred visiting time-slots for all retail outlets.'
        },
        {
          id: 'avoiding-overlap',
          icon: 'large-on-demand-mobile-interactive-map-interface',
          title: 'Avoiding Overlap',
          description: 'Create schedules sustaining time-gap between visits to the same retailer.'
        }
      ]}
      dataAutoId="sales_schedule_and_journey_planning_software_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={effectiveSalesVisitScheduling}
      imageAlt="Effective Sales Visit Scheduling"
      dataAutoId="sales_schedule_and_journey_planning_software_section_3"
    >
      <ProductInformativeContent
        title="Effective Sales Visit Scheduling"
        description={`Plan schedules, or permanent journey plans, for entire field sales force
        in quick time and compare across multiple schedules to find out which best suits your
        operations.`}
        features={[{
          id: 'Automatic Assignments',
          title: 'Automatic Assignments',
          description: `Assign the right task or retail visit to the field sales agent with the
          right skill-set for added efficiency and conversion power. Ensure that timelines for
          each visit are unique and fitting in preferred slots.`,
        }, {
          id: 'Easy and Simple Interface',
          title: 'Easy and Simple Interface',
          description: `Field sales agents follow a simple in-app interface directing them to all
          their visits, giving them the ability to check-in and check-out with accurate time-stamps,
          and easy retailer feedback capture.`,
        }]}
        dataAutoId="sales_schedule_and_journey_planning_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary"dataAutoId="sales_schedule_and_journey_planning_software_section_3_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <ModalTriggerButton outline modalType="sign-up" category="default"dataAutoId="sales_schedule_and_journey_planning_software_section_3_request_demo" >
            14 days free trial
            </ModalTriggerButton>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Plan for Every Constraint"
      iconAlign="left-top"
      iconBackground="primary"
      textColor="white"
      iconType="circular"
      iconColor="white"
      iconBorder="primary"
      iconSize="sm"
      columns="3"
      data={[{
        id: 'route-optimization',
        icon: 'small-mile-live-tracking-dynamic-rerouting',
        title: 'Route Optimization',
        description: 'Plan routes optimized for local traffic for faster delay-free traveling.'
      }, {
        id: 'increased-visits/day',
        icon: 'small-haul-voice-schedule-route-planning-auto-allocate-to-vehicles',
        title: 'Increased Visits/Day',
        description: 'More retail outlets visited per days within the prescribed timelines.'
      }, {
        id: 'reduced-distances',
        icon: 'small-haul-driver-behavior--risk-measurement',
        title: 'Reduced Distances',
        description: 'Lesser total distance traveled per day with faster and optimized routes.'
      }, {
        id: 'dynamic-etas',
        icon: 'small-mile-route-planning-and-optimization-dynamic-rerouting',
        title: 'Dynamic ETAs',
        description: 'Live tracking and dynamic estimated time of arrivals for all sales visits.'
      }, {
        id: 'regular-visits',
        icon: 'small-field-field-workforce-schedule-planning-regular-interval-visits',
        title: 'Regular Visits',
        description: 'Timely visits to outlets to sustain revenue, lead time, and order cycles.'
      }, {
        id: 'optimal-service-time',
        icon: 'small-field-field-workforce-schedule-planning-optimal-service-time',
        title: 'Optimal Service Time',
        description: 'Ideal time spent at each outlet for better relations and higher conversion.'
      }
      ]}
      className={bemClass([blk,'plan-every-constraint'])}
      dataAutoId="sales_schedule_and_journey_planning_software_section_4"
    />
    <ProductInformativeLayout
      hAlign="left"
      image={outletSalesMapping}
      imageAlt="Effective Sales Visit Scheduling"
      dataAutoId="sales_schedule_and_journey_planning_software_section_4"
    >
      <ProductInformativeContent
        title="Outlet-Sales Mapping"
        description={`Map retail outlets within territories as per local demographics, 
                    revenue generated or volume consumed, SKUs or product line catered, to the right sales professionals.`}
        features={[{
          id: 'revenue-balancing',
          title: 'Revenue Balancing',
          description: `Plan optimized schedules to balance incoming revenue from different retail outlets, sustain sales volumes 
          across product lines and territories, and to balance the load across sales professionals.`,
        }, {
          id: 'skill-set-mapping',
          title: 'Skill-Set Mapping',
          description: `Identify skill-sets of different field sales agents, their relationship with individual retailers, and 
                        their ability to handle different product lines to assign them the outlets which they can effectively convert.`,
        }]}
        dataAutoId="sales_schedule_and_journey_planning_software_section_5"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="sales_schedule_and_journey_planning_software_section_5_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="sales_schedule_and_journey_planning_software_section_5_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>

  </>
)

const title = 'Consumer Packaged Good | Field Service Optimization Software'
const description = 'Equip your operations with the most advanced field service optimization software to maximize productivity of your field workforce with LogiNext. Setup a demo!'
const url = 'https://www.loginextsolutions.com/industries/consumer-package/sales-schedule-and-journey-planning-software'

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
  SalesScheduleAndJourneyPlanningSoftware as default,
  metadata
}
