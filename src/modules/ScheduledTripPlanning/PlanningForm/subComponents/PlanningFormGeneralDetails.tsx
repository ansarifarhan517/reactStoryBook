import React, { useEffect, Dispatch, useState } from 'react'
import withReact from '../../../../utils/components/withReact'
import {Grid, SectionHeader,IconButton} from 'ui-library'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import FormField from '../../../../utils/components/Form/FormField'
import { SectionHeaderContainer } from '../../../../utils/components/Form/Form.styles'
import DYNAMIC_LABELS_MAPPING from '../../../common/DynamicLabels/dynamicLabels.mapping'
import useDynamicLabels from '../../../common/DynamicLabels/useDynamicLabels'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import {getFrequencyOptions, getPeriod} from '../PlanningForm.utils'
import useDebounce from "../../../../utils/useDebounce";
import { deepCopy } from "../../../../utils/helper";
import { useDispatch } from 'react-redux'
import {TripPlanningScheduler} from '../PlanningForm.actions'
import {IFormProps , ITerritoryList , IPlanningProfileList , IBranchList } from '../PlanningForm.model'
import PlanningProgressBar from '../../../common/PlanningProgressBar/PlanningProgressBar'
import axios from '../../../../utils/axios'
import { useToast } from 'ui-library'
import apiMappings from '../../../../utils/apiMapping'
import FormLoader from '../../../../utils/components/FormLoader'
import {transformGeneralDetails, navigationConfirmationPopup} from '../PlanningForm.utils'
const GeneralDetailsForm =({validateForm, goToStep }: IFormProps)=>{
  const formData= useTypedSelector(state=> state.tripPlanningScheduler.form.formData)
  const formInstance = useForm<Record<string, any>>({
    mode: 'all', shouldUnregister: false, defaultValues: {...formData}
  })
   const dispatch = useDispatch<Dispatch<TripPlanningScheduler>>()
    const structure = useTypedSelector(state => state.tripPlanningScheduler.form.structure.generalDetails)
    const sectionKeys = Object.keys(structure)
     const {getValues, setValue , watch, handleSubmit, reset}= formInstance
     const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.tripPlanningScheduler)
     const [startDateTime, setStartDateTime] = useState()
     const frequency = useDebounce(watch('frequency', ''), 100);
     const startTime = useDebounce(watch('startDateTime', ''), 100)
     const endson = useDebounce(watch('ends', formData.endDateTime?'On':'Never' ), 100);
     const stepperConfig = useTypedSelector(state => state.tripPlanningScheduler.form.stepperConfig)
     const loaderRef = React.useRef<HTMLDivElement | null>(null)
     const territoryList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.territoryProfilesList)
     const territoryProfilesListTransformed= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.territoryProfilesListTransformed)
     const isLoading = useTypedSelector(state=>state.tripPlanningScheduler.form.loading)
     const planningProfilesList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.planningProfilesList)
     const branchList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.branchList)
     const isEditMode= useTypedSelector(state=>state.tripPlanningScheduler.form.isEditMode)
     
     const toast = useToast()
     const { handleCancelClick } = navigationConfirmationPopup();
     useEffect(()=>{
      if(formData && Object.keys(formData) && isEditMode){
        let setFormValues= transformGeneralDetails(formData)
        reset({...getValues(),...setFormValues})
        setValue('frequency', formData.frequency)
      }
     }, [formData])
     useEffect(()=>{
      setStartDateTime(startTime)
     },[startTime])

     useEffect(()=>{
       if(territoryList?.length){
        if(formData.geofenceProfileId && isEditMode){
            setValue('territoryProfile',formData.geofenceProfileId?.toString())
        }
        else if(!getValues()?.territoryProfile && !isEditMode){
          let getDefaultTerritory= territoryList.filter((territory:ITerritoryList)=> territory?.isDefault)
          if(getDefaultTerritory?.length){
            setValue('territoryProfile', getDefaultTerritory[0].profileId.toString())
          }
        }
        else{
        if(formData.territoryProfile && formData.territoryProfileName){
                  setValue('territoryProfile',formData.territoryProfile)
        }
        else{
          setValue('territoryProfile','No Profile Selected')
        }
        }
       }
       else{
        dispatch({ type: '@@planningForm/FETCH_TERRITORY_PROFILE_LIST' })
      }
     },[territoryList, formData])

     useEffect(()=>{
      if(planningProfilesList.length){
      if(formData.planningProfileId && isEditMode){
          const selectedProfile= planningProfilesList.filter((profile:IPlanningProfileList)=> profile.profileId==formData?.planningProfileId)
          if(selectedProfile?.length){
            setValue('planningProfile', {id:selectedProfile[0].profileId, name:selectedProfile[0].profileName, value: selectedProfile[0].profileId})
          }
        }
       if(!getValues()?.planningProfile){
         let getDefaultPlanningProfile= planningProfilesList.filter((profile:IPlanningProfileList)=> profile?.isDefault)
         if(getDefaultPlanningProfile?.length){
           setValue('planningProfile', {id:getDefaultPlanningProfile[0].profileId, name:getDefaultPlanningProfile[0].profileName, value: getDefaultPlanningProfile[0].profileId})
         }
       }
      }
      else{
       dispatch({ type: '@@planningForm/FETCH_PLANNING_PROFILE_LIST' })
     }
    },[planningProfilesList,formData])

    const getBranches= async()=>{
      const { data, status } = await axios.get(apiMappings.common.lookup.getBranches, {
        data: {},
        params: {
          search:true
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (status == 200) {
        dispatch({ type: '@@planningForm/SET_BRANCH_LIST', payload: data })
      }
    }

    useEffect(()=>{
      if(branchList.length){
      if(formData.branches && isEditMode){
          const selectedBranches= branchList.filter((branch:IBranchList)=> formData.branches.includes(branch.id))
          if(selectedBranches?.length){
            setValue('branch', selectedBranches.map((branch:IBranchList)=>{ 
              return{
                id:branch.id, 
                name:branch.name, 
                value: branch.branchId,
                label:branch.name
              }
            }))
          }
        }
    
      }
      else{
       getBranches()
     }
    },[branchList])
     
     useEffect(()=>{
      showHideFrequencyRelatedFields()
     },[frequency, formData])
     const showHideFrequencyRelatedFields= ()=>{
      const newStructure = deepCopy(structure);
      if (newStructure !== undefined && Object.keys(newStructure).length) {
        if(frequency=='Custom'){
          newStructure['schedulerDetails']['every'].permission = true;
          newStructure['schedulerDetails']['period'].permission = true;
          dispatch({ type: '@@planningForm/SET_GENERAL_STRUCTURE', payload: newStructure })
        }
        else{
          newStructure['schedulerDetails']['every'].permission = false;
          newStructure['schedulerDetails']['period'].permission = false;
          dispatch({ type: '@@planningForm/SET_GENERAL_STRUCTURE', payload: newStructure })
        }
      }
     }
     useEffect(()=>{
      const newStructure = deepCopy(structure);
      if (newStructure !== undefined && Object.keys(newStructure).length) {
        if(endson=='On'){
          newStructure['schedulerDetails']['endDateTime'].permission = true;
          dispatch({ type: '@@planningForm/SET_GENERAL_STRUCTURE', payload: newStructure })
        }
        else{
          newStructure['schedulerDetails']['endDateTime'].permission = false;
          dispatch({ type: '@@planningForm/SET_GENERAL_STRUCTURE', payload: newStructure })
        }
      }
     },[endson])

     useEffect(()=>{
      if(!getValues()?.schedulerName){
        const newDate = new Date()
        setValue("schedulerName", "Scheduled Plan "+moment(newDate).format('DDMMYYYY')+Math.floor(Math.random()*(999-100+1)+100))
      }
      if(!getValues()?.frequency){
        setValue('frequency', 'Daily')
      }
     },[])

     const validateForm2 =(data:IFormProps)=>{
      data['territoryProfileName']= territoryProfilesListTransformed[data?.territoryProfile]
      data['geofenceProfileId']= data?.territoryProfile
      if(!isEditMode){
        const checkSchedulerNameIsDuplicate= checkSchedulerNameValid(data.schedulerName)
        checkSchedulerNameIsDuplicate.then((status)=>{
          if(!status){
            if(data.endDateTime){
              if(moment(data.startDateTime).isBefore(moment(data.endDateTime))){
                validateForm(data)
              }
              else{
                toast.add('Scheduler End Time must be greater than Start Time' ,'', false )
              }
            }
            else{
              validateForm(data)
            }
           
          }
        })  
      }
      else{
        if(data.endDateTime){
          if(moment(data.startDateTime).isBefore(moment(data.endDateTime))){
            validateForm(data)
          }
          else{
            toast.add('Scheduler End Time must be greater than Start Time' ,'', false )
          }
        }
        else{
          validateForm(data)
        }
      }
      dispatch({ type: '@@planningForm/SET_TERRITORY_LIST', payload: {} })
     }
     const checkSchedulerNameValid= async (name:string)=>{
      try {
        const { data: payload , status} = await axios.get(apiMappings.tripPlanningScheduler.form.isValidSchedulerName+`${name}`, {})
        console.log("payload", payload, "status", status)
        if(status==200){
          if(payload){
            toast.add(dynamicLabels.dupicateSchedulerName || 'A Scheduled Trip Plan already exists with this name.' ,'', false )
            return payload
          }
          else{
            return payload
          }
        }
      } catch (errorMessage) {
        toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
      }
     }
   return (<>
    <div >
         {isLoading && <div ref={loaderRef}><FormLoader /></div>}
          {sectionKeys.length > 0 && sectionKeys.map((sectionName) =>
            <div key={sectionName}>
              {Object.keys(structure[sectionName]).some((fieldKey) => structure[sectionName][fieldKey].permission) &&
               <div key={sectionName+"_SectionWrapper"}>
               <SectionHeaderContainer>
               <SectionHeader headerTitle={dynamicLabels[sectionName] ? dynamicLabels[sectionName] : 'Details'} />
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
                      if(fieldName=='schedulerName' && isEditMode){
                        meta.editable= false
                      }
                      if(fieldName=="frequency"){
                        meta['dropdownValues'] = getFrequencyOptions();
                        meta['customField'] = true;
                      }
                      if(fieldName=="period"){
                        meta['dropdownValues'] = getPeriod();
                        meta['customField'] = true;
                      }
                      if(fieldName=='endDateTime'){
                        meta.minDate= startDateTime
                        meta.timeInterval=15
                      }
                      if(fieldName=='startDateTime'){
                        meta.editable= !isEditMode
                        meta.minDate= new Date()
                        meta.timeInterval=15
                      }
                      if(fieldName=='territoryProfile'){
                        meta['dropdownValues']= territoryProfilesListTransformed
                        meta['customField'] = true;
                        delete meta['lookupType']
                      }
                      if(fieldName=="ends"){
                        return(
                          <>
                          <Grid item key={fieldName} xs={12} sm={6} md={3} className="grid-item" >
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance} />
                          </Grid>
                          </>
                        )
                      }
                    return (
                        <Grid item key={fieldName} xs={12} sm={6} md={(fieldName=='every') ? 1 : fieldName=='period' ? 2 :  3 } className="grid-item">
                          <FormField
                            name={fieldName}
                            meta={meta}
                            formInstance={formInstance} />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </Grid>
             </div>}
            </div>
          )}
           <IconButton id='trip_planning_scheduler-actionBar-cancel' iconVariant="icomoon-close" onClick={()=>{ handleCancelClick()}}>Cancel</IconButton>
    </div>
    <PlanningProgressBar handleSubmit={handleSubmit} validateForm={validateForm2} goToStep={(index:number)=>goToStep(index)} stepperConfig={stepperConfig}/>
</>
)
}
export default withReact(GeneralDetailsForm)