import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import store from '../../../../utils/redux/store';

const VEHICLE_DROPDOWN_MAPPING = {
        status: async (dynamicLabels: Record<string, string>) => {
          if (dynamicLabels.Available) {
            return [
              { value: 'Available', label: dynamicLabels.Available },
              { value: 'Intransit', label: dynamicLabels.Intransit },
              { value: 'Inactive', label: dynamicLabels.inactive }
            ]
          } else {
            return []
          }
        },
    
        vehicleType: async (dynamicLabels: Record<string, string>) => {
            return [
              { value: '2 Wheeler', label: dynamicLabels.twoWheeler },
              { value: '4 Wheeler', label: dynamicLabels.fourWheeler },
            ]
        },
        
    
        isActiveFl: async (dynamicLabels: Record<string, string>) => {
            return [
              { value: 'Y', label: dynamicLabels.active },
              { value: 'N', label: dynamicLabels.inactive }
            ]
          
        },
    
        tripStatus: async (dynamicLabels: Record<string, string>) => {
            return [
              { value: 'STARTED', label: dynamicLabels.started },
              { value: 'NOTSTARTED', label: dynamicLabels.notstarted },
              { value: 'ENDED', label: dynamicLabels.ended }
            ]
        },
    
        deliveryMediumBranch : async (dynamicLabels: Record<string, string>) => {
          console.log(dynamicLabels)
          
          let branchList = store.getState().vehicle.listView.branchName
          if (branchList?.length === 0) {
              const { data } = await axios.get(apiMappings.vehicle.listView.branchNames, {
                  url: apiMappings.vehicle.listView.branchNames,
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
        branchName: async (dynamicLabels: Record<string, string>) => {
          console.log(dynamicLabels)
          
          let branchList = store.getState().vehicle.listView.branchName
          if (branchList?.length === 0) {
              const { data } = await axios.get(apiMappings.vehicle.listView.branchNames, {
                  url: apiMappings.vehicle.listView.branchNames,
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
        // typeOfBody: async (dynamicLabels: Record<string, string>) => {
        //   console.log(dynamicLabels)
          
        //   let branchList = store.getState().vehicle.listView.branchName
        //   if (branchList?.length === 0) {
        //       const { data } = await axios.get(apiMappings.vehicle.listView.branchNames, {
        //           url: apiMappings.vehicle.listView.branchNames,
        //           data: {},
        //           params: {},
        //           headers: {
        //               'Content-Type': 'application/json'
        //           },
        //           withCredentials: false
        //       })
    
        //       branchList = data.map((branches: any) => ({
        //           label: branches?.name,
        //           value: branches?.name,
        //           id: branches?.branchId,
        //           title: branches?.name
        //       }))
    
        //   }
    
        //   if (branchList && branchList?.length > 0) {
        //       return branchList
        //   } else {
        //       return []
        //   }
        // }
}

export default VEHICLE_DROPDOWN_MAPPING