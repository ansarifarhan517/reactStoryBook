import Image, { StaticImageData } from 'next/image'

import { bemClass } from '@/utils'

import productMile from '/public/product-mile.svg'
import productReverse from '/public/product-reverse.svg'
import productOnDemand from '/public/product-on-demand.svg'
import productHaul from '/public/product-haul.svg'
import productDriverApp from '/public/product-driver-app.svg'

import './style.scss'

const blk = 'platform-representation'

type platformRepresentationProps = {
  id?: string
}

type imageData = {
  [any: string]: StaticImageData
}

const imageMap: imageData = {
  'products_mile': productMile,
  'products_reverse': productReverse,
  'products_on_demand': productOnDemand,
  'products_haul': productHaul,
  'products_driver_app': productDriverApp,
}

const PlatformRepresentation = ({ id = 'products_mile' }: platformRepresentationProps) => {
  const img = imageMap[id]
  const isDriverApp = (id === 'products_driver_app')
  return (
    <div className={blk}>
      {!isDriverApp && (
        <div className={bemClass([blk, 'gray-bg'])} />
      )}
      <Image
        src={img}
        alt="Products mile"
        className={bemClass([
          blk,
          'image',
          { 'drive-app': isDriverApp }
        ])}
      />
    </div>
  )
}

export default PlatformRepresentation
