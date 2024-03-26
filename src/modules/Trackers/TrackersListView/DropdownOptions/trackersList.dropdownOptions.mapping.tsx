import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import store from '../../../../utils/redux/store'

const trackerConfigurationDropdownOption = {
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
    doorStatus: async () => {
        return [
            { value: 'Y', label: 'True', title: 'True' },
            { value: 'N', label: 'False', title: 'False' }
        ]
    },
    reeferActive: async () => {
        return [
            { value: 'Y', label: 'True', title: 'True' },
            { value: 'N', label: 'False', title: 'False' }
        ]
    },
    status: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.available && dynamicLabels?.inactive && dynamicLabels?.intransit) {
            return [
                { value: 'Available', label: dynamicLabels?.available, title: dynamicLabels.available },
                { value: 'Intransit', label: dynamicLabels?.intransit, title: dynamicLabels.intransit },
                { value: 'Inactive', label: dynamicLabels?.notAvailable, title: dynamicLabels.notAvailable },
            ]
        } else {
            return []
        }
    },
    gpsStatus: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.online && dynamicLabels?.offline && dynamicLabels?.idle) {
            return [
                { value: 'Online', label: dynamicLabels?.online, title: dynamicLabels.online },
                { value: 'Offline', label: dynamicLabels?.offline, title: dynamicLabels.offline },
                { value: 'Idle', label: dynamicLabels?.idle, title: dynamicLabels.idle }
            ]
        } else {
            return []
        }
    },
    deviceType:async () => {
        let deviceType = store.getState().tracker.trackers.listView.trackerTypeList
        if (deviceType?.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.trackerTypeMasterList)
            deviceType = data.map((type: any) => ({
                label: type?.clientRefMasterCd,
                value: type?.clientRefMasterCd,
                id: type?.clientRefMasterId,
                title: type?.clientRefMasterCd
            }))
        }
        if (deviceType?.length > 0) {
            store.dispatch({ type: '@@trackersListView/SET_TRACKER_TYPE', payload: deviceType });
            return deviceType
        } else {
            return []
        }
    },

    trackerModel: async () => {
        let trackerConfigList = store.getState().tracker.trackers.listView.trackersList
        if (trackerConfigList?.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.getTrackerModels)
            trackerConfigList = data?.data?.map((type: any) => ({
                label: type?.trackerModel,
                value: type?.trackerModel,
                id: type?.trackerConfigId,
                title: type?.trackerModel,
                clientRefMasterId: type?.trackerConfigId
            }))
        }
        if (trackerConfigList?.length > 0) {
            store.dispatch({type:'@@trackersListView/SET_TRACKERS_CONFIG_LIST',payload :trackerConfigList})
            return trackerConfigList
        } else {
            return []
        }
    },
    clientBranchName: async () => {
        let branchList = store.getState().tracker.trackers.listView.branchList
        if (branchList?.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.getDistributionCenterBranch, {data: {}, params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            })
            branchList = data
            branchList = branchList.map((branches: any) => ({
                label: branches?.name,
                value: branches?.name,
                id: branches?.branchId,
                title: branches?.name
            }))
        }
        if (branchList?.length > 0) {
            store.dispatch({type:'@@trackersListView/SET_BRANCH_LIST',payload :branchList})
            return branchList
        } else {
            return []
        }
    },
    ignition: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.on && dynamicLabels?.off) {
            return [
                { value: 'ON', label: dynamicLabels?.on, title: dynamicLabels.on },
                { value: 'OFF', label: dynamicLabels?.off, title: dynamicLabels.off }
            ]
        } else {
            return []
        }
    }
}
export default trackerConfigurationDropdownOption