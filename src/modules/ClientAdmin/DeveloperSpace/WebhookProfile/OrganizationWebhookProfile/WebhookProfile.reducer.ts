import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces"
import { WebhookProfileActions } from "./WebhookProfile.actions"

export interface IWebhookLink {
    type: string | undefined
    link: string | undefined
}

export interface IValidWebhookLink extends IWebhookLink {
    isValid: boolean,
    showValidation?: boolean,
    tokenName?:any
    appendTo?:any
}

export interface IAdditionalHeader {
    key: string
    value: string
    sequence: number
}

export interface IOrganisationWebhookList {
    createdOnDt: number,
    isActiveFl: boolean,
    webhookProfileId: number,
    webhookProfileName: string,
    secureWebhook: boolean
}

export interface IOrganisationWebhookListDataPayload {
    totalCount: number,
    otherCount?: number,
    clientBranchId?: number,
    results: IOrganisationWebhookList[]

}

export interface IWebhookProfileFormData {
    createdOnDt?: number
    isActiveFl?: boolean
    webhookProfileName: string
    secureWebhook: boolean
    webhookHeaderFl: boolean
    webhookSignature: string
    webhookLink: IValidWebhookLink[]
    events?: string[]
    webhookUrls?: any,
    headerList: IAdditionalHeader[]
    mapTokenFl ?: any
    assignToAllFl ?:any
    tokenSetPref ?:any
    webhookUrlsData ?:any
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
    title: string
    titleLabelKey: string
    events: IEvents[]
}


export interface IWebhookProfileState {
    isLoading: boolean,
    isEditMode: boolean,
    webhookProfileFormData: IWebhookProfileFormData
    webhookLinks: IValidWebhookLink[]
    events: Record<string, IEventsObject>
    listStructure: IMongoListViewStructure
    data: IOrganisationWebhookListDataPayload
    editedWebhookProfile?: IOrganisationWebhookList
    loading: {
        listView: boolean,
        columns: boolean,
    },
    additionalHeaders: IAdditionalWebhookRecord[]
    tokenName : any
    OauthTokenDropDown : any
}

export interface IAdditionalWebhookRecord {
    [key: string]: {
        id: string
        name: string
        class: string
        value1?: string
    }
}

export const dummyColumns: any = {
    webhookProfileName: { label: "Organization Webhook Profile Name", permission: true },
    isActiveFl: { label: "Active / Inactive", permission: true }
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({ clientCoLoaderId: i + 1 }))

const initialState: IWebhookProfileState = {
    isLoading: false,
    isEditMode: false,
    webhookProfileFormData: {
        webhookProfileName: '',
        secureWebhook: false,
        webhookHeaderFl: true,
        webhookSignature: '',
        webhookLink: [],
        events: [],
        webhookUrls: [],
        headerList: []
    },
    webhookLinks: [],
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
    additionalHeaders: [],
    tokenName : [],
    OauthTokenDropDown : []
}

const WebhookProfileReducer = (state = initialState, action: WebhookProfileActions): IWebhookProfileState => {
    switch (action.type) {
        case '@@webhookProfile/SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case '@@webhookProfile/SET_LIST_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...action.payload
                }
            }
        case '@@Oauth/SET_ADDITIONAL_TOKEN':
            return {
                ...state,
                tokenName : action.payload
            }


        case '@@webhookProfile/SET_EDIT_MODE':
            return {
                ...state,
                isEditMode: true
            }

        case '@@webhookProfile/SET_WEBHOOKS_LINKS':
            return {
                ...state,
                webhookLinks: action.payload
            }

        case '@@webhookProfile/SET_EVENTS_DATA':
            return {
                ...state,
                events: action.payload
            }

        case '@@webhookProfile/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                listStructure: action.payload
            }

        case '@@webhookProfile/FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: {
                    ...action.payload
                }
            }

        case '@@webhookProfile/INITIALISE_FORM':
            // const results = Object
            Object.keys(state.events).forEach(key => {
                state.events[key].events.forEach((event) => {
                    event['checked'] = false
                })
            })
            return {
                ...state,
                webhookProfileFormData: {
                    webhookProfileName: '',
                    secureWebhook: false,
                    webhookHeaderFl: true,
                    webhookSignature: '',
                    webhookLink: [],
                    events: [],
                    webhookUrls: [],
                    headerList: []
                },
                webhookLinks: [],
                editedWebhookProfile: undefined,
                events: {
                    ...state.events
                },
                isEditMode: false
            }

        case '@@webhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA':
            return {
                ...state,
                webhookProfileFormData: {
                    ...state.webhookProfileFormData,
                    [action?.payload.key]: action.payload.value
                }
            }

        case '@@webhookProfile/SET_WEBHOOK_DETAILS_DATA':
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
                    event.checked = events && events.indexOf(event.clientRefMasterCd) > -1 ? true : false
                })
            })
            return {
                ...state,
                webhookProfileFormData: {
                    ...state.webhookProfileFormData,
                    ...action.payload
                },
                webhookLinks: updatedWebhhokLinks || []
            }

        case '@@webhookProfile/SET_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }
        case '@@webhookProfile/FETCH_DATA_TOKEN_SUCCESS':
            return {
                ...state,
                OauthTokenDropDown : action.payload
            }    

        case '@@webhookProfile/UPDATE_DATA': {
            const { webhookProfileId: updateWebhookProfileId, ...rest } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    results: state.data.results.map(row => (row.webhookProfileId === updateWebhookProfileId ? { ...row, ...rest } : row)),
                },
            };

        }

        case '@@webhookProfile/SET_ADDITIONAL_HEADERS': 
            return {
                ...state,
                additionalHeaders: action.payload
            }

        default:
            return state
    }
}

export default WebhookProfileReducer