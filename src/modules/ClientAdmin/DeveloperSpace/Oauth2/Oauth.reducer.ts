import { IMongoFormStructure, IMongoListViewStructure } from "../../../../utils/mongo/interfaces"
import { IManifestListDataPayload } from "../../../Manifest/ManifestListView/ManifestList.models"
import { OauthAction } from "./Oauth.action"

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({id: i + 1 }))


export interface OauthState {
    isLoading: boolean,
    isEditMode: boolean,
    islistEmpty: boolean,
    structure: IMongoListViewStructure,
    data: IManifestListDataPayload,
    form:{
        structure :any,
        isLoading : boolean,
        oAuthFormData :any,
        fetchFormStructureSuccessFlag: boolean
    },
    isFormEditable : boolean,

    
}

const initialState: OauthState = {
    isLoading: false,
    isEditMode: false,
    islistEmpty :  false,
    structure: {
        columns: {},
        buttons: {}
      },
      data: {
        totalCount: 0,
        results: dummyResult
      },
      form:{
        structure : {},
        isLoading : false,
        oAuthFormData :{},
        fetchFormStructureSuccessFlag: false
      },
      isFormEditable : false
      
}

const OAuthReducer = (state = initialState, action: OauthAction): OauthState => {
    switch (action.type) {
        case '@@OAUTH/FETCH_STRUCTURE_SUCCESS':
            return {
              ...state,
              structure: action.payload
            }
        case '@@OAUTH/FETCH_DATA_SUCCESS':
            return {
                ...state,
                isLoading: false,
                data:action.payload.data
            }
        case '@@OAUTH/SET_LOADING':
            return {
                ...state,
                isLoading:true
            }
        case '@@OAUTH/IS_LIST_EMPTY':
            return {
                ...state,
                islistEmpty: action.payload
            }
        case '@@OAUTH/SET_UPDATED_FORM_STRUCTURE':
            console.log(action.payload ,"hema")
            return{
                ...state,
                form :{
                    ...state.form,
                    structure: action.payload
                }
            }
        case '@@OAUTH/SET_FORM_STRUCTURE':
            return{
                ...state,
                form :{
                    ...state.form,
                    structure: action.payload
                }
            }
        
        case '@@OAUTH/SET_FORM_LOADING':
            return{
                ...state,
                form:{
                    ...state.form,
                    isLoading : action.payload
                }
            }
        
        case'@@OAUTH/SET_FORM_EDITABLE':
            return {
                ...state,
                isFormEditable:action.payload
            }
        
        case '@@OAUTH/SET_UPDATE_DATA':
            return{
                ...state,
               form:{
                ...state.form,
                oAuthFormData:action.payload
               }
            }
        
        case '@@OAUTH/SET_FORM_STRUCTURE_FLAG':
            return{
                ...state,
               form:{
                ...state.form,
                fetchFormStructureSuccessFlag:action.payload
               }
            }
        case '@@OAUTH/RESET_FORM_DATA' :
            return{
                ...state,
               form:{
                ...state.form,
                oAuthFormData:[]
               }
            }
        
        default:
            return state
    }
}

export default OAuthReducer