import styled from "styled-components";
import { Grid, Card } from 'ui-library';

export const StyledCard = styled(Card).attrs((props) => ({
  className: `sc-card ${props.className || ""}`,
}))`
  position: relative;
  overflow: hidden;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  padding: 15px;
  .tracker-delete-action {
    font-size: 17px !important;
    cursor: pointer;
    color: #5698d3;
  }
  .accordion__header__container {
    min-height: 55px;
  }
`;

export const BorderButton = styled.button.attrs((props) => ({
  className: `sc-border-button ${props.className || ""}`,
  disabled: props.disabled,
}))`
  height: 40px;
  padding: 0px 15px;
  margin: 16px 0px;
  line-height: 38px;
  width: 100%;
  background: transparent;
  border-radius: 3px;
  border-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 2px dashed ${({ theme }) => theme?.colors?.primary?.main};
  cursor: pointer;
  text-align: center;
`;
export const StyledFontContainer = styled.div`
  position: absolute;
  right: 43px;
  display: flex;
  justify-content: space-between;
  width: 70px;
`;
export const FormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;

export const SimpleTableCSS = styled(Grid)`
  table.simple-table tr,
  table.simple-table thead {
    border-bottom: 1px solid #ddd;
  }
  table.simple-table tr:last-child {
    border: none;
  }
  table.simple-table th,
  table.simple-table td {
    padding: 15px;
    color: #525252;
    font-size: 13px;
    word-wrap: break-word;
  }
  table.simple-table th {
    font-family: "Gotham-Rounded-Medium";
    vertical-align: top;
    color: #000;
    font-size: 14px;
    padding: 15px 15px;
  }
  table.simple-table.table-border {
    border: 1px solid #ddd;
  }
  
  table.simple-table .delete-action {
    font-size: 24px;
    cursor: pointer;
    color: #5698d3;
  }
`;

export const BoxStyle = {
  padding: "10px",
  background: "#FFFFFF",
  border: "1px solid #D9D9D9",
  display: "flex",
  flexDirection: 'column' as 'column',
  position: 'relative' as 'relative',
  marginBottom: "8px",
  borderRadius: "5px"
}

export const OuterBox = {
  padding: "10px",
  backgroundColor: '#FAFAFA'
}

export const ModalWrapperForConsent = styled.div`
  #modalwrapperid {
    padding-top: 100px;
  }
`;