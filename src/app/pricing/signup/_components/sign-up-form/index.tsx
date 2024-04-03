'use client'

import { useRouter } from 'next/navigation'

import PricingSignupForm from '../../../_components/pricing-sign-up-form'

import { formDataType } from '@/app/pricing/types'
import { signUp } from '@/api/sign-up'

type signUpFormProps = {
  dataAutoId?: string
}

const SignUpForm = ({ dataAutoId }: signUpFormProps) => {
  const router = useRouter()

  const planType = 'TRIAL'

  const signUpHandler = async (formData: formDataType) => {
    const { companyName, country, designation, email, employeeCount, industry, mobileNumber, name } = formData
    const payload: Record<string, any> = {
      companyName,
      country,
      designation,
      email,
      employeecount : employeeCount,
      industry,
      mobileNumber,
      name,
      password: '',
      planType,
      exchangeRate: 65,
      currencyCode: 'USD',
      reqflag: 'signup',
      sendActivationLink: 'No',
      allowCompleteSignup: true,
      subscriptionType: 'RESOURCEBASED',
      resourceCount: 25,
      price: 0
    }
    const response = await signUp(payload)
    if (response?.status === 200) {

      //@ts-expect-error
      ga('send', {
        hitType: 'event',
        eventCategory: 'Event',
        eventAction: 'Signup_Success_planType:TRIAL',
        eventLabel: 'Signup_Success'
      })

      router.push('/pricing/signup-success')
    }

  }

  return (
    <>
      <PricingSignupForm
        isGrowthPlan={false}
        signUpHandler={signUpHandler}
        planType={planType}
        dataAutoId={dataAutoId}
      />
    </>
  )
}

export default SignUpForm
