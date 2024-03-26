
import React, {  useEffect, useState } from "react";
import { IMarkerData, IOption, ISettingConfigData, ISettingOption } from '../../../utils/components/Map/interface';
import MapDefault from '../../../utils/components/Map/MapDefault';
import {
    Grid,ISelectedRows
} from 'ui-library';
import makeMapData from './DAMakeMapData';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
//import withRedux from '../../../utils/redux/withRedux';
import { IRowData } from './DeliveryAssociate.models';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';


interface IDeliveryAssociateMap {
    selectedRows: ISelectedRows
    setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
}

const DeliveryAssociateMap = ({ selectedRows, setSelectedRows}: IDeliveryAssociateMap) => {
    const rowsSelector = useTypedSelector(state => state.deliveryMedium.listView.data.results);
    // i am putting key through here to MapDefault becase for each list view the place of googleview will be different.
    const googleApiKey = useTypedSelector(state => state.deliveryMedium.listView.googleApiKey);
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    // this will be diffetent for every map
    const [legendConfig, setLegendConfig] = useState({
        OFFLINE: true,
        ONLINESTRONG: true,
        ONLINEWEAK: true
    })
    useEffect(()=>{
        /** Make Map re-render when rows change */
        setSelectedRows(s => ({ ...s }))
    },[rowsSelector])


    // update custom legends
    const updateSettingConfigLegnds = (legendData: ISettingOption, settingConfigData: ISettingConfigData) => {
        legendData?.option.forEach((entry: IOption) => {
            if (entry.id === "offline") {
                settingConfigData.OFFLINE = !!entry.checked
            } else if (entry.id === 'onlineWeak') {
                settingConfigData.ONLINEWEAK = !!entry.checked
            } else if (entry.id === 'onlineStrong') {
                settingConfigData.ONLINESTRONG = !!entry.checked
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
            OFFLINE: !!settingConfigData?.['OFFLINE'],
            ONLINESTRONG: !!settingConfigData?.['ONLINESTRONG'],
            ONLINEWEAK: !!settingConfigData?.['ONLINESTRONG']
        })
       
        const newMapData: IMarkerData = makeMapData(filteredRowSelector, format, settingConfigData, dynamicLabels)
        return newMapData
    }


    return <Grid item md={8} style={{ paddingLeft: '5px' }}>
        <MapDefault
            selectedRows={selectedRows}
            type='deliveryMedium'
            settingAPIParam='mileDeliveryMediumMap'
            setMapData={(settingConfigData: ISettingConfigData) => setMapMarkerData(settingConfigData)}
            legendConfig={legendConfig}
            setSettingConfigLegnds={(legendData: ISettingOption, settingConfigData: ISettingConfigData) => updateSettingConfigLegnds(legendData, settingConfigData)}
            googleApiKey={googleApiKey}
            entityType = 'deliveryMedium'
        />
    </Grid>
}

export default (DeliveryAssociateMap)
