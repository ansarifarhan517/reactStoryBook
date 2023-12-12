import React, { useRef, useState } from 'react'
import { IIconMultilevelDropdown } from '../../DropDown/interface'
import {
  StyledSelectWrapper,
  IconButtonStyled,
  StyledDropdownContainer,
  StyledDropdownItem,
  StyledMultiLevelItem
} from '../StyledIconDropdown'
import { tIntent } from '../../../atoms/Button'
import FontIcon from '../../../atoms/FontIcon'
import Position from '../../Position'
import Tooltip from '../../Tooltip'

const StyledButton = ({
  primary,
  intent,
  iconButtonDetails,
  theme,
  menuIsOpen,
  disabled,
  id,
  ...rest
}: any) => {
  return (
    <IconButtonStyled
      disabled={disabled}
      primary={primary}
      intent={intent as tIntent}
      theme={theme}
      menuIsOpen={menuIsOpen}
      id={id}
      {...rest}
      style={{ padding: '0px 10px' }}
    >
      <FontIcon variant={iconButtonDetails[0]} />
      <span>{iconButtonDetails[1]}</span>
      <FontIcon variant={iconButtonDetails[2]} />
    </IconButtonStyled>
  )
}

const MultiLevelButtonDropdown = ({
  defaultProps
}: {
  defaultProps: IIconMultilevelDropdown
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false) // we are keeping this to send to button as on open we have to make button blue
  const {
    options,
    primary,
    intent,
    iconButtonDetails,
    width,
    theme,
    tooltipMessage,
    disabled = false,
    defaultOpen = 'left',
    handleClick,
    tooltipProps = {},
    id
  } = defaultProps

  // interface IOptionModel {
  //   id:string,
  //   label:string,
  //   value:string,
  //   options?:any
  // }
  interface IRecursiveProps extends React.HTMLAttributes<HTMLDivElement> {
    options: any
    defaultOpen?: 'right' | 'left'
    childLevel?: string
    handleOnClick: (id: string) => void
    id?:any
  }
  //   function isInViewport(element) {
  //     const rect = element.getBoundingClientRect();
  //     return (
  //         rect.top >= 0 &&
  //         rect.left >= 0 &&
  //         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
  //         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  //     );
  // }
  const MultiLevelButtonsList = ({
    options,
    defaultOpen = 'right',
    childLevel,
    handleOnClick,
    id
  }: IRecursiveProps) => {
    const dropdronRef = useRef(null)
    console.log(defaultOpen)
    console.log(id)

    return (
      <StyledDropdownContainer
        className={
          childLevel
          ? defaultOpen == 'right'
              ? `dropdown-item-right-${childLevel}`
              : `dropdown-item-left-${childLevel}`
            : ''
        }
        // style={alignmentStyles.container}
        ref={dropdronRef}
      >
        {options.map((item: any) => {
          if (item?.options?.length) {
            return (
              <StyledMultiLevelItem containterIdentifier={`child-${item.id}`}>
                <StyledDropdownItem>
                  <div className='hasChildren'>
                    <div>{item.label}</div>
                    <i className='icon ui-library-icons icon-angle-right' />
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
                handleOnClick && handleOnClick(item.id)
              }}
              title={item.label}
            >
              {item.label}
            </StyledDropdownItem>
          )
        })}
      </StyledDropdownContainer>
    )
  }

  return (
    <Position type='relative'>
      <Tooltip
        message={tooltipMessage}
        hover
        hide={!tooltipMessage || menuIsOpen}
        {...tooltipProps}
      >
        <StyledButton
          primary={primary}
          width='unset'
          intent={intent}
          iconButtonDetails={iconButtonDetails}
          theme={theme}
          disabled={disabled}
          menuIsOpen={menuIsOpen}
          id={id}
          onClick={() => {
            setMenuIsOpen((o) => !o)
          }}
          onBlur={() => {
            setTimeout(() => {
              setMenuIsOpen(false)
            }, 350)
          }}
          
        />
      </Tooltip>
      <StyledSelectWrapper
        width={width}
        onClick={(e: any) => {
          e.stopPropagation()
        }}
      >
        {menuIsOpen && (
          <MultiLevelButtonsList
            options={options}
            defaultOpen={defaultOpen}
            handleOnClick={handleClick}
          />
        )}
      </StyledSelectWrapper>
    </Position>
  )
}

export default React.memo(MultiLevelButtonDropdown)
