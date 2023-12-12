import React, { useState } from 'react'
import { TextDropdownStyled } from '../Styles'
import { IIconDropdown } from '../../DropDown/interface'
import { StyledSelectWrapper } from '../StyledIconDropdown'
import Button, { tIntent } from '../../../atoms/Button'
// import FontIcon from '../../../atoms/FontIcon'
import Select, { components } from 'react-select'
import { Option } from '../../DropDown/CustomComponent'
import Position from '../../Position'
import Tooltip from '../../Tooltip'

const StyledButton = ({
  primary,
  intent,
  iconButtonDetails,
  theme,
  menuIsOpen,
  disabled,
  ...rest
}: any) => {
  return (
    <Button
      disabled={disabled}
      primary={primary}
      intent={intent as tIntent}
      theme={theme}
      variant='link'
      menuIsOpen={menuIsOpen}
      {...rest}
      style={{ padding: '0px 10px', whiteSpace: 'nowrap' }}
    >
      {/* <FontIcon variant={iconButtonDetails[0]} /> */}
      <span>{iconButtonDetails}</span>
    </Button>
  )
}

{
  /* <Button
      onClick={action('clicked')}
      primary={boolean('primary', false)}
      variant={radios('variant', radioOptions.variant, 'button') as tVariant}
      intent={radios('intent', radioOptions.intent, 'default') as tIntent}
      disabled={boolean('disabled', false)}
    >
      {text('children', 'Default')}
    </Button> */
}

const TextDropdown = ({ defaultProps }: { defaultProps: IIconDropdown }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false) // we are keeping this to send to button as on open we have to make button blue
  const {
    options,
    value,
    primary,
    intent,
    iconButtonDetails,
    width,
    theme,
    onChange,
    tooltipMessage,
    disabled = false,
    tooltipProps = {},
    showOptionIcon = false,
    dropdownPosition
  } = defaultProps
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
        <Select
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
            Control: () => null,
            Option: (props) => (
              <Option showOptionIcon={showOptionIcon} {...props} />
            ),
            Menu: (props) => (
              <components.Menu {...props} className='menuAnimate' />
            )
          }}
          styles={TextDropdownStyled(width, theme, disabled, dropdownPosition)}
          options={options}
          value={value}
          width={width}
          primary={primary}
          intent={intent}
          openMenuOnClick={false}
          iconButtonDetails={iconButtonDetails}
          theme={theme}
          menuIsOpen={menuIsOpen}
          onChange={(input: any) => {
            const obj = Array.from(document.querySelectorAll('.ui-tooltip'))
            obj?.forEach((e) => {
              e.remove()
            })
            onChange && onChange(input)
          }}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
        />
      </StyledSelectWrapper>
    </Position>
  )
}

export default React.memo(TextDropdown)
