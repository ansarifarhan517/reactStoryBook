import React, { CSSProperties } from 'react'
import { CheckboxGroupStyled } from './CheckboxGroup.styled'

import Checkbox, { tCheckboxSize } from '../Checkbox'

export interface IOptionType {
  value?: string
  checked?: boolean
  id: string
  disabled?: boolean
  size?: number
  color?: string
}

export interface ICheckboxGroupProps {
  checkOptions?: any
  orientation?: boolean
  onChange?: (
    id: string,
    checked: boolean,
    checkBoxStateArray: IOptionType[]
  ) => void
  spacing?: number | string
  /** 'sm' | 'md' | 'lg' | number */
  checkboxSize?: tCheckboxSize
  style?: CSSProperties
}

const CheckboxGroup = ({
  checkOptions = [],
  orientation = false,
  onChange = () => {},
  spacing = '',
  checkboxSize = 'sm',
  style
}: ICheckboxGroupProps) => {
  const handleChange = (checkboxId: string, checked: boolean) => {
    onChange(checkboxId, checked, checkOptions)
  }

  const spacingProps = spacing
    ? {
        [orientation ? 'verticalSpacing' : 'horizontalSpacing']: spacing
      }
    : {}
  return (
    <CheckboxGroupStyled
      orientation={orientation}
      {...spacingProps}
      style={style}
    >
      {checkOptions.map(
        ({
          id,
          checked = false,
          value = '',
          disabled = false,
          color
        }: IOptionType): JSX.Element => (
          <Checkbox
            key={id}
            id={id}
            label={value}
            checked={checked}
            disabled={disabled}
            checkboxSize={checkboxSize}
            color={color}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(id, e.target.checked)
            }
          />
        )
      )}
    </CheckboxGroupStyled>
  )
}
export default CheckboxGroup
