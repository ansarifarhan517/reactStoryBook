import styled from "styled-components";
import { Box, Grid, Position } from 'ui-library';

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
  label {
    white-space: nowrap;
  }
`;

export const ActionButtonWrapper = styled.div`
  display: flex;
  > button {
    margin: 0px 5px;
  }
`
export const ActionBarContainer = styled(Box)`
  margin-left: 2px;
  margin-top: 2px;
`;

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const FormContainer = styled.div`
  height:75%;
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
export const AddFormButtonContainer = styled(Grid)`
  margin: 15px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 92px;
  }
`;

export const FormFieldWrapper = styled(Position)`
  >div div[data-testid="children"] > div{
    font-size: 0px;
  }
`;