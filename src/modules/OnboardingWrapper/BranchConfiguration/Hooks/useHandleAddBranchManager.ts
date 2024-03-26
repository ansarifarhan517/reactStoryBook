import { IBranchManagerStructure, IShiftTimingStructure} from "../BranchConfiguration.models";
import { addManager } from "../helper";

const useHandleAddBranchManager = (branchManagerList: IBranchManagerStructure[], dispatchBranchManagerStructure: Function, setBranchManagerTouched: Function, shiftTimingsStructureList: IShiftTimingStructure[], handleAddShiftTimings: Function) => {
    setBranchManagerTouched(true);
    let lastField = branchManagerList.length > 1 ? [branchManagerList[branchManagerList.length - 1]] : branchManagerList;
    let newList = addManager(lastField, branchManagerList.length)
    let fields = [...branchManagerList, ...newList];
    dispatchBranchManagerStructure(fields);
    handleAddShiftTimings(shiftTimingsStructureList, `shiftTiming-${branchManagerList.length}`);
} 

export default useHandleAddBranchManager;