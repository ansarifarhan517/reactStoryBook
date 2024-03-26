import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ColumnInstance } from 'react-table'
import { PdpaConfigActions } from "./PdpaConfig.action";
import {
    ListView, ISelectedRows, ISortOptions, useToast, IListViewColumn, IFetchDataOptions,Box,IconButton,Tooltip
} from 'ui-library'
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { sendGA } from "../../../../utils/ga";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { transformMongoListViewToColumns } from "../../../../utils/mongo/ListView";
import { useHistory } from "react-router-dom";
import iconsMapping from "../../../../utils/mongo/ListView/actionBarIcons.mapping";
import DeleteConfirmationModal from "../../../../utils/components/DeleteConfirmationModal";
import PreviewModal from "../../CustomForms/PreviewModal";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { addFormFieldsconset } from "../../CustomForms/utils";
import { fieldSettings, ICurrentField, IFieldSettings } from "../../CustomForms/CustomForms.models";


const PdpaConfigListView = () => {
    const history = useHistory();
    const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({});
    const [showDeletionConfirmation ,setShowDeletionConfirmation ] = React.useState(false)
    const [previewData, setPreviewData] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    const [formFields, setFormFields] = useState<Array<IFieldSettings>>([]);
    const [currentField, setCurrentField] = useState<ICurrentField>({ id: 0, Name: '', Settings: [], Active: false });


    //Custom Hook
    const dispatch = useDispatch<Dispatch<PdpaConfigActions>>();
    const toast = useToast()

    //Fetching data From redux
    const structure = useTypedSelector(state => state.consentHandling.listview.consentAct.structure)
    const totalRowsSelector = useTypedSelector(state => state.consentHandling.listview.consentAct?.data?.totalCount || 0)
    const loading = useTypedSelector(state => state.consentHandling.listview.consentAct.loading)

    const columnsSelector = useTypedSelector(state => state.consentHandling.listview.consentAct.structure.columns)
    const actionBarButtons = useTypedSelector(state => state.consentHandling.listview.consentAct.structure.buttons)
    const rowsSelector = useTypedSelector(state => state.consentHandling.listview.consentAct.data.results)
    const customFormData =  useTypedSelector((state) => state.consentHandling.Form.consetActFormUpdate.customFormData);
    const isUpdate = useTypedSelector((state) =>state.consentHandling.Form.isUpdate)


    useEffect(() => {
        setShowColumnShimmer(true)
        dispatch({ type: "@@PROTECTIONCONFIG/SET_VIEW_TYPE", payload: {viewType:"List"} })
        dispatch({ type: '@@PROTECTIONCONFIG/GET_PDPA_LISTVIEW_STRUCTURE' });
    }, [])

    useEffect(() =>{
        if(isUpdate === "FormLoaded"&& customFormData && customFormData.customFormStructure['general details']){
          addFormFieldsconset(customFormData, fieldSettings, setCurrentField, setFormFields)
          setPreviewData(customFormData)
          // setShowPreviewModal(true)
        }
    },[customFormData])

    useEffect(() => {
        const mongoStructure = columnsSelector;

        if (Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'protectionAct', cellCallbackMapping)
            setColumns(newColumns)
        }
        const firstEntry: any = Object.values(columnsSelector)?.[0]
        if (firstEntry?.id) {
            setTimeout(() => { setShowColumnShimmer(false) }, 0)
        }

    }, [columnsSelector]);

    const cellCallbackMapping = {
    }

    const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
        dispatch({
            type: '@@PROTECTIONCONFIG/SET_LIST_LOADING',
            payload: true,
        });
        setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
        sendGA('All Exceptions', `List Action - ${pageSize} - ${pageNumber} - ${sortOptions?.sortBy} - ${sortOptions?.sortOrder} - ${filterOptions?.searchBy} - ${filterOptions?.searchText}`);
        dispatch({
            type: '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    }, [])

    const deleteSelectedRows = async () => {
        const groupIds: Array<number> = [];

        const selectedItems = Object.values(selectedRows).map(row => row);
        selectedItems.forEach(function (eachRow) {
            groupIds.push(eachRow?.id)
        })
        setShowDeletionConfirmation(false)
        try {
            const { data: { message, status } } = await axios.delete(apiMappings.consent.list.delete,
                {
                    data: groupIds
                })
            if (status === 200) {
                toast.add(message, 'check-round', false)
                setSelectedRows({})
                fetchOptions.apis?.resetSelection()
                fetchDataSilently()
                return
            }
            else if (status === 409) {
                toast.add(message, 'warning', false);
                return
            }
            throw message
        } catch (errorMessage) {
            console.log('Failed to Delete Custom Forms: ', errorMessage)

        }
    }

    const fetchDataSilently = () => {  
        const { pageSize, pageNumber, sortOptions, filterOptions } = fetchOptions
    
        dispatch({
            type: '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW',
            payload: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                searchBy: filterOptions?.searchBy,
                searchText: filterOptions?.searchText,
                sortBy: sortOptions?.sortBy,
                sortOrder: sortOptions?.sortOrder
            }
        })
    
      }

   

    const onRowSelect = React.useCallback((s: ISelectedRows) => {
        setSelectedRows(s)
    }, []);

    const onSortChange = React.useCallback((sortObject: ISortOptions) => {
        sendGA('All Exceptions', `Click - ${sortObject?.sortBy} - ${sortObject?.sortOrder}`);
    }, [])

    const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
        sendGA('All Exceptions', `Click - Save and Apply Column Selector`);
        const columns = { ...columnsSelector }
        Object.keys(columns).forEach((columnKey) => {
            columns[columnKey].permission = !!visibleColumns[columnKey]
        })

        const payload = {
            ...structure,
            columns
        }

        try {
            const { data: { message } } = await axios.put(apiMappings.consent.list.structure, payload)
            message && toast.add(message, 'check-round', false)
        } catch (error) {
            console.log(error)
        }
    }, [columnsSelector])

    const handleActionBarButtonClick = (id: string) => {
        switch (id) {
            case 'delete':
                let allowDelete: boolean = true;
                setShowDeletionConfirmation(false)
                if (Object.keys(selectedRows).length && allowDelete) {
                    setShowDeletionConfirmation(true)
                }
                break;
        }
    }

  

        const onShowMoreColumns = () => {
             sendGA('All Exceptions', `Click - Column Selector`);
        }

        const onPreviewClick = (row) => {
          setShowPreviewModal(true);
          dispatch({
            type: '@@PROTECTIONCONFIG/FETCH_UPDATE_CONSENT_FORM',
            payload: row.id
          });
          dispatch({
            type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
            payload:{viewType: "FormLoaded"}
          })
        }

        const onUpdateClick = (row) =>{
            dispatch({
                type: '@@PROTECTIONCONFIG/SET_PAGETYPE',
                payload: 'updateConsent'
            })
            dispatch({
                type: '@@PROTECTIONCONFIG/FETCH_UPDATE_CONSENT_FORM',
                payload: row.id
            });
            dispatch({
                type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
                payload:{viewType: "FormLoaded"}
            })
            history.push({ pathname: "/addPdpaForm" });     
        }


        return (
            <>
              <Box
                display="flex"
                flexDirection="column"
                style={{ width: "100%", height: "90vh", marginRight: "2px" }}
              >
                <ListView
                  rowIdentifier="id"
                  style={{ height: "100%", overflow: "hidden" }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  onRowSelect={onRowSelect}
                  onShowMoreColumns={onShowMoreColumns}
                  onSortChange={onSortChange}
                  hideColumnSettings={false}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  hasRowSelection={ !actionBarButtons?.['update']?.permission}
                  hasRowSelectionWithEdit={actionBarButtons?.['update']?.permission}
                  hidePaginationBar={false}
                  totalRows={totalRowsSelector}
                  loading={loading}
                  isColumnLoading={showColumnShimmer}
                  onRowEditClick={onPreviewClick}
                >
                  {{
                    ActionBar: (
                      <Box display="flex" horizontalSpacing="10px">
                        {Object.keys(actionBarButtons).map(
                          (buttonKey) =>
                            actionBarButtons[buttonKey].permission &&
                            actionBarButtons[buttonKey].id === "delete" ? (
                              <div key={buttonKey}>
                                 <Tooltip
                                  message={dynamicLabels.deleteDraftConsent}
                                  hover
                                  messagePlacement="start"
                                >
                                <IconButton
                                  disabled={
                                    Object.keys(selectedRows).length
                                      ? Object.values(selectedRows).some(
                                          (row) => row.isPublished
                                        )
                                      : true
                                  }
                                  intent="table"
                                  iconVariant={
                                    buttonKey === "duplicate" ? "add" : iconsMapping[buttonKey]
                                  }
                                  id={`ConsentFormConfiglistView-actionBar-${buttonKey}`}
                                  onClick={() => {
                                    sendGA(
                                      "ListView ActionBar",
                                      `Custom Forms preview-record${actionBarButtons[buttonKey].label}-record`
                                    );
                                    handleActionBarButtonClick(buttonKey);
                                  }}
                                >
                                  {actionBarButtons[buttonKey].label}
                                </IconButton>
                                </Tooltip>
                              </div>
                            ) :
                            actionBarButtons[buttonKey].permission && actionBarButtons[buttonKey].id === "update" && (
                                <Tooltip
                                  message={dynamicLabels.updateConsent}
                                  hover
                                  messagePlacement="start"
                                >
                                  <IconButton
                                    key={buttonKey}
                                    disabled={Object.keys(selectedRows)?.length !== 1 || selectedRows[Object.keys(selectedRows)[0]].isPublished} 
                                    intent="table"
                                    iconVariant={iconsMapping[buttonKey]}
                                    id={`ConsentFormConfiglistView-actionBar-${buttonKey}`}
                                    onClick={()=>onUpdateClick(Object.values(selectedRows)[0])}
                                  >
                                    {actionBarButtons[buttonKey].label}
                                  </IconButton>
                                </Tooltip>
                            )
                        )}
                      </Box>
                    ),
                  }}
                </ListView>
              </Box>
              {/* {Delete Confirmation model} */}
              <DeleteConfirmationModal
                showDeletionConfirmation={showDeletionConfirmation}
                setShowDeletionConfirmation={(value: boolean) =>
                  setShowDeletionConfirmation(value)
                }
                deleteSelectedRows={deleteSelectedRows}
              />
              {showPreviewModal && (
                <PreviewModal
                  fromConsent
                  isShowModal={showPreviewModal}
                  dynamicLabels={dynamicLabels}
                  setShowPreviewModal={setShowPreviewModal}
                  previewData={previewData}
                />
              )}
            </>
          );
        
}

export default PdpaConfigListView
