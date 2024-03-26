import { IListViewRequestPayload } from '../../../../utils/common.interface';
import { IClientProperty } from '../../../common/ClientProperties/interfaces';

export interface IRowData {
    brandProfileName: string
    brandProfileDesc: string
    isActiveFl: Boolean
    brandProfileId: number
    structureRefernceId: string
}

export interface IBrandProfileRequestPayload extends IListViewRequestPayload {
    subClientId?: number
}

export interface IBrandProfileListDataPayload {
    clientBranchId?: number;
    otherCount?: number;
    totalCount: number;
    results: Array<IRowData>;
    clientProperties?: Record<string, IClientProperty>;
}
export interface IPromotionLink {
    files: Array<Object> | undefined
    link: string | undefined
}

export interface IPromotionImagePayload {
    isActiveFl?: boolean
    mediaUrl?: string  
    mediaLocation?: string
    id: number,
    filename: string
    [key: string]: any;
}

export interface IMediaDtoPayload {
    link: string,
    hasLinkError: boolean,
    mediaDto : IPromotionImagePayload
}

export interface IHtmlCodePayload {
    isDefault: boolean,
    htmlData: string
}

export interface IBrandProfileFormData {
    isActiveFl: boolean
    isDeleteFl?: boolean
    brandProfileId: number
    brandProfileName: string
    brandProfileDesc: string
    structureReferenceId: string
    clientId: number
    promotionLinks: IMediaDtoPayload[]
    header: IHtmlCodePayload
    footer: IHtmlCodePayload
}

export interface IBrandProfileDetailsData {
    status: number
    message: string
    moreResultsExists: boolean
    data : IBrandProfileFormData
    hasError: boolean

}

export interface IDefaultTemplateData {  
    structureReferenceId: string,
    header: IHtmlCodePayload,
    footer: IHtmlCodePayload
}
