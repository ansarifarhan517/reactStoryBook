import React from "react";
import styled from "styled-components";
import { useTypedSelector } from "../redux/rootReducer";
import withRedux from "../redux/withRedux";

interface IMainContentContainerStylesProps {
  isMaintenanceMsgVisible: boolean;
}

const MainContentContainerStyles = styled.div<IMainContentContainerStylesProps>`
  /* Prevent content from overriding on Header bar. */
  ${({ isMaintenanceMsgVisible }) =>
    isMaintenanceMsgVisible && `padding-top: calc(35px / 2);`}
  height: auto;
  min-height: calc(
    100vh - 64px -
      ${({ isMaintenanceMsgVisible }) =>
        isMaintenanceMsgVisible ? "35px" : "0px"}
  );
  font-size: 12px;
  // overflow: scroll;

  /* Conflicting CSS with UI-Library */
  line-height: 14px;

  input[type="checkbox"] {
    margin: 0;
  }

  input[type="checkbox"][disabled] {
    opacity: 0 !important;
  }

  button[disabled] {
    opacity: 0.4;
  }
  .map_pane.live_pane.live_pane_v2 > div {
    height: 100%;
    background-color: #fff;
  }
  .map_pane.live_pane.live_pane_v2 {
    box-shadow: 0px 2px 20px -10px #000 !important;
    border: 2px solid #fff;
    div[:text="Loading..."] {
      color: #fff;
    }
  }
  label {
    font-weight: normal;
    margin-bottom: 0;
  }

  .google-places-autocomplete {
    font-family: inherit;
  }

  .leaflet-container {
    font-family: inherit;
  }

  .leaflet-control-measure .leaflet-control-measure-toggle {
    background-image: url("https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/ruler.png");
    background-size: 70% !important;
  }

  .fullscreen-icon {
    background: #fff
      url("https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/fullscreen.png")
      no-repeat 1px 1px !important;
  }
  .js-measuretasks {
    display: flex;
    justify-content: space-around;
  }

  input::-webkit-contacts-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    position: absolute;
    right: 0;
  }
  .leaflet-popup-pane {
    // margin-left: 8px;
    // margin-top: -8px;
    margin-left: 0;
    margin-top: 0;
  }

  .wrapper .logiPrimaryTheme .headerWarningMsgAdded ::-webkit-scrollbar {
    width: 9px !important;
    height: 9px !important;
  }

  .wrapper .logiPrimaryTheme .headerWarningMsgAdded ::-webkit-scrollbar-track {
    -webkit-border-radius: 9px !important;
    border-radius: 9px !important;
  }

  .rdw-dropdown-selectedtext {
    color: inherit;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    cursor: grab !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
    -webkit-border-radius: 7px;
    border-radius: 7px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 7px !important;
    border-radius: 7px !important;

    background-color: #dadce0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    background-color: #80868b !important;
  }

  .grid-customised-scroll-bar .selected a {
    color: #5698d3 !important;
    background: inherit !important;
  }
`;

const MainContentContainer = ({ children }: { children: JSX.Element }) => {
  const maintenanceMsg = useTypedSelector(
    (state) => state.globals.maintenanceMsg
  );
  return (
    <MainContentContainerStyles
      className="sc-main-content-container"
      isMaintenanceMsgVisible={!!maintenanceMsg}
    >
      {children}
    </MainContentContainerStyles>
  );
};
export default withRedux(MainContentContainer);
