import { Metadata } from 'next'

import PricingSignUpLayout from '../_components/pricing-sign-up-layout'

import PricingFormWrapper from '../_components/pricing-form-wrapper'

import SignUpForm from './_components/sign-up-form'

const PricingSignUp = () => (
  <PricingSignUpLayout
    dataAutoId="pricing_free_trial_plan_section_1"
    title="14-day Free Trial Plan"
    subTitle="No credit card required. No strings attached. Fill out the form below and get started in no time!"
  >
    <PricingFormWrapper dataAutoId="pricing_free_trial_plan_section_2">
      <SignUpForm dataAutoId="pricing_free_trial_plan_section_2_form" />
    </PricingFormWrapper>
  </PricingSignUpLayout>
)

const title = 'Loginext Pricing Sign Up'
const description = `SignUp to get started with a LogiNext Account.
Please feel free to bug us with questions on our  logistics management softwares.
We are eager to discuss your business needs and answer any questions you may have.`
const url = 'https://www.loginextsolutions.com/pricing/signup'

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
  PricingSignUp as default,
  metadata
}

