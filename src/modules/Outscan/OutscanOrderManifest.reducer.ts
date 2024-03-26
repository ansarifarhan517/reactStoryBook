import { IClientMetricSystem } from "../../utils/common.interface";
import { IMongoFormStructure, IMongoListViewStructure } from "../../utils/mongo/interfaces";
import { OutscanOrderManifestActions } from "./OutscanOrderManifest.actions";
import { IExceptionData, IManifestData, IManifestOfManifestsListviewDataPayload, IScannedOrderListviewDataPayload } from "./OutscanOrderManifest.models";

export interface IOutscanOrderManifestState {
    viewType: string,
    form: {
        loading: boolean,
        isEditable: boolean,
        structure: IMongoFormStructure
        manifestData: IManifestData
    },
    listview: {
        orders: {
            loading: boolean,
            structure: IMongoListViewStructure
            data: IScannedOrderListviewDataPayload
        },
        manifestOfManifests: {
            loading: boolean,
            structure: IMongoListViewStructure
            data: IManifestOfManifestsListviewDataPayload
        },
        exceptions: {
            loading: boolean,
            structure: IMongoListViewStructure,
            data: IExceptionData
        }
    },
    clientMetric?: IClientMetricSystem[],
    dispatchNum: number
}


const initialState: IOutscanOrderManifestState = {
    viewType: "OUTSCAN",
    form: {
        loading: false,
        isEditable: false,
        structure: {
            columns: {},
            buttons: {}
        },
        manifestData: {
            branchName: '',
            cancelledOrderAllowedFl: false,
            manifestId: '',
            manifestNo: 0,
            manifestStatus: '',
            manifestType: '',
            shipmentList: [],
            childManifests: [],
            totalCrates: 0,
            totalOrders: 0
        }
    },
    listview: {
        orders: {
            loading: false,
            structure: {
                columns: {},
                buttons: {}
            },
            data: {
                clientBranchId: 0,
                otherCount: 0,
                results: [],
                totalCount: 0
            }
        },
        manifestOfManifests: {
            loading: false,
            structure: {
                columns: {},
                buttons: {}
            },
            data: {
                clientBranchId: 0,
                otherCount: 0,
                results: [],
                totalCount: 0
            }
        },
        exceptions: {
            loading: false,
            structure: {
                columns: {},
                buttons: {}
            },
            data: {
                clientBranchId: 0,
                otherCount: 0,
                results: [],
                totalCount: 0
            }
        }
    },
    dispatchNum: 0
}

const OutscanOrderManifestReducer = (state = initialState, action: OutscanOrderManifestActions): IOutscanOrderManifestState => {
    switch (action.type) {
        case '@@outscanOrderManifest/SET_VIEW_TYPE':
            return {
                ...state,
                viewType: action.payload
            }
            break;

        case '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: true
                }
            }
            break;

        case '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    structure: action.payload
                }
            }
            break;

        case '@@outscanOrderManifest/SET_ORDER_OUTSCAN_LISTVIEW_LOADING':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    orders: {
                        ...state.listview.orders,
                        loading: action.payload
                    }
                }
            }
            break;

        case '@@outscanOrderManifest/FETCH_ORDER_OUTSCAN_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    orders: {
                        ...state.listview.orders,
                        structure: action.payload,
                        loading: false
                    }
                }
            }
            break;

        case '@@outscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    orders: {
                        ...state.listview.orders,
                        data: action.payload,
                        loading: false
                    }
                }
            }
            break;

        case '@@outscanOrderManifest/SET_MANIFEST_OF_MANIFEST_LISTVIEW_LOADING':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    manifestOfManifests: {
                        ...state.listview.manifestOfManifests,
                        loading: action.payload
                    }
                }
            }
            break;

        case '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    manifestOfManifests: {
                        ...state.listview.manifestOfManifests,
                        structure: action.payload,
                        loading: false
                    }
                }
            }
            break;

        case '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    manifestOfManifests: {
                        ...state.listview.manifestOfManifests,
                        data: action.payload,
                        loading: false
                    }
                }
            }
            break;
        case '@@outscanOrderManifest/SET_FORM_EDITABLE':
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: action.payload
                }
            }
            break;
        case '@@outscanOrderManifest/SET_FORM_LOADING':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: action.payload
                }
            }
            break;
        case '@@outscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: true,
                    manifestData: action.payload
                }
            }
        break;
        case '@@outscanOrderManifest/RESET_MANIFEST_DATA':
            return {
                ...state,
                form: {
                    ...state.form,
                    manifestData: {
                        branchName: '',
                        cancelledOrderAllowedFl: false,
                        manifestId: '',
                        manifestNo: 0,
                        manifestStatus: '',
                        manifestType: '',
                        shipmentList: [],
                        childManifests: [],
                        totalCrates: 0,
                        totalOrders: 0
                    }
                }
            }
            break;
            case '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_LOADING':
                return {
                    ...state,
                    listview: {
                        ...state.listview,
                        exceptions: {
                            ...state.listview.exceptions,
                            loading: action.payload
                        }
                    }
                }
            break;
            case '@@outscanOrderManifest/FETCH_EXCEPTION_LISTVIEW_STRUCTURE_SUCCESS':
                return {
                    ...state,
                    listview: {
                        ...state.listview,
                        exceptions: {
                            ...state.listview.exceptions,
                            structure: action.payload
                        }
                    }
                }
            break;
            case '@@outscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA':
                return {
                    ...state,
                    listview: {
                        ...state.listview,
                        exceptions: {
                            ...state.listview.exceptions,
                            data: action.payload
                        }
                    }
                }
            break;
            case '@@outscanOrderManifest/SET_CLIENT_METRIC_SYSTEM': 
            return {
                ...state,
                clientMetric: action.payload
            }
            break;
            case '@@outscanOrderManifest/SET_DISPATCH_NUMBER': 
            return {
                ...state,
                dispatchNum: action.payload
            }
            break;
        default:
            return state;
    }
}


export default OutscanOrderManifestReducer