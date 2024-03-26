import styled from "styled-components";
import { AccordionContent, Box, Grid} from 'ui-library';

export const FormContainer = styled.div`
  
   padding: 0 10px;
  .toggle-item {
    margin: auto 0px;
    padding: 25px 0 0 0;
  }
  .category-item{
    padding: 0px 10px;
    margin-bottom: 12px;
  }
  .grid-item {
    padding: 0px 10px;
    margin-top: 6px;
  }
  .alertSetting-item{
    padding: 0px 10px;
  }
  div[class*="-control"] {
    margin-bottom: 0;
  }
`;
export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
  & > div {
    & > div {
      & > div {
        font-size: 15px;
        font-weight: 500;
      }
    }
  }
`;

export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    width: 200px;
  }
`;

export const AddNewAlertButtonWrapper = styled.div`
  cursor: pointer;
  border: 2px dashed #5698d3 !important;
  display: flex;
  justify-content: center;
  padding: 10px 0 10px 0;
  margin-top: "6px";

  .addNewButtonDisable {
    opacity: 0.5;
    cursor: no-drop;
  }
`

export const AddNewAlertTextWrapper = styled.div`
  font-size: 12px;
  font-weight: lighter;
  margin-left: 15px;
  color: #5698d3;
`

export const CheckPointFormContainer = styled(Box)`
  width: 100%;
  height: 100%;

  .form-header {
    width: 100%;
    margin-top: 80px;
    margin-bottom: 16px;
  }

  .box-container {
    width: 100%;
    height: 83vh;
  }

  .card-container,
  .circle-map-card {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #fff;
    overflow: hidden;
    box-shadow: 0 2px 20px -10px #000;
    height: 83vh;
    margin-top: 20px;
  }

  .card-container {
    width: 30%;
    padding-right: 15px;
    padding-bottom: 15px;
    padding-top: 35px;
    padding-left: 15px;
  }

  .circle-map-card {
    width: 70%;
    padding: 0;
    margin-left: 5px;
  }

  .bottom-spacing {
    margin-bottom: 15px;
  }
`;

export const AlertWrapper = styled.div`
  font-size: 14px;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 63vh;
`;


export const StyledAccordionWrapper = styled(AccordionContent)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .mins-container{
    position: relative;
    top: 28px;
    margin-left: 4px;
    margin-right: 4px;
  }
  .accordionContentDisable{
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
`;

export const StyledBox = styled(Box)`
  display: flex;
  cursor: pointer;
`;

export const FormFieldsWrapper = styled.div`
  display: flex;
  padding: 10px 10px 0px 10px;
  width: 85%;
`;

export const StyledGrid = styled(Grid)`
  width: 100%;
  padding-right: 10px;
`

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const ShiftTimingWrapper = styled.div`
  margin-bottom: 16px;
`;

export const AccordionWrapper = styled.div`
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 4px;
`
export const AccrodianContentWrapper = styled(AccordionContent)<{isDisabled: boolean}>`
  content: ${(props) => props.isDisabled ? "" : null};
  opacity: ${(props) => props.isDisabled ? 0.7 : 1};
  pointer-events: ${(props) => props.isDisabled ? "none" : ""};
`