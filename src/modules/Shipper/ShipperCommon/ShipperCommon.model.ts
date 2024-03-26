
export interface IShipperOnboardingReducerState {
    onBoardingData:IShipperFormData,
}

/** Actions */


export interface IShipperSetOnboardingStructure {
  readonly type: '@@shipperOnboarding/SET_STRUCTURE'
  payload: IShipperFormData
}

export interface IShipperFetchOnboardingStructure { 
  readonly type: '@@shipperOnboarding/FETCH_STRUCTURE',
}

export interface IShipperResetOnboardingStructure { 
    readonly type: '@@shipperOnboarding/RESET_STRUCTURE',
}



export type IShipperCommonFormActions = 
  | IShipperFetchOnboardingStructure 
  | IShipperSetOnboardingStructure
  | IShipperResetOnboardingStructure
   


export interface IShipperFormData {
  /** Pending - Add Form Formats for each */
  [key: string]: any
}
