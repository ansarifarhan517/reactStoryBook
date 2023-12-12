import React from 'react'
import styled from 'styled-components'
import IconButton from '../../../atoms/IconButton'
import { IHeaderProps } from '../interfaces'
import Position from '../../../molecules/Position'

export const HeaderWrapper = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  font-size: 13px;
  padding: 0px 0.6em;
  display: flex;
  justify-content: space-between;
  height: 38px;
  // cursor: move;

  & button:hover {
    background-color: #0000001c;
  }
`

const Header = ({ children, closeButton, handleClose }: IHeaderProps) => {
  return (
    <HeaderWrapper
      type='relative'
      display='block'
      className='inlinePopupHeader'
    >
      {children}
      {closeButton && (
        <IconButton
          onClick={handleClose}
          disabled={false}
          onlyIcon
          iconVariant='icomoon-close'
          iconSize='md'
          color='white'
        />
      )}
    </HeaderWrapper>
  )
}
export default Header
