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
  deliveryMediumId: 62382
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
export type tDatePickerChildren = {
  value?: Date
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export interface IExceptionData {
  isActiveFl: boolean
  exceptionMode: string
  exceptionCode: string
  exceptionName: string
  exceptionType: string
  exceptionStage: string[]
  exceptionAppliesTo: string[]
  exceptionMessage: string
  exceptionGroupId: string
}

export interface IAttachDynamicTagsProps {
  children: JSX.Element;
  show?: boolean;
  onSelect?: (label: string, value: string) => void;
  tags: any;
  active?: boolean;
} 

export interface IInlinePopupContentProps {
  onSelect: (label: string, value: string) => void;
  Tags: any;
}