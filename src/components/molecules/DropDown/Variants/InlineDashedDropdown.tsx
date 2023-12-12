import React from 'react'
import Select, { components } from 'react-select'
import { Option } from '../CustomComponent'
import { InlineDashedStyled } from '../Styles'
import { IDefaultProps } from '../interface'
import Position from '../../Position'
import FontIcon from '../../../atoms/FontIcon'

const InlineDashedDropdown = ({
  defaultProps
}: {
  defaultProps: IDefaultProps
}) => {
  const {
    options,
    value,
    isLoading,
    placeholder,
    onInputChange,
    onChange,
    onFocus,
    isSearchable,
    disabled
  } = defaultProps

  return (
    <Position type='relative' mt='-0.25em'>
      <Select
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: (props) => (
            <components.DropdownIndicator {...props}>
              <FontIcon size={8} variant='triangle-down' color='black' />
            </components.DropdownIndicator>
          ),
          LoadingIndicator: () => null,
          SingleValue: (props) => (
            <components.SingleValue {...props}>
              <span title={props.data.label}>{props.children}</span>
            </components.SingleValue>
          ),
          Option
          //   Menu: (props) => (
          //     <components.Menu {...props} className='menuAnimate' />
          // )
        }}
        styles={InlineDashedStyled()}
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
        menuPlacement='auto'
      />
    </Position>
  )
}

export default InlineDashedDropdown
