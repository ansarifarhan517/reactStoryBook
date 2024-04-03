import { Metadata } from 'next'
import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Container from '@/components/container'
import Parallax from '@/components/parallax'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/first-mile-pickup-optimization-software.svg'
import coverPageBanner from '/public/first-mile-pickup-and-optimization.webp'
import getInmultiplePickupsQuicklyToYourDepot from '/public/get-in-multiple-pickups-quickly-to-your-depot.webp'
import autoAllocationOfPickupsToRightDeliveryAssociate from '/public/auto-allocation-of-pickups-to-right-delivery-associate.webp'
import captureInstantCustomerFeedback from '/public/capture-instant-customer-feedback.webp'

import './style.scss'

const blk = 'first-mile-pickup-optimization-software'

const FirstMilePickupOptimizationSoftware = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="First Mile Pickup and Optimization"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="first_mile_pickup_optimization_software_section_1"
    >
      <>
        <div className={bemClass([blk, 'cover-bottom'])} />
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="First Mile Pickup and Optimization"
            description={`Streamline your pickup movement from source to depot. Increase your delivery
            associate or courier utilization while keeping costs down and productivity, high.`}
            fluid
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="first_mile_pickup_optimization_software_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="first_mile_pickup_optimization_software_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="first_mile_pickup_optimization_software_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="First Mile Pickup and Optimization"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="first_mile_pickup_optimization_software_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <ProductInformativeLayout
      hAlign="right"
      image={getInmultiplePickupsQuicklyToYourDepot}
      imageAlt="Get in multiple pickups quickly to your depot"
      className={bemClass([blk, 'product-info'])}
      dataAutoId="first_mile_pickup_optimization_software_section_2"
    >
      <ProductInformativeContent
        title="Get in multiple pickups quickly to your depot"
        description={`With high volume of pickups coming in, bring them into depots in a streamlined
        and efficient manner with well-planned pickup schedules.`}
        features={[{
          id: 'short-and-fast-routes-back-to-depot',
          title: 'Short and fast routes back to depot',
          description: `Guide your delivery associates or couriers along the shortest and
          fastest routes to the depot avoiding local traffic and delays. Increase pickups
          along each route to shorten the overall delivery times.`,
        }, {
          id: 'full-tracking-visibility-with-precise-etas',
          title: 'Full tracking visibility with precise ETAs',
          description: `Track each package from the point they are picked up to the point they are
          brought into the depot. Work with precise ETAs at each point and keep the customer informed
          with timely notifications and alerts.`,
        }]}
        dataAutoId="first_mile_pickup_optimization_software_section_2"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="first_mile_pickup_optimization_software_section_2_get_in_touch">
            get in touch
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="first_mile_pickup_optimization_software_section_2_sign_up_trail">
            sign up for trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={autoAllocationOfPickupsToRightDeliveryAssociate}
      imageAlt="Auto-allocation of pickups to right delivery associate"
      className={bemClass([blk, 'auto-allocation'])}
      dataAutoId="first_mile_pickup_optimization_software_section_3"
    >
      <ProductInformativeContent
        title="Auto-allocation of pickups to right delivery associate"
        description={`Allocate all incoming pickups, planned or ad-hoc to the perfect delivery associate
        or courier, best-suited to satisfactorily fulfill the request on-time.`}
        features={[{
          id: 'high-utilization-for-all-delivery-associates',
          title: 'High utilization for all delivery associates',
          description: `Allocate pickups based on available/idle capacity of each delivery associate
          and vehicle on-ground.`,
        }, {
          id: 'lower-costs-of-package-movement-in-the-first-mile',
          title: 'Lower costs of package movement in the first mile',
          description: `Reduce the overall costs of package movement with lesser distance traveled and
          more pickups collected per trip.`,
        }]}
        dataAutoId="first_mile_pickup_optimization_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="first_mile_pickup_optimization_software_section_3_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="first_mile_pickup_optimization_software_section_3_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={captureInstantCustomerFeedback}
      imageAlt="Optimize all pick and pack movement"
      dataAutoId="first_mile_pickup_optimization_software_section_4"
    >
      <ProductInformativeContent
        title="Optimize all pick and pack movement"
        description={`Bring in efficiency with all your pick and pack movement to better cater
        to e-commerce and related industries.`}
        features={[{
          id: 'pickup-from-source-and-deliver-direct-to-customer',
          title: 'Pickup from source and deliver direct to customer',
          description: `Make intracity same day deliveries by picking up from source and delivering
          directly to customer. Use manual or auto-assignment of pickup-drop requests and fulfill them
          within a single journey by intelligently rerouting active trips.`,
        }, {
          id: 'faster-turnaround-time-for-all-active-trips',
          title: 'Faster turnaround time for all active trips',
          description: `Keep all the ETAs precise with auto-recalculation when ad-hoc pickups are added in.
          Bring down the total turnaround time for all trips by moving through traffic-free and optimized
          routes. Make more pickups in lesser time.`,
        }]}
        dataAutoId="first_mile_pickup_optimization_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="first_mile_pickup_optimization_software_section_4_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="first_mile_pickup_optimization_software_section_4_sign_up">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Courier Express Parcel | First Mile Pickup and Optimization'
const description = `Optimize First Mile Pickup Operations with Loginext Solutions -
Streamline your logistics with our powerful software. Enhance efficiency, reduce costs,
and improve customer satisfaction. Explore now!`
const url = 'https://www.loginextsolutions.com/industries/couriers-express-parcels/first-mile-pickup-optimization-software'

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
  FirstMilePickupOptimizationSoftware as default,
  metadata
}
