import { Metadata } from 'next'

import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import MidContentSection from '@/components/mid-content-section'
import ConfigurationSection from '@/components/configuration-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/optimize-routes-for-field-workforce.webp'
import reduceTurnaroundTimeForTrips from '/public/reduce-turnaround-time-for-trips.webp'
import dynamicReroutingAndEtaRecalculation from '/public/dynamic-rerouting-and-eta-recalculation.webp'

import './style.scss'

const blk = 'field-workforce-route-planning-optimization'

const FieldWorkforceRoutePlanningOptimization = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])}>
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Optimize Routes for Field Workforce"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Optimize Routes for Field Workforce"
          description={`Guide your field workforce through fast and safe routes to reach their
          destinations on-time and cover more visits per day.`}
          className={bemClass([blk, 'cover-content'])}
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large">
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </div>
    <MidContentSection
      title="Better Route Planning and Optimization"
      description={`Get ahead of the actual execution on the ground by planning and optimizing the routes
      which the field agents would follow along their trips. Use live traffic analysis to
      avoid unnecessary delays.`}
      className={bemClass([blk, 'mid-section'])}
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline>
          Learn more
      </ModalTriggerButton>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      hoverEffect
      data={[
        {
          id: 'shorter-routes',
          icon: 'large-field-route-optimization-shorter-routes',
          title: 'Shorter Routes',
          description: 'Make your field agents take shorter routes covering their visits in lesser time.'
        },
        {
          id: 'live-traffic-analysis',
          icon: 'large-field-route-optimization-live-traffic-analysis',
          title: 'Live Traffic Analysis',
          description: 'Analyze live traffic patterns to know which roads to take cutting down bottlenecks.'
        },
        {
          id: 'on-time-visits',
          icon: 'large-field-route-optimization-on-time-visits',
          title: 'On-time Visits',
          description: 'Reach all destinations on time with reduced delays and better ETA prediction.'
        }
      ]}
    />
    <ProductInformativeLayout
      hAlign="left"
      image={reduceTurnaroundTimeForTrips}
      imageAlt="Reduce Turnaround Time for Trips"
      widthBg
      className={bemClass([blk, 'reduce-turn-around'])}
    >
      <ProductInformativeContent
        title="Reduce Turnaround Time for Trips"
        description={`Higher control over real-time route management helps managers react faster
        to random on-ground occurrences such as traffic hold-ups or meeting delays.`}
        features={[{
          id: 'optimize-routes-for-faster-timelines',
          title: 'Optimize Routes for Faster Timelines',
          description: `Take the best route covering more client or outlet visits per trip while
          traveling lesser distances. Ensure your field agents spend their more time with the
          clients and less on the road.`
        }, {
          id: 'reduce-bottlenecks-across-all-trips',
          title: 'Reduce Bottlenecks Across All Trips',
          description: `While reducing total distance traveled, also reduce the time spent even
          on shorter routes by avoiding traffic-prone areas (or time slots when the area is traffic
            heavy) using enhanced machine learning backed real-time analysis.`
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline>
              14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={dynamicReroutingAndEtaRecalculation}
      imageAlt="Dynamic Rerouting and ETA Recalculation"
      className={bemClass([blk, 'dynamic-re-routing'])}
    >
      <ProductInformativeContent
        title="Dynamic Rerouting and ETA Recalculation"
        description={`Expertly manage all active visits on a trip, even the random incoming
        visit requests from the client or outlets. Just reroute trips without affecting current
        assignments.`}
        features={[{
          id: 'reroute-trips-without-affecting-timelines',
          title: 'Reroute Trips Without Affecting Timelines',
          description: `Accommodate ad-hoc client visit requests within active trips without
          affecting the rest of planned visits in the day. System carefully reroutes the trip
          to ensure minimal delays, communicating the same to respective stakeholders.`
        }, {
          id: 'calculate-accurate-etas-for-each-visit',
          title: 'Calculate Accurate ETAs for Each Visit',
          description: `Know the exact time when a field agent would visit the client or outlet
          with accurate ETAs. Even when a trip is rerouted, the ETAs are recalculated accurately
          and communicated to the clients immediately.`
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline>
              sign up for free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Reverse | Route Optimization | Field Workforce'
const description = 'Route Optimization will help your field workforce get assigned the best route to cover more outlet/ stores per day. Choose LogiNext to meet your requirements.'
const url = 'https://www.loginextsolutions.com/feature'

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
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  FieldWorkforceRoutePlanningOptimization as default,
  metadata
}
