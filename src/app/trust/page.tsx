import { Metadata } from 'next'

import PausedAnimationCoverPage from '@/components/paused-animation-cover-page'

import './style.scss'

const blk = 'trust-page-iframe'

const Trust = () => (
  <>
    <PausedAnimationCoverPage />
    <div className={blk}>
      <iframe width="100%" height="2550px" src="https://loginextsolutions.statuspage.io/" />
    </div>
  </>
)

const title = 'LogiNext Trust | Loginext'
const description = 'Work towards a common goal to disrupt the most unorganised industry Logistics'
const url = 'https://www.loginextsolutions.com/trust'

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
  Trust as default,
  metadata
}
