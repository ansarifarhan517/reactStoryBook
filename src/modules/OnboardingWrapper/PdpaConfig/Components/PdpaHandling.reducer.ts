
import { StatsEvent } from "@aws-sdk/client-s3";
import { loadavg } from "os";
import ListView from "../../../Trips/Mile/TripsListView/components/ListView";
import { PdpaConfigActions } from "./PdpaConfig.action";
import { IConsentFormData, IPdpaState } from "./PdpaConfig.models";


const initialState: IPdpaState = {
    listview: {
        consentAct: {
            structure: {
                columns: {},
                buttons: {}
            },
            data: {
                totalCount: 0,
                results: [{}]
            },
            loading: false,
            viewType:"list"
        },
    },
    Form: {
        consetActForm: {
          structure: {},
          loading: true
        },
        consetActFormUpdate:{
            customFormData: {
                customFormId: 0,
                id: '',
                isActiveFl: '',
                userGroupId: 0,
                createdOnDt: '',
                consentType: '',
                isPublished:false,
                name:'',
                noOfModifications:0,
                version: 0,
                customFormStructure: {
                  columns: {},
                  buttons: {}
                }
              },
        },
        isUpdate: ""
      },
      pageType: 'listPage',
}

const pdpaHandlingReducer = (state = initialState, action: PdpaConfigActions): IPdpaState => {
    switch (action.type) {

        case  "@@PROTECTIONCONFIG/SET_PDPA_LISTVIEW_STRUCTURE_SUCCESS" :
            return {
                ...state,
                listview: {
                    ...state.listview,
                    consentAct: {
                        ...state.listview.consentAct,
                        structure: action.payload,
                        
                    }
                }
            }
            case '@@PROTECTIONCONFIG/GET_DATA_LISTVIEW_SUCCESS':
                const results = action.payload.results.map((row : IConsentFormData) =>{
                    const rowObj = row;
                    rowObj.editIconButtonProps = {
                      "style": {
                        'backgroundImage': "url('images/eye_blue.svg')",
                        'backgroundSize': 'contain',
                        'height': '17px',
                        'width': '17px',
                        "backgroundRepeat": "no-repeat",
                        'margin': '0px 5px 8px'
                      },
                      "title": "Preview",
                      "iconVariant": ''
                    }
                      return rowObj;
                })
                
                return {
                    ...state,
                    listview: {
                        ...state.listview,
                        consentAct: {
                            ...state.listview.consentAct,
                            data: {
                                ...action.payload,
                                results : results
                            },
                            loading: false
                        }
                    }
                }
            case '@@PROTECTIONCONFIG/SET_LIST_LOADING':
                return {
                    ...state,
                    listview:{
                        ...state.listview,
                        consentAct: {
                            ...state.listview.consentAct,
                            loading: action.payload
                        }
                    }
                }
            case  '@@PROTECTIONCONFIG/SET_VIEW_TYPE':
                return {
                    ...state,
                    listview:{
                        ...state.listview,
                        consentAct: {
                            ...state.listview.consentAct,
                            viewType: action.payload.viewType
                        }
                    }

                }
        case '@@PROTECTIONCONFIG/SET_FETCH_FORM': {
            return {

                ...state,
                Form: {
                    ...state.Form,
                        consetActForm: {
                        structure: action.payload,
                        loading: false
                    }
                }
            }
        }
        case '@@PROTECTIONCONFIG/STORE_UPDATE_CONSENT_FORM':{
            return {
                ...state,
                Form :{
                    ...state.Form,
                    consetActFormUpdate:{
                        customFormData:action.payload
                    },
                }
            }
        }

        case '@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE':{
            return {
                        ...state,
                        Form:{
                            ...state.Form,
                            isUpdate:action.payload.viewType
                        }
                        

            }
        }
        case  "@@PROTECTIONCONFIG/SET_PAGETYPE" :
            return {
                ...state,
                pageType : action.payload
            }

        default:
            return state
    }
}

export default pdpaHandlingReducer


