export interface IGetFilterParams {
    pageName: string
    sectionName: string
}

export interface IFilters {
    fieldId?: string;
    filterData?: string;
    operationSymbol?: string;
    operationLabelKey?: string;
    fieldLabelKey?: string | number;
    customField?: boolean;
    labelValue?: string
}

export interface IFilterData {
    id: string;
    filterName: string;
    ownerUserId?: number;
    pageName?: string;
    sectionName?: string;
    userGroupId?: number[];
    userIds?: number[];
    operationLogic?: string;
    advanceFilterTagReferenceIds?: string[];
    filters?: IFilters[];
    sortCriteria?: IFilters[];
    isFavourite?: boolean;
    customField: boolean
    fieldId: string
    fieldLabelKey: string
    filterData: string
    operationLabelKey: string
    operationSymbol: string
    favouriteSections: string[]
    userGroupIds: number[]
    [key: string]: any;

}

export interface ISaveFilterResponse {
    data?: boolean
    hasError?: boolean
    message?: string
    moreResultsExists?: boolean
    status?: number
}

export interface ISetDataType {
    key: string
    value: any
}
