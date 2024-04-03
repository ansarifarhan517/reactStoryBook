import { Metadata } from 'next'
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

import { bemClass } from '@/utils'

import pageCoverBg from '/public/ftl-and-ltl-capacity-optimization.svg'
import coverPageBanner from '/public/capacity-optimization-for-ltl-and-ftl.webp'
import strikeTherightLoadBalanceForYourTrucks from '/public/strike-the-right-load-balance-for-your-trucks.webp'
import makeWinningShipmentSchedules from '/public/make-winning-shipment-schedules.webp'
import creatingAnAgileAndResponsiveSystem from '/public/creating-an-agile-and-responsive-system.webp'

import './style.scss'

const blk = 'ftl-and-ltl-capacity-optimization'

const FtlAndLtlCapacityOptimization = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="The best logistics software for FTL and LTL capacity optimization"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="ftl_and_ltl_capacity_optimization_section_1"
    >
      <>
        <div className={bemClass([blk, 'cover-bottom'])} />
        <Container fluid className={bemClass([blk, 'container'])}>
          <PageCoverSectionContent
            title="Capacity Optimization for LTL and FTL"
            description={`Use your resource capacity to the fullest with pitch-perfect load balancing,
            advanced shipment planning, and low turnaround times.`}
            fluid
            className={bemClass([blk, 'cover-content'])}
            dataAutoId="ftl_and_ltl_capacity_optimization_section_1_content"
          >
            <ButtonGroup>
              <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="ftl_and_ltl_capacity_optimization_section_1_ask_for_demo">
                Ask for a demo
              </ModalTriggerButton>
              <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="ftl_and_ltl_capacity_optimization_section_1_try_free">
                Try out free
              </ModalTriggerButton>
            </ButtonGroup>
          </PageCoverSectionContent>
          <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
            <Image
              src={coverPageBanner}
              alt="Capacity Optimization for LTL and FTL"
              className={bemClass([blk, 'image'])}
              loading="eager"
              data-auto-id="ftl_and_ltl_capacity_optimization_section_1_image"
            />
          </Parallax>
        </Container>
      </>
    </PageCoverSection>
    <ProductInformativeLayout
      hAlign="left"
      image={strikeTherightLoadBalanceForYourTrucks}
      imageAlt="Strike the right load-balance for your trucks"
      className={bemClass([blk, 'product-info'])}
      dataAutoId="ftl_and_ltl_capacity_optimization_section_2"
    >
      <ProductInformativeContent
        title="Strike the right load-balance for your trucks"
        description={`Get your trucks on the road, each with the perfect load for their route
        and type. Ensure all your trips serve the most touchpoints fully utilizing the available
        capacity.`}
        features={[{
          id: 'optimize-capacity-by-weight-and-volume',
          title: 'Optimize capacity by weight and volume',
          description: `Plan for more than just the weight of the load. Consider the exact
          volume of your load going into your less than load or full truckload truck. Use the
          entire space smartly while loading to get more value from current resources.`,
        }, {
          id: 'Allocate right shipment to right driver and truck',
          title: 'Allocate right shipment to right driver and truck',
          description: `Increase the productivity of your resources by smart shipment assignments.
          Each driver would take the most-suited vehicle type and carry the load they are
          best-trained for, along the route that they are most acquainted with.`,
        }]}
        dataAutoId="ftl_and_ltl_capacity_optimization_section_2_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="ftl_and_ltl_capacity_optimization_section_2_talk_to_us">
            Talk to us
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="ftl_and_ltl_capacity_optimization_section_2_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ContentOverlapLayout
      contentBgCategory="secondary"
      blogLinkCategory="secondary"
      image={makeWinningShipmentSchedules}
      title="Make winning shipment schedules"
      description={`Plan the schedule of all your shipments with the utmost precision.
      Cut down instances of idle and overcapacity, even deadheading. Reach all destinations on-time.`}
      blogUrl="https://www.loginextsolutions.com/blog/what-is-ltl-freight-and-how-can-tech-improve-freight-management/"
      dataAutoId="ftl_and_ltl_capacity_optimization_section_3"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="ftl_and_ltl_capacity_optimization_section_3_request_demo">
        Request a demo
      </ModalTriggerButton>
    </ContentOverlapLayout>
    <MidContentSection
      title="Cutdown on overall turnaround times"
      description={`Get more done in lesser time with well-planned schedules and routes,
      factoring in preferred time-windows of destination hubs.`}
      dataAutoId="ftl_and_ltl_capacity_optimization_section_4"
    >
      <>
        <Text tag="span" typography="l" dataAutoId="ftl_and_ltl_capacity_optimization_section_4_title_1">
          Follow routes with the least distance and time
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'mid-section-text'])} dataAutoId="ftl_and_ltl_capacity_optimization_section_4_description_1" >
          Plan perfect routes with the option of dynamically rerouting them in cases where random
          traffic snarls or unplanned detention come up on the way. Be one step ahead of such
          contingencies and swiftly update all ETAs while traveling.
        </Text>
        <Text tag="span" typography="l" dataAutoId="ftl_and_ltl_capacity_optimization_section_4_title_2">
          Track all moving trucks live in a single dashboard
        </Text>
        <Text tag="p" typography="s" className={bemClass([blk, 'mid-section-text'])} dataAutoId="ftl_and_ltl_capacity_optimization_section_4_description_2">
          Track all fleet movement in real-time. Know exactly where each truck is and how it&apos;s
          moving. Is it meeting all its SLAs, is in traveling on the right route, are there
          any delays? Get real-time alerts for each on-ground event.
        </Text>
        <ButtonGroup isCenter>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="ftl_and_ltl_capacity_optimization_section_4_connect_with_expert">
            Connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="ftl_and_ltl_capacity_optimization_section_4_sign_up_free">
            sign up fo free
          </ModalTriggerButton>
        </ButtonGroup>
      </>
    </MidContentSection>
    <Container className={bemClass([blk, 'bottom-image-wrapper'])}dataAutoId="ftl_and_ltl_capacity_optimization_section_5">
      <Parallax>
        <Image
          src={creatingAnAgileAndResponsiveSystem}
          alt="Creating an agile and responsive system"
          className={bemClass([blk, 'bottom-image'])}
          data-auto-id="ftl_and_ltl_capacity_optimization_section_5_image"
        />
      </Parallax>
    </Container>
  </>
)

const title = 'Transportation and Logistics | Delivery Management Software'
const description = 'LogiNext has the best delivery management software that will utilize your resource capacity to the fullest and strike the perfect load-balance for your fleet.'
const url = 'https://www.loginextsolutions.com/industries/transportation-software/ftl-and-ltl-capacity-optimization'

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
  FtlAndLtlCapacityOptimization as default,
  metadata
}
