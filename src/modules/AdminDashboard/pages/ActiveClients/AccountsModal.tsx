import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    Box,
    ListView,
    IconButton,
    Modal,
    ModalHeader,
    IListViewColumn,
    IFetchDataOptions
} from "ui-library";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
// import { useTypedSelector } from "../../../utils/redux/rootReducer";

const AccountsModal = (props:any) => {
    const {showAccountsModal,setShowAccountsModal,selectedAccount} = props
    const columnsSelector = useTypedSelector(state=>state.adminDashboard.adminDashboard?.clientDetails?.accountsStructure?.columns)
    const rowsSelector = useTypedSelector(state=>state.adminDashboard.adminDashboard?.clientDetails?.accountsData)
    const totalCount = useTypedSelector(state=>state.adminDashboard.adminDashboard?.clientDetails?.accountsTotalCount)
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
    useEffect(()=>{
        dispatch({
            type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_STRUCTURE",
            payload: { status: "" },
        });
        // dispatch({
        //     type: "@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA",
        //     payload: { id: selectedAccount },
        // })
    },[])

    useEffect(() => {
        const mongoStructure = columnsSelector;
        if (mongoStructure && Object.keys(mongoStructure).length) {
          const newColumns = transformMongoListViewToColumns(
            mongoStructure,
            "noOfUsers"
          );
          setColumns(newColumns);
        }
      }, [columnsSelector]);
    //   useEffect(()=>{
    //       return ()=>{
    //         dispatch({
    //             type:"@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA_SUCCESS",
    //             payload: []
    //         })
    //       }
    //   },[])
    // const totalRows = rowsSelector.length
    const closeAccountsModal = () => {
        setShowAccountsModal(false);
    }
    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        console.log(fetchOptions);
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    
        dispatch({
          type: '@@adminDashboard/CLIENT_DETAILS/ACCOUNTS/FETCH_DATA',
          payload: {
            id: selectedAccount,
            pageNumber: pageNumber,
            pageSize: pageSize,
            searchBy: filterOptions?.searchBy,
            searchText: filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder: sortOptions?.sortOrder,
          }
        })
      }, [])

    return <Modal
        open={showAccountsModal}
        onToggle={(value: boolean) => {
            setShowAccountsModal(value)
        }}
        width="1200px"
        children={{
            header: (
                <ModalHeader
                    headerTitle="User Details"
                    handleClose={()=>setShowAccountsModal(false)}
                    imageVariant="icomoon-close"
                    width="1200px"
                    headerStyle={{ fontSize: "15px" }}
                    
                />
            ),
            content: (
                <div style={{ fontSize: "12px" }}>
                    <Box horizontalSpacing="5px" style={{height: "400px"}}>
                    { columns && <ListView
                        rowIdentifier="clientId"        
                        style={{ display: "flex", height: "400px", overflow: "auto" }}
                        columns={columns}
                        onFetchData={handleFetchData}
                        data={rowsSelector}
                        hasRowSelection={false}
                        totalRows={totalCount || 0}
                        loading={false}
                        isColumnLoading={false}
                        hasSelectAllRows={true}
                        hideColumnSettings={true}
                        
                        />}
                    </Box>
                </div>
            ),
            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeAccountsModal()}
                    >
                        Cancel
                    </IconButton>
                </Box>
            ),
        }}
    />

}

export default AccountsModal;

