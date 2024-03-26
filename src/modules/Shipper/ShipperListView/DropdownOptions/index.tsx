import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import store from '../../../../utils/redux/store'
import { IPriorityList, IRequestConversionList, IServiceAreaProfileNameList, IStatusList } from '../ShipperListView.models'

const SHIPPER_DROPDOWN_OPTIONS = {
    status: async (dynamicLabels: Record<string, string>) => {
        let statusList = store.getState().shipper.listView.statusList
        if (statusList.length === 0) {
            const { data } = await axios.get(apiMappings.shipper.listView.getShipperStatus)
            statusList = data
        }
        const newMap: any = []
        statusList?.forEach((shipper: IStatusList) => {
            newMap.push({
                label: dynamicLabels?.[shipper.name],
                value: shipper?.clientRefMasterCd,
                title: dynamicLabels?.[shipper.clientRefMasterDesc],
                clientRefMasterCd: shipper?.clientRefMasterCd,
                id: shipper?.name,
            })
        })
        if (newMap.length > 0) {
            return newMap
        } else {
            return []
        }
    },
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels?.active) {
            return [
                { value: 'Y', label: dynamicLabels.active, title: dynamicLabels.active },
                { value: 'N', label: dynamicLabels.inactive, title: dynamicLabels.inactive }
            ]
        } else {
            return []
        }
    },
    priority: async () => {
        let priorityList = store.getState().shipper.listView.priorityList
        if (priorityList.length === 0) {
            const { data: { data: priorityData } } = await axios.get(apiMappings.shipper.listView.priority)
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
    bookingToOrder: async () => {   // in shipper structure service response getting orderrequestconversion as bookingToOrder
        let reqConvList = store.getState().shipper.listView.requestConversionList
        if (reqConvList.length === 0) {
            const { data: { data: reqConvData } } = await axios.get(apiMappings.shipper.listView.requestconversion)
            reqConvList = reqConvData?.map((requestConv: IRequestConversionList) => {
                return {
                    id: requestConv?.clientRefMasterId,
                    label: requestConv?.clientRefMasterDesc,
                    value: requestConv?.clientRefMasterCd,
                    type: requestConv?.clientRefMasterType,
                }
            })
        }
        if (reqConvList.length > 0) {
            return reqConvList
        } else {
            return []
        }
    },
    serviceAreaProfileName: async () => {  
        let servProfList = store.getState().shipper.listView.serviceProfileNameList
        if (servProfList.length === 0) {
            const { data: { data: reqConvData } } = await axios.get(apiMappings.common.lookup.getServiceAreaProfileNames)
            servProfList = reqConvData?.map((requestConv: IServiceAreaProfileNameList) => {
                return {
                    id: requestConv?.serviceAreaProfileId,
                    label: requestConv?.serviceAreaProfileName,
                    value: requestConv?.serviceAreaProfileName,
                    type: requestConv?.serviceAreaProfileName,
                }
            })
        }
        if (servProfList.length > 0) {
            return servProfList
        } else {
            return []
        }
    }

}


export default SHIPPER_DROPDOWN_OPTIONS