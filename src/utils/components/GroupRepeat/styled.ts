import styled from "styled-components";

export const GroupFieldsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;
export const RepeatButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  .icon-Add {
    border: 1px solid #5698d3;
    background-color: #5698d3;
    color: #fff;
    cursor: pointer;
    width: 12px;
    height: 20px;
    margin: 5px;
    padding: 8px 9px;
    .icon {
      font-size: 8px;
    }
  }
  .icon-Add[disabled]{
    background-color: white;
  }
  .icon-Remove {
    border: 1px solid red;
    color: red;
    cursor: pointer;
    width: 12px;
    height: 20px;
    margin: 5px;
    padding: 9px;
    .icon {
      font-size: 12px;
    }
  }
`;

export const SectionWrapper = styled.div`
`;

export const ModalFooterButtonsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const BasicCostWrapper = styled.div`

  input::placeholder {
    text-transform: initial !important; 
  }
`;
