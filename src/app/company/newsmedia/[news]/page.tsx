import PageCoverSection from '@/components/page-cover-section'

import { bemClass } from '@/utils'

import newsMediaBg from '/public/company-news-media-bg.webp'

import { metaData } from '../_data'

import FoundersBio from '..//_components/founders-bio'

import NewsDetailContent from '../_components/newsmedia-detail-content'

type newsDetailProps = {
  params: Record<string, string>
}

import './style.scss'

const blk = 'news-media-detail'

const NewsDetail = ({ params: { news } }: newsDetailProps) => (
  <>
    <PageCoverSection
      image={newsMediaBg}
      imageAlt="News and Media"
      className={bemClass([blk, 'cover-section'])}
      dataAutoId="news_media_detail_section_1"
    />
    {news === 'founders-bio' ? (
      <FoundersBio dataAutoId="news_media_detail_founders_section_2" />
    ) : (
      <NewsDetailContent news={news} dataAutoId={`news_media_detail_${news}_section_2`} />
    )}
  </>
)

const generateMetadata = async ({
  params: { news },
}: newsDetailProps) => {
  const { title: metaTitle, description } = metaData[news] || {
    title: 'LogiNext Pressroom',
    description: 'Get global news and insights on what\'s going on in LogiNext.'
  }
  const title = metaTitle

  const url = `https://www.loginextsolutions.com/company/newsmedia/${news}`

  return {
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
}

export {
  NewsDetail as default,
  generateMetadata
}
