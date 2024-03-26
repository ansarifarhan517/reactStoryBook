import { IShipperData } from './ShipperProperties.model';
import { IMultiselectEntity } from '../../../../utils/mongo/interfaces'
import { isEmpty } from '../../../../utils/helper';

export const generateShipperFormData = (data: IShipperData, priorityData:any, serviceTypes:any) => {
  const {
    priority, rateChartId, rateChartName, clientProperties, clientReferenceMasterDTOList, serviceAreaProfileId, serviceAreaProfileName, calendarId, holidayCalendar
  } = data; 
 const selectedPriority=  priorityData?.find((prop:any)=> prop.clientRefMasterCd== priority);

 const  priorityDatas= {
  id: priority,
  name: selectedPriority?.clientRefMasterDesc || priority,
};
const rateChartNameData={
  id: rateChartId,
  name: rateChartName,
};

const serviceAreaProfileNameData={
  id: serviceAreaProfileId || serviceAreaProfileName,
  name: serviceAreaProfileName
};

const holidayCalendarData = {
  calendarId: calendarId,
  id: calendarId,
  name: holidayCalendar
}

const getServices= ()=>{
  let serviceType:IMultiselectEntity[]= [];
  clientReferenceMasterDTOList?.map((service:IMultiselectEntity)=>{
    let selectedService= serviceTypes?.filter((ser:any)=> (ser.clientRefMasterCd).toUpperCase() == (service.clientRefMasterCd).toUpperCase())
      if(selectedService && selectedService.length){
        serviceType.push({...service, id: selectedService[0]?.clientRefMasterId, name: service?.clientRefMasterDesc})
      }
    })
  return serviceType;
}
const serviceTypeData= getServices();
  return {
    ...data,
    ...(priority!==""? {priority: priorityDatas}: null),
    ...(rateChartId && rateChartName ? {rateChartName: rateChartNameData}: null),
    ...(serviceTypeData && serviceTypeData?.length ? {serviceType: serviceTypeData}: []),
    ...(serviceAreaProfileId || serviceAreaProfileName ? {serviceAreaProfileName: serviceAreaProfileNameData}: null),
    orderConversion:(clientProperties.find((property:any) => property.propertyKey=='BOOKINGTOORDER')?.propertyValue) == 'FALSE' || (clientProperties.find((property:any) => property.propertyKey=='BOOKINGTOORDER')?.propertyValue) === 'N' ? 'Manual'  : 'Automatic',
    orderReAttemps: clientProperties.find((property:any) => property.propertyKey=='MAXRETRYATTEMPTS')?.propertyValue,
    holidayCalendar: !isEmpty(holidayCalendarData) ? holidayCalendarData : null
   }
}