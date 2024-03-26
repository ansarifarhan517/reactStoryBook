import React from 'react'
import withRedux from '../../../utils/redux/withRedux'
import { UnreadIndicator } from './styles'
import { Position } from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'

const HelpUnreadIndicator = () => {
  const announcementUnread = useTypedSelector(state => state.featurePanel.announcements.unread)
  const exploresUnread = useTypedSelector(state => state.featurePanel.explores.unread)

  return ((announcementUnread || exploresUnread) ? <Position type='absolute' top='1px' right='-1px'>
    <UnreadIndicator size={10} />
  </Position> : <div />)
}

export default withRedux(HelpUnreadIndicator)