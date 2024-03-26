import styled from "styled-components";
import { Card, Grid, IconButton, Box, AccordionHeaderTitle } from 'ui-library'

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
    .gridDisplay {
        display: flex;
        overflow: hidden;
    }
    .mapView {
        padding-left: 10px;
    }
`

export const SectionHeaderWrapper = styled.div`
width: 100%;
& > div {
    & > div {
        & > div {
            font-size: 15px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: normal;
            letter-spacing: normal;
            color: #000000;
        }
    }
}
`
export const Preview = styled.div`
  padding: 15px 50px;
  background-color: #f0f0f0;
  height: 700px;
  overflow-y: auto;
`;

export const BlankPreview = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 700px;
    color: #939393;
    margin-right: 50px;
    font-size: 17px;
    background-color: #f0f0f0;
`;

export const FormActionButton = styled(IconButton)`
    padding: 10px 11px 10px 8px;
    borderRadius: 1px;
    boxShadow: 0 2px 11px -5px #000000;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
`

export const TabsWrapper =styled.div`
    .tabs {
        .tabs__panels {
            .tabs__tracker {
                [data-id="html"] {
                    position: absolute;
                    width: 95%
                }
            }
        } 
    }
    .ace_scrollbar {
        z-index: 0;
    }
`

export const EditTextWrapper = styled.div`
    font-size: 17px;
    font-weight: 500;
    color: #000000;
    padding-top: 5px;
`

export const EditTemplateWrapper = styled.div`
    .ace_scrollbar {
        z-index: 0;
    }
`

export const IFrameWrapper = styled.div`
    background-color: #ffffff;
    width: max-content;
    min-width: 425px;
    height: 100%;
    margin: 0 auto;
`

export const PreviewWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;      
  min-height: 201px;
  height: 400px;
  margin: 10px; 
  padding: 14px 63px 14px 64px;
  border: solid 1px #d1d1d1;
  background-color: #f1f3f4;
  cursor: pointer;
  overflow-y: auto;
`

export const PreviewContainer = styled.div`
background: ${(props) => props.className?.includes("preview-container-active") ? "rgba(109, 168, 221, 0.33)" : "transparent"};
padding: 0;
border: ${(props) => props.className?.includes("preview-container-active") ? "solid 4px #5698d3" : "none"};
border-radius: ${(props) => props.className?.includes("preview-container-active") ? "9px" : "unset"};
`;

export const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #fff;
    overflow: hidden;
    width: 100%;
    padding-right: 0;
    padding-bottom: 0;

    .listView {
        height: 100%;
        overflow: visible;
    }
    .color {
        color: inherit;
    }
`

export const RoutesNumber = styled.div<{disabledValue: boolean}>`
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
`

export const MapWrapper = styled(Card)`
& > div {
    height: 100%;
}
padding: 0;
.leaflet-draw,
.leaflet-control-measure {
    display: none;
}
.leaflet-control { z-index: unset !important}
`

export const ChipWrapper = styled.div`
  display: flex;
  padding: 0px 10px;
  font-size: 13px;
  border-radius: 2px;
  background-color: white;
  color: #525252;
  line-height: 26px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: default;
  box-shadow: 0 2px 15px -6px #000;
`

export const ShapeButton = styled.div<{includePadding?: boolean, drawActive?: boolean }>`
    position: relative;
    cursor: pointer;
    width: 30px;
    height: 30px;
    background: ${(props) => (props.drawActive ? "#5698D3" : "white")};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
`

export const ShapeOptionsDropdown = styled.div<{showOptions:boolean}>`
    display: ${(props) => (props.showOptions ? "block" : "none")};
    position: absolute;
    right: -2px;
    top: 40px;
    background: white;
    z-index: 9999;
`

export const ShapeOptionWrapper = styled.div<{includeBorder?: boolean}>`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;
    cursor: pointer;
    border-bottom: ${(props) => (props.includeBorder ? "1px solid rgba(0, 0, 0, 0.2)" : "none")};;
`

export const AttachCheckpointsWrapper =  styled.div`
    background: rgba(12, 26, 31, 0.71);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    outline: 0;

    & > div {
        margin: 150px 0px;
        position: absolute;
        left: 33%;
    }

    .linkInfo {
        color: grey;
        font-size: 13;
    }
`

export const ChipsContainerWrapper = styled.div`
    overflow-y: scroll;
    max-height: 150px;
`

export const ListViewWrapper = styled.div`
    .listView {
        height: 45vh;
        width: 100%;
    }
`

export const BoxWrapper = styled(Box)`
    .gap {
        gap: 10px;
    }
    .listViewBox {
        width: 100%;
        height: calc(100vh - 64px);
        overflow: hidden;
    }
    .boxInsideBox {
        width: 100%;
    }
    .tooltipDiv {
        text-align: left;
        font-size: 12;
    }
`

export const StyledTable = styled.table`
  border-collapse: collapse;
  margin-top: 10px;
  border-spacing: 10px;
  th {
      font-weight: bold;
    }
  th,
  td {
    padding: 5px;
    text-align: left;
    margin: 10px;
    max-width: 50px;
    word-wrap: break-word;
  }
`;


export const StyledBox = styled(Box)`
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px;
`;

export const StyledAccordionHeaderTitle = styled(AccordionHeaderTitle)`
  white-space: pre;
`;

export const StyledRouteValues = styled.div`
  font-size: 13px;
  font-family: 'Gotham-Rounded-Medium';
`;

export const StyledRouteDivider = styled.div`
margin-bottom: 15px;
`;

export const StyledRouteValuesEllipsis = styled.div`
  font-size: 13px;
  color: #767676;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledSpan = styled.span`
  padding-right: 10px;
`;

export const PromptStyle = styled.div`
 font-size: 14px;
`;