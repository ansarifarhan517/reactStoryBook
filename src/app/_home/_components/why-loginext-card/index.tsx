import Link from 'next/link'
import dynamic from 'next/dynamic'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type whyloginextCardProps = {
  title: string
  description: string
  url: string
  icon: string
  dataAutoId?: string
}

const Icon = dynamic(() => import('@/components/icon'), {
  ssr: false
})

const blk = 'why-loginext-card'

const WhyLoginextCard = ({
  icon,
  title,
  description,
  url,
  dataAutoId
}: whyloginextCardProps) => (
  <Link className={blk} href={url} target="_blank">
    <div className={bemClass([blk, 'icon-container'])}>
      <Icon name={icon} size="xxxxlg" color="primary" />
    </div>
    <Text
      tag="h1"
      typography="l"
      color="black"
      fontWeight="bold"
      className={bemClass([blk, 'title'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      {title}
    </Text>
    <Text
      tag="p"
      typography="s"
      color="black"
      fontWeight="semi-bold"
      className={bemClass([blk, 'description'])}
      dataAutoId={`${dataAutoId}_desc`}
    >
      {description}
    </Text>
  </Link>
)

export default WhyLoginextCard
