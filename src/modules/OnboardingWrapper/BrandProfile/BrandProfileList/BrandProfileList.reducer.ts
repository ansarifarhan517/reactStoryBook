import { IMongoListViewStructure } from "../../../../utils/mongo/interfaces"
import { BrandProfileListActions } from "./BrandProfileList.actions"
import { IBrandProfileFormData, IBrandProfileListDataPayload, IHtmlCodePayload, IRowData } from "./BrandProfileList.models"

export interface IBrandProfileListState {
    structure: IMongoListViewStructure,
    data: IBrandProfileListDataPayload,
    brandProfileFormData: IBrandProfileFormData,
    isEditBrandProfile: IRowData | undefined,
    defaultHeader : IHtmlCodePayload,
    defaultFooter: IHtmlCodePayload,
    defaultTemplateReferenceId: string,
    loading: {
      listView: boolean;
      columns:boolean;
    },
    isLoading: boolean
}

export const dummyColumns: any = {
  brandProfileDesc: {label: "Brand Profile Description",permission: true},
  brandProfileName: {label: "Brand Profile Name", permission: true},
  isActiveFl: {label: "Active / Inactive",permission: true}
}

export const dummyResult: any = Array(15).fill(0).map((_, i) => ({brandProfileId: i + 1 }))

const initialState: IBrandProfileListState = {
    structure: {
      columns: dummyColumns,
      buttons: {}
    },
    data: {
      totalCount: 0,
      results: dummyResult
    },
    brandProfileFormData: {
      brandProfileId: 0,
      brandProfileName: '',
      brandProfileDesc: '',
      structureReferenceId: '',
      isActiveFl: false,
      clientId: 0,
      promotionLinks : [
        {
          mediaDto : {
            mediaUrl: '', 
            id: 0,
            filename: ''
          },
          link: '',
          hasLinkError: false
        },
        {
          mediaDto : {
            mediaUrl: '', 
            id: 0,
            filename: ''
          },
          link: '',
          hasLinkError: false
        }
      ],
      header: {
        isDefault: false,
        htmlData: ''
      },
      footer: {
        isDefault: false,
        htmlData: ''
      }
    },
    isEditBrandProfile: undefined,
    defaultHeader: {
      isDefault: false,
      htmlData: ''
    },
    defaultFooter: {
      isDefault: false,
      htmlData: ''
    },
    defaultTemplateReferenceId: '',
    loading: {
      listView: false,
      columns: false
    },
    isLoading: false,
}

const BrandProfileListReducer = (state = initialState, action: BrandProfileListActions): IBrandProfileListState => {
    switch (action.type) {
        case '@@brandProfileList/FETCH_STRUCTURE_SUCCESS':
          return {
            ...state,
            structure: action.payload
          }

        case '@@brandProfileList/FETCH_DATA_SUCCESS':
          return {
              ...state,
              data: {
              ...action.payload
              }
          }

        case '@@brandProfileList/SET_BRAND_PROFILE_DETAILS_DATA':
          return {
              ...state,
              brandProfileFormData: {
                ...state.brandProfileFormData,
                ...action.payload
              }
          }

        case '@@brandProfileList/SET_BRAND_PROFILE_FORM_DATA' : 
          if (action?.payload.key === 'promotionLinks') {
            state.brandProfileFormData.promotionLinks = action.payload.value
          } else if (action?.payload.key.includes('promotionLinks')) {
              const param = action.payload.key.split('-')[1].split('.');
              state.brandProfileFormData.promotionLinks[param[0]][param[1]] = action.payload.value
          }
          return {
            ...state,
            brandProfileFormData: {
                ...state.brandProfileFormData,
                [action?.payload.key]: action.payload.value
            }

          }

        case '@@brandProfileList/GET_DEFAULT_TEMPLATE_DATA_SUCCESS' : 
        console.log('payload---->', action?.payload)
          return {
            ...state,
            defaultHeader : action?.payload.header,
            defaultFooter: action?.payload.footer,
            defaultTemplateReferenceId: action?.payload.structureReferenceId

          }

        case '@@brandProfileList/SET_DATA':
          return {
              ...state,
              [action.payload.key]: action.payload.value
          }

        case '@@brandProfileList/INITIALISE_FORM' :
          return {
            ...state,
            brandProfileFormData: {
              brandProfileId: 0,
              brandProfileName: '',
              brandProfileDesc: '',
              isActiveFl: false,
              structureReferenceId: '',
              clientId: 0,
              promotionLinks : [
                {
                  mediaDto : {
                    mediaUrl: '', 
                    id: 0,
                    filename: ''
                  },
                  link: '',
                  hasLinkError: false
                },
                {
                  mediaDto : {
                    mediaUrl: '', 
                    id: 0,
                    filename: ''
                  },
                  link: '',
                  hasLinkError: false
                }
              ],
              header: {
                isDefault: false,
                htmlData: ''
              },
              footer: {
                isDefault: false,
                htmlData: ''
              }
            },
            isEditBrandProfile: undefined
          }

        case '@@brandProfileList/SET_LOADING':
          return {
            ...state,
            loading: {
              ...state.loading,
              ...action.payload
            }
          }

        case '@@brandProfileList/SET_FORM_LOADING':
          return {
              ...state,
              isLoading: action.payload
          }

        case '@@brandProfileList/SET_COLUMNS_LOADING':
          return {
            ...state,
            loading: {
              ...state.loading,
              ...action.payload
            }
          }

        default:
            return state
    }
}
      
      
export default BrandProfileListReducer
