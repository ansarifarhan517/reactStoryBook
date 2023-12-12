import React from 'react'

import Typography, { ITypographyProps } from '../../atoms/Typography'

export interface InputLabelProps extends ITypographyProps {
  required?: boolean
  isChildNode?: boolean
}

const InputLabel = ({ children, required, ...rest }: InputLabelProps) => (
  <Typography
    fontSize='12px'
    color='grey.800'
    bgColor='white'
    fontFamily='Gotham-Rounded,Sans-Serif'
    {...rest}
  >
    {children} {required && !rest.isChildNode && '*'}
  </Typography>
)

export { InputLabel as default }
