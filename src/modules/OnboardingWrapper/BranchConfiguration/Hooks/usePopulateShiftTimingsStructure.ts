import { IBranchManagerStructure, IShiftTimingStructure, WEEKDAYS, IMangerDetails } from "../BranchConfiguration.models";
import { UseFormMethods } from 'react-hook-form';
import { stringToTime } from '../utils';

const usePopulateShiftTimingsStructure = (managerDetails: IMangerDetails[], key: string, formInstance: UseFormMethods<Record<string, any>>, shiftTimingsStructureList: IShiftTimingStructure[], branchManagerList: IBranchManagerStructure[], isEditMode: boolean, isBranchManagerTouched: boolean) => {
    
  const { setValue } = formInstance;
    if(isEditMode && !isBranchManagerTouched) { 
        let filteredStructure = shiftTimingsStructureList.filter((item:IShiftTimingStructure) => item.branchManagerId === key)
        filteredStructure.forEach((timing:IShiftTimingStructure, index: number) => {
        let fields = Object.keys(timing);
        let selectedManagerId = branchManagerList.filter((manager:IBranchManagerStructure) => { return Object.keys(manager)[4] === key})[0].branchManagerId;
        let shifts = managerDetails.filter((manager:IMangerDetails) => manager.branchManagerId === selectedManagerId).map((manager: IMangerDetails) => { return manager.shifts})[0];
        if(shifts && shifts.length > 0) {
          let operationalDays = WEEKDAYS.filter((weekday) => weekday.name === shifts[index].daysOfWeek)[0];
          setValue(fields[1], shifts[index].daysOfWeek ? operationalDays : "");
          setValue(fields[2], shifts[index].shiftStartTime ? stringToTime(shifts[index].shiftStartTime): "");
          setValue(fields[3], shifts[index].shiftEndTime ? stringToTime(shifts[index].shiftEndTime): "");
        }
        })             
      } 
  } 


  export default usePopulateShiftTimingsStructure;
