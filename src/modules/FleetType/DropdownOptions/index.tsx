import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import store from '../../../utils/redux/store'



const FleetDropdownOption ={
    weeklyOffList: async () => {
        let weeklyOff = store.getState().fleet.listView.weeklyOff
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
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels?.active, title: dynamicLabels.active },
                { value: 'N', label: dynamicLabels?.inactive, title: dynamicLabels.inactive }
            ]
        } else {
            return []
        }
    },
    skillSet:async () => {
        let deliveryTypes = store.getState().fleet.listView.deliveryTypes
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
    },

}
export default FleetDropdownOption