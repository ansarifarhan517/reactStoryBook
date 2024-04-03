import { ReactNode } from 'react'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

const blk = 'pricing-card'

type pricingData = {
  id: string
  title: string;
  list: string[];
  children: ReactNode;
  dataAutoId?: string;
}

const PricingCard = ({ id, title, list, children, dataAutoId }: pricingData) => (
  <div className={blk}>
    <Text
      typography="xxl"
      tag="h1"
      fontWeight="bold"
      color="black"
      className={bemClass([blk, 'heading'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      {title}
    </Text>
    {children}
    <ul className={bemClass([blk, 'list-wrapper'])}>
      {Object.values(list).map((item, i) => (
        <li key={`${id}_${i}`} className={bemClass([blk, 'list'])} data-auto-id={`${dataAutoId}_${id}_${i}`}>
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export default PricingCard
