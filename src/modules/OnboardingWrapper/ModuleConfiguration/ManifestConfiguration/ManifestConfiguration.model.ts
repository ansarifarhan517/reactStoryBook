
export interface ManifestTypeList {
    "clientRefMasterId"?: number | string,
    "clientRefMasterType"?: string,
    "clientRefMasterCd": string,
    "clientRefMasterDesc": string,
    "sequence"?: number,
    "add"?: boolean
}
export type manifestConfiOption = {
    value: string,
    label: string
}

export interface GenerateManifestList {
    "manifestType": string,
    "manifestField": string,
    "manifestConfiSelect"?: manifestConfiOption[],
    "manifestConfiOne"?: string,
    "manifestConfiTwo"?: string,
    "manifestConfiThree"?: string,
    "manifestSampleValue"?: string,
    "manifestConfiOneError"?:Boolean,
    "manifestConfiTwoError"?:Boolean,
    "manifestConfiTwoErrorType"?:String,
    "manifestConfiThreeError"?:Boolean,
    "manifestConfiThreeErrorType"?:String,
    "manifestSampleValueError"?:Boolean,
    "manifestSampleValueErrorType"?:String,
    "sequence": number,
}

export interface GenerateManifestPayload {
    "formula": string,
    "generatedSample": string,
    "name"?:string,
    "clientId": number,
    "fieldData": GenerateManifestList[]
}
