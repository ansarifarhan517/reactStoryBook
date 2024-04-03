import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import ConfigurationSection from '@/components/configuration-section'
import Container from '@/components/container'
import AppStoreButton from '@/components/app-store-button'
import MidContentSection from '@/components/mid-content-section'
import AnimatedCoverPage from '@/components/animated-cover-page'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/software-for-field-agents-live-tracking.webp'
import knowWhenEachAgentWouldArriveAtAnOutlet from '/public/know-when-each-agent-would-arrive-at-an-outlet.webp'
import optimizeFaceTimeWithTheClientForBetterResults from '/public/optimize-face-time-with-the-client-for-better-results.webp'
import trackEachVisitFromPlanningToExecution from '/public/track-each-visit-from-planning-to-execution.webp'

import './style.scss'

const blk = 'software-for-field-agents-live-tracking'

const SoftwareForFieldAgentsLiveTracking = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Track your field agent's live movement"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Track your field agent's live movement"
          description="Know the exact location of each field agent and track their movement in real-time."
        >
          <ButtonGroup>
            <ModalTriggerButton
              modalType="talk-to-us"
              category="primary"
              size="large"
            >
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button asLink href="/pricing/signup" category="primary" size="large">
                Try for free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
        <AnimatedCoverPage
          animationPath="/animation-data/field-agent.json"
          delay={6000}
          hideOnMobile
          className={bemClass([blk, 'animation'])}
        />
      </Container>
    </PageCoverSection>
    <MidContentSection
      title="Make Your Field Agent Management Responsive"
      description={`With live tracking of all your field agents, know who is active on-ground, where they
      are at any time, how they are executing their tasks, and how well they are performing
      within their planned journeys.`}
      className={bemClass([blk, 'mid-section'])}
    />
    <ConfigurationSection
      iconSize="xxxlg"
      data={[
        {
          id: 'manage-on-field-attendance',
          icon: 'large-field-live-tracking-field-manage-on-field-attendance',
          title: 'Manage On-Field Attendance',
          description:
            'Mark accurate attendance of all your on-field agents with time and location stamps.',
        },
        {
          id: 'simple-web-and-app-map-interface',
          icon: 'large-field-live-tracking-field-simple-web--app-map-interface',
          title: 'Simple Web & App Map Interface',
          description:
            'Easy-to-understand and detail-oriented map interface for web and app usage.',
        },
        {
          id: 'capture-live-client-feedback',
          icon: 'large-field-live-tracking-field-capture-live-client-feedback',
          title: 'Capture Live Client Feedback',
          description:
            'Record accurate feedback from the client at the point of interaction of exchange.',
        },
      ]}
    />
    <ModalTriggerButton
      modalType="talk-to-us"
      category="primary"
      outline
      className={bemClass([blk, 'learn-more'])}
    >
      Learn more
    </ModalTriggerButton>
    <ProductInformativeLayout
      hAlign="right"
      image={knowWhenEachAgentWouldArriveAtAnOutlet}
      imageAlt="Know When Each Agent Would Arrive at an Outlet"
      widthBg
      className={bemClass([blk, 'know-when-each-agent'])}
    >
      <ProductInformativeContent
        title="Know When Each Agent Would Arrive at an Outlet"
        description={`Predict accurate estimated time of arrivals for each visit in a trip and
        communicate them to all key stakeholders including clients and supervising managers.`}
        features={[
          {
            id: 'make-etas-more-realistic-with-live-situation-analysis',
            title: 'Make ETAs More Realistic with Live Situation Analysis',
            description: `Even in case of unexpected delays or addition of ad-hoc tasks, easily
          recalculate ETAs in real-time factoring in the live traffic conditions and other
          disruptors. What's more? It's all automated.`,
          },
          {
            id: 'instantly-communicate-eta-updates-to-clients',
            title: 'Instantly Communicate ETA Updates to Clients',
            description: `Send out instant notifications when a field agent approaches a visit
          location, or if they are delayed and the ETA has been recalculated. In any case,
          ensure clients know exactly when the visit would happen.`,
          },
        ]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Connect with expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/pricing/sign-up" category="default" outline>
              14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>

    <ProductInformativeLayout
      hAlign="left"
      image={optimizeFaceTimeWithTheClientForBetterResults}
      imageAlt="Optimize Face-time with the Client for Better Results"
    >
      <ProductInformativeContent
        title="Optimize Face-time with the Client for Better Results"
        description={`Field agents should spend adequate time at each outlet to improve and
        sustain client relations while increasing their conversion rates and incoming revenue.`}
        features={[
          {
            id: 'capture-client-location-check-in-and-check-out',
            title: 'Capture Client Location Check-in and Check-Out',
            description: `Know when you field agent checks-in to any outlet simply by capturing
          the time they enter the outlet’s premises (mapped into the system as a geofence).
          Also, know when the agent checks-out or leaves the premises to capture the total
          time spent there.`,
          },
          {
            id: 'increase-transparency-with-on-the-spot-validation',
            title: 'Increase Transparency with On-the-Spot Validation',
            description: `Validated all service performed, order taken, or requirement gathered by
          the client at the point of exchange. Ensure clarity and transparency in all interactions
          by syncing all information with the central system in real-time.`,
          },
        ]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/sign-up" category="default" outline>
              start free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={trackEachVisitFromPlanningToExecution}
      imageAlt="Track Each Visit from Planning to Execution"
      className={bemClass([blk, 'track-each-visit'])}
    >
      <ProductInformativeContent
        title="Track Each Visit from Planning to Execution"
        description={`Field agents can view all their outlet visits along the planned route from
        a simple yet intuitive map view, giving live traffic insights and ETAs for better
        on-ground execution of the plans.`}
        features={[]}
      >
        <AppStoreButton category="secondary" align="hozironatal" />
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Reverse | Live Tracking Software | Real Time ETA'
const description =
  'Track your field workforce who are active on-ground, where they are, ETA for their visit, and how are they performing, using LogiNext. Call us to set up a demo!'
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

export { SoftwareForFieldAgentsLiveTracking as default, metadata }
