import Image, { StaticImageData } from 'next/image'

import InViewSlide from '../in-view-slide'
import Container from '../container'
import SectionTitle from '../section-title'

import { bemClass } from '@/utils'

import './style.scss'

type empoweringBrandsProps = {
  brandsImages: {
    id: string;
    image: StaticImageData;
  }[];
  industry: string
  hideTitle?: boolean
  className?: string
  dataAutoId?: string
}

const blk = 'empowering-brands'

const EmpoweringBrands = ({
  brandsImages,
  industry,
  hideTitle = false,
  className,
  dataAutoId
}: empoweringBrandsProps) => (
  <Container className={bemClass([blk])} dataAutoId={dataAutoId}>
    <>
      {!hideTitle && (
        <SectionTitle
          category="dual"
          className={bemClass([blk, 'title'])}
          dataAutoId={`${dataAutoId}_title`}
        >
          Empowering Brands
        </SectionTitle>
      )}
      <InViewSlide className={bemClass([blk, 'list', {}, className])}>
        {brandsImages.map(({ id, image },index) => (
          <Image
            key={id}
            src={image}
            alt={id}
            className={bemClass([blk, 'brand-image', [industry]])}
            loading="lazy"
            data-auto-id={`${dataAutoId}_image_${index}`}
          />
        ))}
      </InViewSlide>
    </>
  </Container>
)

export default EmpoweringBrands
