import React from 'react'
import { LeafletMap } from 'ui-library'
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels'
import markerIcons from '../../map/icon.config'
// import { settings } from './settings'
interface IRouteMap {
    googleApiKey: string
    tripData: ITripData
}


interface ITripData {
    permission: boolean,
    config: {
        mode: string,
        animation: string,
        color: string,
        weight: number,
        opacity: number,
        dashArray: Array<string>,
        pulseColor: string,
        delay: number,
        smoothFactor: number,
        backToStart: boolean,
        popupRef: string
    },
    data: {
        title: string,
        id: string,
        tripNo: string,
        startTime: string,
        delayedBy: string,
        endTime: string
    },
    waypoints: Array<{
        id: number,
        position: Array<number>,
        title: string,
        type: string,
        iconRef: string,
        popupRef: string
    }>
}
export const RouteMap = ({ googleApiKey, tripData }: IRouteMap) => {

    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)


    const settingLabels = { ...popupDynamicLabel }
    console.log('RouteMap.tsx', settingLabels);
    return (
        <LeafletMap
            id='leafletBaseMap'
            center={[51.0, 19.0]}
            zoom={4}
            zoomControl
            locationSearch
            googleApiKey={googleApiKey}
            height='100%'
            width='100%'
            tiles='google_roadmap'
            trips={tripData}
            iconsRef={markerIcons}
            popupRef={{}}
        // settingConfig={settings(settingLabels)}
        />
        // id='leafletBaseMap'
        // classes='baseMap customBaseMap'
        // center={[51.0, 19.0]}
        // zoom={4}
        // zoomControl
        // locationSearch
        // googleApiKey={GOOGLE_API_KEY}
        // height='300px'
        // width='800px'
        // tiles='google_roadmap'
        // trips={object('Trip Configuration', sampleTripData)}
        // iconsRef={markerIcons}
        // popupRef={infowindowStructure}
        // onSettingChange={action('setting changed')}

    )
}
