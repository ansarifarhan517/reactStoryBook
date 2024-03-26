import styled from "styled-components";
import { Box, Grid, Card, Button } from 'ui-library';
import { StyledGrid } from '../../../utils/components/Grid/GridStyledComponents';


export const MainContentContainer = styled(Box)`
  display:flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 15px;
  user-select: none;
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

export const MobileTemplateListViewWrapper = styled.div`
    min-height: 80vh;
    .mobileTemplateListView > div + div {
      overflow: hidden!important;
    }
`;

export const MobileTemplateRolesListViewWrapper = styled.div`
    min-height: 50vh;
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

export const BreadCrumbContainer = styled(Box)`
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

export const MobileTemplateFormContainer = styled.div`
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
  margin-bottom: 15px;
`

export const CloneFieldsContainer = styled.div`
  width: 100%;
  .grid-item {
    padding: 0 15!important;
  }
`

export const MobileTemplateAccordionContainer = styled.div`
  .accordion__header__container[color="inherit"] {
    background-color: #dde2e6;
     .accordion__header {
        .accordion-header-title {
            color: #444;
            padding-bottom: 3px;
            font-size: 14px;
            -webkit-letter-spacing: 0.3px;
            -moz-letter-spacing: 0.3px;
            -ms-letter-spacing: 0.3px;
            font-family: "Gotham-Rounded-Medium";
            letter-spacing: 0.3px;
            line-height: 17px;
            font-weight: 500;
        }
        .accordion-header-sub-title {
            color: #444;
            opacity: 0.7;
            font-size: 13px;
            margin-top: 2px;
            letter-spacing: 0.3px;
            line-height: 17px;
            padding-right: 30px;
        }
    }
  }
  .access-toggle:not(:last-of-type) {
    border-bottom: 1px solid #e1e2e4;
  }

  .access-toggle {
    div[id*="-label"] {
      color: #000;
      font-size: 14px;
      font-family: "Gotham-Rounded-Medium";
      margin-top: -3px;
    }
     .accordion-sub_title {
        color: #000;
        opacity: 0.7;
        font-size: 13px;
        margin: 5px 0;
        letter-spacing: 0.3px;
        line-height: 17px;
        padding-right: 30px;
     }
  }
  .accordion-toggle-input {
    > div > label > div > label {
        margin: 0px 5px 4px 5px;
    }
  }
`;
export const MobileTemplateAccordionHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between; 
  > .active-accordion {
    span {
      background-color: #9fc3e2!important;
      ::before {
          background-color: #ffffff!important;
      }
    }
  }
`

export const MobileTemplateAccordionTitle = styled.div`
  /* display: flex;
  flex-direction: row; */
`

export const MobileTemplateAccessDescription = styled.div`
  display: flex;
  width: 100%;
  padding-left: 50px;
  font-size: 13px;
  line-height: 14px;
  color: rgba(0, 0, 0, 0.7);
`

export const MobileTemplateStartTimeAccessDescription = styled.div`
display: flex;
width: 100%;
font-size: 13px;
line-height: 14px;
color: rgba(0, 0, 0, 0.7);
`

export const MobileTemplateAccesses = styled(Box)`
  display: flex; 
  flex-direction: column;
  width: 100%;
  padding: 10px 10px 10px 0px;
  &.end-row {
    flex-direction: row;
    > .access-container {
        width: 100%;    
      }
    .access-button-container {
        width: auto;
      }
  }
`

export const MobileTemplateChildAccess = styled(Box)`
  display: flex; 
  flex-direction: column;
  width: 100%;
  padding: 10px 10px 10px 50px;
`

export const ConfigureButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`
export const FieldTileContainer = styled.div`
  display: block;
  padding: 10px 20px 10px 10px;
`;
export const FieldTileWrapper = styled.div`
display: inline-block;
`;

export const TextOverflowEllipsis = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.Empty {
    opacity: .7;
  }
`
export const FieldTile = styled.div`
    display: flex;
    justify-content: space-between;
    height: 35px;
    margin: 0px 15px 10px 0;
    padding: 10px 10px 10px 8px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12);
    border-style: solid;
    border-width: 0.5px;
    border-image-source: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0.02) 95%, rgba(0, 0, 0, 0.04));
    border-image-slice: 1;
    background-color: #ffffff;
    color: #5698d3;
    font-size: 13px;
    z-index: 1;
    cursor: default;

    &.right {
      margin-left: 7.5px;
      margin-right: 0px;
    }

    &.left {
      margin-right: 7.5px;
    }

    .field-tile-icon-wrapper {
        display: none;
        transition: all .3 linear;
        -webkit-transition: all .3 linear;
        -moz-transition: all .3 linear;
        -o-transition: all .3 linear;
      }
    :hover {
      .field-tile-icon-wrapper {
        display: block;
      }
    }
    &.active {
      color: #fff;
      background-color: #5698d3;
      .field-tile-icon-wrapper {
        display: block;
      }
    }
`;

export const FieldTileIconWrapper = styled.div`
  cursor: pointer;
  z-index: 10;
`;

export const FieldContainer = styled.div`
  padding: 0 15px 1px;
  > div  {
    margin: 25px 0;
  }
`;
export const FieldSectionTitle = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e2e4;
  color: #42425c;
  font-size: 14px;
  white-space: nowrap;
  font-weight: 500;
  span > i {
    vertical-align: unset;
  }
`;

export const AddressFieldsWrapper = styled(Card)`
  max-height: 40vh;
  overflow-y: auto;
  .search-bar {
    .grid-item {
      min-height: 40px;
    }
  }
`

export const PreviewContainer = styled(Card)`
  padding: 2px 0;
`;

export const PreviewTitle = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e1e2e4;
  color: #42425c;
  font-size: 14px;
  font-weight: 500;
;
`
export const PreviewMobile = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  img {
    width: 320px
  }
`

export const PreviewCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 213px;
  margin-top: 110px;
`
export const PreviewCard = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    &.odd {
      border-left: 2px solid #208aac;
      border-bottom: 1px solid #e1e2e4;
    }
    &.even {
      border-left: 2px solid #ed8b33;
      border-bottom: 1px solid #e1e2e4;
    }
`;

export const PreviewColumn = styled.div`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: top;
  padding: 1px 0;
    &.priority {
      border-radius: 2px;
      padding: 1px;
    }
    &.addressFields div{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &.left {
      width: 70%;
      text-align: left;
      white-space: nowrap;

    }
    &.right {
      width: 30%;
      text-align: right;
      white-space: nowrap;
    }

`

export const Label = styled.span`
  font-family: "Gotham-Rounded-Medium";
  vertical-align: top;
  color: #000;
  font-size: 14px;
`

export const SearchFieldWrapper = styled.div`
  i {
    position: absolute;
    top: 20px;
    font-size: 12px !important;
    color: #555;
    z-index: 1;
  }

  input {
    padding-left: 15px;
    border-bottom: 1px solid #aaa
  }
`

export const NavigationIconWrapper = styled.div`
  position: absolute;
  margin-top: 1px;  
  right: 5px; 
  top: 10px;
`;

export const TextWrapper = styled.div`
  color: #4c4c4c;
  font-size: 14px;
`;

export const AccessContainer = styled.div`
  &.setting-toggle div[id*="-label"] {
    opacity: 1;
  }

  &.setting-toggle > div > div > label > div > label > span {
    cursor: not-allowed;
  }
`

export const NewOrderButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
`
export const ButtonFilled = styled(Button)`
  background-image: linear-gradient(
    90deg,
    #aa3e5e,
    #ad4269,
    #b04774,
    #b24c7f,
    #b3528a
  );
  font-size: 10px;
  line-height: 1;
  color: #fff;
  outline: none;
  border: none;
  border-radius: 2px;
  padding: 5px 28px;
  cursor: not-allowed;
  pointer-events: none;
`

export const ButtonBordered = styled(Button)`
  padding: 5px 28px;
  border-radius: 2px;
  border: 1.5px solid #c0525b;
  background-color: #fff;
  color: #aa3e5e;
  font-size: 10px;
  line-height: 1;
  cursor: not-allowed;
  pointer-events: none;
`

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding-top: 5px;

  &.completed img{
    width: 12px;
  }
  &.current img {
    width: 28px;
  }
`

export const TripFormCont = styled.div`
  .labelUnderlineWrapper .labelUnderline {
    background-color: #eee;
    width: 100%;
    padding: 0.2em 0px;
  }
 .labelLineWrapper .labelLine {
    margin-left: -32px;
    padding: 0;
    border: .5px solid #eee;
  }
`