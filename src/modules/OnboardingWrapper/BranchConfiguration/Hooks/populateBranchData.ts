import { IMongoFormStructure } from '../../../../utils/mongo/interfaces';
import { deepCopy } from "../../../../utils/helper";
import { IFormInputs, IOperationTimingsStructure, IBranchManagerStructure, IShiftTimingStructure, IOperationTimings, WEEKDAYS, IMangerDetails, IShifts, ISkillSet} from "../BranchConfiguration.models";
import { UseFormMethods } from 'react-hook-form';
import { stringToTime } from '../utils';

const populateBranchData = (data: IFormInputs, operationTimingList: IOperationTimingsStructure[], branchManagerStructureList: IBranchManagerStructure[], shiftTimingsStructureList: IShiftTimingStructure[], structure: IMongoFormStructure, formInstance: UseFormMethods<Record<string, any>>, isOperationTimingTouched: boolean, dispatchFormStructure: Function, customFieldsFormData: Object, isBranchManagerTouched: boolean, skillList: Array<ISkillSet>) => {
  const { setValue } = formInstance;
    if (Object.keys(structure).length) {

      let loadMultiplierData = data?.loadMultipliers?.length > 0 ? data?.loadMultipliers : undefined

      loadMultiplierData = loadMultiplierData?.map((obj:any) => {
        let startTime = stringToTime(obj?.startTime)
        let stTime = `${startTime.getHours() < 10 ? '0'+startTime.getHours() : startTime.getHours()}:${startTime.getMinutes() < 10 ? '0'+startTime.getMinutes() : startTime.getMinutes()}`
        let endTime = stringToTime(obj?.endTime)
        let etTime = `${endTime.getHours() < 10 ? '0'+endTime.getHours() : endTime.getHours()}:${endTime.getMinutes() < 10 ? '0'+endTime.getMinutes() : endTime.getMinutes()}`
        return {
          ...obj,
          startTime:stTime,
          endTime: etTime
        }
      })
    
      const newStructure = deepCopy(structure);

      let keys = Object.keys(structure);
      keys.forEach((key: string) => {
        if (key === 'general details' && !isOperationTimingTouched && !isBranchManagerTouched) {
          setValue('clientId', { id: data.clientId, name: data.clientName, isSuperFl: data.isSuperFl});
          setValue('division', data.division);
          setValue('superClientParentBranchId', {
            id: data.parentClientBranchId,
            name: data.superClientParentBranch,
          });
          setValue('subClientParentBranchId', {
            id: data.subClientParentBranchId,
            name: data.subClientParentBranch,
          })
          setValue('name', data.name);
          setValue('radiusInKms', data.radiusInKms);
          setValue('description', data.description);
          setValue('vendorName', {
            id: data.coloaderId,
            name: data.coloaderName,
          });
          setValue('autoAllocateFl', data.autoAllocateFl);
          setValue(
            'deliveryMediumAutoAllocateFl',
            data.deliveryMediumAutoAllocateFl
          );
          
          // setValue('rank', {id: data?.rank?.toString(), name: data?.rank?.toString() });
          setValue('rank', data?.rank?.toString());

          setValue('branchTimeZone', {name: data.gmtoffset, id: data.timezoneId});
          let skills = data.skillSet ? data.skillSet.split(',') : [];
          let skillSet = skillList && skillList.length > 0 ? (skills && skills.map((skill: string) => {
            return skillList.find((skillObj) => skillObj.clientRefMasterCd === skill)
          })) : [];
          let operationTimingDays = data.operationTimings.map((timing: IOperationTimings) => {
            let days = [];
            days.push(timing.daysOfWeek);
            return days;
          })
          setValue('skillSet', skillSet);
          setValue('shortName', data.shortName);
          setValue('operationsTiming', operationTimingDays.join());

          if(!isOperationTimingTouched) {
          operationTimingList.forEach((timing: IOperationTimingsStructure, index: number) => {
            let fields = Object.keys(timing);
            let operationalDays =  data.operationTimings.map((operationDay: IOperationTimings) => {
              return WEEKDAYS.filter((weekday) => weekday.name === operationDay.daysOfWeek);
            });
            setValue(fields[1], data.operationTimings[index] ? operationalDays[index][0] : "");
            setValue(fields[2], data.operationTimings[index] ? stringToTime(data.operationTimings[index].operationsStartTime) : "");
            setValue(fields[3], data.operationTimings[index] ? stringToTime(data.operationTimings[index].operationsEndTime) : "");
          })
        }

        if(newStructure !== undefined) {
          newStructure[key]['clientId'].editable = false;
          // newStructure[key]['division'].editable = data.division ? false : true;
          newStructure[key]['superClientParentBranchId'].editable = false;
          newStructure[key]['name'].editable = false;
          newStructure[key]['branchTimeZone'].editable = false;
          if(Object.keys(newStructure[key]).includes('vendorName')) {
            newStructure[key]['vendorName'].editable = false;
          } else if(Object.keys(newStructure[key]).includes('skillSet')) {
            newStructure[key]['skillSet'].permission = true;
          }
        }
        setValue("acceptOrderOnHolidaysFl", data.acceptOrderOnHolidaysFl);
        setValue('holidayCalendar', {id: data.calendarId, calendarId: data.calendarId, name: data?.holidayCalendar});

        if(Object.keys(customFieldsFormData) && Object.keys(customFieldsFormData).length){
          Object.keys(customFieldsFormData).forEach(function(field) {
            setValue(field, customFieldsFormData[field])
          });
        }

        } else if (key === 'address' && !isOperationTimingTouched && !isBranchManagerTouched) {     
          setValue('country', { id: data.countryId, name: data.country, googleCountryCode: data.countryCode });
          setValue('apartment', data.apartment);
          setValue('streetName', data.streetName);
          setValue('landmark', data.landmark);
          setValue('locality', data.locality);
          setValue('city', data.city);
          setValue('state', { id: data.countryId, name: data.state });
          if(newStructure !== undefined) {
          if(Object.keys(newStructure['address']['addressFields']['childNodes']).includes('zipCode')) {
            if(newStructure['address']['addressFields']['childNodes'].zipCode.fieldType === "text") { 
              setValue('zipCode',  data.zipCode );      
            } else if(newStructure['address']['addressFields']['childNodes'].zipCode.fieldType === "select") {
            setValue('zipCode', { id: data.countryId, name: data.zipCode });
            }
          }
        }
        } else if (key === 'hub manager' && !isOperationTimingTouched && !isBranchManagerTouched) {
          setValue('adminContactName', data.adminContactName);
          setValue('mobileNumber', data.mobileNumber);
          setValue('whatsappOptin',data.whatsappOptin);
          setValue('emailAddress', data.emailAddress);
          setValue('loadingTime', data.loadingTime);
          setValue('unloadingTime', data.unloadingTime);
          setValue('officeNumber', data.officeNumber);
          setValue('operationalSupportPhoneNumber', data.operationalSupportPhoneNumber);
          setValue('operationalSupportEmailID', data.operationalSupportEmailID);
          setValue('customerSupportPhoneNumber', data.customerSupportPhoneNumber);
          setValue('customerSupportEmailID', data.customerSupportEmailID);
        } else if (key === 'bank details' && !isOperationTimingTouched) {
          setValue('bankName', data.clientBranchAccountDTO.bankName);
          setValue('bankAccountNo', data.clientBranchAccountDTO.bankAccountNo);
        } else if (key === 'wallet details' && !isOperationTimingTouched) {
          setValue(
            'walletEnabled',
            data.clientBranchAccountDTO.walletEnabled ? 'Yes' : 'No'
          );
          setValue('walletId', data.clientBranchAccountDTO.walletId);
          setValue('minBalance', data.clientBranchAccountDTO.minBalance);
          setValue(
            'minWithdrawableAmount',
            data.clientBranchAccountDTO.minWithdrawableAmount
          );
        } else if (key === 'branchManagerDetails') {
          branchManagerStructureList.forEach((manager: IBranchManagerStructure) => {
            let fields = Object.keys(manager);
              if(data.managerDetails.length && !isBranchManagerTouched) {
              let singleManager = data.managerDetails.filter((branchManager:IMangerDetails) =>  branchManager?.branchManagerId === manager.branchManagerId)[0];
              if(singleManager && Object.keys(singleManager).length > 0) {
                const operationalDays = singleManager.shifts.map((shift:IShifts) => shift.daysOfWeek);
                setValue(fields[1], Object.keys(singleManager).length ? singleManager.managerContactName : "");
                setValue(fields[2], Object.keys(singleManager).length ? singleManager.mobileNumber : "");
                setValue(fields[3], Object.keys(singleManager).length ? singleManager.whatsappOptin : "N");
                setValue(fields[4], Object.keys(singleManager).length ? singleManager.emailAddress : "");       
                setValue(fields[5], Object.keys(singleManager).length ? operationalDays : "");
                let singleShiftStructure = shiftTimingsStructureList.length > 0 && shiftTimingsStructureList.filter((shift:IShiftTimingStructure) => shift.branchManagerId === fields[5] );
                singleShiftStructure && singleShiftStructure.length > 0 && Object.keys(singleManager).length > 0 && singleShiftStructure.map((obj:IShiftTimingStructure, shiftIndex: number) => {
                  if(singleManager.shifts && singleManager.shifts.length > 0 && singleManager.shifts[shiftIndex]) {
                    let shiftKeys = Object.keys(obj);
                    let operationalDayList = singleManager.shifts && singleManager.shifts[shiftIndex] && WEEKDAYS.filter((weekday) => weekday.name === singleManager.shifts[shiftIndex].daysOfWeek)[0];
                    setValue(shiftKeys[1], singleManager.shifts[shiftIndex].daysOfWeek ? operationalDayList : "");
                    setValue(shiftKeys[2], singleManager.shifts[shiftIndex].shiftStartTime ? stringToTime(singleManager.shifts[shiftIndex].shiftStartTime) : "");
                    setValue(shiftKeys[3], singleManager.shifts[shiftIndex].shiftEndTime ? stringToTime(singleManager.shifts[shiftIndex].shiftEndTime) : "");       
                  }
                })
              }
            }
          });          
        } else if(key === 'additional information'){
          if(Object.keys(customFieldsFormData).length){
            Object.keys(customFieldsFormData).forEach(function(field) {
              setValue(field, customFieldsFormData[field])
            });
          }
        } else if(key === 'middleMileOperations'){
          setValue('movementType', {id: data.movementType, name: data.movementType, clientRefMasterCd :data.movementType })
          setValue('loadingStartTimeWindow',data.loadingStartTimeWindow ? stringToTime(data.loadingStartTimeWindow ) : "");       
          setValue('loadingEndTimeWindow',data.loadingEndTimeWindow ? stringToTime(data.loadingEndTimeWindow ) : "");       
          setValue('unloadingStartTimeWindow',data.unloadingStartTimeWindow ? stringToTime(data.unloadingStartTimeWindow ) : "");       
          setValue('unloadingEndTimeWindow',data.unloadingEndTimeWindow ? stringToTime(data.unloadingEndTimeWindow ) : "");       
          setValue('loadingTime', data.loadingTime);
          setValue('unloadingTime', data.unloadingTime);
          setValue('isBackToHub', data.isBackToHub && data.isBackToHub === 'Y' ? 'Y': 'N');         
        } else if(key === 'ETA details'){
          setValue('loadMultipliers', loadMultiplierData )
          setValue('preparationTime',data?.averagePrepTime);       
          setValue('pickUpTime',data?.averagePickupTime);           
        } else if (key === 'carrierDetails'){
            if (data && data.branchConfigDTO) {
              setValue('cashTransactionFl', data.branchConfigDTO.cashTransactionFl)
              setValue('maxOrderValue', data.branchConfigDTO.maxOrderValue)
              setValue('minOrderValue', data.branchConfigDTO.minOrderValue)
              setValue('discardValue', data.branchConfigDTO.discardValue)
              setValue('signatureVerificationFl',data.branchConfigDTO.signatureVerificationFl )
              setValue(
                'pincodeVerificationFl',
                data.branchConfigDTO.pincodeVerificationFl
              )
              const signerInfo = `${
                data.branchConfigDTO.signerDetailsFl === 'Y'
                  ? `${'signerDetailsFl'}`
                  : ''
              }${
                data.branchConfigDTO.signerNameFl === 'Y'
                  ? `,${'signerNameFl'}`
                  : ''
              }`
              setValue('signerInfo', signerInfo)
              setValue(
                'additionalPickupNotes',
                data.branchConfigDTO.additionalPickupNotes
              )
            }
    
        }
    });

    dispatchFormStructure(newStructure)
    }
  } 


  export default populateBranchData;
