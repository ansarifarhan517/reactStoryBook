import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import Parallax from '@/components/parallax'
import ContentOverlapLayout from '@/components/content-overlap-layout'
import Text from '@/components/text'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/cold-chain-logistics-management-software.svg'
import coverPageBanner from '/public/cold-chain-logistics-optimization.webp'
import analyzeLiveDriverBehavior from '/public/analyze-live-driver-behavior.webp'
import deliveryShipmentPlanningAndScheduling from '/public/delivery-shipment-planning-and-scheduling.webp'
import creatingAnAgileAndResponsiveSystem from '/public/creating-an-agile-and-responsive-system.webp'

import './style.scss'

const blk = 'cold-chain-logistics-management-software'


const ColdChainLogisticsManagementSoftware = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Cold Chain Logistics Optimization"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="cold_chain_logistics_management_software_section_1"
    >
      <>
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Cold Chain Logistics Optimization"
            description={`Sustain top-quality of your products and shipments through short well-planned
            routes and live movement and temperature tracking.`}
            fluid
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="cold_chain_logistics_management_software_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="cold_chain_logistics_management_software_section_1_ask_for_demo" >
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="cold_chain_logistics_management_software_section_1_try_free" >
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="Cold Chain Logistics Optimization"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="cold_chain_logistics_management_software_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <ConfigurationSection
      title="Live Tracking and Notifications"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="gray-dark"
      data={[{
        id: 'real-time-temperature-tracking',
        icon: 'small-haul-voice-schedule-route-planning-plan-optimized-schedules',
        title: 'Real-time temperature tracking',
        description: 'Track real-time shipment temperature from the first loading to final unloading.'
      }, {
        id: 'get-instant-alerts-and-notifications',
        icon: 'small-on-demand-instant-alerts-and-notifications',
        title: 'Get instant alerts & notifications',
        description: 'Get notified immediately about all low & high-priority on-ground events.'
      }, {
        id: 'dynamic-eta-calculation',
        icon: 'small-field-field-workforce-schedule-planning-optimal-service-time',
        title: 'Dynamic ETA calculation',
        description: 'Calculate ETAs of all moving vehicles to know exactly when deliveries will happen.'
      }, {
        id: 'shipment-quality-tracking',
        icon: 'small-mile-live-tracking-on-time-deliveries',
        title: 'Shipment quality tracking',
        description: 'Know the shipment quality by tracking in-transit conditions as per preset requirements.'
      }, {
        id: 'instant-delivery-validation',
        icon: 'small-field-field-workforce-schedule-planning-unique-schedules',
        title: 'Instant delivery validation',
        description: 'Authenticate safe and proper delivery of all items at the destination hubs or stores.'
      }, {
        id: 'voice-controlled-logistics',
        icon: 'small-on-demand-voice-enabled-interface',
        title: 'Voice controlled logistics',
        description: 'Track and control your cold-chain movement just by talking to the system.'
      }]}
      dataAutoId="cold_chain_logistics_management_software_section_2"
    />
    <ContentOverlapLayout
      image={analyzeLiveDriverBehavior}
      title="Analyze live driver behavior"
      description={`Track exactly how your driver moves about with the shipment. Whether they
      are speeding, maintaining shipment’s temperature, deviating from planned routes, etc.`}
      blogUrl="https://www.loginextsolutions.com/blog/do-you-have-multi-compartment-vehicles-we-got-your-back/"
      dataAutoId="cold_chain_logistics_management_software_section_3"
    >
      <ButtonGroup>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="cold_chain_logistics_management_software_section_3_talk_to_us" >
        talk to us
        </ModalTriggerButton>
        <ModalTriggerButton outline modalType="sign-up" category="default" dataAutoId="cold_chain_logistics_management_software_section_3_sign_up" >
        14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </ContentOverlapLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={deliveryShipmentPlanningAndScheduling}
      imageAlt="Delivery shipment planning and scheduling"
      widthBg
      className={bemClass([blk, 'product-info'])}
      dataAutoId="cold_chain_logistics_management_software_section_4"
    >
      <ProductInformativeContent
        title="Delivery shipment planning and scheduling"
        description={`Plan your entire cold chain movement from hub to distribution center or
        store, moving more load along risk-free routes avoiding traffic.`}
        features={[{
          id: 'skill-set-mapping-for-driver-and-vehicle',
          title: 'Skill-set mapping for driver and vehicle',
          description: `Assign the right shipment to the right temperature-controlled vehicle
          with the delivery associate or driver best-suited to handle the requirements of loading
          and unloading of the shipment.`,
        }, {
          id: 'shorter-routes-and-delivery-times',
          title: 'Shorter routes and delivery times',
          description: `Ensure that all your ETAs are met while moving through the shortest possible
          route, cutting down on travel time by avoiding traffic-prone areas, and reducing the
          overall lead time required to fulfill the delivery.`,
        }]}
        dataAutoId="cold_chain_logistics_management_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="cold_chain_logistics_management_software_section_4_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="cold_chain_logistics_management_software_section_4_sign_up_trail" >
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <MidContentSection
      title="Creating an agile and responsive system"
      description={`Ensure high SLA compliance get instant alerts whenever there is a delay or
      when the cold-chain movement is interrupted.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="cold_chain_logistics_management_software_section_5"
    >
      <>
        <Text tag="span" typography="l" dataAutoId="cold_chain_logistics_management_software_section_5_title_1" >
          All cold chain logistics in one dashboard
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'mid-section-text'])} dataAutoId="cold_chain_logistics_management_software_section_5_descritption_1" >
          Track and manage all temperature-controlled logistics movement from an intuitive map
          interface in a single dashboard. Check the live delivery status and shipment condition
          by just clicking on the delivery vehicle.
        </Text>
        <Text tag="span" typography="l" dataAutoId="cold_chain_logistics_management_software_section_5_title_2" >
          Reacting to scenarios much faster
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'mid-section-text'])} dataAutoId="cold_chain_logistics_management_software_section_5_description_2" >
          Ensure quality control over all moving shipments by gaining the ability to react on
          situations faster. Get alerted instantly when the vehicle malfunctions or shipment is
          detained and take fast corrective actions.
        </Text>
        <ButtonGroup isCenter>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="cold_chain_logistics_management_software_section_5_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="cold_chain_logistics_management_software_section_5_sign_up_free">
            sign up fo free
          </ModalTriggerButton>
        </ButtonGroup>
      </>
    </MidContentSection>

    <Container className={bemClass([blk, 'bottom-image-wrapper'])} dataAutoId="cold_chain_logistics_management_software_section_6">
      <Parallax>
        <Image
          src={creatingAnAgileAndResponsiveSystem}
          alt="Creating an agile and responsive system"
          className={bemClass([blk, 'bottom-image'])}
          data-auto-id="cold_chain_logistics_management_software_section_6_image"
        />
      </Parallax>
    </Container>
  </>
)

export default ColdChainLogisticsManagementSoftware
