export interface IAssociateTripData {
    clientBranchId: number
    otherCount: number
    results: IAssociateTripResult[]
    totalCount: number
}
  
export interface IAssociateTripResult {
    milkRun: string
    trips: ITrips[]
}
export interface ITrips {
    assignedOrders: number
    branchName: string
    deliveryMediumId: number
    deliveryMediumName: string
    deliveryMediumStatus: string
    phoneNumber: string
    routeName: string
    routePlanningId: number
    tripId: number
    tripName: string
    tripStatus: string
    unitsCapacity: number
    volumeCapacity: string
    weightCapacity: string
    milkRun: string
}

export interface IListViewColumn {
    [key: string]: any
}
  