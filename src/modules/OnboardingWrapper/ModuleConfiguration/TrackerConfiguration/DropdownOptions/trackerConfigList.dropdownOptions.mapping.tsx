import store from '../../../../../utils/redux/store'

const trackerConfigurationDropdownOption ={
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
    ownership:async () => {
        let ownershipList = store.getState().tracker.trackerConfiguration.ownershipList
        if ( ownershipList?.length > 0) {
            return ownershipList
        } else {
            return []
        }
    },
    supplierRefId:async () => {
        let supplierList = store.getState().tracker.trackerConfiguration.supplierList
        if (supplierList?.length > 0) {
            return supplierList
        } else {
            return []
        }
    },
    trackerTypeRefId:async () => {
        let trackerType = store.getState().tracker.trackerConfiguration.trackerTypeList
        if (trackerType?.length > 0) {
            return trackerType
        } else {
            return []
        }
    }
}
export default trackerConfigurationDropdownOption