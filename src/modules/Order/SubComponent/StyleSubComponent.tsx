import styled from 'styled-components';
import { Box } from "ui-library";

export const StyledSms = styled.div`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    background: #dde2e6;
    margin: 0px 0px 10px 0px;
    padding: 10px 15px;
    text-align: left;
    justify-content: space-between;
`

export const StyledSmsCard = styled(Box)`
    padding: 0px; 
    margin-bottom: 10px;
    border: 1px solid #dde2e6;
    .body-field-input {
       margin-top: 30px;
       min-height: 100px;
    }
    .subject-field-input {
        margin-top: 30px;
     }
    .message-count {
        color: #808080;
        font-size:12px;
    }
    .chat {
        color: #808080;
       font-size: 12px;
       margin-right:5px;
    }
`

export const StyledDAListview = styled.div`
overflow: auto;
    min-height: 350px;
    #-selectAll-StyledCheckbox {
        display: none;
    }
    input[type=checkbox] {
       border-radius: 50%;
   }
   .editIcon{
    display: none;  
   }
`

export const NotifyRichTextEditorStyled = styled.div`
    padding: 0px;
    .public-DraftEditor-content[contenteditable=true], .public-DraftEditor-content[contenteditable=true]:focus{
        border:none;
    }`
export const StageMessageFieldWrapper = styled.div`
    margin: 15px 0;
    padding-right: 15px;
    min-width: 200px;
    height: 30px;
    width: 100%;
    float: left;
    font-size: 13px;
    display: flex
    strong {
        color: #000;
        font-family: "Gotham-Rounded-Medium";
        font-size: 13px;
        display: block;
        margin-bottom: 5px;
        font-weight: lighter; 
        display: flex
    }
    span {
        display: block;
        color: #767676;
        font-size: 13px;
        word-wrap: break-word;
        height: 37px;
        overflow-y: auto;
        display: flex;
    }
`