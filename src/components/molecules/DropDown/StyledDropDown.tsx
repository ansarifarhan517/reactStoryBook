import { ISelectProps } from './interface'
// import styled, { keyframes } from 'styled-components'
import styled from 'styled-components'

interface IStyledDropDown {
  width: string
}

export const ControlStyle = styled.div<ISelectProps>`
  padding-bottom: 3px;
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1) 0 4px 11px hsla(0, 0%, 0% 0.1);
  background-color: white;
  padding-left: 15px;
  padding-right: 15px;
`

export const StyledFont = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 0.66;
  color: ${({ theme }) => theme?.colors?.grey['800']};
  &:hover {
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
  cursor: pointer;
`

// const scale = keyframes`
//   from {
//     transform: scaleY(0);
//     opacity: 0;
//   }

//   to {
//     transform: scaleY(1);
//     opacity: 1;
//   }
// `

export const StyledDropDown = styled.div<IStyledDropDown>`
  width: ${({ width }) => width};

  .menuAnimate {
    transform-origin: top;
  }
`
// animation: ${scale} 0.2s ease-in-out;

export const DescriptiveOption = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme?.colors?.grey['700']};
`

export const StyledDisabledlabel = styled.div`
  color: grey;
  cursor: disabled;
  opacity: 0.65 !important;
`
