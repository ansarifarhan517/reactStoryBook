import styled from "styled-components";
import { Grid} from 'ui-library';

export const FormContainer = styled.div`
  
   padding: 0 10px;
  .toggle-item {
    margin: auto 0px;
    padding: 25px 0 0 0;
  }
  .grid-item {
    padding: 0px 10px;
  }
  div[class*="-control"] {
    margin-bottom: 0;
  }
`;
export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;