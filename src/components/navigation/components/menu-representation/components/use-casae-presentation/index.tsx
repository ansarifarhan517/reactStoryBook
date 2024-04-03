import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import Button from '@/components/button'

import productMile from '/public/product-mile.svg'
import productDelivery from '/public/product-delivery.svg'
import productOnDemand from '/public/product-on-demand.svg'
import productHaul from '/public/product-haul.svg'
import productDriverApp from '/public/product-driver-app.svg'

import './style.scss'

type useCaseRepresentationProps = {
  id?: string;
}

type imageData = {
  [any: string]: {
    image: StaticImageData;
    btnLabel: string;
    href: string;
  }
}

const useCaseData: imageData = {
  'use_case_pickup': {
    image: productMile,
    btnLabel: 'pickup',
    href: '/usecase/pickup'
  },
  'use_case_delivery': {
    image: productDelivery,
    btnLabel: 'delivery',
    href: '/usecase/delivery'
  },
  'use_case_pickup_and_delivery': {
    image: productOnDemand,
    btnLabel: 'pickup and delivery',
    href: '/usecase/pickup-delivery'
  },
  'use_case_line_haul': {
    image: productHaul,
    btnLabel: 'line haul',
    href: '/usecase/line-haul'
  },
  'use_case_end_to_end': {
    image: productDriverApp,
    btnLabel: 'end to end',
    href: '/usecase/end-to-end'
  },
}

const blk = 'use-case-representation'

const UseCasePresentation = ({ id = 'use_case_pickup' }: useCaseRepresentationProps) => {
  const { image, btnLabel, href } = useCaseData[id]
  return (
    <div className={blk}>
      <Image
        src={image}
        alt={btnLabel}
        className={bemClass([ blk, 'image' ])}
      />
      <div className={bemClass([ blk, 'footer' ])}>
        <Button
          asLink
          href={href}
          category="primary"
          className={bemClass([ blk, 'button' ])}
        >
          {btnLabel}
        </Button>
      </div>
    </div>
  )
}

export default UseCasePresentation
