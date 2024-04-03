import { Metadata } from 'next'

import PageCoverSection from '@/components/page-cover-section'
import PageCoverSectionContent from '@/components/page-cover-section-content'
import ModalTriggerButton from '@/components/modal-trigger-button'

import { bemClass } from '@/utils'

import newsMediaBg from '/public/company-news-media-bg.webp'

import NewsMediaContent from './_components/newsmedia-content'

import './style.scss'
import BouncingArrow from '@/components/bouncing-arrow'

const blk = 'news-media'

const NewsMedia = () => (
  <>
    <PageCoverSection
      image={newsMediaBg}
      imageAlt="News and Media"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="news_media_section_1"
    >
      <PageCoverSectionContent
        title="NEWS & MEDIA"
        description="Get global news and insights on what's going on in LogiNext."
        fluid
        className={bemClass([blk, 'cover-content'])}
        dataAutoId="news_media_section_1_header"
      >
        <ModalTriggerButton
          modalType="join-pr-list"
          category="primary"
          size="large"
          dataAutoId="news_media_section_1_join_our_pr_list"
        >
          Join our PR list
        </ModalTriggerButton>
        <BouncingArrow id="news" dataAutoId="news_media_section_1_bouncing_arrow" />
      </PageCoverSectionContent>
    </PageCoverSection>
    <NewsMediaContent dataAutoId="news_media_section_2" />
  </>
)

const title = 'LogiNext | News and Media | Latest Logistics Insights'
const description = 'Find news related to LogiNext\'s product upgrade, growth story, partnerships, client acquisition, and thought leadership by visiting our press release section.'
const url = 'https://www.loginextsolutions.com/company/newsmedia'

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
  NewsMedia as default,
  metadata
}

