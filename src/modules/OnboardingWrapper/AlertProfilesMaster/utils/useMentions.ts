import React from 'react'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'

const useMentions = () => {
  const tags = useTypedSelector(state => state.settings.alertProfilesMaster.settings.tags)

  const mentions = React.useMemo(() => {
    if (!tags) {
      return {
        suggestionsfromAPI: [], suggestionsValueMap: {}, suggesstionsProp: [], mentionProp: {
          separator: ' ',
          trigger: '@',
          suggestions: []
        }
      }
    }

    const suggestionsfromAPI = tags.alertKeys.map(({ alertTagLabelValue, alertTagKey }) => ({
      text: alertTagLabelValue,
      value: alertTagKey.substring(1, alertTagKey.length - 1),
      url: '#'
    }))

    const suggestionsValueMap: Record<string, string> = {}
    const suggesstionsProp = suggestionsfromAPI.map((m) => {
      suggestionsValueMap[m.text] = m.value
      return { text: m.text, value: m.text, url: m.url }
    })

    return {
      suggestionsfromAPI, suggestionsValueMap, suggesstionsProp, mentionProp: {
        separator: ' ',
        trigger: '@',
        suggestions: [...suggesstionsProp]
      }
    }
  }, [tags])

  return mentions
}

export default useMentions

