import React from 'react'
import Image from 'next/image'

import { RecruitmentFlowData } from '../../_data/information'
import RecruitmentFlowCard from '../recruitment-flow-card'

import RecruitmentSeparationImage from '/public/join-us/interview-process/recruitment-flow/recruitment-separation.webp'

import './style.scss'

import { bemClass } from '@/utils'

const blk = 'recruitment-flow'

type recruitmentFlowProps = {
  dataAutoId?: string
}

const RecruitmentFlow = ({ dataAutoId }: recruitmentFlowProps) => (
  <section className={blk}>
    {RecruitmentFlowData.map(({ id, image, title, description, imagePosition }) => (
      <>
        <RecruitmentFlowCard
          key={id}
          id={id}
          image={image}
          imagePosition={imagePosition}
          title={title}
          description={description}
          dataAutoId={`${dataAutoId}_${id}`}
        />
        <Image
          src={RecruitmentSeparationImage}
          alt={'separation-image'}
          className={bemClass([blk, 'separation-image', { [imagePosition]: imagePosition }])}
          data-auto-id={`${dataAutoId}_separation_image`}
        />
      </>
    ))}
  </section>
)

export default RecruitmentFlow
