import styled from "styled-components";

export const CrateModalWrapper = styled.div`
  max-height: 300px;
  overflow-y: scroll;
  padding: 0px 15px;
  margin-bottom: 15px;
  
  .grid-item {
    padding: 0px 10px;
  }
`

export const AddLineItemButtonWrapper = styled.div`
    cursor: pointer;
    border: 2px dashed #5698d3 !important;
    display: flex;
    justify-content: center;
    padding: 15px 0 15px 0;
`

export const AddLineItemTextWrapper = styled.div`
    font-size: 15px;
    font-weight: lighter;
    margin-left: 15px;
    color: #5698d3;
`

export const CrateModalHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`