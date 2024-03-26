import { IAdditionalHeader, IAdditionalWebhookRecord } from "../../../../../utils/common.interface"
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces"
import { BranchWebhookProfileActions } from "./BranchWebhookProfile.actions"

export interface IBranchWebhookLink {
    type: string | undefined
    link: string | undefined
}

export interface IValidBranchWebhookLink extends IBranchWebhookLink {
    [x: string]: any
    isValid: boolean,
    showValidation?: boolean
}

export interface IBranchWebhookList {
    createdOnDt?: number,
    isActiveFl: boolean,
    branchWebhookProfileId: number,
    branchWebhookProfileName: string,
    secureWebhook: boolean,
    receiveChildBranchesWebhook: boolean,
    branchName: string,
    branchId: number
}

export interface IBranchWebhookListDataPayload {
    totalCount: number,
    otherCount?: number,
    clientBranchId?: number,
    results: IBranchWebhookList[]

}

export interface IBranchWebhookProfileFormData {
    createdOnDt?: number
    isActiveFl?: boolean
    branchWebhookProfileName?: string
    secureWebhook: boolean
    webhookHeaderFl: boolean
    receiveChildBranchesWebhook: boolean
    branchWebhookSignature?: string
    branchWebhookLink: IValidBranchWebhookLink[]
    branchId?: number;
    events?: string[]
    webhookUrls?: string[]
    headerList: IAdditionalHeader[]
    assignToAllFl?:  any
    webhookUrlsData?: any
    mapTokenFl?: any
}

export interface IEvents {
    clientRefMasterId: number,
    clientRefMasterType: string,
    clientRefMasterCd: string,
    clientRefMasterDesc: string,
    clientId: number,
    isDeleteFl: string,
    id: number,
    name: string,
    checked?: boolean
}

export interface IEventsObject {
    title: string,
    titleLabelKey: string
    events: IEvents[]
}

export interface IBranchData {
    branchDescription: string
    branchId: number
    canonicalId: string
    clientNodeId: number
    dst: string
    gmtoffset: string
    id: number
    name: string
    timezoneId: number
}


export interface IBranchWebhookProfileState {
    isLoading: boolean,
    isEditMode: boolean,
    branchWebhookProfileFormData: IBranchWebhookProfileFormData
    branchWebhookLinks: IValidBranchWebhookLink[]
    events: Record<string, IEventsObject>
    listStructure: IMongoListViewStructure
    data: IBranchWebhookListDataPayload
    editedWebhookProfile: IBranchWebhookList | undefined
    loading: {
        listView: boolean,
        columns: boolean,
    }
    branchList: IBranchData[] | undefined,
    additionalHeaders: IAdditionalWebhookRecord[]
}


export const dummyColumns: any = {
    branchWebhookProfileName: { label: "Branch Webhook Profile Name", permission: true },
    branchName: { label: "Branch", permission: true },
    isActiveFl: { label: "Active / Inactive", permission: true }
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

const initialState: IBranchWebhookProfileState = {
    isLoading: false,
    isEditMode: false,
    branchWebhookProfileFormData: {
        branchWebhookProfileName: '',
        secureWebhook: false,
        webhookHeaderFl: true,
        branchWebhookSignature: '',
        receiveChildBranchesWebhook: false,
        branchWebhookLink: [],
        headerList: []
    },
    branchWebhookLinks: [],
    events: {},
    listStructure: {
        columns: dummyColumns,
        buttons: {}
    },
    editedWebhookProfile: undefined,
    data: {
        totalCount: 0,
        results: dummyResult
    },
    loading: {
        listView: true,
        columns: true
    },
    branchList: undefined,
    additionalHeaders: []
}

const BrnachWebhookProfileReducer = (state = initialState, action: BranchWebhookProfileActions): IBranchWebhookProfileState => {
    switch (action.type) {
        case '@@branchWebhookProfile/SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case '@@branchWebhookProfile/SET_LIST_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...action.payload
                }
            }

        case '@@branchWebhookProfile/SET_EDIT_MODE':
            return {
                ...state,
                isEditMode: true
            }

        case '@@branchWebhookProfile/SET_WEBHOOKS_LINKS':
            return {
                ...state,
                branchWebhookLinks: action.payload
            }

        case '@@branchWebhookProfile/SET_EVENTS_DATA':
            return {
                ...state,
                events: action.payload
            }

        case '@@branchWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA':
            return {
                ...state,
                branchWebhookProfileFormData: {
                    ...state.branchWebhookProfileFormData,
                    [action?.payload.key]: action.payload.value
                }
            }

        case '@@branchWebhookProfile/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                listStructure: action.payload
            }

        case '@@branchWebhookProfile/FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: {
                    ...action.payload,
                }
            }

        case '@@branchWebhookProfile/INITIALISE_FORM':
            Object.keys(state.events).forEach(key => {
                state.events[key].events.forEach((event) => {
                    event['checked'] = false
                })
            })
            return {
                ...state,
                branchWebhookProfileFormData: {
                    branchWebhookProfileName: '',
                    secureWebhook: false,
                    webhookHeaderFl: true,
                    receiveChildBranchesWebhook: false,
                    branchWebhookSignature: '',
                    branchWebhookLink: [],
                    events: [],
                    webhookUrls: [],
                    headerList: []
                },
                branchWebhookLinks: [],
                editedWebhookProfile: undefined,
                events: {
                    ...state.events
                }
            }

        case '@@branchWebhookProfile/SET_WEBHOOK_DETAILS_DATA':
            const { webhookUrlsData, events } = action.payload;
            const updatedWebhhokLinks = webhookUrlsData?.map((webhook) => {
                const linkArray = webhook.url.split('#@#');
                return {
                    type: linkArray[0],
                    link: linkArray[1],
                    isValid: true,
                    showValidation: true,
                    tokenName: webhook.tokenName,
                    appendTo:webhook.tokenSetPref
                }
            });

            Object.keys(state.events).forEach(key => {
                state.events[key].events.forEach(event => {
                    event.checked = events && events.indexOf(event.clientRefMasterCd) > -1
                })
            })

            return {
                ...state,
                branchWebhookProfileFormData: {
                    ...state.branchWebhookProfileFormData,
                    ...action.payload
                },
                branchWebhookLinks: updatedWebhhokLinks || []
            }

        case '@@branchWebhookProfile/SET_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }


        case '@@branchWebhookProfile/UPDATE_DATA': {
            const { branchWebhookProfileId: updateWebhookProfileId, ...rest } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    results: state.data.results.map(row => (row.branchWebhookProfileId === updateWebhookProfileId ? { ...row, ...rest } : row)),
                },
            };
        }
        case '@@branchWebhookProfile/SET_ADDITIONAL_HEADERS': 
        return {
            ...state,
            additionalHeaders: action.payload
        }


        default:
            return state
    }
}

export default BrnachWebhookProfileReducer