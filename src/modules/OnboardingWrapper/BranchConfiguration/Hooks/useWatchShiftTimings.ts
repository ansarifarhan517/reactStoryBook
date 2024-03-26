import { IBranchManagerStructure, IShiftTimingStructure } from "../BranchConfiguration.models";
import { UseFormMethods } from 'react-hook-form';
import { timeToString } from '../utils';
const useWatchShiftTimings = (branchManagers: IBranchManagerStructure[], shiftTimings: IShiftTimingStructure[], formInstance: UseFormMethods<Record<string, any>>, setManagerDetails: Function) => {

    const { watch, setValue , clearErrors} = formInstance;
  let branchManagersDetails = branchManagers.filter(item =>
    item[Object.keys(item)[Object.keys(item).length - 1]]?.permission
  ).map((manager: IBranchManagerStructure) => {
        let keys = Object.keys(manager);
        let selectedDays: Array<string> = [];
        return {
                ['branchManagerId']: manager.branchManagerId ? manager.branchManagerId : null,
                ['managerContactName']: watch(String([keys[1]]), ''),
                ['mobileNumber']: watch(String([keys[2]]), ''),
                ['whatsappOptin']: watch(String([keys[3]])),
                ['emailAddress']: watch(String([keys[4]]), ''),
                
                ['shifts']: shiftTimings.filter((shift:IShiftTimingStructure) => shift.branchManagerId === keys[5]).map((obj:IShiftTimingStructure) => {
                      let shiftKeys = Object.keys(obj);
                      let selectedDay = watch(String([shiftKeys[1]]), '') ? watch(String([shiftKeys[1]]), '').name : null;
                      selectedDay ? selectedDays.push(selectedDay) : null;
                      setValue(keys[5], selectedDays.length ? selectedDays : "");
                      if(selectedDays && selectedDays.filter(Boolean).length){
                        clearErrors(keys[5])
                      }
                    if(timeToString(watch(String([shiftKeys[2]]), '')) !== "" || timeToString(watch(String([shiftKeys[3]]), '')) !== "") {
                      return {
                        ['shiftTimingId']: obj.shiftTimingId ? obj.shiftTimingId : null,
                        ['daysOfWeek']: watch(String([shiftKeys[1]]), '') === null ? "" : watch(String([shiftKeys[1]]), '').name,
                        ['shiftStartTime']: timeToString(watch(String([shiftKeys[2]]), '')),
                        ['shiftEndTime']: timeToString(watch(String([shiftKeys[3]]), ''))
                    }
                  } else {
                    return;
                  }
                  })
                }
              })
  let managerDetails = branchManagersDetails.filter((manager: { managerContactName: string; shifts: any[]; }) => manager.managerContactName && manager.shifts.length)
  managerDetails.filter((manager) => {return manager.shifts = manager.shifts.filter((shift) => { return shift !== undefined })})
  setManagerDetails(managerDetails);
  return managerDetails;
  }


  export default useWatchShiftTimings;
