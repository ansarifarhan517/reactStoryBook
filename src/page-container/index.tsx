// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { lazy, Suspense } from 'react'
import { HocForm } from '@components'
import {
  Route, Routes, Navigate, Outlet,
} from 'react-router-dom'

import './style.scss'

const CaseStudyCategprySearch = lazy(async () => await import(/* webpackChunkName: "caseStudyCategorySearch" */'../pages/case-study-category/search'))
const CaseStudyCategpryCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "caseStudyCategoryCreate" */'../pages/case-study-category/create')
  return HocForm(Create, options)
})

const CaseStudySubCategprySearch = lazy(async () => await import(/* webpackChunkName: "caseStudySubCategorySearch" */'../pages/case-study-sub-category/search'))
const CaseStudySubCategpryCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "caseStudySubCategoryCreate" */'../pages/case-study-sub-category/create')
  return HocForm(Create, options)
})

const CaseStudySearch = lazy(async () => await import(/* webpackChunkName: "caseStudySearch" */'../pages/case-study/search'))
const CaseStudyCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "caseStudyCreate" */ '../pages/case-study/create')
  return HocForm(Create, options)
})

const WhitePaperSearch = lazy(async () => await import(/* webpackChunkName: "whitePaperSearch" */'../pages/white-paper/search'))
const WhitePaperCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "whitePaperCreate" */'../pages/white-paper/create')
  return HocForm(Create, options)
})

const MediaCategorySearch = lazy(async () => await import(/* webpackChunkName: "mediaCategorySearch" */'../pages/media-category/search'))
const MediaCategoryCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "mediaCategoryCreate" */'../pages/media-category/create')
  return HocForm(Create, options)
})

const MediaSearch = lazy(async () => await import(/* webpackChunkName: "mediaSearch" */'../pages/media/search'))
const MediaCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "mediaCreate" */'../pages/media/create')
  return HocForm(Create, options)
})

const NewsCategorySearch = lazy(async () => await import(/* webpackChunkName: "newsCategorySearch" */'../pages/news-category/search'))
const NewsCategoryCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "newsCategoryCreate" */'../pages/news-category/create')
  return HocForm(Create, options)
})

const NewsSearch = lazy(async () => await import(/* webpackChunkName: "newsSearch" */'../pages/news/search'))
const NewsCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "newsCreate" */'../pages/news/create')
  return HocForm(Create, options)
})

const PrSubscriberSearch = lazy(async () => await import(/* webpackChunkName: "prSubscriberSearch" */'../pages/pr-subscriber/search'))
const PrSubscriberCreate = lazy(async () => await import(/* webpackChunkName: "prSubscriberCreate" */'../pages/pr-subscriber/create'))

const RelatedBlogSearch = lazy(async () => await import(/* webpackChunkName: "relatedBlogsSearch" */'../pages/related-blogs/search'))
const RelatedBlogCreate = lazy(async () => await import(/* webpackChunkName: "relatedBlogsCreate" */'../pages/related-blogs/create'))

const InfoGraphicSearch = lazy(async () => await import(/* webpackChunkName: "inforGraphicSearch" */'../pages/infographic/search'))
const InfoGraphicCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "inforGraphicCreate" */'../pages/infographic/create')
  return HocForm(Create, options)
})

const AwardAndRecognitionSearch = lazy(async () => await import(/* webpackChunkName: "awardAndRecognitionSearch" */'../pages/awards-recognition/search'))
const AwardAndRecognitionCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "awardAndRecognitionCreate" */'../pages/awards-recognition/create')
  return HocForm(Create, options)
})

const VodcastSearch = lazy(async () => await import(/* webpackChunkName: "vodcastSearch" */'../pages/vodcast/search'))
const VodcastCreate = lazy(async () => await import(/* webpackChunkName: "vodcastCreate" */'../pages/vodcast/create'))

const EventSearch = lazy(async () => await import(/* webpackChunkName: "eventSearch" */'../pages/event/search'))
const EventCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "eventCreate" */'../pages/event/create')
  return HocForm(Create, options)
})

const TestimonialSearch = lazy(async () => await import(/* webpackChunkName: "testimonialSearch" */'../pages/testimonial/search'))
const TestimonialCreate = lazy(async () => await import(/* webpackChunkName: "testimonialCreate" */'../pages/testimonial/create'))

const NewsTickerSearch = lazy(async () => await import(/* webpackChunkName: "NewsTickerSearch" */'../pages/news-ticker/search'))
const NewsTickerCreate = lazy(async () => await import(/* webpackChunkName: "NewsTickerCreate" */'../pages/news-ticker/create'))

const TagManagerSearch = lazy(async () => await import(/* webpackChunkName: "TagManagerSearch" */'../pages/tag-manager/search'))
const TagManagerCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "whitePaperSearch" */'../pages/tag-manager/create')
  return HocForm(Create, options)
})

const JobCategorySearch = lazy(async () => await import(/* webpackChunkName: "JobCategorySearch" */'../pages/job-category/search'))
const JobCategoryCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "JobCategoryCreate" */'../pages/job-category/create')
  return HocForm(Create, options)
})

const JobRoleSearch = lazy(async () => await import(/* webpackChunkName: "JobRoleSearch" */'../pages/job-role/search'))
const JobRoleCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "JobRoleCreate" */'../pages/job-role/create')
  return HocForm(Create, options)
})

const JobLocationSearch = lazy(async () => await import(/* webpackChunkName: "JobLocationSearch" */'../pages/job-location/search'))
const JobLocationCreate = lazy(async () => {
  const { Create, options } = await import(/* webpackChunkName: "JobLocationCreate" */'../pages/job-location/create')
  return HocForm(Create, options)
})

const FaqSearch = lazy(async () => await import(/* webpackChunkName: "FaqSearch" */'../pages/faq/search'))
const FaqCreate = lazy(async () => await import(/* webpackChunkName: "FaqCreate" */'../pages/faq/create'))

const LandingPagesSearch = lazy(async () => await import(/* webpackChunkName: "LandingPagesSearch" */'../pages/landing-page/search'))
const LandingPagesCreate = lazy(async () => await import(/* webpackChunkName: "LandingPagesCreate" */'../pages/landing-page/create'))

const PageContainer = () => (
  <div className="page-container">
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate replace to="case-study-category/search" />} />
        <Route path="case-study-category" element={<Outlet />}>
          <Route index element={<CaseStudyCategprySearch />} />
          <Route path=":id" element={<CaseStudyCategpryCreate />} />
        </Route>
        <Route path="case-study-sub-category" element={<Outlet />}>
          <Route index element={<CaseStudySubCategprySearch />} />
          <Route path=":id" element={<CaseStudySubCategpryCreate />} />
        </Route>
        <Route path="case-study" element={<Outlet />}>
          <Route index element={<CaseStudySearch />} />
          <Route path=":id" element={<CaseStudyCreate />} />
        </Route>
        <Route path="white-paper" element={<Outlet />}>
          <Route index element={<WhitePaperSearch />} />
          <Route path=":id" element={<WhitePaperCreate />} />
        </Route>
        <Route path="media-category" element={<Outlet />}>
          <Route index element={<MediaCategorySearch />} />
          <Route path=":id" element={<MediaCategoryCreate />} />
        </Route>
        <Route path="media" element={<Outlet />}>
          <Route index element={<MediaSearch />} />
          <Route path=":id" element={<MediaCreate />} />
        </Route>
        <Route path="news-category" element={<Outlet />}>
          <Route index element={<NewsCategorySearch />} />
          <Route path=":id" element={<NewsCategoryCreate />} />
        </Route>
        <Route path="news" element={<Outlet />}>
          <Route index element={<NewsSearch />} />
          <Route path=":id" element={<NewsCreate />} />
        </Route>
        <Route path="pr-subscriber" element={<Outlet />}>
          <Route index element={<PrSubscriberSearch />} />
          <Route path=":id" element={<PrSubscriberCreate />} />
        </Route>
        <Route path="related-blog" element={<Outlet />}>
          <Route index element={<RelatedBlogSearch />} />
          <Route path=":id" element={<RelatedBlogCreate />} />
        </Route>
        <Route path="infographic" element={<Outlet />}>
          <Route index element={<InfoGraphicSearch />} />
          <Route path=":id" element={<InfoGraphicCreate />} />
        </Route>
        <Route path="award-recognition" element={<Outlet />}>
          <Route index element={<AwardAndRecognitionSearch />} />
          <Route path=":id" element={<AwardAndRecognitionCreate />} />
        </Route>
        <Route path="vodcast" element={<Outlet />}>
          <Route index element={<VodcastSearch />} />
          <Route path=":id" element={<VodcastCreate />} />
        </Route>
        <Route path="event" element={<Outlet />}>
          <Route index element={<EventSearch />} />
          <Route path=":id" element={<EventCreate />} />
        </Route>
        <Route path="testimonial" element={<Outlet />}>
          <Route index element={<TestimonialSearch />} />
          <Route path=":id" element={<TestimonialCreate />} />
        </Route>
        <Route path="news-ticker" element={<Outlet />}>
          <Route index element={<NewsTickerSearch />} />
          <Route path=":id" element={<NewsTickerCreate />} />
        </Route>
        <Route path="tag-manager" element={<Outlet />}>
          <Route index element={<TagManagerSearch />} />
          <Route path=":id" element={<TagManagerCreate />} />
        </Route>
        <Route path="job-category" element={<Outlet />}>
          <Route index element={<JobCategorySearch />} />
          <Route path=":id" element={<JobCategoryCreate />} />
        </Route>
        <Route path="job-role" element={<Outlet />}>
          <Route index element={<JobRoleSearch />} />
          <Route path=":id" element={<JobRoleCreate />} />
        </Route>
        <Route path="job-location" element={<Outlet />}>
          <Route index element={<JobLocationSearch />} />
          <Route path=":id" element={<JobLocationCreate />} />
        </Route>
        <Route path="faq" element={<Outlet />}>
          <Route index element={<FaqSearch />} />
          <Route path=":id" element={<FaqCreate />} />
        </Route>
        <Route path="landing-page" element={<Outlet />}>
          <Route index element={<LandingPagesSearch />} />
          <Route path=":id" element={<LandingPagesCreate />} />
        </Route>
      </Routes>
    </Suspense>
  </div>
)

export default PageContainer
