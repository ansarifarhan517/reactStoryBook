import styled from 'styled-components'
import { Grid } from 'ui-library'

export const WebHookListViewStyled = styled.div`
    width:100%;
    display:inline-block;
`

export const StyledGrid = styled(Grid)`
   flex-grow: 1;
   overflow: hidden;
   height:100%;
   width: 100%;
   box-shadow: 0px 2px 20px -10px #000;

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

  .daterangepicker.opensright .ranges, .daterangepicker.opensright .calendar, .daterangepicker.openscenter .ranges, .daterangepicker.openscenter .calendar{
    float:left !important
  }

  #column-header-updatedDate .daterange--side-panel {
    display:block !important;
  }

  #WebHookListViewCard .listview-container-id > div > div:nth-child(2) {
    overflow: hidden !important;
  }
`
