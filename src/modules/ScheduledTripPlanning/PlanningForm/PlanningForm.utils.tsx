import React, { Dispatch } from 'react'
import moment from 'moment'
import { useTypedSelector } from '../../../utils/redux/rootReducer'
import { tGlobalPopupAction } from '../../common/GlobalPopup/GlobalPopup.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import { IconButton } from 'ui-library';
import useClientProperties from '../../common/ClientProperties/useClientProperties'
import { sendGA } from '../../../utils/ga'
import {IFormProps } from './PlanningForm.model'
export const getFrequencyOptions =()=>{
    let frequency = { "Daily": "Daily", "Weekly":"Weekly", "Monthly": "Monthly", "Custom": "Custom"};
  return frequency;
}

export const getPeriod =()=>{
    let period = { 'Days':'Days', 'Weeks':'Weeks', 'Months': 'Months'};
  return period;
}
export const getToFromTimeValue=(days:number, date:Date)=>{
  const day= days>1? 'Next' : days<-1? 'Previous':DaysMapping[days?.toString()] ;
  const time= moment(date).format('HH:mm')
  return day+ (days>1 || days<-1 ?' '+ Math.abs(days)+ ' Days ':' ')+time
}

export const setDay=(days:number)=>{
  const day= days>1? 'Next' : days<-1? 'Previous':DaysMapping[days?.toString()] ;
  return day
}

export const formatDates = () => {
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const formatDate=(date:Date, counter:number )=>{
    var newDate=   new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + counter,
      new Date(date).getHours(),
      new Date(date).getMinutes(),
      new Date(date).getSeconds(),
    )
    return moment.tz(newDate,clientProperties?.TIMEZONE?.propertyValue).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)+' ' +moment.tz(clientProperties?.TIMEZONE?.propertyValue)?.zoneAbbr()
  }

  return { formatDate }

}

const getFrequency = (frequency:string, period:string) =>{
  if(frequency=='Daily'){
    return 1
  }
  else if(frequency=='Weekly' ){
    return 2
  }
  else if(frequency=='Monthly' ){
    return 3
  }
  else{
    if(frequency== 'Custom' && period=='Days'){
      return 1
    }
    else if(frequency== 'Custom' && period=='Weeks'){
      return 2
    }
    else if(frequency== 'Custom' && period=='Months'){
      return 3
    }
    else return 1
  }
}
export const createRequestPayload=(formdata:IFormProps)=>{
  let data= {
    "schedulerDetails": {
    "schedulerDetailsId": formdata?.schedulerDetailsId,
    "createdOnDt":formdata?.createdOnDt,
    "createdByUserId":formdata?.createdByUserId,
    "schedulerName": formdata.schedulerName,
    "dailySetting": formdata.frequency=='Custom'&& formdata.period=='Days' && formdata.every  ? formdata.every: formdata.frequency=='Daily' ? '1': null,
    "monthlySetting":formdata.frequency=='Custom'&& formdata.period=='Months' && formdata.every  ? formdata.every: formdata.frequency=='Monthly' ? '1': null,
    "weeklySetting":formdata.frequency=='Custom'&& formdata.period=='Weeks' && formdata.every  ? formdata.every: formdata.frequency=="Weekly"? '1': null,
    "frequency": getFrequency(formdata.frequency, formdata?.period),
    "isCustomFl": formdata.frequency=='Custom'? "1":"0",
    "startDateTime": moment(formdata?.startDateTime).utc().format('YYYY-MM-DDTHH:mm:ss'),
    "endDateTime":  formdata.endDateTime? moment(formdata.endDateTime).utc().format('YYYY-MM-DDTHH:mm:ss'): null,
    "userMapDto": formdata.users.map((user:any)=>{
      return {
        userId:user.userId,
        schedulerUserMapId:user?.schedulerUserMapId || user.userId
      }
    }),
    "otherEmails":formdata.otherEmailId,
    "jobKey":formdata.jobKey, 
    "dayOfWeek":formdata.dayOfWeek, 
    "dayOfMonth":formdata.dayOfMonth
  },
  "planningInput": {
    "branchFilters" : {
      "filters" :formdata?.branch?.length?  [
        {
        "customField": false,
        "fieldId": "clientBranchName",
        "fieldLabelKey": "Hub",
        "filterData": formdata?.branch?.map((branch:any)=>branch.name).toString(),
        "operationLabelKey": "filterOpIn",
        "operationSymbol": "in"
      }]:[]
    },
    "planningProfileId": formdata?.planningProfile?.id,
    "geofenceProfileId": formdata?.territoryProfile !=='No Profile Selected'? formdata?.territoryProfile : undefined,
    "branches": formdata?.branch?.map((branch:any)=>branch.branchId || branch.id),
    "ownedFleet"  : formdata?.continueWithoutOwnedFleetFl=='Y' ? [] : formdata?.ownedFleet && Object.values(formdata.ownedFleet).map((fleet:any)=>{
      return {
        deliveryMediumMasterId: fleet.deliveryMediumMasterId,
        startLocation: fleet?.origin ? fleet?.origin : fleet?.startLocation ? (fleet?.startLocation ):  formdata?.selectedOrigins?.[fleet?.deliveryMediumMasterId] ? formdata?.selectedOrigins?.[fleet?.deliveryMediumMasterId] :  "hub"
      }
    }),
    "continueWithoutOwnedFleetFl": formdata?.continueWithoutOwnedFleetFl=='Y',
    "outsourcedFleet":formdata?.outsourcedFleet && Object.values(formdata.outsourcedFleet).map((fleet:any)=>{
      delete formdata?.selectedTerritories?.undefined;
      const selectedGeoFenceRow:any = formdata?.attachedTerritoriesFinal?.[fleet.index]
      return{
        clientBranchId: fleet.branchId || fleet.clientBranchId,
        clientCoLoaderId: fleet.coloaderId || fleet.clientCoLoaderId,
        fleetTypeId:fleet.fleetTypeId,
        availableFleetCount:fleet.availableFleetCount,
        fleetTypeMasterDTOs:selectedGeoFenceRow && Object.keys(selectedGeoFenceRow?.geofences).length ? 
        Object.keys(selectedGeoFenceRow?.geofences)?.map((key:any)=>{
          return {
            countPerVehicleType: parseInt(selectedGeoFenceRow?.geofences[key]) ,
            geofenceId: key
          }
        })
        :[]
      }
    }),
    "orderStartDay": formdata.orderStartDay,
    "orderStartTime":moment(formdata.orderStartTime)?.format('HH:mm:ss'),
    "orderEndDay": formdata.orderEndDay,
    "orderEndTime": moment(formdata.orderEndTime)?.format('HH:mm:ss'),
    "selectDAFromListFl": formdata?.selectDAFromListFl == 'Y' || formdata?.continueWithoutOwnedFleetFl=='Y' || false,
    "startLocation": "hub",
    "orderFilters": {
    "filters":formdata?.orderDetailsFilter && Object.values(formdata?.orderDetailsFilter)?.map((filter:any)=>{
    return {
        "fieldId":filter.fieldId,
        "operationSymbol":filter.operationSymbol,
        "operationLabelKey": filter.operationLabelKey,
        "fieldLabelKey": filter.fieldLabelKey,
        "labelValue": filter.labelValue,
        "filterData": filter.filterData,
        "customField": filter.customField
    }
    }) ,
    "operationLogic": formdata?.orderFiltersOperationLogic,
    "sortCriteria": []
    },
    "daFilters": {
    "filters": (formdata?.selectDAFromListFl!='Y' && formdata?.DAFilters && Object.values(formdata?.DAFilters)?.length >0 ) ? Object.values(formdata?.DAFilters)?.map((filter:any)=>{
      return {
                      "fieldId":filter.fieldId,
                      "operationSymbol":filter.operationSymbol,
                      "operationLabelKey": filter.operationLabelKey,
                      "fieldLabelKey": filter.fieldLabelKey,
                      "labelValue": filter.labelValue,
                      "filterData": filter.filterData,
                      "customField": filter.customField
      }
      }) : [] ,
      "operationLogic": formdata?.orderFiltersOperationLogic,
      "sortCriteria": []
  }
  }
}

return data
}

export const  transformGeneralDetails =(data:any)=>{
  let transformedData={
    ...data,
    startDateTime: new Date(data?.startDateTime),
    ends:data?.endDateTime ? 'On':'Never',
    endDateTime:data?.endDateTime? new Date(data?.endDateTime): undefined,
  }
  return transformedData
}

export const FrequencyMapping={
  1:'Daily',
  2:'Weekly',
  3:'Monthly'
}
export const DaysMapping={
  "0":'Today',
  "1":'Tomorrow',
  "-1":'Yesterday'
}

export const transformSavedData=(data:any)=>{
  const territoryList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.territoryProfilesList)
  const selectedTerritory= territoryList.filter((territory:any)=> territory.profileId==data?.data.geofenceProfileId)
  const planningProfilesList= useTypedSelector(state=>state.tripPlanningScheduler.form?.data?.planningProfilesList)
  const selectedPlanningProfile= planningProfilesList.filter((profile:any)=> profile.id==data?.data.planningProfileId)
  const transformedData = {...data, ...data?.data,
    users:data.userMapDto.map((user:any)=>{
      return {
        ...user,
        id:user.userId,
        name:user.userName,
        value:user.userId
      }    
  }),
  territoryProfile: {...selectedTerritory, id:selectedTerritory?.[0].profileId, name:selectedTerritory?.[0].profileName, value: selectedTerritory?.[0].profileId},
  planningProfile: {...selectedPlanningProfile,id:selectedPlanningProfile?.[0].profileId, name:selectedPlanningProfile?.[0].profileName, value:selectedPlanningProfile?.[0].profileId }
  }
  return transformedData
}
;

export const BreadCrumbs = () => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const isEditMode= useTypedSelector(state=>state.tripPlanningScheduler.form.isEditMode)

  const breadCrumbOptions = React.useMemo(() => [
    { id: 'Routes', label: "routes" || 'Routes', disabled: true },
    { id: 'TripPlanningSchedulers', label: dynamicLabels?.tripPlanningSchedulers || 'Trip Planning Schedulers', disabled: false },
    { id: 'AddScheduler', label: isEditMode? dynamicLabels?.updateScheduler || 'Update Scheduler': dynamicLabels?.addScheduler || 'Add Scheduler', disabled: true },
  ], [dynamicLabels, isEditMode])

  return { breadCrumbOptions }

}

export const navigationConfirmationPopup = () => {
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const isEditMode= useTypedSelector(state=>state.tripPlanningScheduler.form.isEditMode)
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()

  const handleCancelClick = () => {
    globalPopupDispatch({
      type: '@@globalPopup/SET_PROPS',
      payload: {
        isOpen: true,
        title: dynamicLabels.navigationConfirmation,
        content: dynamicLabels.dataLostWarningMsg,
        footer: (
          <>
            <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => {
              globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
              sendGA('Trip Planning Scheduler',isEditMode? 'Cancel - Update Trip Planning Scheduler Form':'Cancel - Add Trip Planning Scheduler Form');
              hybridRouteTo('tripPlanningSchedulers')
            }}>{dynamicLabels.ok}</IconButton>
            <IconButton iconVariant='icomoon-close' onClick={() => globalPopupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
          </>
        )
      }
    })
  }
  return { handleCancelClick }

}


export const stepperSummarymaker = () => {
  const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
  const formatDate=(date:Date)=>{
    return moment.tz(date,clientProperties?.TIMEZONE?.propertyValue).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm A`)+' ' +moment.tz(clientProperties?.TIMEZONE?.propertyValue)?.zoneAbbr()
  }
  const stepperSummary = (config:any, data:any) => {
    const startDate=formatDate(data.startDateTime)
  const endDate= formatDate(data.endDateTime)
  var refinedStep= config.map((step:any)=>{
    if(step.stepName== "General"){
      return{
        ...step,
        summary:
        `Scheduler Name: ${data.schedulerName} <br>`+
         `Frequency: ${data.frequency}<br>`+
        `Start Time: `+ startDate +`<br>`+
         (data.endDateTime? `End Time: `+ endDate +`<br>` : ``)+
         (data.branch?.length? (dynamicLabels.branch? dynamicLabels.branch+': ':'Branch: ') + data.branch?.length+` Selected<br>` :``)+
        `Planning Profile: `+capitalize(data?.planningProfile?.name || '')+` <br>`+
        `${dynamicLabels.geofence} Profile: `+ capitalize(data.territoryProfileName ? data.territoryProfileName : 'Default')
      }
    }
    else if(step.stepName=='Orders'){
      return{
        ...step,
        summary:
        ``+(((data?.orderStartDay>1 ?'Next ' :data?.orderStartDay < -1? 'Previous ' : DaysMapping[data?.orderStartDay?.toString()] ) + (data?.orderStartDay >1 || data?.orderStartDay<-1 ? Math.abs(data?.orderStartDay)+' Days ': ' ') +`${moment(data.orderStartTime).format('hh:mm A')} <br>`))+
        ``+(((data?.orderEndDay>1 ? 'Next ' : data?.orderEndDay < -1? 'Previous ' : DaysMapping[data?.orderEndDay?.toString()] ) +(data?.orderEndDay >1 || data?.orderEndDay<-1 ? Math.abs(data?.orderEndDay)+' Days ': ' ') +`${moment(data.orderEndTime).format('hh:mm A')}<br>`))+
        (data?.orderDetailsFilter && Object.keys(data.orderDetailsFilter)?.length>0 ? `${Object.keys(data.orderDetailsFilter)?.length} Condition(s)` :'' )
      }
    }
    else if(step.stepName=='Owned Fleet'){
      return{
        ...step,
        summary:
        (data.continueWithoutOwnedFleetFl =='Y'? 'None' : data?.ownedFleet && Object.keys(data?.ownedFleet)?.length > 0 &&  data.selectDAFromListFl=='Y' ?  (Object.keys(data?.ownedFleet)?.length +' '+( dynamicLabels.deliveryMedium?  dynamicLabels.deliveryMedium :' Delivery Associates')+ ` <br>`): '')+
        (data.continueWithoutOwnedFleetFl =='N' && data?.DAFilters && Object.keys(data.DAFilters)?.length>0 ? `${Object.keys(data.DAFilters)?.length} Condition(s)` : data.continueWithoutOwnedFleetFl == 'N' && data?.DAFilters && Object.keys(data.DAFilters)?.length == 0 && data.selectDAFromListFl !='Y' ? 'All' : '' )
      }
    }
    
    else{
      return step
    }
  })
  return refinedStep
  }
  return { stepperSummary }

}

export const  capitalize= (str:string) => {
  return str?.charAt(0).toUpperCase() + str?.substring(1).toLowerCase();
}
