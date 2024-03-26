import { IMongoDynamicHTMLTemplate } from '../../../utils/common.interface';
import { IMongoListViewStructure } from "../../../utils/mongo/interfaces";
// import { IPrintManifestOrderDetails } from './PrintManifestLabel/PrintAWB.models';
import { ManifestListActions } from "./ManifestList.actions";
import { IManifestListDataPayload ,IRowData} from "./ManifestList.models";
import { IOrderPrintManifestTemplateData } from './PrintManifest/PrintManifest.models';
import { IOrderPrintAWBTemplateData } from './PrintManifestLabel/PrintAWB.models';

export interface IManifestListState {
    structure: IMongoListViewStructure,
    data: IManifestListDataPayload,
    loading: {
      listView: boolean;
      columns:boolean;
    },
    printAWB: {
      templates: IMongoDynamicHTMLTemplate<IOrderPrintAWBTemplateData>[],
      isModalOpen: boolean
      orderDetails: any[]
    },
    printManifestTemplate?: IMongoDynamicHTMLTemplate<{manifestHTML: string, shipmentHTML: string}>,
    printManifestLabelTemplate?: IMongoDynamicHTMLTemplate<{manifestHTML: string}>
    currentSelectedIds?: any[]
    printManifest :{
      isModalOpen : boolean;
      orderDetails: any[];
      templates: IMongoDynamicHTMLTemplate<IOrderPrintManifestTemplateData>[]
    }
}

export const dummyColumns: any = {
    coLoader: {label: "Courier Name",permission: true},
    deliveryBoy: {label: "Delivery Associate", permission: true},
    manifestCreationDate: {label: "Manifest Creation Date", permission: true},
    manifestId: {label: "Manifest Id", permission: true},
    manifestStatus: {label: "Manifest Status",permission: true},
    manifestType: {label: "Outscanned By", permission: true},
    manifestUpdatedDate: {label: "Manifest Updated Date",permission: true},
    totalOrders: {label: "No Of Shipments",permission: true},
    tripName: {label: "Trip Name",permission: true},
    tripStatus: {label: "Trip Status", permission: true}
}
export const dummyResult: any = Array(15).fill(0).map((_, i) => ({manifestId: i + 1 }))


const initialState: IManifestListState = {
    structure: {
      columns: dummyColumns,
      buttons: {}
    },
    data: {
      totalCount: 0,
      results: dummyResult
    },
    loading: {
      listView: false,
      columns: false
    },
    printAWB: {
      templates: [],
      isModalOpen: false,
      orderDetails: []
    },
    printManifest :{
      isModalOpen : false,
      orderDetails: [],
      templates: []
    }

   
}

const ManifestListReducer = (state = initialState, action: ManifestListActions): IManifestListState => {
    switch (action.type) {
        case '@@manifestList/FETCH_STRUCTURE_SUCCESS': {
          return {
            ...state,
            structure: action.payload
          }
          break;
        }
        

        case '@@manifestList/FETCH_DATA_SUCCESS': {
          const results = action?.payload?.results?.map((row:IRowData) => {
              if(row.tripStatus === 'ENDED'){
                  row.editIconButtonProps = {
                          style: {
                            opacity: '0'
                          },
                          onClick: undefined,
                          title: ''
                        }
                      }
          row.manifestStatus === 'HANDEDOVER' || row.manifestStatus === 'HANDEDOVER_DESTINATION_BRANCH' || row.manifestStatus === 'HANDEDOVER_ORIGIN_BRANCH' ? 
          {...row, hasSelectionDisabled: true, rowIdentifier: `${row.manifestNo}-${row.shipmentIds?.reduce((accumulator, currentValue) => accumulator += currentValue, '')}`} : 
          {...row, rowIdentifier: `${row.manifestNo}-${row.shipmentIds?.reduce((accumulator, currentValue) => accumulator += currentValue, '')}`}

          return row
          }
        )
        return {
            ...state,
            data: {
            ...action.payload,
            results: results
            }
        }
        break;
        }
          

        case '@@manifestList/SET_LOADING': {
          return {
            ...state,
            loading: {
              ...state.loading,
              ...action.payload
            }
          }
          break;
        }

        case '@@manifestList/SET_COLUMNS_LOADING': {
          return {
            ...state,
            loading: {
              ...state.loading,
              ...action.payload
            }
          }
          break;
        }

        case '@@manifestList/SET_PRINT_MANIFEST_TEMPLATE': {
          return {
            ...state,
            printManifestTemplate: action.payload
          }
          break;
        }

        case '@@manifestList/SET_PRINT_MANIFEST_LABEL_TEMPLATE': {
          return {
            ...state,
            printManifestLabelTemplate: action.payload
          }
          break;
        }

          case '@@manifestList/FETCH_AWB_HTML_TEMPLATES_SUCCESS': {
            return {
              ...state,
              printAWB: {
                ...state.printAWB,
                templates: action.payload
              }
            }
            break;
            
          }
          case '@@manifestList/SET_AWB_MODAL_OPEN': {
            return {
              ...state,
              printAWB: {
                ...state.printAWB,
                isModalOpen: action.payload
              }
            }
            break;
          }

      
          case '@@manifestList/FETCH_AWB_ORDER_DETAILS_SUCCESS':{
            return {
              ...state,
              printAWB: {
                ...state.printAWB,
                orderDetails: action.payload
              }
            }
            break;
          }

            case '@@manifestList/SET_CURRENT_SELECTED_IDS': {
            return { 
              ...state,
              currentSelectedIds: [...action.payload]
            }
            break;
          }

          case '@@manifestList/FETCH_MANIFEST_HTML_TEMPLATES_SUCCESS': {
            return {
              ...state,
              printManifest: {
                ...state.printManifest,
                templates: action.payload
              }
            }
            break;
            
          }

          case '@@manifestList/SET_PRINT_MANIFEST_MODAL_OPEN': {
            return {
              ...state,
              printManifest: {
                ...state.printManifest,
                isModalOpen: action.payload
              }
            }
            break;
          }

          case '@@manifestList/FETCH_MANIFEST_ORDER_DETAILS_SUCCESS':{
            return {
              ...state,
              printManifest: {
                ...state.printManifest,
                orderDetails: action.payload
              }
            }
            break;
          }
          
        default:
            return state
    }
}
      
      
export default ManifestListReducer