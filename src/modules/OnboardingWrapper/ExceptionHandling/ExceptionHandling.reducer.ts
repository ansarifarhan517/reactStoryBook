import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces"
import { ExceptionHandlingActions } from "./ExceptionHandling.actions"
import { IAllExceptionsDataPayload, IDropDownOption, IExceptionData, IExceptionEvents, IManifestsExceptionsListData, IOrderException, IOrderExceptionsListData, tBreadcrumbState, ViewTypes } from "./ExceptionHandling.models"
import { addIgnoreSelection } from "./utils"

export interface IExceptionHandlingState {
    viewType: ViewTypes;
    form: {
        structure: IMongoFormStructure
        events: IExceptionEvents[]
        isEditable: boolean
        loading: boolean,
        exceptionData: IExceptionData
    },
    listview: {
        allExceptions: {
            structure: IMongoListViewStructure,
            data: IAllExceptionsDataPayload,
            loading: boolean
        },
        raisedExceptions: {
            orders: {
                structure: IMongoListViewStructure
                data: IOrderExceptionsListData
                loading: boolean
            },
            manifests: {
                structure: IMongoListViewStructure
                data: IManifestsExceptionsListData
                loading: boolean
            },
            breadcrumbState: tBreadcrumbState
        }
    },
    lookup: {
        exceptionStages: IDropDownOption[],
        exceptionTypes: IDropDownOption[],
        exceptionAppliesTo: IDropDownOption[],
        exceptionStatus: IDropDownOption[],
        orderStatus: IDropDownOption[]
    }
}

const initialState: IExceptionHandlingState = {
    viewType: 'allExceptions',
    form: {
        structure: {
            columns: {},
            buttons: {}
        },
        events: [],
        isEditable: false,
        loading: false,
        exceptionData: {
            isActiveFl: false,
            exceptionMode: '',
            exceptionCode: '',
            exceptionName: '',
            exceptionType: '',
            exceptionStage: [],
            exceptionAppliesTo: [],
            exceptionMessage: '',
            exceptionGroupId: '',
            eventCode: '',
            applyToConstituents : false ,
            displayOnTrackingLink : false
        }
    },
    listview: {
        allExceptions: {
            structure: {
                columns: {},
                buttons: {}
            },
            data: {
                clientBranchId: 0,
                otherCount: 0,
                totalCount: 0,
                results: []
            },
            loading: false
        },
        raisedExceptions: {
            orders: {
                structure: {
                    columns: {},
                    buttons: {}
                },
                data: {
                    clientBranchId: 0,
                    otherCount: 0,
                    totalCount: 0,
                    results: []
                },
                loading: false
            },
            manifests: {
                structure: {
                    columns: {},
                    buttons: {}
                },
                data: {
                    clientBranchId: 0,
                    otherCount: 0,
                    totalCount: 0,
                    results: []
                },
                loading: false
            },
            breadcrumbState: 'allExceptions',
        }
    },
    lookup: {
        exceptionStages: [],
        exceptionTypes: [],
        exceptionAppliesTo: [],
        exceptionStatus: [],
        orderStatus: []
    }
}

const ExceptionHandlingReducer = (state = initialState, action: ExceptionHandlingActions): IExceptionHandlingState => {
    switch (action.type) {
        case '@@exceptionHandling/FETCH_FORM_STRUCTURE':
        case '@@exceptionHandling/FETCH_EXCEPTION_BY_ID':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: true
                }
            }
        case '@@exceptionHandling/SET_FORM_LOADING':
            return {
                ...state,
                form: {
                    ...state.form,
                    loading: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE':
        case '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST':
            return {
                ...state,
                listview: {
                    allExceptions: {
                        ...state.listview.allExceptions,
                        loading: true,
                    },
                    raisedExceptions: {
                        ...state.listview.raisedExceptions
                    }
                }
            }
        case '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE':
        case '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST':
        case '@@exceptionHandling/FETCH_EXCEPTION_STATUS':
        case '@@exceptionHandling/FETCH_ORDER_STATUS':
            return {
                ...state,
                listview: {
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        orders: {
                            ...state.listview.raisedExceptions.orders,
                            loading: true
                        }
                    },
                    allExceptions: {
                        ...state.listview.allExceptions
                    }
                }
            }

        case '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE':
        case  '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST':
        case '@@exceptionHandling/FETCH_EXCEPTION_STATUS':
            return {
                ...state,
                listview: {
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        manifests: {
                            ...state.listview.raisedExceptions.manifests,
                            loading: true
                        }
                    },
                    allExceptions: {
                        ...state.listview.allExceptions
                    }
                }
            }
        case '@@exceptionHandling/FETCH_FORM_STRUCTURE_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    structure: action.payload,
                    loading: false
                }
            }
        case '@@exceptionHandling/SET_VIEW_TYPE':
            return {
                ...state,
                viewType: action.payload
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_EVENTS_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    events: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    allExceptions: {
                        ...state.listview.allExceptions,
                        structure: action.payload,
                        loading: false
                    }
                }
            }
        case '@@exceptionHandling/FETCH_ALL_EXCEPTIONS_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    allExceptions: {
                        ...state.listview.allExceptions,
                        data: action.payload,
                        loading: false
                    }
                }
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_STAGE_LIST_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    exceptionStages: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_TYPE_LIST_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    exceptionTypes: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_APPLIES_TO_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    exceptionAppliesTo: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_BY_ID_SUCCESS':
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: true,
                    exceptionData: action.payload
                }
            }
        case "@@exceptionHandling/RESET_EXCEPTION_DATA":
            return {
                ...state,
                form: {
                    ...state.form,
                    exceptionData: {
                        isActiveFl: false,
                        exceptionMode: '',
                        exceptionCode: '',
                        exceptionName: '',
                        exceptionType: '',
                        exceptionStage: [],
                        exceptionAppliesTo: [],
                        exceptionMessage: '',
                        exceptionGroupId: '',
                        eventCode: '',
                        applyToConstituents: false,
                        displayOnTrackingLink : false
                    }
                }
            }
        case "@@exceptionHandling/SET_FORM_EDITABLE":
            return {
                ...state,
                form: {
                    ...state.form,
                    isEditable: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        orders: {
                            ...state.listview.raisedExceptions.orders,
                            structure: action.payload,
                            loading: false
                        }
                    }
                }
            }
        case '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LISTVIEW_STRUCTURE_SUCCESS':
            return {
                ...state,
                listview: {
                    ...state.listview,
                    raisedExceptions: {
                        manifests: {
                            ...state.listview.raisedExceptions.manifests,
                            structure: action.payload,
                            loading: false
                        },
                        orders: {...state.listview.raisedExceptions.orders},
                        breadcrumbState: 'allExceptions'
                    }
                }
            }
        case '@@exceptionHandling/SET_BREADCRUMB_STATE': {
            return {
                ...state,
                listview: {
                    ...state.listview,
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        breadcrumbState: action.payload
                    }
                }
            }
            }
        case '@@exceptionHandling/FETCH_ORDER_EXCEPTIONS_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        orders: {
                            ...state.listview.raisedExceptions.orders,
                            data: addIgnoreSelection(action.payload),
                            loading: false
                        }
                    },
                    allExceptions: {
                        ...state.listview.allExceptions
                    }
                }
            }
        case '@@exceptionHandling/FETCH_MANIFEST_EXCEPTIONS_LIST_SUCCESS':
            return {
                ...state,
                listview: {
                    raisedExceptions: {
                        ...state.listview.raisedExceptions,
                        manifests: {
                            ...state.listview.raisedExceptions.manifests,
                            data: addIgnoreSelection(action.payload),
                            loading: false
                        }
                    },
                    allExceptions: {
                        ...state.listview.allExceptions
                    }
                }
            }
        case '@@exceptionHandling/FETCH_EXCEPTION_STATUS_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    exceptionStatus: action.payload
                }
            }
        case '@@exceptionHandling/FETCH_ORDER_STATUS_SUCCESS':
            return {
                ...state,
                lookup: {
                    ...state.lookup,
                    orderStatus: action.payload
                }
            }
        case '@@exceptionHandling/RESET_FORM_STRUCTURE':
            return {
                ...state,
                form: {
                    ...state.form,
                    structure: {
                        columns: {},
                        buttons: {}
                    },
                    loading: false
                }
            }

        default:
            return state
    }
}
export default ExceptionHandlingReducer;