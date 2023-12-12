import { Popup } from 'react-leaflet'
import styled from 'styled-components'
// import fullscreen from '../../../assets/map/fullscreen.png'
// import ruler from '../../../assets/map/ruler.png'

interface IMap {
  showModal: boolean
  isOpenStreet: boolean
  createShape: boolean
}

export const StyledMap = styled.div<IMap>`
  height: 100%;
  .gmnoprint {
    ${({ isOpenStreet }) => (isOpenStreet ? 'display: none' : '')}
  }
  .gm-style-cc {
    ${({ isOpenStreet }) => (isOpenStreet ? 'display: none' : '')}
  }

  /* .leaflet-retina .leaflet-control-measure .leaflet-control-measure-toggle { */
  .leaflet-control-measure .leaflet-control-measure-toggle {
    background-image: url('https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/ruler.png');
    background-size: 70% !important;
  }
  .leaflet-control-measure a.start {
    display: inline !important;
    padding-right: 7px;
    font-family: Gotham-Rounded, Sans-Serif !important;
    &:hover {
      display: inline !important;
    }
  }
  .leaflet-control-measure p {
    font-family: Gotham-Rounded, Sans-Serif !important;
  }
  .leaflet-control-measure a.cancel {
    display: inline !important;
    font-family: Gotham-Rounded, Sans-Serif !important;
    padding-right: 7px;
    &:hover {
      display: inline !important;
    }
  }
  .leaflet-control-measure a.finish {
    display: inline !important;
    font-family: Gotham-Rounded, Sans-Serif !important;
    padding-right: 7px;
    &:hover {
      display: inline !important;
    }
  }

  .fullscreen-icon {
    background: #fff
      url('https://loginext-media-bucket.s3-ap-southeast-1.amazonaws.com/images/loginext-logos-icons/maps-icons/fullscreen.png')
      no-repeat 2px 2px !important;
  }
  .leaflet-right {
    margin-bottom: -20px !important;
    z-index: 1200;
  }
  .leaflet-control-zoom-fullscreen
    .leaflet-control-zoom-in
    .leaflet-control-zoom-out {
    display: block !important;
    &:hover {
      display: inline !important;
    }
  }
  .leaflet-control-scale {
    font-size: 11px;
    margin-bottom: ${({ isOpenStreet }) =>
      isOpenStreet ? '10px !important' : '0px !important'};
    padding-bottom: ${({ isOpenStreet }) =>
      isOpenStreet ? 'padding-bottom: 10px !important;' : ''};
  }
  .leaflet-container .leaflet-control-scale {
    padding-bottom: 10px !important;
  }

  .leaflet-container-discard {
    width: 100%;
    height: calc(100%) !important;
    min-width: 100vw !important;
    min-height: 627px !important;
  }
  ul.leaflet-draw-actions.leaflet-draw-actions-bottom
    li
    a[title='Finish drawing'],
  ul.leaflet-draw-actions.leaflet-draw-actions-bottom
    li
    a[title='Delete last point drawn'] {
    display: none;
  }
  ul.leaflet-draw-actions.leaflet-draw-actions-bottom
    li
    a[title='Cancel drawing'] {
    background-color: #5698d3 !important;
    border-color: #5698d3 !important;
    color: white;
    cursor: pointer;
    margin-right: 4px;
    border-radius: 2px;
    margin-top: 1px;
  }
  .leaflet-tooltip {
    background-color: #5698d3 !important;
    border-color: #5698d3 !important;
    color: white;
    cursor: pointer;
  }
  .leaflet-popup-close-button {
    font-size: 20px !important;
  }
  .leaflet-tooltip-left:before {
    content: none !important;
  }
  .gm-svpc {
    display: none;
  }

  .leaflet-bar {
    border-radius: 0px !important;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    &:hover {
      background-color: #fafafa;
    }
    h3 {
      font-size: 15px;
      font-weight: 700;
    }
  }
  .leaflet-bar a:first-child {
    border-radius: 0px !important;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    &:hover {
      background-color: #fafafa;
    }
  }
  .leaflet-bar a:last-child {
    border-radius: 0px !important;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    &:hover {
      background-color: #fafafa;
    }
  }

  .leaflet-tooltip-right:before {
    content: none !important;
  }
  .leaflet-editing-icon {
    border: 2px solid #3486fb;
    border-radius: 50%;
    opacity: 0.74;
    height: 10px !important;
    width: 10px !important;
    margin-left: -7px !important;
    margin-top: -7px !important;
  }
  .leaflet-pane > svg path.leaflet-interactive {
    pointer-events: visiblePainted;
    pointer-events: auto;
    stroke-width: 3;
    stroke-opacity: 1;
  }


  .leaflet-draw-toolbar a {
    background-image: url('https://unpkg.com/leaflet-draw@1.0.2/dist/images/spritesheet.png');
  }
  .leaflet-popup-content-wrapper {
    font-size: 12px;
    border-radius: 2px;
    background: #fff !important;
  }
  .leaflet-popup {
    transform: translate3d(-322px, -92px, 0px);
    transition: opacity 0.2s linear;
  }
  .leaflet-popup-content {
    margin: 0px;
    min-width: 350px;
    min-height: 130px;
    padding: 15px 15px 10px 15px !important;
    height: max-content;
    background: #fff !important;
  }

  .leaflet-map-pane {
    ${({ showModal }) =>
      showModal
        ? `opacity: 0.533;
    transition: opacity ease 200ms;
    background-color: #333;`
        : ''}
  }
  .leaflet-measure-resultpopup {
    h3 {
      font-size: 15px;
      font-weight: 700;
    }
    font-family: Gotham-Rounded, Sans-Serif !important;
  }

  ${({ showModal, isOpenStreet }) =>
    showModal && isOpenStreet
      ? `.leaflet-google-mutant {
  opacity: 0.533;
  transition: opacity ease 200ms;
  background-color: #333; }
  `
      : ''}
`
export const StyledPopUp = styled(Popup)<any>`
  .leaflet-popup-content-wrapper {
    font-size: 12px;
    border-radius: 2px;
    background: #fff !important;
  }
  .leaflet-popup {
    transform: translate3d(-322px, -92px, 0px);
    transition: opacity 0.2s linear;
  }
  .leaflet-popup-content {
    margin: 0px;
    min-width: 350px;
    min-height: 130px;
    padding: 15px 15px 10px 15px !important;
    height: max-content;
    background-color: #fff !important;
  }
  .title {
    margin-bottom: 8px;
  }
  .value {
    display: inline;
    font-weight: normal;
    color: #000;
  }
`

export const StyledLabel = styled.div`
  display: inline;
  margin-right: 5px;
  margin-bottom: 0px;
  font-weight: 700;
`
export const StyledText = styled.div`
  display: block;
  font-style: italic;
  color: #808080;
  transform: translateY(5px);
  line-height: 15px;
  font-weight: normal;
`

export const PolygonToast= styled.div`
position: absolute;
z-index: 999;
width: 100%;
.Toast{
  width: 250px;
  .message{
    font-size: 12px;
    font-weight: normal;
  }
}
`;
