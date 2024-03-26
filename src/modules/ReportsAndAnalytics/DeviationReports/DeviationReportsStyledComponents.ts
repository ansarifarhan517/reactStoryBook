import styled from "styled-components";
import { Box, Grid } from 'ui-library';
import ReactTooltip from 'react-tooltip'

export const ReactTooltipCustom = styled(ReactTooltip)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main} !important;
  border-radius: 3px;
  font-size: 12px;
  padding: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
  
  &.__react_component_tooltip.show {
    opacity: 1;
  }
`

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
  margin-top: 75px;
  margin-left: 15px
`;

export const AddFormButtonContainer = styled(Grid)`
  margin: 20px 10px;
  display: flex;
  button {
    margin-right: 10px;
    min-width: 140px;
  }
`;

export const DeviationReportFormContainer = styled.div`
  > div {
    width: 283px;
    top: 13px;
  }
`;

export const FormWrapper = styled.div`
  width: 100%
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 2px 20px -10px #000;
  border-radius: 3px;
  margin: 15px;
  padding: 20px;
  align-items: flex-start;
`;

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 20px -10px #000;
  background-color: #fff;
  border-radius: 3px;
  margin: 15px;
`;
