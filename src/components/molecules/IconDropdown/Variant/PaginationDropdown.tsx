import React from 'react'
import Select, { components } from 'react-select'
import { PaginationDropdownStyled } from '../Styles'
import { DownArrowIndicator } from '../../DropDown/CustomComponent'
import { IIconDropdown } from '../../DropDown/interface'

const PaginationDropdown = ({
  defaultProps
}: {
  defaultProps: IIconDropdown
}) => {
  const { options, width, onChange, value, theme } = defaultProps

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
          DropdownIndicator: DownArrowIndicator,
          LoadingIndicator: () => null,
          Menu: (props) => (
            <components.Menu {...props} className='menuAnimate' />
          )
        }}
        styles={PaginationDropdownStyled(theme)}
        options={options}
        value={value}
        onChange={(input: any) => {
          const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
          obj?.forEach((e) => {
            e.remove()
          })
          onChange && onChange(input)
        }}
        width={width}
        theme={theme}
      />
    </div>
  )
}

export default React.memo(PaginationDropdown)
