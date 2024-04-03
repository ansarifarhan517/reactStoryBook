'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import PlanDetails from '../plan-details'
import PaymentSummary from '../payment-summary'
import Button from '@/components/button'
import { formDataType } from '@/app/pricing/types'
import { growthSignUp } from '@/api/growth-sign-up'

type pricingPlanProps = {
  orderData: Record<string, any>
  driverData: Record<string, any>
  growthPlanData: formDataType
  dataAutoId?: string
}

const PricingFormPlan = ({ orderData, driverData, growthPlanData, dataAutoId }: pricingPlanProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cycle = searchParams.get('billing-cycle')
  const pref = searchParams.get('preference')

  const [billingCycle, setBillingCycle] = useState<string>(cycle || 'Annum')
  const [preference, setPreference] = useState<string>(pref || 'Order')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const minBillingValue = billingCycle === 'Annum' ? 30000 : 7500
  const maxBillingValue = billingCycle === 'Annum' ? 239996 : 59999
  const minValue = preference === 'Order' ? minBillingValue : 5
  const maxValue = preference === 'Order' ? maxBillingValue : 39
  const [counter, setCounter] = useState(minValue)
  const [orderBaseCost, setOrderBaseCost] = useState<number>(0)

  useEffect(() => {
    setCounter(minValue)
  }, [billingCycle, preference, minValue])

  const getPerMonthPrice = (intervalData: Record<string, any>) => {
    switch (intervalData?.interval_unit){
    case 'months':
      return Number.isInteger(
        intervalData?.recurring_price / intervalData?.interval
      )
        ? intervalData?.recurring_price / intervalData?.interval
        : (intervalData?.recurring_price / intervalData?.interval).toFixed(1)
    case 'years':
      return Number.isInteger(
        intervalData?.recurring_price / (intervalData?.interval * 12)
      )
        ? intervalData?.recurring_price / (intervalData?.interval * 12)
        : (
          intervalData?.recurring_price /
            (intervalData?.interval * 12)
        ).toFixed(1)
    default: return
    }
  }

  const orderAmountObj = {
    annually: {
      amount: orderData?.Yearly?.recurring_price,
      discount: orderData.Yearly?.discount ? orderData?.Yearly?.discount : 0,
      interval:1,
      planCode:orderData?.Yearly?.plan_code ? orderData?.Yearly?.plan_code : ''
    },
    quarterly: {
      amount: orderData?.Quarterly?.recurring_price,
      discount: orderData?.Quarterly?.discount ? orderData?.Quarterly?.discount : 0,
      interval:1,
      planCode:orderData?.Quarterly?.plan_code ? orderData?.Quarterly?.plan_code : ''
    }
  }

  const driverAmountObj = {
    annually: {
      amount: getPerMonthPrice(driverData?.Yearly),
      discount: driverData?.Yearly?.discount ? driverData?.Yearly?.discount : 0,
      interval:12,
      planCode:driverData?.Yearly?.plan_code ? driverData?.Yearly?.plan_code : ''
    },
    quarterly: {
      amount: getPerMonthPrice(driverData?.Quarterly),
      discount: driverData?.Quarterly?.discount ? driverData?.Quarterly?.discount : 0,
      interval:3,
      planCode:driverData?.Quarterly?.plan_code ? driverData?.Quarterly?.plan_code : ''
    }
  }

  const payNowHandler = async () => {
    setIsLoading(true)
    if (counter < minValue || counter > maxValue) {
      setIsLoading(false)
      return
    }
    let finalPayload = {}
    const { companyName, country, designation, email, employeeCount, industry, mobileNumber, name } = growthPlanData
    const payload = {
      companyName,
      country,
      designation,
      email,
      employeeCount,
      industry,
      mobileNumber,
      name,
      password: '',
      exchangeRate: 65,
      currencyCode: 'USD',
      reqflag: 'signup',
      sendActivationLink: 'After payment',
      allowCompleteSignup: true,
      subscriptionType: 'TRANSACTIONBASED',
      orderLimit: counter,
      orderBaseCost
    }
    if (preference === 'Order') {
      finalPayload = {
        ...payload,
        planType: billingCycle === 'Annum' ? 'MILETRASACTION-Annual' : 'MILETRASACTION-QUARTERLY'
      }
    } else {
      finalPayload = {
        ...payload,
        planType: billingCycle === 'Annum' ? 'ADVANCED-ANNUAL' : 'ADVANCED-QTRLY'
      }
    }
    const url: string = await growthSignUp(finalPayload)
    setIsLoading(false)

    //@ts-expect-error
    ga('send', {
      hitType: 'event',
      eventCategory: 'Event',
      eventAction: 'Signup_Success_planType:ADVANCED',
      eventLabel: 'Signup_Success'
    })

    router.push(url)

  }

  return (
    <>
      <PlanDetails
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        preference={preference}
        setPreference={setPreference}
        minValue={minValue}
        counter={counter}
        setCounter={setCounter}
        maxValue={maxValue}
        dataAutoId={dataAutoId}
      />
      <PaymentSummary
        billingCycle={billingCycle}
        preference={preference}
        counter={counter}
        orderAmountObj={orderAmountObj}
        driverAmountObj={driverAmountObj}
        setOrderBaseCost={setOrderBaseCost}
        dataAutoId={dataAutoId}
      />
      <Button
        category="primary"
        isBlock
        clickHandler={payNowHandler}
        loading={isLoading}
        dataAutoId={`${dataAutoId}_pay_now`}
      >
        Pay now
      </Button>
    </>
  )
}

export default PricingFormPlan
