
export interface IRowData {
    emailTemplateName: string
    emailTemplateDesc: string
    isActiveFl: Boolean
    isDefault: Boolean
    emailTemplateId: number
    structureRefernceId?: string
}

export interface IAlertMessageTemplateListDataPayload {
    clientBranchId?: number;
    otherCount?: number;
    totalCount: number;
    results: Array<IRowData>;
}

export interface IAlertMessageFormData {
    emailTemplateId: number
    emailTemplateName: string
    emailTemplateDesc: string
    htmlData: string
}

export interface ISelectedTemplate {
    clientId: number
    emailTemplateDesc: string
    emailTemplateId: number
    emailTemplateName: string
    htmlData: string
    isActiveFl: boolean
    isDeleteFl: string
    structureRefernceId: string
    isDefault: boolean
}

export interface IDefaultTemplate {
    isActiveFl: boolean;
    structureReferenceId: string;
    isDefault: boolean;
    htmlData: string;
}

export interface IDefaultTemplatePayload {
    payload: Array<IDefaultTemplate>;
}

export interface IDefaultTemplatePayloadData {
    defaultTemplates: IDefaultTemplatePayload;
    map: Function;
    filter: Function;
}
