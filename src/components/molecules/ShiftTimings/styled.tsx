import styled, { css } from 'styled-components'
import IconButton from '../../atoms/IconButton'
import { colorFinder } from '../../../utilities/mixins'

export const ShiftTimingSetStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  align-items: center;
  & > * {
    margin: 0 0.5em;
    width: 100%;
  }
  border-top: 1px dashed ${({ theme }) => theme?.colors?.grey['510']};
`

export const ShiftTimingsContainer = styled.div`
  width: 100%;
  display: block;
  background-color: transparent;
  & > ${ShiftTimingSetStyled}:first-child {
    border-top: 0px;
  }

  .gridContainer > * {
    padding: 0px 5px;
  }
`
export const IconButtonStyled = styled(IconButton)`
  border-radius: 50%;
  padding: 0px;
  height: auto;
  border: 1px solid ${({ color, theme }) => colorFinder(color, theme)};
  ${({ color }) =>
    color === 'primary.main' &&
    css`
      background-color: ${({ theme }) => theme?.colors?.primary?.main};
      color: ${({ theme }) => theme?.colors?.primary?.contrastText};
    `}
  i {
    margin: 3.5px 3px 3px 3.5px;
    display: flex;
  }
  width: auto;
  /*
  ${({ iconVariant }) =>
    iconVariant === 'add' &&
    css`
      position: absolute;
      right: -30px;
    `}
    */
`
