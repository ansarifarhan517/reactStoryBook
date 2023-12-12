import React from 'react'
import { IIconDropdown, OptionType } from '../../DropDown/interface'
import { StyledDropdownContainer, StyledDropdownItem, StyledMultiLevelItem } from '../StyledIconDropdown'
// import { Option } from '../subComponents/Options'

const MultiLevelBreadCrumb = ({
  defaultProps,
  handleOutsideChange
}: {
  defaultProps: IIconDropdown
  handleOutsideChange: (value: string) => void
}) => {
  const {
    options,
    value,
    menuIsOpen,
    onChange
  } = defaultProps

  const handleOnChange = (input: OptionType) => {
    const option = value as OptionType
    if (input?.value === option?.value && handleOutsideChange) {
      handleOutsideChange(option.value)
    } else {
      onChange && onChange(input)
    }
  }

  interface IRecursiveProps extends React.HTMLAttributes<HTMLDivElement> {
    options: any
    defaultOpen?: 'right' | 'left'
    childLevel?: string,
    handleOnClick: (input: OptionType) => void
  }

  const MultiLevelButtonsList = ({
    options,
    defaultOpen = 'left',
    childLevel,
    handleOnClick
  }: IRecursiveProps) => {

    return (
      <StyledDropdownContainer
        className={
          childLevel
            ? defaultOpen == 'left'
              ? `dropdown-item-right-${childLevel}`
              : `dropdown-item-left-${childLevel}`
            : ''
        }
      >
        {options.map((item: any) => {
          if (item?.options?.length) {
            return (
              <StyledMultiLevelItem containterIdentifier={`child-${item.id}`} key={`child-${item.id}`}>
                <StyledDropdownItem>
                  <div className='hasChildren'>
                    <div>{item.label}</div>
                    <i className='icon ui-library-icons icon-angle-right-thin' />
                  </div>
                  <MultiLevelButtonsList
                    options={item.options}
                    defaultOpen={defaultOpen}
                    childLevel={`child-${item.id}`}
                    handleOnClick={handleOnClick}
                  />
                </StyledDropdownItem>
              </StyledMultiLevelItem>
            )
          }

          return (
            <StyledDropdownItem
              onClick={() => {
                handleOnClick && handleOnClick(item)
              }}
              title={item.label}
              key={item.id}
            >
              {item.label}
            </StyledDropdownItem>
          )
        })}
      </StyledDropdownContainer>
    )
  }

  return (
    <>
        {menuIsOpen && 
            <MultiLevelButtonsList
                    options={options}
                    defaultOpen={'right'}
                    handleOnClick={handleOnChange}
            />
        }
    </>
  )
}

export default MultiLevelBreadCrumb