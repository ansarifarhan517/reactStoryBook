import styled from "styled-components";
import { Box, Grid, Card } from 'ui-library';
import { StyledGrid } from '../../../utils/components/Grid/GridStyledComponents';


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
  background-color: #fff;
`

export const StyledGridContainer = styled(StyledGrid)`
  box-shadow: 0 2px 20px -10px #000;
`

export const MobileRolesListViewWrapper = styled.div`
    min-height: 80vh;
    .mobileRolesListView > div + div {
      overflow: hidden!important;
    }
`;

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

export const BreadCrumbContainer  = styled(Box)`
  margin: 10px 0;
  background-color: #fafafa;
  padding: 10px 0;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0px;
`;

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

export const MobileRolesFormContainer = styled.div`
   min-height: 75vh;
   height: auto;

  .grid-item {
    padding: 0 15px!important;
  }
  .toggle-item {
    padding: 15px!important;
  }
` 
export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`;

export const FormFieldWapper = styled.div`
  label {
    display: flex;
  } 
`;

export const FormButtonContainer = styled.div`
  position: absolute;
  bottom: 5%;
`  

export const CloneFieldsContainer = styled.div`
  width: 100%;
  .grid-item {
    padding: 0 15!important;
  }
`


export const MobileRolesUsersListViewWrapper = styled.div`
    min-height: 50vh;
`;