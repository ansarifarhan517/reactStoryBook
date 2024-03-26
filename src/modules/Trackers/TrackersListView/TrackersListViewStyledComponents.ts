import styled from "styled-components";
import { Box, Grid, ButtonGroup } from 'ui-library';

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
      background-color: #DADCE0 !important;
    }
    .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
      background-color: #bdc1c6 !important;
    }
    .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
      background-color: #80868b !important;
    }
`
export const StyledButtonGroup= styled(ButtonGroup)`
#listview {
  border-left:none;
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
export const BreadCrumbTagWrapper = styled.div`
    display:flex;
    vertical-align: middle;
    align-items: center;
`
