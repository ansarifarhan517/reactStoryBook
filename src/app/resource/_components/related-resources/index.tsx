'use client'

import { bemClass } from '@/utils'

import SectionTitle from '@/components/section-title'
import Text from '@/components/text'
import Slider from '@/components/slider'

import RelatedResourceItem from '../related-resource-item'

import { relatedResourcesData } from '../../_data'

import './style.scss'

const blk = 'related-resources'

type relatedResourcesProps = {
  dataAutoId?: string
}

const RelatedResources = ({ dataAutoId }: relatedResourcesProps) => (
  <div className={blk}>
    <div className={bemClass([blk, 'header'])}>
      <SectionTitle category="primary" fontWeight="thin" dataAutoId={`${dataAutoId}_title`}>
        Top Trending Blogs
      </SectionTitle>
      <Text
        tag="p"
        typography="l"
        fontWeight="thin"
        color="gray-dark"
        className={bemClass([blk, 'description'])}
        dataAutoId={`${dataAutoId}_desc`}
      >
        Read our most popular blogs from the field of delivery management
        and logistics automation.
      </Text>
    </div>
    <Slider id="related-sources" dataAutoId={`${dataAutoId}_slider`}>
      {relatedResourcesData.map((data) => (
        <li key={data.id}>
          <RelatedResourceItem data={data} dataAutoId={`${dataAutoId}_${data.id}`} />
        </li>
      ))}
    </Slider>
  </div>
)

export default RelatedResources
