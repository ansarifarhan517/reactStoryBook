import React, {Dispatch, useEffect, useState } from 'react'
import withReact from '../../../utils/components/withReact'
import { Box, Card, Grid, useToast} from 'ui-library'
import { BreadCrumbWrapper ,SchedulerFormWrapper} from './PlanningStyledComponents'
import { useDispatch } from 'react-redux'
import axios from '../../../utils/axios'
import { ILogiAPIResponse } from '../../../utils/api.interfaces'
import {TripPlanningScheduler} from './PlanningForm.actions'
import GeneralDetailsForm from "./subComponents/PlanningFormGeneralDetails"
import OrderDetailsForm from "./subComponents/PlanningOrderDetails"
import OwnedFleetDetailsForm from "./subComponents/PlanningFormOwnedFleet"
import OutsourcedFleetDetailsForm from "./subComponents/PlanningFormOutsourcedFleet"
import PlanningSummary from "./subComponents/PlanningFormSummary"
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { routeContains, getQueryParams } from '../../../utils/hybridRouting'
import apiMappings from '../../../utils/apiMapping'
import BreadCrumbOption from './subComponents/BreadCrumb'
import useMetricsConversion from '../../common/ClientProperties/useMetricsConversion'

const ScheduledTripPlanningForm =()=>{
    const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
    const toast = useToast()
    const stepperConfig = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
    // const dynamicLabels= useTypedSelector(state=>state.dynamicLabels)
    const [activeStep, setActiveStep] = useState<string>('General')
    const {convertMetricsForDisplay} = useMetricsConversion()
    
    //  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
    // console.log("dynamicLabels",dynamicLabels);
    
      useEffect(()=>{
         dispatch({ type: '@@planningForm/FETCH_STRUCTURE' })
      },[])
    const validateForm = async (data:any) =>{
      const updatedConfig= stepperConfig;
      // const isLargeNumber = (element) => element.isActive;
      const activeStepIndex = stepperConfig?.findIndex((element:any) => element.isActive)
      updatedConfig.map((steps:any, index:number)=>steps.isActive= index == activeStepIndex+1)
      console.log("formInstance", data, activeStepIndex)
      dispatch({ type: '@@planningForm/UPDATE_STEPPER_CONFIG' , payload: updatedConfig})
      setActiveStep(updatedConfig[activeStepIndex+1].stepName)
      dispatch({type:'@@planningForm/SAVE_FORM_DATA', payload:data})
    }
    const goToStep=(index:number)=>{
      const updatedConfig= stepperConfig;
      updatedConfig.map((steps:any, innerIndex:number)=>steps.isActive= index == innerIndex)
      dispatch({ type: '@@planningForm/UPDATE_STEPPER_CONFIG' , payload: updatedConfig})
      setActiveStep(updatedConfig[index].stepName)
      dispatch({ type: '@@planningForm/SET_LOADING', payload: false })
    }
    useEffect(()=>{
      const { id } = getQueryParams()
      if (routeContains('updateTripPlanningScheduler') && id) {
        dispatch({ type: '@@planningForm/SET_EDIT_MODE', payload: true })
        fetchSchedulerData(id)
      } 
      return(()=>{
        dispatch({type:'@@planningForm/RESET_INITIAL_STATE'})
        dispatch({ type: '@@planningForm/SET_EDIT_MODE', payload: false })
        dispatch({ type: '@@planningForm/STEPPER_CONFIG'})
      })
    },[])
    const fetchSchedulerData = async (id: string | number) => {
    
      try {
        const { data: { data, status } } = await axios.get<ILogiAPIResponse<any>>(`${apiMappings.tripPlanningScheduler.form.getSchedulerDetails}${id}`)
        Object.values(data.data.orderFilters.filters).map((filter:any)=>{
          if(filter.fieldId === "packageWeight"){
            filter.filterData = convertMetricsForDisplay(Number(filter.filterData),'weight')
          }
          if(filter.fieldId === "packageVolume"){
            filter.filterData = convertMetricsForDisplay(Number(filter.filterData),'volume')
          }
        })
        if (status === 200) {
          dispatch({ type: '@@planningForm/UPDATE_FORM_DATA', payload:data })
        }
      } catch (error) {
        toast.add(error?.response?.data?.message || 'Something went wrong', 'warning', false)
      }
    }

    return ( <>
    <Box display='flex' mt='64px' flexDirection='column' px='15px' pb='15px' alignItems="flex-start">
     <BreadCrumbWrapper>
     <BreadCrumbOption/> 
      </BreadCrumbWrapper>
      <Card style={{backgroundColor: '#fff',  width: '100%',marginTop:"24px", marginBottom:"60px"}}>
         <SchedulerFormWrapper>
          <Grid container style={{width: "100%"}}>
            <Grid item xs={12}>
            {activeStep === 'General' && <GeneralDetailsForm key='General' validateForm={validateForm} goToStep={goToStep}></GeneralDetailsForm>}
            {activeStep === 'Orders' && <OrderDetailsForm key='Orders' validateForm={validateForm} goToStep={goToStep}/>} 
            {activeStep === 'Owned Fleet' && <OwnedFleetDetailsForm key='Owned Fleet' validateForm={validateForm} goToStep={goToStep}/>} 
            {activeStep === 'Outsourced Fleet' && <OutsourcedFleetDetailsForm key='Outsourced Fleet' validateForm={validateForm} goToStep={goToStep}/>} 
            {activeStep === 'Review' && <PlanningSummary key='Review' validateForm={validateForm} goToStep={goToStep}/>} 
             </Grid>
          </Grid>
          </SchedulerFormWrapper>
      </Card>
    </Box>
    {/* <PlanningProgressBar handleSubmit={handleSubmit} validateForm={validateForm} goToStep={goToStep} stepperConfig={stepperConfig}/> */}
    </>
)
}
export default withReact(ScheduledTripPlanningForm)