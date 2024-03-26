import { IMongoFormStructure } from '../../../../../utils/mongo/interfaces';
import { IFlatMap } from './AccessProfileForm.models'
 
export interface IAccessProfileFormFetchStructure {
    readonly type: '@@accessProfileForm/FETCH_STRUCTURE'
    payload : string

  }

  export interface IAccessProfileFormSetStructure {
    readonly type: '@@accessProfileForm/SET_STRUCTURE'
    payload: IMongoFormStructure
  }

  export interface IAccessProfileFormSetLoading {
    readonly type: '@@accessProfileForm/SET_LOADING'
    payload: boolean
  }

  export interface IAccessProfileFormSetFlatObject {
    readonly type : '@@accessProfileForm/SET_FLATOBJECT'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetDispatcherReadOnlyAcc {
    readonly type : '@@accessProfileForm/SET_DISPATCHER_READONLYACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetDispatcherAllAccessAcc{
    readonly type : '@@accessProfileForm/SET_DISPATCHER_ALLACCESSACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetCarrierReadOnlyAcc {
    readonly type : '@@accessProfileForm/SET_CARRIER_READONLYACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetCarrierAllAccessAcc {
    readonly type : '@@accessProfileForm/CARRIER_ALLACCESSACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetShipperReadOnlyAcc {
    readonly type : '@@accessProfileForm/SHIPPER_READONLYACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetShipperAllAccessAcc{
    readonly type : '@@accessProfileForm/SHIPPER_ALLACCESSACC'
    payload : IFlatMap
  }

  export interface IAccessProfileFormSetAccessRefIds {
    readonly type : '@@accessProfileForm/SET_ACCESSREFIDS'
    payload : IFlatMap
  }


  export type IAccessProfileFormActions = 
      | IAccessProfileFormFetchStructure
      | IAccessProfileFormSetStructure
      | IAccessProfileFormSetLoading
      | IAccessProfileFormSetFlatObject
      | IAccessProfileFormSetAccessRefIds
      | IAccessProfileFormSetDispatcherReadOnlyAcc
      | IAccessProfileFormSetDispatcherAllAccessAcc
      | IAccessProfileFormSetCarrierReadOnlyAcc
      | IAccessProfileFormSetCarrierAllAccessAcc
      | IAccessProfileFormSetShipperReadOnlyAcc
      | IAccessProfileFormSetShipperAllAccessAcc
  