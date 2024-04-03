import Image from 'next/image'
import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

type relatedResourceItemProps = {
  link: string,
  image: string,
  description: string
  dataAutoId?: string
}

const blk = 'related-resource-item'

const LandingPageRelatedResourceItem = ({ link, image, description ,dataAutoId }: relatedResourceItemProps) => (
  <a href={link} target="_blank" className={blk} data-auto-id={dataAutoId}>
    <div className={bemClass([blk,'image-container'])}>
      <Image
        src={image}
        alt={description}
        fill
        className={bemClass([blk, 'image'])}
        data-auto-id={`${dataAutoId}_image`}
      />
    </div>
    <Text
      tag="div"
      typography="s"
      fontWeight="normal"
      className={bemClass([blk, 'description-container'])}
      dataAutoId={`${dataAutoId}_description`}
    >
      <p dangerouslySetInnerHTML={{ __html: description }} className={bemClass([blk, 'description'])}/>
    </Text>
    <Text
      tag="div"
      typography="s"
      className={bemClass([blk, 'footer'])}
      dataAutoId={`${dataAutoId}_footer_title`}
    >
      By LogiNext
    </Text>
  </a>
)

export default LandingPageRelatedResourceItem
