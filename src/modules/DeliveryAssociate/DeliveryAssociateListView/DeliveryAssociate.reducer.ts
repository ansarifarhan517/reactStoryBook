import { IEditDetails } from '../../../utils/mongo/interfaces';
import { tDAListViewActions } from './DeliveryAssociate.actions';
import { IMongoListViewStructure } from '../../../utils/mongo/interfaces';
import { IDeliveryListViewDataPayload, ICustomField, IRowData, IBranchInfo, IDropdown, IFilterInfo, IUpdateReasons, IVehicleList, IMongoCompartmentListViewStructure } from './DeliveryAssociate.models';
import { renderCustomFields } from '../../../utils/mongo/ListView';
import { IOperationTypes } from 'ui-library';
import { metricsConversion, deepCopy } from '../../../utils/helper';
import { IClientMetricSystem } from '../../../utils/common.interface';


export const dummyData: any = Array(20).fill(0).map((_, i) => ({ label: (i + 1).toString() }))

export interface IDeliveryListViewState {
  structure: IMongoListViewStructure;
  data: IDeliveryListViewDataPayload;
  viewMode: 'listview' | 'mapview';
  editDetails: IEditDetails;
  loading: {
    listView: boolean;
    isTotalCountLoading: boolean;
  };
  branchList: IBranchInfo[];
  weeklyOff: IDropdown[];
  statusList: IDropdown[];
  deliveryTypes: IDropdown[];
  deviceStatusLoading: boolean;
  filterData: IFilterInfo[] | undefined;
  operationsData: IOperationTypes;
  isIntransit: boolean
  googleApiKey: string
  firstLoad: boolean
  advFilterLoader: boolean
  userId: string | undefined
  clientId: string
  lastUpdatedCell: string
  netWorkStatusTimer: { time: any, isClicked: boolean }
  clientMetric: IClientMetricSystem[]
  initailFetchDone: boolean
  statusUpdateReasons: IDropdown[];
  vehicleList: IVehicleList[];
  compartmentListStructure: IMongoCompartmentListViewStructure;
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ deliveryMediumMasterId: i + 1 }))

const initialState: IDeliveryListViewState = {
  structure: {
    columns: dummyData,
    buttons: {},
  },
  data: {
    totalCount: -1,
    results: dummyResult,
  },
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false,
    isTotalCountLoading: false
  },
  branchList: [],
  weeklyOff: [],
  statusList: [],
  deliveryTypes: [],
  deviceStatusLoading: false,
  filterData: undefined,
  operationsData: {},
  isIntransit: false,
  googleApiKey: '',
  firstLoad: false,
  advFilterLoader: false,
  userId: '',
  clientId: '',
  lastUpdatedCell: '',
  netWorkStatusTimer: { time: undefined, isClicked: false },
  clientMetric: [],
  statusUpdateReasons: [],
  initailFetchDone: false,
  vehicleList: [],
  compartmentListStructure: {
    columns: {}
  },
};

const DeliveryAssociateReducer = (state = initialState, action: tDAListViewActions): IDeliveryListViewState => {
  switch (action.type) {
    case '@@daListView/RESET_INITIAL_STATE':
      return initialState

    case '@@daListView/FETCH_STRUCTURE_SUCCESS':
      const columns = action?.payload?.columns;
      const keys = Object.keys(columns);
      const newObj: any = {};
      keys.forEach((key: string) => {
        if (key === 'minCapacityUtil') {
          const minCapacityUtilChild = columns['minCapacityUtil']?.childNodes as any;
          newObj.minCapacityUtilizationInUnits = minCapacityUtilChild['minCapacityUtilizationInUnits'];
          newObj.minCapacityUtilizationInUnits.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInUnits'].label}`;
          newObj.minCapacityUtilizationInUnits.fieldType = 'number'

          newObj.minCapacityUtilizationInVolume = minCapacityUtilChild['minCapacityUtilizationInVolume'];
          newObj.minCapacityUtilizationInVolume.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInVolume'].label}`;
          newObj.minCapacityUtilizationInVolume.fieldType = 'number'

          newObj.minCapacityUtilizationInWeight = minCapacityUtilChild['minCapacityUtilizationInWeight'];
          newObj.minCapacityUtilizationInWeight.label = `${columns['minCapacityUtil'].label} ${minCapacityUtilChild['minCapacityUtilizationInWeight'].label}`;
          newObj.minCapacityUtilizationInWeight.fieldType = 'number'
        } else if (key === 'capacity') {
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
      const newBtn = {}
      const btnSequence = ['delete', 'update', 'changePwd', 'bulkUpdate', 'notify', 'more', 'InlineEdit']

      btnSequence.forEach((btn: string) => {
        if (action?.payload?.buttons?.[btn]) {
          newBtn[btn] = action?.payload?.buttons?.[btn]
        }
      })
      const newPayload = { ...action.payload, columns: newObj, buttons: newBtn };
      return {
        ...state,
        structure: newPayload,
      };
    case '@@daListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row: IRowData) => {
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
          const clientObj = state?.clientMetric?.find(c => c.name === 'distance')
          const val = metricsConversion(row.variableCost, 'POST', clientObj?.conversionFactor)
          rowObj['variableCost'] = Number(val.toFixed(2))
        }
        if (row.capacityInVolume) {
          const clientObj = state?.clientMetric?.find(c => c.name === 'volume')
          const val = metricsConversion(row.capacityInVolume, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInVolume'] = Number(val.toFixed(2))
        }
        if (row.capacityInWeight) {
          const clientObj = state?.clientMetric?.find(c => c.name === 'weight')
          const val = metricsConversion(row.capacityInWeight, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInWeight'] = Number(val.toFixed(2))
        }
        if (row.minCapacityUtilizationInVolume) {
          const clientObj = state?.clientMetric?.find(c => c.name === 'volume')
          const val = metricsConversion(row.minCapacityUtilizationInVolume, 'GET', clientObj?.conversionFactor)
          rowObj['minCapacityUtilizationInVolume'] = Number(val.toFixed(2))
        }
        if (row.minCapacityUtilizationInWeight) {
          const clientObj = state?.clientMetric?.find(c => c.name === 'weight')
          const val = metricsConversion(row.minCapacityUtilizationInWeight, 'GET', clientObj?.conversionFactor)
          rowObj['minCapacityUtilizationInWeight'] = Number(val.toFixed(2))
        }
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
        if (row.customFieldsJSONString) {
          const customFields: ICustomField[] = JSON.parse(row.customFieldsJSONString);
          customFields.forEach(customField => {
            const { field } = customField;
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {});
          });
        }

        return rowObj;
      });

      return {
        ...state,

        data: {
          ...action.payload,
          totalCount: state.data.totalCount,
          results,
        },
      };

    case '@@daListView/UPDATE_DATA':
      const { deliveryMediumMasterId: updateDaId, ...rest } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => (row.deliveryMediumMasterId === updateDaId ? { ...row, ...rest } : row)),
        },
      };
    case '@@daListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case '@@daListView/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload;
      return {
        ...state,
        lastUpdatedCell: `${rowId}-${columnId}`,
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

    case '@@daListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload;
      const newState = {
        ...state,
      };

      delete newState.editDetails?.[removeRowId]?.[removeColumnId];
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId];
      }

      return newState;

    case '@@daListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {},
      };

    case '@@daListView/SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          listView: action.payload.listView,
        },
      };

    case '@@daListView/UPDATE_STATUS':
      const { deliveryMediumMasterId, status, custom } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row =>
            row.deliveryMediumMasterId === deliveryMediumMasterId ? { ...row, status, ...custom } : row,
          ),
        },
      };
    case '@@daListView/UPDATE_BRANCH_LIST':
      return {
        ...state,
        branchList: action.payload?.branchList?.map((branch: IBranchInfo) => {
          if (branch?.label) return branch
          return {
            label: branch?.name,
            value: branch?.name,
            id: branch?.branchId,
            canonicalId: branch?.canonicalId,
            gmtoffset: branch?.gmtoffset,
            branchDescription: branch.branchDescription,
            title: branch?.name
          }
        }),
      };
    case '@@daListView/UPDATE_WEEKLY_OFF':
      const newWeeklyOffArray = action.payload?.map((weekData: IDropdown) => {
        if (weekData?.label) return weekData
        return {
          label: weekData?.name,
          value: weekData?.name,
          id: weekData?.id,
        }
      });
      return {
        ...state,
        weeklyOff: newWeeklyOffArray,
      };
    case '@@daListView/GET_DELIVERY_STATUS':
      const statusList = action.payload?.map((data: any) => {
        if (data?.label) return data
        return {
          label: data?.clientRefMasterDesc,
          value: data?.reasonCd,
          id: data?.reasonCd,
          title: data?.clientRefMasterDesc
        }
      });
      return {
        ...state,
        statusList,
      };
    case '@@daListView/GET_DELIVERY_TYPE':
      const types = action.payload?.map((type: any) => {
        if (type?.label) return type
        return {
          label: type?.name,
          value: type?.name,
          id: type?.id,
          title: type?.name
        }
      });
      return {
        ...state,
        deliveryTypes: types,
      };
    case '@@daListView/SET_DEVICE_STATUS':
      const { networkStatusList, deviceStatusLoading } = action.payload;
      let dataCopy = state.data
      const newResult: any = [];
      if (networkStatusList) {
        const ids = Object.keys(networkStatusList)
        const valuesArray = Object.values(networkStatusList)
        state.data.results.forEach((row: IRowData) => {
          const copyRow: any = row
          if (ids.includes(JSON.stringify(row?.userId))) {
            const indexOfUserId = ids.indexOf(JSON.stringify(row?.userId))
            copyRow.deviceStatus = valuesArray[indexOfUserId] ? valuesArray[indexOfUserId] : row.networkStatus;
            copyRow.networkStatus = valuesArray[indexOfUserId] ? valuesArray[indexOfUserId] : row.networkStatus;
          }
          newResult.push(copyRow)

        });
        dataCopy = { ...state.data, results: newResult }
      }

      return {
        ...state,
        data: dataCopy,
        deviceStatusLoading: deviceStatusLoading !== undefined ? deviceStatusLoading : state.deviceStatusLoading,
      };
    case '@@daListView/GET_FILTER_DATA':
      return {
        ...state,
        filterData: action.payload?.filterData,
      };
    case '@@daListView/GET_OPERATIONS_DATA':
      return {
        ...state,
        operationsData: action.payload?.operationsData,
      };
    case '@@daListView/IS_INTRANSIT':
      return {
        ...state,
        isIntransit: action.payload
      };
    case '@@daListView/GOOGLE_API_KEY':
      // while saving the google key save the below info as well
      const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
      const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
      return {
        ...state,
        googleApiKey: action.payload,
        clientId,
        userId: userIdentifier
      };

    case '@@daListView/SET_COLUMNS':
      const visisbleColumnNames = Object.keys(action.payload)
      const allColumn = deepCopy(state.structure.columns)
      Object.keys(allColumn).map(columnName => {
        if (visisbleColumnNames.includes(columnName)) {
          allColumn[columnName].permission = true
        } else {
          allColumn[columnName].permission = false
        }
      })
      return {
        ...state,
        structure: { ...state.structure, columns: allColumn }
      };
    case '@@daListView/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@daListView/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@daListView/SET_NETWORK_STATUS_TIMER':
      return {
        ...state,
        netWorkStatusTimer: {
          time: action?.payload?.time,
          isClicked: action?.payload?.isClicked,
        }
      };
    case '@@daListView/SET_CLIENT_METRIC_SYSTEM': {
      return {
        ...state,
        clientMetric: action.payload
      }
    }
    case '@@daListView/FETCH_COUNT_SUCCESS': {
      if (action?.payload?.data) {
        return {
          ...state,
          data: {
            ...state.data,
            totalCount: action.payload?.data.totalCount || 0
          }
        }

      } else {
        return {
          ...state
        }
      }
    }

    case '@@daListView/SET_COUNT_LOADER': {

      return {
        ...state,
        loading: {
          ...state.loading,
          isTotalCountLoading: action.payload
        }
      }
    }
    case '@@daListView/GET_STATUS_UPDATE_REASONS':
      const reasonsList = action.payload
      const newList = reasonsList.map((reason: IUpdateReasons) => {
        return {
          id: reason?.clientRefMasterId,
          label: reason?.clientRefMasterDesc,
          value: reason?.name,
        }
      })
      return {
        ...state,
        statusUpdateReasons: newList
      }
    case '@@daListView/SET_INITIAL_FETCH_DONE':
      return {
        ...state,
        initailFetchDone: action.payload
      }

    case '@@daListView/UPDATE_VEHICLE_LIST':
      return {
        ...state,
        vehicleList: action.payload
      }
    case '@@daListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS':
      const compartmentColumns = action?.payload?.columns;
            const compartmentKeys = Object.keys(compartmentColumns);
            const newCompartmentObj: any = {};
            compartmentKeys.forEach((key: string) => {
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
    default:
      return state;
  }
};

export default DeliveryAssociateReducer;
