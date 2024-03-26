import {
  IOnboardingClientActions,
  IOnboardingClientReducerState,
} from "./OnboardingSteps.model";

export const initialState = {
  structure: {},
  loading: false,
  launchLoading: false,
  success: false,
  error: {
    message: "",
    valid: true,
  },
  structureError: false,
  data: [],
  launch: null,
  defaultIndustry: '',
  industryList: [],
  currentAnswer: null,
  currentStep: 0,
};

export const OnboardingClientReducer = (
  state: IOnboardingClientReducerState = initialState,
  action: IOnboardingClientActions
): IOnboardingClientReducerState => {
  switch (action.type) {
    case "@@onboardingClient/SET_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };
    case "@@onboardingClient/SET_STRUCTURE_ERROR":
      return {
        ...state,
        structureError: action.payload,
      };
    case "@@onboardingClient/SET_INDUSTRY_LIST":
      return {
        ...state,
        industryList: action.payload,
      };
    case "@@onboardingClient/SET_INDUSTRY_DEFAULT_TYPE":
      return {
        ...state,
        defaultIndustry: action.payload,
      };
    case "@@onboardingClient/SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };

    case "@@onboardingClient/SET_LAUNCH_LOADING":
      return {
        ...state,
        launchLoading: action.payload,
      };

    case "@@onboardingClient/SET_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "@@onboardingClient/SET_LAUNCH_DATA":
      return {
        ...state,
        launch: action.payload,
      };
    case "@@onboardingClient/SET_ANSWER_DATA":
      return {
        ...state,
        currentAnswer: action.payload,
      };

    case "@@onboardingClient/SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "@@onboardingClient/RESET_INITIAL_STATE":
      return initialState;

    default:
      return state;
  }
};

export default OnboardingClientReducer;
