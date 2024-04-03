import Image from 'next/image'

import SectionTitle from '../section-title'

import brandImages from '@/config/empowering-brands'
import { bemClass } from '@/utils'

import LoadWhenInView from '../load-when-in-view'

import './style.scss'

type loginextEmpowerBrandsProps = {
  dataAutoId?: string
}

const blk = 'loginext-empower-brands'

const empowersBrands = [
  ...brandImages['couriers-express-parcels'],
  ...brandImages['retail-and-ecommerce'],
  ...brandImages['consumer-packages'],
  ...brandImages['food-beverages'],
  ...brandImages['transportation'],
]

const LoginextEmpowerBrands = ({ dataAutoId }: loginextEmpowerBrandsProps) => (
  <div className={blk} data-auto-id={dataAutoId}>
    <SectionTitle
      category="dual-reverse"
      className={bemClass([blk, 'section-title'])}
      dataAutoId={`${dataAutoId}_title`}
    >
      LogiNext Empowers Brands
    </SectionTitle>
    <LoadWhenInView>
      <ul className={bemClass([blk, 'brand-list'])}>
        {empowersBrands.map(({ id, image }) => (
          <li key={id} className={bemClass([blk, 'brand-list-item'])}>
            <Image
              src={image}
              alt={id}
              className={bemClass([blk, 'brand-image'])}
              loading="lazy"
              data-auto-id={`${dataAutoId}_image_${id}`}
            />
          </li>
        ))}
      </ul>
    </LoadWhenInView>
  </div>
)

export default LoginextEmpowerBrands
