
import Image, { StaticImageData } from 'next/image'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type platformContentProps = {
  image: StaticImageData
  description: string
  descriptionImage: StaticImageData
}

const blk = 'platform-content'

const PlatformContent = ({
  image, description, descriptionImage
}: platformContentProps) => (
  <div className={blk}>
    <Image
      src={image}
      alt={description}
      fill
      className={bemClass([blk, 'bg-image'])}
    />
    <div className={bemClass([blk, 'content'])}>
      <Text
        tag="p"
        color="white"
        className={bemClass([blk, 'description'])}
      >
        {description}
      </Text>
      <div className={bemClass([blk, 'image-wrapper'])}>
        <Image
          src={descriptionImage}
          alt={description}
          className={bemClass([blk, 'image'])}
        />
      </div>
    </div>
  </div>
)

export default PlatformContent
