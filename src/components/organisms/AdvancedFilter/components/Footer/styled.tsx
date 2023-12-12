import styled from 'styled-components'
import Position from '../../../../molecules/Position'
import IconButton from '../../../../atoms/IconButton'

export const FooterWrapper = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  color: ${({ theme }) => theme?.colors?.black};
  padding: 0.6em;
  display: flex;
  justify-content: flex-end;
  button {
    & > span {
      margin: 0px 5px;
      font-size: 13px;
    }
  }
  & > button {
    margin: 0px 5px;
  }
`

export const SpacedIconButton = styled(IconButton)`
  & i {
    font-size: 13px;
    height: 13px;
    line-height: 13px;
    margin: 0px 5px;
  }
`
