

import styled from 'styled-components';
import { Button,Card } from "ui-library";

interface IIconButtonProps {
  primary?: boolean
  menuIsOpen?: boolean
  width?: string
  disabled?: boolean
}
export const OrderWrapper = styled.div`
  height: 100%;
  margin-top: 64px;
  padding: 0px 15px;
  margin-bottom: 15px;
  
  .grid-item {
    padding: 0px 10px;
  }
`

export const IconButtonStyled = styled(Button) <IIconButtonProps>`
  position: relative;
  display: flex;
  padding: 10px;
  box-shadow: ${({ theme, disabled }) =>
    `${!disabled && theme?.shadows?.iconButtonPopover}`};
  transition: all 0.2s ease-in-out;
  background-color: ${({ theme, menuIsOpen, primary }) => {
    if (menuIsOpen) {
      return primary ? theme?.colors?.white : theme?.colors?.primary?.main
    }
    return primary ? theme?.colors?.primary?.main : theme?.colors?.white
  }};
  color: ${({ theme, menuIsOpen, primary }) => {
    if (menuIsOpen) {
      return primary ? theme?.colors?.primary?.main : theme?.colors?.white
    }
    return primary ? theme?.colors?.white : theme?.colors?.primary?.main
  }};
  span {
    padding: 0px 5px;
    font-size: ${({ intent }) =>
    intent === 'table' || intent === 'page' ? 12 : 14}px;
  }
  i {
    font-size: ${({ intent }) =>
    intent === 'table' || intent === 'page' ? 12 : 15}px;
    display: flex;
  }
  &:hover {
    box-shadow: ${({ theme, disabled }) =>
    `${!disabled && theme?.shadows?.hoverButtonPopover}`};
    background-color: ${({ theme, primary, disabled }) => {
    if (disabled) {
      return
    }
    return `${primary ? theme?.colors?.white : theme?.colors?.primary?.main}`
  }};
    color: ${({ theme, primary, disabled }) => {
    if (disabled) {
      return
    }
    return `${primary ? theme?.colors?.primary?.main : theme?.colors?.white}`
  }};
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
  & > button i {
    color:grey
  }
  & > button:hover {
      background-color:transparent
  }
`

export const AdvancedFilterWrapper = styled.div`
  & input {
    color: black !important
  }
 
`

export const ShowDeliveryProofImage = styled.span`
display:inline-block;
background: #5697d3;
padding: 10px;
color: #fff;
border-radius: 4px;
cursor: pointer;
`

export const TabNavBar = styled.div`
 & ul {
   margin-bottom: 0;
 }
  & ul> li  {
    display: inline-block;
    background: #fff;
    color: #fff;
    box-shadow: 1px 0px 10px -5px #000;
}
  & ul > li > a {
  padding: 10px;
  display: block;
  font-size: 12px;
}
& ul > li > a.active{
  background: rgb(86 151 211);
  color: #fff;
}
`

export const TabContent = styled.div`
padding: 10px;
box-shadow: 0px 2px 20px -10px #000;

  position: relative;
      margin-top: -1px;
    background: #fff;

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

export const Label = styled.div`
font-size: 14px;
font-weight: bold;
margin-bottom: 5px;`

export const TimelineContainer =  styled.div`
  img{
    max-width: 200px;
    display: block;
  }
`

export const WhiteCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  padding-right: 0;
  padding-bottom: 0;
  box-shadow: 0px 2px 20px -10px #000 !important;
  &.fullWidth {
    width: 100%;
  }

  &.fullHeight {
    height: 100%;
  }
`

export const ItemButton = styled.div`
    background: #5698d3;
    color: #fff;
    line-height: initial;
    vertical-align: middle;
    padding: 3px 3px;
    padding: 3px 5px;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: none;
    margin: 0 auto;
`

export const BulkUpdateWrapper = styled.div`
  #modalwrapperid {
    margin-top: 50px;
  }
`
export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`