'use client'
import { useEffect, useState } from 'react'

import { get } from '@/api'

import SectionTitle from '@/components/section-title'
import Text from '@/components/text'
import Slider from '@/components/slider'

import LandingPageRelatedResourceItem from '../landing-page-related-resource-item'
import Spinner from '../spinner'

import { bemClass } from '@/utils'

import './style.scss'

type relatedResourcesProps = {
  slug: string
  dataAutoId?: string
}

const blk = 'related-resources'

const LandingPageRelatedResources = ({
  slug,
  dataAutoId,
}: relatedResourcesProps) => {
  const [posts, setPost] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const {
        data: { data },
      } = await get('/api/landing-pages-related-resources', {
        params: {
          slug,
        },
      })
      setLoading(false)
      setPost(data)
    }
    getData()
  }, [slug])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className={blk} data-auto-id={dataAutoId}>
      <div className={bemClass([blk, 'header'])}>
        <SectionTitle category="primary" fontWeight="thin" dataAutoId={`${dataAutoId}_title`}>
          Related Resources
        </SectionTitle>
        <Text
          tag="p"
          typography="l"
          fontWeight="thin"
          color="gray-darker"
          className={bemClass([blk, 'description'])}
          dataAutoId={`${dataAutoId}_description`}
        >
          Read our most popular blogs from the field of delivery management and
          logistics automation.
        </Text>
      </div>
      {posts.length && (
        <Slider id="related-sources" dataAutoId={`${dataAutoId}_slider`}>
          {posts.map((data: any, index: number) => {
            const { link, excerpt = {}, _embedded = {} } = data
            const { rendered: blogDescription } = excerpt
            const [{ source_url }] = _embedded['wp:featuredmedia'] || {}
            return (
              <li key={data.id}>
                <LandingPageRelatedResourceItem
                  link={link}
                  image={source_url}
                  description={blogDescription}
                  dataAutoId={`${dataAutoId}_item_${index}`}
                />
              </li>
            )
          })}
        </Slider>
      )}
    </div>
  )
}

export default LandingPageRelatedResources
