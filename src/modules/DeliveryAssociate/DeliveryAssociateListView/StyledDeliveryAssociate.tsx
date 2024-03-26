import styled from 'styled-components'
import { Grid,ButtonGroup } from 'ui-library'

export const StyledText = styled.div`
  display: block;
  font-style: italic;
  color: #808080;
  transform: translateY(5px);
  line-height: 15px;
  font-weight: normal;
  margin-top: -10px;
`


export const StyledGrid = styled(Grid)`
   flex-grow: 1;
   overflow: hidden;
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
    -webkit-border-radius: 7px;
    border-radius: 7px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 7px !important;
    border-radius: 7px !important;
   
    background-color: #DADCE0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    background-color: #80868b !important;
  }
  .listview-container-deliveryMediumMasterId >div{
    overflow:auto !important;
  }

`
export const StyledButtonGroup= styled(ButtonGroup)`
#listview {
  border-left:none;
 }
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
    line-height: 30px;
    height: 30px;
    background-color: #bedaf1;
    position: absolute;
    top: 83px;
    text-align: center;
`
export const AdvancedFilterLabel = styled.div`
  text-align:center;

`
export const ButtonWrapper = styled.div`
  display: flex;
  font-size: 11px;
  position:absolute;
  top:0px;
  right:10px;
  cursor:pointer;
  margin-top:4px;
  & > button i {
    color:grey
  }
  & > button:hover {
      background-color:transparent
  }
`
export const FilterNumber = styled.span`
    border: 1px solid #ed6261;
    border-radius: 10px;
    background: #ed6261;
    color: #fff;
    position: absolute;
    top: -5px;
    right: -5px;
    width: 15px;
    line-height: 12px;
    font-size: 10px;
    text-align: center;
    padding: 0;
`

export const StyledPrintPage = styled.div`
    display:none;
    @media print {
      td {
        break-inside: avoid;
      }
    }
`

export const FilterAppliedTag = styled.div`
  position: relative;
  cursor: pointer;
  background: #fff;
  display: inline-block;
  padding: 0px 10px;
  font-size: 13px;
  line-height: 26px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 0px 2px 15px -6px #000;
  padding-left: 20px;
  color: #525252;
  margin-left:20px;

  &:before {
    content: '';
      left: -13px;
      position: absolute;
      width: 0;
      height: 0;
      border-top: 13px solid transparent;
      border-bottom: 13px solid transparent;
      border-right: 13px solid #fff;
  }
`

export const FilterAppliedTagLabel = styled.span`
  display:inline-block;
  &:before {
    content: '';
    height: 10px;
    width: 10px;
    background: #eee;
    position: absolute;
    left: 0;
    top: 8px;
    border-radius: 50%;
    box-shadow: inset 1px 2px 8px -4px #000;
  }
`

export const BreadCrumbTagWrapper = styled.div`
    display:flex;
    vertical-align: middle;
    align-items: center;
`
export const FilterAppliedTagButtonWrapper = styled.div`
  display:inline-block;
`