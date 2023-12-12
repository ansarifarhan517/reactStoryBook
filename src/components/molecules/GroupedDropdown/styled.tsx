import styled from 'styled-components'
import { IGroupedDropdownWrapper } from './interfaces'

export const DropdownStyled = styled.div<IGroupedDropdownWrapper>`
  min-width: 200px;
  width: 100%;
  height: ${({ height }) => height};
`
export const CategoryTabStyled = styled.div<IGroupedDropdownWrapper>`
  width: 80%;
  height: ${({ height }) => height};
  cursor: pointer;
  background-color: ${({ theme }) => theme?.colors?.grey['50']};
  border-right: ${({ theme }) => `1px solid ${theme?.colors?.grey['300']}`};
  padding: 10px 0px 0px 0px;
  overflow: auto;
  & .tab {
    font-size: 15px;
    cursor: pointer;
    line-height: 37px;
    padding: 0px 5px 0px 15px;
    align-items: center;
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
  & .tab:hover {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
  & .tab.active,
  & .tab.active:hover {
    background-color: ${({ theme }) => theme?.colors?.primary?.main};
    color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  }
`
export const StyledControl = styled.div`
  & .ControlComponentLabel {
    position: absolute;
    background-color: ${({ theme }) => theme?.colors?.primary?.contrastText};
    top: -8px;
    color: ${({ theme }) => theme?.colors?.grey['700']};
    font-size: 13px;
    left: 10px;
  }
`
export const GroupedDropdownWrapper = styled.div<IGroupedDropdownWrapper>`
  display: inline-flex;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`

export const StyledTab = styled.div`
  display: flex;
  justify-content: space-between;
`

export const StyledListWrapper = styled.div`
  & > div {
    padding: 0px 5px;
    box-sizing: border-box;
  }

  & > div > input {
    margin: 10px 0px;
  }
  & > div > div {
    top: 2px;
  }
`
export const OptionWrapper = styled.div<IGroupedDropdownWrapper>`
  height: ${({ height }) => height || ' 200px'};
  overflow: auto;
  min-height: 200px;
  cursor: pointer;
`
export const Option = styled.div`
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.grey['50']};
    color: ${({ theme }) => theme?.colors?.primary.main};
  }
  &:active {
    background-color: ${({ theme }) => theme?.colors?.primary.main};
    color: ${({ theme }) => theme?.colors?.primary.contrastText};
  }
`
