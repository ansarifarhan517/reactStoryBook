import { deepCopy } from "../../../utils/helper";
import { metricsConversion } from '../../../utils/helper'; 
import moment from 'moment'
import { number } from "prop-types";
const stepperConfig= [
  {
      stepName: "General",
      steplabelKey:'General',
      stepIcon: "images/general-planning.svg",
      summary: "",
      isActive:true,
      showPopover:false
  },
  {
      stepName: "Orders",
      steplabelKey:'orders',
      stepIcon: "images/routePlanning/orderSelection.svg",
      summary: "",
      isActive:false,
      showPopover:false
  },
  {
      stepName: "Owned Fleet",
      steplabelKey:'owned_fleet',
      stepIcon: "images/routePlanning/ownedFleet.svg",
      summary: "",
      isActive:false,
      showPopover:false
  },
  {
      stepName: "Outsourced Fleet",
      steplabelKey:'outSourced_fleet',
      stepIcon: "images/routePlanning/outsourcedFleet.svg",
      summary: "",
      isActive:false,
      showPopover:false,
      disableNext:true
  },
  {
      stepName: "Review",
      stepIcon: "images/routePlanning/review.svg",
      summary: "",
      isActive:false,
      showPopover:false
  },
]
export const initialState = {
  structure: {
    generalDetails:{},
    orderDetails:{},
    ownedFleet:{},
    outSourcedFleet:{},
    orderDetailsListViewStructure:{}
  },
  formData:{
    orderDetailsFilter:{},
    DAFilters:{},
    selectedTerritories:{}
  },
  data:{
    generalDetails:{},
    orderDetails:{},
    ownedFleet:{},
    outSourcedFleet:{},
    territoryProfilesList:[],
    territoryProfilesListTransformed:{},
    planningProfilesList:[],
    branchList:[]
  },
  loading: false,
  isEditMode: false,
  clientMetric: [],
  stepperConfig:stepperConfig,
  isShowAttachToTerritoriesModal:false,
  outsourcedFleetEditModeId:number
}

export const TripPlanningSchedulerFormReducer = (
  state: any = initialState,
  action: any): any => {

  switch (action.type) {
    case '@@planningForm/SET_GENERAL_STRUCTURE':
      return {
        ...state,
        structure:{...state.structure, generalDetails:{...state.structure.generalDetails,...action.payload}}
      }

    case '@@planningForm/SAVE_FORM_DATA':
      // if(state.form.isEditMode){
      //   const selectedTerritory= state.form.data.territoryProfilesList.filter((territory:any)=> territory.profileId==data?.data?.geofenceProfileId)
      //   const selectedPlanningProfile= state.form.data.planningProfilesList.filter((profile:any)=> profile.id==data?.data?.planningProfileId)
      //   const transformedData = {...action.payload, ...action.payload?.data,
      //     users:action.payload.userMapDto.map((user:any)=>{
      //       return {
      //         ...user,
      //         id:user.userId,
      //         name:user.userName,
      //         value:user.userId
      //       }    
      //   }),
      //   territoryProfile: {...selectedTerritory, id:selectedTerritory?.[0].profileId, name:selectedTerritory?.[0].profileName, value: selectedTerritory?.[0].profileId},
      //   planningProfile: {...selectedPlanningProfile,id:selectedPlanningProfile?.[0].profileId, name:selectedPlanningProfile?.[0].profileName, value:selectedPlanningProfile?.[0].profileId }
      //   }
      //   return {
      //     ...state,
      //     formData:{...state.formData, transformedData}
      //   }
      // }
        return {
          ...state,
          formData:{...state.formData, ...action.payload}
        
      }
    case '@@planningForm/UPDATE_FORM_DATA':
      var branchList = state.data.branchList;
      const selectedBranches = branchList?.filter((branch:any)=> action.payload.data.branches?.includes(branch.id))
      const tempOwnedFleetObject= {}
      action.payload.data?.ownedFleet ? 
        action.payload.data?.ownedFleet.map((fleet:any)=>{
          tempOwnedFleetObject[fleet.deliveryMediumMasterId]={...fleet}
      })
      :{};

      const tempOutSourcedFleetObject= {}
      const attachedTerritoriesTemp={}
      action.payload.data?.outsourcedFleet ? 
        action.payload.data?.outsourcedFleet.map((fleet:any)=>{
          tempOutSourcedFleetObject[fleet.fleetTypeId+'_'+fleet.clientBranchId+'_'+fleet.clientCoLoaderId]=
          {...fleet,
          selectedFleetCount:(fleet?.fleetTypeMasterDTOs?.length>0 ? fleet?.fleetTypeMasterDTOs?.length:  fleet.availableFleetCount), 
          attachedTerritories: (fleet?.fleetTypeMasterDTOs?.length>0 ? fleet?.fleetTypeMasterDTOs?.length:  fleet.availableFleetCount),
          index:fleet.fleetTypeId+'_'+fleet.clientBranchId+'_'+fleet.clientCoLoaderId
        }
          if(fleet?.fleetTypeMasterDTOs?.length){
            let geofences={}
            fleet?.fleetTypeMasterDTOs.map((fence:any)=>{
              geofences[fence.geofenceId]=fence.countPerVehicleType
            })
            attachedTerritoriesTemp[fleet.fleetTypeId+'_'+fleet.clientBranchId+'_'+fleet.clientCoLoaderId] = {...fleet, geofences: geofences}
          }
      })
      :{}
      let transformedOrderDetailsFilter= {}
      action.payload.data?.orderFilters?.filters?.map((filter:any)=>{
        let id=(Math.random() * 10000).toFixed(0)
        transformedOrderDetailsFilter[id]={
        id:id,
        firstValue:{id:filter.fieldId, label:filter.fieldLabelKey,value:filter.fieldId},
        fieldOperation:[],
        showSecondField:true,
        fieldType:'',
        thirdElement:{
          type:undefined,
          value:''
        },
        fieldId:filter.fieldId,
        operationSymbol: filter.operationSymbol,
        operationLabelKey: filter.operationLabelKey,
        fieldLabelKey:filter.fieldLabelKey,
        labelValue:filter.labelValue,
        filterData: filter.filterData,
        editMode:false
        }
      })
      let transformedDAFilter= {}
      action.payload.data.daFilters?.filters?.length && action.payload.data.daFilters?.filters?.map((filter:any)=>{
        let id=(Math.random() * 10000).toFixed(0)
        transformedDAFilter[id]={
        id:id,
        firstValue:{id:filter.fieldId, label:filter.fieldLabelKey,value:filter.fieldId},
        fieldOperation:[],
        showSecondField:true,
        fieldType:'',
        thirdElement:{
          type:undefined,
          value:''
        },
        fieldId:filter.fieldId,
        operationSymbol: filter.operationSymbol,
        operationLabelKey: filter.operationLabelKey,
        fieldLabelKey:filter.fieldLabelKey,
        labelValue:filter.labelValue,
        filterData: filter.filterData,
        editMode:false
        }
      })
      const transformedData = {
          ...action.payload,
          ...action.payload.data,
          users:action.payload.userMapDto.map((user:any)=>{
              return {
                ...user,
                id:user.userName,
                name:user.userName,
                label:user.userName
              }    
          }),
          frequency:action.payload?.isCustomFl? 'Custom' 
          : action.payload?.monthlySetting ? 'Monthly'
          : action.payload?.weeklySetting? 'Weekly'
          : 'Daily',
          every: action.payload?.isCustomFl? 
          action.payload.frequency=='3'? action.payload.monthlySetting:
          action.payload.frequency=='2'? action.payload.weeklySetting
          :action.payload.dailySetting
          : null ,
          period: action.payload?.isCustomFl? 
          action.payload?.monthlySetting ? 'Months'
          : action.payload?.weeklySetting? 'Weeks'
          : 'Days'
          : null ,
          otherEmailId:action.payload?.otherEmails,
          selectDAFromListFl:action.payload?.data?.selectDAFromListFl ? 'Y' : 'N',
          ownedFleet:tempOwnedFleetObject,
          outsourcedFleet: tempOutSourcedFleetObject,
          orderFiltersOperationLogic:action.payload?.data?.orderFilters?.operationLogic,
          DAFiltersOperationLogic:action.payload?.data?.daFilters?.operationLogic,
          DAFilters:transformedDAFilter,
          orderDetailsFilter: transformedOrderDetailsFilter,
          orderEndTime:moment(action.payload?.data?.orderEndTime, 'HH:mm:ss').add(action.payload?.data?.orderEndDay, "days"),
          orderStartTime:moment(action.payload?.data?.orderStartTime, 'HH:mm:ss').add(action.payload?.data?.orderStartDay, "days"),
          attachedTerritories:attachedTerritoriesTemp,
          attachedTerritoriesFinal:attachedTerritoriesTemp,
          continueWithoutOwnedFleetFl: action.payload?.data.continueWithoutOwnedFleetFl? 'Y': 'N',
          branch: selectedBranches?.map((branch:any)=>{ 
            return {
            id:branch.id, 
            name:branch.name, 
            value: branch.branchId,
            label:branch.name
          }
        })
        }
      const newStructure = deepCopy(state.structure.generalDetails);
      if (newStructure !== undefined && Object.keys(newStructure).length) {
        if(action.payload?.isCustomFl){
          newStructure['schedulerDetails']['every'].permission = true;
          newStructure['schedulerDetails']['period'].permission = true;
        }
        if(action.payload?.startDateTime){
          newStructure['schedulerDetails']['endDateTime'].permission = true;
        }
      }
      return {
        ...state,
        formData:{...state.formData, ...transformedData},
        structure:{...state.structure, generalDetails:newStructure}
      
    } 
    case '@@planningForm/SET_ORDER_DETAILS_FILTER':
      return {
        ...state,
        formData:{...state.formData, orderDetailsFilter:{...action.payload}}
      }
    case '@@planningForm/SET_DA_DETAILS_FILTER':
      return {
        ...state,
        formData:{...state.formData, DAFilters:{...action.payload}}
      }
      
    case '@@planningForm/SET_OUTSOURCEDFLEET_STRUCTURE':
      return {
        ...state,
        structure:{...state.structure, outSourcedFleet:{...state.structure.outSourcedFleet, ...action.payload}}
      }

    case '@@planningForm/SET_OUTSOURCEDFLEET_DATA':
      const  resultList = action.payload;
      const updatedResult= resultList.results.map((result:any)=>{
        return {
          ...result,
          selectedFleetCount:result.availableFleetCount,
          attachedTerritories:result.availableFleetCount,
          index:result.fleetTypeId+'_'+result.branchId+'_'+result.coloaderId
        }
      })
      return {
        ...state,
        data:{...state.data, outSourcedFleet:{...action.payload, results:updatedResult}}
      }

    case '@@planningForm/SET_OWNED_FLEET_STRUCTURE':
      const columns = action?.payload?.columns;
      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        // if (key === 'minCapacityUtil') {
        //   const minCapacityUtilChild = columns['minCapacityUtil']?.childNodes as any;
        //   newObj.minCapacityUtilizationInUnits = minCapacityUtilChild['minCapacityUtilizationInUnits'];
        //   newObj.minCapacityUtilizationInUnits.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInUnits'].label}`;
        //   newObj.minCapacityUtilizationInUnits.fieldType = 'number'

        //   newObj.minCapacityUtilizationInVolume = minCapacityUtilChild['minCapacityUtilizationInVolume'];
        //   newObj.minCapacityUtilizationInVolume.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInVolume'].label}`;
        //   newObj.minCapacityUtilizationInVolume.fieldType = 'number'

        //   newObj.minCapacityUtilizationInWeight = minCapacityUtilChild['minCapacityUtilizationInWeight'];
        //   newObj.minCapacityUtilizationInWeight.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInWeight'].label}`;
        //   newObj.minCapacityUtilizationInWeight.fieldType = 'number'
        // } else
         if (key === 'capacity') {
          const capacityChild = columns['capacity']?.childNodes as any;

          newObj.capacityInWeight = capacityChild['capacityInWeight'];
          newObj.capacityInWeight.label = `${columns['capacity'].label} ${capacityChild['capacityInWeight'].label}`;
          newObj.capacityInWeight.fieldType = 'number'

          newObj.capacityInUnits = capacityChild['capacityInUnits'];
          newObj.capacityInUnits.label = `${columns['capacity'].label} ${capacityChild['capacityInUnits'].label}`;
          newObj.capacityInUnits.fieldType = 'number'

          newObj.capacityInVolume = capacityChild['capacityInVolume'];
          newObj.capacityInVolume.label = `${columns['capacity'].label} ${capacityChild['capacityInVolume'].label}`;
          newObj.capacityInVolume.fieldType = 'number'

        } else if (key === 'trackingDate') {
          newObj[key] = columns[key]
          newObj[key].showTime = false
          newObj[key].dateFormat = 'YYYY-MM-DD HH:mm:ss'
        }
        else {
          newObj[key] = columns[key];
        }
      });
      newObj['origin']= {
        searchable: true,
        label: 'Origin',
        id:'Origin',
        fieldType:'select'
      }
      const newPayload = { ...action.payload, columns: newObj };

      return {
        ...state,
        structure:{...state.structure, ownedFleet:newPayload}
      }

    case '@@planningForm/SET_OWNEDFLEET_DATA':
      const results = action.payload.results.map((row: any) => {
        const rowObj = row;
        // type -logged in,logout
        if (row.networkStatus) {
          rowObj.networkStatus = row.networkStatus;
          rowObj.deviceStatus = row.networkStatus;
        }
        if (row.deliveryMediumLoginDetails) {
          rowObj.type = row.deliveryMediumLoginDetails?.type;
        }
        if (row.variableCost) {
          const clientObj = state?.clientMetric?.find((c:any) => c.name === 'distance')
          const val = metricsConversion(row.variableCost, 'POST', clientObj?.conversionFactor)
          rowObj['variableCost'] = Number(val.toFixed(2))
        }
        if (row.capacityInVolume) {
          const clientObj = state?.clientMetric?.find((c:any) => c.name === 'volume')
          const val = metricsConversion(row.capacityInVolume, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInVolume'] = Number(val.toFixed(2))
        }
        if (row.capacityInWeight) {
          const clientObj = state?.clientMetric?.find((c:any) => c.name === 'weight')
          const val = metricsConversion(row.capacityInWeight, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInWeight'] = Number(val.toFixed(2))
        }
        // if (row.minCapacityUtilizationInVolume) {
        //   const clientObj = state?.clientMetric?.find((c:any) => c.name === 'volume')
        //   const val = metricsConversion(row.minCapacityUtilizationInVolume, 'GET', clientObj?.conversionFactor)
        //   rowObj['minCapacityUtilizationInVolume'] = Number(val.toFixed(2))
        // }
        // if (row.minCapacityUtilizationInWeight) {
        //   const clientObj = state?.clientMetric?.find((c:any) => c.name === 'weight')
        //   const val = metricsConversion(row.minCapacityUtilizationInWeight, 'GET', clientObj?.conversionFactor)
        //   rowObj['minCapacityUtilizationInWeight'] = Number(val.toFixed(2))
        // }
        if (state.viewMode === 'listview') {
          // when you put a intransit filter status that time dont send ignoreSelectAll other wise keep it for ignore in all selections
          if (!state.isIntransit && (row.statusCd === 'Intransit' || row.statusCd === 'Dispatched')) {
            rowObj.ignoreSelectAll = true
          }
          if ((row.statusCd === 'Intransit' || row.statusCd === 'Dispatched')) {
            rowObj.editIconButtonProps = {
              style: {
                opacity: '0'
              },
              onClick: undefined,
              title: ''
            }
          }
        } else {
          if (rowObj.ignoreSelectAll) {
            delete rowObj?.ignoreSelectAll
          }

        }

        return rowObj;
      });
      return {
        ...state,
        data:{...state.data, ownedFleet:{...action.payload, results}}
      }
      case '@@planningForm/SET_EDITED_OWNED_FLEETS' : {
        const refinedResults = state.data.ownedFleet.results;
        refinedResults[action.payload.index]=  action.payload.row;
        const savedResults= state.formData.ownedFleet;
        savedResults? savedResults[action.payload.row.deliveryMediumMasterId]= action.payload.row : null
        return {
          ...state,
          data:{...state.data, ownedFleet:{...state.data.ownedFleet, results:refinedResults }},
          formData:{...state.formData, ownedFleet:{...state.formData.ownedFleet,...savedResults }, selectedOrigins: {...state.formData.selectedOrigins, [action.payload.row.deliveryMediumMasterId]:action.payload.row.origin}}
        }
      }
      case '@@planningForm/SET_EDITED_OUTSOURCED_FLEETS' : {
        const refinedResults = state.data.outSourcedFleet.results;
        const editedRow= action.payload.row
        refinedResults[action.payload.index]= {...refinedResults[action.payload.index], ...action.payload.row} ;
        return {
          ...state,
          data:{...state.data, outSourcedFleet:{...state.data.outSourcedFleet, results:refinedResults}},
          formData:{...state.formData, attachedTerritories: {...state.formData.attachedTerritories, [editedRow.fleetTypeId+'_'+editedRow.branchId+'_'+editedRow.coloaderId]: editedRow}}
        }
      }
      case '@@planningForm/SET_CLIENT_METRIC_SYSTEM': {
        return {
          ...state,
          clientMetric: action.payload
        }
      }
      case '@@planningForm/SET_ORDER_DETAILS_STRUCTURE':
      return {
        ...state,
        structure:{...state.structure, orderDetails:action.payload}
      }

      case '@@planningForm/SET_ORDER_DETAILS_LIST_STRUCTURE':
      return {
        ...state,
        structure:{...state.structure, orderDetailsListViewStructure:action.payload}
      }
      
      case '@@planningForm/UPDATE_STEPPER_CONFIG':
      return {
        ...state,
        stepperConfig:action.payload
      }

    case '@@planningForm/SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }

    case '@@planningForm/SET_EDIT_MODE':
      return {
        ...state,
        isEditMode: action.payload
      }
    case '@@planningForm/SET_FORM_RESET_DATA':
      return {
        ...state,
        resetData: action.payload
      }
    case '@@planningForm/SET_TERRITORY_PROFILE_LIST':
      const tempTArr={}
      action.payload.map((territory:any)=>{
      tempTArr[territory.profileId]=territory.profileName
     });
     tempTArr[1]='No Profile Selected'
      return {
        ...state,
       data: {...state.data, 
        territoryProfilesList:[...action.payload, {
                isActiveFl:true,
                profileId:1,
                profileName:"No Profile Selected",
                isDefault:false}],
        territoryProfilesListTransformed: tempTArr
      }
      }
    case '@@planningForm/SET_PLANNING_PROFILE_LIST':
        return {
          ...state,
         data: {...state.data, planningProfilesList:action.payload}
        }
    case '@@planningForm/SET_BRANCH_LIST':
        return {
          ...state,
         data: {...state.data, branchList:action.payload}
        }
    case '@@planningForm/SET_TERRITORY_LIST':
        return {
          ...state,
         data: {...state.data, territories:action.payload}
        }
    case '@@planningForm/SET_SELECTED_OWNED_FLEETS':
      return {
        ...state,
        formData: {...state.formData,ownedFleet:action.payload}
      }

    case '@@planningForm/SET_SELECTED_OUTSOURCED_FLEETS':
      return {
        ...state,
        formData: {...state.formData,outsourcedFleet:action.payload}
      }

    case '@@planningForm/HIDE_ATTACH_TERRITORIES_MODAL':  
    return {
      ...state,
      isShowAttachToTerritoriesModal: false,
      formData: action.payload?.rowId ? {...state.formData,  attachedTerritoriesFinal: {...state.formData.attachedTerritoriesFinal, [action.payload?.rowId]:state.formData?.attachedTerritories[action.payload?.rowId] }}: {...state.formData}
    }
    case '@@planningForm/SHOW_ATTACH_TERRITORIES_MODAL':
      return {
        ...state,
        isShowAttachToTerritoriesModal: action.payload?.show,
        // formData:{...state.formData, selectedTerritories:{...state.formData.selectedTerritories, [action.payload.rowId]: action.payload.rowData}},
        // outsourcedFleetEditModeId:action.payload.rowId
        formData:{...state.formData, attachedTerritories:{...state.formData?.attachedTerritories, [action.payload?.rowData?.index]:{ ...state.formData.attachedTerritories?.[action.payload.rowData.index],...action.payload.rowData } }},
        outsourcedFleetEditModeId:action?.payload?.rowData?.index
      }
    case '@@planningForm/ATTACH_FLEET_TO_TERRITORIES':
      const rowId= action.payload.rowId
      // const selectedTerritories= state.formData.selectedTerritories
      // selectedTerritories[rowId]= {...selectedTerritories[rowId], 
      const attachedTerritories= state.formData.attachedTerritories
      attachedTerritories[rowId]= {...attachedTerritories[rowId], 
      geofences: action.payload.geoFence}
      return {
        ...state,
        formData:{...state.formData, 
        // selectedTerritories: selectedTerritories
        attachedTerritories:attachedTerritories
      }
      }
    case '@@planningForm/RESET_INITIAL_STATE':
      return {...initialState}
    case '@@planningForm/STEPPER_CONFIG':
        return {
        ...state,
        stepperConfig:[
          {
              stepName: "General",
              stepIcon: "images/general-planning.svg",
              summary: "",
              isActive:true,
              showPopover:false
          },
          {
              stepName: "Orders",
              stepIcon: "images/routePlanning/orderSelection.svg",
              summary: "",
              isActive:false,
              showPopover:false
          },
          {
              stepName: "Owned Fleet",
              stepIcon: "images/routePlanning/ownedFleet.svg",
              summary: "",
              isActive:false,
              showPopover:false
          },
          {
              stepName: "Outsourced Fleet",
              stepIcon: "images/routePlanning/outsourcedFleet.svg",
              summary: "",
              isActive:false,
              showPopover:false,
              disableNext:true
          },
          {
              stepName: "Review",
              stepIcon: "images/routePlanning/review.svg",
              summary: "",
              isActive:false,
              showPopover:false
          },
        ]
        }
    default:
      return state
  }
}