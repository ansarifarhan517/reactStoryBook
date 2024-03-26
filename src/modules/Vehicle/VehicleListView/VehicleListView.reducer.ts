import { IEditDetails } from '../../../utils/mongo/interfaces';
import { VehicleListViewActions } from './VehicleListView.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IVehicleListViewDataPayload, tBreadcrumbState, IBranchName, IClientMetricSystem, ICustomField, IMongoCompartmentListViewStructure } from './VehicleListView.models';
import polishedVehicleColumns from './utils/DataCleansing'
import capacityConversion from './utils/capacityConversion'
import { renderCustomFields } from '../../../utils/mongo/ListView';
import { metricsConversion } from '../../../utils/helper';

export interface IVehicleListViewState {
  structure: IMongoListViewStructure;
  data: IVehicleListViewDataPayload;
  viewMode: 'listview' | 'mapview';
  editDetails: IEditDetails;
  loading: {
    listView: boolean;
    columns: boolean;
  };
  inTransitMessage: string
  emptyData: boolean,
  breadcrumbState: tBreadcrumbState
  branchName: IBranchName[] | undefined
  googleApiKey: string
  clientMetric: IClientMetricSystem[]
  compartmentListStructure: IMongoCompartmentListViewStructure
  trackerListStructure: IMongoListViewStructure
  trackerListData: IVehicleListViewDataPayload
}


export const dummyColumns: any = {
  coLoaderName: { label: "vehicle Number", permission: true },
  shortName: { label: "vehicle Type", permission: true },
  address: { label: "Status", permission: true },
  adminContactName: { label: "Trip Status", permission: true },
  mobileNumber: { label: "Model", permission: true },
  emailAddress: { label: "Make", permission: true },
  linkedBranchCount: { label: "Hub", permission: true },
  gstNumber: { label: "Last tracking date", permission: true },
  billingContactName: { label: "capacity", permission: true },
  companyRegistrationNumber: { label: "insurance Validity", permission: true },
  isActiveFl: { label: "Active / Inactive", permission: true }
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

export const initialState: IVehicleListViewState = {
  structure: {
    columns: dummyColumns,
    buttons: {},
  },
  data: {
    totalCount: 0,
    results: dummyResult,
  },
  inTransitMessage: 'Vehicle is in Transit mode',
  emptyData: false,
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false,
    columns: false,
  },
  breadcrumbState: 'All',
  branchName: undefined,
  googleApiKey: '',
  clientMetric: [],
  compartmentListStructure: {
    columns: {}
  },
  trackerListStructure: {
    columns: {},
    buttons: {},
  },
  trackerListData: {
    totalCount: 0,
    results: [],
  },
};


const VehicleListViewReducer = (state = initialState, action: VehicleListViewActions): IVehicleListViewState => {

  switch (action.type) {
    case '@@vehicleListView/FETCH_STRUCTURE_SUCCESS': {
      return {
        ...state,
        structure: {
          columns: polishedVehicleColumns(action.payload.columns),
          buttons: action.payload.buttons
        },
      };
      break
    }


    case '@@vehicleListView/FETCH_DATA_SUCCESS': {
      const results = action.payload.results.map((m) => {
        
        if (localStorage.getItem('metricSystem')  === null){
          localStorage.setItem('metricSystem', JSON.stringify(state.clientMetric))
        }
        const metricdata = JSON.parse(localStorage.getItem('metricSystem'))
        
        // convert to Client METRIC SYSTEM
        let obj = {}
        if (m.capacityInVolume) {
          const clientObj = metricdata.find(c => c.name === 'volume')
          const val = capacityConversion(m.capacityInVolume, 'GET', clientObj?.conversionFactor)
          obj['capacityInVolume'] = val.toFixed(2)
        }
        if (m.capacityInWeight) {
          const clientObj = metricdata.find(c => c.name === 'weight')
          const val = capacityConversion(m.capacityInWeight, 'GET', clientObj?.conversionFactor)
          obj['capacityInWeight'] = val.toFixed(2)
        }
        if (m.minCapacityUtilizationInVolume) {
          const clientObj = metricdata.find(c => c.name === 'volume')
          const val = capacityConversion(m.minCapacityUtilizationInVolume, 'GET', clientObj?.conversionFactor)
          obj['minCapacityUtilizationInVolume'] = val.toFixed(2)
        }
        if (m.minCapacityUtilizationInWeight) {
          const clientObj = metricdata.find(c => c.name === 'weight')
          const val = capacityConversion(m.minCapacityUtilizationInWeight, 'GET', clientObj?.conversionFactor)
          obj['minCapacityUtilizationInWeight'] = val.toFixed(2)
        }
        if(m.minSpeed){
          const clientObj = state?.clientMetric?.find(c => c.name === 'speed')
          const val = metricsConversion(m.minSpeed, 'GET', clientObj?.conversionFactor)
          obj['minSpeed'] = Number(val.toFixed(2))
        }
        if(m.maxSpeed){
          const clientObj = state?.clientMetric?.find(c => c.name === 'speed')
          const val = metricsConversion(m.maxSpeed, 'GET', clientObj?.conversionFactor)
          obj['maxSpeed'] = Number(val.toFixed(2))
        }
        if(m.minTemperature){
          obj['minTemperature'] = Number(m.minTemperature.toFixed(2))
        }
        if(m.maxTemperature){
          obj['maxTemperature'] = Number(m.maxTemperature.toFixed(2))
        }

        const rowObj = m
        if (m.customFieldsJSONString) {
          const customFields: ICustomField[] = JSON.parse(m.customFieldsJSONString)
          customFields.forEach((customField) => {
            const { field } = customField
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
          })
        }
        // cconversion ends here
        return m.status === 'Intransit' ? {
          ...m,
          ...obj,
          hasSelectionDisabled: true,
          checkboxTooltipText: 'The vehicle is in intransit mode. Therefore, the Vehicle cannot be updated or deleted.',
          editIconButtonProps: {
            className: 'hideEditIcon'
          }
        } : {
          ...m,
          ...obj,
        }
      })

      return {
        ...state,
        data: {
          ...action.payload,
          results: results,
        },
      };
    }
    case '@@vehicleListView/UPDATE_DATA': {
      const { vehicleId: updateVehicleId, ...rest } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => (row.vehicleId === updateVehicleId ? { ...row, ...rest } : row)),
        },
      };
    }

    case '@@vehicleListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case '@@vehicleListView/SET_EDIT_DETAILS': {
      const { rowId, columnId, value, hasError } = action.payload;
      return {
        ...state,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError,
            },
          },
        },
      };
    }
    
   

    case '@@vehicleListView/REMOVE_EDIT_DETAILS': {
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload;
      const newState = {
        ...state,
      };

      delete newState.editDetails?.[removeRowId]?.[removeColumnId];
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId];
      }

      return newState;
    }

    case '@@vehicleListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {},
      };

    case '@@vehicleListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

      case '@@vehicleListView/SET_EMPTY_DATA':
        return {
          ...state,
          emptyData: true
        };

    case '@@vehicleListView/SET_COLUMNS_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          ...action.payload,
        },
      };

    case '@@vehicleListView/UPDATE_STATUS': {
      const { vehicleId, status, custom } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => (row.vehicleId === vehicleId ? { ...row, status, ...custom } : row)),
        },
      };
    }

    case '@@vehicleListView/SET_INITIAL_STATE': {
      return {
        ...initialState
      }
    }

    case '@@vehicleListView/SET_BREADCRUMB_STATE': {
      return {
        ...state,
        breadcrumbState: action.payload
      }
    }

    case '@@vehicleListView/SET_BRANCH_NAME': {
      let data = action.payload
      data.forEach(b => {
        b['value'] = b['name']
        b['label'] = b['name']
        b['branchId'] && delete b['branchId']
        b['name'] && delete b['name']
      })
      return {
        ...state,
        branchName: data
      }
    }

    case '@@vehicleListView/SET_INTRANSIT_MESSAGE': {
      return {
        ...state,
        inTransitMessage: action.payload
      };
    }

    case '@@vehicleListView/SET_CLIENT_METRIC_SYSTEM': {
      return {
        ...state,
        clientMetric: action.payload
      }
    }
    case '@@vehicleListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS':
      const compartmentColumns = action?.payload?.columns;
            const compartmentKeys = Object.keys(compartmentColumns);
            const newCompartmentObj: any = {};
            compartmentKeys?.forEach((key: string) => {
                if (key === 'capacity') {
                const capacityChild = compartmentColumns['capacity']?.childNodes as any;

                newCompartmentObj.capacityInUnits = capacityChild['capacityInUnits'];
                newCompartmentObj.capacityInUnits.label = `${compartmentColumns['capacity'].label} ${capacityChild['capacityInUnits'].label}`;
                newCompartmentObj.capacityInUnits.fieldType = 'number'

                newCompartmentObj.capacityInWeight = capacityChild['capacityInWeight'];
                newCompartmentObj.capacityInWeight.label = `${compartmentColumns['capacity'].label} ${capacityChild['capacityInWeight'].label}`;
                newCompartmentObj.capacityInWeight.fieldType = 'number'

                newCompartmentObj.capacityInVolume = capacityChild['capacityInVolume'];
                newCompartmentObj.capacityInVolume.label = `${compartmentColumns['capacity'].label} ${capacityChild['capacityInVolume'].label}`;
                newCompartmentObj.capacityInVolume.fieldType = 'number'
                }
                else {
                  newCompartmentObj[key] = compartmentColumns[key];
                }
            });
            return {
                ...state,
                compartmentListStructure: {columns: newCompartmentObj}
            }
    case '@@vehicleListView/FETCH_TRACKER_LIST_STRUCTURE_SUCCESS':
      return {
        ...state,
        trackerListStructure: { columns: action?.payload?.columns, buttons: action?.payload?.buttons }, loading: { ...state.loading, columns: false }
      }
    case '@@vehicleListView/FETCH_TRACKER_LIST_DATA_SUCCESS':
      return {
        ...state,
        trackerListData: {
          ...action.payload
        },
      };
    default:
      return state;
  }
};

export default VehicleListViewReducer;
