import { IMongoListViewStructure, IEditDetails, ICustomFieldsEntity } from "../../../utils/mongo/interfaces";
import { tTerritoryListActions } from "./TerritoryList.actions";
import { ICategoryData, IDAOptionsData, IGeofenceDataPayload, ITerritoryListDataPayload, IDropdown } from "./TerritoryList.models";
import { renderCustomFields } from '../../../utils/mongo/ListView'; 
import { IClientMetricSystem } from "../../../utils/common.interface";
import { metricsConversion } from "../../../utils/helper";

export const dummyData: any = {
    deliveryMediumMasterId: {label: "Delivery Associate",permission: true},
    geofenceCategory: {label: "Category", permission: true},
    geofenceName: {label: "Territory Name", permission: true},
    radiusInKms: {label: "Radius (in Ml) / Area (in Ml)2",permission: true},
    shapeTypeCode: {label: "Shape", permission: true},
    isActiveFl: {label: "Active / Inactive", permission: true}
}

export interface ITerritoryListState {
    structure: IMongoListViewStructure;
    data: ITerritoryListDataPayload
    viewMode: 'listview' | 'mapview';
    loading: {
        listView: boolean;
        columns:boolean;
    };
    breadcrumbState: string
    totalRows: number
    daList: Array<IDropdown>
    deliveryMediumList: Array<IDAOptionsData>
    categoryList: Array<IDropdown>
    breadcrumbData: Array<IGeofenceDataPayload>
    editDetails: IEditDetails;
    lastUpdatedCell: string
    googleApiKey: string
    userId: string | undefined
    clientId: string
    emptyData: boolean
    showAdvanceFilter: boolean
    isSaveClicked: boolean
    clientMetric: IClientMetricSystem[]
    initiallyLoaded: boolean
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({shipmentId: i + 1 }))

const initialState: ITerritoryListState = {
    structure: {
        columns: dummyData,
        buttons: {},
    },
    data: {
        totalCount: 0,
        results: dummyResult
    },
    viewMode: 'listview',
    loading: {
        listView: false,
        columns:false
    },
    breadcrumbState: '',
    totalRows: 0,
    breadcrumbData: [],
    daList:[],
    categoryList:[],
    editDetails: {},
    lastUpdatedCell: '',
    deliveryMediumList: [],
    googleApiKey: '',
    userId: '',
    clientId: '',
    emptyData: false,
    showAdvanceFilter: false,
    isSaveClicked: false,
    clientMetric: [],
    initiallyLoaded: false
}

const TerritoryListReducer = (state = initialState, action: tTerritoryListActions): ITerritoryListState => {
    switch (action.type) {
        case '@@territoryList/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                structure: action.payload
            }
        case '@@territoryList/SET_VIEW_MODE':
            return {
                ...state,
                viewMode: action.payload,
            }
        case '@@territoryList/SET_BREADCRUMB_STATE':
            return {
                ...state,
                breadcrumbState: action.payload,
            }
        case '@@territoryList/FETCH_DATA_SUCCESS':
            const results = action.payload.results.map((row) => {
                const rowObj = row
                if (row.customFieldsJSONString) {
                  const customFieldsEntity: ICustomFieldsEntity[] = JSON.parse(row.customFieldsJSONString)
                  customFieldsEntity.forEach((customField) => {
                    const { field } = customField
                    rowObj[field] = renderCustomFields(customField, state.structure.columns?.[field], action.payload.clientProperties || {})
                  })
                }
                if (row.radiusInKms) {
                    const clientObj = state?.clientMetric?.find(c => c.name === 'distance')
                    const val = metricsConversion(row.radiusInKms, 'GET', clientObj?.conversionFactor)
                    rowObj['radiusInKms'] = Number(val.toFixed(2))
                }
        
                return rowObj
              })
            return {
                ...state,
                data: {
                ...action.payload, results
                }
            }
        case '@@territoryList/SET_COLUMNS_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload,
                },
            }
        case '@@territoryList/SET_LOADING':
            return {
                ...state,
                loading: {
                ...state.loading,
                ...action.payload,
                },
            }

        case '@@territoryList/FETCH_DA_LIST':
            const daList = action.payload
            const newList = daList.map((da: IDAOptionsData) => {
                return {
                    label: da?.deliveryMediumName,
                    value: da?.deliveryMediumName,
                    id: da?.deliveryMediumMasterId,
                    title: da?.deliveryMediumName,
                    name: da?.deliveryMediumName
                }
            })
            return {
                ...state,
                daList: newList,
                deliveryMediumList: action.payload
            }

        case '@@territoryList/SET_CLIENT_METRIC_SYSTEM': 
            return {
                ...state,
                clientMetric: action.payload
            }

        case '@@territoryList/FETCH_CATEGORY_LIST':
            const categoryList = action.payload
            const newCategoryList = categoryList.map((category: ICategoryData) => {
                return {
                    label: category?.name,
                    value: category?.name,
                    id: category?.id,
                    title: category?.name,
                    name: category?.name
                }
            })
            return {
                ...state,
                categoryList: newCategoryList
            }

        case '@@territoryList/FETCH_BREADCRUMBDATA_SUCCESS':
            // let defaultProfile = '';
            const formattedData = action.payload.map(obj => {
                // if (obj.isDefault) {
                //     defaultProfile = String(obj.profileId);
                // }
                return {...obj, id: obj.profileId, value: obj.profileId, label: obj.profileName, isFavourite: obj.isDefault}
            })
            return {
                ...state,
                breadcrumbData: formattedData,
                // breadcrumbState: defaultProfile
            }
        case '@@territoryList/SET_EDIT_DETAILS':
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
                    hasError
                    },
                },
                },
            };
        case '@@territoryList/CLEAR_EDIT_DETAILS':
            return {
                ...state,
                editDetails: {},
            };

        case '@@territoryList/SET_EMPTY_DATA':
            return {
                ...state,
                emptyData: action.payload,
            };

        case '@@territoryList/SET_SHOW_ADVANCE_FILTER':
            return {
                ...state,
                showAdvanceFilter: action.payload,
            };

        case '@@territoryList/SET_SAVE_CLICK':
            return {
                ...state,
                isSaveClicked: action.payload,
            };

        case '@@territoryList/UPDATE_DATA':
            const { geofenceId: updateGeofenceId, ...rest } = action.payload
            return {
                ...state,
                data: {
                ...state.data,
                results: state.data.results.map(row => row.geofenceId === updateGeofenceId ? { ...row, ...rest } : row)
                }
            }

        case '@@territoryList/SET_DA_LIST':
            return {
                ...state,
                deliveryMediumList: action.payload
            }


        case '@@territoryList/GOOGLE_API_KEY':
            // while saving the google key save the below info as well
            const clientId = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.['subClients']?.[0]?.['clientId'];
            const userIdentifier = JSON.parse(localStorage.getItem('userAccessInfo') || '')?.userId;
            return {
                ...state,
                googleApiKey: action.payload,
                clientId,
                userId: userIdentifier
            };
        case '@@territoryList/INITIAL_LOAD':
            return{
                ...state,
                initiallyLoaded: true
            }

        case '@@territoryList/INITIAL_FAV_BREADCRUMB':
            let defaultProfile = '';
            action.payload.map(obj => {
                if (obj.isDefault) {
                    defaultProfile = String(obj.profileId);
                }
            })
            return {
                ...state,
                breadcrumbState: defaultProfile
            }

        default:
            return state
    }
}

export default TerritoryListReducer