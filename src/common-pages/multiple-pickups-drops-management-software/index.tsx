import Image from 'next/image'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import Container from '@/components/container'
import ModalTriggerButton from '@/components/modal-trigger-button'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'
import ProductInformativeLayout from '@/components/product-informative-layout'
import Text from '@/components/text'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import planDeliverySchedulesAndRoutes from '/public/plan-delivery-schedules-and-routes.webp'
import liveTrackingAndNotifications from '/public/live-tracking-and-notifications.webp'
import automatedPickupsAndDropsTransparentBg from '/public/automated-pickups-and-drops-transparent-bg.svg'

import './style.scss'

const blk = 'multiple-pickups-drops-management-software'

const MultiplePickupsDropsManagementSoftware = () => (
  <>
    <div className={blk}>
      <Container className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Automated Pickups and Drops"
          description="Plan and automate the allocation and dispatch of all pickups and drops within a single interface."
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="multiple_pickups_drops_management_software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton
              modalType="talk-to-us"
              category="primary"
              size="large"
              dataAutoId="multiple_pickups_drops_management_software_section_1_request_demo"
            >
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup" dataAutoId="multiple_pickups_drops_management_software_section_1_try_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
        <div className={bemClass([blk,'animation-container'])}>
          <AnimatedCoverPage
            animationPath="/animation-data/pickup-drop-automation.json"
            delay={6000}
            hideOnMobile
            className={bemClass([blk, 'animation'])}
          />
        </div>
      </Container>
      <div className={bemClass([blk, 'cover-bg'])}>
        <Image
          src={automatedPickupsAndDropsTransparentBg}
          fill
          alt=""
          className={bemClass([blk, 'cover-bg-img'])}
          data-auto-id="multiple_pickups_drops_management_software_section_1_cover_bg_img"
        />
      </div>
    </div>
    <MidContentSection
      title="Bring in Consistency with Automated Allocation"
      description={`On-demand delivery management requires speedy and precise allocation of pickups and
        drops to the right driver at the right time, planned around the perfect route to ensure
        on-time deliveries.`}
      dataAutoId="multiple_pickups_drops_management_software_section_2"
    />
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'driver-mapping',
          icon: 'large-on-demand-automated-pickup-and-drop-delivery-associate-mapping',
          title: 'Driver Mapping',
          description:
              'Know capacities / skill-sets of driver and map them to their preferred territories.',
        },
        {
          id: 'easy-order-allocation',
          icon: 'large-on-demand-automated-pickup-and-drop-easy-order-allocation',
          title: 'Easy Order Allocation',
          description:
              'Just automate the allocation of incoming orders and pickup requests to the best-suited driver.',
        },
        {
          id: 'fast-order-dispatch',
          icon: 'large-on-demand-automated-pickup-and-drop-fast-order-dispatch',
          title: 'Fast Order Dispatch',
          description:
              'Ensure fast deliveries by dispatching associates on-time with the right order delivery sequence.',
        },
      ]}
      dataAutoId="multiple_pickups_drops_management_software_section_2_features"
    />
    <div className={bemClass([blk, 'get-in-touch'])}>
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="multiple_pickups_drops_management_software_section_2_get_in_touch">
          Get in touch
      </ModalTriggerButton>
    </div>
    <ProductInformativeLayout
      hAlign="right"
      image={planDeliverySchedulesAndRoutes}
      imageAlt="Plan Delivery Schedules and Routes"

      dataAutoId="multiple_pickups_drops_management_software_section_3"
      className={bemClass([blk,'plan-delivery-schedules-and-routes'])}
    >
      <ProductInformativeContent
        title="Plan Delivery Schedules and Routes"
        description={`Create schedules that ensure on-time deliveries for all orders while
          planning efficient traffic-free routes for easy and fast movement.`}
        features={[
          {
            id: 'efficient-delivery-scheduling',
            title: 'Efficient Delivery Scheduling',
            description: `Plan delivery schedules which cover all incoming and outgoing orders,
            as and when they come in. Ensure high customer satisfaction when all your pickups and
            deliveries happen on the time you had promised.`,
          },
          {
            id: 'dynamic-route-planning',
            title: 'Dynamic Route Planning',
            description: `Avoid delays and traffic by planning routes which cover all planned and
            ad-hoc orders while traveling shorter distances. Increase delivery movement efficiency
            with lower overheads.`,
          },
        ]}
        dataAutoId="multiple_pickups_drops_management_software_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="multiple_pickups_drops_management_software_section_3_connect_with_expert">
              Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="multiple_pickups_drops_management_software_section_3_free_trail">
                start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>

    <Text
      tag="div"
      typography="xxl"
      fontWeight="thin"
      className={bemClass([blk, 'on-demand-title'])}
      dataAutoId="multiple_pickups_drops_management_software_section_4_title"
    >
        Optimize On-Demand Delivery Movement
    </Text>

    <ConfigurationSection
      iconSize="xxxlg"
      iconDivider
      hoverEffect
      data={[
        {
          id: 'order-driver-mapping',
          icon: 'large-on-demand-automated-pickup-and-drop-order-associate-mapping',
          title: 'Order-Driver Mapping',
          description:
              'Match the incoming orders to the driver best-suited to fulfill them satisfactorily.',
        },
        {
          id: 'fast-pickups',
          icon: 'large-on-demand-automated-pickup-and-drop-fast-pickups',
          title: 'Fast Pickups',
          description:
              'Ensure fast pickups with a short response time moving through traffic-free routes.',
        },
        {
          id: 'allocation-to-nearest-driver',
          icon: 'large-on-demand-automated-pickup-and-drop-allocation-to-nearest-associate',
          title: 'Allocation to Nearest Driver',
          description:
              'Allocate ad-hoc pickup requests to nearest driver with the required capacity & time.',
        },
        {
          id: 'delivery-rerouting',
          icon: 'large-on-demand-automated-pickup-and-drop-delivery-rerouting',
          title: 'Delivery Rerouting',
          description:
              'Reroute active delivery schedules when new pickups or orders are added ad-hoc.',
        },
        {
          id: 'dynamic-eta-updates',
          icon: 'large-on-demand-automated-pickup-and-drop-dynamic-eta-updates',
          title: 'Dynamic ETA Updates',
          description:
              'Update ETAs for all planned deliveries on active trips when new pickups are added in.',
        },
        {
          id: 'pickups-and-delivery-validation',
          icon: 'large-on-demand-automated-pickup-and-drop-pickups-and-delivery-validation',
          title: 'Pickups and Delivery Validation',
          description:
              'Validate all pickups & deliveries, and capture client feedback at the time of exchange.',
        },
      ]}
      dataAutoId="multiple_pickups_drops_management_software_section_4_features"
    />

    <ProductInformativeLayout
      hAlign="left"
      image={liveTrackingAndNotifications}
      imageAlt="Live Tracking and Notifications"
      dataAutoId="multiple_pickups_drops_management_software_section_5"
    >
      <ProductInformativeContent
        title="Live Tracking and Notifications"
        description={`Track all pickups and deliveries since the moment they are allocated to the
          point they are exchanged or handover, with instant notifications for each event.`}
        features={[
          {
            id: 'Complete Movement Visibility',
            title: 'Complete Movement Visibility',
            description: `Track each driver as they move on-field for pickups and deliveries,
            in a single dashboard. Ensure visibility of all order movement, with quick reaction
            times in case of delays or service disruptions.`,
          },
          {
            id: 'Instant Notifications',
            title: 'Instant Notifications',
            description: `Receive instant notifications whenever a planned event like on-time
            delivery, or an unplanned one like a delay or new pickup request happens.
            Get notified on-the-go to take timely decisions.`,
          },
        ]}
        dataAutoId="multiple_pickups_drops_management_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="multiple_pickups_drops_management_software_section_5_request_demo">
              Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="multiple_pickups_drops_management_software_section_5_free_trail">
                14 days trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default MultiplePickupsDropsManagementSoftware
