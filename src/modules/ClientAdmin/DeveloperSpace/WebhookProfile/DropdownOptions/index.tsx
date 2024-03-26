import apiMappings from "../../../../../utils/apiMapping";
import axios from "../../../../../utils/axios";
import store from "../../../../../utils/redux/store";
import { IBranchData } from "../BranchWebhookProfile/BranchWebhookProfile.reducer";


export const BRANCH_WEBHOOK_DROPDOWN_MAPPING = {
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        return [
            { value: 'Y', label: dynamicLabels.active },
            { value: 'N', label: dynamicLabels.inactive }
        ]

    },
    branchName: async () => {
        const results = store?.getState().branchWebhookProfile.branchList || await axios.get(apiMappings.branchWebhookProfile.getBranches);
        return results?.map((branch: IBranchData) => {
            branch["value"] = branch?.name;
            branch["label"] = branch?.name;
            branch["title"] = branch?.name;
            return branch;
        })
    }
}