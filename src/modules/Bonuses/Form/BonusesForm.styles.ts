import styled from "styled-components";

export const FormWrapper = styled.div`
  height: 100%;
  padding: 70px 15px 15px 15px;

  .grid-item {
    padding: 0px 10px;
  }
`;

export const FormAdvancedFilterWrapper = styled.div`
  .fade-overlay {
    position: relative;
    &:before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: #ffffff78;
      z-index: 1;
    }
  }
`;

export const OverNightWrapper = styled.div`
  color: #777;
  font-size: 12px;
  margin-top: -15px;
`;

export const FormFieldWrapper = styled.div<{ isDisabled?: boolean }>`
  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "default")};
  input[disabled] {
    color: black;
    opacity: 1 !important;
    border: 1px solid #9b9b9b;
    background: #f2f2f2;
  }
`;

export const SlabFieldsWrapper = styled.div`
  max-height: calc(100vh - 45px - 71px - 71px);
  overflow-y: auto;
  overflow-x: clip;
  padding-right: 5px;
  padding-bottom: 30px;
  padding-top: 35px;
`;
