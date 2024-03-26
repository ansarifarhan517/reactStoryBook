import { IWPPost, IWPTag } from '../../utils/Wordpress.interfaces';

export interface IFetchAnnouncements {
  readonly type: '@@FEATURE_PANEL/FETCH_ANNOUNCEMENTS'
}

export interface IFetchExplores {
  readonly type: '@@FEATURE_PANEL/FETCH_EXPLORES'
}

interface ISetAnnouncementPosts {
  readonly type: '@@FEATURE_PANEL/SET_ANNOUNCEMENT_POSTS'
  payload: IWPPost[]
}
interface ISetExplorePosts {
  readonly type: '@@FEATURE_PANEL/SET_EXPLORE_POSTS'
  payload: IWPPost[]
}


interface ISetTags {
  readonly type: '@@FEATURE_PANEL/SET_TAGS'
  payload: IWPTag[]
}

interface ISetAnnouncementUnread {
  readonly type: '@@FEATURE_PANEL/SET_ANNOUNCEMENT_UNREAD'
  payload: boolean
}

interface ISetExploreUnread {
  readonly type: '@@FEATURE_PANEL/SET_EXPLORE_UNREAD'
  payload: boolean
}

export interface IFetchFeedbacks {
  readonly type: '@@FEATURE_PANEL/FETCH_FEEDBACKS'
}

interface ISetFeedbacks {
  readonly type: '@@FEATURE_PANEL/SET_FEEDBACKS'
  payload: Record<number, boolean>
}

interface ISetAnnouncementsFetchStatus {
  readonly type: '@@FEATURE_PANEL/ANNOUNCEMENTS/SET_FETCH_STATUS'
  payload: 'notStarted' | 'loading' | 'completed'
}
interface ISetExploresFetchStatus {
  readonly type: '@@FEATURE_PANEL/EXPLORES/SET_FETCH_STATUS'
  payload: 'notStarted' | 'loading' | 'completed'
}

export type tFeaturePanelActions =
  | IFetchAnnouncements
  | IFetchExplores
  | ISetAnnouncementPosts
  | ISetExplorePosts
  | ISetTags
  | ISetAnnouncementUnread
  | ISetExploreUnread
  | ISetFeedbacks
  | IFetchFeedbacks
  | ISetAnnouncementsFetchStatus
  | ISetExploresFetchStatus