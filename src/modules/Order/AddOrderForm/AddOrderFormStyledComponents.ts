import styled from "styled-components";
// import { Button } from 'ui-library';

export const AddOrderFormWrapper = styled.div`
  height: 100%;
  margin-top: 64px;
  padding: 0px 15px;
  margin-bottom: 15px;
  
  .grid-item {
    padding: 0px 10px;
  }
  #shipmentsType {
    border: 1px solid #979797 !important;
  }
`

export const SectionHeaderContainer = styled.div`
  padding-bottom: 15px;
`
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
    .leaflet-control-measure {
      display: none
    }
`;

export const StyledDAListview = styled.div`
    overflow: auto;
    min-height: 350px;
    #-selectAll-StyledCheckbox {
        display: none;
    }
    input[type=checkbox] {
       border-radius: 50%;
   }
   .editIcon{
    display: none;  
   }
`

export const IconButtonWrapper = styled.div`
  
  button {
    background-color: #5698d3;
    color: #fff;
    max-height: 40px;
    line-height: 40px;
    text-transform: capitalize;
    span {
      font-size: 14px;
    }
    i:first-child {
      font-size: 19px;
      height: 19px;
      line-height: 19px;
    }
  }
`
export const AddressFieldWrapper = styled.div`
  .menuAnimate {
    width: auto !important;
    min-width: 100%;
  }
`
export const TimeZoneFieldWrapper = styled.div`
  .menuAnimate {
    width: 110% !important;
  }
`