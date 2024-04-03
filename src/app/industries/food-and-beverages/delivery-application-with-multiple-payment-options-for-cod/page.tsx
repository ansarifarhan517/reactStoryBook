import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ButtonGroup from '@/components/button-group'
import ModalTriggerButton from '@/components/modal-trigger-button'
import ProductInformativeLayout from '@/components/product-informative-layout'
import ProductInformativeContent from '@/components/product-informative-content'
import MidContentSection from '@/components/mid-content-section'

import { bemClass } from '@/utils'

import pageCoverBg from '/public/delivery-application-with-multiple-payment-options-for-cod.svg'
import coverPageBanner from '/public/streamline-all-your-delivery-payment.webp'
import makeYourCollectOnDeliveryModelStrong from '/public/make-your-collect-on-delivery-model-strong.webp'
import trackAndManageAllPaymentsInRealTime from '/public/track-and-manage-all-payments-in-real-time.webp'

import './style.scss'

const blk = 'delivery-application-with-multiple-payment-options-for-cod'

const DeliveryApplicationWithMultiplePaymentOptionsForCOD = () => (
  <>
    <PageCoverSection
      image={pageCoverBg}
      imageAlt="Streamline all your delivery payments"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_1"
    >
      <ProductInformativeLayout
        image={coverPageBanner}
        imageAlt="Streamline all your delivery payments"
        loading="eager"
        hAlign="right"
        vAlign="bottom"
        contentAlign="start"
        className={bemClass([blk, 'cover-content'])}
        dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_1"
      >
        <PageCoverSectionContent
          fluid
          title="Streamline all your delivery payments"
          description={`Get your payments in order giving a complete error-free and
          easy delivery experience to all your customers.`}
          dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_1_content"
        >
          <ButtonGroup>
            <ModalTriggerButton modalType="talk-to-us" category="primary" size="large" dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_1_ask_for_demo">
              Ask for a demo
            </ModalTriggerButton>
            <ModalTriggerButton modalType="sign-up" category="primary" size="large" dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_1_try_free">
              Try out free
            </ModalTriggerButton>
          </ButtonGroup>
        </PageCoverSectionContent>
      </ProductInformativeLayout>
    </PageCoverSection>
    <MidContentSection
      title="Give the customer complete payment support"
      description={`Boost the delivery experience by offering the customer multiple payment options
      and effortlessly processing each one of them from a central system.`}
      className={bemClass([blk, 'mid-section'])}
      dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_2"
    >
      <ButtonGroup isCenter>
        <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_2_talk_to_us">
          Talk to us
        </ModalTriggerButton>
        <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_2_free_trail">
          14 days free trial
        </ModalTriggerButton>
      </ButtonGroup>
    </MidContentSection>
    <ProductInformativeLayout
      hAlign="left"
      image={makeYourCollectOnDeliveryModelStrong}
      imageAlt="Make your collect on delivery model strong"
      className={bemClass([blk, 'make-your-collect'])}
      dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_3"
    >
      <ProductInformativeContent
        title="Make your collect on delivery model strong"
        description={`Customers want fast deliveries and easy payments. Have your delivery
        associates take in cash or card payments at the point of deliveries.`}
        features={[{
          id: 'secure-all-your-orders-with-cash-transactions',
          title: 'Secure all your orders with cash transactions',
          description: `Easily process all cash transactions with detailed in-app steps.
          Record each dollar exchanged including the amount taken and the amount returned
          to the customer with high visibility and authentication.`,
        }, {
          id: 'get-the-proper-customer-feedback-when-it-is-fresh',
          title: 'Get the proper customer feedback when it is fresh',
          description: `Capture customer feedback at the point of exchange. Instantly know
          what your customers are thinking about your delivery processes and your products
          with direct rating and comments.`,
        }]}
        dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_3_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_3_request_demo">
            Request a demo
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_3_free_trail">
            14 days free trial
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
    <ProductInformativeLayout
      hAlign="right"
      image={trackAndManageAllPaymentsInRealTime}
      imageAlt="Track and manage all payments in real-time"
      dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_4"
    >
      <ProductInformativeContent
        title="Track and manage all payments in real-time"
        description={`Don’t wait for the end of the trip to know about all the payments
        received. Be on top of all payment interactions as they happen.`}
        features={[{
          id: 'make-your-order-invoices-error-free',
          title: 'Make your order invoices error-free',
          description: `Ensure that your customers enjoy their orders right away without
          being disturbed or disheartened by invoicing errors. Validate and authenticate
          all deliveries as they happen from a central \'control tower\'.`,
        }, {
          id: 'sync-all-order-delivery-information-instantly',
          title: 'Sync all order delivery information instantly',
          description: `Get your delivery associates apps synced with the central
          system instantly, no matter if they are online or offline. With zero-percent
          downtime across users, ensure that all your information is always secure.`,
        }]}
        dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_4_content"
      >
        <ButtonGroup>
          <ModalTriggerButton modalType="talk-to-us" category="primary" dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_4_connect_with_expert">
            connect with expert
          </ModalTriggerButton>
          <ModalTriggerButton modalType="sign-up" category="default" outline dataAutoId="delivery_application_with_multiple_payment_options_for_cod_section_4_sign_up_free">
            sign up for free
          </ModalTriggerButton>
        </ButtonGroup>
      </ProductInformativeContent>
    </ProductInformativeLayout>
  </>
)

const title = 'Food and Beverage | Payment Options | Error-free Invoice'
const description = 'Streamline all your delivery payments to ensure the best delivery experience for your customers and get real-time customer feedback on delivery with LogiNext.'
const url = 'https://www.loginextsolutions.com/industries/food-and-beverages/delivery-application-with-multiple-payment-options-for-cod'

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
  alternates: {
    canonical: '/products/on-demand/application-for-delivery-validation-through-epod'
  }
}

export {
  DeliveryApplicationWithMultiplePaymentOptionsForCOD as default,
  metadata
}
