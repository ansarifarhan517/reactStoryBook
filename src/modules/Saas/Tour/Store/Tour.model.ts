interface IError {
  message: string;
  valid: boolean;
}
export interface IOnboardingTourReducerState {
  structure: any;
  currentStep: number;
  loading: boolean;
  success: boolean;
  error: IError;
  percentage?: number;
  completedWeightage?: number;
  localStructure?:boolean;
  isLastStep?:any;
  totalWeightage?:number;
  data: IOnboardingTourDataStep[] | [];
  launch: any;
  structureError: boolean;
}

export interface IStep {
  id: number;
  stepId?: number;
  title: string;
  headerLabel?: string;
  isCompleted: boolean;
  status: "UNVISITED" | "VISITED" | "COMPLETED";
  selected: boolean;
  weightage?: number;
  subSteps?: IStep[];
  stepName? : string;
}

export interface IOnboardingTourDataStep {
  stepId: number;
  stepType: "STATIC" | "QUESTIONS" | "FORM" | string;
  stepName: string;
  isCompleted: boolean;
}

/** Actions */

export interface IOnboardingTourFetchStructure {
  readonly type: "@@onboardingTour/FETCH_STRUCTURE";
}

export interface IOnboardingTourSetStructure {
  readonly type: "@@onboardingTour/SET_STRUCTURE";
  payload: any;
}

export interface IOnboardingTourSetStructureError {
  readonly type: "@@onboardingTour/SET_STRUCTURE_ERROR";
  payload: any;
}
export interface IOnboardingTourSetStructureLocal {
  readonly type: "@@onboardingTour/SET_LOCAL_STRUCTURE";
  payload: any;
}

export interface IOnboardingTourSetLastStep {
  readonly type: "@@onboardingTour/IS_LAST_STEP";
  payload: any;
}

export interface IOnboardingTourSetLoading {
  readonly type: "@@onboardingTour/SET_LOADING";
  payload: boolean;
}
export interface IOnboardingTourSetTotalWeightage {
  readonly type: "@@onboardingTour/SET_TOTAL_WEIGHTAGE";
  payload: number;
}

export interface IOnboardingTourSetPercentage {
  readonly type: "@@onboardingTour/SET_PERCENTAGE";
  payload: number;
}
export interface IOnboardingTourSetStep {
  readonly type: "@@onboardingTour/SET_STEP";
  payload: number;
}
export interface IResetState {
  readonly type: "@@onboardingTour/RESET_INITIAL_STATE";
}

export type IOnboardingTourActions =
  | IOnboardingTourFetchStructure
  | IOnboardingTourSetStructure
  | IOnboardingTourSetLoading
  | IOnboardingTourSetPercentage
  | IOnboardingTourSetTotalWeightage
  | IOnboardingTourSetStep
  | IOnboardingTourSetStructureError
  | IOnboardingTourSetStructureLocal
  | IOnboardingTourSetLastStep
  | IResetState;
