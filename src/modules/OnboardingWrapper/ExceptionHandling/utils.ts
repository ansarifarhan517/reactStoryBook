import { IOrderExceptionsListData, IRowData } from "./ExceptionHandling.models";
import moment from 'moment-timezone'
import store from '../../../utils/redux/store'

export const addIgnoreSelection = (data: IOrderExceptionsListData) => {

    const { clientBranchId, otherCount, totalCount, results } = data;

    results.forEach((row: IRowData) => {
        const rowObj = row;
        if (rowObj?.exceptionStatus === "CLOSED" || rowObj?.exceptionStatus === "REJECTED") {
            rowObj.ignoreSelectAll = true
        }
        return rowObj
    })
    return { clientBranchId, otherCount, totalCount, results }
}

export const isEmpty = (obj: object) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
export const getFormattedDate = (dateVal: string,_timezone:string) => {
    const clientProperties = store.getState().clientProperties;
    const timezoneMode = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezoneMode']) : '';
    
    let timeFormat = "";
    if(timezoneMode == "LOCATIONTIMEZONE"){
      timeFormat = "hh:mm A z"
    } else{
      timeFormat = "hh:mm A"
    }
    if(_timezone){
      _timezone = timezoneMode === "LOCATIONTIMEZONE" ? _timezone : JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']):_timezone;
      return moment.tz(dateVal,_timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`);
    } else{
      if(timezoneMode == "LOCATIONTIMEZONE"){
        let timezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : ''
        return moment.tz(dateVal,timezone).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`);
      } else{
        return moment.tz(dateVal,`${clientProperties?.TIMEZONE
          ?.propertyValue}`).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`);
      }
    }
  } 
export const capitalize = (str: string) => {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
}