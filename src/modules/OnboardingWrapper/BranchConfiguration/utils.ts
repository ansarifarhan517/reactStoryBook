import { sendGA } from "../../../utils/ga";
import store from "../../../utils/redux/store";
import moment from "moment";


export const preparePayload = (formInputs: any, position: any, operationTimings: any, managerDetails: any) => {
  const formStructure = store.getState().branchConfiguration.form.structure;
  const zones = store.getState().branchConfiguration.form.branchZones;
  
  const load = formInputs?.loadMultipliers?.map((obj:any) => {
      let startTime = convertStringInTZtoUTC(obj?.startTime)
      let endTime = convertStringInTZtoUTC(obj?.endTime)
      return {
        ...obj,
        startTime:startTime,
        endTime: endTime
      }
    })

  const superClientBranchId = JSON.parse(localStorage.getItem('userAccessInfo') || '{}').clientBranchId
  const {
    autoAllocateFl,
    adminContactName,
    bankAccountNo,
    minBalance,
    minWithdrawableAmount,
    bankName,
    walletId,
    clientId,
    vendorName,
    description,
    division,
    rank,
    loadingTime,
    walletEnabled,
    name,
    radiusInKms,
    skillSet,
    superClientParentBranchId,
    branchTimeZone,
    unloadingTime,
    branchDescription,
    mobileNumber,
    whatsappOptin,
    emailAddress,
    apartment,
    streetName,
    landmark,
    subClientParentBranchId,
    locality,
    city,
    state,
    country,
    zipCode,
    officeNumber,
    deliveryMediumAutoAllocateFl,
    operationalSupportPhoneNumber,
    operationalSupportEmailID,
    customerSupportPhoneNumber,
    customerSupportEmailID,
    customFieldsEntity,
    shortName,
    movementType,
    loadingStartTimeWindow,
    loadingEndTimeWindow,
    unloadingStartTimeWindow,
    unloadingEndTimeWindow,
    isBackToHub,
    preparationTime,
    pickUpTime,
    acceptOrderOnHolidaysFl,
    holidayCalendar,
    cashTransactionFl,
    minOrderValue,
    maxOrderValue,
    discardValue,
    pincodeVerificationFl,
    signatureVerificationFl,
    additionalPickupNotes,
    signerInfo,
    // loadMultipliers
  } = formInputs;
  


  const payload = {
    adminContactName: adminContactName,
    autoAllocateFl: autoAllocateFl ? autoAllocateFl : 'N',
    deliveryMediumAutoAllocateFl: deliveryMediumAutoAllocateFl ? deliveryMediumAutoAllocateFl : 'N',
    isOwnBranchFl: 'N',
    isHubFl: 'Y',
    clientBranchAccountDTO:
      walletEnabled === 'Yes' ?
        {
          bankAccountNo: Number(bankAccountNo),
          bankName: bankName,
          minBalance: Number(minBalance),
          minWithdrawableAmount: Number(minWithdrawableAmount),
          walletEnabled: true,
          walletId: walletId,
        } : {
          walletEnabled: false,
        },
    clientId: clientId.id,
    branchName: clientId.name,
    isSuperFl: clientId.isSuperFl,
    coloaderId: vendorName !== undefined ? clientId.isSuperFl === 'Y' ? vendorName !== undefined && Object.keys(vendorName).length > 0 ? vendorName.clientCoLoaderId : null : null : null,
    coloaderName: vendorName !== undefined ? clientId.isSuperFl === 'Y' ? vendorName !== undefined && Object.keys(vendorName).length > 0 ? vendorName.name : null : null : null,
    description: description,
    division: division,
    rank: rank,
    lat: position && position[0],
    lng: position && position[1],
    modelType: JSON.parse(localStorage.getItem('userAccessInfo') || '{}').modelType,
    name: name && name.trim(),
    radiusInKms: radiusInKms,
    geoFenceRadius: radiusInKms,
    shortName: shortName,
    skillSet: clientId.isSuperFl !== undefined ? clientId.isSuperFl === 'Y' ? skillSet && skillSet.length > 0 ? skillSet
      .map((skill: any) => {
        if(skill && skill.clientRefMasterCd){
          return skill.clientRefMasterCd;
        }
      })
      .join() : "" : "" : '',
    superClientParentBranchId: subClientParentBranchId?.name === "Self" ? superClientBranchId : clientId.isSuperFl === 'Y' ? superClientParentBranchId !== undefined && Object.keys(superClientParentBranchId).length > 0 ? superClientParentBranchId?.id : null : null,
    subClientParentBranchId: clientId.isSuperFl === 'N' ? subClientParentBranchId !== undefined && Object.keys(subClientParentBranchId).length > 0 ? subClientParentBranchId.id : null : null,
    clientParentBranchName: clientId.isSuperFl === 'Y' ? superClientParentBranchId !== undefined && Object.keys(superClientParentBranchId).length > 0 ? superClientParentBranchId.name : null : null,
    subClientParentBranch: clientId.isSuperFl === 'N' ? subClientParentBranchId !== undefined && Object.keys(subClientParentBranchId).length > 0 ? subClientParentBranchId.name : null : null,
    timezoneId: branchTimeZone !== undefined && Object.keys(branchTimeZone) ? branchTimeZone.timezoneId : null,
    timezone: branchTimeZone !== undefined && Object.keys(branchTimeZone) ? branchTimeZone.canonicalId : null,
    gmtoffset: branchTimeZone !== undefined && Object.keys(branchTimeZone) ? branchTimeZone.gmtoffset : null,
    apartment: apartment,
    streetName: streetName,
    landmark: landmark,
    locality: locality,
    city: city,
    stateShortCode: state !== undefined && Object.keys(state).length > 0 ? state.code : null,
    state: state !== undefined && Object.keys(state).length > 0 ? state.name : null,
    countryShortCode: country !== undefined && Object.keys(country).length > 0 ? country.code : null,
    zipCode: zipCode !== undefined && formStructure !== undefined && Object.keys(formStructure).length > 0 && formStructure?.address?.addressFields?.childNodes?.zipCode.fieldType === "text" ? zipCode : zipCode !== undefined && Object.keys(zipCode).length > 0 ? zipCode.pincode : null,
    country: country !== undefined && Object.keys(country).length > 0 ? country.name : null,
    branchDescription: branchDescription,
    billingContactName: adminContactName,
    officeNumber: officeNumber,
    mobileNumber: mobileNumber,
    whatsappOptin: whatsappOptin,
    emailAddress: emailAddress,
    
    longitude: position[0],
    latitude: position[1],
    loadingTime: loadingTime,
    unloadingTime: unloadingTime,
    managerDetails: managerDetails,
    operationTimings: operationTimings,
    operationalSupportPhoneNumber: operationalSupportPhoneNumber,
    operationalSupportEmailID: operationalSupportEmailID,
    customerSupportPhoneNumber: customerSupportPhoneNumber,
    customerSupportEmailID: customerSupportEmailID,
    customFieldsEntity: customFieldsEntity,
    zones:zones,
    averagePrepTime: parseInt(preparationTime),
    averagePickupTime: parseInt(pickUpTime),
    loadMultipliers: load || [],
    acceptOrderOnHolidaysFl: acceptOrderOnHolidaysFl,
    calendarId: holidayCalendar !== undefined ? holidayCalendar?.calendarId : null,
    branchConfigDTO:  {
      cashTransactionFl: cashTransactionFl || undefined,
      minOrderValue: minOrderValue ? parseInt(minOrderValue) : undefined,
      maxOrderValue: maxOrderValue ? parseInt(maxOrderValue) : undefined,
      discardValue: discardValue ? parseInt(discardValue): undefined,
      pincodeVerificationFl : pincodeVerificationFl,
      signatureVerificationFl : signatureVerificationFl,
      additionalPickupNotes :additionalPickupNotes ,
      signerNameFl: signerInfo?.includes("signerNameFl") ? "Y" : "N",
      signerDetailsFl: signerInfo?.includes("signerDetailsFl") ? "Y" : "N",
    }
  };
  if(formStructure.middleMileOperations){
    payload['movementType']= movementType? movementType.clientRefMasterCd: null,
    payload['loadingStartTimeWindow']= loadingStartTimeWindow ? timeToString(loadingStartTimeWindow, true): '',
    payload['loadingEndTimeWindow']= loadingEndTimeWindow? timeToString(loadingEndTimeWindow, true): '',
    payload['unloadingStartTimeWindow'] = unloadingStartTimeWindow ? timeToString(unloadingStartTimeWindow, true) :'',
    payload['unloadingEndTimeWindow'] = unloadingEndTimeWindow ? timeToString(unloadingEndTimeWindow, true) : '',
    payload['isBackToHub'] = isBackToHub === "Y" ? "Y": "N"
  }
  return [payload];
};


export const convertOperationTimingStructure = (opList: any) => {
  const operationTimingsFields = store.getState().branchConfiguration.form.operationTimingsFormStructure.operationsTiming;
  return opList.map((field: any) => {
    let newField = {
      operationsTimingId: field.operationsTimingId ? field.operationsTimingId : null,
      [`operationsDaysOfWeek`]: {
        ...operationTimingsFields['daysOfWeek'],
        id: `operationsDaysOfWeek`,
        fieldName: `operationsDaysOfWeek`,
        labelKey: `operationsDayOfWeek`,
        permission: true
      },
      [`operationsStartTime`]: {
        ...operationTimingsFields['operationsStartTime'],
        id: `operationsStartTime`,
        fieldName: `operationsStartTime`,
        labelKey: `operationsStartTime`,
        permission: true
      },
      [`operationsEndTime`]: {
        ...operationTimingsFields['operationsEndTime'],
        id: `operationsEndTime`,
        fieldName: `operationsEndTime`,
        labelKey: `operationsEndTime`,
        permission: true
      },
      isSaved: false
    }
    return newField;
  })
}

export const convertShiftTimingStructure = (opList: any) => {
  const shiftTimingsFields = store.getState().branchConfiguration.form.shiftTimingsStructure.columns;
  return opList.map((field: any) => {
    let newField = {
      shiftTimingId: field.shiftTimingId ? field.shiftTimingId : null,
      [`daysOfWeek`]: {
        ...shiftTimingsFields['daysOfWeek'],
        id: `daysOfWeek`,
        fieldName: `daysOfWeek`,
        labelKey: `daysOfWeek`,
        permission: true
      },
      [`shiftStartTime`]: {
        ...shiftTimingsFields['shiftStartTime'],
        id: `shiftStartTime`,
        fieldName: `shiftStartTime`,
        labelKey: `shiftStartTime`,
        permission: true
      },
      [`shiftEndTime`]: {
        ...shiftTimingsFields['shiftEndTime'],
        id: `shiftEndTime`,
        fieldName: `shiftEndTime`,
        labelKey: `shiftEndTime`,
        permission: true
      },
      branchManagerId:  field?.branchManagerId ? field.branchManagerId : 'shiftTiming',
      isSaved: false
    }
    return newField;
  })
}

export const convertBranchManagerStructure = (opList: any) => {
  const branchManagerFields = store.getState().branchConfiguration.form.structure.branchManagerDetails;
  return opList.map((field: any) => {
    let newField = {
      branchManagerId: field?.branchManagerId ? field.branchManagerId : null,
      [`managerContactName`]: {
        ...branchManagerFields?.['managerContactName'],
        id: `managerContactName`,
        fieldName: `managerContactName`,
        labelKey: `managerContactName`,
      },
      [`managerMobileNumber`]: {
        ...branchManagerFields?.['managerMobileNumber'],
        id: `managerMobileNumber`,
        fieldName: `managerMobileNumber`,
        labelKey: `managerMobileNumber`,
      },
      [`managerWhatsappOptin`]: {
        ...branchManagerFields?.['managerWhatsappOptin'],
        id: `managerWhatsappOptin`,
        fieldName: `managerWhatsappOptin`,
        labelKey: `managerWhatsappOptin`,
      },
      [`managerEmailAddress`]: {
        ...branchManagerFields?.['managerEmailAddress'],
        id: `managerEmailAddress`,
        fieldName: `managerEmailAddress`,
        labelKey: `managerEmailAddress`,
      },
      [`shiftTiming`]: {
        ...branchManagerFields?.['shiftTiming'],
        id: `shiftTiming`,
        fieldName: `shiftTiming`,
        labelKey: `shiftTiming`,
      }
    }
    return newField;
  })
}


export const useGoogleAnalytics = () => {

  const gaOnSubmit = (isEditMode: boolean) => {
    sendGA('Form Actions' , `Client Branch Form Button Click - ${isEditMode ? 'Update' : 'Save'}`)
  }

  const gaOnCancel = () => {
    sendGA('Form Actions' , `Client Branch Form Button Click - Cancel`)
  }

  return { gaOnSubmit, gaOnCancel }
}

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

export const timeToString = (d: Date | undefined, withSeconds?: boolean) => {
  if (!d) {
    return "";
  } else {
    let hours = d && d?.getHours();
    let minutes = d && d?.getMinutes();

    const branchTimezone = store.getState().branchConfiguration.branchTimezone ? store.getState().branchConfiguration.branchTimezone : JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';

    let newDate = moment(new Date()).tz(branchTimezone);

    newDate && newDate.hours(Number(hours))
    newDate && newDate.minutes(Number(minutes))
    return withSeconds ? newDate && newDate.utc().format("HH:mm:ss") : newDate && newDate.utc().format("HH:mm");
  }
}

export const timeToStringWithoutUtc = (d: Date | undefined) => {
  if (!d) {
    return "";
  } else {
    let hours = d && d?.getHours();
    let minutes = d && d?.getMinutes();
    const branchTimezone = store.getState().branchConfiguration.branchTimezone ? store.getState().branchConfiguration.branchTimezone : JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
    let newDate = moment(new Date()).tz(branchTimezone);
    newDate && newDate.hours(Number(hours))
    newDate && newDate.minutes(Number(minutes))
    return newDate && newDate.format("HH:mm");
  }
}

export const changeTimezone = (date: Date, timezone: string) => {

  // suppose the date is 12:00 UTC
  var invdate = new Date(date.toLocaleString('en-US', {
    timeZone: timezone
  }));

  // then invdate will be 07:00 in Toronto
  // and the diff is 5 hours
  var diff = date.getTime() - invdate.getTime();

  // so 12:00 in Toronto is 17:00 UTC
  return new Date(date.getTime() - diff); // needs to substract

}

export const stringToTime = (timeString: string) => {
  const branchTimezone = store.getState().branchConfiguration.branchTimezone ? store.getState().branchConfiguration.branchTimezone : JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezone']) : '';
  let hour = Number(timeString.split(":")[0]);
  let minutes = Number(timeString.split(":")[1]);

  let offset = reverseTimeZone(timeString, branchTimezone);
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
  return new Date(moment.utc(utcDate).tz(branchTimezone).format());
}
export const check_time_overlap = (start_time1: string, end_time1: string, start_time2: string, end_time2: string) => {
  return (((end_time1 > start_time2 && end_time1 < end_time2) || (start_time1 > start_time2 && start_time1 < end_time2) || (start_time1 === start_time2) || (end_time1 === end_time2) || (end_time2 > start_time1 && end_time2 < end_time1) || (start_time2 > start_time1 && start_time2 < end_time1)) ? true : false)
}

export const generateRankList = () => {
  let rankList = { "1": "1", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10" };
  return rankList;
}

/* WARNING: arrays must not contain {objects} or behavior may be undefined */
export const isArrayEqual = (a: Array<any>, b: Array<any>) => JSON.stringify(a) === JSON.stringify(b);

export const isOvernightShift = (startTime: string, endTime: string) => {
  let startDate = new Date();
  let endDate = new Date();

  endDate.setHours(Number(endTime.split(":")[0]));
  endDate.setMinutes(Number(endTime.split(":")[1]));

  startDate.setHours(Number(startTime.split(":")[0]));
  startDate.setMinutes(Number(startTime.split(":")[1]));

  let diff = endDate.getTime() - startDate.getTime();

  if (Math.sign(diff) === -1 || Math.sign(diff) === 0) {
    return true;
  } else if (Math.sign(diff) === 1) {
    return false;
  } else {
    return false;
  }
}



export const isEmpty = (obj:any) => {
  if (obj?.length === 1) {
    if(obj?.[0]?.daysOfWeek === undefined && obj?.[0]?.startTime === undefined && obj?.[0]?.endTime === undefined && (obj?.[0]?.loadFactor === undefined || obj?.[0]?.loadFactor === "")) {
      return true
    } else {
      
      if(obj?.[0]?.daysOfWeek?.id === undefined) {
        if(typeof obj?.[0]?.startTime === 'string' && typeof obj?.[0]?.endTime === 'string') {
          return false
        } else {
          const loadFactor = obj?.[0]?.loadFactor === '' ? undefined : parseInt(obj?.[0]?.loadFactor)
          if(obj?.[0]?.startTime?.getHours() === 0 && obj?.[0]?.startTime?.getMinutes() === 0 && obj?.[0]?.endTime?.getHours() === 0 && obj?.[0]?.endTime?.getMinutes() === 0 && (loadFactor === undefined || loadFactor === 0)) {
            return true
          } else {
            return false
          }
        }
       
      } else {
        return false
      } 
    }
  } 
  return false
}

export const isRowEmpty = (newObj:any) => {

  let flag = newObj?.every((obj: any) => {
    const daysOfWeek = typeof obj?.daysOfWeek === 'string' ? obj?.daysOfWeek : obj?.daysOfWeek?.id
    return !!daysOfWeek && !!obj?.startTime && !!obj?.endTime && !!obj?.loadFactor
    
  })

  return flag
}

export const prepareLoadMultiplierObject = (mainObj:any) => {

  const newObj = mainObj?.items?.map((obj: any) => {
      let isSmaller = obj?.startTime?.getTime() > obj?.endTime?.getTime()  

      let stTime = `${obj?.startTime?.getHours() < 10 ? '0'+obj?.startTime?.getHours() : obj?.startTime?.getHours()}:${obj?.startTime?.getMinutes() < 10 ? '0'+obj?.startTime?.getMinutes() : obj?.startTime?.getMinutes()}`

      let etTime = `${obj?.endTime?.getHours() < 10 ? '0'+obj?.endTime?.getHours() : obj?.endTime?.getHours()}:${obj?.endTime?.getMinutes() < 10 ? '0'+obj?.endTime?.getMinutes() : obj?.endTime?.getMinutes()}`
      
      let daysOfWeek = typeof obj?.daysOfWeek !== 'string' ? obj?.daysOfWeek?.id : obj?.daysOfWeek 
      if(isSmaller) {
        console.log('greater')
      }
      return {
        daysOfWeek: daysOfWeek,
        startTime: stTime,
        endTime: etTime,
        loadFactor: typeof obj?.loadFactor === 'string' ? parseInt(obj?.loadFactor) : obj?.loadFactor
      }
    })
    return newObj
}

export const convertToDate = (stTime:any, etTime:any) => {

  let startTime = stTime
  let endTime = etTime

  if (typeof startTime === 'number') {
    startTime = moment(stTime).toDate()
  } else {
    let timeArr = stTime?.split(':')
    let hours = timeArr[0]
    let minutes = timeArr[1]
    startTime = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate(), parseInt(hours), parseInt(minutes))
  }

  if (typeof endTime === 'number') {
    endTime = moment(etTime).toDate()
  } else {
    let timeArr = etTime?.split(':')
    let hours = timeArr[0]
    let minutes = timeArr[1]
    endTime = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate(), parseInt(hours), parseInt(minutes))
  }

  return {
    startTime, endTime
  }
}

export const ValidateStartTimeEndTime = (data:any) => {
    // let MAINFLAG = true

    let MAINFLAG = data?.every((obj:any, index:number) => {
     
      // convert into DateTime

      let {startTime, endTime} = convertToDate(obj?.startTime, obj?.endTime)

      let startDate = startTime ? `${startTime?.getHours() < 10 ? '0'+startTime?.getHours() : startTime?.getHours()}:${startTime?.getMinutes() < 10 ? '0'+startTime?.getMinutes() : startTime?.getMinutes()}` : ''
      let endDate = endTime ? `${endTime?.getHours() < 10 ? '0'+endTime?.getHours() : endTime?.getHours()}:${endTime?.getMinutes() < 10 ? '0'+endTime?.getMinutes() : endTime?.getMinutes()}` : ''

      // startTime: obj?.startTime ? `${obj?.startTime?.getHours() < 10 ? '0'+obj?.startTime?.getHours() : obj?.startTime?.getHours()}:${obj?.startTime?.getMinutes() < 10 ? '0'+obj?.startTime?.getMinutes() : obj?.startTime?.getMinutes()}` : undefined,
      // endTime: obj?.endTime ? `${obj?.endTime?.getHours() < 10 ? '0'+obj?.endTime?.getHours() : obj?.endTime?.getHours()}:${obj?.endTime?.getMinutes() < 10 ? '0'+obj?.endTime?.getMinutes() : obj?.endTime?.getMinutes()}` : undefined,

        // check in between
        const objs = data?.filter((element:any, index2:number) => {
          if(index !== index2) {
            let {startTime, endTime} = convertToDate(element?.startTime, element?.endTime)
            return obj?.daysOfWeek === element?.daysOfWeek && {
              ...element,
              startTime: startTime ? `${startTime?.getHours() < 10 ? '0'+startTime?.getHours() : startTime?.getHours()}:${startTime?.getMinutes() < 10 ? '0'+startTime?.getMinutes() : startTime?.getMinutes()}` : undefined,
              endTime: endTime ? `${endTime?.getHours() < 10 ? '0'+endTime?.getHours() : endTime?.getHours()}:${endTime?.getMinutes() < 10 ? '0'+endTime?.getMinutes() : endTime?.getMinutes()}` : undefined
            }
          }

        })
        if(objs) {
          if(objs?.length > 0) {
            const flag = objs?.every((filteredObject:any) => {
              return !check_time_overlap(startDate, endDate, filteredObject.startTime, filteredObject.endTime)
            });

            if (flag) {
              return true
            }  else {
             return false
            }
          } else {
            return true
          }
        } else {
          return true
        }
    })
    return MAINFLAG
    
}

const convertStringInTZtoUTC = (dateVal: string) => {
  const date =  moment(dateVal, 'hh:mm').toDate();
  return timeToString(date, false)

}