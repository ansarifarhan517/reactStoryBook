import React, { Dispatch, useEffect } from "react";
import SelectBox from "../../Component/SelectBox";
import CardWithDetail from "../../Component/CardWithDetail";
import MediaPlayer from "../../Component/MediaPlayer";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import { useDispatch } from "react-redux";
import {
  IOnboardingClientActions,
  IOnboardingClientOptionAnswer,
} from "../../OnboardingSteps.model";
import { IOption } from "../../Component/SelectBox";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { sendGA } from "../../../../../utils/ga";

const OperationMode = ({
  name,
  config,
  totalSteps,
  currentValues,
  clientId,
  userName
}: ISubComponentProps) => {
  let dispatchTypeCardList =
    config?.stepType === "QUESTIONS" && config.questions[0];

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingClientActions>>();

  const currentStepAnswer = useTypedSelector(
    (state) => state.saas.onboarding.currentAnswer
  );

  const getSelectedOption = (value: IOption) => {
    // GA-event for all the operation mode
    sendGA(
      "Onboarding-operationtype",
      `Click on card` +
        `${clientId ? clientId : ""} - ${userName ? userName : ""} / ${value.optionValue ? value.optionValue : ''}`
    );
    let currentAnswer : IOnboardingClientOptionAnswer[] = currentStepAnswer && currentStepAnswer?.answerData as IOnboardingClientOptionAnswer[] || [];
    if (value.checked) {
      if (
        value.optionValue &&
        currentStepAnswer !== null &&
        currentStepAnswer?.answerData?.find(
          (item) => item.answerData !== value.optionValue
        )
      ) {
        currentAnswer.push({
          questionId: value.optionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: value.optionValue,
        });
      } else {
        currentAnswer.push({
          questionId: value.optionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: value.optionValue,
        });
      }
      let payload = {
        answerDataType: "optionValue" as "optionValue",
        answerData: currentAnswer,
      };
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: payload,
      });
    } else {
      currentAnswer.splice(
        currentAnswer?.findIndex(
          (item) => item.answerData === value.optionValue
        ),
        1
      );
      let payload = {
        answerDataType: "optionValue" as "optionValue",
        answerData: currentAnswer,
      };
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: payload,
      });
    }
  };

  useEffect(() => {
    let defaultAnswerData: IOnboardingClientOptionAnswer[] = [];
    if (currentValues && currentValues !== null) {
      currentValues.questions.forEach((element : IOnboardingClientOptionAnswer ) => {
        defaultAnswerData.push({
          questionId: (element && element?.questionId) || -1,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: (element && element?.answerData) || "",
        });
      });
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: {
          answerDataType: "optionValue",
          answerData: defaultAnswerData,
        },
      });
    } else {
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: { answerDataType: "optionValue", answerData: [] },
      });
    }
  }, []);
  return (
    <>
      <div className="card__selection__block">
        <div className="step__text">
          Step {config?.stepId - 1} of {totalSteps - 1}
        </div>
        <div className="form__control">
          <h4>
            Which mode of order dispatch would work the best for your
            operations?
          </h4>
          <p>Select the suitable option(s).</p>
          {/* <MediaPlayer
            url="https://loginext-media-bucket.s3.ap-southeast-1.amazonaws.com/images/loginext-videos/LoginectnewVersion.mp4"
            styles={{
              width: "100%",
              height: "22rem",
              backgroundColor: "black",
              marginBottom: "2rem",
              marginTop: '1rem'
            }}
            id="operation_video"
            clientId={clientId}
          /> */}
        </div>
        <div className="route__selection__wrapper">
          <SelectBox
            style={{
              display: "inline-block",
              width: "49%",
              maxWidth: "50%",
              verticalAlign: "top",
              textAlign: "left",
            }}
            list={dispatchTypeCardList.options}
            getSelectedOption={getSelectedOption}
            defaultSelectedValue={currentValues}
            col={4}
            type="multiselect"
            inputType="checkbox"
            name={name}
          >
            <CardWithDetail multiselect={true} />
          </SelectBox>
        </div>
      </div>
    </>
  );
};

export default OperationMode;
