import { IOperationTimingsStructure,IShiftTimingStructure } from "../BranchConfiguration.models";
import { deepCopy } from "../../../../utils/helper";
import { IMongoField } from "../../../../utils/mongo/interfaces";

const useHandleRemoveBranchManager = (list: IOperationTimingsStructure[], dispatchBranchManagerStructure: Function, setBranchManagerTouched: Function, deletedField: IMongoField, shiftList: IShiftTimingStructure[]) => {
    setBranchManagerTouched(true);
  const updatedList = deepCopy(list)
  updatedList.forEach((opItem: {}) => {
    if (Object.keys(opItem)[Object.keys(opItem).length - 2] === Object.keys(deletedField)[Object.keys(deletedField).length - 2]) {
      Object.keys(opItem).forEach(field => {
        if (opItem[field] && opItem[field].label) {
          opItem[field].permission = false
          if(field.includes('shiftTiming')){
            let selectedShift = shiftList.find((shift) => shift.branchManagerId === field)
            if(selectedShift && Object.keys(selectedShift).length){
              let shiftKeys = Object.keys(selectedShift);
              selectedShift[shiftKeys[1]].permission = false
            }
          }
        }
      })
    }
  });
  dispatchBranchManagerStructure(updatedList);
} 

export default useHandleRemoveBranchManager;