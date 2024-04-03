'use client'
import React, { useState } from 'react'

import { bemClass } from '@/utils'

import CollapseCard from '@/components/pricing-card'
import Collapsible from '@/components/collapsible'
import Text from '@/components/text'

import { data } from './_data/data'

import './style.scss'

const blk = 'pricing-feature'

type pricingFeaturesProps = {
  dataAutoId?: string
}

const PricingFeatures = ({ dataAutoId }: pricingFeaturesProps) => {

  const [isexpanded, setIsExpanded] = useState<number | null>(null)

  const handleToggle = (id:number) => {
    setIsExpanded(isexpanded === id ? null : id)
  }

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'header'])}>
        <Text
          tag="h2"
          typography="xxxl"
          className={bemClass([blk, 'heading'])}
          fontWeight="semi-bold"
          color="black"
          dataAutoId={dataAutoId}
        >
          <>
            Included <span className={bemClass([blk, 'subheading'])}>Features</span>
          </>
        </Text>
      </div>
      <div className={bemClass([blk, 'content'])}>
        { data.map((item, _i) => (
          <Collapsible
            isExpanded={isexpanded === item.id}
            title={item.title} key={_i}
            clickHandler={() => handleToggle(item.id)}
            contentClassName={bemClass([blk, 'list'])}
            dataAutoId={`${dataAutoId}_feature_${_i + 1}`}
          >
            <>
              { item.features.map((card, _index) => (
                <CollapseCard
                  key={card.title}
                  contentClass={bemClass([blk, 'wrapper'])}
                  title={card.title}
                  desc={card.description}
                  dataAutoId={`${dataAutoId}_feature_${_i + 1}_card_${_index + 1}`}
                />
              ))}
            </>
          </Collapsible>
        )
        )
        }
      </div>
    </div>
  )
}

export default PricingFeatures
