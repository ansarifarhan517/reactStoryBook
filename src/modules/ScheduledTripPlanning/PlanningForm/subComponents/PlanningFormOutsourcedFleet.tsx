import React, { useEffect, Dispatch, useState, useCallback} from 'react'
import withReact from '../../../../utils/components/withReact'
import { SectionHeader,IconButton, ListView, IListViewColumn, IFetchDataOptions, ISelectedRows} from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import {IFormProps} from '../PlanningForm.model'
import { useDispatch } from 'react-redux';
import {TripPlanningScheduler} from '../PlanningForm.actions'
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView';
import PlanningProgressBar from '../../../common/PlanningProgressBar/PlanningProgressBar'
import { useForm } from 'react-hook-form'
import AttachToTerritories from '../Popup/AttachedToTerritoriesModal'
import {navigationConfirmationPopup, stepperSummarymaker} from '../PlanningForm.utils'
import store from '../../../../utils/redux/store'
const OutsourcedFleetDetailsForm =({validateForm, goToStep }: IFormProps)=>{
      const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
    const columnsSelector = useTypedSelector(state => state.tripPlanningScheduler.form.structure.outSourcedFleet?.columns);
    const rowsSelector = store.getState().tripPlanningScheduler.form.data?.outSourcedFleet.results
    const totalCount =  useTypedSelector(state=>state.tripPlanningScheduler.form.data?.outSourcedFleet?.totalCount)
    const stepperConfigRaw = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
   
    
    const formInstance = useForm<Record<string, any>>({
      mode: 'all', shouldUnregister: false, defaultValues: {}
    })
    const isShowAttachToTerritoriesModal= useTypedSelector(state => state.tripPlanningScheduler?.form?.isShowAttachToTerritoriesModal)
    const [stepperConfig, setStepperConfig]= useState(stepperConfigRaw)
    const { handleCancelClick } = navigationConfirmationPopup();
    const {stepperSummary} = stepperSummarymaker()
    const listLoaded = useTypedSelector(state=>state.tripPlanningScheduler.form?.loading);
    const formData= useTypedSelector(state=>state.tripPlanningScheduler.form.formData);
    const {handleSubmit}= formInstance
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
   
    const [disableNextButton, setDisableNextButton]= useState(true)
     const [columns, setColumns] = useState<IListViewColumn[]>([]);
     const [newRowsSelector, setNewRowsSelector] = useState(rowsSelector)
     const [loading] = useState(listLoaded)
     const [attachTerritoriesRowId, setAttachTerritoriesRowId]= useState<number>()
     const [attachTerritoriesRowIndex, setAttachTerritoriesRowIndex]= useState<number>()
    useEffect(()=>{
        dispatch({
          type: '@@planningForm/FETCH_OUTSOURCEDFLEET_STRUCTURE'
        });
   },[])
   
   useEffect(()=>{
    setNewRowsSelector(rowsSelector)
   },[rowsSelector])


const attachedTerritories = (_value: number, _rowData : any, index:number ) => {
    setAttachTerritoriesRowId(_rowData?.index)
    setAttachTerritoriesRowIndex(index)
    setTimeout(()=>{
      dispatch({
        type: '@@planningForm/SHOW_ATTACH_TERRITORIES_MODAL',
        payload: {
          show:true,
          rowId:index,
          rowData:_rowData
        }
      })
    },100)
}
const availableFleetCount = (value: boolean, row : any, index:string) => {
  dispatch({
    type: '@@planningForm/SET_EDITED_OUTSOURCED_FLEETS',
    payload: {
      row:{...row, selectedFleetCount:value,attachedTerritories: value},
      index: parseInt(index)
    }
  })
  const newRow= newRowsSelector ? newRowsSelector[parseInt(index)]={...row, selectedFleetCount:value,attachedTerritories: value} : rowsSelector
  newRowsSelector && newRow && setNewRowsSelector([newRow])
}
const handleClose= ()=>{
  dispatch({
    type: '@@planningForm/HIDE_ATTACH_TERRITORIES_MODAL',
  })
}

   const cellCallbackMapping = {
    attachedTerritories: attachedTerritories,
    availableFleetCount:availableFleetCount,
  };
   useEffect(() => {
    if (columnsSelector && Object.keys(columnsSelector)?.length > 0) {
      const mongoStructure = columnsSelector;
      if (mongoStructure && Object.keys(mongoStructure).length) {
        const newColumns = transformMongoListViewToColumns(
          mongoStructure,
          "outSourcedFleet",
          cellCallbackMapping
        );
        setColumns(newColumns);
      }
    }
  }, [columnsSelector]);

  
   useEffect(()=>{
     if(stepperConfigRaw.length && formData){
      setStepperConfig(stepperSummary(stepperConfig, formData))
     }
   },[stepperConfigRaw, formData])

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
      let payload: any = {
        pageNumber: pageNumber || 1,
        pageSize: pageSize || 25,
        searchBy: filterOptions?.searchBy? filterOptions?.searchBy+'%23@%23branchName' : 'branchName' ,
        searchText:filterOptions?.searchText? filterOptions?.searchText+'%23@%23'+formData?.branch?.map((branch:any)=> branch?.name)?.toString() : formData?.branch?.map((branch:any)=> branch?.name)?.toString(),
        sortBy: sortOptions?.sortBy,
        sortOrder:sortOptions?.sortOrder,
        isLoading: true,
      }
      dispatch({
        type: '@@planningForm/FETCH_OUTSOURCEDFLEET_DATA',
        payload
      });
      formData?.outsourcedFleet? apis?.setSelection(formData?.outsourcedFleet): null
    },
    []
  )
  
useEffect(()=>{
  const disableNext= (formData?.continueWithoutOwnedFleetFl=='Y' && formData?.outsourcedFleet && Object.keys(formData?.outsourcedFleet)?.length>0) || (formData?.continueWithoutOwnedFleetFl =='N' && formData?.selectDAFromListFl=='Y' && formData?.ownedFleet && Object.keys(formData?.ownedFleet)?.length>0) || (formData?.continueWithoutOwnedFleetFl =='N' && formData?.selectDAFromListFl!='Y' && formData?.DAFilters && Object.keys(formData?.DAFilters)?.length>=0)|| (formData?.outsourcedFleet && Object.keys(formData?.outsourcedFleet)?.length>0)
  setDisableNextButton(!disableNext)
},[formData])


const validateFormData= (data:any)=>{
  if(formData?.selectDAFromListFl!='Y' || (formData?.ownedFleet && Object.keys(formData?.ownedFleet)?.length) || (formData?.DAFilters && Object.keys(formData?.DAFilters)?.length)|| (formData?.outsourcedFleet && Object.keys(formData?.outsourcedFleet)?.length)){
    validateForm(data)
  }
}

  const onRowSelect = useCallback(
    (selectedRows: ISelectedRows) => {
      dispatch({type:"@@planningForm/SET_SELECTED_OUTSOURCED_FLEETS", payload:selectedRows})
    },
    []
  )
  const onSortChange = useCallback(() => {
  }, [])

 useEffect(()=>{
   if(formData?.territoryProfile!='No Profile Selected'){
    dispatch({
      type: '@@planningForm/FETCH_TERRITORY_LIST',
      payload: parseInt(formData?.territoryProfile)
    });
   }
   },[formData])
   return (<>
   {columnsSelector && Object.keys(columnsSelector)?.length  &&
         <div >
         <div>
         <SectionHeaderContainer>
           <SectionHeader headerTitle={dynamicLabels['outsourcedFleet'] ? dynamicLabels['outsourcedFleet'] : 'Outsourced Fleet'}>
            </SectionHeader>
           </SectionHeaderContainer>
           <ListView
            columns={columns}
            data={newRowsSelector}
            totalRows={totalCount}
            loading={loading}
            hideRefresh={loading}
            isEditMode={false}
            hasRowSelectionWithEdit={false}
            hasRowSelection
            onRowSelect={onRowSelect}
            onRowEditClick={()=>{}}
            onSortChange={onSortChange}
            onFetchData={handleFetchData}
            rowIdentifier='index'
            style={{ height: '90vh' }}
    >
      {{
        ActionBar: <></>
      }}
    </ListView>
         </div>
       
         <IconButton id='trip_planning_scheduler-actionBar-cancel' iconVariant="icomoon-close" onClick={()=>{handleCancelClick()}}>Cancel</IconButton>
</div>

   }
    <PlanningProgressBar disableNext={disableNextButton} handleSubmit={handleSubmit} validateForm={(data:any)=>{validateFormData(data)}} goToStep={(index:number)=>goToStep(index)} stepperConfig={stepperConfig}/>
    <AttachToTerritories attachTerritoriesRowId={attachTerritoriesRowId} attachTerritoriesRowIndex={attachTerritoriesRowIndex} isShowAttachToTerritories={isShowAttachToTerritoriesModal} handleClose={handleClose} />
    </>
)
}
export default withReact(OutsourcedFleetDetailsForm)