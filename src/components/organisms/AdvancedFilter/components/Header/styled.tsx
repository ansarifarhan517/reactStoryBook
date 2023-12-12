import styled from 'styled-components'
import Position from '../../../../molecules/Position'
import IconButton from '../../../../atoms/IconButton'

export const HeaderWrapper = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  font-size: 13px;
  padding: 0.6em;
  display: flex;
  justify-content: space-between;
  cursor: move;
`
export const IconButtonStyled = styled(IconButton)`
  padding: 4px 5px 4px 5px;
  border-radius: 50%;
  & > i {
    font-size: 10px;
    height: 10px;
    line-height: 10px;
  }
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.primary?.dark} !important;
  }
`
