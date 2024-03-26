import React, { useEffect , Dispatch, useCallback, useState} from 'react'
import withReact from '../../../../utils/components/withReact'
import {Tooltip, IFilter,Grid, SectionHeader,IconButton, ListView,ISortOptions, IFetchDataOptions, ISelectedRows, IListViewColumn} from 'ui-library'
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import {TripPlanningScheduler} from '../PlanningForm.actions'
import {IFormProps} from '../PlanningForm.model'
import { transformMongoListViewToColumns } from '../../../../utils/mongo/ListView';
import ThirdElement from './ThirdElementOwnedFleet';
import PrepColumnsData from '../../../common/AdvancedFilterComponent/PrepColumnsData';
import AdvancedFilterMasterCondition from '../../../common/AdvancedFilterComponent/MasterCondition'
import Conditions from '../../../common/AdvancedFilterComponent/Conditions/'
import PlanningProgressBar from '../../../common/PlanningProgressBar/PlanningProgressBar'
import { useForm } from 'react-hook-form'
import FormField from '../../../../utils/components/Form/FormField'
import { navigationConfirmationPopup, stepperSummarymaker} from '../PlanningForm.utils'
import { useToast } from 'ui-library'
import useDebounce from "../../../../utils/useDebounce";
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { ColumnInstance } from 'react-table'
const OwnedFleetDetailsForm =({ validateForm, goToStep }: IFormProps)=>{
  const structure = useTypedSelector(state => state.tripPlanningScheduler.form.structure.ownedFleet)
    const columnsSelector = useTypedSelector(state => state.tripPlanningScheduler.form.structure.ownedFleet.columns);
    const rowsSelector = useTypedSelector(state => state.tripPlanningScheduler.form.data.ownedFleet.results);
    const operations = useTypedSelector(state => state.advancedSearch.operations);
    const stepperConfigRaw = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
    const DAFilter= useTypedSelector(state => state.tripPlanningScheduler.form.formData.DAFilters)
    const toast = useToast()
    const formData= useTypedSelector(state => state.tripPlanningScheduler.form.formData)
    const totalRows= useTypedSelector(state => state.tripPlanningScheduler.form.data.ownedFleet?.totalCount) 
    const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>();
    const formInstance = useForm<Record<string, any>>({
      mode: 'all', shouldUnregister: false, defaultValues: {}
    })
    const { handleCancelClick } = navigationConfirmationPopup();
    const {stepperSummary} = stepperSummarymaker()
    const loading= useTypedSelector(state => state.tripPlanningScheduler.form.loading) 
    const {handleSubmit, watch, setValue}= formInstance
     const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
     const [stepperConfig, setStepperConfig]= useState(stepperConfigRaw)
     const [columns, setColumns] = useState<IListViewColumn[]>([]);
     const [rowsData, setRowsData]= useState(rowsSelector);
     const selectDAFromListFl = useDebounce(watch('selectDAFromListFl', formData?.selectDAFromListFl), 100);
     const continueWithoutDA = useDebounce(watch('continueWithoutOwnedFleetFl'), 100);
    const [transformedOperations] = useState(operations)
    const [filterOptions, setFilterOptions] = useState<IFetchDataOptions>({})
     useEffect(()=>{
       if(!columnsSelector){
        dispatch({
          type: '@@planningForm/FETCH_OWNEDFLEET_STRUCTURE'
        });
       }
     },[columnsSelector])
     useEffect(()=>{
      setRowsData(rowsSelector)
     },[rowsSelector])

     useEffect(()=>{
      formData?.ownedFleet && Object.values(formData?.ownedFleet)?.length && filterOptions.apis?.setSelection(formData?.ownedFleet)
     }, [filterOptions])

     useEffect(()=>{
      if(Object.keys(transformedOperations).length>0){
        Object.keys(transformedOperations).map((key:any)=>{
          if(key=='text'){
            return transformedOperations[key]= transformedOperations[key].filter((op:any)=> op.operation=="contains") 
          }
          else if(key=='select'){
            return transformedOperations[key]= transformedOperations[key].filter((op:any)=> op.operation=="in" || op.operation=="equals")  
          }
          else{
            return transformedOperations[key]
          }
        })
      }
      
     }, [transformedOperations])

     useEffect(()=>{
        if(formData?.selectDAFromListFl){
          setValue("selectDAFromListFl", formData?.selectDAFromListFl)
        }
     },[])
     
     useEffect(()=>{
      if(formData?.continueWithoutOwnedFleetFl=='Y' && (selectDAFromListFl=='N' || !selectDAFromListFl)){
        setValue("continueWithoutOwnedFleetFl", 'Y')
      }
      // else if(isEditMode && (formData?.continueWithoutOwnedFleetFl || formData?.continueWithoutOwnedFleetFl=='Y')){
      //   setValue("continueWithoutOwnedFleetFl", 'Y')
      // }
      else{
        setValue("continueWithoutOwnedFleetFl", 'N')
      }
     },[])

     useEffect(()=>{
       if(stepperConfigRaw.length && formData){
        setStepperConfig(stepperSummary(stepperConfig, formData))
       }
     },[stepperConfigRaw, formData])

     const originSelectCell = (_value: number, row : any) => {
      dispatch({
        type: '@@planningForm/SET_EDITED_OWNED_FLEETS',
        payload: {
          row:{...row.original, origin:_value},
          index:row.index
        }
      })
      
    }
     const cellCallbackMapping = {
      origin: originSelectCell,
    };

     useEffect(() => {stepperConfigRaw
        if (columnsSelector && Object.entries(columnsSelector).length !== 0) {
          const mongoStructure = columnsSelector;
          if (mongoStructure && Object.keys(mongoStructure).length) {
            const newColumns = transformMongoListViewToColumns(mongoStructure, 'ownedFleet' , cellCallbackMapping);
            setColumns(newColumns);
          }
        }
      }, [columnsSelector]);


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
          const { data: { message } } = await axios.put(apiMappings.tripPlanningScheduler.form.getOwnedFleetsStructure, payload)
          message && toast.add(message, 'check-round', false)
        } catch (error) {
          console.log(error, error?.response)
        }
      }, [columnsSelector])

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
          setFilterOptions({pageSize,
            pageNumber,
            sortOptions,
            filterOptions,
            apis})
          let payload: any = {
            pageNumber: pageNumber,
            pageSize: pageSize || 25,
            searchBy: formData?.branch && filterOptions?.searchBy ?   filterOptions?.searchBy+'%23@%23branchName' : formData?.branch? 'branchName' : filterOptions?.searchBy ,
            searchText:formData?.branch && filterOptions?.searchText ?  filterOptions?.searchText+'%23@%23'+formData?.branch?.map((branch:any) => branch?.name)?.toString()?.replaceAll(' ','+') :  formData?.branch? formData?.branch?.map((branch:any)=> branch?.name)?.toString()?.replaceAll(' ','+') :  filterOptions?.searchText,
            sortBy: sortOptions?.sortBy,
            sortOrder:sortOptions?.sortOrder,
            isLoading: true,
          }
         
          dispatch({
            type: '@@planningForm/FETCH_OWNEDFLEET_DATA',
            payload
          });
        },
        [formData?.branch]
      )
  
    
  const onSortChange = useCallback((sortBy: ISortOptions) => {
    console.log(sortBy)
  }, [])

  const onRowSelect = useCallback(
    (selectedRows: ISelectedRows) => {
      console.log("selectedRows", selectedRows)
      if(selectedRows )
      dispatch({type:'@@planningForm/SET_SELECTED_OWNED_FLEETS', payload:selectedRows})  
    },
    []
  )
  const [columnsData, setColumnsData] = useState({
    sortDropdown: [],
    columnStructure: [],
    HSetColumnStructure: {}
  });
  useEffect(() => {
    if(columnsSelector && Object.entries(columnsSelector)?.length){
      const newColumnSelector= columnsSelector;
      delete newColumnSelector?.capacityInUnits;
      delete newColumnSelector?.capacityInVolume;
      delete newColumnSelector?.capacityInWeight;
      delete newColumnSelector?.origin;
      delete newColumnSelector?.vehicleCapacity;
      const [
        sortDropdown,
        columnStructure,
        HSetColumnStructure
      ]: any = PrepColumnsData(newColumnSelector)
      setColumnsData({
        sortDropdown: sortDropdown,
        columnStructure: columnStructure,
        HSetColumnStructure: HSetColumnStructure
      })
    }
   
  }, [columnsSelector])

  const ThirdElementFormatter = (data: any) => {
    switch (data?.type) {
      case 'calendar':
        return data.value
      default:
        return data.value
    }
  }
  const [filterData, setFilterData] = useState<IFilter>({
    id: '',
    multiFilter: [],
    filterName: '',
    filterMasterCondition: formData?.DAFiltersOperationLogic? formData?.DAFiltersOperationLogic: 'AND',
    filterSortable: false,
    sortable: {
      columnName: '',
      sortOrder: ''
    },
    allowSort: false,
    filterApplied: false,
    advanceFilterTagReferenceIds: []
  })
  const checkboxField= {
    fieldId:"selectDAFromListFl",
    name:"selectDAFromListFl",
    fieldName:"selectDAFromListFl",
    label:"Select from the following list instead.",
    permission:true,
    fieldType:"checkbox",
    required: true,
    editable:true,
    options:[],
    id:"selectDAFromListFl",
  }
  const checkboxFieldContinue= {
    fieldId:"continueWithoutOwnedFleetFl",
    name:"continueWithoutOwnedFleetFl",
    fieldName:"continueWithoutOwnedFleetFl",
    label:dynamicLabels.continue_without_owned_fleets,
    permission:true,
    fieldType:"checkbox",
    required: true,
    editable:true,
    options:[],
    id:"continueWithoutOwnedFleetFl",
  }
  const validateOwnedFleets= (data:any)=>{
    let valid =true
    if(Object.keys(DAFilter).length>0){
      Object.values(DAFilter).forEach((filter:any)=>{
        if(!filter.firstValue || filter.operationSymbol=="" || !filter.thirdElement.value){
          toast.add(dynamicLabels.orderDetailsError || 'Select conditions' ,'warning', false )
          valid = false
          return
        }
      }) 
    }
    if(valid){ 
    data['DAFiltersOperationLogic']= filterData.filterMasterCondition
    validateForm(data)
    }
  }
  useEffect(()=>{
  if(selectDAFromListFl != 'Y'){
    handleFetchData(filterOptions)
  }
  },[selectDAFromListFl])
   return (<>
    <div >
        
             <div key="Conditions">
             <SectionHeaderContainer>
               <SectionHeader headerTitle={dynamicLabels['conditions'] ? dynamicLabels['conditions'] : 'Conditions'}>
               <Tooltip boundLeft={500} tooltipDirection="top" messagePlacement='start' hover message={dynamicLabels.owned_fleets_conditions_note} key="add">
                    <img src="images/info-2.svg" style={{width:'12px', marginBottom:"2px"}} />
                </Tooltip>
                </SectionHeader>
               </SectionHeaderContainer>
             <Grid container className={(selectDAFromListFl == 'Y') ? 'fade-overlay' : ''}>
             <Grid item xs={12} sm={6}>
             <FormField
              name={checkboxFieldContinue.fieldName}
              meta={checkboxFieldContinue}
              formInstance={formInstance} />
              </Grid>
             </Grid>
               <Grid container className={(selectDAFromListFl=='Y' || continueWithoutDA=='Y')? 'fade-overlay pl18':'pl18'} >
                  <Grid item xs={12} sm={6}>
                    <>
                    <AdvancedFilterMasterCondition
                condition={filterData.filterMasterCondition}
                handleChange={(e: any) => {
                  setFilterData({
                    ...filterData,
                    filterMasterCondition: e
                  })
                }}
              />
                  {columnsSelector && Object.entries(columnsSelector).length >0 && 
                   <Conditions sectionName="ownedFleet" ThirdElement={ThirdElement} chipsArray={<></>} fieldOperation={transformedOperations} columnsData={columnsData.columnStructure} 
                   filterData={DAFilter}
                   onAddCondition={(data:any)=>{
                    console.log("on Add condition", data)
                    dispatch({
                      type:"@@planningForm/SET_DA_DETAILS_FILTER",
                      payload:data
                    })
                   }}
                    HSetColumnData={columnsData.HSetColumnStructure} ThirdElementFormatter={ThirdElementFormatter}/>}
                  </>
                  </Grid>
               </Grid>
              
             </div>
             <hr/>
             <div className={(continueWithoutDA=='Y')? 'fade-overlay pl18':'pl18'} >
             <FormField
              name={checkboxField.fieldName}
              meta={checkboxField}
              formInstance={formInstance} />
              </div>
              {
                columns && columns.length>0 && 
                <ListView
                columns={columns}
                data={rowsData}
                totalRows={totalRows}
                loading={loading}
                hideRefresh={loading}
                isEditMode={false}
                hasRowSelectionWithEdit={false}
                hasRowSelection
                onRowSelect={onRowSelect}
                onRowEditClick={()=>{}}
                onSortChange={onSortChange}
                onFetchData={handleFetchData}
                rowIdentifier='deliveryMediumMasterId'
                style={{ height: '90vh' }}
                className={!(selectDAFromListFl=='Y') || continueWithoutDA=='Y'? 'fade-overlay':''}
                onSaveColumnPreferences={onSaveColumnPreferences}
              >
                {{
                  ActionBar: <></>
                }}
              </ListView>
              }
           
         
        <IconButton id='trip_planning_scheduler-actionBar-cancel' iconVariant="icomoon-close" onClick={()=>{handleCancelClick()}}>Cancel</IconButton>
    </div>
    <PlanningProgressBar handleSubmit={handleSubmit} validateForm={validateOwnedFleets} goToStep={(index:number)=>goToStep(index)} stepperConfig={stepperConfig}/>
    </>
)
}
export default withReact(OwnedFleetDetailsForm)