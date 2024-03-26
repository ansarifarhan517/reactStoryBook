import { deepCopy } from "../../../../utils/helper";
import { IMongoField } from "../../../../utils/mongo/interfaces";
import { IBranchConfigurationTreeDataSubBranchPayload, IOperationTimingsStructure} from "../BranchConfiguration.models";
const useRemoveOperationsTimings = (index: number, list: IOperationTimingsStructure[], editMode: boolean, dispatchClientDetails: Function, dispatchOperationTimingsStructure: Function, clientBranchDetails: IBranchConfigurationTreeDataSubBranchPayload, setOperationTimingTouched: Function, deletedObj: IMongoField) => {

  setOperationTimingTouched(true);
    const updatedList = deepCopy(list)
    updatedList.forEach((opItem: {}) => {
      if (Object.keys(opItem)[Object.keys(opItem).length - 2] === Object.keys(deletedObj)[Object.keys(deletedObj).length - 2]) {
        Object.keys(opItem).forEach(field => {
          if (opItem[field] && opItem[field].label) {
            opItem[field].permission = false
          }
        })
      }
    });

    if(editMode) {

    let newClientBranchDetails = deepCopy(clientBranchDetails) 
    let filteredTimings = newClientBranchDetails.operationTimings.filter((i: number) => { 
      return i !== index
    });
    let newClientDetails = {...newClientBranchDetails, operationTimings: filteredTimings}
    dispatchClientDetails(newClientDetails)
    dispatchOperationTimingsStructure(updatedList);
    } else {
      dispatchOperationTimingsStructure(updatedList);
  }
} 


export default useRemoveOperationsTimings;