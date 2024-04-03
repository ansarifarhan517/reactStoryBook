import Image, { StaticImageData } from 'next/image'

import Button from '@/components/button'
import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type productCardProps = {
  image: StaticImageData
  title: string
  description: string
  url: string
  imageDataAutoId?: string
  descriptionDataAutoId?: string
  buttonDataAutoId?: string
}

const blk = 'product-card'

const ProductCard = ({ image, title, description,url ,imageDataAutoId, descriptionDataAutoId, buttonDataAutoId }: productCardProps) => (
  <div className={blk}>
    <div className={bemClass([blk, 'product-image-container'])}>
      <Image
        src={image}
        alt={title}
        loading="lazy"
        className={bemClass([blk, 'image'])}
        data-auto-id={imageDataAutoId}
      />
    </div>
    <Text
      tag="p"
      typography="m"
      color="black"
      fontWeight="semi-bold"
      className={bemClass([blk, 'product-description'])}
      dataAutoId={descriptionDataAutoId}
    >
      {description}
    </Text>
    <Button
      asLink
      category="primary"
      outline
      className={bemClass([blk, 'button'])}
      href={url}
      target="_blank"
      dataAutoId={buttonDataAutoId}
    >
      Learn More
    </Button>
  </div>
)

export default ProductCard
