import { Metadata } from 'next'

import { bemClass } from '@/utils'

import Text from '@/components/text'
import CardGridLayout from '@/components/card-grid-layout'

import footerNavigation from '@/config/footer-navigation'

import SiteMapCard from './_components/site-map-card'

import './style.scss'

const blk = 'site-map'

const SiteMap = () => (
  <>
    <div className={bemClass([blk, 'cover-section'])}>
      <Text
        tag="h1"
        typography="xxxl"
        fontWeight="bold"
        color="white"
        className="slide-fade-in-delay-1"
      >
        Site Map
      </Text>
    </div>
    <CardGridLayout className={bemClass([blk, 'content'])}>
      {footerNavigation.map(({ id, label, menu = [], href = '/' }) => {
        if (id === 'blog' || id === 'pricing' || id === 'distinctive-benefits' || id === 'spotlight-content') {
          return (
            <></>
          )
        }
        return (
          <SiteMapCard key={id} title={label} menu={menu} href={href} />
        )
      })}
    </CardGridLayout>
  </>
)

const title = 'Loginext Solutions | Sitemap'
const description = 'Navigate Loginext Solutions with Ease - Explore Our Sitemap for Quick Access to Content'
const url = 'https://www.loginextsolutions.com/sitemap'

const metadata: Metadata = {
  title,
  description,
  openGraph: {
    locale: 'en_US',
    type: 'website',
    title,
    description,
    url,
    siteName: 'loginextsolutions',
  },
  twitter: {
    title,
    description,
    card: 'summary'
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  SiteMap as default,
  metadata
}
