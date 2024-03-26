import styled from "styled-components";
import { Grid, Card } from 'ui-library'

export const StyledGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height:100%;
  width: 100%;
  & button[disabled] {
  opacity:0.2 !important;
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
  background-color: #DADCE0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
  // background-color: #bdc1c6 !important;
  background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
  // background-color: #80868b !important;
  background-color: #80868b !important;
  }
`

export const WhiteCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  padding-right: 0;
  padding-bottom: 0;
  box-shadow: 0px 2px 20px -10px #000 !important;
  &.fullWidth {
    width: 100%;
  }

  &.fullHeight {
    height: 100%;
  }
`