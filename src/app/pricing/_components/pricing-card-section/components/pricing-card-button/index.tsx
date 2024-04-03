'use client'

import { useRouter } from 'next/navigation'

import Button from '@/components/button'

type PricingCardButtonProps = {
    label: string
    buttonClass?: string
    dataAutoId?: string
    redirectUrl: string
}

declare global {
    interface Window {
      gtag: (...args: any[]) => void;
    }
}

const PricingCardButton = ({ label, buttonClass, dataAutoId, redirectUrl }: PricingCardButtonProps) => {
  const router = useRouter()

  const sendGaWithNavigation = (gaObj: Record<string, string>) => {
    //@ts-expect-error
    if (window.ga) {
      //@ts-expect-error
      ga('send', gaObj)
    }
    router.push(redirectUrl)
  }

  const trackButtonClick = () => {
    if (label === 'START TRIAL') {
      sendGaWithNavigation({
        hitType: 'event',
        eventCategory: 'Event',
        eventAction: 'planTypeTRIAL_Resources25',
        eventLabel: 'Mile_BuyNow_btn_click'
      })
      return
    }

    sendGaWithNavigation({
      hitType: 'event',
      eventCategory: 'Event',
      eventAction: 'planTypeADVANCED_Resourcesundefined',
      eventLabel: 'Mile_BuyNow_btn_click'
    })
  }

  return (
    <Button
      category="primary"
      size="small"
      outline
      isBlock
      className={buttonClass}
      dataAutoId={dataAutoId}
      clickHandler={trackButtonClick}
    >
      {label}
    </Button>
  )
}

export default PricingCardButton
