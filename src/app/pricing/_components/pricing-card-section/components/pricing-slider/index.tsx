'use client'

import { useCallback, useMemo, useState } from 'react'

import Text from '@/components/text'
import Toggle from '@/components/toggle'
import PricingCardButton from '../pricing-card-button'

import { bemClass } from '@/utils'

import './style.scss'

type pricingSliderProps = {
  driverData: Record<string, string | number | any>
  orderData: Record<string, string | number | any>
  dataAutoId?: string
}

const blk = 'pricing-slider'

const PricingSlider = ({ driverData, orderData, dataAutoId }: pricingSliderProps) => {
  const initialAmount = orderData?.Yearly?.recurring_price

  const [planActive, setPlanActive] = useState<boolean>(true)
  const [dropdown, setDropdown] = useState<boolean>(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('Pay per Order')
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount)

  const finalData = useMemo(() => ({
    'order': {
      'quarterly': orderData?.Quarterly?.recurring_price,
      'yearly': orderData?.Yearly?.recurring_price
    },
    'driver': {
      'quarterly': driverData?.Quarterly?.recurring_price / driverData?.Quarterly?.interval,
      'yearly': driverData?.Yearly?.recurring_price / driverData?.Yearly?.interval
    }
  }), [driverData, orderData])

  const handleClick = useCallback((e: any) => {
    const resource = selectedPlan === 'Pay per Order' ? 'order' : 'driver'
    setPlanActive(e.pricing)
    setSelectedAmount(finalData[resource][e.pricing === false ? 'quarterly' : 'yearly'])
  },[finalData, selectedPlan])


  const onChangePlan = (plan: string) => {
    setSelectedPlan(plan)
    const resource = plan === 'Pay per Order' ? 'order' : 'driver'
    setDropdown(false)
    setSelectedAmount(finalData[resource][planActive === false ? 'quarterly' : 'yearly'])
  }

  const btnUrl = `/pricing/form?billing-cycle=${planActive === false ? 'Quarter' : 'Annum'}&preference=${selectedPlan === 'Pay per Order' ? 'Order' : 'Driver'}`

  return (
    <>
      <div className={blk}>
        <div className={bemClass([blk, 'description'])}>
          <Text
            tag="p"
            typography="m"
            color="gray-darker"
            fontWeight="bold"
            className={bemClass([blk, 'label', { 'active': !planActive }])}
            dataAutoId={`${dataAutoId}_quarterly`}
          >
          Quarterly
          </Text>
          <div className={bemClass([blk, 'toggle'])}>
            <Toggle
              name="pricing"
              onChangeHandler={handleClick}
              checked={planActive}
              dataAutoId={`${dataAutoId}_toggle`}
            />
          </div>
          <Text
            tag="p"
            typography="m"
            color="gray-darker"
            fontWeight="bold"
            className={bemClass([blk, 'label', { 'active': planActive }])}
            dataAutoId={`${dataAutoId}_annually`}
          >
          Annually
          </Text>
        </div>
        <Text
          typography="xxxl"
          tag="p"
          color="black"
          className={bemClass([blk, 'price'])}
          dataAutoId={`${dataAutoId}_amount_in_dollar`}
        >
          <>
            <Text
              typography="s"
              tag="sup"
              className={bemClass([blk, 'superscript'])}
            >
            $
            </Text>
            {selectedAmount}
            {selectedPlan === 'Pay per Driver' && (
              <Text
                typography="s"
                tag="sub"
                className={bemClass([blk, 'subscript'])}
              >
              /mo
              </Text>
            )}
          </>
        </Text>
        <div className={bemClass([blk, 'dropdown'])}>
          <button
            type="button"
            onClick={() => setDropdown(!dropdown)}
            className={bemClass([blk, 'icon', { active: dropdown }])}
            data-auto-id={`${dataAutoId}_${selectedPlan}`}
          >
            {selectedPlan}
          </button>
          {dropdown &&
          <ul className={bemClass([blk, 'list'])}>
            <li onClick={() => onChangePlan('Pay per Order')} className={bemClass([blk, 'list-options'])}>
              <Text typography="s" fontWeight="bold" color="black" tag="span" dataAutoId={`${dataAutoId}_pay_per_order_title`}>
                Pay per Order
              </Text>
              <Text typography="xs" tag="p" dataAutoId={`${dataAutoId}_pay_per_order_desc`}>
                Select this if you want to pay on the basis of order volume.
              </Text>
            </li>
            <li onClick={() => onChangePlan('Pay per Driver')} className={bemClass([blk, 'list-options'])}>
              <Text typography="s" fontWeight="bold" color="black" tag="span" dataAutoId={`${dataAutoId}_pay_per_driver_title`}>
                Pay per Driver
              </Text>
              <Text typography="xs" tag="p" dataAutoId={`${dataAutoId}_pay_per_driver_desc`}>
                Select this if you want to pay on the basis of the number of drivers.
              </Text>
            </li>
          </ul>
          }
        </div>
      </div>

      <PricingCardButton
        label="BUY NOW"
        buttonClass={bemClass([blk, 'button'])}
        dataAutoId={`${dataAutoId}_card_2_but_now`}
        redirectUrl={btnUrl}
      />

    </>
  )
}

export default PricingSlider


