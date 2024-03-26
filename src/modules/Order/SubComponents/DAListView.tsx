import React, { useState } from "react";
import { ListView, useToast, Grid, ISelectedRows } from "ui-library";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import { IOrderFetchDataOptions } from '../AddOrderForm/AddOrderForm.models';
import { StyledDAListview } from '../AddOrderForm/AddOrderFormStyledComponents';
import { IAssociateTripResult, IListViewColumn, ITrips } from "./SubCompoenent.models";
import useMetricsConversion from '../../../modules/common/ClientProperties/useMetricsConversion';

export interface IDAListViewProps{
    handleAssign: (row: ISelectedRows) => void
}

const DAListView = (_props: IDAListViewProps) => {
    const { handleAssign } = _props
    const toast = useToast();
    const dummyResult: any = Array(8).fill(0).map((_, i) => ({ id: i + 1 }))
    const dummyData: any = Array(8).fill(0).map((_, i) => ({ label: (i + 1).toString() }))
    const [userData, setUserData] = useState<any>(dummyData)
    const [columns, setColumns] = useState<any>(dummyResult)
    const [loading, setLoading] = useState<boolean>(true)
    const [totalCount, seTotalCount] = useState<number>(0)
    const {convertMetricsForDisplay} = useMetricsConversion();

    /** Cell Callbacks */

    const handleTripName = (row: ITrips) => {
        hybridRouteTo(`tripHst/tripDetails?tripId=${row.tripId}&tripName=${row.tripName}&bc_key=orderTrips`);

    };
    const cellCallbackMapping = {
        tripName: handleTripName
    };

    const loadDAListData = async ({ pageSize, pageNumber, sortOptions, filterOptions }: IOrderFetchDataOptions) => {
        setLoading(true)
        let tripStructure = apiMappings.order.listView.tripStructure
        tripStructure = tripStructure.replace('${modelName}', 'TRIPS')
        tripStructure = tripStructure.replace('${pageName}', 'TRIPS')
        tripStructure = tripStructure.replace('${status}', 'ORDER_TRIPS')
        let assignOrder = apiMappings.order.listView.assignOrderData
        const params = {
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy|| "",
            searchText: filterOptions?.searchText || "",
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder
          }
          const fetchDataUrl = `${assignOrder}`
        try {
            const axiosCallArray = []
            axiosCallArray.push(axios.post(`${fetchDataUrl}`,null,{params}))
            axiosCallArray.push(axios.get(`${tripStructure}`))

            await Promise.all(axiosCallArray).then((values) => {
                const tripUserData: IAssociateTripResult[] = values[0]?.data?.data?.results
                const rowSelectorData: ITrips[] = []
                tripUserData.forEach((associate: IAssociateTripResult) => {
                    associate?.trips?.forEach((trip: ITrips,key) => {
                        if(key == 0 )
                            trip["milkRun"] = trip.routeName;

                        trip.volumeCapacity = convertMetricsForDisplay(trip.volumeCapacity?parseInt(trip.volumeCapacity):0,'volume');
                        trip.weightCapacity = convertMetricsForDisplay(trip.weightCapacity?parseInt(trip.weightCapacity):0,'weight');
                        rowSelectorData.push(trip)
                    })
                })
                let newColSeq = {}
                let columnSeq = ["milkRun","tripName","tripStatus","unitsCapacity","volumeCapacity","weightCapacity","vehicleNo","deliveryMediumName"];
                columnSeq.forEach((key: string) => {
                    if(values[1]?.data?.columns?.[key]){
                        newColSeq[key] = values[1]?.data?.columns?.[key]
                    } else{
                        if(values[1]?.data?.columns?.capacity?.childNodes[key]){
                        newColSeq[key] = values[1]?.data?.columns?.capacity?.childNodes[key]
                        
                        newColSeq[key].label = "Capacity" + values[1]?.data?.columns?.capacity?.childNodes[key]?.label; 
                        }
                    }
                  })
                setUserData(rowSelectorData)
                Object.keys(values[1]?.data?.columns.capacity.childNodes).map(function(key){
                    values[1].data.columns[key] = values[1]?.data?.columns.capacity.childNodes[key]
                })
                delete values[1]?.data?.columns.capacity;
                const columnData: IListViewColumn = newColSeq
                const totalCount: number = values[0]?.data?.data?.totalCount

                seTotalCount(totalCount)
                if (Object.keys(columnData).length) {
                    const newColumns = transformMongoListViewToColumns(columnData, 'order', cellCallbackMapping)
                    setColumns(newColumns)
                }
                setLoading(false)
            });

        } catch (errorMessage) {
            toast.add(errorMessage, "", false);
        }

    }


    /** List View Callbacks */
    const handleFetchData = React.useCallback(async ({ pageSize, pageNumber, sortOptions, filterOptions }: IOrderFetchDataOptions) => {
        loadDAListData({ pageSize, pageNumber, sortOptions, filterOptions })

    }, [])
    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        handleAssign(s)
    }, []);

    const onSortChange = () => {

    }
    return (<Grid>
        { columns ?
            <StyledDAListview>
                <ListView
                    rowIdentifier="tripId"
                    style={{ height: "100%", overflow: "visible", minHeight: '350px', maxHeight: 'calc(100vh - 45px - 71px - 71px - 103px)' }}
                    columns={columns}
                    data={userData}
                    onFetchData={handleFetchData}
                    hasRowSelectionWithEdit={true}
                    onRowSelect={onRowSelect}
                    onSortChange={onSortChange}
                    loading={loading}
                    isColumnLoading={loading}
                    isEditMode={false}
                    totalRows={totalCount}
                    hideColumnSettings={true}
                    hasRadioSelection={true}
                    hideRefresh={loading}
                    hasSelectAllRows={false}
                    onRowEditClick={(row) => {
                        hybridRouteTo(`updateorder/?orderid=${row.orderId}`);
                    }}
                /> </StyledDAListview> : <div id='blank-id' />}
    </Grid>)

}

export default DAListView