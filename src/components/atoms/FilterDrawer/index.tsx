import React from 'react'
import styled, { keyframes } from 'styled-components'

const slideIn = keyframes`
    from {
      right: -200px;
    }
    to {
      right: 0px;
    }
`

const FilterDrawerStyled = styled.div`
  box-shadow: -7px 2px 15px 0 rgba(0, 0, 0, 0.19);
  z-index: ${({ theme }) => theme?.zIndex?.drawer};
  position: fixed;
  top: 0px;
  right: 0px;
  overflow: scroll;
  height: 100vh;
  width: 400px;
  display: none;
  &.open {
    animation: ${slideIn} 0.6s;
    display: block;
  }
`

export interface IFilterDrawerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const FilterDrawer = ({
  isOpen = false,
  children,
  ...rest
}: IFilterDrawerProps) => {
  return (
    <FilterDrawerStyled className={isOpen ? 'open' : ''} {...rest}>
      {children}
    </FilterDrawerStyled>
  )
}

export default FilterDrawer
