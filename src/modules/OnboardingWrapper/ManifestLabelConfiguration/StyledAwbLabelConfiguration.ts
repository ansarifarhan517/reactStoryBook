import styled from "styled-components";
import { Grid, IconButton } from 'ui-library'

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

export const ListGridWrapper = styled(Grid)`
    flex-grow: 1;
    overflow: hidden;
    width: 100%;
    box-shadow: 0 2px 20px -10px #000;
    margin-top: 10px;
`

export const AddButtonWrapper = styled.div`
    position: absolute;
    top: 15px;
    right: 30px;

    .addFromButton {
        height: 30px;
        padding: 7px 10px 8px;
        box-shadow: 0 2px 11px -5px #000000;
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
    margin: 0 auto
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