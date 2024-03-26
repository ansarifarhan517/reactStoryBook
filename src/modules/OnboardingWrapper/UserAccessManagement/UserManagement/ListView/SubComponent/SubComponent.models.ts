export interface IDeleteModal {
    showDeletionConfirmation: boolean
    setShowDeletionConfirmation: (value: boolean) => void
    deleteSelectedRows: (e: any) => void
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

export interface IUpdateConfirmation {
    daUpdateRequest: any
    setDaUpdateRequest: (value: any) => void
    title: string
    handleOkAction: () => void
    content: string
}
  

export interface IHandOverDropDownOptions {
    userId: number
    name: string
    emailAddress: string
}