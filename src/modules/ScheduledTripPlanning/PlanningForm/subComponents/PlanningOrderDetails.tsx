import React, { useState, useEffect , Dispatch} from 'react'
import withReact from '../../../../utils/components/withReact'
import {IFilter,Grid, SectionHeader,IconButton, Tooltip, DatePicker, TextInput} from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import PlanningProgressBar from '../../../common/PlanningProgressBar/PlanningProgressBar'
import { SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import AdvancedFilterMasterCondition from '../../../common/AdvancedFilterComponent/MasterCondition'
import Conditions from '../../../common/AdvancedFilterComponent/Conditions/'
import ThirdElement from './ThirdElementOrderDetails';
import PrepColumnsData from '../../../common/AdvancedFilterComponent/PrepColumnsData';
import { useDispatch } from 'react-redux'
import {TripPlanningScheduler} from '../PlanningForm.actions'
import {IFormProps} from '../PlanningForm.model'
import { useForm } from 'react-hook-form'
import { useToast } from 'ui-library'
import { setDay , navigationConfirmationPopup, stepperSummarymaker, formatDates} from '../PlanningForm.utils'
import moment from 'moment'
import {tDatePickerChildren} from '../PlanningForm.model'
import { AdvancedSearchActions } from '../../../common/AdvancedSearch/AdvancedSearch.actions';
import {OrderTimeWindowNote} from '../PlanningStyledComponents'
const OrderDetailsForm =({ validateForm, goToStep }: IFormProps)=>{
  const toast = useToast()
   const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
   const dispatchAdvancedSearch = useDispatch<Dispatch<AdvancedSearchActions>>()
    const structure = useTypedSelector(state => state.tripPlanningScheduler.form.structure.orderDetails)
    const sectionKeys = Object.keys(structure)
    const stepperConfigRaw = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
    const formInstance = useForm<Record<string, any>>({
      mode: 'all', shouldUnregister: false, defaultValues: {}
    })
    const formData= useTypedSelector(state=>state.tripPlanningScheduler.form.formData)
    const columnsSelector = useTypedSelector(state => state.tripPlanningScheduler.form.structure?.orderDetailsListViewStructure?.columns);
    const operations = useTypedSelector(state => state.advancedSearch.operations);
    const { handleCancelClick } = navigationConfirmationPopup();
    const {handleSubmit}= formInstance
    const {stepperSummary} = stepperSummarymaker()
    const {formatDate} = formatDates()
     const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const [fromValue, setFromValue] = useState<any>(formData?.orderStartDay);
    const [toValue, setToValue] = useState<any>(formData?.orderEndDay);
    const [fromTimeValue, setFromTimeValue] = useState<Date>();
    const [toTimeValue, setToTimeValue] = useState<Date>();
    const [fromError, setFromError]= useState(false);
    const [toError, setToError]= useState(false);
    const [selectedFromDay, setSelectedFromDay]= useState(Math.abs(formData?.orderStartDay)? setDay(formData?.orderStartDay) : 'Tomorrow')
    const [selectedToDay, setSelectedToDay]= useState(Math.abs(formData?.orderEndDay)? setDay(formData?.orderEndDay): 'Tomorrow')
    const [columnsData, setColumnsData] = useState({
      sortDropdown: [],
      columnStructure: [],
      HSetColumnStructure: {}
    });
    const [stepperConfig, setStepperConfig]= useState(stepperConfigRaw)
    useEffect(()=>{
        dispatch({
          type: '@@planningForm/FETCH_ORDER_DETAILS_STRUCTURE'
        });
        
   },[])
   useEffect(()=>{
      if(operations.text?.length==1){
        dispatchAdvancedSearch({
          type: '@@advancedSearch/FETCH_DATA'
        });
      }
   }, [operations])
   const orderFilter= useTypedSelector(state => state.tripPlanningScheduler.form?.formData?.orderDetailsFilter)
   
   useEffect(()=>{
     if(stepperConfigRaw.length && formData){
      setStepperConfig(stepperSummary(stepperConfig, formData))
     }
     if(formData?.orderStartTime && formData?.orderEndTime ){
      setFromValue(formData?.orderStartDay)
      setToValue(formData?.orderEndDay)
      setSelectedFromDay(setDay(formData?.orderStartDay))
      setSelectedToDay(setDay(formData?.orderEndDay))
      // setFromTimeValue(formData?.orderStartTime)
      // setToTimeValue(formData?.orderEndTime)
     }
   },[stepperConfigRaw, formData])

    useEffect(() => {
      if(columnsSelector && Object.entries(columnsSelector)?.length>0){
        const newColumnSelector= columnsSelector;
        delete newColumnSelector?.destClientNodeName;
        delete newColumnSelector?.isGeocoded;
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
      filterMasterCondition: formData?.orderFiltersOperationLogic? formData?.orderFiltersOperationLogic: 'AND',
      filterSortable: false,
      sortable: {
        columnName: '',
        sortOrder: ''
      },
      allowSort: false,
      filterApplied: false,
      advanceFilterTagReferenceIds: []
    })
    const validateOrderDetails=(data:any)=>{
      var beginningTime = moment(moment(fromTimeValue).format('hh:mm:ss A'), 'hh:mm:ss A');
      var endTime = moment(moment(toTimeValue).format('hh:mm:ss A'), 'hh:mm:ss A');
      let valid = true 
      if(Object.keys(orderFilter).length>0){
        Object.values(orderFilter).forEach((filter:any)=>{
          if((!filter.firstValue || filter.operationSymbol=="" || !filter.thirdElement.value) && !((filter.operationLabelKey ==="isempty") || (filter.operationLabelKey ==="isnotempty"))){
            toast.add(dynamicLabels.orderDetailsError || 'Select conditions' ,'warning', false )
            valid = false
            return
          }
        }) 
      }
      if(valid){
        if(!toTimeValue && !fromTimeValue){
          setFromError(true)
          setToError(true)
          return
        }
        else if(!fromTimeValue){
         setFromError(true)
         return
        }
        else if (!toTimeValue){
          setToError(true)
          setFromError(false)
          return
        }
        else if(fromValue == toValue && moment(fromTimeValue).format('HH:mm:ss') === moment(toTimeValue).format('HH:mm:ss')){
          toast.add('“From” date and time should be less than “To” date and time' ,'warning', false )
          return
        }
        else if(fromValue == toValue && endTime.isBefore(beginningTime)){
          toast.add('“From” date and time should be less than “To” date and time' ,'warning', false )
          return
        }
        else if(fromValue > toValue){
          toast.add('“From” date and time should be less than “To” date and time' ,'warning', false )
          return
        }
        else{
          setToError(false)
          setFromError(false)
          validateForm(data)
          dispatch({type:'@@planningForm/SAVE_FORM_DATA', payload:{
            orderStartDay: fromValue,
            orderStartTime: moment(fromTimeValue),
            orderEndDay:  toValue,
            orderEndTime:moment(toTimeValue),
            orderFiltersOperationLogic: filterData.filterMasterCondition
          }})
          
        }
      }
      
      
    }
    useEffect(()=>{
      if(toValue){
        setToError(false)
      }
    },[toValue])

    useEffect(()=>{
      if(fromValue){
        setFromError(false)
      }
    },[fromValue])
   return (<>
    <div >
          {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
            <div key={sectionName}>
              {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
               <>
               <SectionHeaderContainer>
               <SectionHeader headerTitle={'Order Time Window'}>
               <Tooltip boundLeft={500} tooltipDirection="top" messagePlacement='start' hover message={dynamicLabels['orderTimeWindowNote']} key="add">
                    <img src="images/info-2.svg" style={{width:'12px', marginBottom:"2px"}} />
                </Tooltip>
                </SectionHeader>
             
               </SectionHeaderContainer>
               <Grid container spacing='10px' style={{ marginBottom: '15px' }}>
                
                <Grid item md={12} xs={12} sm={12} className='grid-item'>
                  <Grid container spacing='10px'>
                    {Object.keys(structure[sectionName]).map(fieldName => {
                      const meta = structure[sectionName][fieldName]
                      const { permission } = meta
                     
                      if (!permission) {
                        return undefined
                      }
                    return (
                        <Grid item key={fieldName} xs={12} sm={6} md={ 3 } className="grid-item">
                          
    <DatePicker
      required={meta.required}
      showDaysRange={true}
      // onChange={(e)=>{
      //   console.log("DatePicker", e)
      //   meta.fieldName=='from'? setFromValue(e): setToValue(e)}}
      label={meta.label}
      variant='time'
      timeInterval={15}
      timeFormat={24}
      style={{
        zIndex:1,
        position: 'absolute',
        top: '60px',
        right: 'auto'
      }}
    >
      {({ value, open, setOpen, selectedDay, previousCounter, nextCounter , counter, setNextCounter, setPreviousCounter, setCounter, setSelectedDay}: tDatePickerChildren) =>
      {
        meta.fieldName=='from'? 
        (setFromTimeValue(value?value: formData?.orderStartTime), setFromValue(selectedDay=='Next'? nextCounter: selectedDay=='Previous'? -previousCounter : counter)):
        (setToTimeValue(value?value: formData?.orderEndTime), setToValue(selectedDay=='Next'? nextCounter: selectedDay=='Previous'?  -previousCounter : counter))
      
        const values= value? (
          (selectedDay=='Next'? selectedDay+' '+nextCounter+' days ': selectedDay=='Previous'? selectedDay+' '+previousCounter+' days ': selectedDay+ ' '
          )+ moment(value).format('HH:mm'))
          : formData?.orderStartTime  && formData?.orderEndTime?
          meta.fieldName=='from' 
          ? (selectedFromDay=='Next'? selectedFromDay+' '+formData.orderStartDay+' days ': selectedFromDay=='Previous'? selectedFromDay +' '+ Math.abs(formData.orderStartDay)+' days ': selectedFromDay+ ' ')+ moment(formData.orderStartTime).format('HH:mm') 
          : (selectedToDay=='Next'? selectedToDay+' '+formData.orderEndDay+' days ': selectedToDay=='Previous'? selectedToDay +' '+Math.abs(formData.orderEndDay)+' days ': selectedToDay+ ' ')+ moment(formData.orderEndTime).format('HH:mm')
          : ''
        if(!value && formData?.orderStartTime  && formData?.orderEndTime){
          setFromValue(formData.orderStartDay);
          setToValue(formData.orderEndDay)
        }
        return (
          <div onClick={() =>{ setOpen(!open) ,
            (formData?.orderStartTime &&  meta.fieldName=='from')
            ?( (selectedFromDay=='Next' ? setNextCounter && setNextCounter(formData.orderStartDay): selectedFromDay=='Previous'?  setPreviousCounter && setPreviousCounter(Math.abs(formData.orderStartDay)): setCounter && setCounter(formData.orderStartDay), setSelectedDay && setSelectedDay(selectedFromDay))):''
            // : setNextCounter && setNextCounter(nextCounter || 2), setPreviousCounter && setPreviousCounter(previousCounter ||  2), setCounter && setCounter(1), setSelectedDay && setSelectedDay('Tomorrow') 
            ,
            (formData?.orderEndTime &&  meta.fieldName=='to')
            ? (selectedToDay=='Next' ? setNextCounter && setNextCounter(formData.orderEndDay): selectedToDay=='Previous'?  setPreviousCounter && setPreviousCounter(Math.abs(formData.orderEndDay)): setCounter && setCounter(formData.orderEndDay), setSelectedDay && setSelectedDay(selectedToDay)): ''
            // : setNextCounter && setNextCounter(nextCounter || 2), setPreviousCounter && setPreviousCounter(previousCounter || 2), setCounter && setCounter(1), setSelectedDay && setSelectedDay('Tomorrow')
          }}>
            <TextInput
              label={meta.label}
              id='someId'
              name={meta.name}
              className='datetimePickerInput'
              placeholder={meta.label}
              variant='withIcon'
              iconVariant='calendar'
              iconSize='md'
              value={values}
              // defaultValue={values}
              iconStyle={{ padding: '9px 9px 9px 9px' }}
              css={{width:'100%'}}
              width="100%"
              required={meta.required}
              error={meta.fieldName=='from'? fromError: toError}
              errorMessage={meta?.validation?.required?.message}
              displayTootltipOnIcon={false}
              messagePlacement="start"
              arrowPlacement="start"
            //   tooltipMesaage={meta.fieldName=='from' && fromValue!=='' ? 
            //   `If scheduler runs on ${moment(value).format('LLL zz')} ${moment.tz.guess()}, from date will be `
            //   : meta.fieldName=='to' && toValue!=='' ? 
            //   `If scheduler runs on  ${moment(value).format('LLL')} ${moment.tz.guess()}, to date will be `
            //   :''
            // }
            />
          </div>
        )
      } }
    </DatePicker>
                          {/* <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance} /> */}
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </Grid>
             </>}
            { toTimeValue && fromTimeValue && <OrderTimeWindowNote>If scheduler runs on {formatDate(new Date(), 0)}, From date will be {formatDate(fromTimeValue, fromValue)} and To date will be {formatDate(toTimeValue, toValue)}</OrderTimeWindowNote> }
            </div>
           
          )}
           <div key="Conditions">
             <SectionHeaderContainer>
               <SectionHeader headerTitle={dynamicLabels['conditions'] ? dynamicLabels['conditions'] : 'Conditions'}>
                </SectionHeader>
               </SectionHeaderContainer>
               <Grid container>
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
                  {columnsSelector && Object.entries(columnsSelector).length >0 && columnsData.columnStructure &&
                   <Conditions sectionName="orderDetails" ThirdElement={ThirdElement} chipsArray={<></>} fieldOperation={operations} columnsData={columnsData.columnStructure} 
                   filterData={orderFilter}
                   onAddCondition={(data:any)=>{
                    console.log("on Add condition", data)
                    dispatch({
                      type:"@@planningForm/SET_ORDER_DETAILS_FILTER",
                      payload:data
                    })
                   }} HSetColumnData={columnsData.HSetColumnStructure} ThirdElementFormatter={ThirdElementFormatter}/>}
                  </>
                  </Grid>
               </Grid>
              
             </div>
            <IconButton id='trip_planning_scheduler-actionBar-cancel' iconVariant="icomoon-close" onClick={()=>{handleCancelClick()}} style={{marginTop:'30px'}}>Cancel</IconButton>
    </div>
    <br/>
    <PlanningProgressBar handleSubmit={handleSubmit} validateForm={validateOrderDetails} goToStep={(index:number)=>{goToStep(index)}} stepperConfig={stepperConfig}/>
    </>
)
}
export default withReact(OrderDetailsForm)