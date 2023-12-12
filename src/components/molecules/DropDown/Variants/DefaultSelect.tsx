import React from 'react'
import Select, { components } from 'react-select'
import { ButtonDropdownStyled } from '../Styles'
import { LoadingIndicator, Control } from '../CustomComponent'
import { IDefaultProps } from '../interface'

const DefaultDropdown = ({ defaultProps }: { defaultProps: IDefaultProps }) => {
  const {
    options,
    value,
    isLoading,
    placeholder = '',
    onInputChange,
    onChange,
    onFocus,
    isSearchable,
    disabled
  } = defaultProps
  return (
    <Select
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => null,
        LoadingIndicator,
        Control,
        Menu: (props) => <components.Menu {...props} className='menuAnimate' />
      }}
      styles={ButtonDropdownStyled()}
      options={options}
      value={value}
      isLoading={isLoading}
      placeholder={placeholder}
      onInputChange={onInputChange}
      onChange={(input: any) => {
        const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
        obj?.forEach((e) => {
          e.remove()
        })
        onChange && onChange(input)
      }}
      onFocus={onFocus}
      isSearchable={isSearchable}
      isDisabled={disabled}
    />
  )
}

export default React.memo(DefaultDropdown)
