import { deepCopy } from "../../../../utils/helper";
import { IBranchManagerStructure, IShiftTimingStructure, IMangerDetails, IShifts, IBranchConfigurationTreeDataSubBranchPayload} from "../BranchConfiguration.models";
// import { UseFormMethods } from 'react-hook-form';
const useRemoveShiftTimings = (field: IShiftTimingStructure, list: IShiftTimingStructure[], editMode: boolean, branchManagerList: IBranchManagerStructure[], dispatchShiftTimingsStructure: Function, dispatchClientDetails: Function, clientBranchDetails: IBranchConfigurationTreeDataSubBranchPayload) => {

  const updatedList = deepCopy(list);
    updatedList.forEach((opItem: {}) => {
      if (Object.keys(opItem)[Object.keys(opItem).length - 3] === Object.keys(field)[Object.keys(field).length - 3]) {
        Object.keys(opItem).forEach(item => {
          if (opItem[item] && opItem[item].label) {
            opItem[item].permission = false
          }
        })
      }
    });

    dispatchShiftTimingsStructure(updatedList);

    if(editMode) {    
      let newClientBranchDetails = deepCopy(clientBranchDetails);
      let filteredManagerStructure = branchManagerList.filter((manager:IBranchManagerStructure) => Object.keys(manager).includes(field.branchManagerId))[0];
      let filteredManager = newClientBranchDetails.managerDetails && newClientBranchDetails.managerDetails.length > 0 ? newClientBranchDetails.managerDetails.filter((manager:IMangerDetails) => manager.branchManagerId === filteredManagerStructure.branchManagerId)[0] : [];
      
      let newShiftList = newClientBranchDetails.managerDetails && filteredManager.shifts.length > 0 && filteredManager.shifts.filter((shift:IShifts) => shift.shiftTimingId !== field.shiftTimingId);
      filteredManager['shifts'] = newShiftList !== undefined ? newShiftList : []

      let oldManagers = newClientBranchDetails.managerDetails && newClientBranchDetails.managerDetails.length > 0 && newClientBranchDetails.managerDetails.filter((manager:IMangerDetails) => manager.branchManagerId !== filteredManagerStructure.branchManagerId)
      let newManagerDetails = filteredManager?.length > 0 ? {...newClientBranchDetails,  managerDetails: [...oldManagers, ...[filteredManager]]} : {...newClientBranchDetails,  managerDetails: [...oldManagers]}

      dispatchClientDetails(newManagerDetails)
      dispatchShiftTimingsStructure(updatedList);
    }
} 


export default useRemoveShiftTimings;