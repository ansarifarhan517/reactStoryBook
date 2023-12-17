import React, { useCallback, useState } from 'react'
import {
  DropDown,
  Badge,
  Text,
}
  from '@base'
import { bemClass } from '@utils'
import { IMultiSelectDropdownProps, ISelectedOption, IDropdownState } from './multiselect.model'
import './style.scss'

const blk = 'multiple-dropdown-input'

const MultiSelectDropdown: React.FC<IMultiSelectDropdownProps> = ({
  title,
  value,
  options,
  disabled,
  invalid,
  className,
  labelMap,
  valueMap,
  controlClassName,
  isRequired,
  onChangeHandler,
  name,
  setOptions,

}) => {
  const [dropdown, setDropdown] = useState<IDropdownState>({
    selectedOptions: [],
    deletedOptions: [],
  })


  const thisChangeHandler = useCallback(
    (selectedValue: ISelectedOption) => {
      // Check if selectedValue is not in selectedOptions
      const isSelected = dropdown.selectedOptions.includes(selectedValue[name])
      const updatedSelectedOptions = isSelected
        ? dropdown.selectedOptions
        : [...dropdown.selectedOptions, selectedValue[name]]

      // Filter out the selectedValue from options
      const deletedOptions = options.filter((option) => option.value === selectedValue[name])
      const remainingOptions = options.filter((option) => option.value !== selectedValue[name])

      // Update the State
      setDropdown((prevState: IDropdownState) => ({
        ...prevState,
        selectedOptions: updatedSelectedOptions,
        deletedOptions: [...prevState.deletedOptions, ...deletedOptions],
      }))
      setOptions(remainingOptions)

      onChangeHandler?.({ [name]: updatedSelectedOptions })
    },
    [onChangeHandler, name, dropdown, options, setOptions],
  )

  const onClose = useCallback(
    (ind: string | number) => {
      if (typeof ind == 'string') {
        // Restore deleted options and reset selected options
        setOptions(((prevState) => [...prevState, ...dropdown.deletedOptions]))
        setDropdown((prevState) => ({
          ...prevState,
          selectedOptions: [],
          deletedOptions: [],
        }))
        return
      }
      // Filter out the deleted option and update state
      const updatedSelectedOptions = dropdown.selectedOptions.filter((_, index) => index !== ind)
      const updatedOptions = dropdown.deletedOptions.filter((__, index) => index === ind)
      const updatedDeleteOptions = dropdown.deletedOptions.filter((__, index) => index !== ind)

      setOptions((prevState) => [...prevState, ...updatedOptions])
      setDropdown((prevState) => ({
        ...prevState,
        selectedOptions: updatedSelectedOptions,
        deletedOptions: updatedDeleteOptions,
      }))
    },
    [dropdown],
  )

  return (
    <>
      <label className={bemClass([blk, 'title'])}>
        {title}
        {isRequired && <span className={bemClass([blk, 'star'])}>*</span>}
      </label>
      <div className={bemClass([blk, ''])}>
        <div className={bemClass([blk, 'badges', { active: dropdown?.selectedOptions.length > 0 && 'active' }])}>
          { dropdown.selectedOptions.length > 0 && dropdown?.selectedOptions.map((option, index) => {
            const key = `option${index}`
            return (
              <Badge
                key={key}
                isCloseable
                closeHandler={() => { onClose(index) }}
              >
                {option}
              </Badge>
            )
          })}
        </div>

        {dropdown.selectedOptions.length > 0 && (
          <Text
            tag="span"
            className={bemClass([blk, 'closeAll'])}
            typography="xxl"
            color="gray-light"
            clickHandler={() => { onClose('all') }}
          >
            &times;
          </Text>
        )}

        <DropDown
          name={name}
          value={value}
          options={options}
          disabled={disabled}
          invalid={invalid}
          className={className}
          labelMap={labelMap}
          valueMap={valueMap}
          controlClassName={controlClassName}
          changeHandler={thisChangeHandler}
          category="multiple"
        />
      </div>
    </>
  )
}

export default MultiSelectDropdown
