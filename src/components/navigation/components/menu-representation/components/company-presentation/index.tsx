import Image from 'next/image'

import { bemClass } from '@/utils'

import weAreAtLoginext from '/public/company-navigation/we-are-at-loginext.webp'
import ourInvestor from '/public/company-navigation/our-investor.webp'
import contactUsMap from '/public/company-navigation/contact-us-map.webp'
import newsAndMedia from '/public/company-navigation/news-and-media.webp'

import NavigationCard from '../navigation-card'

import './style.scss'

type companyPresentationProps = {
  id?: string
}

const blk = 'company-representation'

const CompanyPresentation = ({ id }: companyPresentationProps) => {
  switch (id) {
  case 'company_about_us': {
    return (
      <div className={blk}>
        <NavigationCard
          image={weAreAtLoginext}
          description="#WeAreLogiNext"
          link="/company/aboutus"
          dataAutoId="company_about_us_card_1"
        />
        <NavigationCard
          image={ourInvestor}
          description="Our Investors"
          dataAutoId="company_about_us_card_2"
        />
      </div>
    )
  }
  case 'company_contact_us': {
    return (
      <Image
        src={contactUsMap}
        className={bemClass([blk, 'contact-us-map'])}
        alt="Loginext contact us map"
      />
    )
  }
  case 'company_news_media': {
    return (
      <NavigationCard
        image={newsAndMedia}
        description="News and Media"
        link="/company/newsmedia"
        dataAutoId="company_news_media_card_1"
      />
    )
  }
  default: {
    return null
  }
  }
}

export default CompanyPresentation
