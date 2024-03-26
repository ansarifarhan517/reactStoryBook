import styled from "styled-components";
import { ButtonGroup } from "ui-library";
export const DashboardWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 65px);
  margin-top: 70px;
`;

export const FilterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 15px;
  align-items: center;
`;

export const FilterContainter = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledButtonGroup = styled(ButtonGroup)`
  #YEAR {
    width: 90px;
  }
`;
