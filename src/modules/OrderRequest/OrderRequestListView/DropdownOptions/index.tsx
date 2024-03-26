import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import store from '../../../../utils/redux/store'
import { IPriorityList } from '../../../Shipper/ShipperListView/ShipperListView.models'



const OrderRequestDropdownOption = {
    deliveryType: async () => {
        let deliveryTypes = store.getState().orderRequest.listView.deliveryTypes
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
    priority: async () => {
        let priorityList = store.getState().orderRequest.listView.priorityList
        if (priorityList.length === 0) {
            const { data: { data: priorityData } } = await axios.get(apiMappings.common.priority)
            priorityList = priorityData?.map((priority: IPriorityList) => {
                return {
                    id: priority?.clientRefMasterId,
                    label: priority?.clientRefMasterDesc,
                    value: priority?.clientRefMasterCd,
                    title: priority?.clientRefMasterDesc,
                }
            })

        }
        if (priorityList.length > 0) {
            return priorityList
        } else {
            return []
        }
    },
    branchName: async () => {
        let branchList = store.getState().orderRequest.listView.branchList
        if (branchList.length === 0) {
            const { data } = await axios.get(apiMappings.common.lookup.getDistributionCenterBranch, {
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
        if (branchList.length > 0) {
            return branchList
        } else {
            return []
        }
    },
    orderStatus: async (dynamicLabels: Record<string, string>) => {
        let statusList: any = store.getState().orderRequest.listView.orderStatusList
        if (statusList.length === 0) {
            const { data } = await axios.get(apiMappings.common.getOrderStatus)
            statusList = data.map((entry: any) => {
                return {
                    label: dynamicLabels ? dynamicLabels?.[entry?.clientRefMasterDesc] : entry?.clientRefMasterDesc,
                    value: entry?.name,
                    id: entry?.reasonCd,
                    title: entry?.clientRefMasterDesc
                }
            })

        }
        if (statusList.length > 0) {
            const newStatus = statusList.map((status: any) => {
                return { ...status, label: dynamicLabels ? dynamicLabels?.[status?.label] : status.label }
            })
            return newStatus
        } else {
            return []
        }
    },
    paymentType: async () => {
        let paymentType: any = store.getState().orderRequest.listView.paymentType
        if (paymentType.length === 0) {
            const { data } = await axios.get(apiMappings.common.getPaymentType)
            paymentType = data.map((entry: any) => {
                return {
                    label: entry?.clientRefMasterDesc,
                    value: entry?.clientRefMasterCd,
                    id: entry?.reasonCd,
                    title: entry?.clientRefMasterDesc
                }
            })

        }
        if (paymentType.length > 0) {
            return paymentType
        } else {
            return []
        }
    },
    serviceType: async () => {
        let serviceType: any = store.getState().orderRequest.listView.serviceType
        if (serviceType.length === 0) {
            const { data } = await axios.get(apiMappings.common.getServiceType)
            serviceType = data.map((entry: any) => {
                return {
                    label: entry?.clientRefMasterDesc,
                    value: entry?.clientRefMasterCd,
                    id: entry?.reasonCd,
                    title: entry?.clientRefMasterDesc
                }
            })

        }
        if (serviceType.length > 0) {
            return serviceType
        } else {
            return []
        }
    },
}
export default OrderRequestDropdownOption