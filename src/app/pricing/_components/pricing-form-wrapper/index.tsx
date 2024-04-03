import { ReactElement } from 'react'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

type SignUpWrapperProps = {
  children?: ReactElement | ReactElement[] | string | number | null | undefined;
  className?: string;
  dataAutoId?: string
}

const blk = 'pricing-form-wrapper'

const PricingFormWrapper = ({ children, className, dataAutoId }: SignUpWrapperProps) => (
  <div className={bemClass([blk, {}, className ])}>
    <div className={bemClass([blk, 'content'])}>
      <Text
        tag="h2"
        typography="xxl"
        fontWeight="bold"
        color="black"
        className={bemClass([blk, 'heading'])}
        dataAutoId={`${dataAutoId}_title`}
      >
        LogiNext Success Stories
      </Text>
      <ul>
        <Text
          tag="li"
          typography="s"
          fontWeight="semi-bold"
          className={bemClass([blk, 'listItem'])}
          dataAutoId={`${dataAutoId}_story_1`}
        >
          500 million packages shipped annually
        </Text>
        <Text
          tag="li"
          typography="s"
          fontWeight="semi-bold"
          className={bemClass([blk, 'listItem'])}
          dataAutoId={`${dataAutoId}_story_2`}
        >
          240 million miles tracked
        </Text>
        <Text
          tag="li"
          typography="s"
          fontWeight="semi-bold"
          className={bemClass([blk, 'listItem'])}
          dataAutoId={`${dataAutoId}_story_3`}
        >
          20% reduction in delivery costs
        </Text>
        <Text
          tag="li"
          typography="s"
          fontWeight="semi-bold"
          className={bemClass([blk, 'listItem'])}
          dataAutoId={`${dataAutoId}_story_4`}
        >
          50 million pounds of GHG emissions reduced
        </Text>
        <Text
          tag="li"
          typography="s"
          fontWeight="semi-bold"
          className={bemClass([blk, 'listItem'])}
          dataAutoId={`${dataAutoId}_story_5`}
        >
          15-20% reduction in distance traveled
        </Text>
      </ul>
    </div>
    <div className={bemClass([blk, 'form-section'])}>
      {children}
    </div>
  </div>
)

export default PricingFormWrapper
