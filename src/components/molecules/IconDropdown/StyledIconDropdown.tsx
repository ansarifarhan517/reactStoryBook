// import styled, { keyframes } from 'styled-components'
import styled from 'styled-components'
import ButtonStyle from '../../atoms/Button'

interface IIconButtonProps {
  primary?: boolean
  menuIsOpen?: boolean
  width?: string
  disabled?: boolean
}

interface IDropdownItem{
  containterIdentifier?:string
}

interface IDropdownContainer extends React.HTMLAttributes<HTMLDivElement>{
  width?:string,
  menuIsOpen?:boolean
}

export const IconButtonStyled = styled(ButtonStyle)<IIconButtonProps>`
  position: relative;
  display: flex;
  padding: 10px;
  transition: all 0.2s ease-in-out;
  background-color: ${({ menuIsOpen, theme }) =>
    menuIsOpen
      ? theme?.colors?.primary?.main
      : theme?.colors?.primary?.contrastText}}
  color: ${({ menuIsOpen, theme }) =>
    menuIsOpen
      ? theme?.colors?.primary?.contrastText
      : theme?.colors?.primary?.main}}

  span {
    padding: 0px 5px;
    font-size: ${({ intent }) =>
      intent === 'table' || intent === 'page' ? 10 : 14}px;
  }
  i {
    font-size: ${({ intent }) =>
      intent === 'table' || intent === 'page' ? 10 : 15}px;
    height: ${({ intent }) =>
      intent === 'table' || intent === 'page' ? 10 : 15}px;
    line-height: ${({ intent }) =>
      intent === 'table' || intent === 'page' ? 10 : 15}px;
    display: flex;
  }
`
export const StyledColumnOption = styled.div`
  span {
    padding-left: 8px;
  }
  &:hover {
    color: ${({ theme }) => theme?.colors?.primary?.main};
  }
`
export const StyledSelectWrapper = styled.div<IIconButtonProps>`
  width: ${({ width }) => width};
  position: relative;
  .__react_component_tooltip {
    background-color: ${({ theme }) => theme?.colors?.primary?.main} !important;
    border-radius: 3px;
    font-size: 11px;
    opacity: 1 !important;
    font-family: Gotham-Rounded, Sans-Serif;
    font-weight: 400;
    border-color: ${({ theme }) => theme?.colors?.primary?.dark};
    word-break: break-word;
    max-width: 300px;
    width: max-content;
    padding: 10px;
    box-shadow: 0px 5px 25px -10px #000;
  }
`
export const StyledDropdownContainer = styled.div<IDropdownContainer>`
    position: absolute;
    top: 100%;
    z-index: 1000;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    transition: all 0.2s ease-in-out;
    background-color: ${({ menuIsOpen, theme }) =>
      menuIsOpen
        ? theme?.colors?.primary?.main
        : theme?.colors?.primary?.contrastText}}
    color: ${({ menuIsOpen, theme }) =>
      menuIsOpen
        ? theme?.colors?.primary?.contrastText
        : theme?.colors?.primary?.main}}
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
    box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
    width:${({  width }) =>  width};
`;

export const StyledDropdownItem = styled.div`
    outline: none;
    box-shadow: none !important;
    
    background: ${({ theme }) => theme?.colors?.primary?.contrastText};
    cursor:pointer;
    color: ${({ theme }) => theme?.colors?.grey?.['150']};
    font-size: 13px;
    line-height: initial !important;
    height: auto !important;
    box-shadow: none;
    padding: 10px 15px;
    border: none !important;
    font-family: 'Gotham-Rounded', Sans-Serif;
      .hasChildren{
        display: flex;
        justify-content: space-between;
      }
    &:hover{
      color:${({ theme }) => theme?.colors?.primary?.main};
      background-color:${({ theme }) =>  theme?.colors?.grey['50']};
    }

    .icon-angle-right-thin {
      font-size: 11px;
      line-height: 11px;
      height: 11px;
    }

    `


    export const StyledMultiLevelItem = styled.div<IDropdownItem>`

    .dropdown-item-right-${({  containterIdentifier }) =>  containterIdentifier},.dropdown-item-left-${({  containterIdentifier }) =>  containterIdentifier}{
      display:none;
      
    };
    
    &:hover .dropdown-item-right-${({  containterIdentifier }) =>  containterIdentifier}{
        display:block;
        top: inherit;
        right:100%;
        float:right;
        z-index: 1000;
        transform: translateY(-35px);
    }
    &:hover .dropdown-item-left-${({  containterIdentifier }) =>  containterIdentifier}{
      display:block;
      top: inherit;
      left:100%;
      float:right;
      z-index: 1000;
      transform: translateY(-35px);
  }
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

export const IconDropdownDropdownStyled = styled.div`
  .menuAnimate {
    transform-origin: top;
  }
`
//  animation: ${scale} 0.2s ease-in-out;
