import Image from 'next/image'

import Text from '@/components/text'

import { bemClass } from '@/utils'

import './style.scss'

type dataType = {
  image: string
  link: string
  label: string
}

type learnSaseStudyProps = {
  id: string
  data: dataType[]
  dataAutoId?: string
}

const blk = 'learn-case-study'

const LearnSaseStudy = ({ id, data = [], dataAutoId }: learnSaseStudyProps) => (
  <ul className={blk}>
    {data.map((item, index) => {
      const {
        image, link, label
      } = item
      return (
        <li key={`${id}_${index}`} className={bemClass([blk, 'card'])}>
          <a target="_blank" href={link} className={bemClass([blk, 'link'])}>
            <div className={bemClass([blk, 'image-wrapper'])}>
              <Image
                src={image}
                alt={label}
                fill
                className={bemClass([blk, 'image'])}
                data-auto-id={`${dataAutoId}_image_${id}_${index + 1}`}
              />
            </div>
            <Text
              tag="p"
              typography="s"
              className={bemClass([blk, 'content'])}
              dataAutoId={`${dataAutoId}_${id}_${index + 1}_desc`}
            >
              {label}
            </Text>
          </a>
        </li>
      )
    })}
  </ul>
)

export default LearnSaseStudy
