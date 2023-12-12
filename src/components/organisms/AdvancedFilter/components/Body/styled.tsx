import styled, { css } from 'styled-components'
import { primaryMixin } from '../../styled'
import IconButton from '../../../../atoms/IconButton'
export interface IChipButton {
  selected?: boolean
}
export const AdvancedFilterWrapper = styled.div`
  max-height: 65vh;
  overflow-y: auto;
  padding: 0.6em;
  font-size: 13px;

  // scrollbar styles

  &::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme?.colors?.grey['50']};
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme?.colors?.grey?.A800};
    border-radius: 30px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme?.colors?.grey?.A700};
  }
`
export const ChipsWrapper = styled.div`
  background-color: ${({ theme }) => theme?.colors?.grey['50']};
  padding: 10px;
  border: 1px solid ${({ theme }) => theme?.colors?.grey['510']};
  margin: 10px 0px;
  #modalwrapperid {
    display: flex;
    justify-content: center;
  }
`
export const IconButtonStyled = styled.div<IChipButton>`
  position: relative;
  margin: 5px;
  cursor: pointer;
  background: ${({ theme }) => theme?.colors?.primary.contrastText};
  display: inline-block;
  padding: 5px;
  font-size: 13px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: ${({ theme }) => theme?.shadows?.default};
  color: ${({ theme }) => theme?.colors?.grey.A100};
  border-radius: 3px;
  border: none;
  word-break: break-word;

  &[title] {
    display: inline-flex;
    margin: 5px;
    word-break: break-word;
  }
  & > button {
    padding: 0px !important;
    width: 20px;
    height: 12px;
    line-height: 12px;
    display: inline;
  }
  & > button:hover {
    background-color: transparent !important;
  }
  & i {
    margin: 0px 5px;
  }

  &:focus {
    outline: none;
  }
  ${({ selected }) =>
    selected &&
    css`
      ${primaryMixin}
      & i {
        color: ${({ theme }) => theme?.colors?.primary.contrastText};
      }
    `}
`

export const FilterCardWrapper = styled.div`
  padding-bottom: 10px;
  box-shadow: ${({ theme }) => theme?.shadows?.default};
`
export const ConditionWrapper = styled.div`
  position: relative;
  margin: 0.6em 0px;
  padding: 0.6em;
  background-color: ${({ theme }) => theme?.colors?.grey['200']};
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  align-items: center;

  & > div {
    width: 100%;
    min-width: 100px;
    position: relative;
    margin: 0px 5px;

    & input {
      margin: 0px 0px;
      min-height: 28px;
      line-height: 28px;
      border: 1px solid ${({ theme }) => theme?.colors?.grey['450']};
    }
    & #fromDateRange-input,
    & #toDateRange-input {
      margin: 18px 0px;
    }
  }
`

export const AddConditionWrapper = styled.div`
  margin: 0.6em 0px;
  padding: 1em;
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 1px dashed ${({ theme }) => theme?.colors?.primary?.main};
  text-align: center;
  /* & > button {
    padding: 0px 5px;
  } */
  cursor: pointer;
`
export const SortButtonStyled = styled(IconButton)`
  border: 1px solid ${({ theme }) => theme?.colors?.primary?.main};
  padding: 1.5px 1.5px 0px 1.5px;
  border-radius: 50%;
`
export const SortStyled = styled.div`
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  justify-content: flex-start;
  & > * {
    margin: 0px 5px;
  }
`
export const AdvancedFilterInnerCardWrapper = styled.div`
  padding: 0.6em;
`

export const TransparentButton = styled.span`
  display: inline-block;
`
export const NoFilterBlock = styled.div`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme?.colors?.grey?.A900};
`
