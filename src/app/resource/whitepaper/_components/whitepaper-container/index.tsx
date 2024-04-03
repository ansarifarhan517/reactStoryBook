'use client'

import { useState } from 'react'

import Container from '@/components/container'

import ResourceDownload from '../../../_components/resource-download'

import WhitePaperCard from '../whitepaper-card'

import whitePaperData from '../../_data'

import './style.scss'

const blk = 'white-paper-container'

type whitePaperContainerProps = {
  dataAutoId?: string
}

const WhitePaperContainer = ({ dataAutoId }: whitePaperContainerProps) => {
  const [hubSpotFormId, setHubSpotFormId] = useState<string>('')
  const [formTitle, setFormTitle] = useState<string>('')

  const onDownloadHandler = (formId: string, title: string) => {
    setHubSpotFormId(formId)
    setFormTitle(title)
  }

  const closePopUpHandler = () => {
    setHubSpotFormId('')
    setFormTitle('')
  }

  return (
    <Container className={blk}>
      <>
        {whitePaperData.map(({ id, title, description, image, hubSpotFormId }) => (
          <WhitePaperCard
            key={id}
            dataAutoId={`${dataAutoId}_card_${id}`}
            image={image}
            description={description}
            title={title}
            hubSpotFormId={hubSpotFormId}
            onDownloadHandler={onDownloadHandler}
          />
        ))}
        <ResourceDownload
          hubSpotFormId={hubSpotFormId}
          title={formTitle}
          closeHandler={closePopUpHandler}
          dataAutoId={`${dataAutoId}_download`}
        />
      </>
    </Container>
  )
}

export default WhitePaperContainer
