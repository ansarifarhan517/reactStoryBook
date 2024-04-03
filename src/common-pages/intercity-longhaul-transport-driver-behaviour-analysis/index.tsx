import Image from 'next/image'

import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import Parallax from '@/components/parallax'
import Text from '@/components/text'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/driver-behavior-analysis.webp'
import driverPerformanceManagement from '/public/driver-performance-management.webp'
import slaCompliantMovement from '/public/sla-compliant-movement.webp'

import './style.scss'

const blk = 'intercity-longhaul-transport-driver-behaviour-analysis'

const IntercityLonghaulTransportDriverBehaviourAnalysis = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])} data-auto-id="intercity_longhaul_transport_driver_behaviour_analysis_section_1">
      <Container dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_1_content">
        <Text tag="h1" typography="xxxl" color="white" fontWeight="bold" className="slide-fade-in-delay-1"
          dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_1_title"
        >
          Driver Behavior Analysis
        </Text>
        <Text tag="p" color="white" className={bemClass([blk, 'cover-section-text slide-fade-in-delay-1'])}
          dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_1_description"
        >
          Track driver behavior in real-time covering speeding, deviation
          from planned routes, or detention.
        </Text>
        <ModalTriggerButton
          modalType="talk-to-us"
          category="primary"
          size="large"
          className="slide-fade-in-delay-1"
          dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_1_try_free"
        >
          try out free
        </ModalTriggerButton>
      </Container>
      <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
        <Image
          src={coverPageBanner}
          alt="Easily Plan Shipment Schedules and Routes"
          className={bemClass([blk, 'image'])}
          loading="eager"
          data-auto-id="intercity_longhaul_transport_driver_behaviour_analysis_section_1_image"
        />
      </Parallax>
    </div>
    <MidContentSection
      className={bemClass([blk, 'mid-section'])}
      title="Analyze Driver Behavior Patterns"
      description={` Understand how each driver performs on an active trip by tracking each activity and its
      impact on the final delivery. Identify bottlenecks or compliance breaches and fix them
      beforehand.`}
      dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_2"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_2_learn_more">
          Learn more
      </ModalTriggerButton>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'speed-visualization',
          icon: 'large-haul-driver-behavior-analysis-speed-visualization',
          title: 'Speed Visualization',
          description: 'Know the speed of the driver at all points in a trip with a color-coded and interactive map interface.'
        },
        {
          id: 'detention-alerts',
          icon: 'large-haul-driver-behavior-analysis-detention-alerts',
          title: 'Detention Alerts',
          description: 'Increase logistics movement responsiveness and agility with instant alerts whenever the driver is detained.'
        },
        {
          id: 'shipment-safety',
          icon: 'large-haul-driver-behavior-analysis-shipment-safety',
          title: 'Shipment Safety',
          description: 'Track the temperature reading of the merchandise along with the vehicle speed to sustain safety and quality.'
        }
      ]}
      dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_2_features"
    />
    <ProductInformativeLayout
      hAlign="right"
      image={driverPerformanceManagement}
      imageAlt="Driver Performance Management"
      widthBg
      dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_3"
    >
      <ProductInformativeContent
        title="Driver Performance Management"
        description={`Identify the top performing drivers while assessing their skill-sets in
        relation to the type of vehicle, reefer, combination or semi-truck, flatbed, etc.`}
        features={[{
          id: 'hours-of-service-tracking',
          title: 'Hours of Service Tracking',
          description: `Track driver behavior patterns such as hours of service and breaks to
          comply with different laws and to ensure shipment safety by planning for all breaks and
          rest-stops within the original route.`,
        }, {
          id: 'in-transit-risk-assessment',
          title: 'In-transit Risk Assessment',
          description: `Aligning the performance history of the driver with the live behavior tracking
          to understand the current risk factor of each route to avoid tiredness, accidents, pilferage,
          and other such incidents.`,
        }]}
        dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_3_content"
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_3_learn_more">
          Learn more
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={slaCompliantMovement}
      imageAlt="SLA Compliant Movement"
      dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_4"
    >
      <ProductInformativeContent
        title="SLA Compliant Movement"
        description={`Track all drivers in real-time to ensure compliance with all service level
        agreements with clear and instant notifications in case of any SLA breach giving ample
        reaction time.`}
        features={[{
          id: 'sla-compliant-movement-list',
          isFeatureList: true,
          list: [{
            id: 'track-slas',
            icon: 'small-field-field-workforce-schedule-planning-unique-schedules',
            label: 'Track SLAs',
          },
          {
            id: 'ensure-compliance',
            icon: 'small-field-field-workforce-schedule-planning-multiple-choices-in-plans',
            label: 'Ensure Compliance',
          },
          {
            id: 'respond-to-breach',
            icon: 'small-mile-live-tracking-seamless-dispatch',
            label: ' Respond to Breach',
          },
          {
            id: 'improve-processes',
            icon: 'small-mile-live-tracking-delivery-status-updates',
            label: 'Improve Processes',
          }]
        }, {
          id: 'effective-material-handling',
          title: 'Effective Material Handling',
          description: `Make sure drivers are skilled or trained in loading, unloading, and transport
          of Hazmat or sensitive shipments from dispatch to final delivery.`,
        }, {
          id: 'track-route-deviations',
          title: 'Track Route Deviations',
          description: `Direct drivers through planned routes optimized for traffic and local weather
          and receive instant notifications in case of any deviation.`,
        }]}
        dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_4_content"
      >
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_4_learn_more">
          Learn more
        </ModalTriggerButton>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      title="Direct Driver Behavior to Suit Your Needs"
      iconAlign="left-top"
      iconType="circular"
      iconBorder="primary"
      iconBackground="primary"
      iconColor="white"
      iconSize="sm"
      widthBg
      data={[
        {
          id: 'eld-alignment',
          icon: 'small-haul-driver-behavior-analysis-eld-alignment',
          title: 'ELD Alignment',
          description: 'Align your operations with electronic logging devices and become compliant.'
        },
        {
          id: 'performance-mapping',
          icon: 'small-haul-driver-behavior-performance-mapping',
          title: 'Performance Mapping',
          description: 'Compare historical performances of different drivers from a single dashboard.'
        },
        {
          id: 'skillset-matching',
          icon: 'small-haul-driver-behavior-skillset-matching',
          title: 'Skillset Matching',
          description: 'Match skillsets of each driver with specific vehicles, routes, and shipment types.'
        },
        {
          id: 'risk-measurement',
          icon: 'small-haul-driver-behavior--risk-measurement',
          title: 'Risk Measurement',
          description: 'Plan for contingencies by assessing the risk of each route using historical analytics.'
        },
        {
          id: 'point-of-interest-mapping',
          icon: 'small-haul-driver-behavior--point-of-interest-mapping',
          title: 'Point-of-Interest Mapping',
          description: 'View all relevant points-of-interests along the route including emergency services.'
        },
        {
          id: 'safe-journeys',
          icon: 'small-haul-driver-behavior--safe-journeys',
          title: 'Safe Journeys',
          description: 'Ensure safe, event-free, compliant, and well-timed journeys for all your shipments.'
        }
      ]}
      dataAutoId="intercity_longhaul_transport_driver_behaviour_analysis_section_5"
    />
  </>
)

export default IntercityLonghaulTransportDriverBehaviourAnalysis
