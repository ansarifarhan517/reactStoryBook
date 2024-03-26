import React, { Dispatch, useEffect, useState } from "react";
import {ListView,IListViewColumn,Box,Grid,IFetchDataOptions,IFilterOptions,useToast} from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import WhiteCard from "../../../../utils/layouts/WhiteCard";
import { useDispatch } from "react-redux";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import { TableHeader } from "../../AdminDashboard.styled.component";
import {ColumnInstance} from 'react-table';
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";



// import { IRowData } from "../../../Driver/DriverListView/DriverListView.models";
const TableContainer =(props: any)=>{
  const toast = useToast();
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
    const columnsSelector = useTypedSelector(state=>state.adminDashboard.adminDashboard.noUsage.structure.columns);
    const rowsSelector = useTypedSelector(state=>state.adminDashboard.adminDashboard.noUsage.tableData);
    const totalRows = useTypedSelector(state=>state.adminDashboard.adminDashboard.noUsage.totalCount);
    // const loading = useTypedSelector(state=>state.adminDashboard.adminDashboard.noUsage.loading);
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const structure = useTypedSelector((state) => state.adminDashboard.adminDashboard.noUsage.structure);
    // const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})

    // console.log(columns);
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions }: IFetchDataOptions) => {
      
        // setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })

        dispatch({
            type: '@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA',
            payload: {
              pageNumber: pageNumber,
              pageSize: pageSize,
              searchBy: filterOptions?.searchBy,
              searchText: filterOptions?.searchText,
              sortBy: sortOptions?.sortBy,
              sortOrder: sortOptions?.sortOrder
            }
          })
        //   dispatch({
        //     type: "@@adminDashboard/CLIENT_ACTIVITY/IS_LOADING",
        //     payload: true
        //   })
    },[])
    const handleFilterChange = (combinedFilters: IFilterOptions) => {

        
    console.log(combinedFilters);    
       
    }
    const onSortChange =()=>{
        // handleFetchData(fetchOptions);
        console.log("On Sort Change");
    }
    const onRowSelect= (e:any)=>{
        console.log(e);
    }

    const filnalTableData = React.useMemo(()=>{
      let data = []
      if(rowsSelector && rowsSelector.length){
        for(let i=0; i<rowsSelector.length;i++){
          for(let j=0;j<rowsSelector[i].userLevelData.length; j++){
            if(j==0){
              rowsSelector[i].userLevelData[j].clientName = rowsSelector[i].clientName
            }
            
            rowsSelector[i].userLevelData[j].clientId = rowsSelector[i].clientId
            rowsSelector[i].userLevelData[j].isActiveFl = rowsSelector[i].isActiveFl
            rowsSelector[i].userLevelData[j].modelType = rowsSelector[i].modelType
            data.push(rowsSelector[i].userLevelData[j]);
          }
        }
        
      }
      return data;

    },[rowsSelector])
      const cellCallbackMapping = {
        userName:props.impersonateUser
      };

    
      useEffect(() => {
        const mongoStructure = columnsSelector;
        if (mongoStructure && Object.keys(mongoStructure).length) {
          const newColumns = transformMongoListViewToColumns(
            mongoStructure,
            "adminDashboard",
            cellCallbackMapping
          );
          setColumns(newColumns);
        }
      }, [columnsSelector]);

          /** Cell Callbacks */
    const onSaveColumnPreferences = React.useCallback(
      async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        const columns = { ...columnsSelector };
        Object.keys(columns).forEach((columnKey) => {
          columns[columnKey].permission = !!visibleColumns[columnKey];
        });
        const payload = {
          ...structure,
          columns,
        };
        try {
          const {
            data: { message },
          } = await axios.put(apiMappings.adminDashboard.clintActivity.structure, payload);
          message && toast.add(message, "check-round", false);
        } catch (error) {
          console.log(error, error?.response);
        }
      },
      [columnsSelector]
    );
    return (<>
    
        {Object.keys(columnsSelector).length &&    
        <Box display="flex" flexDirection='column' style={{ width: '100%', height: '800px' }} px='15px' pb='15px'>
            <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000",position:"relative" }}>
            <Grid className='grid-customised-scroll-bar' item md={ 12} style={{ display: "flex", overflow: "hidden" }}>
            <WhiteCard>
            <TableHeader><h4>Client Activity</h4></TableHeader>
             <ListView
        rowIdentifier="clientId"
        
        style={{ display: "flex", height: "850px", overflow: "auto" }}
        columns={columns}
        data={filnalTableData}
        onFetchData={handleFetchData}
        onFilterChange={handleFilterChange}
        hasRowSelection={false}
        onRowSelect={onRowSelect}
        onSortChange={()=>onSortChange()}
        onSaveColumnPreferences={onSaveColumnPreferences}
        totalRows={totalRows || 0}
        loading={false}
        isColumnLoading={false}
        
        hasSelectAllRows={true}

        ></ListView>
        </WhiteCard>
         </Grid>
            </Grid>



        </Box>}
    
    </>)
}

export default TableContainer;