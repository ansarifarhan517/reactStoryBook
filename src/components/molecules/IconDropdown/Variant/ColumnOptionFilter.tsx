import React from 'react'
import Select, { components } from 'react-select'
import { ColumnOptionStyled } from '../Styles'
import {
  ColumnOption,
  DownArrowIndicator
} from '../../DropDown/CustomComponent'
import { IIconDropdown } from '../../DropDown/interface'
import { StyledSelectWrapper } from '../StyledIconDropdown'

const ColumnOptionDropdown = ({
  defaultProps
}: {
  defaultProps: IIconDropdown
}) => {
  const {
    options,
    value,
    primary,
    intent,
    iconButtonDetails = [],
    width = '10px',
    theme,
    onChange
  } = defaultProps

  return (
    <StyledSelectWrapper
      width={width}
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Select
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: DownArrowIndicator,
          LoadingIndicator: () => null,
          Option: ColumnOption,
          Menu: (props) => (
            <components.Menu {...props} className='menuAnimate' />
          )
        }}
        styles={ColumnOptionStyled(width, theme)}
        options={options}
        value={value}
        width={width}
        primary={primary}
        intent={intent}
        theme={theme}
        iconButtonDetails={iconButtonDetails}
        onChange={(input: any) => {
          const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
          obj?.forEach((e) => {
            e.remove()
          })
          onChange && onChange(input)
        }}
        placeholder=''
        menuPlacement='auto'
      />
    </StyledSelectWrapper>
  )
}

export default React.memo(ColumnOptionDropdown)
