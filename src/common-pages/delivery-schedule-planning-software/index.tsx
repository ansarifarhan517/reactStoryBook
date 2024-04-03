import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import ConfigurationSection from '@/components/configuration-section'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/delivery-schedule-planning.webp'
import makeEffectiveDeliverySchedules from '/public/make-effective-delivery-schedules.webp'
import driveMoreProductivityFromTerritories from '/public/drive-more-productivity-from-territories.webp'
import saveTimeWithAutoDeliveryAllocation from '/public/save-time-with-auto-delivery-allocation.webp'

import './style.scss'

const blk = 'delivery-schedule-planning-software'

const DeliverySchedulePlanningSoftware = () => (
  <>
    <div className={blk}>
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Delivery Schedule Planning"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        dataAutoId="delivery-schedule-planning-software_section_1"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Delivery Schedule Planning"
          description={'Manage all delivery movement with intelligent schedule planning and effective order allocation.'}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="delivery-schedule-planning-software_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton
              modalType="talk-to-us"
              category="primary"
              size="large"
              dataAutoId="delivery-schedule-planning-software_section_1_ask_for_demo"
            >
              Ask for a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button
                category="primary"
                size="large"
                asLink
                href="/pricing/signup"
                dataAutoId="delivery-schedule-planning-software_section_1_try_out"
              >
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </div>
    <ProductInformativeLayout
      hAlign="left"
      image={makeEffectiveDeliverySchedules}
      imageAlt="Make Effective Delivery Schedules"
      dataAutoId="delivery-schedule-planning-software_section_2"
    >
      <ProductInformativeContent
        title="Make Effective Delivery Schedules"
        description={`Create schedules for all your drivers and vehicles that increase
        their efficiency by using smart technology to optimally utilize their capacity
        and time while increasing total deliveries fulfilled.`}
        features={[]}
        dataAutoId="delivery-schedule-planning-software_section_2_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery-schedule-planning-software_section_2_get_in_touch">
            Get in touch
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="delivery-schedule-planning-software_section_2_sign_up"
            >
              Sign up for trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ConfigurationSection
      iconSize="xxxlg"
      widthBg
      data={[
        {
          id: 'territory-mapping',
          icon: 'large-mile-delivery-schedule-planning-territory-mapping',
          title: 'Territory Mapping',
          description: 'Track all incoming and outgoing deliveries from different territories.'
        },
        {
          id: 'improve-resources',
          icon: 'large-mile-delivery-schedule-planning-improve-resources',
          title: 'Improve Resources',
          description: 'Identify skill sets, localized knowledge, capacities, etc. of drivers.'
        },
        {
          id: 'capacity-optimization',
          icon: 'large-mile-delivery-schedule-planning-capacity-optimization',
          title: 'Capacity Optimization',
          description: 'Balance all deliveries across resources to optimize carrying capacities.'
        },
        {
          id: 'fast-scan-in-and-scan-out',
          icon: 'large-mile-delivery-schedule-planning-fast-scan-in-and-scan-out',
          title: 'Fast Scan-in and Scan-out',
          description: 'Easily scan-in and scan-out packages or SKUs using our mobile app.'
        },
        {
          id: 'preferred-time-slots',
          icon: 'large-mile-delivery-schedule-planning-preferred-time-slots',
          title: 'Preferred Time-Slots',
          description: 'Plan schedules to optimally fulfill all critical and preferred time-slot deliveries.'
        },
        {
          id: 'auto-allocation-and-dispatch',
          icon: 'large-mile-delivery-schedule-planning-auto-allocation-and-dispatch',
          title: 'Auto-Allocation and Dispatch',
          description: 'Automatically assign deliveries to drivers best-suited to fulfill them.'
        }
      ]}
      dataAutoId="route_planning_software_section_3_features"
    />
    <ProductInformativeLayout
      image={driveMoreProductivityFromTerritories}
      imageAlt="Drive More Productivity from Territories"
      dataAutoId="route_planning_software_section_4"
    >
      <ProductInformativeContent
        title="Drive More Productivity from Territories"
        description={`Map different territories based on the incoming demand or orders
        to understand how many resources would be required to fulfill all of them on-time.`}
        features={[{
          id: 'geofencing',
          title: 'Geofencing',
          description: `Create virtual demarcations called geofences across key areas
          and locations which can be directly associated with drivers having deep local
          knowledge of that area and well-versed with local addresses.`
        }, {
          id: 'delivery-load-balancing',
          title: 'Delivery Load Balancing',
          description: `Identify territories with excess or less number of deliveries
          than previously planned and utilize the drivers in surrounding areas to balance
          the load evenly across all territories.`
        }]}
        dataAutoId="route_planning_software_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_software_section_4_request_demo">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="route_planning_software_section_4_try_for_free"
            >
              try for free
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={saveTimeWithAutoDeliveryAllocation}
      imageAlt="Save Time with Auto-Delivery Allocation"
      dataAutoId="route_planning_software_section_5"
    >
      <ProductInformativeContent
        title="Save Time with Auto-Delivery Allocation"
        description={`Automatically assign deliveries within moments to the
        right drivers with relevant local knowledge, idle capacity, and clear
        timelines to handle it.`}
        features={[{
          id: 'easy-scan-in-and-scan-out',
          title: 'Easy Scan-in and Scan-out',
          description: `Driver can easily and quickly scan-in all items to be delivered
          using their app for fast loading, and then scan-out all required items while
          delivering them for error-free invoicing and process transparency.`
        }, {
          id: 'automated-dispatch',
          title: 'Automated Dispatch',
          description: `Plan effective schedules, assign them to the right driver, and quickly
          scan-in while loading items for faster dispatch. Automatically start tracking of drivers
          as they move out of the depot or hub.`
        }]}
        dataAutoId="route_planning_software_section_5_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="route_planning_software_section_5_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              asLink
              category="default"
              outline
              href="/pricing/signup"
              dataAutoId="route_planning_software_section_5_free_trail"
            >
              14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default DeliverySchedulePlanningSoftware
