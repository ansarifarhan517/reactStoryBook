import { IAPIModuleData } from './interfaces';

export const getAPIModuleData = (module: string): IAPIModuleData => {
  switch (module) {
    case 'driver':
      return {
        url: '/DriverApp/driver',
        moduleKey: 'DRIVER',
        uniqueIdentifier: 'driverId'
      }
    case 'branchConfiguration':
      return {
        url: '/ClientApp/branchConfiguration',
        moduleKey: 'CLIENTBRANCH_ADD_FORM',
        uniqueIdentifier: 'clientBranchId'
      }
    case 'order':
      return {
        url: '/ShipmentApp/order',
        moduleKey: 'ORDERS',
        uniqueIdentifier: 'shipmentId'
      }
    case 'shipper':
        return {
          url: '/ClientApp/branchConfiguration',
          moduleKey: 'SHIPPER',
          uniqueIdentifier: 'shipperDetailsId'
        }  
    default:
      return {
        url: module,
        moduleKey: module,
        uniqueIdentifier: 'id'
      }
  }
}