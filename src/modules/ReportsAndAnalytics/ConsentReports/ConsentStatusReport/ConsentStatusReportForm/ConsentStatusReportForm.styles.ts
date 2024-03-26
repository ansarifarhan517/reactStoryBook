import styled from "styled-components";
import { Grid } from "ui-library";

export const FormWrapper = styled.div`
  
  width: 100%;
  .grid-item {
    padding: 0px 10px;
  }
`;

export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;
