import React ,{useEffect, useState} from  'react'
import withReact from '../../../../utils/components/withReact'
import {useToast, Grid, SectionHeader, Card, Tooltip} from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import {IFormProps} from '../PlanningForm.model'
import PlanningProgressBar from '../../../common/PlanningProgressBar/PlanningProgressBar'
import { useForm } from 'react-hook-form'
import useClientProperties from "../../../common/ClientProperties/useClientProperties";
import moment from "moment";
import {createRequestPayload , getToFromTimeValue, capitalize} from '../PlanningForm.utils'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { hybridRouteTo } from '../../../../utils/hybridRouting'
import { sendGA } from '../../../../utils/ga'
import useMetricsConversion from '../../../common/ClientProperties/useMetricsConversion'
const PlanningSummary =({goToStep}: IFormProps)=>{
  const toast = useToast()
    const stepperConfig = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
    const formData= useTypedSelector(state=>state.tripPlanningScheduler.form.formData)
    const isEditMode= useTypedSelector(state=>state.tripPlanningScheduler.form.isEditMode)
    const branchList= useTypedSelector(state=>state.tripPlanningScheduler.form.data.branchList)
    const formInstance = useForm<Record<string, any>>({
      mode: 'all', shouldUnregister: false, defaultValues: {}
    })
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const format = clientProperties?.DATEFORMAT?.propertyValue ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : 'DD-MM-YYYY';
    const {handleSubmit}= formInstance
    
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    const startDate= moment(formData?.startDateTime).format(`${format}`)
    const endDate= moment(formData?.endDateTime).format(`${format}`)
    const [territoryCount, setTerritoryCount] = useState(0)
    const {convertMetricsForSave} = useMetricsConversion()
    useEffect(()=>{
      getTerritoriesById()
    },[])
    const getTerritoriesById= async() =>{
      try {
        const { data: { data, status } } = await axios.get(apiMappings.geofenceMaster.listView.getTerritoryProfileById+'?id='+parseInt(formData?.territoryProfile) )
        if (status === 200) {
          setTerritoryCount(data?.geofenceMasterDTOs?.length)
          return
        }
        return
      } catch (errorMessage) {
       return 0
      }
    }
    const SummaryCardData=[
      {
        name:dynamicLabels.scheduler_details|| 'Scheduler Details',
        icon:'images/routePlanning/review/new/dateRange.png',
        details: `Name: ${formData?.schedulerName} | Frequency: ${formData?.frequency}`,
        details_second: `Starts on: ${startDate} | Ends ${formData.ends=='On'? 'on '+endDate: formData.ends}`,
      },{
        name:dynamicLabels.number_of_branches || 'Number of Branches',
        icon:'images/routePlanning/review/new/branchCount.png',
        details:formData?.branch?.length || branchList?.length,
        style: {padding: '2px'}
      },{
        name:dynamicLabels.order_summary || 'Order Summary',
        icon:'images/routePlanning/review/new/orderCount.png',
        details: getToFromTimeValue(formData.orderStartDay, formData?.orderStartTime)+' - '+getToFromTimeValue(formData?.orderEndDay, formData?.orderEndTime),
        tooltip: Object.keys(formData?.orderDetailsFilter).length,
        style: {padding: '2px'}
        // tooltip: true
      },{
        name:dynamicLabels.planning_profile || 'Planning Profile',
        icon:'images/routePlanning/review.svg',
        details:formData?.planningProfile?.name|| 'Default'
      },{
        name:dynamicLabels.territory_profile || 'Territory Profile',
        icon:'images/routePlanning/territoryProfile.svg',
        details:formData?.territoryProfileName || 'Default',
        style: {padding: '9px'}
      },{
        name:dynamicLabels.number_of_territories || 'Number of Territories',
        icon:'images/routePlanning/review/new/geofenceCount.png',
        details:territoryCount,
        style: {padding: '2px'}
      },{
        name:dynamicLabels.number_of_owned_fleet || 'Number of Owned Fleet',
        icon:'images/routePlanning/review/new/outsourcedFleet.png',
        details:formData?.continueWithoutOwnedFleetFl=='Y'? 0 : formData?.selectDAFromListFl=='Y' ? (formData?.ownedFleet ?  Object.keys(formData?.ownedFleet)?.length : 0) : formData?.DAFilters &&  Object.keys(formData?.DAFilters).length ? Object.keys(formData?.DAFilters).length: 'All',
        tooltip:formData?.selectDAFromListFl!='Y' &&  Object.keys(formData?.DAFilters).length
      },{
        name:dynamicLabels.number_of_outsourced_fleet || 'Number of Outsourced Fleet',
        icon:'images/routePlanning/review/new/outsourcedFleet.png',
        details:formData &&  Object.entries(formData).length && formData?.outsourcedFleet ? Object.keys(formData?.outsourcedFleet)?.length : '0'
      },
    ]

    // useEffect(()=>{
    //    toast.add("asd", 'check-round', false)
    // },[])
  
   
const saveScheduler= async()=>{
  sendGA('Trip Planning Scheduler',isEditMode? 'Update - Trip Planning Scheduler':'Add Trip Planning Scheduler');
  Object.values(formData.orderDetailsFilter).map((filter:any)=>{
    if(filter.fieldId === "packageWeight"){
      filter.filterData = convertMetricsForSave(Number(filter.filterData),'weight')
    }
    if(filter.fieldId === "packageVolume"){
      filter.filterData = convertMetricsForSave(Number(filter.filterData),'volume')
    }
  })

const payload= createRequestPayload(formData)
try {
  const { data: { message, status } } = await axios.post(apiMappings.tripPlanningScheduler.form.schedule, payload, )
  if (status === 200) {
    message && toast.add(`${message}`, 'check-round', false)
    setTimeout(()=>{
      hybridRouteTo('tripPlanningSchedulers')
    },2000)
  }
  else{
    message && toast.add(`${message}`, 'warning', false)
  }
} catch (errorMessage) {
  toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, 'warning', false)
}
// dispatch({
//   type: '@@planningForm/FETCH_OUTSOURCEDFLEET_DATA',
//   payload
// });

}

const orderDetailsSummary= formData?.orderDetailsFilter &&  Object.values(formData?.orderDetailsFilter).map((order:any)=>{
  return <div style={{ textAlign: 'left', fontSize: 12 }}>
     {capitalize(order.firstValue.label || order.fieldLabelKey)} {order.labelValue} {order.filterData?.value || order.filterData?.replace(',',' , ')}
   </div>
})

const DADetailsSummary= formData?.selectDAFromListFl!='Y' && formData?.DAFilters &&  Object.values(formData?.DAFilters).map((order:any)=>{
  return <div style={{ textAlign: 'left', fontSize: 12 }}>
     <span className="">{capitalize(order.firstValue.label || order.fieldLabelKey)}</span> {order.labelValue} {order.filterData?.value || order.filterData.replace(',',' , ')}
   </div>
})
   return (<>
    <div >
        
            <div key="summary" className="review-card">
            
               <SectionHeaderContainer>
               <SectionHeader headerTitle={dynamicLabels['summary'] ? dynamicLabels['summary'] : 'Summary'}/>
               </SectionHeaderContainer>
               <Grid container spacing='10px' style={{ marginBottom: '15px' }} className="items-wrapper">
                
                <Grid item md={12} xs={12} sm={12} className='grid-item'>
                  <Grid container spacing='5px'>
                  {
                    SummaryCardData.map((items:any)=>{
                      return <Grid item xs={3} sm={3} md={3} key={items.name}>
                      
                        <Card className="item" style={{width:'100%'}}>
                        <div className="icon-wrapper"> 
                        <img style={items.style} src={items.icon} alt={items.name}/> 
                        </div>
                        <div className="item-title">{items.name}</div> 
                        <Tooltip tooltipDirection='bottom' messagePlacement='center' hide={!items?.tooltip} hover={items?.tooltip} message={(items.name==dynamicLabels.order_summary || items.name=='Order Summary') ? orderDetailsSummary : (items.name==dynamicLabels.number_of_owned_fleet || items.name=='Number of Owned Fleet')? DADetailsSummary: ''}>
                          <div className="item-value" style={{fontSize:'13px'}}>
                            <div>{items.details}</div>
                            <div>{items.details_second}</div> 
                          </div>
                        </Tooltip>
                        </Card>
                      </Grid>
                    })
                  }
                  </Grid>
                </Grid>
              </Grid>
            </div>
        </div>
    <PlanningProgressBar  handleSubmit={handleSubmit} validateForm={saveScheduler} goToStep={(index:number)=>goToStep(index)} stepperConfig={stepperConfig} isEditMode={isEditMode}/>
    </>
)
}
export default withReact(PlanningSummary)