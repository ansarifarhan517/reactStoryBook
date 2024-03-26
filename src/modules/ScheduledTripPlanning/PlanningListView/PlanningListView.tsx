import React, { useEffect, Dispatch, useState, useCallback} from 'react'
import withReact from '../../../utils/components/withReact'
import {useToast, Tooltip,Card,BreadCrumb,  Box,IconButton, ListView, IListViewColumn, IFetchDataOptions, ISelectedRows, ISortOptions} from 'ui-library'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { ColumnInstance } from 'react-table'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels'
import { useDispatch } from 'react-redux';
import {TripPlanningScheduler} from './PlanningListView.actions'
import { transformMongoListViewToColumns } from '../../../utils/mongo/ListView';
import {BreadCrumbWrapper} from '../PlanningForm/PlanningStyledComponents'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import iconsMapping from '../../../utils/mongo/ListView/actionBarIcons.mapping'
import ActivationConfirmation from './Popups/ActivationConfirmation'
import DeleteConfirmationModal from '../../../utils/components/DeleteConfirmationModal'
import { hybridRouteTo } from '../../../utils/hybridRouting'
import { sendGA } from '../../../utils/ga'
const PlanningListView =()=>{
      const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
    const structure = useTypedSelector(state => state.tripPlanningScheduler.listView.structure)
    const columnsSelector = useTypedSelector(state => state.tripPlanningScheduler.listView.structure.columns);
    const rowsSelector = useTypedSelector(state => state.tripPlanningScheduler.listView.data.results);
    const totalRowsSelector = useTypedSelector(state => state.tripPlanningScheduler.listView.data.totalCount) 
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const actionBarButtons = useTypedSelector(state => state.tripPlanningScheduler.listView.structure.buttons)
    const activeInactiveEditDetails = useTypedSelector(state=> state.tripPlanningScheduler.listView.editActiveInactiveDetails)
    const showConfirmationModal= useTypedSelector(state => state.tripPlanningScheduler.listView.showConfimationModal)
    const loading = useTypedSelector(state => state.tripPlanningScheduler.listView.loading)
    const pageLabels = useTypedSelector(state => state.pageLabels.tripPlanningScheduler)
    const [columns, setColumns] = useState<IListViewColumn[]>([]);
    const [selectedRows, setSelectedRows] = useState<ISelectedRows>({})
    const toast = useToast()
    const [fetchOptions, setFetchOptions] = useState<IFetchDataOptions>({})
    const [showDeletionConfirmation, setShowDeletionConfirmation] = useState<boolean>(false);
    useEffect(()=>{
      let payload: any = {
          pageNumber: 1,
          pageSize: 25,
          searchBy: '',
          searchText:'',
          sortBy: '',
          sortOrder:'',
          isLoading: false,
          isTotalCountLoading: false,
          dataFetchMode: 'DATA'
        }
        dispatch({
          type: '@@planningListView/FETCH_DATA',
          payload
        });
        dispatch({
          type: '@@planningListView/FETCH_STRUCTURE'
        });
   },[])


   const handleActiveFlChange = (isChecked: boolean, rowData : any, failureCallback: React.Dispatch<React.SetStateAction<boolean>>) => {
    dispatch({
      type: '@@planningListView/SET_UPDATE_ACTIVE_INACTIVE_DETAILS',
      payload: {
        schedulerId:rowData?.schedulerDetailsId,
        activeStatusFl:isChecked,
        failureCallback
      }
  })
  dispatch({
    type: '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL',
    payload: true
  })
}
   const cellCallbackMapping = {
    status: handleActiveFlChange,
  };
   useEffect(() => {
    if (columnsSelector && Object.entries(columnsSelector)?.length !== 0) {
      const mongoStructure = columnsSelector;
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(
          mongoStructure,
          "tripPlanningScheduler",
          cellCallbackMapping
        );
        setColumns(newColumns);
      }
    }
  }, [columnsSelector]);

  const handleFetchData = useCallback(
    ({
      pageSize,
      pageNumber,
      sortOptions,
      filterOptions,
      apis
    }: IFetchDataOptions) => {
      ({
        pageSize,
        pageNumber,
        sortOptions,
        filterOptions,
        apis
      })
      setFetchOptions({ pageSize, pageNumber, sortOptions, filterOptions,apis })
      let searchBy= filterOptions?.searchBy
      let searchText= filterOptions?.searchText;
      let sortBy= sortOptions?.sortBy
      if(sortOptions?.sortBy=='users'){
        sortBy='userMap'
      }
      if(sortOptions?.sortBy=='status'){
        sortBy='isActiveFl'
      }
      if(filterOptions?.searchBy?.includes('status')){
        searchBy=searchBy?.replace('status','isActiveFl')
      }
      if(filterOptions?.searchBy?.includes('users')){
        searchBy=searchBy?.replace('users','userMap')
      }
      if(filterOptions?.searchBy?.includes('frequency')){
        searchText= filterOptions.searchText?.toLowerCase()?.includes('month')?'3' : filterOptions.searchText?.toLowerCase()?.includes('week')?'2':'1'
      }
      if(filterOptions?.searchBy?.includes('frequency') && filterOptions.searchText?.toLowerCase()?.includes('every')){
        searchBy=searchBy?.replace('frequency','isCustomFl')
        searchText="1"
      }
      let payload: any = {
        pageNumber: pageNumber,
        pageSize: pageSize,
        searchBy: searchBy,
        searchText: searchText,
        sortBy: sortBy,
        sortOrder: sortOptions?.sortOrder,
        isLoading: false,
        isTotalCountLoading: false,
        dataFetchMode: 'DATA'
      }
      dispatch({
        type: '@@planningListView/FETCH_DATA',
        payload
      });
      apis?.resetSelection()
    },
    []
  )

  const onRowSelect = React.useCallback((s: ISelectedRows) => {
    setSelectedRows(s)
  }, [])

  const deleteSelectedRows = async () => {
    setShowDeletionConfirmation(false);
    try {
        const { data} = await axios.post(apiMappings.tripPlanningScheduler.listView.deleteScheduler, Object.keys(selectedRows), )
        if (data) {
          toast.add('Scheduler Deleted successfully.', 'check-round', false)
          handleFetchData(fetchOptions)
          setSelectedRows({})
          return
        }
      } catch (errorMessage) {
        toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
  }

  
  const onSortChange = useCallback((sortBy: ISortOptions) => {
    // action('Sort Changed: ')(sortBy)
    console.log(sortBy)
  }, [])

  const breadCrumbOptions = React.useMemo(() => {
    const list: any = [
      { id: 'Routes', label: dynamicLabels.route_p || 'Routes', disabled: true },
      { id: 'TripPlanningSchedulers', label: dynamicLabels?.tripPlanningSchedulers || 'Trip Planning Schedulers', disabled: true },
    ]
    return list
  }, [dynamicLabels])

  const updateStatus= async() => {
    const { data } = await axios.post(apiMappings.tripPlanningScheduler.listView.deactivateScheduler+!activeInactiveEditDetails?.activeStatusFl, [activeInactiveEditDetails?.schedulerId])
    if(data){
      dispatch({
        type: '@@planningListView/FETCH_DATA',
        payload: {
          pageNumber: 1,
          pageSize: 25,
          searchBy: '',
          searchText:'',
          sortBy: '',
          sortOrder:'',
          isLoading: false,
        }
      });
      toast.add(dynamicLabels.schedulerStatusUpdatedSuccessfully, 'check-round', false)
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
      const { data: { message } } = await axios.put(apiMappings.tripPlanningScheduler.listView.structure, payload)
      message && toast.add(message, 'check-round', false)
    } catch (error) {
      console.log(error, error?.response)
    }
  }, [columnsSelector])
  // const deleteSelectedRows= ()=>{

  // }
   return (
    <div >
      
        <Box display='flex' mt='64px' flexDirection='column' px='15px' pb='15px' alignItems="flex-start">
     <BreadCrumbWrapper>
     
     <BreadCrumb
        options={breadCrumbOptions}
        width='100%'
      /> 
       {pageLabels?.buttons.add && (
      <Tooltip message={`${dynamicLabels?.clickHereToAddScheduler}`} hover={true} tooltipDirection="left">
        <IconButton
          id="trip_planning_schedulers--actionbar--add"
          intent='page'
          iconVariant='icomoon-add'
          onClick={() => {
            sendGA('Trip Planning Scheduler','Add Trip Planning Scheduler - Form');
            hybridRouteTo('addTripPlanningScheduler')}} >
          {dynamicLabels[pageLabels?.buttons.add] || dynamicLabels.add}
        </IconButton>
      </Tooltip>)}
      </BreadCrumbWrapper>
      <Card style={{backgroundColor: '#fff',  width: '100%',marginTop:"24px", marginBottom:"60px"}}>
               <ListView
                rowIdentifier='schedulerDetailsId'
                paginationPageSize={25}
                columns={columns}
                data={rowsSelector}
                totalRows={totalRowsSelector}
                isColumnLoading={loading}
                loading={loading}
                hideRefresh={loading}
                isEditMode={false}
                hasRowSelection={!actionBarButtons?.['InlineEdit']?.permission}
                hasRowSelectionWithEdit={actionBarButtons?.['InlineEdit']?.permission}
                onRowSelect={onRowSelect}
                onRowEditClick={(row)=>{
                  sendGA('Trip Planning Scheduler','Update Trip Planning Scheduler - Form');
                  hybridRouteTo('updateTripPlanningScheduler?id='+row?.schedulerDetailsId)}}
                onSortChange={onSortChange}
                onFetchData={handleFetchData}
                onSaveColumnPreferences={onSaveColumnPreferences}
                style={{ height: '80vh' }}
        >
          {{
            ActionBar: (
                <Box display='flex' horizontalSpacing='10px'>
                  
                                 { Object.keys(actionBarButtons).map(
                                    (buttonKey) =>
                                      actionBarButtons[buttonKey].permission && buttonKey=='delete' &&
                                      
                                        <Tooltip message={`${actionBarButtons[buttonKey].label}`}
                                            hover
                                            messagePlacement={'start'}
                                          >

                              <IconButton
                                key={buttonKey}
                                disabled={!Object.keys(selectedRows)?.length}
                                intent='table'
                                iconVariant={iconsMapping[buttonKey]}
                                id={`listView-actionBar-${buttonKey}`}
                                onClick={() => {setShowDeletionConfirmation(true)}}
                            >
                                {actionBarButtons[buttonKey].label}
                            </IconButton>
                                            </Tooltip>
                                      
                                      
                                  )}
                </Box>
              )
          }}
        </ListView>
            </Card>
        </Box>
        <ActivationConfirmation
        isShowActivationConfirmation={showConfirmationModal}
        title={dynamicLabels?.statusConfirmation}
        footerButtonGroup={[
          {
            iconVariant: 'icomoon-tick-circled',
            onClick: ()=>{
              dispatch({
                type: '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL',
                payload: false
            })
            updateStatus()
            },
            primary: true,
            label: dynamicLabels?.confirm,
            isVisible: true,
          },
          {
            iconVariant: 'icomoon-close',
            onClick: () => { 
              dispatch({
                type: '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL',
                payload: false
            })
            },
            primary: false,
            label: dynamicLabels?.cancel,
            isVisible: true,
          },
        ]}
        confirmationMessage={!activeInactiveEditDetails.activeStatusFl? dynamicLabels.areYouSureYouWantToMarkAsInactive : dynamicLabels.areYouSureYouWantToMarkAsAcitve}
        handleClose={() => {
          dispatch({
            type: '@@planningListView/SHOW_ACTIVE_CONFIRMATION_MODAL',
            payload: false
        })
        }}

        

      />
        <DeleteConfirmationModal
        showDeletionConfirmation={showDeletionConfirmation}
        setShowDeletionConfirmation={(value: boolean) => setShowDeletionConfirmation(value)}
        deleteSelectedRows={deleteSelectedRows}
      />
    </div>
)
}
export default withReact(PlanningListView)