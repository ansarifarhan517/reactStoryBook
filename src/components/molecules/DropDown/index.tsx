import React, { useCallback, useEffect, useState } from 'react'
import { ValueType } from 'react-select'
import { ISelectProps, OptionType } from './interface'
import { StyledDropDown } from './StyledDropDown'
import DefaultSelect from './Variants/DefaultSelect'
import InlineEditDropdown from './Variants/InlineEditDropdown'
import FormSelect from './Variants/FormSelect'
import ListView from './Variants/ListView'
import InlineDashedDropdown from './Variants/InlineDashedDropdown'

const DropDown = ({
  variant = 'form-select',
  optionList = [],
  required = false,
  label = '',
  error = false,
  errorMessage = '',
  placeholder = '',
  loading = false,
  isMenuOpen,
  onChange = () => {},
  onInputChange = () => {},
  value,
  width = '100%',
  onMenuOpen = () => {},
  onMenuClose = () => {},
  showDescription = false,
  tooltipMessage,
  disabled = false,
  labelColor,
  showDropdownIndicator = true,
  showNoDataText = true,
  showCrossIcon = true,
  limitOptionsList,
  align,
  withIcon = false,
  iconVariant = '',
  iconSize,
  iconStyle,
  iconBorder = true,
  onIconClick,
  isSortable = true
}: ISelectProps) => {
  const [selectedOption, setSelectedOption] = useState<ValueType<
    OptionType
  > | null>(null)

  const [isLoading, setIsLoading] = useState(loading)
  const [isCrossVisible, setIsCrossVisible] = useState(false)
  const [_optionList, setOptionList] = useState(optionList)

  useEffect(() => {
    setIsLoading(loading)
  }, [loading])
  // useEffect(() => {
  //   if (optionList.length < 0) {
  //     setIsLoading(true)
  //   } else setIsLoading(false)
  // }, [optionList])

  /* In the case of Date picker , I externally pass selected value which will be string.
  As react-select wants {label, value} format.
  Selection is done below */

  useEffect(() => {
    const optionSelected = optionList.find(
      ({ value: optionValue }: { value: string }) => optionValue === value
    )
    // setIsCrossVisible(!!value)
    setIsCrossVisible(!!value && !!optionSelected)
    setSelectedOption(optionSelected || null)
    setOptionList(optionList)
  }, [value, optionList])

  /* eslint-disable */
  const handleDeviceChange = useCallback(
    (input: ValueType<OptionType>) => {
      const option = input as OptionType
      const previousOption = selectedOption as OptionType
      if (option?.value !== previousOption?.value) {
        // setIsLoading(false)
        setSelectedOption(input)
        setIsCrossVisible(true)

        option ? onChange(option?.value as string) : onChange(undefined)
      }
    },
    [selectedOption, onChange]
  )

  // const handleInputChange = () => {
  // setIsLoading(true)
  // setTimeout(() => {
  //   setIsLoading(false)
  // }, 500)
  // }
  const handleCloseChange = (e: any) => {
    e.stopPropagation()
    setSelectedOption(null)
    setIsCrossVisible(false)
    onChange(undefined)
  }

  // default props
  const defaultProps = {
    options: _optionList,
    value: selectedOption,
    isLoading,
    placeholder,
    // onInputChange: () => handleInputChange(),
    onInputChange,
    onChange: (input: ValueType<OptionType>) => handleDeviceChange(input),
    onFocus: () => {
      // setIsLoading(false)
    },
    isSearchable: true,
    isMenuOpen,
    variant,
    onMenuOpen,
    onMenuClose,
    tooltipMessage,
    disabled,
    labelColor,
    limitOptionsList,
    align,
    iconBorder,
    withIcon,
    iconVariant,
    iconSize,
    iconStyle,
    onIconClick
  }

  const selectComponent = {
    'form-select': (
      <FormSelect
        defaultProps={defaultProps}
        error={error}
        errorMessage={errorMessage}
        label={label}
        required={required}
        showDescription={showDescription}
        showDropdownIndicator={showDropdownIndicator}
        showNoDataText={showNoDataText}
        showCrossIcon={showCrossIcon}
        isSortable={isSortable}
      />
    ),
    'default-select': <DefaultSelect defaultProps={defaultProps} />,
    'list-view': (
      <ListView
        defaultProps={defaultProps}
        setIsCrossVisible={setIsCrossVisible}
        isCrossVisible={isCrossVisible}
        handleCloseChange={handleCloseChange}
      />
    ),
    'inline-edit': <InlineEditDropdown defaultProps={defaultProps} />,
    'dashed-dropdown': <InlineDashedDropdown defaultProps={defaultProps} />
  }
  return (
    <StyledDropDown width={width}>
      {selectComponent[variant] || 'No varaint'}{' '}
    </StyledDropDown>
  )
}

export default DropDown
