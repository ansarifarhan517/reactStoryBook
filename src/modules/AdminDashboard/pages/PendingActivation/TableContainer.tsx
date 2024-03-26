import React, { Dispatch, useEffect, useState } from "react";
import { ListView, IListViewColumn, Box, Grid, IFetchDataOptions, IFilterOptions, IconButton ,ISelectedRows, useToast,Tooltip } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";

import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import WhiteCard from "../../../../utils/layouts/WhiteCard";
import { useDispatch } from "react-redux";
import CreateActionBarButton from "../../../common/ActionBar/CreateActionBarButton";
import { AdminDashboardActions } from "../../AdminDashboard.actions";
import { TableHeader } from "../../AdminDashboard.styled.component";
import {ColumnInstance} from 'react-table';
import axios from "../../../../utils/axios";
import apiMappings from "../../../../utils/apiMapping";
import AdminSubComponentContainer from "../../SubComponent/AdminSubComponentContainer";

const TableContainer = (props: any) => {
  const dispatch = useDispatch<Dispatch<AdminDashboardActions>>()
  const toast = useToast();
  const columnsSelector = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.structure.columns);
  const rowsSelector = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.tableData);
  const totalRows = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.totalCount);
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
  // const loading = useTypedSelector(state=>state.adminDashboard.adminDashboard.noUsage.loading);
  const [columns, setColumns] = useState<IListViewColumn[]>([]);
  const structure = useTypedSelector((state) => state.adminDashboard.adminDashboard.pendingActivation.structure);
  // const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({});
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const actionBarButtons = useTypedSelector((state) => state.adminDashboard.adminDashboard.pendingActivation.structure.buttons);
  const [showAddUatAcccountPop, setShowAddUatAccountPopup] = useState<boolean>(false);
  const [sendActivationLink, setSendActivationLink] = useState<boolean>(false);
  const loading = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.loading);
  const editDetails = useTypedSelector(state => state.adminDashboard.adminDashboard.pendingActivation.editDetails);
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

  // const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
  useEffect(() => {
    
    dispatch({
      type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_STRUCTURE",
      payload: { status: "" },
    });

    // dispatch({
    //   type: "@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA",
    //   payload: { status: "" },
    // });
  }, []);


  // console.log(columns);
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {

    dispatch({
      type: '@@adminDashboard/PENDING_ACTIVATION/IS_LOADING',
      payload: true
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    dispatch({
      type: '@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA',
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
  }, [])

  const fetchDataSilenty = () => {
    const { pageSize, pageNumber, sortOptions, filterOptions: filter } = fetchOptions
    let payload: any = {
      pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filter?.searchBy,
        searchText: filter?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder
    }
    dispatch({
      type: '@@adminDashboard/PENDING_ACTIVATION/FETCH_DATA',
      payload
    });
    fetchOptions.apis?.resetSelection()
    setSelectedRows({})
  }

  const handleFilterChange = (combinedFilters: IFilterOptions) => {
    console.log(combinedFilters);
  }

  const onSortChange = React.useCallback(() => { }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const handleSaveRows = async () => {
    setDisableSaveButton(true)
    const isValid = validateSelectedRows()
    const payload: Partial<any> = {}
    if (isValid) {
      Object.values(selectedRows).forEach((row) => {
        if (editDetails[row.id]) {
          payload.id = row.id
          Object.keys(columnsSelector).forEach((columnId) => {
            if (columnsSelector?.[columnId]?.editable && !columnsSelector?.[columnId]?.customField) {
              payload[columnId] = editDetails?.[row.id]?.[columnId]?.saasValue || row[columnId]
            }
          })
          payload['hubspotDealId'] = row['hubspotDealId']
        }
      })
      if (!payload) {
        handleCancelRows()
        return
      }
      try {
        const { data: { message, status } } = await axios.post(`${apiMappings.adminDashboard.pendingAction.update}`, payload)
        if (status === 200) {
          setDisableSaveButton(false);
          handleFetchData(fetchOptions)
          setEditMode(false)
          fetchOptions.apis?.resetSelection()
          setSelectedRows({})
          dispatch({ type: '@@adminDashboard/PENDING_ACTIVATION/CLEAR_EDIT_DETAILS' })
          toast.add(message, 'check-round', false)
          return
        }
        throw message
      } catch (errorMessage) {
        setDisableSaveButton(false);
        const message = errorMessage?.response?.data?.message
        toast.add(message || dynamicLabels.somethingWendWrong, 'warning', false)
      }
    }
  }

  const validateSelectedRows = () => {
    const columnStructure = columnsSelector
    try {
      Object.keys(editDetails).forEach(rowId => {
        Object.keys(editDetails[rowId]).forEach(columnId => {
          const validations = columnStructure?.[columnId]?.validation
          const value = editDetails[rowId][columnId].saasValue
          if (validations?.required && !value) {
            throw {
              rowId,
              columnId,
              message: validations?.required?.message ||
                `${columnStructure[columnId].label} is required.`
            }
          }
          if (validations?.pattern && new RegExp(validations?.pattern?.args).test(value) == false) {
            throw {
              rowId,
              columnId,
              message: validations?.pattern?.message ||
                `Invalid ${columnStructure[columnId].label}.`
            }
          }
          if (validations?.minlength && String(value).length < Number(validations?.minlength?.args)) {
            throw {
              rowId,
              columnId,
              message: validations?.minlength?.message ||
                `${columnStructure[columnId].label} length must be more than ${validations?.minlength?.args} character(s).`
            }
          }
          if (validations?.maxlength && String(value).length > Number(validations?.maxlength?.args)) {
            throw {
              rowId,
              columnId,
              message: validations?.maxlength?.message ||
                `${columnStructure[columnId].label} length cannot be more than ${validations?.maxlength?.args} character(s).`
            }
          }
        })
      })
    } catch (error) {
      console.log('Inline Edit Validation Failed.', error?.message)
      dispatch({
        type: '@@adminDashboard/PENDING_ACTIVATION/SET_EDIT_DETAILS',
        payload: {
          saasRowId: error.rowId,
          saasColumnId: error.columnId,
          saasValue: editDetails?.[error.rowId]?.[error.columnId],
          saasHasError: true
        }
      })
      if (error.message) {
        toast.add(error.message, '', false)
      }
      return false
    }
    return true
  }

  const handleCancelRows = React.useCallback(() => {
    dispatch({ type: '@@adminDashboard/PENDING_ACTIVATION/CLEAR_EDIT_DETAILS' })
    setEditMode(false)
    fetchOptions.apis?.resetSelection()
    setSelectedRows({})
  }, [fetchOptions])


  const handleActionBarButtonClick = React.useCallback((id: string) => {
    switch(id){
      case "update":
        setEditMode(true);
        break;
      case "uatAccount":
        handleAddUat(selectedRows)
        break;
      case "sendActivationLink":
        handleSendActivationLink(selectedRows);
        break;
      case "default":
        break;
    }
    console.log("handleActionBarButtonClick");
  },[selectedRows]);
  // handleActionBarButtonClick

  const handleAddUat = (rows : any) => {
    Object.keys(rows)?.map((saasId) => {
      setEditMode(false)
      setShowAddUatAccountPopup(true)
      setSelectedAccount(rows[saasId])
    })
  }

  const handleSendActivationLink = (rows : any) => {
    Object.keys(rows)?.map((saasId) => {
      setSelectedAccount(rows[saasId])
      setSendActivationLink(true)
    })
  }
  // const filnalTableData = React.useMemo(() => {
  //   let data = []
  //   if (rowsSelector && rowsSelector.length) {
  //     for (let i = 0; i < rowsSelector.length; i++) {
  //       for (let j = 0; j < rowsSelector[i].userLevelData.length; j++) {
  //         if (j == 0) {
  //           rowsSelector[i].userLevelData[j].clientName = rowsSelector[i].clientName
  //         }

  //         rowsSelector[i].userLevelData[j].clientId = rowsSelector[i].clientId
  //         rowsSelector[i].userLevelData[j].isActiveFl = rowsSelector[i].isActiveFl
  //         rowsSelector[i].userLevelData[j].modelType = rowsSelector[i].modelType
  //         data.push(rowsSelector[i].userLevelData[j]);
  //       }
  //     }

  //   }
  //   return data;

  // }, [rowsSelector])
  const cellCallbackMapping = {
    userName: props.impersonateUser
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
          } = await axios.put(apiMappings.adminDashboard.pendingAction.structure, payload);
          message && toast.add(message, "check-round", false);
        } catch (error) {
          console.log(error, error?.response);
        }
      },
      [columnsSelector]
    );
  return (<>

    {!!Object.keys(columnsSelector)?.length &&
      <Box display="flex" flexDirection='column' style={{ width: '100%', height: '800px' }} px='15px' pb='15px'>
        <Grid container spacing={5} style={{ flexGrow: 1, width: "100%", boxShadow: "0 2px 20px -10px #000", position: "relative" }}>
          <Grid className='grid-customised-scroll-bar' item md={12} style={{ display: "flex", overflow: "hidden" }}>
            <WhiteCard>
            <TableHeader><h4>Pending Activations</h4></TableHeader>
              <ListView
                rowIdentifier="id"
                style={{ display: "flex", height: "200%", overflow: "auto", paddingBottom: "0.70%"}}
                columns={columns}
                data={rowsSelector}
                onFetchData={handleFetchData}
                onFilterChange={handleFilterChange}
                hasRowSelection={true}
                onRowSelect={onRowSelect}
                onSortChange={onSortChange}
                onSaveColumnPreferences={onSaveColumnPreferences}
                totalRows={totalRows}
                loading={loading}
                hideRefresh={loading}
                isEditMode={isEditMode}
                isColumnLoading={loading}
                hasSelectAllRows={true}

              >
                {{IconBar:
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
                          >{dynamicLabels.save}</IconButton>
                        </span>
                        <span style={{ display: "inline-block" }}>
                          <IconButton
                            intent="table"
                            id="listView-actionBar-cancel"
                            iconVariant="icomoon-close"
                            onClick={handleCancelRows}
                            disabled={!Object.keys(selectedRows).length ||disableSaveButton}
                          >
                            {dynamicLabels.cancel}
                          </IconButton>
                        </span>
                      </>) : ( selectedRows && Object.keys(actionBarButtons)?.map(
                              (buttonKey, index) => {
                              switch(buttonKey) {
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
                                        disabled={Object.keys(selectedRows)?.length !== 1}
                                        iconVariant="table"
                                        intent='table'
                                        id={`listView-actionBar-${buttonKey}`}
                                        onClick={()=>handleActionBarButtonClick(buttonKey)}
                                      >
                                        {actionBarButtons[buttonKey].label}
                                      </IconButton>
                                    </Tooltip>
                                  }
                                default: {
                                  return <CreateActionBarButton
                                    buttonKey={buttonKey}
                                    buttonIndex={index}
                                    actionBarButton={actionBarButtons[buttonKey]}
                                    buttonToolTipTextList={actionBarButtons[buttonKey].label}
                                    selectedRows={selectedRows}
                                    handleActionBarButtonClick={handleActionBarButtonClick}
                                    isButtonDisabled={Object.keys(selectedRows)?.length !== 1} />
                                }
                              }
                            }
                          )
                        )}
                      </Box>
                  }}

              </ListView>
            </WhiteCard>
          </Grid>
        </Grid>
      </Box>}

      <AdminSubComponentContainer 
        showAddUatAcccountPop = {showAddUatAcccountPop}
        isUpdate = {false}
        rowData= {selectedAccount}
        setShowAddUatAccountPopup = {(value: boolean) => setShowAddUatAccountPopup(value)}
        sendActivationLink = {sendActivationLink}
        setSendActivationLink = {(value: boolean) => setSendActivationLink(value)}
        fetchDataSilenty= {() => fetchDataSilenty()}
      />

  </>)
}

export default TableContainer;