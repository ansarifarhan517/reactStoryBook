
import moment from 'moment-timezone'
import store from '../../../utils/redux/store'

const factors = {
  "DIMENSION": {
      "CM": 1,
      "INCHES": 0.393701,
      "FEET": 0.0328084
  },
  "SPEED": {
      "KMPH": 1,
      "MPH": 0.621371
  },
  "DISTANCE": {
      "KM": 1,
      "MILE": 0.621371
  },
  "VOLUME": {
      "CUBIC_CM": 1,
      "CUBIC_INCHES": 0.0610237,
      "CUBIC FEET": 0.00003531447,
      "CUBIC_FEET": 0.00003531447,
      "CC":1
  },
  "WEIGHT": {
      "KG": 1,
      "LB": 0.4535
  }
}
export const getUrlVars = (qs: string) => {
  qs = qs.split("+").join(" ")

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g

  while ((tokens = re.exec(qs))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}

export const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, "")
}

export const convertArrayToObject = (array: any, key: string) => {
  const initialValue = {}
  return array.reduce((obj: any, item: any) => {
    return {
      ...obj,
      [item[key]]: item,
    }
  }, initialValue)
}

export const toCapitalized = (str: string) => {
  return str ? str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toUpperCase() : letter.toLowerCase();
  }).replace(/\s+/g, '') : '';
};

export const getNoTZFormatOfDate = (dateObj: Date) => {
  if (!(dateObj instanceof Date)) {
    dateObj = new Date()
  }
  const clientProperties = store.getState().clientProperties;
  let cpDateFormat = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() || "DD/MM/YYYY"
  return moment(dateObj).format(`${cpDateFormat} HH:mm`)
}

export const getFormattedDate = (dateVal: string,_timezone:string) => {
  // const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
  
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
      return moment.tz(dateVal,`${clientProperties?.TIMEZONE?.propertyValue}`).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`);
    }

  }

  
} 

export const getUTCDateTZ = (dateVal: string, dateFormatFrom?: string, timezone?: string) => {
  const clientProperties = store.getState().clientProperties
  const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
  if (dateFormatFrom && dateFormatFrom.length > 0 && timezone && timezone.length > 0) {
    return moment.tz(dateVal, dateFormatFrom, timezone).utc();
  } else if (dateFormatFrom && dateFormatFrom.length > 0 && (!timezone || timezone.length <= 0)) {
    return moment.tz(dateVal, dateFormatFrom, userTimezone).utc();
  } else if (timezone && timezone.length > 0 && (!dateFormatFrom || dateFormatFrom.length <= 0)) {
    return moment.tz(dateVal, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' ' + 'HH:mm', timezone).utc();
  } else if ((!dateFormatFrom || dateFormatFrom.length <= 0) && (!timezone || timezone.length <= 0) && userTimezone) {
    return moment.tz(dateVal, clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() + ' ' + 'HH:mm', userTimezone).utc();
  } else {
    return undefined;
  }
}

export const convertUnit = (val: number, type: string) => {
  if (type === "WEIGHT") {
    let properties = store.getState().clientProperties?.WEIGHT?.propertyValue?.toUpperCase()
    return (val / factors[type][properties]).toFixed(2);
  } else {
    let properties = store.getState().clientProperties?.VOLUME?.propertyValue?.toUpperCase()
    return (val * factors[type][properties]).toFixed(2);
  }

}