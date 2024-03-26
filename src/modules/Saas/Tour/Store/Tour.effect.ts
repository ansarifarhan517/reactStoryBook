import { IOnboardingTourActions } from "./Tour.model";
import { takeLatest, call, put, fork, all } from "redux-saga/effects";
import apiMappings from "../../../../utils/apiMapping";
import axios from "../../../../utils/axios";
import { sumUp } from "./Tour.reducer";
// TODO: remove once api is working
import { structure } from "../structure";

function* fetchStructure() {
  yield put<IOnboardingTourActions>({
    type: "@@onboardingTour/SET_LOADING",
    payload: true,
  });
  yield put<IOnboardingTourActions>({
    type: "@@onboardingTour/SET_STRUCTURE_ERROR",
    payload: false,
  });
  try {
    const userAccessInfo: any = JSON.parse(localStorage.getItem('userAccessInfo') || "{}");
    const params = 'userId='+userAccessInfo?.['userId']+'&clientId='+ userAccessInfo?.['clientId']+'&modelType='+userAccessInfo?.['modelType']
    const { data : payload } = yield call(axios.get, apiMappings.saas.tour.structure)
    const transformedPayload: any = payload.data;
    if (!transformedPayload) {
      const totalWeightage = sumUp(structure.steps);
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_STRUCTURE",
        payload: structure,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_LOADING",
        payload: false,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_TOTAL_WEIGHTAGE",
        payload: totalWeightage,
      });
      
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_LOCAL_STRUCTURE",
        payload: true,
      });

      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_PERCENTAGE",
        payload: transformedPayload.percentage,
      });
    } else {
      const totalWeightage = sumUp(transformedPayload.steps);
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_STRUCTURE",
        payload: transformedPayload,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_TOTAL_WEIGHTAGE",
        payload: totalWeightage,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_PERCENTAGE",
        payload: transformedPayload.percentage,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_LOADING",
        payload: false,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_STRUCTURE_ERROR",
        payload: false,
      });
    }
  } catch (e) {
    // yield put<IOnboardingTourActions>({
    //   type: "@@onboardingTour/SET_STRUCTURE_ERROR",
    //   payload: true,
    // });
    const totalWeightage = sumUp(structure.steps);
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_STRUCTURE",
        payload: structure,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_LOADING",
        payload: false,
      });
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_TOTAL_WEIGHTAGE",
        payload: totalWeightage,
      });
      
      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_LOCAL_STRUCTURE",
        payload: true,
      });

      yield put<IOnboardingTourActions>({
        type: "@@onboardingTour/SET_PERCENTAGE",
        payload: structure.percentage,
      });
    // yield put<IOnboardingTourActions>({
    //   type: "@@onboardingTour/SET_LOADING",
    //   payload: false,
    // });
  }
}

// function* fetchDraftData() {
//   yield put<IOnboardingTourActions>({
//     type: "@@onboardingTour/SET_LOADING",
//     payload: true,
//   });
//   yield put<IOnboardingTourActions>({
//     type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//     payload: false,
//   });
//   try {
//     const { data: payload } = yield call(
//       axios.get,
//       apiMappings.saas.clientOnboarding.draftData + localStorage.getItem("guid")
//     );
//     const transformedPayload: any = payload;
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_DATA",
//       payload: transformedPayload ? transformedPayload?.steps : [],
//     });
//     let currentStep = transformedPayload
//       ? transformedPayload.steps.length - 1
//       : 0;
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_STEP",
//       payload: currentStep,
//     });
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_LOADING",
//       payload: false,
//     });
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//       payload: false,
//     });
//   } catch (e) {
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//       payload: true,
//     });
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_LOADING",
//       payload: false,
//     });
//   }
// }

// TODO: remove code 
// function* launchCompleteTour() {
//   let payloadGuid = {
//     guid: localStorage.getItem("guid"),
//   };
//   yield put<IOnboardingTourActions>({
//     type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//     payload: false,
//   });
//   try {
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_LAUNCH_LOADING",
//       payload: true,
//     });
//     const payload = yield call(
//       axios.post,
//       apiMappings.saas.clientOnboarding.launch,
//       payloadGuid
//     );
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_LAUNCH_DATA",
//       payload: payload ? payload : [],
//     });
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//       payload: false,
//     });
//   } catch (e) {
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_LAUNCH_LOADING",
//       payload: false,
//     });
//     yield put<IOnboardingTourActions>({
//       type: "@@onboardingTour/SET_STRUCTURE_ERROR",
//       payload: true,
//     });
//   }
//   //yield put<IOnboardingTourActions>({ type: '@@onboardingTour/SET_LAUNCH_LOADING', payload: false })
// }

export function* watchFetchStructureRequest() {
  yield takeLatest<IOnboardingTourActions>(
    "@@onboardingTour/FETCH_STRUCTURE",
    fetchStructure
  );
}

// export function* watchFetchDraftDataRequest() {
//   yield takeLatest<IOnboardingTourActions>(
//     "@@onboardingTour/FETCH_DATA",
//     fetchDraftData
//   );
// }

// export function* watchLaunchAction() {
//   yield takeLatest<IOnboardingTourActions>(
//     "@@onboardingTour/LAUNCH_ONBOARDING",
//     launchCompleteTour
//   );
// }

export function* onboardingTourSaga() {
  yield all([
    fork(watchFetchStructureRequest),
    // fork(watchFetchDraftDataRequest)
  ]);
}
