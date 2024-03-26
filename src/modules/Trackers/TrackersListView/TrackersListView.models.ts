import { IFetchDataOptions  } from 'ui-library'
import { tIconRef, tPopupRef} from '../../../utils/components/Map/interface';
export interface IEffectAction {
  [key: string]: any;
}
export interface IRowData {
  [key: string]: any;
  barcode: string
  clientBranchId: number
  clientBranchName: string
  deviceId: number
  deviceType: string
  gpsStatus: string
  imei: string
  isActiveFl: boolean
  status: string
  trackeeId: string
  trackerDescription: string
  trackerModel: string
  vehicleId: number
  vehicleNumber: string
}
export interface ITrackerDataPayload {
  totalCount: number,
  results: Array<IRowData>,
  listLoading?: boolean
}
export interface IActiveDeactiveConfirmation {
  fetchOptions : IFetchDataOptions
  handleFetchData: Function
  trackerActivationRequest: any
  setTrackerActivationRequest : Function
  setSelectedRows: Function
}
export interface IFormFields {
  [key: string]: any
}
export interface IMarkers {
  id: any
  position: [number, number]
  title: string
  type: string
  popupRef: tPopupRef
  iconRef: tIconRef
  lat: number
  lng: number
  networkStatus: string
}