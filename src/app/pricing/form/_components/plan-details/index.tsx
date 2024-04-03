import Text from '@/components/text'

import { bemClass } from '@/utils'

import ToggleButton from '../toggle-button'
import PricingQuantity from '../pricing-quantity'

import './style.scss'

const blk = 'plan-details'

const billingCycleOptions = [{
  id: 'Quarter',
  label: 'Quarterly ',
},
{
  id: 'Annum',
  label: 'Annual ',
}]

const preferenceOptions = [{
  id: 'Order',
  label: 'Pay per Order ',
},
{
  id: 'Driver',
  label: 'Pay per Driver ',
}]

type planDetailsProps = {
  billingCycle: string,
  setBillingCycle: (value: string) => void
  preference: string
  setPreference: (value: string) => void
  minValue: number
  counter: number
  setCounter: (value: number) => void
  maxValue: number
  dataAutoId?: string
}

const PlanDetails = ({
  billingCycle,
  setBillingCycle,
  preference,
  setPreference,
  minValue,
  counter,
  setCounter,
  maxValue,
  dataAutoId
}: planDetailsProps) => {

  const orderInfoTip =
    billingCycle === 'Annum'
      ? 'The Growth plan allows for 30,000 to 2,39,996 orders per annum. If your requirement is for a higher number of orders, please contact us to opt for the Enterprise plan.'
      : 'The Growth plan allows for 7500 to 59,999 orders per quarter. If your requirement is for a higher number of orders, please contact us to opt for the Enterprise plan.'
  const infoTip =
    preference === 'Driver'
      ? 'The Growth plan allows for 5 to 39 drivers. If your requirement is for a higher number of drivers, please contact us to opt for the Enterprise plan.'
      : orderInfoTip

  const billingCycleChangeHandler = (id: string) => {
    setBillingCycle(id)
  }

  const preferenceChangeHandler = (id: string) => {
    setPreference(id)
  }
  return (
    <div>
      <Text
        tag="h3"
        typography="xxl"
        color="black"
        className={bemClass([blk, 'title'])}
        dataAutoId={`${dataAutoId}_plan_details`}
      >
        Plan Details
      </Text>
      <div className={bemClass([blk, 'section'])}>
        <Text
          tag="label"
          typography="s"
          fontWeight="normal"
          className={bemClass([blk, 'section-label'])}
          dataAutoId={`${dataAutoId}_billing_cycle`}
        >
          Billing Cycle
        </Text>
        <ToggleButton
          buttonList={billingCycleOptions}
          selected={billingCycle}
          changeHandler={billingCycleChangeHandler}
          dataAutoId={dataAutoId}
        />
      </div>
      <div className={bemClass([blk, 'section'])}>
        <Text
          tag="label"
          typography="s"
          fontWeight="normal"
          className={bemClass([blk, 'section-label'])}
          dataAutoId={`${dataAutoId}_preference`}
        >
          Preference
        </Text>
        <ToggleButton
          buttonList={preferenceOptions}
          selected={preference}
          changeHandler={preferenceChangeHandler}
          dataAutoId={dataAutoId}
        />
      </div>
      <div className={bemClass([blk, 'section'])}>
        <Text
          tag="label"
          typography="s"
          fontWeight="normal"
          className={bemClass([blk, 'section-label'])}
          dataAutoId={`${dataAutoId}_quantity`}
        >
          <>
            {`Number of ${preference}s `}
            <span className={bemClass([blk, 'info-icon'])} data-auto-id={`${dataAutoId}_info-tip`}>
              i<div className={bemClass([blk, 'info-tip'])}>{infoTip}</div>
            </span>
          </>
        </Text>
        <PricingQuantity
          minValue={minValue}
          counter={counter}
          setCounter={setCounter}
          maxValue={maxValue}
          billingCycle={billingCycle}
          preference={preference}
          dataAutoId={dataAutoId}
        />
      </div>
    </div>
  )
}

export default PlanDetails
