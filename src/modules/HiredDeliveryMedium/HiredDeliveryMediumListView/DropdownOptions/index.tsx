import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import store from '../../../../utils/redux/store';

const HIRED_DELIVERY_MEDIUM_DROPDOWN_MAPPING = {
        clientBranchName: async (dynamicLabels: Record<string, string>) => {
          
          let branchList = store.getState().hiredDeliveryAssociate.listView.branchName
          if (branchList?.length === 0) {
              const { data } = await axios.get(apiMappings.hiredDeliveryMedium.listView.clientBranchName, {
                  url: apiMappings.hiredDeliveryMedium.listView.clientBranchName,
                  data: {},
                  params: {},
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  withCredentials: false
              })
              
    
              branchList = data.map((branches: any) => ({
                  label: branches?.name,
                  value: branches?.name,
                  id: branches?.branchId,
                  title: branches?.name
              }))
    
          }
    
          if (branchList && branchList?.length > 0) {
              return branchList
          } else {
              return []
          }
        },
        status: async (dynamicLabels: Record<string, string>) => {
            if (dynamicLabels) {
              return [
                { value: 'Pending', label: dynamicLabels.pending },
                { value: 'Onboarded', label: dynamicLabels.onboarded },
              ]
            } else {
              return []
            }
          },
}

export default HIRED_DELIVERY_MEDIUM_DROPDOWN_MAPPING