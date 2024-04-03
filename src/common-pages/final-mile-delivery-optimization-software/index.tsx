import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import Parallax from '@/components/parallax'
import Text from '@/components/text'
import ConfigurationSection from '@/components/configuration-section'
import SectionTitle from '@/components/section-title'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/final-mile-delivery-optimization-software.svg'
import coverPageBanner from '/public/last-mile-delivery.webp'
import capturingDeliveryValidationAndFeedback from '/public/capturing-delivery-validation-and-feedback.webp'

import './style.scss'

const blk = 'final-mile-delivery-optimization-software'

const FinalMileMeliveryOptimizationSoftware = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Ensure last mile deliveries happen on-time and with maximum capacity utilization using a last mile delivery software."
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="final_mile_delivery_optimization_software_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Last Mile Delivery Software"
          description={`Ensure your last or final mile delivery happens perfectly on-time as you use
          your current resource capacity to the fullest.`}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="final_mile_delivery_optimization_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="final_mile_delivery_optimization_software_section_1_ask_for_demo" >
              Ask for a demo
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="final_mile_delivery_optimization_software_section_1_try_free" >
              Try out free
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Last Mile Delivery"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="final_mile_delivery_optimization_software_section_1_image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <Container>
      <ProductInformativeContent
        title="Plan short and fast routes for all deliveries"
        description={`Your delivery associates should spend less time traveling and more time fulfilling
        deliveries for the customers, boosting overall productivity.`}
        features={[{
          id: 'Design the best delivery schedules for all trips',
          title: 'Design the best delivery schedules for all trips',
          description: `Make your last mile movement more efficient with perfect delivery schedules
          factoring in maximum possible real-world constraints; right from allocating each delivery
          to the ideal associate, to fulfilling special conditions for each delivery.`,
        }, {
          id: 'beat-the-traffic-each-time-with-perfect-route-planning',
          title: 'Beat the traffic each time with perfect route planning',
          description: `Don\'t let traffic be a reason for your delivery delays. Plan your trips along
          the lest traffic, even before your delivery associates hit the ground. With an ideal last mile delivery software,
          dynamically reroute trips when needed with live traffic analysis.`,
        }]}
        className={bemClass([blk, 'plan-short-fast-route'])}
        dataAutoId="final_mile_delivery_optimization_software_section_2_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="final_mile_delivery_optimization_software_section_2_request_demo" >
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="final_mile_delivery_optimization_software_section_2_free_trail" >
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </Container>
    <ConfigurationSection
      title="Keep your on-time delivery promise"
      iconAlign="left-top"
      iconColor="white"
      textColor="gray-dark"
      iconType="circular"
      iconBorder="white"
      iconSize="sm"
      iconBackground="gray-dark"
      className={bemClass([blk, 'config-section'])}
      data={[{
        id: 'live-tracking',
        icon: 'small-mile-live-tracking-dynamic-rerouting',
        title: 'Live Tracking',
        description: 'Track delivery associates as they move in real-time, all from a single dashboard.'
      }, {
        id: 'dynamic-eta-prediction',
        icon: 'small-mile-live-tracking-dynamically-updated-etas',
        title: 'Dynamic ETA prediction',
        description: 'Predict accurate ETAs for each delivery and instantly update ETAs when required.'
      }, {
        id: 'preferred-time-deliveries',
        icon: 'small-field-field-workforce-schedule-planning-preferred-time-slots',
        title: 'Preferred time deliveries',
        description: 'Know exactly when a customer wants a delivery, and make it happen precisely then.'
      }, {
        id: 'instant-delivery-updates',
        icon: 'small-mile-live-tracking-delivery-status-updates',
        title: 'Instant delivery updates',
        description: 'Tell your customers guessing, give them instant updates about their delivery.'
      }, {
        id: 'automated-pickup-allocation',
        icon: 'small-on-demand-faster-pickups',
        title: 'Automated pickup allocation',
        description: 'Auto-allocate incoming pickups to the nearest associate without delaying other deliveries.'
      }, {
        id: 'live-chat-and-notifications',
        icon: 'small-on-demand-instant-alerts-and-notifications',
        title: 'Live chat and notifications',
        description: 'Chat with on-ground associates and receive notifications about each event as it happens.'
      }]}
      dataAutoId="final_mile_delivery_optimization_software_section_3_features"
    />
    <div className={bemClass([blk, 'deliver-more-wrapper'])} data-auto-id="final_mile_delivery_optimization_software_section_4" >
      <Container className={bemClass([blk, 'deliver-more-container'])}>
        <div className={bemClass([blk, 'deliver-more-box'])}>
          <SectionTitle
            category="secondary"
            borderPosition="left"
            color="white"
            fontWeight="thin"
            className={bemClass([blk, 'deliver-more-title'])}
            dataAutoId="final_mile_delivery_optimization_software_section_4_title"
          >
            Deliver more with less
          </SectionTitle>
          <Text tag="p" color="white" dataAutoId="final_mile_delivery_optimization_software_section_4_description" >
            Utilize your delivery associate time and vehicle capacity in a smart way.
            Make more on-time deliveries with higher efficiency using lesser resources at a lesser cost.
          </Text>
        </div>
      </Container>
    </div>

    <ProductInformativeLayout
      hAlign="right"
      image={capturingDeliveryValidationAndFeedback}
      imageAlt="Capture delivery validation and feedback using a robust last mile delivery software."
      dataAutoId="final_mile_delivery_optimization_software_section_5"
    >
      <ProductInformativeContent
        title="Capturing delivery validation and feedback"
        description={`Reduce errors and inconsistencies across all successful deliveries with
        precise robust delivery validation and feedback capture.`}
        features={[{
          id: 'authenticate-deliveries-in-a-secure-way',
          title: 'Authenticate deliveries in a secure way',
          description: `Finish each delivery in the perfect way. Validate deliveries using in-app
          image and sign capture, syncing it instantly with your central system. Get the comfort of
          error-free invoicing with each delivery.`,
        }, {
          id: 'capture-fresh-customer-feedback',
          title: 'Capture fresh customer feedback',
          description: `Get to know what your customer\'s thoughts are when they are fresh, at the moment
          when you make your delivery with a seamless last mile delivery software.
          Find out new market insights or potential areas of improvement with this leak-free feedback loop.`,
        }]}
        dataAutoId="final_mile_delivery_optimization_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="final_mile_delivery_optimization_software_section_5_connect_with_expert" >
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="final_mile_delivery_optimization_software_section_5_sign_up_free" >
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default FinalMileMeliveryOptimizationSoftware

