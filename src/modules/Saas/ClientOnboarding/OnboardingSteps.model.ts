interface IError {
  message: string;
  valid: boolean;
}

export interface ISubComponentProps {
  name: string;
  config: any;
  totalSteps: number;
  currentValues: {
    questions: [];
    answerData?: string | [] | undefined | any;
  };
  clientId?: any;
  userName?: string;
  onFormChange?: () => any;
  formInstance?: any;
  isValidEmail?: Function;
  formData?: Object;
  isLaunchClickdFunction?: Function;
}
export interface IOnboardingClientReducerState {
  structure: any;
  currentStep: number;
  loading: boolean;
  success: boolean;
  error: IError;
  data: IOnboardingClientDataStep[] | [];
  launch: any;
  industryList: any;
  defaultIndustry: string;
  structureError: boolean;
  launchLoading: boolean;
  currentAnswer: IOnboardingClientAnswerData | null;
}
export interface IOnboardingClientData {
  type: string;
  token: string | "";
  saasPlanType?: number;
  configurationSteps?: IOnboardingClientDataStep[] | [];
}

export interface IOnboardingClientOptionAnswer {
  questionId: number | undefined;
  isLocked: boolean;
  answerDataType: string;
  answerData: string | undefined;
}

export interface IOnboardingClientAnswerData {
  answerDataType: "optionValue" | "json";
  answerData: string | IOnboardingClientOptionAnswer[] | [];
}

export interface IOnboardingClientDataStep {
  stepId: number;
  stepType: "STATIC" | "QUESTIONS" | "FORM" | string;
  stepName: string;
  isCompleted: true;
  questions?: [];
  answerData?: string;
}

export interface IOnboardingClientData {
  /** Pending - Add Form Formats for each */
  [key: string]: any;
}

/** Actions */
export interface IOnboardingClientLaunch {
  readonly type: "@@onboardingClient/LAUNCH_ONBOARDING";
}

export interface IOnboardingClientFetchStructure {
  readonly type: "@@onboardingClient/FETCH_STRUCTURE";
}

export interface IOnboardingClientFetchDraftData {
  readonly type: "@@onboardingClient/FETCH_DATA";
}

export interface IOnboardingClientSetStructure {
  readonly type: "@@onboardingClient/SET_STRUCTURE";
  payload: any;
}

export interface IOnboardingClientSetStructureError {
  readonly type: "@@onboardingClient/SET_STRUCTURE_ERROR";
  payload: any;
}

export interface IOnboardingClientSetLoading {
  readonly type: "@@onboardingClient/SET_LOADING";
  payload: boolean;
}

export interface IOnboardingClientSetLaunchLoading {
  readonly type: "@@onboardingClient/SET_LAUNCH_LOADING";
  payload: boolean;
}

export interface IOnboardingClientSetIndustryList {
  readonly type: "@@onboardingClient/SET_INDUSTRY_LIST";
  payload: [];
}

export interface IOnboardingClientSetIndustryDefaultType {
  readonly type: "@@onboardingClient/SET_INDUSTRY_DEFAULT_TYPE";
  payload: string;
}

export interface IOnboardingClientFetchIndustryList {
  readonly type: "@@onboardingClient/FETCH_INDUSTRY_LIST";
}

export interface IOnboardingClientFetchDefaultIndustry {
  readonly type: "@@onboardingClient/FETCH_DEFAULT_INDUSTRY";
}

export interface IOnboardingClientSetData {
  readonly type: "@@onboardingClient/SET_DATA";
  payload: IOnboardingClientDataStep[];
}
export interface IOnboardingClientLaunchData {
  readonly type: "@@onboardingClient/SET_LAUNCH_DATA";
  payload: any;
}

export interface IOnboardingClientSetAnswerData {
  readonly type: "@@onboardingClient/SET_ANSWER_DATA";
  payload: IOnboardingClientAnswerData;
}

export interface IOnboardingClientSetStep {
  readonly type: "@@onboardingClient/SET_STEP";
  payload: number;
}

export interface IResetState {
  readonly type: "@@onboardingClient/RESET_INITIAL_STATE";
}

export type IOnboardingClientActions =
  | IOnboardingClientFetchStructure
  | IOnboardingClientSetStructure
  | IOnboardingClientSetLoading
  | IOnboardingClientSetData
  | IOnboardingClientLaunchData
  | IOnboardingClientLaunch
  | IOnboardingClientSetStep
  | IOnboardingClientFetchDraftData
  | IOnboardingClientSetAnswerData
  | IOnboardingClientSetLaunchLoading
  | IOnboardingClientSetIndustryList
  | IOnboardingClientSetIndustryDefaultType
  | IOnboardingClientFetchDefaultIndustry
  | IOnboardingClientFetchIndustryList
  | IOnboardingClientSetStructureError
  | IResetState;
