import Image from 'next/image'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import Button from '@/components/button'
import GoToSignUpPage from '@/components/go-to-sign-up-page'
import Container from '@/components/container'
import MidContentSection from '@/components/mid-content-section'
import Parallax from '@/components/parallax'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/application-for-delivery-validation-through-epod.svg'
import coverPageBanner from '/public/validate-all-on-demand-deliveries.webp'
import makeAllYourTransactionsSecure from '/public/make-all-your-transactions-secure.webp'
import captureInstantCustomerFeedback from '/public/capture-instant-customer-feedback.webp'

import './style.scss'

const blk = 'application-for-delivery-validation-through-epod'

const ApplicationForDeliveryValidationThroughEPOD = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Product mile"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="application_for_delivery_validation_through_epod_section_1"
    >
      <Container fluid className={bemClass([blk, 'container'])}>
        <PageCoverSectionContent
          title="Validate all On-demand Deliveries"
          description={`Check and authenticate all deliveries at the point of exchange with secure
          ePODs and eSigns, along with live customer feedback.`}
          fluid className={bemClass([blk, 'cover-content'])}
          dataAutoId="application_for_delivery_validation_through_epod_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="application_for_delivery_validation_through_epod_section_1_request_demo">
              Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button asLink category="primary" href="/pricing/signup" size="large" dataAutoId="application_for_delivery_validation_through_epod_section_1_try_out_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
        <Parallax offset={50} className={bemClass([blk, 'cover-image'])}>
          <Image
            src={coverPageBanner}
            alt="Validate all On-demand Deliveries"
            className={bemClass([blk, 'image'])}
            loading="eager"
            data-auto-id="application_for_delivery_validation_through_epod_section_1_image"
          />
        </Parallax>
      </Container>
    </PageCoverSection>
    <MidContentSection
      title="Know Your Deliveries Reached Properly"
      description={`Ensure your drivers deliver at the right address at the right time with proper electronic
      proofs of deliveries backed by electronic signatures of the receiving customer.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="application_for_delivery_validation_through_epod_section_2"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="application_for_delivery_validation_through_epod_section_2_get_in_touch">
          Get in touch
      </ModalTriggerButton>
    </MidContentSection>
    <div className={bemClass([blk,'make-all-your-transactions-secure-wrapper'])}>
      <ProductInformativeLayout
        hAlign="left"
        image={makeAllYourTransactionsSecure}
        imageAlt="Make all Your Transactions Secure"
        widthBg
        dataAutoId="application_for_delivery_validation_through_epod_section_3"
        className={bemClass([blk,'make-all-your-transactions-secure'])}
      >
        <ProductInformativeContent
          title="Make all Your Transactions Secure"
          description={`Reduce errors and miscommunication at the time of delivery by validating
        all transactions in real-time and instantly syncing them with the central system.`}
          features={[{
            id: 'easy-collect-on-delivery',
            title: 'Easy Collect on Delivery',
            description: `Ensure easy collect on delivery by recording the exact cash collected
          from the customer, right in the app, or by enabling the customer to use card or a
          digital wallet for their payments.`,
          }, {
            id: 'Fast Delivery Processing',
            title: 'Fast Delivery Processing',
            description: `Seamlessly go from check-in at the delivery point to the successful
          check-out. Drivers can just follow the delivery process step-by-step using in-app
          guidance, collecting necessary information and validating transactions.`,
          }]}
          dataAutoId="application_for_delivery_validation_through_epod_section_3_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="application_for_delivery_validation_through_epod_section_3_connect_with_expert">
            Connect with expert
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="default" asLink href="/pricing/signup" outline dataAutoId="application_for_delivery_validation_through_epod_section_3_free_trail">
              start free trial
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </ProductInformativeContent>
      </ProductInformativeLayout>
    </div>
    <ProductInformativeLayout
      hAlign="right"
      image={captureInstantCustomerFeedback}
      imageAlt="Capture Instant Customer Feedback"
      dataAutoId="application_for_delivery_validation_through_epod_section_4"
    >
      <ProductInformativeContent
        title="Capture Instant Customer Feedback"
        description={`Actual customer feedback collected at the point when the delivery is handed over
        is very important. Ensure that your delivery associates capture this fresh and live
        customer feedback accurately.`}
        features={[{
          id: 'gain-ground-level-insights',
          title: 'Gain Ground-level Insights',
          description: `Customer perception of the delivery service or product can give valuable
          ground-level insights showing if the company\'s efforts are actually working.
          Capture customer\'s mood and experience accurately.`,
        }, {
          id: 'improve-customer-satisfaction',
          title: 'Improve Customer Satisfaction',
          description: `Appropriate and well-utilized customer feedback can be used to improve the
          delivery experience. It can also point to areas of improvement like better delivery
          notifications or faster delivery.`,
        }]}
        dataAutoId="application_for_delivery_validation_through_epod_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="application_for_delivery_validation_through_epod_section_4_request_demo">
            Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button category="default" asLink href="/pricing/signup" outline dataAutoId="application_for_delivery_validation_through_epod_section_4_free_trail">
              14 days trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

export default ApplicationForDeliveryValidationThroughEPOD
