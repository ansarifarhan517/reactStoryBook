import React from 'react'
import Select, { components } from 'react-select'
import { DatePickerDropdownStyled } from '../Styles'
// import { DownArrowIndicator } from '../../DropDown/CustomComponent'
import { IIconDropdown } from '../../DropDown/interface'
import FontIcon from '../../../atoms/FontIcon'

// for datepicker down arrow being shown
/* eslint-disable */
export const DownArrowIndicator = (props: any) => {
  const color = 'grey[A800]'

  return (
    <components.DropdownIndicator {...props}>
      {props?.selectProps?.variant === 'bread-crumb' ? (
        <div></div>
      ) : (
        <FontIcon
          size={8}
          color={color}
          variant='triangle-down'
          hoverColor={color}
        />
      )}
    </components.DropdownIndicator>
  )
}


const DatePickerDropdown = ({
  defaultProps
}: {
  defaultProps: IIconDropdown
}) => {
  const {
    options,
    width,
    value,
    theme,
    placeholder,
    onChange,
    showDownArrow,
    isMultiRegionStyled
  } = defaultProps

  return (
    <div
      style={{ width }}
      onClick={(e: any) => {
        e.stopPropagation()
      }}
    >
      <Select
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: showDownArrow ? DownArrowIndicator : () => null,
          LoadingIndicator: () => null,
          Menu: (props) => (
            <components.Menu {...props} className='menuAnimate' />
          )
        }}
        styles={DatePickerDropdownStyled(theme, (isMultiRegionStyled ? isMultiRegionStyled : false))}
        options={options}
        value={value}
        onChange={(input: any) => {
          const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
          obj?.forEach((e) => {
            e.remove()
          })
          onChange && onChange(input)
        }}
        placeholder={placeholder}
        isSearchable={false}
        menuPlacement='auto'
        maxMenuHeight={200}
      />
    </div>
  )
}

export default DatePickerDropdown
