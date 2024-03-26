import styled from 'styled-components'

export const AppliedFilterStrip = styled.div`
    justify-content: center;
    z-index: 99;
    width: calc(100%);
    line-height: 35px;
    height: 35px;
    background-color: #bedaf1;
    position: absolute;
    top: 82px;
    left:0px;
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
export const AdvancedFilterWrapper = styled.div`
  & input {
    color: black !important
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

export const BreadCrumbTagWrapper = styled.div`
    display:flex;
    vertical-align: middle;
    align-items: center;
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

export const FilterAppliedTagButtonWrapper = styled.div`
  display:inline-block;
`

export const ButtonWrapper = styled.div`
  display: flex;
  font-size: 11px;
  position:absolute;
  top:0px;
  right:10px;
  cursor:pointer;
  button {
     margin-top: 5px;
  }
  & > button i {
    color:grey
  }
  & > button:hover {
      background-color:transparent
  }
`