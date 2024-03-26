import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios'
import store from '../../../../../utils/redux/store'



const serviceTypeDropdownOption ={
    branchId: async () => {
        let branchList = store.getState().serviceTypeConfiguration.branches
        if (branchList.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.getDistributionCenterBranch, {
                data: {},
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            })
            branchList = data
        }
        branchList = branchList.map((branches: any) => ({
            label: branches?.name,
            value: branches?.name,
            id: branches?.branchId,
            title: branches?.name
        }))
        if (branchList.length > 0) {
            return branchList
        } else {
            return []
        }
    },
    serviceDays: async () => {
        let weeklyOff = store.getState().serviceTypeConfiguration.serviceDays
        if (weeklyOff.length === 0) {
            const { data } = await axios.get(apiMappings.common.weeklyOff)
            weeklyOff = data.map((entry: any) => {
                return {
                    label: entry?.name,
                    value: entry?.name,
                    id: entry?.id,
                    title: entry?.name
                }
            })
        }
        if (weeklyOff.length > 0) {
            return weeklyOff
        } else {
            return []
        }
    },
    activeFlag: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels?.active, title: dynamicLabels.active },
                { value: 'N', label: dynamicLabels?.inactive, title: dynamicLabels.inactive }
            ]
        } else {
            return []
        }
    },
    considerHolidays: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels?.YES, title: dynamicLabels.YES },
                { value: 'N', label: dynamicLabels?.NO, title: dynamicLabels.NO }
            ]
        } else {
            return []
        }
    },
    deliveryType:async () => {
        let deliveryTypes = store.getState().serviceTypeConfiguration.deliveryTypes
        if (deliveryTypes.length === 0) {
            const { data } = await axios.get(apiMappings.common.delMedType)
            deliveryTypes = data.map((type: any) => ({
                label: type?.name,
                value: type?.name,
                id: type?.id,
                title: type?.name
            }))
        }
        if (deliveryTypes.length > 0) {
            return deliveryTypes
        } else {
            return []
        }
    },autoAllocate: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels.Auto_assign_to_nearest_rider, title: dynamicLabels.Auto_assign_to_nearest_rider },
                { value: 'P', label: dynamicLabels.Auto_assign_to_existing_route, title: dynamicLabels.Auto_assign_to_existing_route},
                { value: 'N', label: dynamicLabels.Manual_assign_to_trip, title: dynamicLabels.Manual_assign_to_trip}
                
            ]
        } else {
            return []
        }
    },
    branchMovement: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels?.YES, title: dynamicLabels?.YES },
                { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
            ]
        } else {
            return []
        }
    },


}
export default serviceTypeDropdownOption