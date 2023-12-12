import React, { useEffect, useRef, useState } from 'react'
import Select, { components } from 'react-select'
import { Option } from '../../DropDown/CustomComponent'
import { IIconDropdown } from '../../DropDown/interface'
import Position from '../../Position'
import { StyledSelectWrapper } from '../StyledIconDropdown'
import { DropdownUniversalStyled } from '../Styles'

const DropdownUniversal = ({
  defaultProps
}: {
  defaultProps: IIconDropdown
}) => {
  const node = useRef(null)
  const {
    options,
    value,
    primary,
    intent,
    iconButtonDetails,
    width,
    theme,
    children,
    onChange,
    customStyle,
    menuIsOpen: menuOpen,
    optionComponent
  } = defaultProps
  const [menuIsOpen, setMenuIsOpen] = useState(!!menuOpen) // we are keeping this to send to button as on open we have to make button blue

  useEffect(() => {
    setMenuIsOpen(!!menuOpen)
  }, [menuOpen])
  // close
  const handleOutsideClick = (e: any) => {
    const n = (node?.current as unknown) as Node
    if (n?.contains(e?.target)) return
    setMenuIsOpen(false)
  }
  // if passing children from outside then only close on outside click
  useEffect(() => {
    children && document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      children && document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  return (
    <Position type='relative' style={{ width: '100%' }}>
      {children &&
        children({ selectedOption: value as any, menuIsOpen, setMenuIsOpen })}
      <StyledSelectWrapper
        width={width}
        onClick={(e: any) => {
          e.stopPropagation()
        }}
        ref={node}
      >
        <Select
          components={{
            IndicatorSeparator: () => null,
            DropdownIndicator: () => null,
            Option,
            Menu: (props) => (
              <components.Menu {...props} className='menuAnimate' />
            )
          }}
          styles={customStyle || DropdownUniversalStyled(width, theme, false)}
          options={options}
          value={value}
          width={width}
          primary={primary}
          intent={intent}
          openMenuOnClick={false}
          iconButtonDetails={iconButtonDetails}
          theme={theme}
          optionComponent={optionComponent}
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

export default React.memo(DropdownUniversal)
