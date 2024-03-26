import styled from "styled-components";
import { Card, Grid } from "ui-library";

const BodyGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-shadow: 0 2px 20px -10px #000;
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
    background-color: #dadce0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    background-color: #80868b !important;
  }
`;

const BodyGridItem = styled(Grid)`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

const BodyCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-right: 0;
  padding-bottom: 0;
`;


export { BodyCardContainer, BodyGridItem, BodyGrid}