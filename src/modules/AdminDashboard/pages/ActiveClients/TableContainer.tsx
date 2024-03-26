import React, { Dispatch, useEffect, useState } from "react";
import { ListView, IListViewColumn, Box, Grid, IFetchDataOptions, IFilterOptions, ISelectedRows, useToast, IconButton, Tooltip } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import WhiteCard from "../../../../utils/layouts/WhiteCard";
import { FilterAppliedTag, FilterAppliedTagButtonWrapper, FilterAppliedTagLabel, TableHeader } from "../../AdminDashboard.styled.component";
import { useDispatch } from "react-redux";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import AccountsModal from "./AccountsModal";
import CreateActionBarButton from "../../../common/ActionBar/CreateActionBarButton";
import { hybridRouteTo } from "../../../../utils/hybridRouting";
import AdminSubComponentContainer from "../../SubComponent/AdminSubComponentContainer";
import { ColumnInstance } from 'react-table';
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";


// import { IRowData } from "../../../Driver/DriverListView/DriverListView.models";
const TableContainer = () => {
  const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
  const toast = useToast();
  const columnsSelector = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.structure.columns);
  const rowsSelector = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.tableData);
  const totalRows = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.totalCount);
  const actionBarButtons = useTypedSelector((state) => state.adminDashboard.adminDashboard.clientDetails.structure.buttons);
  const editDetails = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.editDetails)
  const loading = useTypedSelector(state => state.adminDashboard.adminDashboard.clientDetails.loading);
  const structure = useTypedSelector((state) => state.adminDashboard.adminDashboard.clientDetails.structure);
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const clientIds = useTypedSelector(state => state.adminDashboard.adminDashboard.clientIds);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [showAddUatAcccountPop, setShowAddUatAccountPopup] = useState<boolean>(false);
  const [editUatAccount, setEditUatAccount] = useState<boolean>(false);
  const [showOffBoardModal, setShowOffboardModal] = useState<boolean>(false);
  const [sendActivationLink, setSendActivationLink] = useState<boolean>(false);
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

  // console.log(columns);
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    console.log(fetchOptions);
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })

    dispatch({
      type: '@@adminDashboard/CLIENT_DETAILS/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        clientIds: clientIds
      }
    })
    dispatch({
      type: "@@adminDashboard/CLIENT_DETAILS/IS_LOADING",
      payload: true
    })
  }, [clientIds])

  const fetchDataSilenty = () => {
    const { pageSize, pageNumber, sortOptions, filterOptions: filter } = fetchOptions
    let payload: any = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchBy: filter?.searchBy,
      searchText: filter?.searchText,
      sortBy: sortOptions?.sortBy,
      sortOrder: sortOptions?.sortOrder,
      clientIds: clientIds
    }
    fetchOptions.apis?.resetSelection()
    setSelectedRows({})
    dispatch({
      type: '@@adminDashboard/CLIENT_DETAILS/FETCH_DATA',
      payload
    });
  }
  const handleFilterChange = (combinedFilters: IFilterOptions) => {


    console.log(combinedFilters);

  }
  const onSortChange = () => {
    //handleFetchData(fetchOptions);
    // console.log("On Sort Change");
  }
  const onRowSelect = (e: any) => {
    setSelectedRows(e);
  }
  const handleAccounsClick = (row: any) => {
    setSelectedAccount(row.clientId);
    setShowAccountsModal(true);
  }

  const cellCallbackMapping = {
    noOfUsers: handleAccounsClick,

  };

  const handleSaveRows = async () => {
    
    if(!editDetails){
      toast.add("Please make some changes", "warning", false);
      return;
    }
    setDisableSaveButton(true);
    const payload = Object.keys(editDetails).map(function (key) {
      let clientId = key;
      const data = Object.keys(editDetails[key]).map((key) => {
        let temp = {}
        temp[key] = editDetails[clientId][key].value;
        temp["clientId"] = clientId;
        return temp;
      })
      return data;
    })
    const { data } = await axios.put('/ClientApp/client/update/list', payload[0])
    if (data) {
      setEditMode(false);
      handleFetchData(fetchOptions);
      setDisableSaveButton(false);
      toast.add("Updated Successfully", "success", false);
    } else {
      setDisableSaveButton(false);
      toast.add("Something went wrong", "warning", false);
    }
  }
  const handleCancelRows = () => {
    console.log("Cancel Save");
    setEditMode(false);
  }
  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch (id) {
      case "update":
        setEditMode(true);
        break;
      case "default":
        break;
    }
    console.log("handleActionBarButtonClick");
  }, [selectedRows]);
  // handleActionBarButtonClick

  const handleAddUat = (rows: any) => {
    fetchOptions.apis?.resetSelection();
    Object.keys(rows)?.map((clientId) => { uatFormUpdates(rows[clientId], false) })
  }

  const handleOffBoarding = (rows: any) => {
    Object.keys(rows)?.map((clientId) => {
      setSelectedAccount(rows[clientId])
      setShowOffboardModal(true)
    })
  }

  const uatFormUpdates = (row: any, uatEditMode: boolean) => {
    setEditMode(false)
    setEditUatAccount(uatEditMode)
    setShowAddUatAccountPopup(true)
    setSelectedAccount(row)
  }

  const handleSendActivation = (rows: any) => {
    Object.keys(rows)?.map((clientId) => {
      setSelectedAccount(rows[clientId])
      setSendActivationLink(true)
    })
  }

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
  useEffect(() => {
    if (clientIds.length) {
      handleFetchData(fetchOptions);
    }
  }, [clientIds])

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
        } = await axios.put(apiMappings.adminDashboard.clientDetails.structure, payload);
        message && toast.add(message, "check-round", false);
      } catch (error: any) {
        console.log(error, error?.response);
      }
    },
    [columnsSelector]
  );

  return (<>

    {Object.keys(columnsSelector).length &&
      <Box id="clientDetailsTable" display="flex" flexDirection='column' style={{ width: '100%', height: '880px' }} px='15px' pb='15px'>
        <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000", position: "relative" }}>
          <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: "flex", overflow: "hidden" }}>
          <WhiteCard style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0, height: '850px' }}>
              <div>
                <TableHeader><h4>Client Details</h4></TableHeader>
                {clientIds.length ?
                  <FilterAppliedTag>
                    <FilterAppliedTagLabel >Filter Applied</FilterAppliedTagLabel>
                    <FilterAppliedTagButtonWrapper>
                      <IconButton
                        onClick={() => dispatch({
                          type: "@@adminDashboard/CLIENT_DETAILS/SET_CLIENT_IDS",
                          payload: []
                        })}
                        onlyIcon
                        iconVariant='close'
                        iconSize={10}
                        color='error.main'
                      />
                    </FilterAppliedTagButtonWrapper>
                  </FilterAppliedTag> : ""}
              </div>
              <ListView
                rowIdentifier="clientId"
                hasRowSelectionWithEdit={actionBarButtons.edit}
                style={{ display: "flex", height: "100%" }}
                columns={columns}
                data={rowsSelector}
                onFetchData={handleFetchData}
                isEditMode={isEditMode}
                onFilterChange={handleFilterChange}
                hasRowSelection={!actionBarButtons.edit}
                onRowSelect={onRowSelect}
                onSortChange={onSortChange}
                onSaveColumnPreferences={onSaveColumnPreferences}
                totalRows={totalRows || 0}
                loading={loading}
                hideRefresh={loading}
                isColumnLoading={loading}
                hasSelectAllRows={true}
                onRowEditClick={(row) => {
                  if (!row.mainRefClientId && row.zohoSubscriptionId){
                    hybridRouteTo(`client/updateClient/?clientId=${row.clientId}&zohoSubscriptionId=${row.zohoSubscriptionId}&planType=${row.planType}`)
                  }
                  /**
                   * If clientId exists and zohoSubscriptionId doesn't exist for a client in the list that means it is a Child client who is sharing subscription
                   * Thus, change the window.location to the below URL which doesn't contain zohoSubID;
                   * In Add Saas form there is a check on the same, if the zohoSubcriptionId is not there as a query Param then this is a child with sharedSub 
                   * and then we fetch data for update form with zohosubscriptionId sent as empty string to backend;
                   */
                  else if (!row.mainRefClientId && !row.zohoSubscriptionId) {
                    hybridRouteTo(`client/updateClient/?clientId=${row.clientId}&planType=${row.planType}`)
                  }else {
                    uatFormUpdates(row, true)
                  }

                }}
              >
                {{
                  IconBar:
                    <Box>
                      {""}
                    </Box>,
                  ActionBar:

                    <Box style={{ marginLeft: "2px", marginTop: "2px" }} display="flex" horizontalSpacing="5px">
                      {isEditMode ? (
                        <>
                          <span style={{ display: "inline-block" }}>
                            <IconButton
                              intent="table"
                              id="listView-actionBar-save"
                              iconVariant="icomoon-save"
                              onClick={handleSaveRows}
                              disabled={!Object.keys(selectedRows).length || disableSaveButton}
                            >Save</IconButton>
                          </span>
                          <span style={{ display: "inline-block" }}>
                            <IconButton
                              intent="table"
                              id="listView-actionBar-cancel"
                              iconVariant="icomoon-close"
                              onClick={handleCancelRows}
                              disabled={!Object.keys(selectedRows).length || disableSaveButton}
                            >
                              Cancel
                                </IconButton>
                          </span>
                        </>
                      ) : (
                        //  <OrderListActionButton selectedRows={selectedRows} handleActionBarButtonClick={handleActionBarButtonClick} handleAssignNow={handleAssignNow} handleOverrideStatusOptions={handleOverrideStatusOptions} handleMoreOptions={handleMoreOptions} handleNotifyCustomer={handleNotifyCustomer}></OrderListActionButton>
                        selectedRows && Object.keys(actionBarButtons)?.map(
                          (buttonKey, index) => {
                            switch (buttonKey) {
                              case "uatAccount":
                                {

                                  return <Tooltip
                                    messagePlacement="start"
                                    hover
                                    message="Click here to add a UAT account for an existing production account."
                                    key={buttonKey}
                                  >
                                    <IconButton
                                      key={buttonKey}
                                      // if no selection or in selected rows intransit there then only disable
                                      disabled={Object.keys(selectedRows)?.length !== 1  || !!Object.values(selectedRows).find((row: any)=> row.mainRefClientId || row.status === 'Inactive')}
                                      iconVariant="table"
                                      intent='table'
                                      id={`listView-actionBar-${buttonKey}`}
                                      onClick={() => handleAddUat(selectedRows)}
                                    >
                                      {actionBarButtons[buttonKey].label}
                                    </IconButton>
                                  </Tooltip>
                                }


                              case "offboard": {
                                return <CreateActionBarButton
                                  buttonKey={buttonKey}
                                  buttonIndex={index}
                                  actionBarButton={actionBarButtons[buttonKey]}
                                  buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                  selectedRows={selectedRows}
                                  handleActionBarButtonClick={() => handleOffBoarding(selectedRows)}
                                  isButtonDisabled={Object.keys(selectedRows)?.length !== 1 || !!Object.values(selectedRows).find((row: any) => row.mainRefClientId || row.status === 'Inactive')} />
                              }
                              case "sendActivationLink": {
                                return <CreateActionBarButton
                                  buttonKey={buttonKey}
                                  buttonIndex={index}
                                  actionBarButton={actionBarButtons[buttonKey]}
                                  buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                  selectedRows={selectedRows}
                                  handleActionBarButtonClick={() => handleSendActivation(selectedRows)}
                                  isButtonDisabled={Object.keys(selectedRows)?.length !== 1 || !!Object.values(selectedRows).find((row: any) => row.mainRefClientId || !row.zohoSubscriptionId || row.status === 'Inactive')} />
                              }
                              case "update": {
                                return <CreateActionBarButton
                                  buttonKey={buttonKey}
                                  buttonIndex={index}
                                  actionBarButton={actionBarButtons[buttonKey]}
                                  buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                  selectedRows={selectedRows}
                                  handleActionBarButtonClick={() => setEditMode(true)}
                                  isButtonDisabled={Object.keys(selectedRows)?.length !== 1} />
                              }
                              case "updateModelType": {
                                return <CreateActionBarButton
                                buttonKey={buttonKey}
                                buttonIndex={index}
                                actionBarButton={actionBarButtons[buttonKey]}
                                buttonToolTipTextList={"Click here to update Model Type of the client"}
                                selectedRows={selectedRows}
                                handleActionBarButtonClick={()=> hybridRouteTo(`changeModelTypeForm?clientId=${Object.values(selectedRows).map(row => Number(row.clientId))}&modelType=${Object.values(selectedRows).map(row => row.modelType)}&clientName=${Object.values(selectedRows).map(row => row.clientName)}`)}
                                isButtonDisabled={Object.keys(selectedRows)?.length !== 1 || !!Object.values(selectedRows).find((row: any) => row.modelType === 'LH')} />
                              }
                              case "edit":
                                {
                                  return null
                                }
                              default: {
                                return <CreateActionBarButton
                                  buttonKey={buttonKey}
                                  buttonIndex={index}
                                  actionBarButton={actionBarButtons[buttonKey]}
                                  buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                  selectedRows={selectedRows}
                                  handleActionBarButtonClick={handleActionBarButtonClick}
                                  isButtonDisabled={!Object.keys(selectedRows)?.length} />
                              }
                            }
                          })
                      )}
                    </Box>


                }}
              </ListView>
            </WhiteCard>
          </Grid>
        </Grid>

        {showAccountsModal && <AccountsModal
          showAccountsModal={showAccountsModal}
          setShowAccountsModal={(value: boolean) => setShowAccountsModal(value)}
          selectedAccount={selectedAccount}
        ></AccountsModal>}

      </Box>}

    <AdminSubComponentContainer isUpdate={editUatAccount}
      rowData={selectedAccount}
      showAddUatAcccountPop={showAddUatAcccountPop}
      setShowAddUatAccountPopup={(value: boolean) => setShowAddUatAccountPopup(value)}
      setEditUatAccount={() => setEditUatAccount(false)}
      showOffBoardModal={showOffBoardModal}
      setShowOffboardModal={(value: boolean) => setShowOffboardModal(value)}
      fetchDataSilenty={() => fetchDataSilenty()}
      sendActivationLink={sendActivationLink}
      setSendActivationLink={(value: boolean) => setSendActivationLink(value)} />

  </>)
}

export default TableContainer;