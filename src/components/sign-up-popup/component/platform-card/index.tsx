import { useRouter } from 'next/navigation'

import Image, { StaticImageData } from 'next/image'

import Text from '@/components/text'
import Button from '@/components/button'

import { bemClass } from '@/utils'

import './style.scss'

type platformCardProps = {
  id?: string;
  name: string;
  description: string;
  image: StaticImageData;
  closeHandler: () => void;
  dataAutoId?: string
}

const blk = 'platform-card'

const PlatformCard = ({ name, description, image, closeHandler, dataAutoId }: platformCardProps) => {
  const router = useRouter()

  const startFreeTrialHandler = () => {
    closeHandler()
    router.push('/pricing/signup')
  }

  const pricingHandler = () => {
    closeHandler()
    router.push('/pricing')
  }

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'content'])} data-auto-id={`${dataAutoId}_header`}>
        <div className={bemClass([blk, 'company'])}>LOGINEXT</div>
        <div className={bemClass([blk, 'title'])}>
          {name}
          <sup className={bemClass([blk, 'sup'])}>TM</sup>
        </div>
        <Text tag="p" typography="m" fontWeight="thin" dataAutoId={`${dataAutoId}_desc`}>
          {description}
        </Text>
      </div>
      <Button
        category="primary"
        outline
        clickHandler={startFreeTrialHandler}
        className={bemClass([blk, 'button'])}
        dataAutoId={`${dataAutoId}_start_free_trial`}
        isFlexible
      >
          Start Free Trial
      </Button>
      <Button
        category="default"
        outline
        clickHandler={pricingHandler}
        className={bemClass([blk, 'button'])}
        dataAutoId={`${dataAutoId}_pricing`}
        size="small"
        isFlexible
      >
        Pricing
      </Button>
      <Image src={image} alt={name} className={bemClass([blk, 'image'])} data-auto-id={`${dataAutoId}_image`} />
    </div>
  )
}

export default PlatformCard
