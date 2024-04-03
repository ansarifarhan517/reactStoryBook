import { Metadata } from 'next'

import { getOrderPricing, getDriverPricing } from '@/api/pricing'

import PricingSignUpLayout from '../_components/pricing-sign-up-layout'

import PricingFormWrapper from '../_components/pricing-form-wrapper'

import PricingBuyNowForm from './_components/pricing-buy-now-form'

const PricingForm = async () => {
  const { data: orderData } = await getOrderPricing()
  const { data: driverData } = await getDriverPricing()

  return (
    <PricingSignUpLayout
      dataAutoId="pricing_growth_plan_section_1"
      title="The Growth Plan"
      subTitle="Provide your details and customize the plan to fit your business needs"
    >
      <PricingFormWrapper dataAutoId="pricing_growth_plan_section_2">
        <PricingBuyNowForm
          orderData={orderData}
          driverData={driverData}
          dataAutoId="pricing_growth_plan_section_2_form"
        />
      </PricingFormWrapper>
    </PricingSignUpLayout>
  )
}

const title = 'LogiNext Pricing Form'
const description = 'Grow your business -  Plan your growth with the best LogiNext products at the best cost. Simple pricing for your business needs.'
const url = 'https://www.loginextsolutions.com/pricing/form'

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
  PricingForm as default,
  metadata
}
