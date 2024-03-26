import styled from "styled-components";
import { Grid, Box } from 'ui-library'

export const StyledGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height:100%;
  width: 100%;
  & button[disabled] {
    opacity:0.2 !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    cursor: grab !important;

  }

  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
    -webkit-border-radius: 9px;
    border-radius: 9px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 9px !important;
    border-radius: 9px !important;
    // background-color: #dadceo !important;
    background-color: #DADCE0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    // background-color: #bdc1c6 !important;
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    // background-color: #80868b !important;
    background-color: #80868b !important;
  }
`

export const FilterNumber = styled.span`
border: 1px solid #ed6261;
border-radius: 10px;
background: #ed6261;
color: #fff;
position: absolute;
top: 0px;
right: -5px;
width: 15px;
line-height: 12px;
font-size: 10px;
text-align: center;
padding: 0;
`
export const AdvancedFilterWrapper = styled.div`
  & input {
    color: black !important
  }
 
`
export const AppliedFilterStrip = styled.div`
    justify-content: center;
    z-index: 99;
    width: 100%;
    line-height: 35px;
    height: 35px;
    background-color: #bedaf1;
    position: absolute;
    top: 77px;
    text-align: center;
`
export const AdvancedFilterLabel = styled.div`
  text-align:center;
  color: #424242;

`
export const IconButtonStyled = styled.div`
  position:absolute;
  top: 6px;
  right: 5px;

  button {
      padding: 0;
      color: #424242;
      height: 23px;
  }

  button: hover {
    background-color: transparent;
  }

  i {
      font-size: 10px;
  }
`