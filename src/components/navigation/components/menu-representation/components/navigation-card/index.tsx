import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

import { bemClass } from '@/utils'

import './style.scss'

type navigationCardProps = {
  image: StaticImageData
  title?: string
  description?: string
  link?: string
  target?: string
  dataAutoId: string
  className?: string;
}

const blk = 'navigation-card'

const NavigationCard = ({
  image,
  title,
  description = '',
  link = '/',
  target = '_self',
  dataAutoId,
  className
}: navigationCardProps) => (
  <Link
    href={link}
    target={target}
    className={bemClass([blk, {}, className])}
    data-auto-id={dataAutoId}
  >
    <Image
      src={image}
      alt=""
      width={300}
      height={177}
      className={bemClass([ blk, 'image' ])}
    />
    <div className={bemClass([ blk, 'caption' ])}>
      <strong className={bemClass([ blk, 'title' ])}>{title}</strong>
      <p>{description}</p>
    </div>
  </Link>
)

export default NavigationCard
