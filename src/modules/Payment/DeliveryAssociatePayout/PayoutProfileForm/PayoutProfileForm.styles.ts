import styled from "styled-components";

export const FormWrapper = styled.div`
  height: 100%;
  padding: 70px 15px 15px 15px;

  .grid-item {
    padding: 0px 10px;
  }
`;


export const ChipWrapper = styled.div`
  display: flex;
  padding: 0px 10px;
  font-size: 13px;
  border-radius: 2px;
  background-color: white;
  color: #525252;
  line-height: 26px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: default;
  box-shadow: 0 2px 15px -6px #000;
`

export const FormFieldWrapper = styled.div<{ isDisabled?: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "default")};
  input[disabled] {
    color: black;
    opacity: 1 !important;
    border: 1px solid #9b9b9b;
    background: #f2f2f2;
  }
  // Below is for number field
  input[readonly] {
    color: black;
    opacity: 1 !important;
    border: 1px solid #9b9b9b;
    background: #f2f2f2;
    cursor: not-allowed;
  }
`;
