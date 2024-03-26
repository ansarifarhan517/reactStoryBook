import styled from "styled-components";
import { Card, Grid, Position, IconButton } from "ui-library";

export const DashboardCard = styled(Card)<{
  isSelectable: boolean;
  selected?: boolean;
}>`
  height: 75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  ${({ isSelectable }) => isSelectable && "cursor:pointer"};
  ${({ selected, isSelectable }) =>
    isSelectable &&
    selected &&
    `
    background-color:#4695d8;
    color:#fff !important;
`};
`;

export const TextWrapper = styled.div<any>`
  display: flex;
  align-self: center;
`;

export const StarGroup = styled.div`
  display: flex;
  align-self: center;
`;

export const CardText = styled.div<{
  isSelectable: boolean;
  selected?: boolean;
}>`
  color: #4695d8;
  text-align: center;
  font-size: 17px;
  ${({ selected, isSelectable }) =>
    isSelectable &&
    selected &&
    `
  background-color:#4695d8;
  color:#fff !important;
`};
`;
export const CardDesc = styled.div<{
  isSelectable: boolean;
  selected?: boolean;
}>`
  align-self: center;
  color: #545454;
  font-size: 13px;
  ${({ selected, isSelectable }) =>
    isSelectable &&
    selected &&
    `
  background-color:#4695d8;
  color:#fff !important;
`};
`;

export const PercentageOnCard = styled.div<{ positive?: boolean }>`
  position: absolute;
  top: 2em;
  right: 2em;
  align-self: flex-end;
  font-size: 14px;
  ${({ positive }) => (positive ? "color:#27bf00" : "color:#f05548")};
`;

export const ChartGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

export const ChartModeButton = styled.div`
  align-self: flex-end;
`;
export const WordWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 15px;
`;
export const Word = styled.div<{
  value: number;
  maxValue: number;
  minValue: number;
}>`
  font-size: ${(props) =>
    (props.value * 35) / (props.maxValue - props.minValue) + "px"};

  line-height: ${(props) =>
    (props.value * 100) / (props.maxValue - props.minValue) + "px"};
  font-weight: ${(props) =>
    (props.value * 900) / (props.maxValue - props.minValue) > 900
      ? 900
      : (props.value * 900) / (props.maxValue - props.minValue)};
  color: ${(props) =>
    "rgb(5 115 225 /" +
    (props.value * 200) / (props.maxValue - props.minValue) +
    "%)"};
  padding: 10px;
`;

export const ModalWrapper = styled.div<any>`
  min-width: 600px;
  max-width: 600px;
  margin-left: auto;
  background-color: #fff;
  right: 1%;
  box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
  label {
    display: inline-block;
  }
  position: absolute;
  top: 21%;
  z-index: ${({ theme }) => theme?.zIndex?.modal};

  & > div {
    position: relative;
    top: auto;
  }
  span {
    font-size: 13px;
  }
  .IconButtonLeft {
    top: 2px;
  }
  .IconButtonRight {
    top: 2px;
  }
`;

export const HeaderWrapper = styled(Position)`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  font-size: 13px;
  padding: 0.6em;
  display: flex;
  justify-content: space-between;
  cursor: move;
`;
export const IconButtonStyled = styled(IconButton)`
  padding: 0px;
  & > i {
    font-size: 10px;
  }
  button {
    &:hover {
      background-color: initial;
    }
  }
`;
