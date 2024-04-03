import { bemClass } from '@/utils'

import Text from '@/components/text'

import { getOrderPricing, getDriverPricing } from '@/api/pricing'
import ModalTriggerButton from '@/components/modal-trigger-button'

import PricingCard from './components/pricing-card'
import PricingSlider from './components/pricing-slider'
import PricingCardButton from './components/pricing-card-button'

import './style.scss'

const trialFeatures = [
  '14-day trial at zero cost',
  'Ticketing support',
  'Limited SMS & emails',
  '2-hour demo and setup session'
]

const growthFeatures = [
  'Billed quarterly/annually',
  'Ticketing support',
  'Support for add-on purchases',
  '2-hour demo and setup session'
]

const enterpriseFeatures = [
  'Custom pricing options',
  'Ticketing support',
  'Support for add-on purchases',
  '12-hour demo and setup session',
  'Dedicated Account Manager',
  'UAT (User Acceptance Testing) account',
  'Weekly/Monthly/Quarterly Reviews'
]

const blk = 'pricing-card-section'

type pricingCardSectionProps = {
  dataAutoId?: string
}

const PricingCardSection = async ({ dataAutoId }: pricingCardSectionProps) => {
  const { data: orderData } = await getOrderPricing()
  const { data: driverData } = await getDriverPricing()

  return (
    <div className={blk}>
      <PricingCard id="trial" title="Trial" list={trialFeatures} dataAutoId={`${dataAutoId}_card_1`}>
        <>
          <Text tag="div" color="gray-darker" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_card_1_desc`}>
            Explore all the features at no cost for 14 days. No strings attached!
          </Text>
          <PricingCardButton
            label="START TRIAL"
            buttonClass={bemClass([blk, 'button'])}
            dataAutoId={`${dataAutoId}_card_1_start_trial`}
            redirectUrl="/pricing/signup"
          />
        </>
      </PricingCard>
      <PricingCard id="growth" title="Growth" list={growthFeatures} dataAutoId={`${dataAutoId}_card_2`}>
        <PricingSlider
          driverData={driverData}
          orderData={orderData}
          dataAutoId={`${dataAutoId}_card_2_desc`}
        />
      </PricingCard>
      <PricingCard id="enterprise" title="Enterprise" list={enterpriseFeatures} dataAutoId={`${dataAutoId}_card_3`}>
        <>
          <Text tag="div" color="gray-darker" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_card_3_desc`}>
            Get in touch with us if you are a large organization looking to experience the
            LogiNext advantage to the fullest!
          </Text>
          <ModalTriggerButton
            category="primary"
            modalType="talk-to-us"
            outline
            isBlock
            className={bemClass([blk, 'button'])}
            dataAutoId={`${dataAutoId}_card_3_contact_us`}
          >
            Contact us
          </ModalTriggerButton>
        </>
      </PricingCard>

    </div>
  )
}
export default PricingCardSection
