import { IStatusList } from '../ShipperListView.models';

export interface IRejectConfirmation {
    showModal: boolean
    setShowModal: (value: boolean) => void
    page?:string
}
export interface IShipperRequest {
    activeRequest: boolean
    shipperDetailsId: Record<number, boolean>
    reason?: any
    failureCallback: React.Dispatch<React.SetStateAction<boolean>>
    showModal?: boolean
}
export interface INoOfUserRequest {
    activeRequest: boolean
    customClientId: number | undefined
}
export interface IActivationConfirmation {
    shipperActivationRequest?: IShipperRequest
    confirmationMessage: string
    title: string
    handleShipperActivation: (selectedReason: any) => void
    dynamicLabels: Record<string, string>
    deactivationReasonList: IStatusList[]
    setShipperActivationRequest: () => void
}
export interface IActivationModalButtonGroup {
    iconVariant: string
    primary: boolean
    label: string
    onClick: () => void
    isVisible?: true
}

export interface IUpdateConfirmation {
    daUpdateRequest: any
    setDaUpdateRequest: (value: any) => void
    title: string
    dynamicLabels: Record<string, string>
    handleOkAction: () => void
    content: string
}