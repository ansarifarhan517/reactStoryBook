
import React, {  useEffect, useState } from "react";
import { IMarkerData, IOption, ISettingConfigData, ISettingOption } from '../../../utils/components/Map/interface';
import MapDefault from '../../../utils/components/Map/MapDefault';
import {
    Grid,ISelectedRows
} from 'ui-library';
import makeMapData from './TrackerMakeMapData';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import { IRowData } from './TrackersListView.models';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';


interface IDeliveryAssociateMap {
    selectedRows: ISelectedRows
    setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
}

const TrackerMap = ({ selectedRows, setSelectedRows}: IDeliveryAssociateMap) => {
    const rowsSelector = useTypedSelector(state => state.tracker.trackers.listView.data.results);
    const googleApiKey = useTypedSelector(state => state.tracker.trackers.listView.googleApiKey);
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    // this will be diffetent for every map
    const [legendConfig, setLegendConfig] = useState({
        ONLINE: true,
        IDLE: true,
        OFFLINE: true,
    })
    useEffect(()=>{
        /** Make Map re-render when rows change */
        setSelectedRows(s => ({ ...s }))
    },[rowsSelector])


    // update custom legends
    const updateSettingConfigLegnds = (legendData: ISettingOption, settingConfigData: ISettingConfigData) => {
        console.log('legendData', legendData)
        legendData?.option.forEach((entry: IOption) => {
            if (entry.id === "offline") {
                settingConfigData.OFFLINE = !!entry.checked
            } else if (entry.id === 'idle') {
                settingConfigData.IDLE = !!entry.checked
            } else if (entry.id === 'online') {
                settingConfigData.ONLINE = !!entry.checked
            }
        })
        return settingConfigData

    }

 // markers data according to legend ,will be dynamic and sent from outside 
    const setMapMarkerData = (settingConfigData: ISettingConfigData) => {
        const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
        const filteredRowSelector: IRowData[] = Object.values(selectedRows).length !== 0 ? Object.values(selectedRows) as IRowData[] : rowsSelector 
        // send dynamic LegendValues to map
        setLegendConfig({
            ONLINE: !!settingConfigData?.['Online'],
            IDLE: !!settingConfigData?.['Idle'],
            OFFLINE: !!settingConfigData?.['Offline']
        })
       
        const newMapData: IMarkerData = makeMapData(filteredRowSelector, format, settingConfigData, dynamicLabels)
        return newMapData
    }


    return <Grid item md={8} style={{ paddingLeft: '5px' }}>
        <MapDefault
            selectedRows={selectedRows}
            type='trackers'
            settingAPIParam='haulTrackerMap'
            setMapData={(settingConfigData: ISettingConfigData) => setMapMarkerData(settingConfigData)}
            legendConfig={legendConfig}
            setSettingConfigLegnds={(legendData: ISettingOption, settingConfigData: ISettingConfigData) => updateSettingConfigLegnds(legendData, settingConfigData)}
            googleApiKey={googleApiKey}
            entityType = 'tracker'
        />
    </Grid>
}

export default (TrackerMap)
