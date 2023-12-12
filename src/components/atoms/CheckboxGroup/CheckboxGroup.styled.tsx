import styled from 'styled-components'
import { ICheckboxGroupProps } from '.'
import Box from '../Box'

export const CheckboxGroupStyled = styled(Box)<ICheckboxGroupProps>`
  display: ${({ orientation }) => (orientation ? 'block' : 'flex')};
  justify-content: flex-start;
`
