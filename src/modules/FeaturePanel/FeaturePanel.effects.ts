import { IFetchAnnouncements, IFetchExplores, IFetchFeedbacks, tFeaturePanelActions } from './FeaturePanel.actions'
import { call, all, put, takeLatest } from 'redux-saga/effects'
import axios, { axiosWP } from '../../utils/axios'
import apiMappings from '../../utils/apiMapping'
import { AxiosResponse } from 'axios'
import { IWPPost, IWPTag } from '../../utils/Wordpress.interfaces'
import { getPostsFilterTags, tagSlugToIdMapping } from './FeaturePanel.constants'
import { IFeaturePanelFeedbackResponse } from './FeaturePanel.models'
import { ILogiAPIResponse } from '../../utils/api.interfaces'
import moment from 'moment-timezone'

export function* fetchAnnouncements() {
  try {
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/ANNOUNCEMENTS/SET_FETCH_STATUS', payload: 'loading' })
    const filterTags = getPostsFilterTags('announcement')
    const { data: posts }: AxiosResponse<IWPPost[]> = yield call(axiosWP.get, apiMappings.wordpress.getPosts, {
      params: {
        ...filterTags
      }
    })

    yield put<tFeaturePanelActions>({
      type: '@@FEATURE_PANEL/SET_ANNOUNCEMENT_POSTS', payload: posts.filter((post) => {
        const set = new Set(post.tags)
        return set.has(tagSlugToIdMapping.new) || set.has(tagSlugToIdMapping.update)
      })
    })

    const includeTags = new Set<number>()
    let isUnread = false

    posts.forEach((post) => {
      if (Number(moment.utc(post.date_gmt).format('x')) > Number(localStorage.getItem('announcementLastVisitDate') || '0')) {
        isUnread = true
      }

      post.tags.forEach((tag) => {
        includeTags.add(tag)
      })
    })

    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/SET_ANNOUNCEMENT_UNREAD', payload: isUnread })
    if (includeTags.size === 0) {
      return
    }

    const config = {
      params: {
        include: Array.from(includeTags).join(','),
        per_page: 100
      }
    }

    const { data: tags }: AxiosResponse<IWPTag[]> = yield call(axiosWP.get, apiMappings.wordpress.getTags, config)

    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/SET_TAGS', payload: tags })
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/ANNOUNCEMENTS/SET_FETCH_STATUS', payload: 'completed' })
  } catch (error) {
    console.log('Failed to fetch Announcements (What\'s new: ', error)
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/ANNOUNCEMENTS/SET_FETCH_STATUS', payload: 'notStarted' })
  }
}

export function* watchFetchAnnouncements() {
  yield takeLatest<IFetchAnnouncements>('@@FEATURE_PANEL/FETCH_ANNOUNCEMENTS', fetchAnnouncements)
}

function* fetchExplores() {
  try {
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/EXPLORES/SET_FETCH_STATUS', payload: 'loading' })
    const filterTags = getPostsFilterTags('explore')
    const { data: posts }: AxiosResponse<IWPPost[]> = yield call(axiosWP.get, apiMappings.wordpress.getPosts, {
      params: {
        ...filterTags
      }
    })

    yield put<tFeaturePanelActions>({
      type: '@@FEATURE_PANEL/SET_EXPLORE_POSTS', payload:
        posts.filter((post) => {
          const set = new Set(post.tags)
          return set.has(tagSlugToIdMapping.revisit) || set.has(tagSlugToIdMapping.explore)
        }).sort(() => .5 - Math.random())
    })

    const includeTags = new Set<number>()
    let isUnread = false
    posts.forEach((post) => {
      if (Number(moment.utc(post.date_gmt).format('x')) > Number(localStorage.getItem('exploreLastVisitDate') || '0')) {
        isUnread = true
      }
      post.tags.forEach((tag) => {
        includeTags.add(tag)
      })
    })

    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/SET_EXPLORE_UNREAD', payload: isUnread })

    if (includeTags.size === 0) {
      return
    }

    const config = {
      params: {
        include: Array.from(includeTags).join(','),
        per_page: 100
      }
    }

    const { data: tags }: AxiosResponse<IWPTag[]> = yield call(axiosWP.get, apiMappings.wordpress.getTags, config)

    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/SET_TAGS', payload: tags })
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/EXPLORES/SET_FETCH_STATUS', payload: 'completed' })
  } catch (error) {
    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/EXPLORES/SET_FETCH_STATUS', payload: 'notStarted' })
    console.log('Failed to fetch Explores: ', error)
  }
}

function* watchFetchExplores() {
  yield takeLatest<IFetchExplores>('@@FEATURE_PANEL/FETCH_EXPLORES', fetchExplores)
}

function* fetchFeedbacks() {
  try {
    const { data: { data: feedbacks } }: AxiosResponse<ILogiAPIResponse<IFeaturePanelFeedbackResponse[]>> =
      yield call(axios.get, apiMappings.featurePanel.getUserPostFeedback)

    const feedbackPayload: Record<number, boolean> = {}

    feedbacks.forEach(({ articleId, liked }) => {
      feedbackPayload[articleId] = liked
    })

    yield put<tFeaturePanelActions>({ type: '@@FEATURE_PANEL/SET_FEEDBACKS', payload: feedbackPayload })
  } catch (errorResponse) {
    console.log('Fetching User Post Feedbacks failed: ', errorResponse, errorResponse?.response?.data)
  }
}

function* watchFetchFeedbacks() {
  yield takeLatest<IFetchFeedbacks>('@@FEATURE_PANEL/FETCH_FEEDBACKS', fetchFeedbacks)
}

export function* featurePanelSaga() {
  yield all([watchFetchAnnouncements(), watchFetchExplores(), watchFetchFeedbacks()])
}