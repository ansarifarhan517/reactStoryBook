import { Metadata } from 'next'

import Button from '@/components/button'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ButtonGroup from '@/components/button-group'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import ConfigurationSection from '@/components/configuration-section'
import MidContentSection from '@/components/mid-content-section'
import GoToSignUpPage from '@/components/go-to-sign-up-page'

import { bemClass } from '@/utils'

import coverPageBanner from '/public/secure-delivery-validation.webp'
import authenticProofsOfDeliveries from '/public/authentic-proofs-of-deliveries.webp'
import completePaymentSolutions from '/public/complete-payment-solutions.webp'

import './style.scss'

const blk = 'delivery-validation-with-electronic-proof-of-delivery'

const DeliveryValidationWithElectronicProofOfDelivery = () => (
  <>
    <div className={blk}>
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Secure Delivery Validation"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_1"
        isCoverSection
      >
        <PageCoverSectionContent
          fluid
          title="Secure Delivery Validation"
          description={'Validate all your deliveries at the time of handover in a secure and direct manner creating the perfect delivery experience.'}
          className={bemClass([blk, 'cover-content'])}
          dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_1_request_demo">
            Request a demo
            </ModalTriggerButton>
            <GoToSignUpPage>
              <Button category="primary" size="large" asLink href="/pricing/signup" dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_1_try_out_free">
                Try out free
              </Button>
            </GoToSignUpPage>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </div>
    <MidContentSection
      title="Step-by-Step Delivery Validation"
      description={`Drivers follow a simple step-by-step process to validate all deliveries
      in front of the customer or receiver to eliminate all human errors or discrepancies.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_2"
    >
      <ModalTriggerButton modalType="talk-to-us" category="primary" outline dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_2_get_in_touch">
          Get in touch
      </ModalTriggerButton>
    </MidContentSection>
    <ConfigurationSection
      iconSize="xxxlg"
      iconColor="primary"
      data={[
        {
          id: 'Easy Scanning of Unit Items',
          icon: 'large-mile-delivery-validation-easy-scanning-of-unit-items',
          title: 'Easy Scanning of Unit Items',
          description: 'Just scan items using the app for easy unloading and processing.'
        },
        {
          id: 'Simple Delivery Processing',
          icon: 'large-mile-delivery-validation-simple-delivery-processing',
          title: 'Simple Delivery Processing',
          description: 'Intuitive app design helps drivers process deliveries better and faster.'
        },
        {
          id: 'Instant Delivery Status Capture',
          icon: 'large-mile-delivery-validation-instant-delivery-status-capture',
          title: 'Instant Delivery Status Capture',
          description: 'Drivers can record all current delivery statuses giving proper reasons.'
        }
      ]}
      dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_2_features"
    />
    <ProductInformativeLayout
      image={authenticProofsOfDeliveries}
      imageAlt="Authentic Proofs of Deliveries"
      dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_3"
    >
      <ProductInformativeContent
        title="Authentic Proofs of Deliveries"
        description={`Drivers can electronically capture the proofs of all deliveries
          using our in-app camera extension along with the customer\'s sign for validation.`}
        features={[{
          id: 'capture-customer-mood-and-feedback',
          title: 'Capture Customer Mood and Feedback',
          description: `Drivers can capture the feedback of the customers or clients
            at the point of delivery exchange to get an accurate assessment of their satisfaction
            ratings and find opportunities to better processes.`,
        }, {
          id: 'instantly-sync-all-delivery-information',
          title: 'Instantly Sync all Delivery Information',
          description: `Ensure customer interaction information at the time of delivery is
            accurately captured and instantly synced with your central system. Information
            would never be lost and can even be synced even in offline mode.`,
        }]}
        dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_3_request_demo">
              Request a demo
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_3_sign_up_trail"
            >
                Sign up  for trial
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="left"
      image={completePaymentSolutions}
      imageAlt="Complete Payment Solutions"
      widthBg
      dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_4"
    >
      <ProductInformativeContent
        title="Complete Payment Solutions"
        description={`Improve customer experience at the time of delivery by following
          a simple and secure collect-on-delivery mechanism.`}
        features={[{
          id: 'offer-multiple-payment-options',
          title: 'Offer Multiple Payment Options',
          description: `Offer the customer multiple payment options such as prepaid, cash,
            card, or digital payments. Customer satisfaction increases with the power of payment
            choices, with a clear increase in repeat customers.`,
        }, {
          id: 'ensure-error-free-invoicing',
          title: 'Ensure Error-free Invoicing',
          description: `Seamless invoicing process ensures secure and error-free payments
            avoiding all discrepancies while even enabling partial deliveries where only part
            of total items are accepted and paid for.`,
        }]}
        dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_4"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_4_connect_with_expert">
              Connect to expert
          </ModalTriggerButton>
          <GoToSignUpPage>
            <Button
              category="default"
              outline
              asLink
              href="/pricing/signup"
              dataAutoId="delivery_validation_with_electronic_proof_of_delivery_section_4_try_free"
            >
                Try for free
            </Button>
          </GoToSignUpPage>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'LogiNext Mile | Secure Delivery Validation | Delivery Proof'
const description = 'Want to create the perfect delivery experience? Choose LogiNext to help with order validation at the end of delivery to eliminate human discrepancies. Call now!'
const url = 'https://www.loginextsolutions.com/products/mile/delivery-validation-with-electronic-proof-of-delivery'

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
  DeliveryValidationWithElectronicProofOfDelivery as default,
  metadata
}

