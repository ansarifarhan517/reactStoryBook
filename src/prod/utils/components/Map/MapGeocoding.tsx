import React from "react";
import { LeafletMap } from "ui-library"
import markerIcons from "../../map/icon.config"
import L from 'leaflet';
import { settings } from './settings'
import { StyledMapDiv,  } from './StyledMap';
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import {tSearchFieldAddressInfo} from "./interface";

const FALLBACK_CENTER = new L.LatLng(37.09024, -95.71289100000001);

interface MapGeocoding {
    getPositions? : (latLogObj: any) => any 
    googleApiKey: string
    geocoding: boolean
    searchTextData:string
    position:any
    sendLocationOutside?: (searchFieldAddressInfo: tSearchFieldAddressInfo) => void;
}

const MapGeocoding = ({ getPositions,googleApiKey,  geocoding , searchTextData , position, sendLocationOutside}: MapGeocoding) => {
    
    const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const _center = userAccessInfo?.['countryLatLng']?.split(",") || FALLBACK_CENTER
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)


    const settingLabels = { ...popupDynamicLabel }
  
    return (
        <>
            <StyledMapDiv className="map_pane live_pane live_pane_v2" style={{ flexGrow: 100, flexShrink: 100 }}>
                 <LeafletMap
                    id="leafletBaseMap"
                    markers={ {permission: false} }
                    heatmap={{ permission: false }}
                    iconsRef={markerIcons}
                    googleApiKey={googleApiKey}
                    // google tile layer
                    tiles='google_roadmap'
                    popupRef={{}}
                    width='100%'
                    settingConfig={settings(settingLabels)}
                    center={new L.LatLng(_center[0], _center[1])}
                    height='100%'
                    zoomControl
                    latLngBounds={[_center[0], _center[1]]}
                    //toggles
                    poi={false}
                    locationSearch
                    traffic={false}
                    rulerControl
                    zoom={4}
                    theme='light'
                    sendLocationOutside={(address: tSearchFieldAddressInfo) => {
                        sendLocationOutside && sendLocationOutside(address)
                    }}
                    geocoding={{
                        permission: geocoding,
                        /** If you are passing searchText, ensure to pass the position prop as well. */
                        searchText: searchTextData,
                        // searchTextInput: searchText,
                        position: position,
                        onGeocodingSave: (e: any) => {
                        window.alert(
                            'Geocodes Saved ' + e.position?.[0] + ', ' + e.position?.[1]
                        )
                        },
                        onGeocodingDragEnd: (pos: [number, number]) => {
                            getPositions && getPositions(pos)      
                        }
                }}
                /> 
            </StyledMapDiv>
        </>
    )
}




export default MapGeocoding

