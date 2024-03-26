import {
  IOnboardingTourActions,
  IOnboardingTourReducerState,
} from "./Tour.model";

export const initialState = {
  structure: {},
  loading: false,
  launchLoading: false,
  percentage: 0,
  completedWeightage: 0,
  localStructure: false,
  totalWeightage: 0,
  isLastStep: {
    stepId : 0,
    subStepId: 0,
    isValid : false
  },
  success: false,
  error: {
    message: "",
    valid: true,
  },
  structureError: false,
  data: [],
  launch: null,
  currentAnswer: null,
  currentStep: 1,
};

export const sumUp = array => array.reduce((sum, el) => {
  return (sum + el.weightage)
}, 0);

export const OnboardingTourReducer = (
  state: IOnboardingTourReducerState = initialState,
  action: IOnboardingTourActions
): IOnboardingTourReducerState => {
  switch (action.type) {
    case "@@onboardingTour/SET_STRUCTURE":
      return {
        ...state,
        structure: action.payload,
      };
    case "@@onboardingTour/SET_STRUCTURE_ERROR":
      return {
        ...state,
        structureError: action.payload,
      };
    case "@@onboardingTour/SET_LOCAL_STRUCTURE":
      return {
        ...state,
        localStructure: action.payload,
      };
    case "@@onboardingTour/SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "@@onboardingTour/SET_PERCENTAGE":
      let currentPercentage = state.percentage || 0
      if(currentPercentage > 0){
        let percentageCompleted = Math.trunc((100/state?.totalWeightage) * (currentPercentage + action.payload));
        localStorage.setItem('tourPercentage', String(percentageCompleted))
      }
      
      return {
        ...state,
        percentage: currentPercentage + action.payload,
        completedWeightage: currentPercentage + action.payload
      };
    case "@@onboardingTour/SET_TOTAL_WEIGHTAGE":
      return {
        ...state,
        totalWeightage: action.payload,
      };
    case "@@onboardingTour/IS_LAST_STEP":
      debugger
      return {
        ...state,
        isLastStep: action.payload,
      };

    case "@@onboardingTour/SET_STEP":
      return {
        ...state,
        currentStep: action.payload,
      };

    case "@@onboardingTour/RESET_INITIAL_STATE":
      return initialState;

    default:
      return state;
  }
};

export default OnboardingTourReducer;
