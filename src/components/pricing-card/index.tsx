import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

const blk = 'collapse-card'

type CardProp = {
  title: string
  desc: string
  contentClass: string
  dataAutoId?: string
}

const CollapseCard = ({ title, desc, contentClass, dataAutoId }: CardProp) => (
  <div className={bemClass([blk, {}, contentClass])}>
    <div className={bemClass([blk, 'content'])}>
      <Text
        typography="m"
        fontWeight="bold"
        tag={'h3'}
        color="black"
        className={bemClass([blk, 'heading'])}
        dataAutoId={`${dataAutoId}_title`}
      >
        {title}
      </Text>
      <Text typography="s" tag={'p'} dataAutoId={`${dataAutoId}_desc`}>{desc}</Text>
    </div>
  </div>
)

export default CollapseCard
