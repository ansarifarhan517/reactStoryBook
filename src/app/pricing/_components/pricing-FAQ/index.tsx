'use client'
import { useState } from 'react'

import { bemClass } from '@/utils'

import Collapsible from '@/components/collapsible'
import Text from '@/components/text'

import { data } from './_data/data'

import './style.scss'

const blk = 'pricing-FAQ'

type pricingFAQProps = {
  dataAutoId?: string
}

const PricingFAQ = ({ dataAutoId }: pricingFAQProps) => {
  const [isexpanded, setIsExpanded] = useState<number | null>(null)

  const handleToggle = (id:number) => {
    setIsExpanded(isexpanded === id ? null : id)
  }
  return (
    <div className={blk}>
      <div className={bemClass([blk, 'header'])}>
        <Text
          typography="xxxl"
          className={bemClass([blk, 'heading'])}
          fontWeight="semi-bold"
          tag="h3"
          color="black"
          dataAutoId={`${dataAutoId}_title`}
        >
          Frequently Asked Questions
        </Text>
      </div>
      <div className={bemClass([blk, 'content'])}>
        { data.map((item, _i) => (
          <Collapsible
            isExpanded={isexpanded === item.id}
            title={item.title} key={_i}
            clickHandler={() => handleToggle(item.id)}
            dataAutoId={`${dataAutoId}_question_${item.id}`}
          >
            <Text
              tag="p"
              typography="m"
              dataAutoId={`${dataAutoId}_question_${item.id}_desc`}
            >
              {item.content}
            </Text>
          </Collapsible>
        ))
        }
      </div>
    </div>
  )
}

export default PricingFAQ
