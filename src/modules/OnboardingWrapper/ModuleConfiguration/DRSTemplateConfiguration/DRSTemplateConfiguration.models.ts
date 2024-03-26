import { ReactNode } from "react";
import { IClientProperty } from "../../../common/ClientProperties/interfaces";

export interface IRowData {
    templateName: string
    templateDesc: string
    isActiveFl: Boolean
    templateId: number
    isDefault: boolean
    refernceId: string
    isFavourite: boolean
}

export interface IDRSListDataPayload {
    clientBranchId?: number;
    otherCount?: number;
    totalCount: number;
    results: Array<IRowData>;
    clientProperties?: Record<string, IClientProperty>;
}

export interface IDrsTemplateFormData {
    templateId: number,
    templateName: string,
    templateDesc: string,
    orderHTML: string
    crateHTML: string
    itemHTML: string
    tripHTML: string
    customerHTML: string
    htmlData: {
        orderHTML: string
        crateHTML: string
        itemHTML: string
        tripHTML: string
        customerHTML: string
    }
}
export interface IDefaultTemplate {
    isActiveFl: boolean;
    templateName: string;
    isDefault: boolean;
    htmlData: {
        orderHTML: string;
        itemHTML: string;
        crateHTML: string;
        tripHTML: string;
        customerHTML: string;
    }
}

export interface IPreviewProps {
    children?: ReactNode
    className?: string;
    onClick: () => void;
}

export interface IDrsTempConfigTagsAPIResponse {
    id: string,
    tagGroupMappingList: IDrsTempConfigTagGroup[]
    dynamicTagKeys: IDrsTempConfigTag[]
}
export interface IDrsTempConfigTagGroup {
    key: string
    value: number
    label: string
}
export interface IDrsTempConfigTag {
    dynamicTagKey: string
    dynamicTagLabelKey: string
    dynamicTagLabelValue: string
    tagValueSize: number
    tagGroupId: number
    isCustomField?: boolean
}


export interface IAttachDynamicTagsProps {
    children: JSX.Element
    show?: boolean
    onSelect?: (label: string, value: string) => void
  }




