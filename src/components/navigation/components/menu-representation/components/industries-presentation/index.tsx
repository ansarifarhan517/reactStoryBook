import Image from 'next/image'

import { bemClass } from '@/utils'

import indutriesPresentationConfig from './config'

import NavigationCard from '../navigation-card'

import './style.scss'

type indutriesRepresentationProps = {
  id?: string
}

const blk = 'industries-representation'

const IndutriesPresentation = ({ id = 'courier_express_and_parcel' }: indutriesRepresentationProps) => {
  const { caseStudy, business } = indutriesPresentationConfig[id]
  const { image, caption, href } = caseStudy
  return (
    <>
      <NavigationCard
        image={image}
        title="Case study"
        description={caption}
        link={href}
        className={bemClass([blk, 'case-study'])}
        dataAutoId={`${id}_case_study_card`}
      />
      <ul className={bemClass([blk, 'business'])}>
        {business.map(({ label, icon }, index) => (
          <li key={`${id}_business_${index}`} className={bemClass([blk, 'business-item'])}>
            <Image
              src={icon}
              alt=""
              height={42}
              width={42}
            />
            <span className={bemClass([blk, 'business-label'])}>{label}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
export default IndutriesPresentation
