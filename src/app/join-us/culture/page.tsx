import { Metadata } from 'next'
import dynamic from 'next/dynamic'

import PageCoverSection from '@/components/page-cover-section'
import CeoSection from '@/components/ceo-section'

import joinUsCompanyCulture from '/public/company-culture-bg.svg'
import CultureHeader from './_components/culture-header'
import PhilosophyHeader from './_components/philosophy-header'
import EmbraceSection from './_components/embrace-section'

const PhilosophySection = dynamic(() => import('./_components/philosophy-section'), {
  loading: () => <p>Loading...</p>,
})

import './style.scss'

const blk = 'company-culture-cover-section'

const Companyculture = () => (
  <>
    <PageCoverSection
      image={joinUsCompanyCulture}
      imageAlt="join us company culture"
      className={blk}
      dataAutoId="company_culture"
    >
      <CultureHeader dataAutoId="company_culture_section_1" />
    </PageCoverSection>
    <PhilosophyHeader dataAutoId="company_culture_section_2" />
    <PhilosophySection dataAutoId="company_culture_section_3" />
    <EmbraceSection dataAutoId="company_culture_section_4" />
    <CeoSection dataAutoId="company_culture_section_5" />
  </>
)

const title = 'LogiNext | Company Culture | Career in Logistics'
const description = `Undertand LogiNext's company culture and lets work together towards a efficient and 
                      reliable logistics world. Read more about us in the company culture section.`
const url = 'https://www.loginextsolutions.com/join-us/culture'

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

export { Companyculture as default, metadata }
