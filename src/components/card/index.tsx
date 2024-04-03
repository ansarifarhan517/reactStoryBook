import Image, { StaticImageData } from 'next/image'
import dynamic from 'next/dynamic'

import { bemClass } from '@/utils'

import Text from '../text'
import Button from '../button'

import './style.scss'

const Icon = dynamic(() => import('../icon'), {
  ssr: false
})

const blk = 'card'

type cardsProps = {
  title: string
  description: string
  icon?: string
  url: string
  image?: StaticImageData
  iconClass?: string
  imageClass?: string
}

const Card = ({
  title,
  description,
  icon,
  url,
  image,
  iconClass = '',
  imageClass,
}: cardsProps) => (
  <div key={title} className={bemClass([blk, {}, 'box-hover-effect'])}>
    {icon && (
      <Icon
        name={icon}
        size="xxxxlg"
        className={bemClass([blk, iconClass])}
        weight="normal"
      />
    )}
    {image && (
      <Image
        src={image}
        alt={title}
        className={imageClass}
      />
    )}
    <Text tag="h1" typography="l"className={bemClass([blk, 'title'])}>
      {title}
    </Text>
    <Text tag="p" typography="m" className={bemClass([blk, 'description'])}>
      {description}
    </Text>
    <Button
      asLink
      category="primary"
      outline
      className={bemClass([blk, 'button'])}
      href={url}
    >
      Know More
    </Button>
  </div>
)

export default Card
