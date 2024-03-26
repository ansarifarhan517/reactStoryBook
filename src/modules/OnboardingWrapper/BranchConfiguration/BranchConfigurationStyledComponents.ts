import styled from 'styled-components';
import { IconButton, Box, Card, Grid, ListView, ButtonGroup } from 'ui-library';
import { StyledGrid } from '../../../utils/components/Grid/GridStyledComponents';


export const PageTitle = styled.h3`
  font-size: 15px;
  margin: 0;
  color: rgb(0 0 0 / 76%);
`;

export const ButtonContainerWithTooltip = styled.div`
  button {
    display: inline-block;
    vertical-align: middle;
    margin: 0 5px;
    font-size: 12px;
    box-shadow: 0px 1px 9px -5px #000;
    transition: all 0.2s ease-in-out;
    padding: 0 10px;
    line-height: 30px;
    height: 30px;
    color: #5698d3;
    &:hover {
      background: #5698d3;
      color: #fff;
      border-color: #5698d3;
      box-shadow: 0px 5px 20px -8px #000;
    }
  }
`;

export const ActionButtonWrapper = styled.div`
  display: flex;
  > button {
    margin: 0px 5px;
  }
`;

export const ViewTypeButtonWrapper = styled.div`
  text-transform: uppercase;
  > i {
    margin-right: 5px;
  }
`;

export const CenteredContentWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

export const NumberCount = styled.div`
  padding: 3px 5px;
  border-radius: 2px;
  background-color: #5698d3;
  line-height: initial;
  vertical-align: middle;
  color: #fff;
  text-align: center;
`;
export const EnabledCount = styled.div`
  cursor: pointer;
`;
export const DisabledCount = styled.div`
  cursor: not-allowed;
`;

export const ListViewIconWrapper = styled.div`
  color: #5698d3;
  cursor: pointer;
`;

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const MapContainer = styled.div`
  border-radius: 2px !important;
  box-shadow: 0px 2px 20px -10px #000 !important;
  background: #fff !important;
  padding: 2px;
  overflow: hidden;
  width: 100%;
  height: 350px;
  margin-top: -15px;

  #map_longitude + button {
    display: none;
  }
`;

export const BranchViewHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 40px;
`;
export const BranchViewContentWrapper = styled.div`
  overflow: auto;
`;
export const BranchTreeViewWrapper = styled.div`
  width: 100%;
  background-color: white;
  padding: 15px 7px;
  min-height: calc(95vh - 100px);
  > div {
    margin: 10px;
  }
  i {
    margin: 0 5px;
    opacity: 0.7;
  }
  i:hover {
    opacity: 1;
    cursor: pointer;
  }
`;
export const AddMoreButton = styled.button`
  border-radius: 50%;
  color: #fff;
  background-color: #5698d3;
  height: 15px;
  width: 15px;
  i {
    color: #fff;
    font-size: 9px;
    line-height: 18px;
  }
  .remove-btn {
    color: red;
  }
`;

export const ModalContentContainer  = styled.div`
  
`

export const OperationStructureContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > div {
    width: 125%;
  }
  > div + .btn-container {
    width: 10%;
  }
  .btn-grid {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0;
  }
`;

export const BranchManagerStructureContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  > div {
    width: 140%;
    padding: 15px 0;
  }
  > div + .btn-container {
    width: 10%;
  }
  .btn-grid {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const OperationFieldContainer = styled.div`
  width: 100%;
`;


export const FormActionButton = styled(IconButton)`
  i {
    font-size: 16px !important;
    height: 16px !important;
    line-height: 16px !important;
  }
`;

export const FormActionButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  /* margin-top: 21px; */
  align-items: center;
  .deletePromotion {
    margin-left: 0;
    width: 20px;
    height: 20px;
  }
  button:not(.deletePromotion) {
    width: 20px;
    height: 20px;
    margin-left: 15px;
  }

  button.deletePromotion {
    color: #f05548;
    border-color: #f05548;
    &:hover {
      color: #f05548;
      background-color: transparent;
    }
  }
`;

export const AdvancedFieldIcon = styled.div`
    cursor: pointer;
    color: #5698d3;
    font-size: 13px;
    margin: 5px 0;
    i {
      height: 15px;
      width: 15px;
      border: 1px solid;
      border-radius: 50%;
      margin-right: 2px;
    }
    span {
      text-decoration: underline;
    }
`;
export const BranchConfigurationMapmapDivWrapper = styled.div`
    #settingBody > div:last-child  {
      display: none;
    }
`;

export const BranchConfigurationListViewWrapper = styled.div`
    min-height: 80vh;
    div.gxNXFL {
      width: auto !important;
    }
    .toolbar + div {
      overflow: hidden!important;
    }
`;
export const ShiftTimingNoteWrapper = styled.div`
  width: 80%;
  float: left;
  font-size: 13px;
`;
export const SubBranchAccordionHeader = styled.div`
  margin-top: auto !important;
  margin-bottom: auto !important;
  font-weight: bold !important;
`;

export const AccordianWrapper = styled.div`
  .accordian__container {
    margin: 10px!important
  }
`
export const SetContentPadding = styled.div`  
/* .accordian__container{
  margin-right: 15px;
} */
`
export const FormFieldWapper = styled.div`
  label {
    display: flex;
  } 
  [id$="-CheckboxWrapper"] {
    height: 100%;
  }
`;
export const SetWrapperForContent = styled.div`
  overflow-y:auto;
`;
export const RemoveScroll = styled.div`
  .variable-size-grid{
    overflow:visible !important;
  }
`;


export const BreadCrumbContainer  = styled(Box)`
  margin: 10px 0;
  background-color: #fafafa;
  padding: 10px 0;
`

export const ModalContainer = styled.div`
  > div > div {
    overflow-y: auto;
  }
`

export const ListViewCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  padding-right: 0;
  padding-bottom: 0;
`

export const AddFormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  padding-right: 15;
  padding-bottom: 15;
`

export const UploadButtonLabel = styled.div`
  max-width: 100px;
  line-height: 20px;
  text-align: center;
`

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: -55px;
`

export const MainContentContainer = styled(Box)`
  display:flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
`

export const GridContainer = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 2px 20px -10px #000;
`

export const GridItem = styled(Grid)`
  box-shadow: 0 2px 20px -10px #000;
`

export const StyledGridContainer = styled(StyledGrid)`
  box-shadow: 0 2px 20px -10px #000;
`
export const ManagerDetailsContainer = styled(Box)`
  width: 250px;
  padding-left: 15px;
  margin-bottom: 20px;
  margin-top: 10px;
`;

export const ManagerDetailsLabel = styled.div`
  font-size: 13px; 
  color: #000;
  margin-bottom: 7px;
`;

export const ManagerDetailsValue = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
`;

export const ManagerDetailsValueEmpty = styled.p`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  padding-bottom: 20px
`;

export const BranchConfigurationFormContainer = styled.div`
  .grid-item {
    padding: 0 15px!important;
  }
  .toggle-item {
    padding: 25px 15px !important;
  }
  .address-fields .grid-item {
    padding: 0!important;
    margin: 0 15px!important;
    flex-basis: 100%;
    max-width: 100%;
  }
` 

export const BranchConfigurationTreeViewContainer = styled.div`
   width: 100%;
  .accordion-content  {
    padding: 7px 0!important;
    .tree-view-pagination {
      margin: 3px 15px;
    }
    .accordian__container {
      margin: 10px 15px!important;
    }
  }
  .accordian__container {
    margin: 10px 15px!important;
    
  }
`

export const HeaderWrapper = styled.div`
  > .onboarding-branch-header {
    margin-top: 0!important;
    padding: 10px 0;
  }
`

export const OverNightShiftContent = styled.div`
    color: #777;
    font-size: 12px;
    margin-top: -15px;
`;

export const PolygonMapWrapper=  styled(Card)`
 height:360px;
 .leaflet-touch .leaflet-draw-toolbar .leaflet-draw-draw-polygon {
    background-position: -33px -1px;
}
.leaflet-touch .leaflet-draw-toolbar .leaflet-draw-edit-edit {
    background-position: -168px -1px;
}
`
export const ZoneListViewWrapper= styled(ListView)`
.variable-size-grid{
  min-height: 100%;
}
`
export const SectionWrapper= styled.div`
height: 340px;
display: flex;
flex-direction: column;
align-items: baseline;
justify-content: space-between;
 `;

export const StyledButtonGroup= styled(ButtonGroup)`
div{
 margin-left:0px;
} 
 `;

export const GroupFieldsWrapper = styled.div`
display: flex;
justify-content: space-between;
width: 100%;
align-items: center;
`;

export const StyledIconButton = styled(IconButton)`
margin:5px;
display:inline-flex;
&.btnCancel:hover {
  background-color: transparent;
  color: red;
}
.ui-library-icons {
  font-size: 10px;
  height: auto;
}
`;

export const ServiceAreaWrapper= styled(Card)`
#zoneRateProfile-input{
&:disabled{
  cursor: text!important;
  opacity:1!important;
  background:white!important;
}
} 
`;
export const RateChartModalWrapper = styled.div`
#modal-body-id{
  padding:0px;
}
.multiselect-search-input-wrappper{
  width: 84%;
}
.RateProfileMultiselect > div > div:nth-of-type(2) div {
    max-height: 100px;
    overflow: auto;
}
.menuAnimate> div{
  max-height: 140px;
}
.ServiceAreaZoneWrapper{
  padding-bottom:50px;
}
`;
