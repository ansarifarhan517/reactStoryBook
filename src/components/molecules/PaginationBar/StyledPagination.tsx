import styled, { css } from 'styled-components'
import IconButton, { IIconButtonProps } from '../../atoms/IconButton'

export const StyledPagination = styled.div`
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme?.colors?.grey['A1000']};
  flex-direction: row;
  vertical-align: middle;
`
export const PageRange = styled.div`
  align-items: center;
  font-size: 13px;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
`
export const IconButtonStyled = styled(IconButton) <IIconButtonProps>`
  ${({ disabled }) =>
    disabled &&
    css`
      & {
        opacity: 0.4;
      }
      & * {
        color: ${({ theme }) => `${theme?.colors?.grey?.A1000}`};
      }
    `}
`
