import { IAdditionalHeader, IAdditionalWebhookRecord } from "../../../../../utils/common.interface"
import { IMongoListViewStructure } from "../../../../../utils/mongo/interfaces"
import { WebhookProfileActions } from "./ShipperWebhookProfile.actions"

export interface IWebhookLink {
    type: string | undefined
    link: string | undefined
}

export interface IValidWebhookLink extends IWebhookLink {
    isValid: boolean,
    showValidation?: boolean
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
    webhookUrls?: string[]
    headerList: IAdditionalHeader[]
    tokenSetPref?: any
    webhookUrlsData?: Array<{url:string}>
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
    }
    selectedEvents: string[],
    selectedEventsObject: { key: string, value: string }[],
    additionalHeaders: IAdditionalWebhookRecord[]
}
export interface IGetWebhookDetailsParams {
    webhookProfileId: string
    subClientId: string | number
}

export const dummyColumns: any = {
    webhookProfileName: { label: "Shipper Webhook Profile Name", permission: true },
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
    selectedEvents: [],
    selectedEventsObject: [],
    loading: {
        listView: true,
        columns: true
    },
    additionalHeaders: []
}

const ShipperWebhookProfileReducer = (state = initialState, action: WebhookProfileActions): IWebhookProfileState => {
    switch (action.type) {
        case '@@shipperWebhookProfile/SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            }

        case '@@shipperWebhookProfile/SET_LIST_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    ...action.payload
                }
            }


        case '@@shipperWebhookProfile/SET_EDIT_MODE':
            return {
                ...state,
                isEditMode: true
            }

        case '@@shipperWebhookProfile/SET_WEBHOOKS_LINKS':
            return {
                ...state,
                webhookLinks: action.payload
            }

        case '@@shipperWebhookProfile/SET_EVENTS_DATA':
            return {
                ...state,
                events: action.payload
            }

        case '@@shipperWebhookProfile/FETCH_STRUCTURE_SUCCESS':
            return {
                ...state,
                listStructure: action.payload
            }

        case '@@shipperWebhookProfile/FETCH_DATA_SUCCESS':
            return {
                ...state,
                data: {
                    ...action.payload
                }
            }

        case '@@shipperWebhookProfile/INITIALISE_FORM':
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
                }
            }

        case '@@shipperWebhookProfile/SET_WEBHOOK_PROFILE_FORM_DATA':
            return {
                ...state,
                webhookProfileFormData: {
                    ...state.webhookProfileFormData,
                    [action?.payload.key]: action.payload.value
                }
            }

        case '@@shipperWebhookProfile/SET_WEBHOOK_DETAILS_DATA':
            const { webhookUrlsData, events } = action.payload;
            console.log(action.payload,'alankar shipperWebhookProfile')
            const updatedWebhhokLinks = webhookUrlsData?.map((webhook) => {
                const linkArray = webhook?.url?.split('#@#');
                return {
                    type: linkArray[0],
                    link: linkArray[1],
                    isValid: true,
                    showValidation: true
                }
            });
            let selectedEvents: string[] = [];
            let selectedEventsObject: { key: any; value: any }[] = [];
            Object.keys(state.events).forEach(key => {
                state.events[key].events.forEach(event => {
                    if (events && events.indexOf(event.clientRefMasterCd) > -1) {
                        event.checked = true;
                        selectedEvents.push(event.clientRefMasterCd);
                        selectedEventsObject.push({ key: event.clientRefMasterCd, value: event.name })
                    } else {
                        event.checked = false
                    }
                })
            })
            return {
                ...state,
                webhookProfileFormData: {
                    ...state.webhookProfileFormData,
                    ...action.payload
                },
                webhookLinks: updatedWebhhokLinks || [],
                selectedEvents: selectedEvents,
                selectedEventsObject: selectedEventsObject
            }

        case '@@shipperWebhookProfile/SET_DATA':
            return {
                ...state,
                [action.payload.key]: action.payload.value
            }

        case '@@shipperWebhookProfile/UPDATE_DATA': {
            const { webhookProfileId: updateWebhookProfileId, ...rest } = action.payload;
            return {
                ...state,
                data: {
                    ...state.data,
                    results: state.data.results.map(row => (row.webhookProfileId === updateWebhookProfileId ? { ...row, ...rest } : row)),
                },
            };
        }
        case '@@shipperWebhookProfile/SET_ADDITIONAL_HEADERS': 
        return {
            ...state,
            additionalHeaders: action.payload
        }

        default:
            return state
    }
}

export default ShipperWebhookProfileReducer