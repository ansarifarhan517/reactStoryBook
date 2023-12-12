import styled from 'styled-components'

export const MasterConditionStyled = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.primary?.main};
  margin: 0px 5px;

  & div[class$='singleValue'] {
    color: ${({ theme }) => theme?.colors?.primary.main} !important;
  }
`
export const MasterConditionWrapper = styled.div`
  margin: 10px;
  font-size: 14px;
  & > i {
    margin: 0px 5px;
  }
  & > span {
    font-size: 14px;
    display: inline-block;
  }
`
