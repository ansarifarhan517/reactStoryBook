
import React, {  useState } from "react";
import { IMarkerData, IOption, ISettingConfigData, ISettingOption } from '../../../utils/components/Map/interface';
import MapDefault from '../../../utils/components/Map/MapDefault';
import {
    Grid, ISelectedRows
} from 'ui-library';
import makeMapData from './VehicleListView.makeMapData';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import withRedux from '../../../utils/redux/withRedux';

interface IVehicleMap {
    selectedRows: ISelectedRows
}

const VehicleListViewMap = ({ selectedRows}: IVehicleMap) => {
    const rowsSelector = useTypedSelector(state => state.vehicle.listView.data.results);
    // i am putting key through here to MapDefault becase for each list view the place of googleview will be different.
    const googleApiKey = useTypedSelector(state => state.vehicle.listView.googleApiKey);
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.vehicle);
    // this will be diffetent for every map
    const [legendConfig, setLegendConfig] = useState({
        Idle: true,
        Offline: true,
        Online: true
    })


    // update custom legends
    const updateSettingConfigLegnds = (legendData: ISettingOption, settingConfigData: ISettingConfigData) => {
        legendData?.option.forEach((entry: IOption) => {
            if (entry.id === "offline") {
                settingConfigData.Offline = !!entry.checked
            } else if (entry.id === 'Idle') {
                settingConfigData.Idle = !!entry.checked
            } else if (entry.id === 'Online') {
                settingConfigData.ONLINESTRONG = !!entry.checked
            }
        })
        return settingConfigData

    }

 // markers data according to legend ,will be dynamic and sent from outside 
    const setMapMarkerData = (settingConfigData: ISettingConfigData) => {
        const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
        const filteredRowSelector = Object.values(selectedRows).length !== 0 ? Object.values(selectedRows) : rowsSelector
        // send dynamic LegendValues to map
        setLegendConfig({
            Offline: !!settingConfigData?.['Offline'],
            Idle: !!settingConfigData?.['Idle'],
            Online: !!settingConfigData?.['Online']
        })
        const newMapData: IMarkerData = makeMapData(filteredRowSelector, format, settingConfigData, dynamicLabels)
        return newMapData
    }


    return <Grid item md={8} style={{ paddingLeft: '5px' }}>
        <MapDefault
            selectedRows={selectedRows}
            type='vehicle'
            settingAPIParam='haulVehicleMap'
            setMapData={(settingConfigData: ISettingConfigData) => setMapMarkerData(settingConfigData)}
            legendConfig={legendConfig}
            setSettingConfigLegnds={(legendData: ISettingOption, settingConfigData: ISettingConfigData) => updateSettingConfigLegnds(legendData, settingConfigData)}
            googleApiKey={googleApiKey}
            isEditMode={6}
        />
    </Grid>
}

export default withRedux(VehicleListViewMap)
