import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

const blk = 'payment-summary'

type paymentSummaryProps = {
  billingCycle: string
  preference: string
  counter: number
  orderAmountObj: Record<string, any>
  driverAmountObj: Record<string, any>
  setOrderBaseCost: (value: number) => void
  dataAutoId?: string
}

const PaymentSummary = ({ billingCycle, preference, counter, orderAmountObj, driverAmountObj, setOrderBaseCost, dataAutoId }: paymentSummaryProps) => {
  const timeline = billingCycle === 'Annum' ? 'annually' : 'quarterly'
  const scheduleData: Record<string, any> = preference === 'Order' ? orderAmountObj : driverAmountObj
  const { discount } = scheduleData[timeline]
  const unitPrice = scheduleData[timeline].amount * scheduleData[timeline].interval
  const discountAmount = unitPrice * counter - (unitPrice * counter * discount) / 100
  const discountAmountPerUnit = Number.isInteger(discountAmount / counter) ? discountAmount / counter : (discountAmount / counter).toFixed(1)
  setOrderBaseCost(unitPrice)

  return (
    <div className={blk}>
      <Text
        tag="h3"
        typography="xxl"
        color="black"
        className={bemClass([blk, 'title'])}
        dataAutoId={`${dataAutoId}_payment_summary`}
      >
        Payment summary
      </Text>
      <div className={bemClass([blk, 'section'])}>
        <Text tag="label" typography="s" fontWeight="normal" dataAutoId={`${dataAutoId}_quantity_label`}>
          { `Number of ${preference}s`}
        </Text>
        <Text tag="span" fontWeight="bold" dataAutoId={`${dataAutoId}_quantity_value`}>
          {counter}
        </Text>
      </div>
      <div className={bemClass([blk, 'section'])}>
        <Text tag="label" typography="s" fontWeight="normal" dataAutoId={`${dataAutoId}_price_label`}>
          {preference === 'Driver'
            ? `Price Per Driver Per ${billingCycle} ($)`
            : 'Price per Order ($)'}
        </Text>
        <div>
          {discount !== 0 && <Text
            tag="span"
            fontWeight="normal"
            color="gray"
            className={bemClass([blk, 'muted'])}
            dataAutoId={`${dataAutoId}_discount_amount`}
          >
            {discount}
          </Text>}
          <Text tag="span" fontWeight="bold" color="secondary" dataAutoId={`${dataAutoId}_price_value`}>
            {isNaN(discountAmount / counter) ? 0 : discountAmountPerUnit}
          </Text>
        </div>
      </div>
      <div className={bemClass([blk, 'section'])}>
        <Text tag="label" typography="m" fontWeight="bold" dataAutoId={`${dataAutoId}_amount_to_be_paid`}>
          Amount to be Paid ($)
        </Text>
        <Text tag="span" fontWeight="bold" color="secondary" dataAutoId={`${dataAutoId}_total_amount`}>
          {Number.isInteger(discountAmount)
            ? discountAmount
            : discountAmount.toFixed(1)}
        </Text>
      </div>
    </div>
  )
}

export default PaymentSummary
