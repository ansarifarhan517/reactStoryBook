import { IFetchedDropdownOptions } from './interface';
import { IMongoFormStructure } from './../../mongo/interfaces';
import axios from "../../axios"
import apiMappings from "../../apiMapping"
import { IMongoField } from "../../mongo/interfaces"
import { toTitleCase } from '../../core';
import { metricsConversion } from '../../helper';
import { tConversionType } from '../../common.interface';
import store from '../../redux/store';

export const fetchPostDropdownOptions = async (lookupType: string, dynamicVar?:any, payload: any = null): Promise<IFetchedDropdownOptions> => {
  const getParams = () => {
    if (lookupType === 'getVehiclesList') {
      return {
        pageNumber: 1,
        pageSize: 50,
        ...(dynamicVar && {
          searchBy: "vehicleNumber",
          searchText: dynamicVar.value
        })
      }
    }
    if(lookupType === 'getEndedTrips'){
      return {
        fromDate: dynamicVar.startDate,
        toDate: dynamicVar.endDate
      }
    }
    if (lookupType === 'getDAList') {
      return {
        pageNumber: 1,
        pageSize: 50,
        ...(dynamicVar && {
          searchBy: "deliveryMediumMasterName",
          searchText: dynamicVar.value
        })
      }
    }
    if (lookupType === 'getTripsBetweenDates') {
      return {
        startDateFilter: dynamicVar.startDate,
        endDateFilter: dynamicVar.endDate,
        pageNumber: 1,
        pageSize: 50,
        ...(dynamicVar && {
          searchText: dynamicVar.value
        })
      }
    }
    return {}
  }
  
  const { data, status } = await axios.post(`${apiMappings.common.lookup[lookupType || ""]}`, payload, 
  {
    params: { ...getParams() }
  });

  if (status == 200) {
    switch (lookupType) {
      case "getEndedTrips": 
      case "getTripsBetweenDates": {
        const mapping = {};
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.tripId}`] = { ...option, id: option.tripId, name: option.tripName };
            return {
              label: option.tripName,
              value: option.tripId,
            };
          }),
          mapping,
        };

      }
      case "getVehiclesList": {
        const mapping = {};
        return {
          options: data.data.results.map((option: any) => {
            mapping[`${option.vehicleId}`] = option;
            return {
              label: option.vehicleNumber,
              value: option.vehicleId,
            };
          }),
          mapping,
        };
      }
      case "getDAList": {
        const mapping = {};
        return {
          options: data.data.results.map((option: any) => {
            mapping[`${option.deliveryMediumMasterId}`] = option;
            return {
              label: option.deliveryMediumMasterName,
              value: option.deliveryMediumMasterId,
            };
          }),
          mapping,
        };
      }
      case "getBranchVehiclesList": {
        const mapping = {};
        return {
          options: data.map((option: any) => {
            mapping[`${option.vehicleId}`] = option;
            return {
              label: option.vehicleNumber,
              value: option.vehicleId,
            };
          }),
          mapping,
        };
      }
      case "getBranchDAList": {
        const mapping = {};
        return {
          options: data.map((option: any) => {
            mapping[`${option.deliveryMediumMasterId}`] = option;
            return {
              label: option.deliveryMediumMasterName,
              value: option.deliveryMediumMasterId,
            };
          }),
          mapping,
        };
      }
      case "getBranchDriversList": {
        const mapping = {};
        return {
          options: data.map((option: any) => {
            mapping[`${option.driverId}`] = option;
            return {
              label: option.driverName,
              value: option.driverId,
            };
          }),
          mapping,
        };
      }
      default: {
        const mapping = {};
        return {
          options: data.map((option: any) => {
            mapping[`${option.id}`] = option;
            return { label: option.name, value: option.id };
          }),
          mapping,
        };
      }
    }
  } else {
    const mapping = {};
    return {
      options: [],
      mapping,
    };
  }
};



export const fetchDropdownOptions = async (lookupType: string, dynamicVar?: any, dependentVar? : string): Promise<IFetchedDropdownOptions> => {
  const getParams = () => {
    if (dynamicVar) {
      if (lookupType === 'getStates') {
        return {
          type: 'STATE',
          id: dynamicVar
        }
      }
      if (lookupType === 'getDistributionCenter') {
        return {
          clientId: dynamicVar.id
        }
      }

      if (lookupType === 'getDistributionCenterUserForm') {
        return {
          clientId: dynamicVar.id
        }
      }

      if (lookupType === 'getClient') {
        return {
          clientId: dynamicVar.id,
          isSuperFl: dynamicVar.isSuperFl
        }
      }

      if (lookupType === 'getSubClientParentBranch') {

        return {
          clientId: dynamicVar.id,
          isSuperFl: dynamicVar.isSuperFl
        }
      }
      if (lookupType === 'getSuperClientParentBranch') {
        return {
          clientId: dynamicVar.id,
          isSuperFl: dynamicVar.isSuperFl
        }
      }

      if (lookupType === 'getPincode') {
        return {
          pincode: dynamicVar.pincode,
          countryId: dynamicVar.country
        }
      }

      if (lookupType === 'getRateChartNames') {
        return {
          serviceAreaProfileId: dynamicVar.serviceAreaProfileId || dynamicVar.id,
        }
      }
      if (lookupType === 'getProfileList') {
        return {
          type: dynamicVar,
        }
      }
      if (lookupType === 'getTimeZone') {
        return {
          countrynames: dynamicVar.name,
        }
      }
      if (lookupType === 'accessProfileIds') {
        let mobile: string='MOBILE'
        return {
          accessProfileType : mobile,
        }
      }

      if(lookupType === 'getOrdersByTrips') {
        return {dmid: dynamicVar.id}
      }
      if(lookupType === 'getUnlinkedTrackers') {
        return {
          clientBranchId: dynamicVar.clientBranchId,
          vehicleId: dynamicVar.vehicleId
        }
      }
    }
    if (lookupType === 'getUserGroup') {
      const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
      let clientID: number = userAccessInfo['clientId']
      return {
        clientId: clientID
      }
    }

    if (lookupType === 'orgRoleLandingPage') {
      const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
      let modeltype: string = "LANDINGPAGE_" + userAccessInfo['modelType']
      return {
        type: modeltype
      }
    }
    if (lookupType === 'getcustomer' && dynamicVar) {
      return {
        accountCode: dynamicVar
      }
    }
    if (lookupType === 'pickupAddressId' || lookupType === 'deliverAddressId' || lookupType === 'AddressId' || lookupType === 'returnAddressId') {
      return {
        addressId: dynamicVar,
        accountCode: dependentVar
      }
    }
    if (lookupType === 'getReportingManagerList') {
      return {
        userGroupId: dynamicVar
      }
    }

    if(lookupType === 'getOrderTypes' || lookupType === 'getOrderLocations') {
      const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
      let modeltype: string = "CUSTOMFORMORDERTYPE_" + userAccessInfo['modelType']
      return {
        type: modeltype
      }
    }

    if (lookupType === 'getBranches') {
      // if(dynamicVar.length > 0) {
      return {
        branchName: dynamicVar,
        search:  true
      }
    }

    if(lookupType === 'getDistributionCenterSubBranch') {
      return {
        branchName : dynamicVar,
        search:true
      }
    }


    if(lookupType === 'getServiceTypeDetails') {
      const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
      let clientId: number = userAccessInfo['clientId']
      return {
        clientId,
        branchId: dynamicVar
      }
    }
    if(lookupType === 'getModelTypes') {
      return {
      clientId:dynamicVar
      }
    }
    if (lookupType === 'getDriversList') {
      return {
        pageNumber: 1,
        pageSize: 50,
        ...(dynamicVar && {
          searchBy: "driverName",
          searchText: dynamicVar
        })
      }
    }
    if (lookupType === 'getAttachedTrackerIds') {
      return {
        tripId: dynamicVar.tripId
      }
    }

    return {}
  }


  const subClientId = dependentVar && dependentVar.id ? '?subClientId='+dependentVar.id : ''
  const { data, status } = await axios.get(`${apiMappings.common.lookup[lookupType || '']}`+subClientId, {
    data: {},
    params: {
      ...getParams()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (status == 200) {
    switch (lookupType) {
      case 'getIndustryTypes':
        {
          let filteredList = store.getState().saas.onboarding.structure.configurationSteps[1].questions[0].options
         const filtered = data.data.filter(option =>{
           return !filteredList.filter(structure => structure.optionValue === option.clientRefMasterCd).length
         })
          const mapping = {}
          return {
            options: filtered.map((option: any) => {
              mapping[option.clientRefMasterCd] = { ...option, id: option.clientRefMasterCd, name: option.clientRefMasterDesc, _id: option.clientRefMasterId }
              return { label: option.clientRefMasterDesc, value: option.clientRefMasterCd }
            }),
            mapping
          }
        }
      case 'getSuperClients':
        { 
          if (data && data.length > 0) {
            const mapping = {}
            return {
              options: data.map((option: any) => {
                mapping[`${option.clientId}`] = {
                  ...option,
                  id: option.clientId
                }
                return { label: option.name, value: option.clientId, referenceId: option.referenceId }
              }),
              mapping
            }
         }
        }

      case 'getPincode':
        { 
          if (data && data.length > 0) {
            const mapping = {}
            return {
              options: data.map((option: any) => {
                mapping[`${option.pincodeId}`] = {
                  ...option,
                  id: option.pincodeId
                }
                return { label: option.name, value: option.pincodeId }
              }),
              mapping
            }
         }
        }
      case 'getUnassignVehicles':
        {
          const mapping = {}
          return {
            options: data.data.map((option: any) => {
              mapping[`${option.id}`] = option
              return { label: option.name, value: option.id }
            }),
            mapping
          }
        }
      case 'getLicense':
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[`${option.id}`] = option
              return { id: option.id, label: option.value, value: option.id }
            }),
            mapping
          }
        }
      case 'languageLookup':
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[option.name] = { ...option, id: option.name, name: option.name, _id: option.id }
              return { label: toTitleCase(option.name).replace('(u', '(U'), value: option.name }
            }),
            mapping
          }
        }

      case 'getDistributionCenter':
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[`${option.id}`] = option
              return { label: option.name, value: option.id, title: option.branchDescription || option.name }
            }),
            mapping
          }
        }
      case 'getTimezoneList': {
        const mapping = {}
        const filterData = data.filter((zone: { gmtoffset: string, canonicalId: string; }) => !!zone.gmtoffset)
        return {
          options: filterData.map((option: any) => {
            mapping[`${option.gmtoffset}`] = {...option, id: option.gmtoffset, name: option.gmtoffset}
            return { label: option.gmtoffset, value: option.gmtoffset }
          }),
          mapping
        }
      }
      case 'getVendorList': {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.clientCoLoaderId}`] = option
            return { label: option.name, value: option.clientCoLoaderId }
          }),
          mapping
        }
      }

      case 'getSubClientParentBranch': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.id}`] = option
            return { label: option.name, value: option.id }
          }),
          mapping
        }
      }

      case 'getVehicleType': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }

      case 'getOwnership': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            let newOptionArray = { ...option }
            newOptionArray['id'] = newOptionArray.name
            mapping[`${option.name}`] = newOptionArray
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }
      case 'getVehiclePermits': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }
      case 'fleetType': {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.id}`] = option
            return {
              label: option.type, value: option.id,
              make: option.make
            }
          }),
          mapping
        }
      }
      case 'delMedType': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }
      case 'weeklyOff': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }

      case 'getMovementType': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }

      case 'getTypeOfBody': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
          }),
          mapping
        }
      }

      case 'getUnattachedTrackers': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.deviceId
            mapping[`${option.deviceId}`] = arr
            return { label: option.barcode, value: option.deviceId }
          }),
          mapping
        }
      }

      case 'getDistributionCenterSubBranch':
        {
          let allBranches: any = window.localStorage.getItem('userAccessInfo');
          allBranches = store.getState().globals?.clientBranches
          const branches: any = []
          allBranches.forEach((b: any) => {
            const find = data.find((d: any) => d.id === b)
            find && branches.push(find)
          })
          const mapping = {}

          return {
            options: branches.map((option: any) => {
              mapping[`${option.id}`] = option
              return { label: option.name, value: option.id, title: option.branchDescription || option.name }
            }),
            mapping
          }
        }
          case 'getDistributionCenterSubBranch':
            {
              let allBranches: any =  window.localStorage.getItem('userAccessInfo');
              allBranches = store.getState().globals?.clientBranches
              const branches:any = []
              allBranches.forEach((b:any) => {
                const find = data.find((d:any) => d.id === b)
                find && branches.push(find)
              })
              const mapping = {}
    
              return {
                options: branches.map((option: any) => {
                  mapping[`${option.id}`] = option
                  return { label: option.name, value: option.id, title: option.branchDescription || option.name }
                }),
                mapping
              }
            }
    
           
    
            case 'getTimeZone': {
              const mapping = {}
              return {
                options: data[0]?.timezoneList?.map((option: any) => {
                  let arr = {...option}
                  arr['id'] = arr.timezoneId
                  mapping[`${option.timezoneId}`] = arr
                  return { label: option.gmtoffset, value: option.timezoneId }
                }),
                mapping
              }
            }
    
            case 'getDateFormats': {
              const mapping = {}
              return {
                options: data?.map((option: any) => {
                  let arr = {...option}
                  arr['id'] = arr.id
                  mapping[`${option.id}`] = arr
                  return { label: option.name.toUpperCase(), value: option.id }
                }),
                mapping
              }
            }
        

      case 'accessProfileIds':
        {
          const mapping = {}
          return {
            options: data.data.map((option: any) => {
              mapping[option.accessprofileName] = { ...option, id: option.accessprofileName, name: option.accessprofileName, description: option.accessprofileDesc, _id: option.accessProfileRefId }
              return { label: option.accessprofileName, value: option.accessprofileName, description: option.accessprofileDesc }
            }),
            mapping
          }
        }

        case 'rateTypeLookupDistance' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
            let arr = {...option}
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
            } ),
            mapping
          }
        }
        case 'rateTypeLookupWeight' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
            let arr = {...option}
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
            } ),
            mapping
          }
        }
        case 'rateTypeLookupVolume' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
            let arr = {...option}
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name }
            } ),
            mapping
          }
        }

        case 'getSkillType' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
              let arr = {...option}
              arr['id'] = arr.name
              mapping[`${option.name}`] = arr
              return { label: option.name, value: option.name }
              } ),
            mapping
          }
        }
        case 'getFeesType' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
            let arr = {...option}
            arr['id'] = arr.name
            mapping[`${option.name}`] = arr
            return { label: option.name, value: option.name, id: option.name, name: option.name }
            } ),
            mapping
          }
        }

        case 'getChargeType' : {
          const mapping = {} 
          return {
            options: data.map((option:any) => {
              let arr = {...option}
              arr['id'] = arr.name
              mapping[`${option.name}`] = arr
              return { label: option.name, value: option.name }
              } ),
            mapping
          }
        }
      

   
      case 'getUserGroup': {
        const mapping = {}

        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.id
            mapping[`${option.id}`] = arr
            return { label: option.name, value: option.id }
          }),
          mapping
        }
      }

      case 'persona': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.clientRefMasterCd
            mapping[`${option.clientRefMasterCd}`] = arr
            return { label: option.name, value: option.clientRefMasterCd }
          }),
          mapping
        }
      }

      case 'orgRoleLandingPage': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            let arr = { ...option }

            arr['id'] = arr.clientRefMasterCd
            mapping[`${option.clientRefMasterCd}`] = arr
            return { label: option.name, value: option.clientRefMasterCd }
          }),
          mapping
        }
      }

      case 'getReportingManagerList' : {
        const mapping = {}
        const resp = data.results
        return {
          options: resp.map((option: any) => {
            mapping[`${option.userId}`] = option
            return { label: option.userName, value: option.userId }
          }),
          mapping
        }
      }

      case 'getBusinessDeliveryManager' : 
      case 'getAccountManager' :
      case 'getOperationManager' : {
        const mapping = {}
        const resp = data
        return {
          options: resp.map((option: any) => {
            mapping[`${option.id}`] = option
            return { label: option.displayName, value: option.id }
          }),
          mapping
        }
      }

      case 'getServiceAreaProfileNames' :   {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.serviceAreaProfileId
            mapping[`${option.serviceAreaProfileId}`] = arr
            return { label: option.serviceAreaProfileName, value: option.serviceAreaProfileId }
          }),
          mapping
        }
      } 
      
      case 'priority' :   {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.clientRefMasterCd
            mapping[`${option.clientRefMasterCd}`] = arr
            return { label: option.clientRefMasterDesc, value: option.clientRefMasterCd }
          }),
          mapping
        }
      } 

      case 'getRateChartNames' :   {
        const mapping = {}
        return {
          options: data?.data?.map((option: any) => {
            let arr = { ...option }
            arr['id'] = arr.rateChartName
            mapping[`${option.rateChartName}`] = arr
            return { label: option.rateChartName, value: option.rateChartName }
          }),
          mapping
        }
      }

      case 'getTimeZone': {
        const mapping = {}
        return {
          options: data[0]?.timezoneList?.map((option: any) => {
            let arr = {...option}
            arr['id'] = arr.timezoneId
            mapping[`${option.timezoneId}`] = arr
            return { label: option.gmtoffset, value: option.timezoneId }
          }),
          mapping
        }
      }

      case 'getDateFormats': {
        const mapping = {}
        return {
          options: data?.map((option: any) => {
            let arr = {...option}
            arr['id'] = arr.id
            mapping[`${option.id}`] = arr
            return { label: option.name.toUpperCase(), value: option.id }
          }),
          mapping
        }
      }
      case 'crateNameList': {
        const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[`${option}`] = {
                id: option,
                name: option
              }
              return { label: option, value: option }
            }),
            mapping
          }
      }
      case 'paymentMode':
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
            mapping[`${option.clientRefMasterId}`] = {
              ...option,
              id: option.clientRefMasterId
            }
            return { label: option.clientRefMasterDesc, value: option.clientRefMasterId }
            }),
          mapping
          }
        }
      case 'getcustomer':
        {
          const mapping = {}
          return {
            options: data.data.map((option: any) => {
              mapping[`${option.accountCode}`] = {
                ...option,
                id: option.customerId,
                name: option.accountCode
              }
              return { label: `${option.accountCode} (${option.isActiveFl ? 'Active' : 'Inactive'})`, value: option.accountCode, title: `${option.accountCode} (${option.isActiveFl ? 'Active' : 'Inactive'})`, description: option.accountName, customerPhone: option.customerPhone, emailAddress: option.emailAddress, isActiveFl: option.isActiveFl }
            }),
            mapping
          }
        }
      case 'pickupAddressId':
      case 'deliverAddressId':
      case 'AddressId':
      case 'returnAddressId':
        {
          const mapping = {}
          return {
            options: data?.map((option: any) => {
              mapping[`${option.clientNodeId}`] = { ...option, id: option.clientNodeId }
              return {label: `${option.clientNodeAddressCd}`, value: option.clientNodeId, title: `${option.clientNodeAddressCd}(${option.isActiveFl ? 'Active' : 'Inactive'})`, description: option.address}
            }) || [],
            mapping
          }
        }
      case 'getAutoAllocateProfileName':
        {
          const mapping = {}
          return {
            options: data.data.map((option: any) => {
              mapping[`${option.profileId}`] = {
                ...option,
                id: option.profileId
              }
              return { label: option.profileName, value: option.profileId }
            }),
            mapping
          }
        }

      case 'getServiceType': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.clientRefMasterId}`] = option
            return { label: option.clientRefMasterDesc, value: option.clientRefMasterId }
          }),
          mapping
        }
      }

      case  'getProfileList': {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.profileId}`] = option
            return { label: option.profileName, value: option.profileId }
          }),
          mapping
        }
      }
      case  'deliveryType': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.id}`] = option
            return { label: option.clientRefMasterCd, value: option.id }
          }),
          mapping
        }
      }

      case  'getLocationRestriction': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.clientRefMasterCd}`] = {...option, id: option.clientRefMasterCd}
            return { label: option.name, value: option.clientRefMasterCd }
          }),
          mapping
        }
      }
      case  'getRateProfile': {
        const mapping = {}
        return {
          options: data.data.map((option: any) => {
            let arr = {...option}
            arr['id'] = arr.id
            mapping[`${option.id}`] = option
            return { label: option.name, value: option.id }
          }),
          mapping
        }
      }
      case 'surgeTimingsDaysOfWeek' : {
        const mapping = {} 
        return {
          options: data.map((option:any) => {
          let arr = {...option}
          arr['id'] = arr.name
          mapping[`${option.name}`] = arr
          return { label: option.name, value: option.name, id: option.name, name: option.name }
          } ),
          mapping
        }
      }
      
      case  'getLocationRestriction': {
        const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.clientRefMasterCd}`] = {...option, id: option.clientRefMasterCd}
            return { label: option.name, value: option.clientRefMasterCd }
          }),
          mapping
        }
      }

      case 'temperatureCategory' : {
        const mapping = {} 
        return {
          options: data.map((option:any) => {
          let arr = {...option}
          arr['id'] = arr.name
          mapping[`${option.name}`] = arr
          return { label: option.name, value: option.name, id: option.name, name: option.name }
          } ),
          mapping
        }
      }
      case  'getUsersList': {
        const mapping = {}
        
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.userName}`] = {...option, id: option.userName, name:option.userName}
            return { label: option.userName, value: option.userName }
          }),
          mapping
        }
      }
      case  'getTerritoryProfileListing':
      case  'getPlanningProfiles': {
        const mapping = {}
        
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.profileId}`] = {...option, id: option.profileId, name:option.profileName }
            return { label: option.profileName, value: option.profileId }
          }),
          mapping
      }
    }
    case 'getManifestTypeList': {
      const mapping = {}
      return {
        options: data.data.map((option: any) => {
          mapping[`${option.clientRefMasterId}`] = {...option, id: option.clientRefMasterId, name:option.clientRefMasterCd}
          return { label: option.clientRefMasterCd, value: option.clientRefMasterId }
        }),
        mapping
      }
    }
    case 'getOutscanBy':
    case 'getInscanBy': {
      const mapping = {}
      return {
        options: data.map((option: any) => {
          mapping[`${option.clientRefMasterId}`] = {...option, id: option.clientRefMasterId, name:option.clientRefMasterDesc}
          return { label: option.clientRefMasterDesc, value: option.clientRefMasterId }
        }),
        mapping
      }
    }
      
      case  'getServiceTypeDetails': {
        const mapping = {}
        
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.serviceTypeDetailsId}`] = {...option, id: option.serviceTypeDetailsId, name:option.serviceTypeName }
            return { label: option.serviceTypeName, value: option.serviceTypeDetailsId }
          }),
          mapping
        }
      }
      
    case 'getDeliveryBoys': {
      const mapping = {}
      return {
        options: data.data.map((option: any) => {
          mapping[`${option.deliveryMediumId}`] = {...option, id: option.deliveryMediumId, name:option.deliveryMediumName}
          return { label: option.deliveryMediumName, value: option.deliveryMediumId }
        }),
        mapping
      }
    }
    
    case 'getOrdersByCourier': {
      const mapping = {}
      return {
        options: data.data.map((option: any) => {
          mapping[`${option.clientCoLoaderId}`] = {...option, id: option.clientCoLoaderId, name:option.name}
          return { label: option.name, value: option.clientCoLoaderId }
        }),
        mapping
      }
    }
    case 'getOrdersByTrips': {
      const mapping = {}
      return {
        options: data.data.map((option: any) => {
          mapping[`${option.id}`] = {...option, id: option.id, name:option.name}
          return { label: option.name, value: option.id }
        }),
        mapping
      }
    }
    case 'getHolidayCalendar': {
      const mapping = {}
      return {
        options: data.data.templateList[0].defaultCalendar.map((option: any) => {
          mapping[`${option.calendarId}`] = {...option, id: option.calendarId}
          return { label: option.calendarName, value: option.calendarId }
        }),
        mapping
      }
    }
    case 'crateNameMasterList': {
      const mapping = {}
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.crateId}`] = {
              id: option.crateId,
              name: option.crateName
            }
            return { label: option.crateName, value: option.crateId }
          }),
          mapping
        }
    }
    case 'getCompartmentList': {
      const mapping = {}
        return {
          options: data?.data?.map((option: any) => {
            mapping[`${option.compartmentId}`] = {id:option.compartmentId, name: option.compartmentName, capacityInUnits: option.capacityInUnits, capacityInVolume: option.capacityInVolume, capacityInWeight: option.capacityInWeight}
            return { label: option.compartmentName, value: option.compartmentId }
          }),
          mapping
        }
    }
    case 'getTrackerModels':{
      const mapping = {}
      return{
        options: data?.data?.map((option: any) => {
          mapping[`${option.trackerConfigId}`] = {id:option.trackerConfigId, name: option.trackerModel, supplierRefId :option.supplierRefId, supplierRefCd:option.supplierRefCd,trackerTypeRefId:option.trackerTypeRefId, trackerTypeRefCd: option.trackerTypeRefCd}
          return { label: option.trackerModel, value: option.trackerConfigId }
        }),
        mapping
      }
    }
    case 'getUnlinkedTrackers': {
      const mapping = {}
      return {
        options: data.map((option: any) => {
          let arr = { ...option }
          arr['id'] = arr.deviceId
          mapping[`${option.deviceId}`] = arr
          return { label: option.trackeeId, value: option.deviceId }
        }),
        mapping
      }
    }
    case 'getDistributionCenterUserForm':
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[`${option.id}`] = option
              return { label: option.name, value: option.id, title: option.branchDescription || option.name }
            }),
            mapping
          }
        }


    case 'getModelTypes' :{
      // const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
      // let modeltype: string = userAccessInfo['modelType']
      const mapping = {}
      return {
        options: data.map((option: any) => {
          mapping[`${option.clientRefMasterCd}`] = option
          return { label: option.clientRefMasterDesc, value: option.clientRefMasterCd }
        }),
        mapping
      }
    }

    case "getDaProfiles": {
      const mapping = {};
      return {
        options: data?.data?.map((option: any) => {
          mapping[`${option.id}`] = option;
          return {
            label: option.name,
            value: option.id
          }
        }),
        mapping,
      }
    }

    case 'accessProfileIds_web':
        {
          const mapping = {}
          return {
            options: data?.data.map((option: any) => {
              mapping[option.accessprofileName] = { ...option, id: option?.accessprofileName, name: option?.accessprofileName, description: option?.accessprofileDesc, _id: option?.accessProfileRefId }
              return { label: option?.accessprofileName, value: option?.accessprofileName, description: option?.accessprofileDesc }
            }),
            mapping
          }
        }

    case "getDaPayoutProfiles": {
      const mapping = {};
      return {
        options: data?.data?.map((option: any) => {
          mapping[`${option.id}`] = option;
          return {
            label: option.payoutProfileName,
            value: option.id
          }
        }),
        mapping,
      }
    }
    case "WEEKDAYS_LABEL": {
      const mapping = {}
        return {
          options: data.map((option: any) => {
            mapping[`${option.id}`] = option
            return { label: option.clientRefMasterCd, value: option.id }
          }),
          mapping
      } 
    }
    case "getDeliveryAssociatesList": {
      const mapping = {}
      return {
        options: data.data.map((option: any) => {
          mapping[`${option.deliveryMediumMasterId}`] = { ...option, id: option.deliveryMediumMasterId, name: option.deliveryMediumName }
          return { label: option.deliveryMediumName, value: option.deliveryMediumMasterId }
        }),
        mapping
      }
    }
    case "getDriversList": {
      const mapping = {}
      return {
        options: data.data.results.map((option: any) => {
          mapping[`${option.driverId}`] = { ...option, id: option.driverId };
          return { label: option.driverName, value: option.driverId }
        }),
        mapping
      }
    }
    case 'getEndedTrips':{
      const mapping = {}
      return {
        options: data.data.results.map((option: any) => {
          mapping[`${option.tripId}`] = { ...option, id: option.tripId };
          return { label: option.tripName, value: option.tripId }
        }),
        mapping
      }
    }

    case 'vehicle': {
      const mapping = {};
      return {
        options: data?.map((option: any) => {
          mapping[`${option.vehicleId}`] = option;
          return {
            label: option.vehicleNumber,
            value: option.vehicleId
          }
        }),
        mapping,
      }
    }
      case 'getDateSource': {
      const mapping = {};
      return {
        options: data?.map((option: any) => {
          mapping[`${option.clientRefMasterId}`] = option;
          return {
            label: option.clientRefMasterDesc,
            value: option.clientRefMasterId
          }
        }),
        mapping,
      }
    }
    case "getAttachedTrackerIds": {
        const mapping = {};
        return {
          options: data.data.map((option: any) => {
            mapping[`${option.trackeeId}`] = option;
            return {
              label: option.trackeeId,
              value: option.trackeeId,
            };
          }),
          mapping,
        };
      }
      default:
        {
          const mapping = {}
          return {
            options: data.map((option: any) => {
              mapping[`${option.id}`] = option
              return { label: option.name, value: option.id }
            }),
            mapping
          }
        }
    
       
    }
   }
   
  else {
    const mapping = {}
    return {
      options: [],
      mapping
    }
  }
}



function prepareSection(formStructure: Record<string, IMongoField>): Record<string, IMongoField> {
  let countryFieldName = ''
  let clientBranchName = '';
  Object.entries(formStructure).map(([fieldName, fieldStructure]) => {

    if (fieldStructure.lookupType === 'getCountries' || fieldStructure.lookupType === 'getLocale') {
       // getLocale comes from any field, we need only country fields
      if (fieldName.toLocaleLowerCase().indexOf("country") !== -1) {
        countryFieldName = fieldName
      } 
    }

    if (fieldStructure.lookupType === 'getStates' || fieldStructure.lookupType === 'getPincode') {
      fieldStructure.countryFieldName = `${countryFieldName}`
    }

    if (fieldStructure.fieldType === 'address') {
      fieldStructure.childNodes = prepareSection(fieldStructure.childNodes || {})
    }

    if (fieldStructure.lookupType === 'getClient') {
      clientBranchName = fieldName
    }

    if (fieldStructure.lookupType === 'getSuperClientParentBranch') {
      fieldStructure.clientBranchName = `${clientBranchName}`
    }
    if (fieldStructure.lookupType === 'getSubClientParentBranch') {
      fieldStructure.clientBranchName = `${clientBranchName}`
    }
    if(fieldStructure.fieldName === 'Pincode' && fieldStructure.fieldType === 'text'){
      fieldStructure.fieldType = 'select'
    }
  })
  return formStructure
}

export function prepareFormStructure(payload: IMongoFormStructure): IMongoFormStructure {
  Object.entries(payload)?.map(([sectionName, formStructure]) => {
    payload[sectionName] = prepareSection(formStructure)
  })

  return payload
}

export const prepareDataFromDropdownValue = (data: object[] | undefined) => {
    const mapping = {}
    return {
      options: data?.map((option: any) => {
        mapping[`${option.clientNodeId}`] = { ...option, id: option.clientNodeId }
        return {label: `${option.clientNodeAddressCd}`, value: option.clientNodeId, title: `${option.clientNodeAddressCd}(${option.isActiveFl ? 'Active' : 'Inactive'})`, description: option.address}
      }) || [],
      mapping
    }
}

export const unitSystemConversionCrateItem = (data: any, method: tConversionType) => {
  // const metrics = useTypedSelector(state => state.globals.metrics)
  const metrics =  store.getState().globals.metrics
  if (data?.crateWeight) {
    const clientObj = metrics && metrics['weight']
    let crateWeight = Number(metricsConversion(Number(data.crateWeight),method, clientObj?.conversionFactor).toFixed(4));
    data.crateWeight = String(valuePrecision(crateWeight));
}
if (data?.crateVolume) {
    const clientObj = metrics && metrics['volume']
    data.crateVolume = String(metricsConversion(Number(data.crateVolume),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.crateLength) {
    const clientObj = metrics && metrics['dimension']
    data.crateLength = String(metricsConversion(Number(data.crateLength),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.crateBreadth) {
    const clientObj = metrics && metrics['dimension']
    data.crateBreadth = String(metricsConversion(Number(data.crateBreadth),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.crateHeight) {
    const clientObj = metrics && metrics['dimension']
    data.crateHeight = String(metricsConversion(Number(data.crateHeight),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.itemWeight) {
  const clientObj = metrics && metrics['weight']
  let itemWeight = Number(metricsConversion(Number(data.itemWeight),method, clientObj?.conversionFactor).toFixed(4))
  data.itemWeight = String(valuePrecision(itemWeight));
}
if (data?.itemVolume) {
  const clientObj = metrics && metrics['volume']
  data.itemVolume = String(metricsConversion(Number(data.itemVolume),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.itemLength) {
  const clientObj = metrics && metrics['dimension']
  data.itemLength = String(metricsConversion(Number(data.itemLength),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.itemBreadth) {
  const clientObj = metrics && metrics['dimension']
  data.itemBreadth = String(metricsConversion(Number(data.itemBreadth),method, clientObj?.conversionFactor).toFixed(4))
}
if (data?.itemHeight) {
  const clientObj = metrics && metrics['dimension']
  data.itemHeight = String(metricsConversion(Number(data.itemHeight),method, clientObj?.conversionFactor).toFixed(4))
}
return data
}

export const valuePrecision = (value) => {
  if((value - Math.floor(value)).toFixed(4) === '0.9999'){
     return value = Math.ceil(value);
  } else if((value - Math.floor(value)).toFixed(4) === '0.0001'){
     return value = Math.floor(value);
  } else return value;
};

export const getFormattedDateBySlash = (date: Date) => {
  const todayTime = date
  const month = todayTime.getMonth() + 1
  const day = todayTime.getDate()
  const year = todayTime.getFullYear()
  return month + '/' + day + '/' + year
};