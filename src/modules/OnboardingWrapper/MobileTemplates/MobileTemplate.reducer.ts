import { IMongoFormStructure, IMongoListViewStructure } from "../../../utils/mongo/interfaces";
import { IMobileTemplateActions } from "./MobileTemplate.actions";
import { IMobileRoleListDataPayload, IMobileTemplate, IMobileTemplateAccordianStructure, IMobileTemplateListDataPayload, mobileTemplate, IDynamicCardTileList, IDynamicOrderMasterStructure, IFormInputs, tileListStructure, masterStructure } from "./MobileTemplate.models";
export interface IMobileTemplatesState {
    listview: {
        isColumnLoading: boolean;
        isListViewLoading: boolean;
        structure: IMongoListViewStructure;
        data: IMobileTemplateListDataPayload;
        mobileRolesListView: {
            isColumnLoading: boolean;
            isListViewLoading: boolean;
            structure: IMongoListViewStructure;
            data: IMobileRoleListDataPayload;
        }
    },
    form: {
        loading: boolean;
        structure: IMongoFormStructure;
        isEditMode: boolean;
        accordionStructure: IMobileTemplateAccordianStructure;
        formValues: IFormInputs;
        accessProfileIds: Array<string | undefined>;
    },
    dynamicOrder: {
        tileList: IDynamicCardTileList,
        masterStructure: IDynamicOrderMasterStructure;
        mobileDynamicStructure: IDynamicCardTileList[],
        addressFields: {
            [key: string]: any
        }
    },
    viewType: string;
    accessProfileId: number;
    mobileTemplate: IMobileTemplate;
    orderType: string;
    isOrderConfigured: boolean;
    isOrderConfiguring: boolean;
}

const initialState: IMobileTemplatesState = {
    listview: {
        isColumnLoading: false,
        isListViewLoading: false,
        structure: {
            columns: {},
            buttons: {},
        },
        data: {
            totalCount: 0,
            results: []
        },
        mobileRolesListView: {
            isColumnLoading: false,
            isListViewLoading: false,
            structure: {
                columns: {},
                buttons: {},
            },
            data: {
                totalCount: 0,
                results: []
            }
        }
    },
    form: {
        loading: false,
        structure: {
            columns: {},
            buttons: {},
        },
        isEditMode: false,
        accordionStructure: {
            accessModules: []
        },
        formValues: {},
        accessProfileIds: []
    },
    dynamicOrder: {
        tileList: {
            id: '',
            pageName: '',
            sectionName: '',
            clientId: 0,
            structure: {
                columns: {}
            }
        },
        masterStructure: {
            id: '',
            pageName: '',
            sectionName: '',
            clientId: 0,
            structure: {
                columns: {}
            },
            properties: {},
            addressStructure: {
                columns: {}
            }
        },
        mobileDynamicStructure: [],
        addressFields: {},
    },
    viewType: 'list-view',
    accessProfileId: 0,
    mobileTemplate: {
        accessProfileId: 0,
        accessProfileRefId: '',
        accessprofileName: '',
        accessprofileDesc: '',
        accessReferenceIds: [],
        clientId: 0,
        defaultProfileFl: false,
        locked: false,
        activeFl: false,
        additionalDetails: {
            active: false,
            timeUnit: "Minutes",
            timeWindow: 0,
            daNegativeAmount: 0,
            allowDaNegativeAmount: false,
        },
    },
    orderType: '',
    isOrderConfigured: false,
    isOrderConfiguring: false
}

const MobileRolesReducer = (
    state = initialState,
    action: IMobileTemplateActions
): IMobileTemplatesState => {
    switch (action.type) {
        case '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE':
            return { ...state, listview: { ...state.listview, isColumnLoading: true } }

        case '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, isColumnLoading: true } } }

        case '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, isListViewLoading: true } } }

        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE':
        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE':
        case '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID':
            return { ...state, form: { ...state.form, loading: true } }

        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST':
            return { ...state, listview: { ...state.listview, isListViewLoading: true } }

        case '@@mobileTemplates/FETCH_LISTVIEW_STRUCTURE_SUCCESS':
            return { ...state, listview: { ...state.listview, structure: action.payload, isColumnLoading: false } }

        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATES_FORM_STRUCTURE_SUCCESS':
            return { ...state, form: { ...state.form, structure: action.payload, loading: false } }

        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_LIST_SUCCESS':
            return { ...state, listview: { ...state.listview, data: action.payload, isListViewLoading: false } }

        case '@@mobileTemplates/FETCH_MOBILE_ROLES_LISTVIEW_STRUCTURE_SUCCESS':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, structure: action.payload, isColumnLoading: false } } }

        case '@@mobileTemplates/FETCH_MOBILE_ROLES_BY_ACCESS_PROFILE_ID_SUCCESS':
            return { ...state, listview: { ...state.listview, mobileRolesListView: { ...state.listview.mobileRolesListView, data: action.payload, isListViewLoading: false } } }

        case '@@mobileTemplates/SET_VIEW_TYPE':
            return { ...state, viewType: action.payload }

        case '@@mobileTemplates/SET_EDIT_MODE':
            return { ...state, form: { ...state.form, isEditMode: action.payload } }

        case '@@mobileTemplates/SET_ACCESS_PROFILE_ID':
            return { ...state, accessProfileId: action.payload }

        case '@@mobileTemplates/FETCH_MOBILE_TEMPLATE_ACCORDION_STRUCTURE_SUCCESS':
            return { ...state, form: { ...state.form, accordionStructure: action.payload } }

        case '@@mobileTemplates/GET_MOBILE_TEMPLATE_BY_ID_SUCCESS':
            return { ...state, mobileTemplate: action.payload }

        case '@@mobileTemplates/RESET_MOBILE_TEMPLATE_DATA':
            return { ...state, mobileTemplate: mobileTemplate }

        case '@@mobileTemplates/GET_NEW_ORDER_TILE_LIST_SUCCESS':
            let tileList = action.payload;
            if (Object.keys(tileList?.structure?.columns).length) {
                const columns = tileList?.structure?.columns;
                const reOrderedTileList = {};
                const sortedColumns = Object.keys(columns).sort((a, b) => columns[a].fieldSequence - columns[b].fieldSequence)
                sortedColumns.forEach((key) => {
                    if(columns[key].rowSpan == 0 && columns[key].labelKey !="empty")
                        columns[key].rowSpan=1;
                    if(columns[key].labelKey =="empty")
                        columns[key].rowSpan=0;
                    reOrderedTileList[key] = columns[key];
                })

                tileList = { ...tileList, structure: { ...tileList.structure, columns: reOrderedTileList } }
            }
            return { ...state, dynamicOrder: { ...state.dynamicOrder, tileList: tileList } }

        case '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE_SUCCESS':
            return { ...state, dynamicOrder: { ...state.dynamicOrder, masterStructure: action.payload } }
        
        case '@@mobileTemplates/SET_ORDER_TYPE':
            return { ...state, orderType: action.payload }

        case '@@mobileTemplates/SET_ORDER_CONFIGURED':
            return { ...state, isOrderConfigured: action.payload }
        
        case '@@mobileTemplates/SET_DYNAMIC_MOBILE_STRUCTURE':
            return { ...state, dynamicOrder: { ...state.dynamicOrder, mobileDynamicStructure: action.payload } }

        case '@@mobileTemplates/RESET_DYNAMIC_MOBILE_STRUCTURE':
                return { ...state, dynamicOrder: { tileList: tileListStructure, masterStructure: masterStructure, mobileDynamicStructure: [], addressFields: {} } }

        case '@@mobileTemplates/SET_ORDER_CONFIGURING':
            return {...state , isOrderConfiguring: action.payload}

        case '@@mobileTemplates/SET_FORM_VALUES':
            return {...state, form: {...state.form, formValues: action.payload }}

        case '@@mobileTemplates/SET_ACCESS_IDS':
            return {...state, form: {...state.form, accessProfileIds: action.payload }}
        
        case '@@mobileTemplates/SET_TRIP_START_FORM_VALUES': 
            return {...state, mobileTemplate: {...state.mobileTemplate, accessReferenceIds: action.payload.accessReferenceIds, additionalDetails: action.payload.tripStartDetails}}
        case '@@mobileTemplates/FETCH_ADDRESS_FIELDS_SUCCESS': 
            return {...state, dynamicOrder: {...state.dynamicOrder, addressFields: action.payload.addressFields}}
        default:
            return state;
    }
}

export default MobileRolesReducer;