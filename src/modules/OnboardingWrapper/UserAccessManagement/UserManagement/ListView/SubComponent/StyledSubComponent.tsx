import styled, { keyframes } from 'styled-components'
import { Position, IconButton } from 'ui-library'

interface IModalWrapper {
  viewMode?: 'listview' | 'mapview'
}

export const FadeIn = keyframes`
0% {
  opacity:0;
}
100% {
  opacity:1;
}
`
export const ModalWrapper = styled.div<IModalWrapper>`
  min-width: 600px;
  max-width: 600px;
  margin-left: auto;
  background-color: #fff;
  box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
  label {
    display: inline-block;
  }
  animation: 500ms ${FadeIn};
  position: absolute;
 right: ${({viewMode})=> viewMode === 'listview' ? '1%' : '51%'};
  top: 21%;
  z-index: ${({ theme }) => theme?.zIndex?.modal};

  & > div {
    position: relative;
    top: auto;
  }
  span{
    font-size: 13px;
  }
  .IconButtonLeft{
    top: 2px;
  }
  .IconButtonRight{
    top: 2px;
  }
`
export const HeaderWrapper = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  font-size: 13px;
  padding: 0.6em;
  display: flex;
  justify-content: space-between;
  cursor: move;
`
export const IconButtonStyled = styled(IconButton)`
  padding: 0px;
  & > i {
    font-size: 10px;
  }
  button{
    &:hover{
      background-color: initial;
    }
  }
`

export const TextInputStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
  & > div {
    width: 100%;
    & input {
      width: -webkit-fill-available;
    }
  }
  .date-range-download-input{
    line-height: 39px;
  }
`

export const StyledError = styled.div`
    color: red;
    margin-top: -10px;
    margin-bottom: 10px;
    font-size: 12px;
`
export const NotifyImage = styled.img`
    font-size: 12px;
    margin: auto;
    display: flex;
    width: 200px;
`
export const StyledNotifyBox = styled.div`
    font-size: 13px;
    color: #4c4c4c;
    .textarea-input {
      overflow: auto;
      padding: 12px;
    }
`
/***
 * .multiselct-input {
    width: 100%;
  } 
  div[class*="control"] {
    width: 100%;
  }
 */
export const StyledBulkUpdate = styled.div`
   .div-width {
     width: 25%;
   }
   .multiselct-input {
    width: 100%;
  }
  .number-text-input {
    width: 100%;
  }
  .number-field-input {
    max-width: 85px;
    border: hidden;
    margin: 0px;
    min-height: 30px;
  }
  .number-field-label{
    display: none;
  }
  .__react_component_tooltip{
    opacity: 1 !important;
  }
  #skill-set-input{
    color:${({theme})=> theme?.colors?.grey?.['A800']};
  
  }
  #weekly-off-input{
    color:${({theme})=> theme?.colors?.grey?.['A800']};
   
  }
`

export const StyledChangePassword = styled.div`
   font-size: 13px;
   button[disabled]{
     opacity: 0.65;
   }
   #error-tooltip{
     display: none;
   }

`