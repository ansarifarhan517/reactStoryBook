import React from 'react'
import styled from 'styled-components'
import {FontIcon,IconDropdown} from 'ui-library'
const MasterConditionLists = [
  { value: 'AND', label: 'ALL' },
  { value: 'OR', label: 'ANY' }
]

 const MasterConditionStyled = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.primary?.main};
  margin: 0px 5px;

  & div[class$='singleValue'] {
    color: ${({ theme }) => theme?.colors?.primary.main} !important;
  }
`
 const MasterConditionWrapper = styled.div`
  margin: 0px;
  font-size: 14px;
  & > i {
    margin: 0px 5px;
  }
  & > span {
    font-size: 14px;
    display: inline-block;
  }
  .icon-triangle-down{
    color: ${({ theme }) => theme?.colors?.primary.main} !important;
  }
`

const MasterCondition = ({ condition, handleChange }: any) => {
  const valueObject = MasterConditionLists.find(
    (m: any) => m.value === condition || m.label === condition
  )
  return (
    <>
      <MasterConditionWrapper>
        <FontIcon variant='icomoon-setting' color='black' size='sm' />
        <span>Apply filters on </span>
        <MasterConditionStyled>
          <IconDropdown
            variant='date-picker'
            optionList={MasterConditionLists}
            onChange={handleChange}
            value={valueObject?.value || 'AND'}
            width='45px'
            showDownArrow
          />
        </MasterConditionStyled>
        <span>of the following</span>
      </MasterConditionWrapper>
    </>
  )
}
export default MasterCondition
