import { Dispatch, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ILogiAPIResponse } from '../../utils/api.interfaces'
import apiMappings from '../../utils/apiMapping'
import axios from '../../utils/axios'
import { tFeaturePanelActions } from './FeaturePanel.actions'
import { IFeaturePanelReadUnreadResponse } from './FeaturePanel.models'

const fetchWordPressToken = async () => {
  // const userAccessInfo = JSON.parse(localStorage.getItem('userAccessInfo') || '{}')

  // userAccessInfo.wpAccessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvc3VwcG9ydC5sb2dpbmV4dHNvbHV0aW9ucy5jb20iLCJpYXQiOjE2MTMzOTIzOTUsIm5iZiI6MTYxMzM5MjM5NSwiZXhwIjoxNjEzOTk3MTk1LCJkYXRhIjp7InVzZXIiOnsiaWQiOiI4In19fQ.wt2QnbhrwfrJqG2VaWHUWdc4uAJse0zzGo4H8AggM5g'
  // localStorage.setItem('userAccessInfo', JSON.stringify(userAccessInfo))
}

const fetchReadUnreadData = async () => {
  try {
    const { data: { data: readUnreadData } } = await axios.get<ILogiAPIResponse<IFeaturePanelReadUnreadResponse[]>>(apiMappings.featurePanel.getReadUnreadData)

    const readUnreadDataMap: Record<'announcement' | 'explore', number> = {
      announcement: new Date('1990-01-01').getTime(),
      explore: new Date('1990-01-01').getTime()
    }

    readUnreadData.forEach(({ articleCategory, lastVisitDate }) => {
      readUnreadDataMap[articleCategory] = lastVisitDate
    })

    localStorage.setItem('announcementLastVisitDate', String(readUnreadDataMap['announcement']))
    localStorage.setItem('exploreLastVisitDate', String(readUnreadDataMap['explore']))

  } catch (errorResponse) {
    console.log('Failed to fetch Feature Panel Read-Unread data: ', errorResponse, errorResponse.response)
  }
  return true
}

const useFeaturePanel = () => {
  const dispatch = useDispatch<Dispatch<tFeaturePanelActions>>()

  const fetchData = useCallback(async () => {
    fetchWordPressToken()

    if (!localStorage.getItem('announcementLastVisitDate') || !localStorage.getItem('exploreLastVisitDate')) {
      await fetchReadUnreadData()
    }

    dispatch({ type: '@@FEATURE_PANEL/FETCH_ANNOUNCEMENTS' })
    dispatch({ type: '@@FEATURE_PANEL/FETCH_EXPLORES' })
    dispatch({ type: '@@FEATURE_PANEL/FETCH_FEEDBACKS' })
  }, [])

  useEffect(() => {
    fetchData()
  }, [])
}

export default useFeaturePanel