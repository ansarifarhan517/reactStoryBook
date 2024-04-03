'use client'

import HubSpotForm from '@/components/hub-spot-form'

import './style.scss'

const blk = 'resource-subscribe-form'

type resourceSubscribeFormProps = {
  dataAutoId?: string
}

const ResourceSubscribeForm = ({ dataAutoId }: resourceSubscribeFormProps) => (
  <div className={blk} data-auto-id={dataAutoId}>
    <HubSpotForm
      containerId="resourceCoverSectionForm"
      formId="6aa4a566-d3d8-45dd-a126-6b0c53fa6350"
    />
  </div>
)

export default ResourceSubscribeForm
