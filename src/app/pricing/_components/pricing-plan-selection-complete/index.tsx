
import Image from 'next/image'

import Text from '@/components/text'

import statusSuccess from '/public/status-success.svg'
import statusFailure from '/public/status-failure.svg'

import './style.scss'

type pricingPlanSelectionCompleteProps = {
  status: 'success' | 'failure'
  title: string
  description: string
  dataAutoId?: string
}

const blk = 'pricing-plan-selection-complete'

const PricingPlanSelectionComplete = ({
  status,
  title,
  description,
  dataAutoId
}: pricingPlanSelectionCompleteProps) => (
  <div className={blk}>
    {status === 'success' && (
      <Image src={statusSuccess} alt="success" width={217} height={131} data-auto-id={`${dataAutoId}_image_success`} />
    )}
    {status === 'failure' && (
      <Image src={statusFailure} alt="success" width={217} height={131} data-auto-id={`${dataAutoId}_image_failure`} />
    )}

    <Text
      tag="h2"
      typography="xl"
      fontWeight="bold"
      color="gray-darker"
      dataAutoId={`${dataAutoId}_title`}
    >
      {title}
    </Text>
    <Text tag="p" color="gray-darker" dataAutoId={`${dataAutoId}_desc`}>{description}</Text>
  </div>
)

export default PricingPlanSelectionComplete
