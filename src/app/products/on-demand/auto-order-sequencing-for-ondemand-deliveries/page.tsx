import { Metadata } from 'next'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import Container from '@/components/container'

import { bemClass } from '@/utils'

import getAheadWithOrderPlanning from '/public/get-ahead-with-order-planning.webp'
import territoryBasedSchedulingAndAllocation from '/public/territory-based-scheduling-and-allocation.webp'
import shorterRoutesWithMoreOrders from '/public/shorter-routes-with-more-orders.webp'

import './style.scss'

const blk = 'auto-order-sequencing-for-ondemand-deliveries'

const AutoOrderSequencingForOnDemandDeliveries = () => (
  <>
    <div className={blk}>
      <Container>
        <PageCoverSectionContent
          title="Create Intelligent Order Schedules"
          description="Plan the schedule of your pickups and deliveries to perfection while saving on resource time and travel distance."
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_1_request_demo">
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup" dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_1_try_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </Container>
      <div className={bemClass([blk, 'cover-right'])} />
      <div className={bemClass([blk, 'cover-left'])} />
      <div className={bemClass([blk, 'strip', ['one']])} />
      <div className={bemClass([blk, 'strip', ['two']])} />
    </div>
    <ProductInformativeLayout
      hAlign="left"
      loading="eager"
      image={getAheadWithOrderPlanning}
      imageAlt="Get Ahead with Order Planning"
      className={bemClass([blk, 'order-planning'])}
      dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_2"
    >
      <ProductInformativeContent
        title="Get Ahead with Order Planning"
        description={`Take on a higher volume of orders to grow your business.
        Serve all pickups and deliveries, on-time, with clear order planning and
        sequencing using lesser drivers and vehicles than before.`}
        features={[{
          id: 'faster-deliveries',
          title: 'Faster Deliveries',
          description: `Make fast deliveries to all customers with machine learning enabled
          order sequencing and scheduling.`,
        }, {
          id: 'lesser-travel-distance',
          title: 'Lesser Travel Distance',
          description: `Plan shorter routes factoring in local traffic conditions covering all
          incoming and outgoing orders.`,
        }, {
          id: 'higher-orders-per-trip',
          title: 'Higher Orders per Trip',
          description: `Satisfactorily complete on-time deliveries for more orders in each trip
          with high-end schedule planning.`,
        }]}
        dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_2_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_2_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_2_free_trail">
              start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      image={territoryBasedSchedulingAndAllocation}
      imageAlt="Territory Based Scheduling and Allocation"
      widthBg
      dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_3"
    >
      <ProductInformativeContent
        title="Territory Based Scheduling and Allocation"
        description={`Define territories based on the volume of orders coming in, optimal
        turnaround time for trips (back to origin), order load balancing across drivers, etc.`}
        features={[{
          id: 'know-the-exact-addresses-of-delivery-locations',
          title: 'Know the Exact Addresses of Delivery Locations',
          description: `Use machine learning to fix incomplete or erroneous addresses so that
          drivers don’t waste time searching for them. With accurate addresses the average delivery
          time significantly reduces.`,
        }, {
          id: 'know-your-deliverable-areas-better',
          title: 'Know Your Deliverable Areas Better',
          description: `Create virtual demarcations in interactive and intuitive maps to understand
          the local area dynamics such as traffic, incoming order density, average delivery time, etc.
          and assign the right driver to that area.`,
        }]}
        dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_3_request_demo">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_3_free_trail">
              14 days trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={shorterRoutesWithMoreOrders}
      imageAlt="Shorter Routes with More Orders"
      dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_4"
    >
      <ProductInformativeContent
        title="Shorter Routes with More Orders"
        description={`Make more on-time pickups and deliveries per trip by scheduling
        them to perfection along short and fast routes.`}
        features={[{
          id: 'increase-driver-movement-efficiency',
          title: 'Increase Driver Movement Efficiency',
          description: `Increase the overall efficiency of all drivers by directing them to more
          successful deliveries in a single trip within areas where they know the routes and
          addresses better.`,
        }, {
          id: 'reduce-order-movement-costs',
          title: 'Reduce Order Movement Costs',
          description: `Increase total orders processed while traveling lesser distance and quicker
          turnaround time, increasing the utilization of your drivers and vehicles, bringing down the
          overall cost of order movement.`,
        }]}
        dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_4_talk_to_us" >
            Talk to us
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="auto_order_sequencing_for_ondemand_deliveries_section_4_free_trail">
              Start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext On-Demand | Auto Order Sequencing | Order Planning'
const description = 'LogiNext helps clients with a smart on-demand delivery management software for auto order allocation based on drivers location and distance. Contact us now!'
const url = 'https://www.loginextsolutions.com/products/on-demand/auto-order-sequencing-for-ondemand-deliveries'

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
  AutoOrderSequencingForOnDemandDeliveries as default,
  metadata
}

