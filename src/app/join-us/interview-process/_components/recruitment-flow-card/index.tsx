import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Text from '@/components/text'

import './style.scss'

export interface recruitmentFlowCardProps {
  id: string | number;
  title: string;
  description: string;
  image: StaticImageData;
  imagePosition: 'left' | 'right';
  dataAutoId?: string;
}

const blk = 'recruitment-flow-card'

const RecruitmentFlowCard = ({
  id,
  title,
  description,
  image,
  imagePosition,
  dataAutoId
}: recruitmentFlowCardProps) => (
  <section className={bemClass([blk, { [imagePosition]: imagePosition }])}>
    <Image
      src={image}
      alt={`${id}-image`}
      className={bemClass([blk, 'step-image'])}
      data-auto-id={`${dataAutoId}_image`}
    />
    <div className={bemClass([blk,'text-block'])}>
      <Text tag="h2" className={bemClass([blk, 'title'])} dataAutoId={`${dataAutoId}_title`}>
        {title}
      </Text>
      <Text tag="p" typography="m" className={bemClass([blk, 'description'])} dataAutoId={`${dataAutoId}_desc`}>
        {description}
      </Text>
    </div>
  </section>
)

export default RecruitmentFlowCard
