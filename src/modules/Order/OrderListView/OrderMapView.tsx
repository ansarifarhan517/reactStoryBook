
import React, { useEffect, useState } from "react";
import { IMarkerData, IOption, ISettingConfigData, ISettingOption } from '../../../utils/components/Map/interface';
import MapDefault from '../../../utils/components/Map/MapDefault';
import {
    ISelectedRows
} from 'ui-library';
import makeMapData from './OrderMakeMapData';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
//import withRedux from '../../../utils/redux/withRedux';
import { IRowData } from './OrderListView.models';
// import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
// import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
// import { generateDynamicImage } from '../../common/DynamicImage/dynamicImageService';

interface IOrderMap {
    selectedRows: ISelectedRows
    setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
}

const OrderMapView = ({ selectedRows, setSelectedRows }: IOrderMap) => {
    const rowsSelector = useTypedSelector(state => state.order.listView.data.results);
    // i am putting key through here to MapDefault becase for each list view the place of googleview will be different.
    const googleApiKey = getGoogleAPIKey();
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    // const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.order);
    // this will be diffetent for every map
    const [legendConfig, setLegendConfig] = useState({
        CANCELLED: true,
        DELIVERED: true,
        INTRANSIT: true,
        NOTDELIVERED: true,
        NOTDISPATCHED: true,
        NOTPICKEDUP: false,
        PICKEDUP: true
    })
    useEffect(() => {
        /** Make Map re-render when rows change */
        setSelectedRows(s => ({ ...s }))
    }, [rowsSelector])


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
        console.log(settingConfigData);
        const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
        const filteredRowSelector: IRowData[] = Object.values(selectedRows).length !== 0 ? Object.values(selectedRows) as IRowData[] : rowsSelector
        // send dynamic LegendValues to map
        setLegendConfig({
            CANCELLED: true,
            DELIVERED: true,
            INTRANSIT: true,
            NOTDELIVERED: true,
            NOTDISPATCHED: true,
            NOTPICKEDUP: false,
            PICKEDUP: true

        })

        const newMapData: IMarkerData = makeMapData(filteredRowSelector, format);
        return newMapData
    }


    return <>
        <MapDefault
            selectedRows={selectedRows}
            type='order'
            settingAPIParam='mileOrderMap'
            setMapData={(settingConfigData: ISettingConfigData) => setMapMarkerData(settingConfigData)}
            legendConfig={legendConfig}
            setSettingConfigLegnds={(legendData: ISettingOption, settingConfigData: ISettingConfigData) => updateSettingConfigLegnds(legendData, settingConfigData)}
            googleApiKey={googleApiKey}
            entityType='orders'
            isEditMode={6}
        />
    </>

}

export default (OrderMapView)
