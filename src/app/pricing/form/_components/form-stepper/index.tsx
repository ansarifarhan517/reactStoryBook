import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type pricingFormStepper = {
  step: string
  backHandler: () => void
  dataAutoId?: string
}

const blk = 'pricing-form-stepper'

const PricingFormStepper = ({ step, backHandler, dataAutoId }: pricingFormStepper) => {
  if (step === '1') {
    return (
      <Text
        tag="span"
        typography="s"
        fontWeight="semi-bold"
        className={blk}
        dataAutoId={`${dataAutoId}_step_1`}
      >
        Step 1/2 - Add Details
      </Text>
    )
  }
  return (
    <div className={blk}>
      <button
        aria-label="Back"
        onClick={backHandler}
        className={bemClass([blk, 'back-btn'])}
        data-auto-id={`${dataAutoId}_step_2_button`}
      />
      <Text
        tag="span"
        typography="s"
        fontWeight="semi-bold"
        dataAutoId={`${dataAutoId}_step_2`}
      >
        Step 2/2 - Customize Your Plan
      </Text>
    </div>
  )
}

export default PricingFormStepper
