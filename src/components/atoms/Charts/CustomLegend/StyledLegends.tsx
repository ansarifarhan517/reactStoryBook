import styled from 'styled-components'

interface ILegend {
  color?: string
  isActive?: boolean
  isRow?: boolean
  font?: string
  size?: string
  isFullWidth?: boolean
}

interface IStyledName {
  isFullWidth?: boolean
}

export const StyledLegendWrapper = styled.div<ILegend>`
  display: flex;
  padding: ${(isFullWidth) =>
    isFullWidth ? '3px 2px 0px 0px' : '6px 6px 0px 0px'};
  flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
  div {
    color: ${({ theme }) => theme?.colors?.grey['900']};
    font-size: ${({ font }) => font || '11px'};
  }
  position: absolute;
  top: ${({ isRow }) => (isRow ? '-45px' : '9px')};
  right: ${({ isRow }) => isRow && '0px'};
  cursor: pointer;
`

export const StyledCircle = styled.div<ILegend>`
  border: ${({ color }) => `5px solid ${color}`};
  background-color: ${({ isActive, color }) => (isActive ? color : 'white')};
  border-radius: 50%;
  margin-right: ${({ isFullWidth }) => (isFullWidth ? '8px' : '6px')};
  margin-top: ${({ isFullWidth }) => (isFullWidth ? '-3px' : '0')};
`
export const StyledName = styled.div<IStyledName>`
  // margin-right: 24px;
  // max-width: 64px !important;
  margin-right: 0px;
  // max-width: calc(100% - 17px) !important;
  ${({ isFullWidth }) =>
    !isFullWidth && 'max-width: calc(100% - 17px) !important;'}
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'calc(100% - 17px)')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SingleLegend = styled.div<ILegend>`
  flex-direction: row;
  display: flex;
  padding: 5px;
  align-items: center;
  cursor: pointer;
  ${({ isFullWidth }) => !isFullWidth && 'max-width: 110px;'}
  margin-right: 10px;
`
