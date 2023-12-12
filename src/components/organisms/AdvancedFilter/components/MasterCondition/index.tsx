import React from 'react'
import SectionHeader from '../../../../molecules/SectionHeader'
import FontIcon from '../../../../atoms/FontIcon'
import IconDropdown from '../../../../molecules/IconDropdown'
import { MasterConditionWrapper, MasterConditionStyled } from './styled'
const MasterConditionLists = [
  { value: 'AND', label: 'ALL' },
  { value: 'OR', label: 'ANY' }
]
const MasterCondition = ({ condition, handleChange }: any) => {
  const valueObject = MasterConditionLists.find(
    (m: any) => m.value === condition || m.label === condition
  )
  return (
    <>
      <SectionHeader headerTitle='Conditions' />
      <MasterConditionWrapper>
        <FontIcon variant='icomoon-setting' color='black' size='sm' />
        <span>Apply filters on </span>
        <MasterConditionStyled>
          <IconDropdown
            variant='date-picker'
            optionList={MasterConditionLists}
            onChange={handleChange}
            value={valueObject?.value || 'AND'}
            width='43px'
            showDownArrow
          />
        </MasterConditionStyled>
        <span>of the following</span>
      </MasterConditionWrapper>
    </>
  )
}
export default MasterCondition
