import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ColumnInstance } from 'react-table'
import {
  Box, ListView, IListViewColumn, IFetchDataOptions,
  Modal, ModalHeader, IconButton, Tooltip,
  useToast, ISelectedRows, IListViewRow
} from 'ui-library'
import { useHistory } from 'react-router-dom';
import { CustomFormsActions } from '.././CustomForms.actions'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import iconsMapping from '../../../../utils/mongo/ListView/actionBarIcons.mapping'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import PreviewModal from '.././PreviewModal'
import DeleteConfirmationModal from '../../../../utils/components/DeleteConfirmationModal'
import { sendGA } from '../../../../utils/ga'
import { ITriggerEvents } from '../CustomForms.models';
import TriggerEventsFields from './TriggerEventsFields';
import { TriggerEventsModalContainer } from '../CustomFormsStyledComponents';

const CustomFormsListView = () => {
  /** General Hooks */
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
  const toast = useToast()
  const history = useHistory()
  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<CustomFormsActions>>()
  const structure = useTypedSelector(state => state.customForms.listView.structure)
  const columnsSelector = useTypedSelector(state => state.customForms.listView.structure.columns)
  const rowsSelector = useTypedSelector(state => state.customForms.listView.data.results)
  const totalRowsSelector = useTypedSelector(state => state.customForms.listView.data.totalCount)
  const actionBarButtons = useTypedSelector(state => state.customForms.listView.structure.buttons)
  const loading = useTypedSelector(state => state.customForms.listView.loading.listView)
  const subClients = useTypedSelector((state) => state.customForms.listView.lookup.subClients);

  /** State */
  const [columns, setColumns] = useState<IListViewColumn[]>([])
  const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
  const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
  const [previewData, setPreviewData] = useState({})
  const [showTriggerEventsPopup, setShowTriggerEventsPopup] = useState<{ isTriggerEventFlag: boolean, groupId: any } | undefined>()
  const [triggerEventsData, setShowTriggerEventsData] = useState<ITriggerEvents[]>([])
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)


  /** Watchers */
  useEffect(() => {
    setShowColumnShimmer(true)
    dispatch({ type: '@@customForms/FETCH_STRUCTURE' })
  }, [])

  useEffect(() => {
    const mongoStructure = columnsSelector

    if (Object.keys(mongoStructure).length) {
      const newColumns = transformMongoListViewToColumns(mongoStructure, 'customForms', cellCallbackMapping)
      setColumns(newColumns)
    }
    const firstEntry: any = Object.values(columnsSelector)?.[0]
    if (firstEntry?.id) {
      setTimeout(() => { setShowColumnShimmer(false) }, 0)
    }

  }, [columnsSelector])

  /** Trigger Events Popup Actions */
  const handleMandatoryChange = async (triggerEvent: Object) => {

    triggerEvent['isMandatory'] = !triggerEvent['isMandatory']
    try {
      const { data: { message, status } } = await axios.post(apiMappings.customForms.listView.mandatoryRequest + '?id=' + triggerEvent['id'] + '&mandatory=' + triggerEvent['isMandatory'])
      if (status === 200) {
        toast.add(message, 'check-round', false)
        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

  const handleActiveChange = async (triggerEvent: Object) => {

    triggerEvent['isActiveFl'] = !triggerEvent['isActiveFl']
    try {
      const { data: { message, status } } = await axios.post(apiMappings.customForms.listView.activeRequest + '?id=' + triggerEvent['id'] + '&activeFl=' + triggerEvent['isActiveFl'])
      if (status === 200) {
        toast.add(message, 'check-round', false)
        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

  const handleTriggerEventsPopup = async (isTriggerEventFlag: boolean, { customFormGroupId }: any) => {
    sendGA('ListView Column', 'Custom Forms - Trigger Event')
    const groupId = customFormGroupId

    try {
      const { data: { data, message, status } } = await axios.get(apiMappings.customForms.form.getTriggerEventById + `?customFormGroupId=${customFormGroupId}`);
      if (status === 200) {
        dispatch({ type: '@@customForms/FETCH_ORDER_STATES' });
        dispatch({ type: '@@customForms/FETCH_SERVICE_TYPES' });
        setShowTriggerEventsData(data);
        isTriggerEventFlag ? setShowTriggerEventsPopup({ isTriggerEventFlag: isTriggerEventFlag, groupId }) : setShowTriggerEventsPopup(undefined)
        return
      }
      throw message
    } catch (errorMessage) {
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }
  const cellCallbackMapping = {
    triggerEventsCount: handleTriggerEventsPopup
  }

  /** Delete Request */
  const deleteSelectedRows = async () => {
    const groupIds: any = [];

    const selectedItems = Object.values(selectedRows).map(row => row);
    selectedItems.forEach(function (eachRow) {
      groupIds.push(eachRow?.customFormGroupId)
    })
    setShowDeletionConfirmation(false)
    try {
      const { data: { message, status } } = await axios.delete(apiMappings.customForms.listView.deleteRecord,
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
      toast.add(dynamicLabels.somethingWendWrong, 'warning', false)
    }
  }

  const fetchDataSilently = () => {
    const { pageSize, pageNumber, sortOptions, filterOptions } = fetchOptions

    dispatch({
      type: '@@customForms/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy || '',
        sortOrder: sortOptions?.sortOrder || '',
        isLoading: false
      }
    });

  }

  /** List View Callbacks */
  const handleFetchData = React.useCallback(({ pageSize, pageNumber, sortOptions, filterOptions, apis }: IFetchDataOptions) => {
    dispatch({
      type: '@@customForms/SET_LOADING',
      payload: { listView: true }
    })
    setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
    dispatch({
      type: '@@customForms/FETCH_DATA',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: filterOptions?.searchBy,
        searchText: filterOptions?.searchText,
        sortBy: sortOptions?.sortBy,
        sortOrder: sortOptions?.sortOrder,
        isLoading: true
      }
    })
  }, [])


  const onSortChange = React.useCallback(() => { }, [])

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const handlePreviewForm = async (row: IListViewRow) => {
    setPreviewData(row)
    setShowPreviewModal(true)
  }

  const duplicateForm = () => {
    const rowKey = Object.keys(selectedRows)[0];
    const rowData = {
      customFormGroupId: selectedRows[rowKey].customFormGroupId,
      formName: selectedRows[rowKey].formName,
      formDescription: selectedRows[rowKey].formDescription,
      userGroupId: selectedRows[rowKey].userGroupId,
      userGroupName: selectedRows[rowKey].userGroupName,
      triggerEventsData: [],
      structure: selectedRows[rowKey].structure
    }

    dispatch({ type: '@@customForms/FETCH_ACCOUNT_NAMES' });
    dispatch({ type: '@@customForms/FETCH_ORDER_TYPES' });
    dispatch({ type: '@@customForms/FETCH_ORDER_LOCATIONS' });
    dispatch({ type: '@@customForms/FETCH_TRIGGER_ELEMENTS' });
    dispatch({ type: '@@customForms/FETCH_SERVICE_TYPES' });
    dispatch({ type: '@@customForms/FETCH_DELIVERY_TYPES' });
    dispatch({ type: '@@customForms/FETCH_ORDER_STATES' });

    dispatch({ type: "@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS", payload: rowData });
    history.push(`/addCustomForm/${rowData.customFormGroupId}`);
    dispatch({ type: "@@customForms/SET_VIEW_TYPE", payload: 'add-form-view' });
  }

  const handleActionBarButtonClick = (id: string) => {
    switch (id) {
      case 'delete':
        deleteRows()
        break;
      case 'duplicate':
        duplicateForm()
        break;
    }
  }

  const deleteRows = () => {
    let allowDelete: boolean = true;
    setShowDeletionConfirmation(false)
    if (Object.keys(selectedRows).length && allowDelete) {
      setShowDeletionConfirmation(true)
    } else {
      toast.add(dynamicLabels.pleaseDeactivateAllTriggerEventsToDeleteTheForm, 'warning', false);
    }

  }

  const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
    sendGA('Column Preference Action', 'Button Click - Apply')

    const columns = { ...columnsSelector }
    Object.keys(columns).forEach((columnKey) => {
      columns[columnKey].permission = !!visibleColumns[columnKey]
    })

    const payload = {
      ...structure,
      columns
    }

    try {
      const { data: { message } } = await axios.put(apiMappings.customForms.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }
  }, [columnsSelector])

  return (
    <>
      <ListView
        rowIdentifier='customFormGroupId'
        style={{ height: '100%', overflow: 'hidden' }}
        columns={columns}
        data={rowsSelector}
        onFetchData={handleFetchData}
        hasRowSelectionWithEdit={'listview' === 'listview'}
        onRowSelect={onRowSelect}
        onSortChange={onSortChange}
        onSaveColumnPreferences={onSaveColumnPreferences}
        totalRows={totalRowsSelector}
        loading={showColumnShimmer || loading}
        isColumnLoading={showColumnShimmer}
        hideColumnSettings={true}
        onRowEditClick={(row) => {
          sendGA('ListView ActionBar', 'preview-record')
          handlePreviewForm(row);
        }}
      >
        {{
          ActionBar:
            <Box display='flex' horizontalSpacing='10px'>

              {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                (
                  <Tooltip key={buttonKey} message={buttonKey === 'delete' ? dynamicLabels.ClickHereToDeleteCustomForm : `${actionBarButtons[buttonKey].label}`}
                    hover
                    messagePlacement={'start'}
                  >
                    <div>
                      <IconButton
                        key={buttonKey}
                        disabled={buttonKey === 'duplicate' ? Object.keys(selectedRows).length > 1 || !Object.keys(selectedRows).length ? true : false : !Object.keys(selectedRows).length}
                        intent='table'
                        iconVariant={buttonKey === 'duplicate' ? 'add' : iconsMapping[buttonKey]}
                        id={`listView-actionBar-${buttonKey}`}
                        onClick={() => {
                          sendGA('ListView ActionBar', 'Custom Forms preview-record' + actionBarButtons[buttonKey].label + '-record')
                          handleActionBarButtonClick(buttonKey)
                        }}
                      >
                        {actionBarButtons[buttonKey].label}
                      </IconButton>
                    </div></Tooltip>)
              )
              }
            </Box>
        }
        }
      </ListView>
      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />
      {/* TRIGGER EVENTS  MODAL */}
      <TriggerEventsModalContainer>
        <Modal open={!!showTriggerEventsPopup} onToggle={() => { }} width="90vw">
          {{
            header: <ModalHeader
              headerTitle={dynamicLabels.triggerEvents}
              imageVariant='icomoon-close'
              width='90vw'
              handleClose={() => {
                setShowTriggerEventsPopup(undefined)
              }}
            />,
            content: <TriggerEventsFields triggerEventsData={triggerEventsData} sendGA={sendGA} handleMandatoryChange={handleMandatoryChange} handleActiveChange={handleActiveChange} subClients={subClients} />
          }}
        </Modal>
      </TriggerEventsModalContainer>
      <PreviewModal
        isShowModal={showPreviewModal}
        dynamicLabels={dynamicLabels}
        setShowPreviewModal={setShowPreviewModal}
        previewData={previewData}
      />
    </>
  )
}

export default CustomFormsListView;