import React, { useEffect, Dispatch, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "../Layouts/OnboardingLayout";
import { IconButton } from "ui-library";
import DefaultButton from "../FormElements/DefaultButton";
import withReact from "../../../utils/components/withReact";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import useUnload from "./Component/Hook/useUnhold";

import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IOnboardingClientActions } from "./OnboardingSteps.model";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { StyledOnboardingWrapper } from "./StyledOnboardingWrapper";
import RenderComponent from "./SubComponent/RenderComponent";
import { prepareFormStructure, setDataLayer } from "./onboardingUtils";
import { sendGA } from "../../../utils/ga";

import FeatureList from "./SubComponent/Welcome/FeatureList";
import IndustryVertical from "./SubComponent/IndustryVertical";
import OrganisationProfile from "./SubComponent/OrgProfile";
import PrimaryOperations from "./SubComponent/PrimaryOperations";
import OperationMode from "./SubComponent/OperationMode";
import PartnerEcosystem from "./SubComponent/PartnerEcosytem";
import HubSetup from "./SubComponent/HubSetup";
import InviteUser from "./SubComponent/InviteUser";
import OnboardingLoader from "./Component/OnboardingLoader";
import { inviteUserStructure } from "../ClientOnboarding/SubComponent/InviteUser/data";
import { fetchDomain } from "./onboardingUtils";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";

// onboarding mapping with the structure which will have data for left sidebar and component on right side
// ride side component are from subcomponent folder

const StepsMapping = {
  LOGINEXT_CAPABILITIES: {
    iconUrl: "images/onboardingClient/img-advantage.svg",
    component: FeatureList,
    gaCategory: "Onboarding-Capabilities",
    subHeaderLabel:
      "Fasten your seat belts—Your logistics optimization journey begins now!",
    id: "get_started",
  },
  INDUSTRY_VERTICAL: {
    iconUrl: "images/onboardingClient/img-industry.svg",
    component: IndustryVertical,
    gaCategory: "Onboarding-Industry",
    subHeaderLabel:
      "Pick your industry to help us make your experience even better.",
    id_next: "industry_next",
    id_prev: "industry_previous",
  },
  ORG_PROFILE: {
    iconUrl: "images/onboardingClient/img-organization-profile.svg",
    component: OrganisationProfile,
    gaCategory: "Onboarding-Organization",
    subHeaderLabel: "Let’s set up a profile for your organization. ",
    id_next: "org_next",
    id_prev: "org_previous",
  },
  PRIMARY_OPERATIONS: {
    iconUrl: "images/onboardingClient/img-order-movements.svg",
    component: PrimaryOperations,
    gaCategory: "Onboarding-Model Type",
    subHeaderLabel:
      "Orders may move through multiple legs in their fulfillment journeys. Fill us in on the order movements that your operations take care of.",
    id_next: "movement_next",
    id_prev: "movement_previous",
  },
  OPERATIONS_MODE: {
    iconUrl: "images/onboardingClient/ic-dispatch-routing.svg",
    component: OperationMode,
    gaCategory: "Onboarding-operationtype",
    subHeaderLabel:
      "Help us understand your order dispatch and routing process.",
    id_next: "order_dispatch_next",
    id_prev: "order_dispatch_previous",
  },
  PARTNER_ECOSYSTEM: {
    iconUrl: "images/onboardingClient/img-partner-eco.svg",
    component: PartnerEcosystem,
    gaCategory: "Onboarding-Partner",
    subHeaderLabel: "Tell us about your logistics partners.",
    id_next: "partner_next",
    id_prev: "partner_previous",
  },
  ADD_MAIN_HUB: {
    iconUrl: "images/onboardingClient/img-main-hub.svg",
    component: HubSetup,
    gaCategory: "Onboarding-Branch",
    subHeaderLabel:
      "Branch refers to an operational center where orders are processed by your team. Specify the details of your operational headquarters here.",
    id_next: "branch_next",
    id_prev: "branch_previous",
  },
  INVITEUSERS: {
    iconUrl: "images/onboardingClient/img-invite-team.svg",
    component: InviteUser,
    subHeaderLabel:
      "No one achieves anything alone. Invite your key team members as Admins to explore the product.",
    id_next: "product_launch",
    id_prev: "invite_previous",
  },
  CLIENTONBOARDINGLOADER: {
    iconUrl: "images/onboardingClient/ic-congrats.svg",
    component: <OnboardingLoader />,
    subHeaderLabel: "",
  },
};

// config for the page loader animation framer motion
const animationConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

let isLaunchClickd = false;
let isLaunchError = false;

const OnboardingSteps = (props) => {
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: true,
  });
  const { handleSubmit, reset, setError, clearErrors, errors } = formInstance;
  const userData = JSON.parse(localStorage.getItem("userAccessInfo") || "");

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingClientActions>>();
  const globalPopupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>();

  /** Type Selectors */
  const structure = useTypedSelector(
    (state) => state.saas.onboarding.structure
  );
  const structureError = useTypedSelector(
    (state) => state.saas.onboarding.structureError
  );
  const isLaunchLoading = useTypedSelector(
    (state) => state.saas.onboarding.loading
  );
  const isClientLaunchLoading = useTypedSelector(
    (state) => state.saas.onboarding.launchLoading
  );
  const currentStep = useTypedSelector(
    (state) => state.saas.onboarding.currentStep
  );
  const stageError = useTypedSelector((state) => state.saas.onboarding.error);
  const draftData = useTypedSelector((state) => state.saas.onboarding.data);
  const launchData = useTypedSelector((state) => state.saas.onboarding.launch);
  let currentStepAnswer = useTypedSelector(
    (state) => state.saas.onboarding.currentAnswer
  );
  const [formData, setFormData] = useState(inviteUserStructure);
  const [emailApiPendingArray, setEmailApiPendingArray] = useState<string[]>(
    []
  );
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.onBoarding);

  // internal state
  const isLoading = React.useMemo(
    () => isLaunchLoading || isClientLaunchLoading,
    [isLaunchLoading, isClientLaunchLoading]
  );

  // useEffect
  useEffect(() => {
    getStructure();
    // check for the error in strcture then show global popup
    if (structureError) {
      globalPopupDispatch({
        type: "@@globalPopup/SET_PROPS",
        payload: {
          isOpen: true,
          title: "Error",
          onClose: () => {
            globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
            // location.reload();
          },
          content: (
            <>
              <div>{dynamicLabels?.OnboardingDefaultErrorMsg}</div>
              <br />
              <div>
                {dynamicLabels?.emailDefaultErrorMsgSec}
                <a href="contact@loginextsolutions.com">
                  contact@loginextsolutions.com
                </a>
                {`.`}
              </div>
            </>
          ),
          footer: (
            <>
              <IconButton
                iconVariant="icomoon-tick-circled"
                primary
                onClick={() => {
                  globalPopupDispatch({ type: "@@globalPopup/CLOSE_POPUP" });
                  location.reload();
                }}
              >
                Reload
              </IconButton>
            </>
          ),
        },
      });
    }
  }, [structure, structureError]);

  // for launch
  useEffect(() => {
    if (launchData !== null) {
      props.launchClient(launchData);
    }
  }, [launchData]);

  // on close tab show default popup
  useUnload((e) => {
    e.preventDefault();
    e.returnValue = "";
  });

  /**
   * Method to format payload data to structure post api
   * @param newData
   * @param step
   * @returns newData
   */
  const formatDraftData = (newData, step) => {
    if (!currentStepAnswer) return newData;
    let currentStepDraftData = newData.find((data) => data.stepId == step + 1);
    if (
      currentStepDraftData &&
      currentStepDraftData?.stepType === "QUESTIONS"
    ) {
      currentStepDraftData = {
        ...currentStepDraftData,
        questions: currentStepAnswer?.answerData,
      };
    } else if (
      currentStepDraftData &&
      currentStepDraftData?.stepType === "FORM"
    ) {
      currentStepDraftData = {
        ...currentStepDraftData,
        answerDataType: "json",
        answerData: currentStepAnswer?.answerData,
        questions: [],
      };
    }
    newData = newData.map((item) => {
      if (item.stepId == step + 1) {
        return currentStepDraftData;
      }
      return item;
    });
    return newData;
  };

  /**
   * Setting up the form data for individual section
   * @param formData
   * @param fn
   */
  function checkAndUpdateFormSection(formData, fn) {
    if (structure?.configurationSteps[currentStep]?.stepType === "FORM") {
      let formPaylaod = prepareFormStructure(
        structure?.configurationSteps[currentStep]?.stepName,
        formData,
        fn
      );
      currentStepAnswer = {
        answerDataType: "json",
        answerData: JSON.stringify(formPaylaod),
      };
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: {
          answerDataType: "json",
          answerData: JSON.stringify(formPaylaod),
        },
      });
    }
  }

  /**
   * On next, validation, sending data to draft api and move to next screen
   * @param formData
   */

  const moveNextStep = async (formData) => {
    const clientId = userData["clientId"] || "";
    const userName = userData["userName"] || "";
    let userToken = localStorage.getItem("guid");
    // GA-event for all next button

    sendGA(
      StepsMapping[structure?.configurationSteps[currentStep]?.stepName]
        .gaCategory,
      `Click on Next button` + `${clientId}-${userName}`
    );

    dispatch({
      type: "@@onboardingClient/SET_LOADING",
      payload: true,
    });
    // create payload for the formStructure
    checkAndUpdateFormSection(formData, props.setSystemProperty);
    if (stageError?.valid) {
      let updatedStepData = draftData;
      if (
        draftData.length &&
        draftData.length > 0 &&
        draftData.find((item) => item.stepId == currentStep + 1)
      ) {
        // TODO: update the draft data
      } else {
        updatedStepData = [
          ...updatedStepData,
          {
            isCompleted: true,
            questions: [],
            stepId: currentStep + 1,
            stepName: structure?.configurationSteps[currentStep]?.stepName,
            stepType: structure?.configurationSteps[currentStep]?.stepType,
          },
        ];
      }
      let payload = {
        token: userToken || "",
        type: "DRAFT",
        configurationSteps: formatDraftData(updatedStepData, currentStep),
      };
      if (
        currentStep >= 1 &&
        payload.configurationSteps[1].questions[0]?.answerData
      ) {
        payload["industryType"] =
          payload.configurationSteps[1].questions[0]?.answerData;
      }
      if (
        currentStep >= 3 &&
        payload.configurationSteps[3].questions[0]?.answerData
      ) {
        payload["modelType"] =
          payload.configurationSteps[3].questions[0]?.answerData;
        let localStorageData = {
          ...userData,
          modelType: payload.configurationSteps[3].questions[0]?.answerData,
        };
        localStorage.setItem(
          "userAccessInfo",
          JSON.stringify(localStorageData)
        );
      }
      try {
        const { data: response } = await axios["post"](
          apiMappings.saas.clientOnboarding.draftSetData,
          payload
        );
        if (!response.hasError) {
          dispatch({
            type: "@@onboardingClient/SET_DATA",
            payload: payload.configurationSteps,
          });
          //formInstance.reset();
          // Set data layer after success
          setDataLayer();
          if (currentStep === 7) {
            isLaunchClickd = true;
            if (
              emailApiPendingArray.length === 0 &&
              Object.keys(formInstance.errors).length === 0
            ) {
              dispatch({ type: "@@onboardingClient/LAUNCH_ONBOARDING" });
              isLaunchClickd = false;
            }
          } else {
            dispatch({
              type: "@@onboardingClient/SET_STEP",
              payload: currentStep + 1,
            });
          }
          dispatch({ type: "@@onboardingClient/SET_LOADING", payload: false });
        } else {
          dispatch({ type: "@@onboardingClient/SET_LOADING", payload: false });
        }
      } catch (error) {
        dispatch({ type: "@@onboardingClient/SET_LOADING", payload: false });
      }
    }
  };

  // Previous Step
  const movePreviousStep = useCallback(() => {
    formInstance.clearErrors();
    // formInstance.reset();
    dispatch({ type: "@@onboardingClient/SET_STEP", payload: currentStep - 1 });
  }, [currentStep]);

  const getStructure = () => {
    if (!structureError && !Object.keys(structure).length) {
      dispatch({ type: "@@onboardingClient/SET_LOADING", payload: true });
      dispatch({ type: "@@onboardingClient/FETCH_STRUCTURE" });
      dispatch({ type: "@@onboardingClient/FETCH_DATA" });
      setDataLayer();
    }
  };

  let copyFormData = JSON.parse(JSON.stringify(formData));

  const addFormError = (emailIndex, errorMessage) => {
    setError(`Email.${emailIndex}`, { type: "required" });
    let updatedFormData = {
      ...formData,
    };
    updatedFormData = {
      ...updatedFormData,
      [`Email${emailIndex}`]: {
        ...formData[`Email${emailIndex}`],
        isError: true,
        nonDuplicateError: true,
        validation: {
          required: { message: errorMessage },
        },
      },
    };
    setFormData(updatedFormData);
  };

  const updateStepAPISelection = async (email) => {
    const payload = await axios["get"](
      apiMappings.saas.clientOnboarding.verifyEmail + `?useremail=${email}`
    );

    if (payload?.data?.code === 200) {
      return true;
    } else if (payload?.data?.code === 201 || payload?.data?.code === 211) {
      return "duplicateEmailError";
    } else {
      return false;
    }
  };

  const validateFromBackend = async (email, emailIndex, flag = false) => {
    const response = await updateStepAPISelection(email);
    const domain = fetchDomain(email);
    if (!response && email) {
      isLaunchError = true;
      addFormError(
        emailIndex,
        `Email  address from ${domain} are not accepted`
      );
    } else if (response === "duplicateEmailError" && email !== "") {
      isLaunchError = true;
      addFormError(emailIndex, dynamicLabels?.emailDuplicationErrorMsg);
      setFormData(copyFormData);
    } else if (
      errors[`Email${emailIndex}`] === undefined &&
      formData[`Email${emailIndex}`].nonDuplicateError === false
    ) {
    } else {
      clearErrors(`Email.${emailIndex}`);
      let updatedFormData = {
        ...formData,
      };
      updatedFormData = {
        ...updatedFormData,
        [`Email${emailIndex}`]: {
          ...formData[`Email${emailIndex}`],
          isError: false,
          nonDuplicateError: false,
        },
      };
      setFormData(updatedFormData);
    }
    setEmailApiPendingArray((prevState) => prevState.slice(0, -1));

    if (
      Object.keys(formInstance.errors).length === 0 &&
      isLaunchClickd === true &&
      isLaunchError === false
    ) {
      moveNextStep(formInstance.getValues());
      isLaunchClickd = false;
      isLaunchError = false;
    }
    isLaunchClickd = false;
    isLaunchError = false;
    return undefined;
  };

  const checkDuplicateEmail = (email: any, values, currentEmail) => {
    let isDuplicateError = false;
    const errorElements: any = [];
    const elementCounts = {};
    let nonErrorElemets = [];
    //counting the occurances of emails
    email?.length > 0 &&
      email?.forEach((element) => {
        elementCounts[element] = elementCounts[element]
          ? errorElements.push(element) + 1
          : (elementCounts[element] || 0) + 1;
      });

    const nonDuplicateEmails = email?.filter(
      (email) => !errorElements?.includes(email)
    );

    let updatedFormData = {
      ...formData,
    };

    //checking for empty emails and rmeoving error
    for (let i = 1; i <= 5; i++) {
      if (!values[`Email${i}`])
        updatedFormData = {
          ...updatedFormData,
          [`Email${i}`]: {
            ...formData[`Email${i}`],
            isError: false,
            duplicateError: false,
            nonDuplicateError: false,
          },
        };
    }
    //removing error from non-error emails
    for (let i = 1; i <= 5; i++) {
      for (let j = 0; j < nonDuplicateEmails?.length; j++) {
        if (
          values[`Email${i}`] === nonDuplicateEmails[j] ||
          !values[`Email${i}`]
        ) {
          if (formData[`Email${i}`].nonDuplicateError === false) {
            clearErrors(`Email.${i}`);
            updatedFormData = {
              ...updatedFormData,
              [`Email${i}`]: {
                ...formData[`Email${i}`],
                isError: false,
                duplicateError: true,
              },
            };
          }
        }
      }
    }

    const duplicateEmail = Object.values(errorElements);
    const setDuplicateEmails = new Set();

    //adding the error emails to set to remove duplicate emails
    for (let i = 0; i < duplicateEmail?.length; i++) {
      setDuplicateEmails.add(duplicateEmail[i]);
    }

    //adding error to non-error emails
    setDuplicateEmails?.forEach((email) => {
      const length = Object.keys(values)?.length / 2;
      for (let i = 1; i <= length; i++) {
        if (
          values[`Email${i}`] == email &&
          formData[`Email${i}`].nonDuplicateError === false
        ) {
          isDuplicateError = true;
          setError(`Email.${i}`, { type: "required" });
          updatedFormData = {
            ...updatedFormData,
            [`Email${i}`]: {
              ...formData[`Email${i}`],
              isError: true,
              duplicateError: true,
              validation: {
                required: { message: dynamicLabels?.emailDuplicationErrorMsg },
              },
            },
          };
        }
      }
    });

    setFormData(updatedFormData);
    return isDuplicateError;
  };

  const isNotduplicateValidate = async (email, emailIndex) => {
    const values = formInstance.getValues();
    const emailUserValues = Object.values(values);
    const EmailValue = emailUserValues?.filter((data, index) => {
      if (index % 2 !== 0) {
        return data;
      }
    });
    checkDuplicateEmail(EmailValue, values, email);
  };

  const isValidEmail = async (email, index) => {
    const emailIndex = Math.round(index / 2);
    if (index % 2 !== 0) {
      //checking if it is not an invalid email
      if (!formInstance.errors[`Email${emailIndex}`]) {
        setEmailApiPendingArray((prevState) => [...prevState, "Email1"]);
      }

      //if no duplicate emails found then call the api and check for further conditions
      if (!errors[`Email${emailIndex}`]) {
        isNotduplicateValidate(email, emailIndex);
        validateFromBackend(email, emailIndex);
      }
    }
  };

  const isLaunchClickdFunction = () => {
    isLaunchClickd = false;
  };
  return (
    <div>
      {isClientLaunchLoading && (
        <Layout
          iconUrl={StepsMapping["CLIENTONBOARDINGLOADER"]?.iconUrl}
          title={`Congratulations!`}
          description={`You are all set. Brace yourself to watch the magic unfold!`}
          islaunchLoader={true}
          stepName=""
        >
          {StepsMapping["CLIENTONBOARDINGLOADER"].component}
        </Layout>
      )}
      {/* {
        structure && Object.keys(structure).length === 0 && (
          <p>Something went wrong</p>
        )
      } */}
      {structure &&
        structure?.configurationSteps &&
        Object.keys(structure?.configurationSteps).length === 0 && (
          <p> ---- No data found | Try again ----</p>
        )}
      {/* Get Data according to the current index and embed next and previous button */}
      {!isClientLaunchLoading && (
        <AnimatePresence exitBeforeEnter initial={false}>
          <div className="wrapper">
            {structure &&
              structure?.configurationSteps &&
              structure?.configurationSteps?.length !== 0 &&
              typeof currentStep !== "undefined" && (
                <Layout
                  iconUrl={
                    StepsMapping[
                      structure?.configurationSteps[currentStep]?.stepName
                    ]?.iconUrl
                  }
                  stepName={
                    structure?.configurationSteps[currentStep]?.stepName
                  }
                  title={
                    structure?.configurationSteps[currentStep]?.headerLabel
                  }
                  description={
                    StepsMapping[
                      structure?.configurationSteps[currentStep]?.stepName
                    ]?.subHeaderLabel
                  }
                  islaunchLoader={false}
                >
                  {/* Render Structure as per the stepTpye and call the component */}
                  <StyledOnboardingWrapper>
                    <div
                      className={`main__content ${structure?.configurationSteps[currentStep]?.stepName}`}
                    >
                      <div
                        className={`content__block ${structure?.configurationSteps[currentStep]?.stepName}`}
                      >
                        <motion.div
                          key={
                            structure?.configurationSteps[currentStep]?.stepName
                          }
                          transition={animationConfig}
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -10, opacity: 0 }}
                        >
                          <RenderComponent
                            name={
                              structure?.configurationSteps[currentStep]
                                ?.stepName
                            }
                            data={structure?.configurationSteps[currentStep]}
                            mapping={StepsMapping}
                            totalSteps={structure?.configurationSteps.length}
                            currentStepValue={
                              currentStep === 7
                                ? {}
                                : draftData?.find((item) =>
                                    currentStep === 7
                                      ? item.stepId === currentStep
                                      : item.stepId == currentStep + 1
                                  )
                            }
                            moveNextStep={moveNextStep}
                            formInstance={formInstance}
                            formData={formData}
                            isValidEmail={isValidEmail}
                            isLaunchClickdFunction={isLaunchClickdFunction}
                          />
                        </motion.div>
                      </div>
                      <div className="btn__group">
                        {currentStep === 0 ? (
                          <DefaultButton
                            disabled={false}
                            onHandleClick={() => moveNextStep("")}
                            id="get_started"
                          >
                            Get Started
                          </DefaultButton>
                        ) : (
                          <>
                            {currentStep > 1 && (
                              <DefaultButton
                                disabled={currentStep === 0}
                                onHandleClick={() => movePreviousStep()}
                                className="secondary"
                                id={
                                  StepsMapping[
                                    structure?.configurationSteps[currentStep]
                                      ?.stepName
                                  ]?.id_prev
                                }
                              >
                                Previous
                              </DefaultButton>
                            )}
                            <DefaultButton
                              onHandleClick={handleSubmit((data) => {
                                moveNextStep(data);
                              })}
                              isLoading={isLoading || isClientLaunchLoading}
                              id={
                                StepsMapping[
                                  structure?.configurationSteps[currentStep]
                                    ?.stepName
                                ]?.id_next
                              }
                              disabled={
                                currentStepAnswer &&
                                !currentStepAnswer?.answerData &&
                                structure?.configurationSteps[currentStep]
                                  .stepType === "QUESTIONS" &&
                                structure?.configurationSteps[currentStep]
                                  .questions[0].isMandatoryFl
                                  ? true
                                  : false
                              }
                            >
                              {currentStep ===
                              structure?.configurationSteps.length - 1
                                ? "Launch"
                                : "Next"}
                            </DefaultButton>
                          </>
                        )}
                      </div>
                    </div>
                  </StyledOnboardingWrapper>
                </Layout>
              )}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default withReact(OnboardingSteps);
