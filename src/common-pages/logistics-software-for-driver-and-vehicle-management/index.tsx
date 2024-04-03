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

import { bemClass } from '@/utils'

import pageCoverBg from '/public/logistics-software-for-driver-and-vehicle-management.svg'
import coverPageBanner from '/public/boost-delivery-efficiency-and-performance.webp'
import autoAllocateToTheRightDeliveryAssociate from '/public/auto-allocate-to-the-right-delivery-associate.webp'
import completeRealTimeVisibilityOfDeliveryPerformance from '/public/complete-real-time-visibility-of-delivery-performance.webp'

import './style.scss'

const blk = 'logistics-software-for-driver-and-vehicle-management'

const LogisticsSoftwareForDriverAndVehicleManagement = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Boost delivery efficiency & performance"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="logistics_software_for_driver_and_vehicle_management_section_1"
    >
      <>
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Boost delivery efficiency & performance"
            description={`Get the most out of your delivery associate or vehicle by using their
            capacity, skill sets, and potential to the fullest.`}
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="logistics_software_for_driver_and_vehicle_management_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="logistics_software_for_driver_and_vehicle_management_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="logistics_software_for_driver_and_vehicle_management_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="Boost delivery efficiency & performance"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="logistics_software_for_driver_and_vehicle_management_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <MidContentSection
      title="Improve logistics movement multifold"
      description={`Create delivery schedules and route plans that don’t just optimize the time taken
      or distance traveled, but also the overall potential of all moving resources.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="logistics_software_for_driver_and_vehicle_management_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="logistics_software_for_driver_and_vehicle_management_section_2_talk_to_us" >
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="logistics_software_for_driver_and_vehicle_management_section_2_free_trail">
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>
    <div className={bemClass([blk, 'auto-allocate-to-the-right-delivery-associate-wrapper'])}>
      <ProductInformativeLayout
        hAlign="left"
        image={autoAllocateToTheRightDeliveryAssociate}
        imageAlt="Auto-allocate to the right delivery associate"
        className={bemClass([blk, 'auto-allocate-to-the-right-delivery-associate'])}
        dataAutoId="logistics_software_for_driver_and_vehicle_management_section_3"
      >
        <ProductInformativeContent
          title="Auto-allocate to the right delivery associate"
          description={`System runs intricate planning algorithms to find which delivery associate
          or vehicle is best suited to carry the type and volume of any delivery.`}
          features={[{
            id: 'map-the-skill-sets-of-delivery-associate-to-orders',
            title: 'Map the skill-sets of delivery associate to orders',
            description: `Know which delivery associate knows the destination area the best and is
            better suited than others to deliver a particular order in a specific area. Auto-allocate
            to that delivery associate to increase overall efficiency.`,
          }, {
            id: 'select-the-right-vehicle-for-each-delivery',
            title: 'Select the right vehicle for each delivery',
            description: `Ensure orders are assigned to the best-suited vehicle, in terms of order
            requirements. Use your vehicles time and capacity properly to get make their movement
            more profitable for each delivery.`,
          }]}
          dataAutoId="logistics_software_for_driver_and_vehicle_management_section_3_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="logistics_software_for_driver_and_vehicle_management_section_3_request_demo">
              Requst a demo
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="logistics_software_for_driver_and_vehicle_management_section_3_free_trail">
              14 days free trial
            </ModalTriggerButton>
          </ButtonGroup>
        </ProductInformativeContent>
      </ProductInformativeLayout>
    </div>
    <ProductInformativeLayout
      hAlign="right"
      image={completeRealTimeVisibilityOfDeliveryPerformance}
      imageAlt="Complete real-time visibility of delivery performance"
      dataAutoId="logistics_software_for_driver_and_vehicle_management_section_4"
    >
      <ProductInformativeContent
        title="Complete real-time visibility of delivery performance"
        description={`With easy user experience and map interface, managers can track the
        performance of all delivery associates and vehicles right from a single dashboard.`}
        features={[{
          id: 'track-the-availability-and-location-of-each-resource',
          title: 'Track the availability and location of each resource',
          description: `Know where your delivery associates and vehicles are at all times.
          Auto-allocate incoming pickups to available delivery associates nearest to the location.
          Track the delivery status on each trip to know if the associates are performing well.`,
        }, {
          id: 'track-the-behavior-of-on-ground-associates-and-drivers',
          title: 'Track the behavior of on-ground associates & drivers',
          description: `Get instant alerts whenever an SLA is breached, or a delivery associate is
          delayed beyond reasonable limits. This gives complete visibility over all on-ground
          movement, along with immediate notifications for timely actions.`,
        }]}
        dataAutoId="logistics_software_for_driver_and_vehicle_management_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="logistics_software_for_driver_and_vehicle_management_section_4_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="logistics_software_for_driver_and_vehicle_management_section_4_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default LogisticsSoftwareForDriverAndVehicleManagement
