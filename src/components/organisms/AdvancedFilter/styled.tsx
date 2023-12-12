import styled, { css } from 'styled-components'
import Position from '../../molecules/Position'

export const primaryMixin = css`
  background-color: ${({ theme }) => theme?.colors?.primary.main};
  color: ${({ theme }) => theme?.colors?.primary.contrastText};
`

export const AdvancedFilterWrapperStyled = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  min-width: 400px;
  width: 600px;
  // dragable
  position: absolute;
  z-index: ${({ theme }) => theme?.zIndex?.basic};
`
export const AdvancedFilterStyled = styled.div`
  position: relative;
  display: inline-block;
`
