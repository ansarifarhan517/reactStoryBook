import styled from 'styled-components'
import { Grid, Card } from 'ui-library'

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
        background-color: #DADCE0 !important;
    }
    .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
  
        background-color: #bdc1c6 !important;
    }
    .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
        background-color: #80868b !important;
    }
`

export const ListViewWrapper = styled.div`
    height:100%;
    .hideEditIcon {
      visibility:hidden;
    }
    
`

// notification modal

export const StyledCard = styled(Card).attrs(props => ({ className: `sc-box ${props.className || ''}` }))`
  position: relative;
  background-color: white;
  height: 100%;
  width: 100%;
  /* padding: 15px; */
  box-shadow: none;
  .message-configuration-container {
    overflow: auto;
    min-height: 300px;
    max-height:400px;
    padding-right: 32px;
  }
`

interface IStyledAccordion {
    isDisabled: boolean
}

export const AccordionStyled = styled.div<IStyledAccordion>`
    opacity: ${({ isDisabled }) => isDisabled ? '0.5' : '1'};
    color:  ${({ isDisabled }) => isDisabled ? 'lightgrey' : '#000'};
    cursor:  ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
`

export const BoxWrapperWithShadow = styled.div`
    margin: 10px 0px 0px 2px;
`

export const AccordionBoxStyled = styled.div`
    .accordion__header__container{
        background-color: #dde2e6;
        color: black;
    }
    .accordion__header__container i {
        display:none;
    }
    padding: 15px 0px;
`

export const StyledNote = styled.div`
    padding: 5px 0px;
    font-size: 12px;
    & span {
        color:  ${({ theme }) => theme?.color?.primary?.main}
    }
    color:  ${({ theme }) => theme?.color?.grey?.A800};
`

export const NotifyRichTextEditorStyled = styled.div`
    padding: 10px 0px;
    .public-DraftEditor-content[contenteditable=true], .public-DraftEditor-content[contenteditable=true]:focus{
        border:none;
    }
`

export const BoxStyled = styled.div`
    display:flex;
    justify-content: space-between;
`