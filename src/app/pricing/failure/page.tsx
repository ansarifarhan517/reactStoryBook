import Link from 'next/link'

import Button from '@/components/button'

import { bemClass } from '@/utils'

import PricingSignUpLayout from '../_components/pricing-sign-up-layout'
import PricingPlanSelectionComplete from '../_components/pricing-plan-selection-complete'

import './style.scss'

const blk = 'pricing-failure'

const PricingFailure = () => (
  <PricingSignUpLayout title="The Growth Plan">
    <PricingPlanSelectionComplete
      status="failure"
      title="Payment Failed!"
      description="Your payment could not be processed. Any amount deducted will be refunded within 7 working days."
    />
    <div className={blk}>
      <Button
        category="primary"
        asLink
        href="/pricing"
        isBlock
        className={bemClass([blk, 'button'])}
      >
        Retry payment
      </Button>
      <Link
        href="/"
        className={bemClass([blk, 'link'])}
      >
        Go to Homepage
      </Link>
    </div>
  </PricingSignUpLayout>
)

export default PricingFailure
