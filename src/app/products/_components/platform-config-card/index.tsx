import dynamic from 'next/dynamic'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

type platformConfigCardProps = {
  name: string;
  title: string;
  description: string;
  iconDataAutoId?: string
  titleDataAutoId?: string
  descriptionDataAutoId?: string
}

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'platform-config-card'

const PlatformConfigCard = ({
  name,
  title,
  description,
  iconDataAutoId,
  titleDataAutoId,
  descriptionDataAutoId
}: platformConfigCardProps) => (
  <div className={bemClass([blk, {}, 'box-hover-effect'])}>
    <Icon name={name} size="xxxxlg" color="black" dataAutoId={iconDataAutoId} />
    <Text
      tag="h3"
      typography="l"
      color="black"
      fontWeight="bold"
      className={bemClass([blk, 'title'])}
      dataAutoId={titleDataAutoId}
    >
      {title}
    </Text>
    <Text tag="p" typography="m" color="black" dataAutoId={descriptionDataAutoId}>
      {description}
    </Text>
  </div>
)

export default PlatformConfigCard
