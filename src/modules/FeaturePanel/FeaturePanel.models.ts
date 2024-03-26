import { IWPPost, IWPTag } from '../../utils/Wordpress.interfaces';

export interface IFeaturePanelReducerState {
  tags: Map<string | number, IWPTag>
  announcements: {
    posts: IWPPost[]
    postsMap: Record<number, IWPPost>
    unread: boolean
    fetchStatus: 'notStarted' | 'loading' | 'completed'
  }
  explores: {
    posts: IWPPost[]
    postsMap: Record<number, IWPPost>
    unread: boolean
    fetchStatus: 'notStarted' | 'loading' | 'completed'
  }
  feedbacks: Record<number, boolean>
}

export const featurePanelInitialState: IFeaturePanelReducerState = {
  tags: new Map(),
  announcements: {
    posts: [],
    postsMap: {},
    unread: false,
    fetchStatus: 'notStarted'
  },
  explores: {
    posts: [],
    postsMap: {},
    unread: false,
    fetchStatus: 'notStarted'
  },
  feedbacks: {}
}

export interface IFeaturePanelReadUnreadResponse {
  userId: number
  lastVisitDate: number
  articleCategory: 'announcement' | 'explore'
}

export interface IFeaturePanelFeedbackResponse {
  userId: number
  articleId: string
  liked: boolean
  articleCategory: 'announcement' | 'explore'
}