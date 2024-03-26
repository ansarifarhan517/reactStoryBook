import styled from 'styled-components'

export const RateProfileWrapper = styled.div`
    .rateProfileForm {
        display:inline-flex;
        min-width: 100px;
        .sc-main-content-container {
            min-height:auto !important;
        }
    }
    .AccordionHeaderTitle{
       font-weight: bold;
    }
    .AccordionContentDisable{
       position:relative;
       &::before{
        content: "";
        position: absolute;
        background: #ffffff59;
        width: 100%;
        height: 100%;
        z-index: 1;
        left: 0;
        top: 0;
        cursor: no-drop;
       }
    }
    .accordion__header {
        .accordion-header-title {
            text-transform: initial !important;
        }
        .accordion-header-sub-title {
            text-transform: initial !important;
        }
    }
    .SurchargeMinimumCost {
        min-width:150px;
    }
    .modal-body-wrap{
        max-height: calc(100vh - 45px - 71px - 71px);
        overflow-y: auto;
        overflow-x: clip;
        padding-right: 5px;
        padding-bottom: 10px;
    }
`

export const NoteStyled = styled.div`
    text-transform: initial;
`