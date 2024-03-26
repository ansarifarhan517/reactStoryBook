export interface IMongoImportSettingsField {
    id?: string,
    logoPath: string;
    label: string;
    required: boolean;
    permission: boolean;
    childLength?: number;
    rowSpan?: number;
    colSpan?: number;
    childNodes?: Record<string, IMongoImportSettingsField>;
    labelKey?: string;
    searchable?: boolean;
    editable?: boolean;
    sortable?: boolean;
    allowed?: boolean;
    commentLabelKey: string;
    customField?: boolean;
    descLabel?: string;
    descLabelKey: string;
    infoFlag?: boolean;
    excelDropDownHidden?: boolean;
    fieldType?: string;
}

export interface IMongoImportSettingsModule {
    [key: string]: IMongoImportSettingsField;
}

export interface IMongoImportSettingsStructure {
    [key: string]: Record<string, IMongoImportSettingsModule>;
}

export interface IClientsLookUpData {
    id: string;
    name: string;
}

export interface IClients {
    importFrom: string;
    importTo: string;
    // modelType: string;
}