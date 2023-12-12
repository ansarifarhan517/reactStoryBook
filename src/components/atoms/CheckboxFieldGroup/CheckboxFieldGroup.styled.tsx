import styled, { css } from 'styled-components'
import { ICheckboxFieldGroupProps } from '.'
import { spacingMixin } from '../../../utilities/mixins'

export const CheckboxFieldGroupStyled = styled.div<ICheckboxFieldGroupProps>`
  display: ${({ orientation }) =>
    orientation ? 'inline-block' : 'inline-flex'};
  justify-content: flex-start;
  align-items: center;
  ${({ variant, error }) =>
    variant === 'form' &&
    css`
      border: 1px solid
        ${({ theme }) =>
          error ? theme?.colors?.error?.main : theme?.colors?.grey?.A800};
      justify-content: space-between;
    `}
  position: relative;
  width: ${({ width }) => width};
  min-height: 40px;
  padding: 0px 0.5em;
  box-sizing: border-box;
  margin: 18px 0;
  ${spacingMixin};
`
