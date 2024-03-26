import moment from "moment";
import { IDropdown } from "./ServiceTypeConfiguration.models";
import { IFilterOptions } from "ui-library";

export const reverseTimeZone = (timeString: string, timezone: string) => {

  let hour = timeString.split(":")[0];
  let minutes = timeString.split(":")[1];
  let offset = moment(new Date().setHours(Number(hour), Number(minutes), 0))?.tz(timezone)?.utcOffset()
  if (offset === undefined) {
    return 0;
  } else {
    return offset;
  }
}

export const stringToTime = (timeString: string, clientProperties: any) => {
  if(timeString){
    const timezone = clientProperties?.TIMEZONE?.propertyValue ? clientProperties?.TIMEZONE?.propertyValue : '';
    let hour = Number(timeString.split(":")[0]);
    let minutes = Number(timeString.split(":")[1]);
  
    let offset = reverseTimeZone(timeString, timezone);
    if (offset / 60 !== 0) {
      minutes = minutes + offset / 60 * 60
    } else if (offset === 0) {
      minutes = 0;
      hour = 0;
    }
    else {
      hour = hour + Math.floor(offset) / 60
    }
  
    let d = new Date();
    let utcDate = new Date(d.getFullYear(), d.getMonth(), d.getDay(), hour, minutes, 0, 0)
    return new Date(moment.utc(utcDate).tz(timezone).format());
  }
  else return ''
}

export const convertUTCTimeToLocalTime = (utcTimeString:string, returnFormatted = true):string | Date => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcTime = moment.utc(utcTimeString, "HH:mm");
  const localTime = utcTime.tz(userTimeZone);
  
  if (returnFormatted) {
    // Format the time in AM/PM format
    const formattedTime = localTime.format("hh:mm A");
    return formattedTime;
  } else {
    // Return the JavaScript Date object
    return localTime.toDate();
  }
};

export const preparePayload = (formInputs: any) => {
  const {
    name,
    description,
    considerHolidays,
    serviceStartTime,
    serviceEndTime,
    cutOffTime,
    deliveryBeforeTime,
    deliverSLA,
    deliverSLAUnit,
    branchId,
    serviceDays,
    deliveryType,
    branchMovement,
    autoAllocate
  } = formInputs;
  const payload = {
    name: name,
    description: description,
    considerHolidays: considerHolidays ? considerHolidays : 'N',
    serviceStartTime: serviceStartTime ? moment(serviceStartTime, "HH:mm").utc().format("HH:mm:ss"): null,
    serviceEndTime: serviceEndTime ? moment(serviceEndTime, "HH:mm").utc().format("HH:mm:ss") : null,
    cutOffTime: cutOffTime ? moment(cutOffTime, "HH:mm").utc().format("HH:mm:ss"): null,
    deliveryBeforeTime: deliveryBeforeTime ? moment(deliveryBeforeTime, "HH:mm").utc().format("HH:mm:ss"): null,
    deliverSLA: deliverSLA ? parseInt(deliverSLA): null,
    deliverSLAUnit: deliverSLAUnit ? deliverSLAUnit.clientRefMasterCd: 'Mins',
    branchId: branchId && branchId.length > 0 ? branchId.map((branch: IDropdown) => branch.branchId) : [],
    serviceDays: serviceDays && serviceDays.length > 0 ? (serviceDays.map((serviceDay: IDropdown) => serviceDay.clientRefMasterCd)).toString() : '',
    deliveryType: deliveryType && deliveryType.length > 0 ? deliveryType.map((type: IDropdown) => type.clientRefMasterId) : [],
    branchMovement: branchMovement,
    autoAllocate: autoAllocate
  };
  return payload;
};

export const getSearchText = (filterOptions: IFilterOptions) => {
  const searchByQueries = filterOptions?.searchBy?.split("#@#");
  let searchText = filterOptions?.searchText;
  let searchTextQueries = searchText?.split("#@#");
  const indexOfServiceStartTime = searchByQueries?.indexOf("serviceStartTime");
  const indexOfServiceEndTime = searchByQueries?.indexOf("serviceEndTime");
  const indexOfCutOffTime = searchByQueries?.indexOf("cutOffTime");
  const indexOfDeliveryBeforeTime = searchByQueries?.indexOf("deliveryBeforeTime");

  if (searchTextQueries && indexOfServiceStartTime !== undefined && indexOfServiceStartTime !== -1) {
    const breakstartTime = searchTextQueries?.[indexOfServiceStartTime];
    searchTextQueries[indexOfServiceStartTime] = moment(breakstartTime, "HH:mm").utc().format("HH:mm:ss");
  }
  if (searchTextQueries && indexOfServiceEndTime !== undefined && indexOfServiceEndTime !== -1) {
      const breakstartTime = searchTextQueries?.[indexOfServiceEndTime];
      searchTextQueries[indexOfServiceEndTime] = moment(breakstartTime, "HH:mm").utc().format("HH:mm:ss");
  }
  if (searchTextQueries && indexOfCutOffTime !== undefined && indexOfCutOffTime !== -1) {
      const breakstartTime = searchTextQueries?.[indexOfCutOffTime];
      searchTextQueries[indexOfCutOffTime] = moment(breakstartTime, "HH:mm").utc().format("HH:mm:ss");
  }
  if (searchTextQueries && indexOfDeliveryBeforeTime !== undefined && indexOfDeliveryBeforeTime !== -1) {
      const breakstartTime = searchTextQueries?.[indexOfDeliveryBeforeTime];
      searchTextQueries[indexOfDeliveryBeforeTime] = moment(breakstartTime, "HH:mm").utc().format("HH:mm:ss");
  }
  searchText = searchTextQueries ? searchTextQueries?.join("#@#") : "";
  return searchText;
}