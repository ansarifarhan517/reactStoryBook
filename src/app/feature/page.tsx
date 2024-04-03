
import { Metadata } from 'next'

import { bemClass } from '@/utils'

import FeatureHeader from './_component/feature-header'
import FeatureCards from './_component/feature-cards'

import './style.scss'

const blk = 'feature-gallery'

const FeatureGallery = () => (
  <>
    <section
      className= {bemClass([blk,'cover-section'])}
    >
      <FeatureHeader />
    </section>
    <FeatureCards />
  </>
)

const title = 'All Features'
const description = `Best last mile delivery management
software for last mile logistics automation, optimization and delivery route planning with real time dispatch management,
resource allocation & live tracking, reducing
last mile delivery cost by 20%. Sign up for LogiNext Mile today!`
const url = 'https://www.loginextsolutions.com/feature'

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
    card: 'summary',
  },
  metadataBase: new URL('https://www.loginextsolutions.com'),
}

export {
  FeatureGallery as default,
  metadata
}
