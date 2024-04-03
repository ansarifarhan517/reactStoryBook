import Image, { StaticImageData } from 'next/image'
import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

type relatedResourceItemProps = {
  data: {
    id: string
    link: string
    image: StaticImageData
    description: string
  }
  dataAutoId?: string
}

const blk = 'related-resource-item'

const RelatedResourceItem = ({ data, dataAutoId }: relatedResourceItemProps) => {
  const { link, image, description } = data
  return (
    <a href={link} target="_blank" className={blk}>
      <Image
        src={image}
        alt={description}
        className={bemClass([blk, 'image'])}
        data-auto-id={`${dataAutoId}_image`}
      />
      <Text
        tag="p"
        typography="s"
        fontWeight="normal"
        className={bemClass([blk, 'description'])}
        dataAutoId={`${dataAutoId}_desc`}
      >
        {description}
      </Text>
      <Text
        tag="div"
        typography="s"
        className={bemClass([blk, 'footer'])}
        dataAutoId={`${dataAutoId}_footer`}
      >
        By LogiNext
      </Text>
    </a>
  )
}

export default RelatedResourceItem
