import styled from "styled-components";
import { Grid } from "ui-library";

export const ListGridWrapper = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 2px 20px -10px #000;
  margin-top: 10px;
`;

export const StyledGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  width: 100%;
  & button[disabled] {
    opacity: 0.2 !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    cursor: grab !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
    -webkit-border-radius: 9px;
    border-radius: 9px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 9px !important;
    border-radius: 9px !important;
    // background-color: #dadceo !important;
    background-color: #dadce0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    // background-color: #bdc1c6 !important;
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    // background-color: #80868b !important;
    background-color: #80868b !important;
  }
`;
