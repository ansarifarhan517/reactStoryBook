import store from './redux/store';
import moment from 'moment';
import { IAdditionalWebhookRecord, tConversionType } from './common.interface';
import { IDeliveryAssociateDevices } from '../modules/Analytics/DriverAnalytics/DriverComplianceAnalytics/DriverComplianceAnalytics.actions';
import { IOperationTimingsListDataPayload } from "../modules/OnboardingWrapper/BranchConfiguration/BranchConfiguration.models";
import { ITriggerEventsStructure } from '../modules/OnboardingWrapper/CustomForms/CustomForms.models';

export const getKPInameBySlug = (KPI: string | undefined) => {
  const kpiList = store.getState().analytics.driverComplianceAnalytics.kpiList;
  return kpiList.find((kpi: { clientRefMasterCd: string }) => {
    return kpi.clientRefMasterCd === KPI;
  });
};

export const getKPICodeByCode = (name: string) => {
  const kpiList = store.getState().analytics.driverComplianceAnalytics.kpiList;
  return kpiList.find((kpi: { clientRefMasterDesc: string }) => {
    return kpi.clientRefMasterDesc === name;
  });
};

export const addSign = (value: number) => {
  let result = '';
  if (Math.sign(value) === 1) {
    result = '+' + value;
    return result;
  } else if (Math.sign(value) === -1) {
    result = '-' + Math.abs(value);
    return result;
  } else {
    return '0';
  }
};

const getOrdersCompliance = (
  ordersComplianceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = ordersComplianceData;

  let result = {
    title: dynamicLabels.ordersCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.orderDeliveredCount,
        value: linkedGraphData.orderDeliveredCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.orderAttemptedPickupCount,
        value: linkedGraphData.orderAttemptedPickupCount,
        color: colorCodes.red,
        active: true,
      },
      {
        name: dynamicLabels.orderAttemptedDeliveredCount,
        value: linkedGraphData.orderAttemptedDeliveredCount,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.orderCancelledCount,
        value: linkedGraphData.orderCancelledCount,
        color: colorCodes.legendRed,
        active: true,
      },
    ],
  };
  return result;
};

const getCheckinCompliance = (
  checkinComplainceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = checkinComplainceData;

  let result = {
    title: dynamicLabels.checkInOrdersCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.checkinWithinGeofenceCount,
        value: linkedGraphData.checkinWithinGeofenceCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.checkinOutsideGeofenceCount,
        value: linkedGraphData.checkinOutsideGeofenceCount,
        color: colorCodes.red,
        active: true,
      },
    ],
  };
  return result;
};

const getCheckOutCompliance = (
  checkOutComplainceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = checkOutComplainceData;

  let result = {
    title: dynamicLabels.checkoutOrdersCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.checkoutWithinGeofenceCount,
        value: linkedGraphData.checkoutWithinGeofenceCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.checkoutOutsideGeofenceCount,
        value: linkedGraphData.checkoutOutsideGeofenceCount,
        color: colorCodes.red,
        active: true,
      },
    ],
  };
  return result;
};

const getDeliveryTimeCompliance = (
  deliveryTimeComplianceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = deliveryTimeComplianceData;

  let result = {
    title: dynamicLabels.onTimeDeliveryCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.pickupOnTimeCount,
        value: linkedGraphData.pickupOnTimeCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.pickupDelayedCount,
        value: linkedGraphData.pickupDelayedCount,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.deliveryOnTimeCount,
        value: linkedGraphData.deliveryOnTimeCount,
        color: colorCodes.red,
        active: true,
      },
      {
        name: dynamicLabels.deliveryDelayedCount,
        value: linkedGraphData.deliveryDelayedCount,
        color: colorCodes.legendBlue,
        active: true,
      },
    ],
  };
  return result;
};

const getDistanceCompliance = (
  distanceComplianceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = distanceComplianceData;

  let result = {
    title: dynamicLabels.distanceCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.pickupDistanceCompliantCount,
        value: linkedGraphData.pickupDistanceCompliantCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.deliveryDistanceCompliantCount,
        value: linkedGraphData.deliveryDistanceCompliantCount,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.pickupDistanceNotCompliantCount,
        value: linkedGraphData.pickupDistanceNotCompliantCount,
        color: colorCodes.red,
        active: true,
      },
      {
        name: dynamicLabels.deliveryDistanceNotCompliantCount,
        value: linkedGraphData.deliveryDistanceNotCompliantCount,
        color: colorCodes.legendBlue,
        active: true,
      },
    ],
  };
  return result;
};

const getServiceTimeCompliance = (
  serviceTimeComplianceData: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCount,
    incOrDecPercentage,
    linkedGraphData,
  } = serviceTimeComplianceData;

  let result = {
    title: dynamicLabels.serviceTimeCompliance,
    total: ordersCount,
    fulfilment: addSign(incOrDecPercentage),
    selected: false,
    payload: [
      {
        name: dynamicLabels.pickupServiceTimeCompliantCount,
        value: linkedGraphData.pickupServiceTimeCompliantCount,
        color: colorCodes.lightBlue,
        active: true,
      },
      {
        name: dynamicLabels.deliveryServiceTimeCompliantCount,
        value: linkedGraphData.deliveryServiceTimeCompliantCount,
        color: colorCodes.yellow,
        active: true,
      },
      {
        name: dynamicLabels.pickupServiceTimeNotCompliantCount,
        value: linkedGraphData.pickupServiceTimeNotCompliantCount,
        color: colorCodes.red,
        active: true,
      },
      {
        name: dynamicLabels.deliveryServiceTimeNotCompliantCount,
        value: linkedGraphData.deliveryServiceTimeNotCompliantCount,
        color: colorCodes.legendBlue,
        active: true,
      },
    ],
  };
  return result;
};

export const getTotalOrdersComplaince = (
  totalOrdersReports: any,
  dynamicLabels: any,
  colorCodes: any
) => {
  const {
    ordersCompliance,
    checkInOrdersCompliance,
    checkoutOrdersCompliance,
    onTimeDeliveryCompliance,
    distanceCompliance,
    serviceTimeCompliance,
  } = totalOrdersReports;

  let data = [];

  let ordersComplianceData = getOrdersCompliance(
    ordersCompliance,
    dynamicLabels,
    colorCodes
  );
  let checkInOrdersComplianceData = getCheckinCompliance(
    checkInOrdersCompliance,
    dynamicLabels,
    colorCodes
  );
  let checkoutOrdersComplianceData = getCheckOutCompliance(
    checkoutOrdersCompliance,
    dynamicLabels,
    colorCodes
  );
  let onTimeDeliveryComplianceData = getDeliveryTimeCompliance(
    onTimeDeliveryCompliance,
    dynamicLabels,
    colorCodes
  );
  let distanceComplianceData = getDistanceCompliance(
    distanceCompliance,
    dynamicLabels,
    colorCodes
  );
  let serviceTimeComplianceData = getServiceTimeCompliance(
    serviceTimeCompliance,
    dynamicLabels,
    colorCodes
  );

  data = [
    ordersComplianceData,
    checkInOrdersComplianceData,
    checkoutOrdersComplianceData,
    onTimeDeliveryComplianceData,
    distanceComplianceData,
    serviceTimeComplianceData,
  ];

  return data;
};

export const getUniqueArray = (array: any[]) => {
  return array.filter(
    (obj: { value: any }, pos: any, arr: any[]) =>
      arr.map((mapObj) => mapObj.value).indexOf(obj.value) === pos
  );
};
export const twoDigitStringFormatter = (str: string) => {
  const splittedString = str.split('.');
  let decimalSlicing = splittedString[1] ? splittedString[1] : '';
  if (decimalSlicing && decimalSlicing.length > 2) {
    decimalSlicing = decimalSlicing.slice(0, 2);
    return `${splittedString[0]}.${decimalSlicing}`;
  }
  return str;
};
export const formatStringTillLength = (
  requestedLength: number,
  str: string
) => {
  const charArray = Array.from(str);
  let finalString = str;
  // if array is length is greater then asked then trim string till requested length and return
  if (charArray.length > requestedLength) {
    finalString = str.slice(0, requestedLength);
  }
  return finalString;
};

export const getFormattedDate = (dateVal: number, dateFormat: string) => {
  return moment(dateVal).format(`${dateFormat} hh:mm A`);
}

export const getFormattedDateWithLocal = (dateVal: number, dateFormat: string) => {
  const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
  return moment.tz(dateVal, userTimezone).utc().format(`${dateFormat} hh:mm A z`)

}

export const getFormattedDateWithSeconds = (
  dateVal: number,
  dateFormat: string
) => {
  return moment(dateVal).format(`${dateFormat} hh:mm:ss`);
};

export const isFloat = (n: number) => {
  return n % 1 !== 0;
};

const recursiveCall = (obj: any) => {
  return deepCopy(obj);
};

export const deepCopy = (obj: any) => {
  let retObj: any = {};
  const _assignProps = (obj: any, keyIndex: any, retObj: any) => {
    const subType = Object.prototype.toString.call(obj[keyIndex]);
    if (subType === '[object Object]' || subType === '[object Array]') {
      retObj[keyIndex] = recursiveCall(obj[keyIndex]);
    } else {
      retObj[keyIndex] = obj[keyIndex];
    }
  };

  if (Object.prototype.toString.call(obj) === '[object Object]') {
    retObj = {};
    for (const key in obj) {
      _assignProps(obj, key, retObj);
    }
  } else if (Object.prototype.toString.call(obj) === '[object Array]') {
    retObj = [];
    for (let i = 0; i < obj.length; i++) {
      _assignProps(obj, i, retObj);
    }
  }

  return retObj;
};

export const convertDateTimeZone = (
  date: Date,
  timeZone: string,
  dateFormat: string
) => {
  return moment.utc(date).tz(timeZone).format(dateFormat);
};

export const convertEpochToDateTimeZone = (date: string) => {
  let dates = date.split('$@$');

  let startDate = moment(Number(dates[0])).format('YYYY-MM-DDT') + '00:00:00Z';
  let endDate = moment(Number(dates[1])).format('YYYY-MM-DDT') + '23:59:59Z';

  let searchDate = startDate + '$@$' + endDate;
  return searchDate;
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


export const getTimezoneDate = function (utcDate: Date, timezone?: string) {
  const userTimezone = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
  if (timezone) {
    return moment.utc(utcDate).tz(timezone);
  } else {
    return moment.utc(utcDate).tz(userTimezone);
  }
}

export const dateFormatterWithLocalTimeZone = (date: Date) => {
  const timeZone = JSON.parse(localStorage.getItem('userAccessInfo') || '""')
    .timezone;
  return moment.tz(date, timeZone).utc();
};

export const convertArrayToObject = (array: any, key = 'id') => {
  const initialValue = {};
  if (Array.isArray(array)) {
    return array.reduce((obj: any, item: any) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  }
  return array;
};
export const metricsConversion = (
  value: number,
  type: tConversionType,
  conversionFactor: any
) => {
  if (type === 'GET') {
    return value * conversionFactor;
  } else {
    return value / conversionFactor;
  }
};

export const emailIsValid = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export function isTimestamp(n: any) {
  const parsed = parseFloat(n);
  return !Number.isNaN(parsed) && Number.isFinite(parsed) && /^\d+\.?\d+$/.test(n);
}
export const generateRandomID = () => {
  const date = new Date()
  var components = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ];
  const no = parseInt(components.join(""));
  const num = ("0" + (Number(no).toString(16))).toLowerCase()
  const ary = num.split('')
  let currentIndex = ary.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = ary[currentIndex];
    ary[currentIndex] = ary[randomIndex];
    ary[randomIndex] = temporaryValue;
  }

  let id = ary.join('').slice(-6)
  const a = Math.random()
  let random = Math.floor(a * 10)
  const newRandom = random.toString()
  id = id + newRandom;
  return id
}
export const handleDeviceSearch = (filterOptions: any) => {
  const {
    results,
    clientBranchId,
    otherCount,
    totalCount,
  } = store.getState().analytics.driverComplianceAnalytics.deliveryAssociateDeviceList;

  const devices: Array<IDeliveryAssociateDevices> = Array.from(results);
  let result = [];

  if (!filterOptions.searchBy.includes('#@#')) {
    result = devices.filter((device: IDeliveryAssociateDevices) => {
      console.log(device)
      if (device[filterOptions.searchBy]) {
        return device[filterOptions.searchBy] == filterOptions.searchText;
      } else if (filterOptions.searchText == '1') {
        return false;
      } else {
        return true;
      }
    });
  } else {
    let searchBy = filterOptions.searchBy.split('#@#');
    let searchText = filterOptions.searchText.split('#@#');
    result = devices.filter((device: IDeliveryAssociateDevices) => {
      let searchResult = [];
      searchResult = searchBy.map((column: string, index: number) => {
        if (device[column]) {
          return device[column] == searchText[index];
        } else if (searchText[index] == '1') {
          return false;
        } else {
          return true;
        }
      });
      return searchResult.every(Boolean);
    });
  }
  let deviceList = { clientBranchId, otherCount, results: result, totalCount };
  return deviceList;
};
export const roundingOfDigit = (num: number, roundingOffDigit: number) => {
  return +(Math.round(+(num + "e+" + roundingOffDigit)) + "e-" + roundingOffDigit);
}


export const handleOperationTimingSearch = (filterOptions: any) => {
  const operationTimings = store.getState().branchConfiguration.operationTimingsClone;

  let result: IOperationTimingsListDataPayload[] = [];

  if (!filterOptions.searchBy.includes('#@#')) {
    result = operationTimings.filter((operationTiming: IOperationTimingsListDataPayload) => {
      if (filterOptions.searchBy === "daysOfWeek") {
        if (Object.keys(operationTiming).includes('daysOfWeek')) {
          return operationTiming['daysOfWeek'].toLowerCase() === filterOptions.searchText.toLowerCase()
        }
        return operationTiming[filterOptions.searchBy].includes(filterOptions.searchText)
      } else {
        return operationTiming[filterOptions.searchBy] == filterOptions.searchText;
      }
    });
  } else {
    let searchBy = filterOptions.searchBy.split('#@#');
    let searchText = filterOptions.searchText.split('#@#');

    result = operationTimings.filter((operationTiming: IOperationTimingsListDataPayload) => {
      let searchResult = [];
      searchResult = searchBy.map((column: string, index: number) => {
        if (searchBy.includes('daysOfWeek')) {
          if (operationTiming[column] === 'daysOfWeek') {
            return operationTiming[column]['daysOfWeek'].toLowerCase() === searchText[index].toLowerCase()
          }
          return operationTiming[column].includes(searchText[index]);
        } else {
          return operationTiming[column] === searchText[index]
        }
      });
      return searchResult.every(Boolean);
    });
  }
  return result;
}


type ArrayElem<A> = A extends Array<infer Elem> ? Elem : never

export const correctArrayType = <T>(array: T): Array<ArrayElem<T>> => {
  return array as any
}

export const closeSideMenu = () => {
  const isCollapsed = document.getElementsByClassName('onboarding-sidebar')[0].classList.contains('sidebar-collapsed');

  if (!isCollapsed) {
    const el = document.getElementsByClassName('sidebar-collapse')[0] as HTMLElement;
    el.click();
  }

  return false;

}

export const moveOrderCreatedAlertOnTopOfArray = (arr: any) => {
  let orderCreatedObj = arr.find((obj: any) => obj.alertName === "MILECREATEORDER")
  if (orderCreatedObj) {
    let arrayWithoutCreatedOrder = arr.filter((current: any) => {
      return current.alertName !== "MILECREATEORDER"
    })
    arrayWithoutCreatedOrder.splice(0, 0, orderCreatedObj);
    return arrayWithoutCreatedOrder

  }
}

export const openSideMenu = () => {
  const isCollapsed = document.getElementsByClassName('onboarding-sidebar')[0].classList.contains('sidebar-collapsed');

  if (isCollapsed) {
    const el = document.getElementsByClassName('sidebar-collapse')[0] as HTMLElement;
    el.click();
  }

}

export const toCapitalized = (str: string) => {
  return str ? str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toUpperCase() : letter.toLowerCase();
  }).replace(/\s+/g, '') : '';
};


export const handleLoadMultiplierSearch = (filterOptions: any) => {
  const operationTimings = store.getState().branchConfiguration.loadMultiplierData;

  let result: IOperationTimingsListDataPayload[] = [];

  if (!filterOptions.searchBy.includes('#@#')) {
    result = operationTimings.filter((operationTiming: IOperationTimingsListDataPayload) => {
      if (filterOptions.searchBy === "daysOfWeek") {
        if (Object.keys(operationTiming).includes('daysOfWeek')) {
          return operationTiming['daysOfWeek'].toLowerCase() === filterOptions.searchText.toLowerCase()
        }
        return operationTiming[filterOptions.searchBy].includes(filterOptions.searchText)
      } else {
        return operationTiming[filterOptions.searchBy] == filterOptions.searchText;
      }
    });
  } else {
    let searchBy = filterOptions.searchBy.split('#@#');
    let searchText = filterOptions.searchText.split('#@#');

    result = operationTimings.filter((operationTiming: IOperationTimingsListDataPayload) => {
      let searchResult = [];
      searchResult = searchBy.map((column: string, index: number) => {
        if (searchBy.includes('daysOfWeek')) {
          if (operationTiming[column] === 'daysOfWeek') {
            return operationTiming[column]['daysOfWeek'].toLowerCase() === searchText[index].toLowerCase()
          }
          return operationTiming[column].includes(searchText[index]);
        } else {
          return operationTiming[column] === searchText[index]
        }
      });
      return searchResult.every(Boolean);
    });
  }
  return result;
}

export const handleCustomColumnSort = (sortOptions: any) => {
  if (sortOptions?.sortBy?.includes('cf_') && !sortOptions?.sortBy?.includes('0_CUSTOM_cf_')) {
    sortOptions.sortBy = '0_CUSTOM_' + sortOptions.sortBy
  }
  return sortOptions
}

export const findPartialKeyName = (obj: ITriggerEventsStructure, partialKey: string) => {
  return Object.keys(obj).find((key) => key.includes(partialKey));
}

export const isEmpty = (obj: object) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}


export const addAdditionalHeader = (existingHeaders: IAdditionalWebhookRecord[]) => {
  const currentTimeStamp = new Date().getTime();
  const additionalWebhook = {
    [`Header-${currentTimeStamp}`]: {
      id: `Header-${currentTimeStamp}`,
      name: `Header-${currentTimeStamp}`,
      class: `Header-${currentTimeStamp}`,
    },
    [`Value-${currentTimeStamp}`]: {
      id: `Value-${currentTimeStamp}`,
      name: `Value-${currentTimeStamp}`,
      class: `Value-${currentTimeStamp}`,
    }
  }

  return [...existingHeaders, ...[additionalWebhook]]
}

export const hasDuplicates = (array: Array<any>) => {
  return (new Set(array)).size !== array.length;
}

export const getKeyByValue = (object: object, value: string) => {
  return Object.keys(object).filter(key => object[key].toString().toLowerCase() === value);
}

export const getUniqueErrorKeys = (list: string[], formInputs: Record<string, any>, uniqueKey: string) => {
  const keys:string[] = [];
  const errorInputs = toFindDuplicates(list).map((obj) => {
    keys.push(...getKeyByValue(formInputs, obj).filter((key) => key.includes(uniqueKey)));
    return keys;
  }).flat(Infinity).filter((v, i, a) => a.indexOf(v) === i);
  return errorInputs;
}

export const toFindDuplicates = (array: Array<any>) => {
  const uniqueElements = new Set(array);
  const filteredElements = array.filter(item => {
      if (uniqueElements.has(item)) {
          uniqueElements.delete(item);
      } else {
          return item;
      }
  });
  return filteredElements;
}


export function findAllDuplicateIndices(arr) {
  const encountered : any  = {};
  const duplicateIndices : any = [];

  arr.forEach((item, index) => {
    if (!encountered[item]) {
      encountered[item] = [index];
    } else {
      encountered[item].push(index);
    }
  });

  for (const key in encountered) {
    if (encountered[key].length > 1) {
      duplicateIndices.push(...encountered[key]);
    }
  }

  return duplicateIndices;
}
