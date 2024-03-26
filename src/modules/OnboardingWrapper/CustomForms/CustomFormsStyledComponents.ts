import styled from "styled-components";
import { Box, Grid } from 'ui-library';

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0px;
`;

export const BreadCrumbContainer = styled(Box)`
  margin: 10px 0;
  background-color: #fafafa;
  padding: 10px 0;
`;
export const ActionButtonWrapper = styled.div`
  display: flex;
  > button {
    margin: 0px 5px;
  }
`

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const FormFieldWapper = styled.div`
  label {
    display: flex;
  } 
`;

export const DesignFormGrid = styled(Grid)`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:  center;
`

export const MobilePreviewContainer = styled(Grid)`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:  center;
  box-shadow: 0 2px 5px 0 rgb(65 65 92 / 20%);
  border: solid 1px rgba(151,151,151,0.04);
  border-radius: 4px;
  padding: 50px;
  margin-top: 55px;
  .preview-title {
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

export const IndexCounter = styled(Grid)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
`;

export const ToggleBoxContainer = styled(Grid)`
  display: flex;
  justify-content: center;
  margin-top: 15px;
  label {
    flex-direction: row-reverse;
    margin: 0;
    margin-left: 15px;
  }
`;

export const AddDeleteIconContainer = styled(Grid)`
  display: flex;
    button {
      background: transparent;
      margin-top: 20px;
      border-radius: 50px;
      text-align: center;
      border-width: 2px;
      padding: 13px;
      border-color: inherit;
      border-style: solid;
      margin-left: 10px;
      margin-right: 5px;
      &:hover {
        background-color: transparent;
      }
      i {
        margin-top: 3px;
      }
    }
`;

export const FormContainer = styled.div`
  .form-fields {
    padding: 15px 0 0 15px
  }
  input, div[class*='-control'] {
       margin-bottom: 0; 
  }

  .cf_multiselect div[data-toggle="popover"] {
    width: 91%!important;
    top: 73px!important;
    z-index: 1500;
  }
  .cf_multiselect i.icon-triangle-down{
    margin-top: 10px
  }
`;

export const MobilePreview = styled.div`
&.mobile-preview {
  text-align: left;
  display: flex;
  justify-content: center;
  img {
    position: relative;
    margin-top: 30px;
  }
}
`;

export const Counter = styled.div`
    display: flex;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 1px solid #999;
    margin-top: 2px;
    color: #999;
    align-items: center;
    justify-content: center;
`

export const FieldTypeTile = styled.div`
  line-height: 44px;
  cursor: pointer;
  margin-left: 2px;
  display: flex;
`;

export const FieldTypeIcon = styled.div`
  width: 36px;
  height: 36px;
  line-height: 36px !important;
  text-align: center;
  border: 1px solid #e1e6ef;
  background: #f6f9fd;
  -webkit-transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
  transition: all ease-in-out 0.2s;
  &::hover{
    background-color: #5698d3;
    color: #fff;
  }
`

export const FieldContainer = styled.div`
    background: #fff;
    min-width: 300px;
    max-width: 300px;
    max-height: 413px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 5px 0 rgb(65 65 92 / 20%);
    border: solid 1px rgba(151,151,151,0.04);
    border-radius: 4px;
    li {
      display: block;
      list-style-type: none;
      width: 50%;
      float: left;
      height: 41px;
      line-height: 52px;
      color: #383852;
      font-size: 12px;
      border-width: 0px 0px 1px 1px;
      border-style: solid;
      border-color: #e1e6ef;
      border-radius: 2px;
      -webkit-transition: all ease-in-out 0.2s;
      -moz-transition: all ease-in-out 0.2s;
      -o-transition: all ease-in-out 0.2s;
      transition: all ease-in-out 0.2s;
}
`;

export const FieldTypeContainer = styled(FieldTypeTile)`
        line-height: 41px;
        cursor: pointer;
        margin-left: 2px;
        color: #383852;
        display: flex;
        align-items: center;
        &:hover{
          background: #f6f9fd;
          .field-icon-container {
            border-color: #dee3ec;
            background: #5698d3;
          }
          i {
            color: #fff!important;
          }
        }
`;

export const FieldIconContainer = styled(FieldTypeIcon)`
    width: 36px;
    height: 36px;
    line-height: 36px !important;
    text-align: center;
    border: 1px solid #e1e6ef;
    background: #f6f9fd;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
    margin-right: 5px;
    i {
      font-size: 14px;
      color: #5698d3;
      height: 14px;
      -webkit-transition: all ease-in-out 0.2s;
      -moz-transition: all ease-in-out 0.2s;
      -o-transition: all ease-in-out 0.2s;
      transition: all ease-in-out 0.2s;
    }
`;
export const FieldContainerHeader = styled.div`
    background: #fcfcfd;
    border: 1px solid #e1e6ef;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    &.validation-header {
      margin: 0 -20px;
    }
    h6 {
      color: #42425c;
      height: 40px;
      line-height: 40px;
      margin: 0px;
      font-size: 12px;
      padding-left: 10px;
      font-family: 'Gotham-Rounded-Bold';
    }
`;

export const PreviewTitle = styled(FieldContainerHeader)` 
  position: absolute;
  top: 0;
  width: 100%;  
`;

export const RadioGroupGrid = styled(Grid)`
  padding-left: 0;
  margin-bottom: 15px;
  margin-top: 10px;
`;

export const FieldPropertyEntries = styled.div`
  padding: 20px;
  font-size: 12px;
  overflow-y: auto;
  .no-margin {
    margin: 0;
  }
  .fieldLabel {
    color: #42425c;
  }
  .field-label,
  .maxRange,
  .minRange {
    margin-bottom: 15px;
  }
  .field-property-input {
    height: 35px;
    min-height: 35px;
    line-height: 35px !important;
    overflow-y: auto;
    border: 1px solid #e1e6ef;
    box-shadow: none;
    font-size: 12px;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
    &:focus {
      border: 1px solid #5698d3;
    }
  }
  .field-property-textarea {
    padding: 5px 10px;
    width: 100%;
    resize: none;
    height: 150px;
    min-height: 150px !important;
    line-height: 20px !important;
    overflow-y: auto;
    border: 1px solid #e1e6ef;
    box-shadow: none;
    font-size: 12px;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
    &:focus {
      border: 1px solid #5698d3;
    }
  }
  #select-mandatory {
    border: none;
    white-space: nowrap;
    margin: 0;
    display: flex;
  }
`;

export const FieldPreviewContainer = styled.div`
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 58%;
  position: absolute;
  top: 23%;
  padding-top: 0px;
  left: 20.7%;
  max-height: 400px;
  padding-top: 8px;
  overflow-y: auto;
  li {
    list-style-type: none;
  }
`;

export const FormFieldContainer = styled.div`
  margin-bottom: 10px;
  padding: 10px 5px;
  font-size: 12px;
  z-index: 1000;
  &.active-field {
    background-color: #f6f9fd;
    border: 1px dashed #5698d3;
  }
  input {
    background-color: transparent !important;
    border-bottom: 1px solid #a7a7a7 !important;
    padding: 0;
  }
  textarea {
    height: 95px;
    pointer-events: none;
    border: 1px solid #a7a7a7;
    border-radius: 4px;
    overflow: hidden;
  }
  &.radioGroup > label {
    margin: 2px 0;
    label {
      font-size: 12px;
    }
  }

  &.checkboxGroup > span {
    margin: 2px 0;
    span {
      margin-top: 2px;
    }
    label {
      margin: 0px 5px;
    }
  }
  .menuAnimate {
    width: 100%;
  }
  textarea + div > div {
    font-size: 11px;
    color: #a7a7a7;
  }
  input,
  div[class*="-control"] {
    div[class*="-singleValue"] {
      top: 25% !important;
    }
    &.radioGroup {
      width: 90%;
    }
  }

  /* .field-icon-inside {
   font-size: 13px;
   position: absolute;
   right: 0;
   margin-top: -30px;
 } */
`;

export const IconContainer = styled.div`
  i.icon-cancel-button {
    color: #fff;
    position: absolute;
    right: 10px;
    margin-top: -18px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1100;
    font-size: 12px;
    background: #5698d3;
    display:flex;
    align-items:center;
    justify-content:center;
    height: 15px;
    width: 15px;
  }
  i.icon-cancel-button::before {
    position: absolute;
    top: 15%;
    left: 8%;
  }
  &.field-icon-inside i {
    font-size: 16px;
    color: #a6a6a7;
    position: absolute;
    right: 10px;
    margin-top: 6px;
  }
`;

export const FieldIconInside = styled(IconContainer)`
  font-size: 16px;
  position: absolute;
  right: 0;
  margin-top: -30px;
`;

export const BarcodeIcon = styled.div`
  display: flex;
  padding: 3px;
  border: 2px solid;
  border-radius: 50%;
  color: #5698d3;
`;

export const BarcodeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

export const TextWrapper = styled.div`
  width: 80%;
`;

export const Esign = styled.div`
  border-color: #383838;
  width: 320px;
  height: 95px;
  border-radius: 2px;
  background-color: #fcfcfd;
  border: solid 1px #e1e6ef;
  padding-left: 9px;
  width: 100%;
  -webkit-transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
  transition: all ease-in-out 0.2s;
  font-size: 12px;
  letter-spacing: 0.3px;
  border-radius: 0px;
  box-shadow: none !important;
`;

export const Epod = styled.div`
  border-color: #383838;
  width: 170px;
  height: 95px;
  border-radius: 2px;
  background-color: #fcfcfd;
  border: solid 1px #e1e6ef;
  padding-left: 9px;
  color: #555555;
  -webkit-transition: all ease-in-out 0.2s;
  -moz-transition: all ease-in-out 0.2s;
  -o-transition: all ease-in-out 0.2s;
  transition: all ease-in-out 0.2s;
  font-size: 12px;
  letter-spacing: 0.3px;
  border-radius: 0px;
  box-shadow: none !important;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  i {
    font-size: 26px;
    margin-bottom: 5px;
  }
`;

export const OptionContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  input {
    height: 35px;
    min-height: 35px !important;
    line-height: 35px;
    border: 1px solid #e1e6ef;
    box-shadow: none;
    font-size: 12px;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
  }
  button {
    margin-top: 0;
    width: 35px;
    height: 35px;
    line-height: 34px !important;
    font-size: 34px;
    text-align: center !important;
    border: 1px solid #e1e6ef;
    background: #f6f9fd;
    -webkit-transition: all ease-in-out 0.2s;
    -moz-transition: all ease-in-out 0.2s;
    -o-transition: all ease-in-out 0.2s;
    transition: all ease-in-out 0.2s;
    color: #5698d3;
    box-shadow: none !important;

    i {
      font-size: 12px;
      align-items: center;
    }
  }
`;

export const ButtonContainer = styled.div`
  max-width: 300px;
  min-width: 300px;
  width: 100%;
  display: flex;
  margin-top: 15px;
  gap: 15px;
  button {
    height: 40px;
    box-shadow: 0px 2px 11px -5px #000;
    display: inline-block;
    line-height: 40px;
    cursor: pointer;
    border-radius: 0;
    width: 100%;
    padding: 0px 15px;
    letter-spacing: 0.6px;
    border-radius: 2px !important;
    border: none !important;
    font-size: 13px;
    -webkit-transition: all 0.2s ease-out;
    -moz-transition: all 0.2s ease-out;
    -o-transition: all 0.2s ease-out;
    transition: all 0.2s ease-out;
  }
  .white {
    background: #fff !important;
    color: #5698d3 !important;
  }
`;

export const FormTitle = styled.div`
  position: absolute;
  top: 18.5%;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  width: 50%;
  font-family: 'Gotham-Rounded-Bold';
`;

export const CameraIconContainer = styled.div`
    margin: 0px auto;
    max-width: 64px;
`

export const PreviewSectionName = styled.div`
  text-align: left;
  padding: 15px 5px 20px;
  font-weight: bold;
  font-size: 12px;
  font-family: 'Gotham-Rounded-Bold';
`;

export const ListViewMobilePreview = styled(Box)`
  margin: 0 135px;
  .form-title {
    top: 17.5%;
    width: 220px;
    left: 185px;
  }
  .form-title + div {
    width: 39%;
    position: absolute;
    top: 24%;
    padding-top: 0px;
    left: 30%;
  }
`

export const PreviewModalContainer = styled.div`
div[class*='baseStyles__BaseModalBackground-'] {
  padding-top: 40px;
}
  #modal-body-id {
    position: relative;
    max-height: 85vh;
    overflow-y: auto;
  }

`

export const TriggerEventsModalContainer = styled.div`
div[class*='baseStyles__BaseModalBackground-'] {
  padding-top: 40px;
}
  #modal-body-id {
    max-height: 80vh;
    overflow-y: auto;
  }
`;

export const Divider = styled.div`
  height: .5px;
  opacity: 0.5;
  width: 100%;
  margin: 10px 0;
  background-color: #999;
`;