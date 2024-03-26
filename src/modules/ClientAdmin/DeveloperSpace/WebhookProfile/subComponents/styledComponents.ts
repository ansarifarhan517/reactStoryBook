import styled from 'styled-components'
import { Grid, IconButton, FontIcon } from 'ui-library'


export const SectionHeaderWrapper = styled.div`
    width: 100%;
    margin-top: 15px;
    & > div {
        & > div {
            & > div {
                font-size: 15px;
                font-weight: 500;
                font-stretch: normal;
                font-style: normal;
                line-height: normal;
                letter-spacing: normal;
                color: #000000;
            }
        }
    }
`

export const SecureWebhookWrapper = styled.div`
    height: 100%;
    &>div{
        display: flex;
        width: 100%;
        height: 100%;
        &>label {
            width: 100%;
            &>div {
                // float: right
            }
        }
    }
    #secureWebhook-label, #recieveChildBranchWebhook-label, #branchSecureWebhook-label {
        font-size: 13px;
        width: calc(100% - 55px);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin: -5px 5px;
    }

    [data-testid='tooltipContainer'] {
        top: 10px;
    }
`
export const SecureWebhookSignatureWrapper = styled.div`
    position: relative;

    .refreshIcon {
        position: absolute;
        right: 3px;
        top: 31%;
    }

    input {
        padding-right: 35px;
    }
`

export const WebhookURLStyle = styled.div`
width: ${(props: { width?: string }) => (props.width ? props.width : '100%')};
    // margin-top: 21px;
    &>div {
        height: 40px;
        &>div {
            &:nth-child(1) {
                width: 93px !important;
                button {
                    max-height: 40px;
                    height: 40px;
                    box-shadow: none;
                    background-color: #efefef;
                    border: solid 1px #e2e2e2;
                    width: 93px;
                    color: #46465f;
                }
            }
            &:nth-child(2) {
                width: 83%;
                .webhookURL-input, .branchWebhookURL-input, .webhookURLTest-input {
                    padding: 1px 140px 1px 20px;
                    border: solid 1px #e2e2e2;
                    margin: 0;
                }
            }
        }
    }

    #innerTypeButton {

        .buttonArrow {
            width: 100%;
            position: relative;
            &:after{
                content: "";
                width: 2px;
                height: 2px;
                border-bottom: 4px solid transparent;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-top: 4px solid #46465f;
                position: absolute;
                top: 18px;
                margin-left: 8px;
            }
            
        }
    }

    .inValidLink {
        .webhookURL-input, .branchWebhookURL-input, .webhookURLTest-input {
            border-color: #ef5447 !important;
        }
    }

    .ivalidUrlType {
        .inValidLink {
            .webhookURL-input, .branchWebhookURL-input, .webhookURLTest-input {
                border-color: #ef5447 !important;
                border-left: 0;
            }
        }

        #innerTypeButton {
            border-color: #ef5447 !important;
            // border-right: 0;
        }
    }


`
export const WebhookLinkWrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: dashed 1px #979797;
    padding: 21px 0;
    .noBorder {
        border-bottom: none;
        padding-botton: 0 !important;
    }

    .webhook-link-action-buttons {
        display:flex;
        justify-content: flex-start;
        // margin-top: 21px;
        width: 10%;
        align-items: center;
        padding-left: 1%
        gap:15px;

        // button.deleteWebhooklink:hover {
        //     color: #fff;
        // }
    }

    button.add-link-button, button.deleteWebhooklink {
        width: 20px;
        height: 20px;
        margin-left: 15px;
        margin-right:15px;
    }

    button.deleteWebhooklink {
        color: #f05548;
        border-color: #f05548;
        margin-right: 11px;
        &:hover {
            color: #f05548;
            background-color: transparent;
        }
    }
`
export const WebhookLinkValidationWrapper = styled.div`
    position: relative;
`

export const WebhookLinkValidation = styled.div`
    position: absolute;
    right: 10px;
    top: 6px;

    .validUrl {
        color: #47b51d;

        .validMsg {
            height: 30px;
            max-height: 30px;
            background: none;
            box-shadow: none;
            color: #47b51d;
            i {
                font-size: 16px;
                height: 16px;
                line-height: 16px;
            }
            span {
                overflow: visible;
                margin: 0 0 0 5px;
            }
        }
    }

    .inValidUrl {
        color: #f05548;

        .invalidMsg {
            height: 30px;
            max-height: 30px;
            background: none;
            box-shadow: none;
            color: #f05548;
            i {
                font-size: 14px;
                height: 14px;
                line-height: 14px;
            }
            span {
                overflow: visible;
                margin: 0 0 0 5px;
            }
        }
    }
`

export const StyledAccordianWrapper = styled.div`
    width: 100%;
    margin-top: 7px;   

    /* Style the accordion section */
    .accordionSection {
        display: flex;
        flex-direction: column;
    }

    /* Style the buttons that are used to open and close the accordion panel */
    .accordion {
        cursor: pointer;
        padding: 18px;
        display: flex;
        align-items: center;
        border: none;
        outline: none;
        height: 55px;
        margin-top: 10px;
        padding: 19px 24px 18px 15px;
        box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.38);
        background-color: #dde2e6;
        transition: background-color 0.6s ease;
    }

    /* Add a background color to the button if it is clicked on (add the .active class with JS), and when you move the mouse over it (hover) */
    // .accordion:hover,
    .active {
        background-color: #5698d3;
    }

    /* Style the accordion content title */
    .accordionTitle {
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        margin: 0;
        color: #000000;
    }

    .active .accordionTitle {
        color: #ffffff;
    }

    /* Style the accordion chevron icon */
    .accordionIcon {
        margin-left: auto;
        transition: transform 0.6s ease;
        color: #000000;
    }

    // .accordion:hover .accordionIcon {
    //     color: #ffffff;
    // }

    /* Style to rotate icon when state is active */
    .active .rotate {
        transform: rotate(180deg);
        color: #ffffff;
    }

    /* Style the accordion content panel. Note: hidden by default */
    .accordionContent {
        box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.38);
        background-color: #ffffff;
        overflow: hidden;
        transition: max-height 0.6s ease;
    }

    /* Style the accordion content text */
    .accordionText {
        font-weight: 400;
        font-size: 14px;
        padding: 18px;
    }

    #defaultCheckboxFieldGroup {
        padding: 0px 25px;
    }

`

export const AddWebhookButtonWrapper = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;

    .addFromButton {
        height: 30px;
        padding: 7px 10px 8px;
        box-shadow: 0 2px 11px -5px #000000;

        i {
            font-size: 17px;
            height: 17px;
            width: 17px;
        }
    }
`

export const FormActionButton = styled(IconButton)`
    padding: 10px 11px 10px 8px;
    borderRadius: 1px;
    boxShadow: 0 2px 11px -5px #000000;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
`

export const WebhookListWrapper = styled.div`
    width: 100%;
`

export const ListViewWrapper = styled.div`
    height:100%;
    // width: 100%;
    // height: calc(100% - 64px);
    .hideEditIcon {
      visibility:hidden;
    }
    .map_pane.live_pane.live_pane_v2 > div  {
      height:100%
    }
`

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
// export const NoDataWrapper = styled.div`
//   display:flex;
//   width:100%;
//   justify-content:center;
//   align-items:center;
// `
export const NoDataWrapper = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .no-data-text {
        margin: 46px 0 32px;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: 0.1px;
        color: #000000;
    }
`

export const WebhookPageHeader = styled.div`
    margin: 18px 0;
    padding: 0 10px 0 0;
    font-size: 17px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: 0.17px;
    color: #000000;


`

export const OauthDropdowns = styled.div`
    display:flex;
    flex-direction: row;
    gap:35px;
    place-self: flex-start;
`
export const OauthForassignOne = styled.div `
    display:flex;
    gap:10px
`

export const NodataWrapper = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .no-data-text {
        margin: 46px 0 32px;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: 0.1px;
        color: #000000;
    }
`

export const IncrementDecrementGrid = styled(Grid)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const FontIconContainer = styled.div`

    button {
        padding: 1px;
        i {
            font-size: 16px;
            line-height: 16px;
            height: 16px;
            padding-top: 1px;
        }
    }


    .deleteWebhookHeader {
        color: #f05548;
        border-color: #f05548;
        margin-right: 11px;
        &:hover {
            color: #f05548;
            background-color: transparent;
        }
    }
    /* border-radius: 50px;
    cursor: pointer;
    border: 1px solid #5698d3;
    display: flex;
    color: #5698d3;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 50%;
    padding-top: 2px; */

  
`;