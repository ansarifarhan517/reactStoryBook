'use client'

import { useState } from 'react'

import Container from '@/components/container'

import { bemClass } from '@/utils'

import ResourceDownload from '../../../_components/resource-download'

import CaseStudyFilter from '../case-study-filter'

import CaseStudyCard from '../case-study-card'

import caseStudyData from '../../_data'

import './style.scss'

const blk = 'case-study-container'

type caseStudyContainerProps = {
  dataAutoId?: string
}

const CaseStudyContainer = ({ dataAutoId }: caseStudyContainerProps) => {
  const [hubSpotFormId, setHubSpotFormId] = useState<string>('')
  const [formTitle, setFormTitle] = useState<string>('')
  const [slectedCategories, setSlectedCategories] = useState<string[]>([])

  const onFilterSelection = (categories: string[]) => {
    setSlectedCategories(categories)
  }

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
        <CaseStudyFilter onSelection={onFilterSelection} dataAutoId={`${dataAutoId}_filter`} />
        <div className={bemClass([blk, 'content'])}>
          {caseStudyData.map(({
            id, title, description, category,
            image, hubSpotFormId, shareUrl = ''
          }) => {
            if (slectedCategories.length > 0 && slectedCategories.indexOf(category) === -1) {
              return null
            }
            return (
              <CaseStudyCard
                dataAutoId={`${dataAutoId}_card_${id}`}
                key={id}
                image={image}
                description={description}
                title={title}
                hubSpotFormId={hubSpotFormId}
                shareUrl={shareUrl}
                onDownloadHandler={onDownloadHandler}
              />
            )
          })}
        </div>
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

export default CaseStudyContainer
