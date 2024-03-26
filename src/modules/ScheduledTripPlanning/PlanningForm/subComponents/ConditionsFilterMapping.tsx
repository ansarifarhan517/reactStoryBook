import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import { timeWindowConfirmedByArray } from '../../../../utils/constants';
import store from '../../../../utils/redux/store';

const TripPlanningSchedulerOptionsMapping = {
    branchName: async () => {
      const branchList =
        store.getState().tripPlanningScheduler.form.data.branchList;

      if (branchList?.length === 0) {
        const { data } = await axios.get(
          apiMappings.deliveryMedium.listView.getDistributionCenterBranch,
          {
            url: apiMappings.deliveryMedium.listView
              .getDistributionCenterBranch,
            data: {},
            params: {},
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );

        const returnBranchList = data?.map((branches: any) => ({
          label: branches?.name,
          value: branches?.name,
          id: branches?.branchId,
          title: branches?.name,
        }));

        return returnBranchList;
      } else if (branchList?.length > 0) {
        const returnBranchList = branchList?.map((branches: any) => ({
          label: branches?.name,
          value: branches?.name,
          id: branches?.branchId,
          title: branches?.name,
        }));
        return returnBranchList;
      } else {
        return [];
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
  
    status:
    async (dynamicLabels: Record<string, string>) => {
        return [
          { value: 'true', label: dynamicLabels.active },
          { value: 'false', label: dynamicLabels.inactive }
        ]
    },
      orderType: async () => {
          return [
            { value: 'DELIVER', label: "Delivery" },
            { value: 'PICKUP', label: "Pickup" }
          ]
        },
      orderStatus: async (dynamicLabels: Record<string, string>) => {
        let status = []
        
          const { data } = await axios.get(apiMappings.order.listView.orderStatus)
          store.dispatch({ type: '@@orderListView/SET_ORDER_STATUS', payload: { orderStatus: data } });
          status = data.map((entry: any) => {
            return {
              label: dynamicLabels[entry?.clientRefMasterDesc],
              value: entry?.reasonCd,
              id: entry?.reasonCd,
              title: entry?.clientRefMasterDesc
            }
          })
          return status;
        
      },
      orderState: async (dynamicLabels: Record<string, string>) => {
        return [
          { value: 'FORWARD', label: dynamicLabels['FORWARD'] || 'FORWARD' },
          { value: 'RETURN', label: dynamicLabels['RETURN'] || 'RETURN' },
          { value: 'REVERSE', label: dynamicLabels['REVERSE'] || 'REVERSE' },
        ]
      },
      hubScanStatus: async (dynamicLabels: Record<string, string>) => {
        return [
          { value: "NOTSCANNED", label: dynamicLabels["NOTSCANNED"] || "NOTSCANNED" },
          { value: "INSCANNED", label: dynamicLabels["INSCANNED"] || "INSCANNED"},
          { value: "OUTSCANNED", label: dynamicLabels["OUTSCANNED"]|| "OUTSCANNED" },
          { value: "HANDEDOVER", label: dynamicLabels["HANDEDOVER"] || "HANDEDOVER"},
          { value: "CLOSED", label: dynamicLabels["CLOSED"] || "CLOSED"},
        ]
      },
      priority: async () => {
        const priority = store.getState().order.listView.priority
        if (priority.length>0) {
          const dropdown = Object(priority).map(function (value: any) {
            return { value: value.clientRefMasterCd, label: value.clientRefMasterDesc }
          })
          return dropdown;
        } else {
          const  {data : {data}}  = await axios.get( apiMappings.common.lookup.priority);
          const options = data.map((value)=> ({
            value: value.clientRefMasterCd, label: value.clientRefMasterDesc ,...value
          }))
          return options
        }
      },
      timeWindowConfirmedBy: async () => {
        return timeWindowConfirmedByArray
      },
      deliveryType: async () => {
        
          let deliveryType = {};
          const { data } = await axios.get("ClientApp/client/getByTypeAndId?type=DELIVERYTYPE")
          deliveryType = data.map((entry: any) => {
            return {
              label: entry?.clientRefMasterCd,
              value: entry?.clientRefMasterCd,
              id: entry?.clientRefMasterCd,
              title: entry?.clientRefMasterCd
            }
          })
          return deliveryType;
      },
      serviceType: async () => {
          let serviceType = {};
          const { data } = await axios.get("ClientApp/client/getByTypeAndId?type=SERVICETYPE")
          store.dispatch({ type: '@@orderListView/SET_SERVICE_TYPE', payload: { serviceType: data } });
          serviceType = data.map((entry: any) => {
            return {
              label: entry?.clientRefMasterDesc,
              value: entry?.clientRefMasterCd,
              id: entry?.clientRefMasterCd,
              title: entry?.clientRefMasterDesc
            }
          })
          return serviceType;
        
      },
  
      serviceTypeCd: async () => {
        const serviceType = store.getState().order.listView.serviceType
        if(serviceType.length) {
          const dropdown = Object(serviceType).map(function (value: any) {
            return { value: value.clientRefMasterCd, label: value.clientRefMasterDesc }
          })
          return dropdown
         }
      },
      geofenceName: async () => {
        const geogence = store.getState().order.listView.geofence;
        if (geogence.length) {
          return Object(geogence).map(function (value: any) {
            return { value: value.geofenceName, label: value.geofenceName }
          })
        } else {
          let geofenceName = {}
          const { data } = await axios.get('LookupApp/geofece/list')
          geofenceName = data?.data?.map((entry: any) => {
            return {
              "label": entry?.geofenceName,
              "value": entry?.geofenceName,
              "id": entry?.geofenceName,
              "title": entry?.geofenceName
            }
          })
          store.dispatch({
            type: "@@orderListView/SET_GEOFENCE",
            payload: data?.data
          })
          return geofenceName;
        }
      },
      optimizedPackingStatusCd: async () => {
        let optimizedPackingStatusCd = {}
        const { data } = await axios.get('/ClientApp/client/getByTypeAndId?type=OPTIMIZEPACKINGSTATUSCD')
        optimizedPackingStatusCd = data.map((entry: any) => {
          return {
            "label": entry?.clientRefMasterDesc,
            "value": entry?.clientRefMasterCd,
          }
        })
        return optimizedPackingStatusCd;
      },
      isGeocoded: async (dynamicLabels: Record<string, string>) => {
        return [
          { label: dynamicLabels.yes || "Yes", value: true },
          { label: dynamicLabels.no || "No", value: "false" },
        ]
      },
      Origin: async (dynamicLabels: Record<string, string>) => {
        return [
          { label: dynamicLabels.branch || "Hub", value: 'hub' },
          { label: dynamicLabels.deliveryAssociate? (dynamicLabels.deliveryAssociate+' '+ dynamicLabels.address) : 'Delivery Associate Address' || "No", value: "deliveryAssociateAddress" },
        ]
      },
      movementType : async (dynamicLabels: Record<string, string>) => {
        return  [ 
          {
          id: "OHIH",
          value: "OHIH",
          label: dynamicLabels.OHIH_LABEL,
          name: dynamicLabels.OHIH_LABEL,
          clientRefMasterCd: "OHIH",
          },
          {
              id: "DHLM",
              value: "DHLM",
              label: dynamicLabels.DHLM_LABEL,
              name: dynamicLabels.DHLM_LABEL,
              clientRefMasterCd: "DHLM",
          },
          {
              id: "FMOH",
              value: "FMOH",
              label: dynamicLabels.FMOH_LABEL,
              name: dynamicLabels.FMOH_LABEL,
              clientRefMasterCd: "FMOH",
          },
      ]



      },
      detailedOrderStatusCd: async () => {
        let detailedOrderStatusCd = {}
        const { data } = await axios.get(apiMappings.common.lookup.detailedOrderStatusCd)
        detailedOrderStatusCd = data.map((entry: any) => {
          return {
            "label": entry?.name,
            "value": entry?.name,
            "id": entry?.clientRefMasterCd,
            "name": entry?.name,
            "clientRefMasterCd": entry?.clientRefMasterCd,

          }
        })
        return detailedOrderStatusCd;
      },
      
}


export default TripPlanningSchedulerOptionsMapping