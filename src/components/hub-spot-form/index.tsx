'use client'

import { useHubspotForm } from 'next-hubspot'

import { bemClass } from '@/utils'

import './style.scss'

type hubSpotFormProps = {
  region?: string;
  portalId?: string;
  formId: string;
  containerId?: string;
  className?: string;
  dataAutoId?: string
  isOnPageLoad?: boolean
}

const blk = 'hub-spot-form'

const HubspotForm = ({
  portalId = '2704626',
  region = 'na1',
  containerId = 'hubspotform',
  formId,
  className,
  dataAutoId,
}: hubSpotFormProps) => {
  const { formCreated } = useHubspotForm({
    portalId,
    formId,
    target: `#${containerId}`,
    region
  })

  return (
    <div
      id={containerId}
      data-auto-id={dataAutoId}
      className={bemClass([
        blk,
        {
          'loading': !formCreated,
        },
        className
      ])}
    />
  )
}

export default HubspotForm
