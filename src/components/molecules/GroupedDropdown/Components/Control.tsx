import React from 'react'
import { components } from 'react-select'
import { StyledControl } from '../styled'

const Control = ({ children, label, ...props }: any) => {
  return (
    <StyledControl>
      <components.Control {...props}>
        <label className='ControlComponentLabel'>{label}</label>
        {children}
      </components.Control>
    </StyledControl>
  )
}

export default Control
