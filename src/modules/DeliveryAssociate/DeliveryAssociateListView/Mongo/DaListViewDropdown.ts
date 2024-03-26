import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import store from '../../../../utils/redux/store';

const DeliveryAssociatefilterOption = {
    statusCd: async () => {
        let statusList = store.getState().deliveryMedium.listView.statusList
        let initailFetchDone = store.getState().deliveryMedium.listView.initailFetchDone

        // //const landingPage = localStorage.getItem('landingPage')
        if (initailFetchDone && statusList.length === 0) {
            const { data } = await axios.get(apiMappings.deliveryMedium.listView.getStatus)
            statusList = data.map((entry: any) => {
                return{
                    label: entry?.clientRefMasterDesc,
                    value: entry?.reasonCd,
                    id: entry?.reasonCd,
                    title: entry?.clientRefMasterDesc
                }
            })

        }
        if (statusList?.length > 0) {
            return statusList
        } else {
            return []
        }
    },
    isAttandanceFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.present && dynamicLabels?.Absent) {
            return [
                { value: 'true', label: dynamicLabels.present, title: dynamicLabels.present },
                { value: 'false', label: dynamicLabels.Absent, title: dynamicLabels.Absent }
            ]
        } else {
            return [];
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
    source: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels) {
          return [
            { value: 'Self', label: dynamicLabels.self },
            { value: 'DriverHyre', label: dynamicLabels.driverhyre},
          ]
        } else {
          return []
        }
      },
    type: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.LOGIN_DMLOGINSTATUS && dynamicLabels?.LOGOUT_DMLOGINSTATUS && dynamicLabels?.NOTLOGEDIN_DMLOGINSTATUS) {
            return [
                { value: 'LOGIN', label: dynamicLabels.LOGIN_DMLOGINSTATUS,title: dynamicLabels.LOGIN_DMLOGINSTATUS},
                { value: 'LOGOUT', label: dynamicLabels.LOGOUT_DMLOGINSTATUS, title:dynamicLabels.LOGOUT_DMLOGINSTATUS },
                { value: 'NOTLOGEDIN', label: dynamicLabels.NOTLOGEDIN_DMLOGINSTATUS, title:dynamicLabels.NOTLOGEDIN_DMLOGINSTATUS }
            ]
        } else {
            return []
        }
    },
    weeklyOff: async () => {
        let weeklyOff = store.getState().deliveryMedium.listView.weeklyOff
        let initailFetchDone = store.getState().deliveryMedium.listView.initailFetchDone

        if (initailFetchDone && weeklyOff?.length === 0) {
            const { data } = await axios.get(apiMappings.deliveryMedium.listView.weeklyOff)
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
    branchName: async () => {
        let branchList = store.getState().deliveryMedium.listView.branchList
        let initailFetchDone = store.getState().deliveryMedium.listView.initailFetchDone
         
        if (initailFetchDone && branchList?.length === 0) {
            const { data } = await axios.get(apiMappings.deliveryMedium.listView.getDistributionCenterBranch, {
                url: apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
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

        if (branchList?.length > 0) {
            return branchList
        } else {
            return []
        }
    },
    deliveryMediumMasterTypeCd: async () => {
        let deliveryTypes = store.getState().deliveryMedium.listView.deliveryTypes
        let initailFetchDone = store.getState().deliveryMedium.listView.initailFetchDone

        if (initailFetchDone && deliveryTypes.length === 0) {
            const { data } = await axios.get(apiMappings.deliveryMedium.listView.delMedType)
            deliveryTypes = data.map((type: any) => ({
                label: type?.name,
                value: type?.name,
                id: type?.id,
                title: type?.name
            }))
        }
        if (deliveryTypes?.length > 0) {
            return deliveryTypes
        } else {
            return []
        }
    },
    isOnBreakFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.Yes) {
            return [
                { value: 'Y', label: dynamicLabels.Yes , title: dynamicLabels.Yes },
                { value: 'N', label: dynamicLabels.No , title: dynamicLabels.No }
            ]
        } else {
            return []
        }
    },
}


export default DeliveryAssociatefilterOption