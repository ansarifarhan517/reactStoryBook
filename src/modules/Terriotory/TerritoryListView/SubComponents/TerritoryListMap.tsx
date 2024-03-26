import React, { useEffect, useState } from 'react'
import { ISelectedRows, Grid, useToast } from 'ui-library'
import PolygonMapComponent from '../../../../utils/components/Map/PolygonMap';
import { useTypedSelector } from '../../../../utils/redux/rootReducer';
import {settings} from '../../../../utils/components/Map/PolygonSettings';
import { IRowData } from '../TerritoryList.models';
import EditRouteConfirmationComponent from './Popups/EditRouteConfirmations';
import axios from '../../../../utils/axios';
import apiMappings from '../../../../utils/apiMapping';
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping';

interface ITerritoryeMap {
    selectedRows: ISelectedRows
    setSelectedRows: React.Dispatch<React.SetStateAction<ISelectedRows>>
    handleFetchData: Function
}

const TerritoryListMap = ({selectedRows, setSelectedRows, handleFetchData} : ITerritoryeMap) => {

    const toast = useToast()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.geofence)
    const rowsSelector = useTypedSelector(state => state.territory.listView.data.results)
    const breadcrumbState = useTypedSelector(state => state.territory.listView.breadcrumbState);
    const filteredRowSelector: IRowData[] = Object.values(selectedRows).length !== 0 ? Object.values(selectedRows) as IRowData[] : rowsSelector 

    const [showEditConfirmation, setShowEditConfirmation] = useState<boolean>(false)
    const [selectedGeofence, setSelectedGeofence] = useState<number>(0)

    useEffect(()=>{
        /** Make Map re-render when rows change */
        setSelectedRows(s => ({ ...s }))
    },[rowsSelector])

    const editTerritory = (data: IRowData) => {
        setSelectedGeofence(data.geofenceId)
        setShowEditConfirmation(true)
    }

    const deleteTerritory = async (data: IRowData) => {
        try {
            const { data: { message, status }} = await axios.delete(`${apiMappings.geofenceMaster.listView.deleteGeofence}?geofenceProfileId=${breadcrumbState}`, {
                data: [data.geofenceId],
            });  
            if (status === 200) {
                toast.add(message, 'check-round', false);
                handleFetchData();
            } 
        } catch {
            toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
        }
    }


    return (
        <>
            <Grid item md={8} style={{ paddingLeft: '10px' }}>
                <PolygonMapComponent
                    type="territory"
                    settingAPIParam="geofenceMasterList"
                    mapSetting={settings}
                    polyGeoFenceData={filteredRowSelector}
                    rowsSelector={rowsSelector}
                    editTerritory={editTerritory}
                    deleteTerritory={deleteTerritory}
                />
            </Grid>

            {showEditConfirmation && (
                <EditRouteConfirmationComponent
                    showEditConfirmation={showEditConfirmation}
                    setShowEditConfirmation={(value: boolean) => setShowEditConfirmation(value)}
                    geofenceId = {selectedGeofence}
                />
            )}

        </>
    )
}

export default (TerritoryListMap)