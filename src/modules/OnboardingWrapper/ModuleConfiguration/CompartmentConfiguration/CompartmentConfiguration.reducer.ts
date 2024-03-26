import { IMongoListViewStructure, IMongoFormStructure } from "../../../../utils/mongo/interfaces"
import { CompartmentConfigurationActions } from "./CompartmentConfiguration.actions"
import { IRowData, IDropdown, IAllCompartmentDataPayload, IClientMetricSystem } from "./CompartmentConfiguration.models"
import { metricsConversion } from '../../../../utils/helper';
export interface ICompartmentConfigurationState {
    viewType: string,
    form: {
        structure: IMongoFormStructure
        loading: boolean,
        compartmentData: IRowData,
        isEditable: boolean
    },
    listview: {
        structure: IMongoListViewStructure,
        data: IAllCompartmentDataPayload,
        loading: {
            listView: boolean
            columns:boolean
        },
        emptyData: boolean
    },
    clientMetric: IClientMetricSystem[],
    crates: IDropdown[],
    comparmentPopupListData: IAllCompartmentDataPayload
}

const initialState: ICompartmentConfigurationState = {
    viewType: 'allCompartments',
    form: {
        structure: {},
        loading: false,
        isEditable: false,
        compartmentData: {
            isActiveFl: false,
            compartmentId: undefined,
            compartmentName: '',
            capacityInUnits: undefined,
            capacityInWeight: undefined,
            capacityInVolume: undefined,
            length: undefined,
            breadth: undefined,
            height: undefined,
            temperatureCategoryCd: '',
            minTemperature: undefined,
            maxTemperature: undefined,
            crateIds : []
        }
    },
    listview: {
        structure: {
            columns: {},
            buttons: {},
        },
        data: {
            totalCount: 0,
            results: []
        },
        loading: {
            listView: false,
            columns:false
        },
        emptyData: false
    },
    clientMetric: [],
    crates: [],
    comparmentPopupListData: {
        totalCount: 0,
        results: [],
        listLoading: false
    }
}

const CompartmentConfigurationReducer = (state = initialState, action: CompartmentConfigurationActions): ICompartmentConfigurationState => {
    switch (action.type) {
        case '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE' :
        case '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST':
        return {
            ...state,
            listview: {
                ...state.listview,
                loading: {
                    ...state.listview.loading,
                    columns: true
                }
            }
        }
        case '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LISTVIEW_STRUCTURE_SUCCESS':
            const columns = action?.payload?.columns;
            const keys = Object.keys(columns);
            const newObj: any = {};
            keys.forEach((key: string) => {
                if (key === 'capacity') {
                const capacityChild = columns['capacity']?.childNodes as any;

                newObj.capacityInUnits = capacityChild['capacityInUnits'];
                newObj.capacityInUnits.label = `${columns['capacity'].label} ${capacityChild['capacityInUnits'].label}`;
                newObj.capacityInUnits.fieldType = 'number'

                newObj.capacityInWeight = capacityChild['capacityInWeight'];
                newObj.capacityInWeight.label = `${columns['capacity'].label} ${capacityChild['capacityInWeight'].label}`;
                newObj.capacityInWeight.fieldType = 'number'

                newObj.capacityInVolume = capacityChild['capacityInVolume'];
                newObj.capacityInVolume.label = `${columns['capacity'].label} ${capacityChild['capacityInVolume'].label}`;
                newObj.capacityInVolume.fieldType = 'number'
                }
                else {
                newObj[key] = columns[key];
                }
            });
            return {
                ...state,
                listview: {...state.listview, structure: { columns: newObj, buttons: action?.payload?.buttons }, loading: {...state.listview.loading, columns: false}}
            }
        case '@@compartmentConfiguration/FETCH_ALL_COMPARTMENT_LIST_SUCCESS':
            const results = action.payload.results.map((m) => {
                // convert to Client METRIC SYSTEM
                let obj = {}
                if (m.capacityInVolume) {
                  const clientObj = state?.clientMetric && state?.clientMetric?.find(c => c.name === 'volume')
                  const val = metricsConversion(m.capacityInVolume, 'GET', clientObj?.conversionFactor)
                  obj['capacityInVolume'] = val.toFixed(2)
                }
                if (m.capacityInWeight) {
                  const clientObj = state?.clientMetric && state?.clientMetric?.find(c => c.name === 'weight')
                  const val = metricsConversion(m.capacityInWeight, 'GET', clientObj?.conversionFactor)
                  obj['capacityInWeight'] = val.toFixed(2)
                }
                // cconversion ends here
                return {
                  ...m,
                  ...obj,
                }
              })
        
            return {
                ...state,
                listview: {
                    ...state.listview,
                    data: {...action.payload,results: results},
                    loading: {
                        ...state.listview.loading,
                        columns: false
                    }
                }
            }
        case '@@compartmentConfiguration/SET_EMPTY_DATA': 
            return {
                ...state,
                listview: {
                    ...state.listview,
                    emptyData: action.payload
                }
                
            }
        case '@@compartmentConfiguration/SET_CLIENT_METRIC_SYSTEM': {
            return {
                ...state,
                clientMetric: action.payload
                }
            }
        case '@@compartmentConfiguration/SET_CRATES_DATA':
            const newCratesArray = action.payload?.map((crate: IDropdown) => ({
                label: crate?.crateName,
                value: crate?.crateName,
                id: crate?.crateId,
                title: crate?.crateName
            }));
            return {
                ...state,
                crates: newCratesArray,
            };
        case '@@compartmentConfiguration/FETCH_FORM_STRUCTURE':
        case '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: true
                }
            }
        case '@@compartmentConfiguration/FETCH_FORM_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    structure: action.payload,
                    loading: false
                }
            }
        case '@@compartmentConfiguration/SET_FORM_LOADING':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: action.payload
                }
            }
        case '@@compartmentConfiguration/SET_VIEW_TYPE':
            return {
                ...state,
                viewType: action.payload
            }
        case '@@compartmentConfiguration/FETCH_COMPARTMENT_BY_ID_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: true,
                    compartmentData: action.payload
                }
            }
        case "@@compartmentConfiguration/SET_FORM_EDITABLE":
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: action.payload
                }
            }
        case "@@compartmentConfiguration/RESET_COMPARTMENT_DATA":
            return {
                ...state,
                form: {
                    ...state.form,
                    compartmentData: {
                        isActiveFl: false,
                        compartmentId: undefined,
                        compartmentName: '',
                        capacityInUnits: undefined,
                        capacityInWeight: undefined,
                        capacityInVolume: undefined,
                        length: undefined,
                        breadth: undefined,
                        height: undefined,
                        temperatureCategoryCd: '',
                        minTemperature: undefined,
                        maxTemperature: undefined,
                        crateIds : []
                    }
                }
            }
        case '@@compartmentConfiguration/FETCH_COMPARTMENT_DATA_SUCCESS':
            const list = action?.payload?.results?.map((row: IRowData) => {
                const rowObj = row
                if (row.capacityInVolume) {
                    const clientObj = state?.clientMetric && state?.clientMetric?.find(c => c.name === 'volume')
                    const val = metricsConversion(row.capacityInVolume, 'GET', clientObj?.conversionFactor)
                    rowObj['capacityInVolume'] = Number(val?.toFixed(2))
                }
                if (row.capacityInWeight) {
                    const clientObj = state?.clientMetric && state?.clientMetric?.find(c => c.name === 'weight')
                    const val = metricsConversion(row.capacityInWeight, 'GET', clientObj?.conversionFactor)
                    rowObj['capacityInWeight'] = Number(val?.toFixed(2))
                }
                return rowObj
            })
            return {
                ...state,
                comparmentPopupListData: {
                ...action.payload,
                results: list
                }
            }
        default:
            return state
    }
}
export default CompartmentConfigurationReducer;