import { Metadata } from 'next'

import dynamic from 'next/dynamic'

import Container from '@/components/container'
import Text from '@/components/text'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/the-right-agent-with-the-right-task.webp'
import divideTerritoriesIntoStrategicWorkAreas from '/public/divide-territories-into-strategic-work-areas.webp'
import streamlineWorkOrderManagement from '/public/streamline-work-order-management.webp'

import './style.scss'

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'automate-work-order-allocation-software'

const AutomateWorkOrderAllocationSoftware = () => (
  <>
    <ProductInformativeLayout
      image={coverPageBanner}
      imageAlt="the Right Agent with the Right Task"
      loading="eager"
      hAlign="right"
      vAlign="bottom"
      contentAlign="start"
      className={bemClass([blk, 'cover-section'])}
      isCoverSection
    >
      <PageCoverSectionContent
        fluid
        title="The Right Agent with the Right Task"
        description={`Ensure that the right field agent is assigned the right task or work
        order which maximizes overall performance.`}
        className={bemClass([blk, 'cover-content'])}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" size="large">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/sign-up" category="primary" size="large">
              try out free
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </PageCoverSectionContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={divideTerritoriesIntoStrategicWorkAreas}
      imageAlt="Divide Territories into Strategic Work Areas"
    >
      <ProductInformativeContent
        title="Divide Territories into Strategic Work Areas"
        description={`Create a winning strategy with effective territory differentiation based
        on its revenue potential, required field agent skill-sets for conversion, associate
        product categories, etc.`}
        features={[{
          id: 'relate-field-agents-with-most-suited-areas',
          title: 'Relate Field Agents with Most-Suited Areas',
          description: `Some field agents have sustained relationships with clients in an area
          which can be leveraged. Identify the skill sets and local knowledge of such agents to
          directly associate them with that area.`,
        }, {
          id: 'categorize-outlets-for-better-agent-allocation',
          title: 'Categorize Outlets for Better Agent Allocation',
          description: `Identify outlets and areas which showcase high revenue or volume purchase
          and categorize them accordingly. Assign the best the field agent to the best category
          for higher returns.`,
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            get in touch
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/sign-up" category="default" outline>
              sign up for trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <MidContentSection
      title="Boost Performances with Smart Assignments"
      description={`Bring out the best out of your on-ground field workforce by using machine-learning
      enabled allocation engine to create multiple field agent + outlet (or client)
      match which is productive and efficient.`}
    />
    <Container className={bemClass([blk, 'card-holder'])}>
      <div className={bemClass([blk, 'card'])}>
        <Icon
          name="large-field-automated-allocation-automated-dispatch"
          size="xxxxlg"
          color="primary"
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])}>
            Automated Dispatch
          </Text>
          <Text tag="p" typography="s">
            Assign tasks and dispatch field agents quickly through a simple web or
            mobile interface.
          </Text>
        </div>
      </div>
      <div className={bemClass([blk, 'card'])}>
        <Icon
          name="large-field-automated-allocation-field-agent-empowerment"
          size="xxxxlg"
          color="primary"
        />
        <div>
          <Text tag="strong" typography="l" className={bemClass([blk, 'card-text'])}>
            Field Agent Empowerment
          </Text>
          <Text tag="p" typography="s">
            Active field agents can assign ad-hoc tasks to themselves with a clear
            fulfillment timeline.
          </Text>
        </div>
      </div>
    </Container>
    <ModalTriggerButton
      modalType="talk-to-us"
      category="primary"
      outline
      className={bemClass([blk, 'learn-more'])}
    >
        Learn more
    </ModalTriggerButton>

    <ProductInformativeLayout
      hAlign="left"
      image={streamlineWorkOrderManagement}
      imageAlt="Streamline Work Order Management"
    >
      <ProductInformativeContent
        title="Streamline Work Order Management"
        description={`Multiple tasks, service requests, and interactions relating to a single
        client or outlet can be tracked through efficient work order management.`}
        features={[{
          id: 'instantly-create-and-assign-work-orders',
          title: 'Instantly Create and Assign Work Orders',
          description: `Work orders can be created instantly and assigned to specific field agents,
          automatically planning all associated task, scheduled visits, and interactions.
          Automated allocation of work order leads to faster fulfillment.`,
        }, {
          id: 'easily-track-the-status-of-each-work-order',
          title: 'Easily Track the Status of Each Work Order',
          description: `Track the status of each work order starting from fast allocation and
          dispatch, timely task or service execution, and proper validation of task completion
          backed by accurate timestamps and instant client feedback.`,
        }]}
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button asLink href="/pricing/sign-up" category="default" outline>
              14 days free trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Reverse | Order Auto Allocation | Dispatch Software'
const description = 'LogiNext helps clients with a winning formula by dividing terrorities into strategic work areas and auto allocate orders to field agents. Contact us today!'
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
  AutomateWorkOrderAllocationSoftware as default,
  metadata
}
