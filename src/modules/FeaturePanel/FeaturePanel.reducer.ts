import { tFeaturePanelActions } from './FeaturePanel.actions'
import { featurePanelInitialState, IFeaturePanelReducerState } from './FeaturePanel.models'


const IFeaturePanelReducer = (state: IFeaturePanelReducerState = featurePanelInitialState, action: tFeaturePanelActions): IFeaturePanelReducerState => {
  switch (action.type) {
    case '@@FEATURE_PANEL/SET_ANNOUNCEMENT_POSTS':
      return {
        ...state, announcements: {
          ...state.announcements,
          posts: action.payload
        }
      }
    case '@@FEATURE_PANEL/SET_EXPLORE_POSTS':
     const exploreData = action.payload?.sort((a, b) => b.id - a.id);
      return {
        ...state, explores: {
          ...state.explores,
          posts: exploreData
        }
      }


    case '@@FEATURE_PANEL/SET_TAGS':
      let updatedTags = state.tags
      action.payload.forEach((tag) => {
        updatedTags.set(tag.slug, tag)
        updatedTags.set(tag.id, tag)
      })

      return {
        ...state,
        tags: new Map(updatedTags),
        announcements: {
          ...state.announcements
        }
      }

    case '@@FEATURE_PANEL/SET_ANNOUNCEMENT_UNREAD':
      return {
        ...state,
        announcements: {
          ...state.announcements,
          unread: action.payload
        }
      }
    case '@@FEATURE_PANEL/SET_EXPLORE_UNREAD':
      return {
        ...state,
        explores: {
          ...state.explores,
          unread: action.payload
        }
      }

    case '@@FEATURE_PANEL/SET_FEEDBACKS':
      return {
        ...state,
        feedbacks: {
          ...state.feedbacks,
          ...action.payload
        }
      }

    case '@@FEATURE_PANEL/ANNOUNCEMENTS/SET_FETCH_STATUS':
      return {
        ...state,
        announcements: {
          ...state.announcements,
          fetchStatus: action.payload
        }
      }

    case '@@FEATURE_PANEL/EXPLORES/SET_FETCH_STATUS':
      return {
        ...state,
        explores: {
          ...state.explores,
          fetchStatus: action.payload
        }
      }

    default:
      return state
  }
}

export default IFeaturePanelReducer