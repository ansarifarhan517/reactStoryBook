import { IOperationTimingsStructure } from "../BranchConfiguration.models";
import { UseFormMethods } from 'react-hook-form';
import { timeToString } from "../utils";

const useWatchOperationTimings = (list: IOperationTimingsStructure[], formInstance: UseFormMethods<Record<string, any>>, validateOperationTimings: Function, setOperationTimings: Function  ) => {

    const { setValue, watch } = formInstance;
    let selectedDays: Array<string> = [];
    const operationTimings = list.map((operationTiming: IOperationTimingsStructure) => {
      let keys = Object.keys(operationTiming);
      let selectedDay = watch(String([keys[1]]), '') ? watch(String([keys[1]]), '').name : null;
      selectedDay ? selectedDays.push(selectedDay) : null;
      return {
        operationsTimingId: operationTiming.operationsTimingId ? operationTiming.operationsTimingId : null,
        daysOfWeek: watch(String([keys[1]]), '') === null ? "" : watch(String([keys[1]]), '').name,
        operationsStartTime: timeToString(watch(String([keys[2]]), '')),
        operationsEndTime: timeToString(watch(String([keys[3]]), ''))
      };
    });
    let filteredOperationTimings = operationTimings.filter((item) => {
      return item.daysOfWeek !== undefined && item.operationsStartTime !== "" && item.operationsEndTime !== ""
    })
    let operationalDays = filteredOperationTimings.filter((operationTiming:IOperationTimingsStructure) =>  { return (operationTiming.operationsStartTime!== "") || (!operationTiming.daysOfWeek)}).map((day:IOperationTimingsStructure) => day.daysOfWeek);
      validateOperationTimings(operationalDays)
      let filteredOperationTiming = operationTimings.filter((timing: IOperationTimingsStructure) =>  {
        if (timing.operationsStartTime !== "") {
        return {
            daysOfWeek: timing.daysOfWeek,
            operationsStartTime: timing.operationsStartTime,
            operationsEndTime: timing.operationsEndTime,
            operationsTimingId: timing.operationsTimingId,
            isSaved: true
          }
        } else {
          return {}
        }
      })
      let operationTimingsList = filteredOperationTiming.filter((timing: IOperationTimingsStructure) => {return timing.operationsStartTime !== "" || timing.operationsEndTime !== ''})
      setOperationTimings(operationTimingsList);
      setValue('operationsTiming', selectedDays);
}


export default useWatchOperationTimings;