import styled from "styled-components";
import { IFlexContainer } from "./BonusesList.model";
import { Grid, Card } from "ui-library";

export const FlexContainer = styled.div<IFlexContainer>`
  display: flex;
  width: ${(props) => (props.width ? props.width : "100%")};
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : "row"};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : ""};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "")};
  padding: ${(props) => (props.padding ? props.padding : "")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  color: ${(props) => (props.color ? props.color : "black")};
  margin: ${(props) => (props.margin ? props.margin : "")};
  gap: ${(props) => (props.gap ? props.gap : "")};
  height: ${(props) => (props.height ? props.height : "")};
`;

export const PageContainer = styled.div`
  padding: 64px 15px 15px 15px;
  height: 100vh;
  width: 100%;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`;

export const BodyGrid = styled(Grid)`
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

export const BodyGridItem = styled(Grid)`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

export const BodyCardContainer = styled(Card)`
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

export const NoDataWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;

export const DAMappedNumber = styled.div<{disabledValue: boolean}>`
  background: #5698d3;
  color: #fff;
  line-height: initial;
  vertical-align: middle;
  padding: 3px 3px;
  padding: 3px 5px;
  border-radius: 2px;
  cursor: ${(props) => (props.disabledValue ? "not-allowed" : "pointer")};
  box-shadow: none;
  margin: 0 auto;
`;
