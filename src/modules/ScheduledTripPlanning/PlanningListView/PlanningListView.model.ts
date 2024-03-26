import { IClientProperty } from '../../common/ClientProperties/interfaces';

export interface IListViewDataPayload {
    clientBranchId?: number
    otherCount?: number
    totalCount: number
    results: Array<IRowData>
    clientProperties?: Record<string, IClientProperty>
}

export interface IRowData {
    createdOnDt?: number
    description?: string
    isActiveFl?: boolean
    name?: string
    schedulerDetailsId: number
    [key:string]: any
}
export interface IActivationConfirmation {
    isShowActivationConfirmation: boolean
    confirmationMessage: string
    title: string
    footerButtonGroup: IActivationModalButtonGroup[]
    handleClose: () => void
}
export interface IActivationModalButtonGroup {
    iconVariant: string
    primary: boolean
    label: string
    onClick: () => void
    isVisible?: true
}

export interface IEditTypeRequest {
    schedulerId:number,
    activeStatusFl:boolean,
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
  }