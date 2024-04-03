'use client'

import React, { useState } from 'react'

import PricingSignupForm from '../../../_components/pricing-sign-up-form'
import PricingFormPlan from '../pricing-plan'
import PricingFormStepper from '../form-stepper'
import { formDataType } from '@/app/pricing/types'

const blk = 'pricing-buy-now-form'

type pricingButNowFormProps = {
  orderData: Record<string, any>
  driverData: Record<string, any>
  dataAutoId?: string
}

const PricingBuyNowForm = ({ orderData, driverData, dataAutoId }: pricingButNowFormProps) => {
  const [step, setStep] = useState('1')
  const [growthPlanData, setGrowthPlanData] = useState<formDataType>({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    industry: '',
    employeeCount: '',
    designation: '',
    country: '',
    checked: false
  })

  const backHandler = () => {
    setStep('1')
  }

  const isStepOne = step === '1'
  const isStepTwo = step === '2'
  const planType = 'ADVANCED'

  return (
    <>
      <PricingFormStepper step={step} backHandler={backHandler} dataAutoId={dataAutoId} />
      {isStepOne && (
        <PricingSignupForm
          setStep={setStep}
          isGrowthPlan={true}
          setGrowthPlanData={setGrowthPlanData}
          planType={planType}
          dataAutoId={dataAutoId}
          signUpDataFormData={growthPlanData}
        />
      )}

      {isStepTwo && (
        <PricingFormPlan
          orderData={orderData}
          driverData={driverData}
          growthPlanData={growthPlanData}
          dataAutoId={dataAutoId}
        />
      )}
    </>
  )
}

export default PricingBuyNowForm
