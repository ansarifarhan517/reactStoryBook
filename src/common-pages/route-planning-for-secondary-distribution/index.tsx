import Image from 'next/image'

import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Parallax from '@/components/parallax'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/route-planning-for-secondry-distribution.webp'
import streamliningSecondaryDistribution from '/public/streamlining-secondary-distribution.webp'
import efficientResourceManagement from '/public/efficient-resource-management.webp'

import './style.scss'

const blk = 'route-planning-for-secondry-distribution'

const RoutePlanningForSecondryDistribution = () => (
  <>
    <div className={bemClass([blk, 'cover-section-bg'])} data-auto-id="route_planning_for_secondry_distribution_section_1" />
    <div className={bemClass([blk, 'cover-section'])}>
      <Container>
        <Text tag="h1" typography="xxxl" color="white" fontWeight="bold" dataAutoId="route_planning_for_secondry_distribution_section_1_text" >
          <>
            Route Planning in <br />
            Secondary Distribution
          </>
        </Text>
        <Text tag="p" color="white" className={bemClass([blk, 'cover-section-text'])} dataAutoId="route_planning_for_secondry_distribution_section_1_description" >
          <>
            Plan better delivery routes which reduce overall turnaround time for
            resources and ensure on-time deliveries.
          </>
        </Text>
        <ButtonGroup isCenter>
          <ModalTriggerButton
            modalType="talk-to-us"
            category="primary"
            size="large"
            dataAutoId="route_planning_for_secondry_distribution_section_1_ask_for_demo"
          >
            Ask for a demo
          </ModalTriggerButton>
          <ModalTriggerButton
            modalType="sign-up"
            category="primary"
            size="large"
            dataAutoId="route_planning_for_secondry_distribution_section_1_try_free"
          >
            try out free
          </ModalTriggerButton>
        </ButtonGroup>
        <Parallax offset={50}>
          <Image
            src={coverPageBanner}
            alt="Capacity Management in Primary Distribution"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="route_planning_for_secondry_distribution_section_1_image"
          />
        </Parallax>
      </Container>
    </div>
    <MidContentSection
      title="Efficient Route and Resource Planning"
      description={`Identify resource skill-sets in terms of local knowledge and affinity to
      assign the right orders to the right resources. Plan better routes to increase
      total on-time deliveries covered in a day.`}
      dataAutoId="route_planning_for_secondry_distribution_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton
          modalType="talk-to-us"
          category="primary"
          dataAutoId="route_planning_for_secondry_distribution_section_2_talk_to_us"
        >
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton
          modalType="sign-up"
          category="default"
          outline
          dataAutoId="route_planning_for_secondry_distribution_section_2_free_trail"
        >
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>

    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'automated-allocation',
          icon: 'large-field-automated-allocation-automated-dispatch',
          title: 'Automated Allocation',
          description: 'Assign right orders to the resource best suited to deliver them efficiently and on-time.'
        },
        {
          id: 'scan-in-scan-out',
          icon: 'large-mile-delivery-schedule-planning-fast-scan-in-and-scan-out',
          title: 'Scan-in Scan-Out',
          description: 'Easily scan-in and scan-out unit and crate items while loading and unloading respectively.'
        },
        {
          id: 'route-planning',
          icon: 'large-field-route-optimization-shorter-routes',
          title: 'Route Planning',
          description: 'Plan optimized routes for each delivery trip to reduce traffic or other detention and delays.'
        },
        {
          id: 'dynamic-eta-calculation',
          icon: 'large-field-web-dynamic-eta-calculation',
          title: 'Dynamic ETA Calculation',
          description: 'Showcase the exact time when each order would be delivered to all relevant stakeholders.'
        },
        {
          id: 'electronic-proof-of-delivery',
          icon: 'large-mile-delivery-validation-instant-delivery-status-capture',
          title: 'Electronic Proof of Delivery',
          description: 'Validate all deliveries digitally using images from in-app camera and e-sign mechanism.'
        },
        {
          id: 'error-free-invoicing',
          icon: 'large-field-automated-allocation-field-agent-empowerment',
          title: 'Error-free Invoicing',
          description: 'Ensure error-free invoicing by syncing validate invoices with the system in real-time.'
        }
      ]}
      dataAutoId="route_planning_for_secondry_distribution_section_3"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={streamliningSecondaryDistribution}
      imageAlt="Streamlining Secondary Distribution"
      dataAutoId="route_planning_for_secondry_distribution_section_4"
    >
      <ProductInformativeContent
        title="Streamlining Secondary Distribution"
        description={`Ensure high efficiency of all logistics movement within your
        secondary distribution with on-time deliveries as per preferred time windows and increased resource utilization.`}
        features={[{
          id: 'schedule-planning',
          title: 'Schedule Planning',
          description: `Plan schedules which cover all preferred delivery time-slots for
          retailers stores while increasing total deliveries fulfilled in a day. This
          would increase resource utilization and decrease turnaround time.`,
        }, {
          id: 'route-optimization',
          title: 'Route Optimization',
          description: `Optimize routes for all your vehicles to ensure on-time deliveries
          along with dynamically updated ETAs avoiding local traffic hassles. Shorter
          routes decrease total distance traveled and associated costs.`,
        }]}
        dataAutoId="route_planning_for_secondry_distribution_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_for_secondry_distribution_section_4_connect_with_expert" >
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="route_planning_for_secondry_distribution_section_4_sign_up_free" >
            Sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={efficientResourceManagement}
      imageAlt="Efficient Resource Management"
      dataAutoId="route_planning_for_secondry_distribution_section_5"
    >
      <ProductInformativeContent
        title="Efficient Resource Management"
        description={`Optimized resource management results in better-directed
        resources with improved performance, higher efficiency, and lower overall
        movement costs.`}
        features={[{
          id: 'smart-assignments',
          title: 'Smart Assignments',
          description: `Improve overall performance of resources, including drivers,
          delivery personnel, and vehicles by using smart assignments where each resource
          is given the order that it is best suited to efficiently fulfill.`,
        }, {
          id: 'reduced-costs',
          title: 'Reduced Costs',
          description: `Plan shorter and better routes while using the localized knowledge
          of drivers and delivery personnel to ensure efficient and on-time deliveries.
          Lesser distance traveled and resource time spent reduces overall costs.`,
        }]}
        dataAutoId="route_planning_for_secondry_distribution_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_for_secondry_distribution_section_5_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="route_planning_for_secondry_distribution_section_5_free_trail" >
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default RoutePlanningForSecondryDistribution
