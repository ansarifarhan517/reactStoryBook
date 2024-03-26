import { tFleetTypeListViewAcions } from './FleetTypeListView.actions';
import { IFleetListViewDataPayload, ICustomField, IFleetTypeRequest, IDropdown, tFleetStatus, IFleetTypeListViewRowData, IMongoCompartmentListViewStructure } from './FleetTypeListView.models';
import { IFetchDataOptions, ISelectedRows } from 'ui-library'
import { IEditDetails, IMongoListViewStructure } from '../../utils/mongo/interfaces';
import { renderCustomFields } from '../../utils/mongo/ListView';
import { IFilterData, IFilters } from '../common/AdvancedSearch/interface';
import { IClientMetricSystem } from '../../utils/common.interface';
import { metricsConversion } from '../../utils/helper';
export interface IFleetTypeListViewState {
  structure: IMongoListViewStructure
  data: IFleetListViewDataPayload
  viewMode: 'listview'
  editDetails: IEditDetails
  loading: {
    listView: boolean
  },
  fetchOptions: IFetchDataOptions
  selectedRows?: ISelectedRows | {}
  isEditMode: boolean
  fleetActivationRequest: IFleetTypeRequest | undefined
  lastUpdatedCell: string,
  uploadModal: boolean
  userId: string | undefined
  clientId: string
  editConfirmationModal: boolean
  isSaveClicked: boolean
  emptyData: boolean
  weeklyOff: IDropdown[];
  breadcrumbFilter: tFleetStatus;
  deliveryTypes: IDropdown[];
  appliedAdvancedFilterData: IFilters[]
  advancedFilterData: IFilterData[]
  filterListPayload: any
  currentFilter: IFilterData | undefined
  advancedFilterDropdown: any
  advancedFilterOperations: any
  openAdvFilter: boolean
  firstLoad: boolean
  advFilterLoader: boolean
  clientMetric: IClientMetricSystem[]
  compartmentListStructure: IMongoCompartmentListViewStructure
}
export const dummyFleetColumnData: any = Array(6).fill(0).map((_, i) => ({ label: (i + 1).toString() }))

export const dummyFleetResultData: any = Array(15).fill(0).map((_, i) => ({ id: i + 1 }))

const initialState: IFleetTypeListViewState = {
  structure: {
    columns: dummyFleetColumnData,
    buttons: {}
  },
  data: {
    totalCount: 0,
    results: dummyFleetResultData
  },
  viewMode: 'listview',
  editDetails: {},
  loading: {
    listView: false
  },
  fetchOptions: {},
  selectedRows: {},
  isEditMode: false,
  fleetActivationRequest: undefined,
  lastUpdatedCell: '',
  uploadModal: false,
  userId: '',
  clientId: '',
  editConfirmationModal: false,
  isSaveClicked: false,
  emptyData: false,
  weeklyOff: [],
  breadcrumbFilter: 'ALL',
  deliveryTypes: [],
  appliedAdvancedFilterData: [],
  advancedFilterData: [],
  filterListPayload: undefined,
  currentFilter: undefined,
  advancedFilterDropdown: undefined,
  advancedFilterOperations: undefined,
  openAdvFilter: false,
  firstLoad: false,
  advFilterLoader: false,
  clientMetric: [],
  compartmentListStructure: {
    columns: {}
  }
}

const FleetTypeReducer = (state = initialState, action: tFleetTypeListViewAcions): IFleetTypeListViewState => {
  switch (action.type) {
    case '@@fleetTypeListView/RESET_INITIAL_STATE':
      return {
        ...state,
        structure: {
          columns: dummyFleetColumnData,
          buttons: {}
        },
        data: {
          totalCount: 0,
          results: dummyFleetResultData
        },
        editDetails: {},
        isEditMode: false,
        editConfirmationModal: false,
        isSaveClicked: false,
        emptyData: false,
        uploadModal: false,
        filterListPayload: undefined,
        currentFilter: undefined,
        openAdvFilter: false,
        firstLoad: false,
        advFilterLoader: false,
        compartmentListStructure: {
          columns: {}
        }

      }
    case '@@fleetTypeListView/FETCH_STRUCTURE_SUCCESS':
      const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
      const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
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

        }
        else {
          newObj[key] = columns[key];
        }
      });


      const newBtn = {}
      const btnSequence = ['update', 'more', 'InlineEdit']

      btnSequence.forEach((btn: string) => {
        if (action?.payload?.buttons?.[btn]) {
          newBtn[btn] = action?.payload?.buttons?.[btn]
        }
      })
      const newPayload = { ...action.payload, columns: newObj, buttons: newBtn };
      return {
        ...state,
        clientId,
        userId: userIdentifier,
        structure: newPayload
      }

    case '@@fleetTypeListView/FETCH_DATA_SUCCESS':
      const results = action.payload.results.map((row: IFleetTypeListViewRowData) => {
        const rowObj = row
        if (row.capacityInVolume) {
          const clientObj = state?.clientMetric?.['volume']
          const val = metricsConversion(row.capacityInVolume, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInVolume'] = Number(val.toFixed(2))
        }
        if (row.capacityInWeight) {
          const clientObj = state?.clientMetric?.['weight']
          const val = metricsConversion(row.capacityInWeight, 'GET', clientObj?.conversionFactor)
          rowObj['capacityInWeight'] = Number(val.toFixed(2))
        }
        if (row.minCapacityUtilizationInVolume) {
          const clientObj = state?.clientMetric?.['volume']
          const val = metricsConversion(row.minCapacityUtilizationInVolume, 'GET', clientObj?.conversionFactor)
          rowObj['minCapacityUtilizationInVolume'] = Number(val.toFixed(2))
        }
        if (row.minCapacityUtilizationInWeight) {
          const clientObj = state?.clientMetric?.['weight']
          const val = metricsConversion(row.minCapacityUtilizationInWeight, 'GET', clientObj?.conversionFactor)
          rowObj['minCapacityUtilizationInWeight'] = Number(val.toFixed(2))
        }
        if(row.minSpeed){
          const clientObj = state?.clientMetric?.['speed']
          const val = metricsConversion(row.minSpeed, 'GET', clientObj?.conversionFactor)
          rowObj['minSpeed'] = Number(val.toFixed(2))
        }
        if(row.maxSpeed){
          const clientObj = state?.clientMetric?.['speed']
          const val = metricsConversion(row.maxSpeed, 'GET', clientObj?.conversionFactor)
          rowObj['maxSpeed'] = Number(val.toFixed(2))
        }
        if(row.minTemperature){
          rowObj['minTemperature'] = Number(row.minTemperature.toFixed(2))
        }
        if(row.maxTemperature){
          rowObj['maxTemperature'] = Number(row.maxTemperature.toFixed(2))
        }


        if (row.customFieldsJSONString) {
          const customFields: ICustomField[] = JSON.parse(row.customFieldsJSONString)
          customFields.forEach((customField) => {
            const { field } = customField
            rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
          })
        }

        return rowObj
      })

      return {
        ...state,
        data: {
          ...action.payload,
          results
        }
      }

    case '@@fleetTypeListView/UPDATE_DATA':
      const { id, ...rest } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map(row => row.id === id ? { ...row, ...rest } : row)
        }
      }
    case '@@fleetTypeListView/SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload
      }

    case '@@fleetTypeListView/SET_EDIT_DETAILS':
      const { rowId, columnId, value, hasError } = action.payload
      return {
        ...state,
        lastUpdatedCell: `${rowId}-${columnId}`,
        editDetails: {
          ...state.editDetails,
          [rowId]: {
            ...state.editDetails?.[rowId],
            [columnId]: {
              value,
              hasError
            }
          }
        }
      }

    case '@@fleetTypeListView/REMOVE_EDIT_DETAILS':
      const { rowId: removeRowId, columnId: removeColumnId } = action.payload
      const newState = {
        ...state
      }

      delete newState.editDetails?.[removeRowId]?.[removeColumnId]
      if (!Object.keys(newState.editDetails?.[removeRowId] || {}).length) {
        delete newState.editDetails?.[removeRowId]
      }

      return newState

    case '@@fleetTypeListView/CLEAR_EDIT_DETAILS':
      return {
        ...state,
        editDetails: {}
      }

    case '@@fleetTypeListView/SET_LOADING':
      return {
        ...state,
        loading: {
          listView: action.payload.listView
        }
      }

    case '@@fleetTypeListView/UPDATE_STATUS':
      const { id: fleetId, status, custom } = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          results: state.data.results.map((row) => row.id === fleetId ? { ...row, status, ...custom } : row)
        }
      }
    case '@@fleetTypeListView/SET_FETCH_OPTIONS':
      return {
        ...state,
        fetchOptions: action.payload
      }
    case '@@fleetTypeListView/SET_SELECTED_ROWS':
      return {
        ...state,
        selectedRows: action.payload
      }
    case '@@fleetTypeListView/SET_IS_EDITABLE':
      return {
        ...state,
        isEditMode: action.payload
      }
    case '@@fleetTypeListView/SET_FLEET_ACTIVATION':
      return {
        ...state,
        fleetActivationRequest: action.payload
      }

    case '@@fleetTypeListView/SET_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: action.payload
      }
    case '@@fleetTypeListView/SET_EDIT_CONFIRMATION_MODAL':
      return {
        ...state,
        editConfirmationModal: action.payload
      }
    case '@@fleetTypeListView/SET_IS_SAVE_CLICKED':
      return {
        ...state,
        isSaveClicked: action.payload
      }
    case '@@fleetTypeListView/SET_EMPTY_DATA': {
      return {
        ...state,
        emptyData: action.payload
      }
    }
    case '@@fleetTypeListView/UPDATE_WEEKLY_OFF':
      const newWeeklyOffArray = action.payload?.map((weekData: IDropdown) => ({
        label: weekData?.name,
        value: weekData?.name,
        id: weekData?.id,
        title: weekData?.name,
      }));
      return {
        ...state,
        weeklyOff: newWeeklyOffArray,
      };
    case '@@fleetTypeListView/SET_BREADCRUMB_STATE':
      return {
        ...state,
        breadcrumbFilter: action.payload
      }
    case '@@fleetTypeListView/GET_DELIVERY_TYPE':
      const types = action.payload?.map((type: any) => ({
        label: type?.name,
        value: type?.name,
        id: type?.id,
        title: type?.name
      }));
      return {
        ...state,
        deliveryTypes: types,
      };
    case '@@fleetTypeListView/SET_APPLIED_ADV_FILTER_DATA':
      return {
        ...state,
        appliedAdvancedFilterData: action.payload
      }
    case '@@fleetTypeListView/SET_ADV_FILTER_DATA':
      return {
        ...state,
        advancedFilterData: action.payload
      }
    case '@@fleetTypeListView/UPDATE_FIRST_LOAD':
      return {
        ...state,
        firstLoad: action.payload
      }
    case '@@fleetTypeListView/SET_ADV_FILTER_LOADING':
      return {
        ...state,
        advFilterLoader: action.payload
      }
    case '@@fleetTypeListView/SET_CURRENT_FILTERS':
      return {
        ...state,
        currentFilter: action.payload
      }
    case '@@fleetTypeListView/SET_FILTERLIST_PAYLOAD':
      return {
        ...state,
        filterListPayload: action.payload
      }
    case '@@fleetTypeListView/SET_OPEN_ADV_FILTER':
      return {
        ...state,
        openAdvFilter: action.payload
      }
    case '@@fleetTypeListView/SET_CLIENT_METRIC_SYSTEM': {
      return {
        ...state,
        clientMetric: action.payload
      }
    }
    case '@@fleetTypeListView/FETCH_COMPARTMENT_LIST_STRUCTURE_SUCCESS':
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
      return state
  }
}

export default FleetTypeReducer