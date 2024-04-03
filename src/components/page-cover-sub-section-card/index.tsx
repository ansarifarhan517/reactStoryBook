import dynamic from 'next/dynamic'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type pageSubCardProps = {
  iconName: string;
  description: string;
  dataAutoId?: string
}

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'page-cover-sub-section-card'

const PageCoverSubSectionCard = ({ iconName, description ,dataAutoId }: pageSubCardProps) => (
  <div className={bemClass([blk, {}, 'box-hover-effect'])} data-auto-id={dataAutoId}>
    <Icon name={iconName} size="xxxlg" color="primary" dataAutoId={`${dataAutoId}_icon`}/>
    <Text
      tag="p"
      typography="m"
      fontWeight="bold"
      color="black"
      className={bemClass([blk, 'description'])}
      dataAutoId={`${dataAutoId}_description`}
    >
      {description}
    </Text>
  </div>
)

export default PageCoverSubSectionCard
