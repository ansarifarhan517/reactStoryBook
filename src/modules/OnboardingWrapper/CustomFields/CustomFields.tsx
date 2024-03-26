import React, { useEffect, Dispatch, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ColumnInstance } from 'react-table'
import {
  Card, Box, ListView, IListViewColumn, IFetchDataOptions,
  withPopup, IconButton,Tooltip,Modal,ModalHeader,TextInput,
  withToastProvider, useToast,ISelectedRows, Grid , BreadCrumb
} from 'ui-library'

import { CustomFieldsActions } from './CustomFields.actions'
// import { IRowData } from './CustomFields.models'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { ReactTooltipCustom as ReactTooltip } from '../../../utils/layouts/ReactTooltipCustom'
import withRedux from '../../../utils/redux/withRedux'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { withThemeProvider } from '../../../utils/theme'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import {DuplicateCont ,Toast , ListViewCont} from './CustomFieldsCss';
import AddFormModal from './AddFormModal'
import EditFormModal from './EditFormModal'
// import ga from '../../../utils/ga'



const CustomFields = () => {
 /** General Hooks */
 const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customFields)
 const toast = useToast()

 /** Redux Hooks */
 const dispatch = useDispatch<Dispatch<CustomFieldsActions>>()
 const structure = useTypedSelector(state => state.customFields.listView.structure)
 const columnsSelector = useTypedSelector(state => state.customFields.listView.structure.columns)
 const rowsSelector = useTypedSelector(state => state.customFields.listView.data.results)
 const totalRowsSelector = useTypedSelector(state => state.customFields.listView.data.totalCount)
 const actionBarButtons = useTypedSelector(state => state.customFields.listView.structure.buttons)
 const loading = useTypedSelector(state => state.customFields.listView.loading.listView)
 const moduleList = useTypedSelector(state => state.customFields.listView.modulesList)
 const fieldTypesList = useTypedSelector(state => state.customFields.listView.fieldTypeList)
 /** State */
 const [columns, setColumns] = useState<IListViewColumn[]>([])
 const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
 const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
 const [customActivationRequest, setCustomActivationRequest] = useState<{ activeRequest: boolean, customIds: any, failureCallback?: React.Dispatch<React.SetStateAction<boolean>> } | undefined>()
 const [showDuplicateConfirmation, setShowDuplicateConfirmation] = useState<boolean>(false)
 const [showColumnShimmer, setShowColumnShimmer] = useState<boolean>(false)
 const [duplicateFieldname , setDuplicateFieldname] = useState("")
 const [fieldnameError , setFieldnameError] = useState('')
 const [fieldkeyError , setFieldkeyError] = useState('')
 const [duplicateFieldkey , setDuplicateFieldkey] = useState("")
 const [showAddModal, setShowAddModal] = useState(false)
 const [showEditModal, setShowEditModal] = useState(false)
 const [fieldData, setFieldData] = useState({})

  /** Variables */
  const breadCrumbOptions = React.useMemo(() => [
    { id: 'customFields', label: dynamicLabels.customFieldsSetup, disabled: true }
  ], [dynamicLabels])

 /** Watchers */
 useEffect(() => {
  setShowColumnShimmer(true)
  dispatch({ type: '@@customFields/FETCH_STRUCTURE' })
  dispatch({ type: '@@customFields/FETCH_MODULES' })
  dispatch({ type: '@@customFields/FETCH_FIELDTYPES' })
}, [])

useEffect(() => {
  const mongoStructure = columnsSelector

  if (Object.keys(mongoStructure).length) {
    const newColumns = transformMongoListViewToColumns(mongoStructure, 'customFields', cellCallbackMapping)
    setColumns(newColumns)
  }
  const firstEntry: any = Object.values(columnsSelector)?.[0]
  if (firstEntry?.id) {
  setTimeout(()=>{setShowColumnShimmer(false)},0)
  }
  
}, [columnsSelector])

const handleActiveChange = (isChecked: boolean, row : any, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
  if (row && row['id']) {
    if (!row['attachedWithModules'] || (row['attachedWithModules'] && !row['attachedWithModules'].length) ) {
      const customIds = {
        [row.id]: true
      }
      setCustomActivationRequest({ activeRequest: isChecked, customIds, failureCallback })
    } else {
      toast.add('Cannot mark this field as inactive as it is used in one or more modules', 'warning', false)
    }
}
}
  /** Cell Callbacks */
  const handleCustomActivation = async () => {
    if (!customActivationRequest) {
      return
    }
    setCustomActivationRequest(undefined)


    if (Object.keys(customActivationRequest.customIds).length === 1) {
      const id = Object.keys(customActivationRequest.customIds)[0]['id']
      dispatch({
        type: '@@customFields/UPDATE_DATA',
        payload: {
          id,
          isActiveFl: customActivationRequest.activeRequest
        }
      })
    }
    try {
      const { data: { message, status } } = await axios.put(apiMappings.customFields.listView.markRequest,
        Object.keys(customActivationRequest.customIds)
          .map(id => ({
            id: id,
            isActiveFl: customActivationRequest.activeRequest
          }))
      )
      if (status === 200) {
        toast.add(message, 'check-round', false)
        fetchDataSilently()
        setSelectedRows({})
        fetchOptions.apis?.resetSelection()
        return
      }
      throw message
    } catch (errorMessage) {
      customActivationRequest.failureCallback && customActivationRequest.failureCallback(!customActivationRequest.activeRequest)
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

const cellCallbackMapping = {
  isActiveFl: handleActiveChange
}
const closeAdd = () => {
  setSelectedRows({})
  fetchOptions.apis?.resetSelection()
  fetchDataSilently()
}
const handleAddForm =  (mode : string) => {
        if (mode && mode == "Add") {
          let fieldDetails = {};
          let fieldtypeArr = {};
          let fieldTypeModel = {};
          
          fieldTypesList.map((row : any) => {
            if(row && row.clientRefMasterCd == 'text'){
              fieldtypeArr = { 'name': row.clientRefMasterDesc, 'id': row.key, 'label': '', 'value': row.clientRefMasterCd }
                fieldTypeModel = fieldtypeArr
            }
          })

          fieldDetails = {
              "customFieldTypeModel": fieldTypeModel,
              "fieldType": "text",
              "customField": true,
              "required": false,
              "permission": true,
              "minLength": 0,
              "maxLength": 255,
              "minValue" : 0,
              "maxValue" : 255
          }
          getFieldDataToOpen(fieldDetails , mode)
      }
}
const handleEditForm =  async (rowId: string) => {

  try {
    const { data: { data, status , message} } = await axios.get(apiMappings.customFields.listView.getCustomField + '?id='+ rowId)
    if (status === 200) {
      setFieldData(data)
      setShowEditModal(true)
      return
    }
    throw message
  } catch (errorMessage) {
    toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
  }
}
const getFieldDataToOpen = (field : {} , mode : string) => {
                        // fallback for validations
                        if (field['fieldType'] == "number") {
                          if (field["minValue"] == undefined || field["minValue"] == null) {
                              field["minValue"] = 0;
                          }
          
                          if (field["maxValue"] == undefined || field["maxValue"] == null) {
                              field["maxValue"] = 999999999;
                          }
                      }
          
                      if (field['fieldType'] == "text") {
                          if (field["minLength"] == undefined || field["minLength"] == null) {
                              if (field['required']) {
                                  field["minLength"] = 1;
                              } else {
                                  field["minLength"] = 0;
                              }
                          }
          
                          if (field["maxLength"] == undefined || field["maxLength"] == null) {
                              field["maxLength"] = 255;
                          }
                      }
          
                      if (mode && mode == "customFieldMode") {
                          field['customField'] = true;
                      }
          
                      if (field['fieldType'] == "file") {
                          field['required'] = false;
                          field['isLocked'] = true;
                      }
                      field['mode'] = mode + ' Field';
          
                      if(Object.keys(field).length  > 0){
                          setFieldData(field)
                          setShowAddModal(true)  
                      }              
}

const fetchDataSilently = () => {
  const { pageSize, pageNumber, sortOptions, filterOptions } = fetchOptions

  dispatch({
  type: '@@customFields/FETCH_DATA',
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
    type: '@@customFields/SET_LOADING',
    payload: { listView: true }
  })
  setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions, apis })
  dispatch({
    type: '@@customFields/FETCH_DATA',
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

const handleActionBarButtonClick = (id: string) => {
  switch (id) {
    case 'duplicate':
      setShowDuplicateConfirmation(true)
      break
  }
}

const handleDuplicateRequest = async () => {
    setShowDuplicateConfirmation(false)
    let duplicateObj = {customFieldId: duplicateFieldkey, customFieldName: duplicateFieldname}
    const selectedRowValues = Object.values(selectedRows)
    let duplicateId: string = "";
    selectedRowValues.forEach(row => duplicateId = row.id)
    try {
      const { data: { message, status } } = await axios.post(apiMappings.customFields.listView.duplicateRequest + '?id='+ duplicateId, duplicateObj)
      if (status === 200) {
        toast.add(message, 'check-round', false)
        fetchDataSilently()
        setSelectedRows({});
        fetchOptions.apis?.resetSelection()
        setDuplicateFieldkey('');
        setDuplicateFieldname('');
        setFieldkeyError('');
        setFieldnameError('');
        return
      }
      throw message
    } catch (errorMessage) {
      toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
    }
  }

const onSaveColumnPreferences = React.useCallback(async (visibleColumns: Record<string, ColumnInstance<IListViewColumn>>) => {
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
     
    < >
    <ListViewCont>
     <Toast><div id='toast-inject-here' style={{ textAlign: 'center'}}></div></Toast>
      <Box display='flex' flexDirection='column' style={{ width: '100%', height: '90vh' ,  marginRight: '2px'}} px='15px' pb='15px'>
        {/* Header */}
        <Box display='flex' justifyContent='space-between' style={{ width: '100%' }} py='15px'>
          <BreadCrumb options={breadCrumbOptions} />

          {/* Page Action Buttons */}
          <Box display='flex' justifyContent='space-evenly' horizontalSpacing='10px'>
            {
              <>
                <IconButton
                  id='customFieldsSetup-actionBar-add'
                  intent='page'
                  data-tip
                  data-for='tt_AddcustomFields'
                  iconVariant='icomoon-add'
                  style={{ marginRight: '0px'}}
                  onClick={() => {
                    handleAddForm('Add')
                  }}>
                  {dynamicLabels.add || 'Add'}
                </IconButton>
                <ReactTooltip id='tt_AddcustomFields' type='info' effect='solid' place='bottom'>
                  {`${dynamicLabels.clickHereToAddCustomFields}`}
                </ReactTooltip>
              </>}
              </Box>
              </Box>
        
                {/* LIST VIEW CONTAINER */}
                <Grid container spacing={5} style={{ flexGrow: 1, overflow: 'hidden', width: '100%', boxShadow: '0 2px 20px -10px #000'}}>
          <Grid item md={12} style={{ display: 'flex', overflow: 'hidden' }}>
            <Card style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: '#fff', overflow: 'hidden', width: '100%', paddingRight: 0, paddingBottom: 0 }}>
              {
               <ListView
                  rowIdentifier='id'
                  style={{ height: '100%', overflow: 'hidden' }}
                  columns={columns}
                  data={rowsSelector}
                  onFetchData={handleFetchData}
                  hasRowSelectionWithEdit={'listview' === 'listview'}
                  onRowSelect={onRowSelect}
                  onSortChange={onSortChange}
                  onSaveColumnPreferences={onSaveColumnPreferences}
                  totalRows={totalRowsSelector}
                  loading={showColumnShimmer || loading }
                  isColumnLoading={showColumnShimmer}
                  onRowEditClick={(row) => {
                    handleEditForm(row.id)
                  }}
                >
                  {{
                    ActionBar:
                      <Box display='flex' horizontalSpacing='10px'>

                        {Object.keys(actionBarButtons).map(buttonKey => actionBarButtons[buttonKey].permission &&
                            (
                              <Tooltip message={buttonKey === 'duplicate' ? dynamicLabels.copyCustomFields : `${actionBarButtons[buttonKey].label}`}
                              hover
                              messagePlacement={'start'}
                            >    
                              <div>
                                <IconButton
                                  key={buttonKey}
                                  iconVariant='icomoon-add'
                                  disabled={!Object.keys(selectedRows).length || Object.keys(selectedRows).length > 1}
                                  intent='table'
                                  id={`listView-actionBar-${buttonKey}`}
                                  onClick={() => {
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
                </ListView> }
            </Card>

          </Grid>
        </Grid>
      </Box>
      {/* DUPLICATE CONFIRMATION MODAL */}
      <Modal open={showDuplicateConfirmation} onToggle={(value : any) => { setShowDuplicateConfirmation(value) }} width='600px'
        children={{
          header: (
            <ModalHeader
              headerTitle={dynamicLabels?.duplicateCustomFields}
              handleClose={() => setShowDuplicateConfirmation(false)}
              imageVariant='icomoon-close'
              headerStyle={{ fontSize: '15px' }}
            />
          ),
          content: (
            <DuplicateCont>
            <Box className="duplicate_cont">
              <Box className="field_cont">
                <Box className="field_input">
                  <TextInput
                    id='duplicateField_name'
                    label= {dynamicLabels.fieldName}
                    defaultValue=""
                    fullWidth={true}
                    disabled={false}
                    required={true}
                    placeholder={dynamicLabels.fieldName}
                    maxLength={255}
                    onInput={(e: any) => {
                      let reg = /^[a-zA-Z0-9_@ ]*$/
                      if(e.target.value == ""){
                        setFieldnameError(dynamicLabels.fieldNameMandatory)
                      }else if(reg.test(e.target.value) === false){
                        setFieldnameError(dynamicLabels.labelShouldBeAlphanumeric)
                      }else{
                        setFieldnameError("")
                      } 
                      setDuplicateFieldname(e.target.value)
                    }}
                    error={fieldnameError !== "" ? true : false}
                    />
                    {fieldnameError !== "" ? <span style={{ color: 'red'}}>{fieldnameError}</span> : <span></span>}
                </Box>
                <Box className="field_input">
                <span title="Custom Field prefix" className="cf_prefix cf_span">cf_</span>
                <TextInput
                  id='duplicateField_key'
                  label= {dynamicLabels.fieldKey}
                  defaultValue=""
                  fullWidth={true}
                  disabled={false}
                  required={true}
                  placeholder={dynamicLabels.fieldKey}
                  style={{ paddingLeft: '40px' }}
                  maxLength={255}
                  onInput={(e: any) => {
                    let reg = /^[a-zA-Z]*$/
                      if(e.target.value == ""){
                        setFieldkeyError(dynamicLabels.fieldKeyMandatory)
                      }else if(reg.test(e.target.value) === false){
                        setFieldkeyError(dynamicLabels.fieldCannotHaveSpaces)
                      }else{
                        setFieldkeyError("")
                      } 
                    setDuplicateFieldkey('cf_' + e.target.value) 
                  }}
                  error={fieldnameError !== "" ? true : false}
                  />
                  {fieldkeyError !== "" ? <span style={{ color: 'red'}}>{fieldkeyError}</span> : <span></span>}
              </Box>
              </Box>
            </Box>
            </DuplicateCont>
          ),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='customField-duplicateModal-save' iconVariant='icomoon-save' disabled={duplicateFieldname == '' || duplicateFieldkey == "" ? true :  false} primary onClick={() => handleDuplicateRequest()}>{dynamicLabels.duplicate}</IconButton>
              <IconButton id='customField-duplicateModal-close' iconVariant='icomoon-close' iconSize={11} onClick={() => setShowDuplicateConfirmation(false)}>{dynamicLabels.cancel}</IconButton>
            </Box>
          )
        }}
      />
            {/* ACTIVATION CONFIRMATION MODAL */}
            <Modal open={!!customActivationRequest} onToggle={() => { }} size='md'>
        {{
          header: <ModalHeader
            headerTitle={dynamicLabels?.confirmation}
            imageVariant='icomoon-close'
            handleClose={() => {
              customActivationRequest?.failureCallback && customActivationRequest?.failureCallback(!customActivationRequest.activeRequest)
              setCustomActivationRequest(undefined)
            }}
          />,

          content: (
            <>
              <div style={{ fontSize: '14px' }}>{customActivationRequest?.activeRequest ? dynamicLabels.areYouSureYouWantToMarkAsAcitve : dynamicLabels.areYouSureYouWantToMarkAsInactive}</div>
            </>),
          footer: (
            <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id={`customFields-${customActivationRequest?.activeRequest ? 'MarkAsAcitve' : 'MarkAsInactive'}-Ok`} iconVariant='icomoon-tick-circled' primary onClick={handleCustomActivation}>{dynamicLabels.confirm}</IconButton>
              <IconButton id='customFields-actionBar-Cancel' iconVariant='icomoon-close' iconSize={11}
                onClick={() => {
                  customActivationRequest?.failureCallback && customActivationRequest?.failureCallback(!customActivationRequest.activeRequest)
                  setCustomActivationRequest(undefined)
                }}>
                {dynamicLabels.cancel}
              </IconButton>
            </Box>
          )
        }}
      </Modal>
      <AddFormModal
                isShowModal={showAddModal}
                dynamicLabels={dynamicLabels}
                setShowAddModal={setShowAddModal}
                moduleList = {moduleList}
                fieldTypesList = {fieldTypesList}
                fieldData = {fieldData}
                onClose={() => closeAdd()}
            />
      <EditFormModal
                isShowModal={showEditModal}
                dynamicLabels={dynamicLabels}
                setShowEditModal={setShowEditModal}
                fieldData = {fieldData}
                moduleList = {moduleList}
                onClose={() => closeAdd()}
        /> 
        </ListViewCont>     
    </>

  )
}

export default withThemeProvider(withToastProvider(withRedux(withPopup(CustomFields)), 'toast-inject-here'))
