import React from 'react'
import styled, { ThemeProvider } from 'styled-components'

import { Position, FontIcon } from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import withRedux from '../../../utils/redux/withRedux'
import { theme } from '../../../utils/theme'
import { UnreadIndicator } from './styles'

interface IFeaturePanelTabsProps {
  selected: string
  data: {
    id: string
    label: string
    icon?: string
  }[]
}

interface ITabProps {
  primary?: boolean
}

const Tab = styled.div<ITabProps>`
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #abacba;
  border-left: none;
  flex-basis: 100%;
  background-color: white;
  height: 40px;
  position: relative;
  cursor: pointer;

  &:last-child {
    border-right: none;
  }

  ${({ primary, theme }) => primary && `
    background-color: ${theme?.colors?.primary?.main};
    color: white;
    cursor: default;
    border: 1px solid ${theme?.colors?.primary?.main};

    :after {
      content: '';
      width: 10px;
      height: 10px;
      background-color: ${theme?.colors?.primary?.main};
      z-index: 999;
      position: absolute;
      bottom: -6px;
      transform: rotate(45deg);
    }
  `}

  .ui-library-icons {
    padding-right: 5px;
    ${({ primary }) => primary ? 'color: white;' : 'color: inherit;'}
  }
`

const FeaturePanelTabs = ({ data, selected }: IFeaturePanelTabsProps) => {
  const announcementsUnread = useTypedSelector(state => state.featurePanel.announcements.unread)
  const exploresUnread = useTypedSelector(state => state.featurePanel.explores.unread)

  return <ThemeProvider theme={theme} >
    <Position type='sticky' top='0' zIndex='1000'
      display='flex' justifyContent='space-evenly' alignItems='center' >

      {data.map(({ label, id, icon }) => (
        <Tab key={id} id={id} primary={selected === id} >
          {icon && <FontIcon variant={icon} size={16} />}
          <Position type='relative' >
            <span>{label}</span>
            <Position type='absolute' top='0px' right='-10px'>
              {((id === 'announcements' && announcementsUnread) || (id === 'explore' && exploresUnread)) && <UnreadIndicator />}
            </Position>
          </Position>
          <Position type='absolute'
            className='overlay'
            id={`overlay-${id}`}
            data-id={id}
            fullWidth fullHeight zIndex='2' top='0' left='0' style={{ opacity: 0 }}>
          </Position>
        </Tab>

      ))}
    </Position>
  </ThemeProvider>

}

export default withRedux(FeaturePanelTabs)