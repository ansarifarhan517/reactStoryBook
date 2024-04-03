import { ReactElement, ReactPortal } from 'react'

import { bemClass } from '@/utils'

import SectionTitle from '../section-title'
import Text from '../text'
import FeatureLabelList from '../feature-label-list'
import InViewSlide from '../in-view-slide'

import './style.scss'

type featureListType = {
  id: string;
  icon: string;
  label: string;
}

type featureType = {
  id: string;
  title?: string;
  description?: string;
  isFeatureList?: boolean;
  list?: featureListType[];
}
type productInformativeContentProps = {
  title: string;
  description: string;
  features?: featureType[];
  children?: string | number | ReactElement | ReactElement[] | ReactPortal | boolean | null | undefined;
  className? : string;
  dataAutoId?: string
  category?: 'primary' | 'secondary'
}

const blk = 'product-informative-content'

const ProductInformativeContent = ({
  title,
  description,
  features,
  children,
  className,
  dataAutoId,
  category = 'primary'
}: productInformativeContentProps) => (
  <InViewSlide className={bemClass([blk, {}, className])} dataAutoId={dataAutoId}>
    <>
      <SectionTitle
        category="secondary"
        borderPosition="left"
        color={category === 'primary' ? 'gray-dark' : 'white'}
        fontWeight="thin"
        className={bemClass([blk, 'title'])}
        dataAutoId={`${dataAutoId}_title`}
      >
        {title}
      </SectionTitle>
      <Text tag="p" typography="l" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_description`} color={category === 'primary' ? 'gray-dark' : 'white'}>
        {description}
      </Text>
      {features?.map(({ id, title, description, isFeatureList, list = [] },index) => {
        if (isFeatureList) {
          return (
            <FeatureLabelList key={id} data={list} dataAutoId={`${dataAutoId}_list_${index}`} category={category} />
          )
        }
        return (
          <InViewSlide key={id}>
            <Text tag="h3" typography="l" dataAutoId={`${dataAutoId}_${index}_feature_title`} color={category == 'primary' ? 'gray-dark' : 'white'}>
              {title}
            </Text>
            <Text
              tag="p"
              typography="s"
              className={bemClass([blk, 'feature-description'])}
              dataAutoId={`${dataAutoId}_${index}_feature_description`}
              color={category == 'primary' ? 'gray-dark' : 'white'}
            >
              {description}
            </Text>
          </InViewSlide>
        )
      })}
      {children}
    </>
  </InViewSlide>
)

export default ProductInformativeContent
