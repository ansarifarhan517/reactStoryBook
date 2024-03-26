import React, { useEffect, useState } from "react";
import { ListView, useToast, Grid, ISelectedRows } from "ui-library";
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import { IRowData } from '../../Driver/DriverListView/DriverListView.models';
import { IOrderFetchDataOptions } from "../OrderListView/OrderListView.models";
import { StyledDAListview } from './StyleSubComponent';
import { IAssociateTripResult, IListViewColumn, ITrips } from "./SubCompoenent.models";
import useMetricsConversion from '../../../modules/common/ClientProperties/useMetricsConversion';


const DAListView = (_props: any) => {
    const { handleAssign } = _props
    const toast = useToast();
    const dummyResult: any = Array(8).fill(0).map((_, i) => ({ id: i + 1 }))
    const dummyData: any = Array(8).fill(0).map((_, i) => ({ label: (i + 1).toString() }))
    const [userData, setUserData] = useState<any>(dummyData)
    const [columns, setColumns] = useState<any>(dummyResult)
    const [loading, setLoading] = useState<boolean>(true)
    const {convertMetricsForDisplay} = useMetricsConversion();
    // const [fetchOption, setFetchOptions] = useState<IOrderFetchDataOptions>({})
    const [totalCount, seTotalCount] = useState<number>(0);
    /** Cell Callbacks */

    const handleRouteNameClick = (row: IRowData) => {
        console.log("Zoom In Map as Order name is clicked. ", row);
    };

    const handleTripName = (row: ITrips) => {
        console.log("Zoom In Map as Order name is clicked. ", row);
        hybridRouteTo(`tripHst/tripDetails?tripId=${row.tripId}&tripName=${row.tripName}&bc_key=orderTrips`);

    };
    const cellCallbackMapping = {
        routeName: handleRouteNameClick,
        tripName: handleTripName
    };
    useEffect(() => {
        loadDAListData({})
    }, [])

    const loadDAListData = async ({ pageSize, pageNumber, sortOptions, filterOptions }: IOrderFetchDataOptions) => {
        let tripStructure = apiMappings.order.listView.tripStructure
        tripStructure = tripStructure.replace('${modelName}', 'TRIPS')
        tripStructure = tripStructure.replace('${pageName}', 'TRIPS')
        tripStructure = tripStructure.replace('${status}', 'ORDER_TRIPS')
        let assignOrder = apiMappings.order.listView.assignOrderData
        // const _pageSize = pageSize ? `&pageSize=${pageSize}` : ''
        // const _pageNumber = pageNumber ? `&pageNumber=${pageNumber}` : ''
        // const sortBy = sortOptions && sortOptions?.sortBy ? `&sortBy=${sortOptions?.sortBy}` : ''
        // const sortOrder = sortOptions && sortOptions?.sortOrder ? `&sortBy=${sortOptions?.sortOrder}` : ''
        // const searchBy = filterOptions && filterOptions?.searchBy ? `&searchBy=${filterOptions?.searchBy}` : ''
        // const searchText = filterOptions && filterOptions?.searchText ? `&searchText=${filterOptions?.searchText}` : ''
        const params = {
            
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy|| "",
            searchText: filterOptions?.searchText || "",
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder
          }
        const fetchDataUrl = `${assignOrder}`
        console.log(fetchDataUrl, 'trp fetchDataUrl')
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
            console.log(errorMessage, 'Something went wrong')
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
    // console.log(fetchOption,'fetchOption')
    return (<Grid>
        { columns ?
            <StyledDAListview>
                <ListView
                hasSelectAllRows={false}
                    rowIdentifier="tripId"
                    style={{ height: "100%", overflow: "visible", minHeight: '350px', maxHeight: 'calc(100vh - 45px - 71px - 71px - 103px)' }}
                    columns={columns}
                    hideColumnSettings={true}
                    data={userData}
                    onFetchData={handleFetchData}
                    hasRowSelectionWithEdit={true}
                    onRowSelect={onRowSelect}
                    onSortChange={onSortChange}
                    loading={loading}
                    hideRefresh={loading}
                    isEditMode={false}
                    totalRows={totalCount}
                    isColumnLoading={loading}
                    onRowEditClick={(row) => {
                        hybridRouteTo(`updateorder/?orderid=${row.orderId}`);
                    }}
                    hasRadioSelection={true}
                /> </StyledDAListview> : <div id='blank-id' />}
    </Grid>)

}

export default DAListView