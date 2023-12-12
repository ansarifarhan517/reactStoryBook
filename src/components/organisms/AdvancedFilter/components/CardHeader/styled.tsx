import styled from 'styled-components'
// import TextInput from '../../../../molecules/TextInput'
import { primaryMixin } from '../../styled'

export const FilterCardHeaderStyled = styled.div`
  ${primaryMixin}
  display:flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 14px;

  & > span i {
    margin: 0px 5px;
  }
`
export const IconWrappers = styled.div`
  display: flex;
  justify-content: space-around;
  & > button {
    border-radius: 50%;
    padding: 0px 8px;
    &:hover {
      background-color: ${({ theme }) => theme?.colors?.primary?.dark};
    }
  }
`
export const TextInputStyled = styled.span`
  & > div {
    display: inline-block;
  }
  & input {
    height: 30px;
    padding: 0 8px;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 2px;
  }
  & input::placeholder {
    color: ${({ theme }) => theme?.colors?.grey?.A200};
  }
`
