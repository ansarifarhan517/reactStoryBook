import {ManifestTypeList, GenerateManifestPayload} from './ManifestConfiguration.model'
export interface IFetchManifestTypes{
  readonly type: "@@manifestonfiguration/FETCH__MANIFEST_TYPE";
}

export interface ISetManifestTypes{
    readonly type: "@@manifestonfiguration/SET__MANIFEST_TYPE";
    payload:any
}

export interface ISaveManifestTypes{
  readonly type: "@@manifestonfiguration/SAVE_MANIFEST_TYPE";
  payload:ManifestTypeList[]
}


export interface IFetchGenetateManifest{
  readonly type: "@@manifestonfiguration/FETCH__GENERATE_MANIFEST";
}

export interface ISetGenetateManifest{
    readonly type: "@@manifestonfiguration/SET__GENERATE_MANIFEST";
    payload:any
}

export interface ISaveGenetateManifest{
  readonly type: "@@manifestonfiguration/SAVE__GENERATE_MANIFEST";
  payload:GenerateManifestPayload
}

export type ManifestConfigurationActions = 
| IFetchManifestTypes
| ISetManifestTypes
| ISaveManifestTypes
| IFetchGenetateManifest
| ISetGenetateManifest
| ISaveGenetateManifest

