import React, { Dispatch, useState, useEffect } from "react";
import { Grid, Toggle, Box } from "ui-library";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import { useDispatch } from "react-redux";
import {
  IOnboardingClientActions,
  IOnboardingClientOptionAnswer,
} from "../../OnboardingSteps.model";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { sendGA } from "../../../../../utils/ga";

const ToggleList = ({ list, onHandleChange, defaultValue }) => {
  const [datalist, setDatalist] = useState(list);

  useEffect(() => {
    setDatalist([
      ...datalist.map((item) => {
        if (
          defaultValue &&
          defaultValue?.questions.length > 0 &&
          defaultValue.questions.find((x) => x.answerData === item.optionValue)
        ) {
          return {
            ...item,
            checked: true,
          };
        } else {
          return {
            ...item,
            checked: false,
          };
        }
      }),
    ]);
  }, []);

  return (
    <Box style={{ flexGrow: 1 }}>
      {datalist.map((data, index) => {
        return (
          <Grid key={index} container spacing={2} className="toggle__list">
            <Grid item lg={10}>
              <h4>{data.optionLabel}</h4>
              <p>{data.optionDescLabel}</p>
            </Grid>
            <Grid item lg={2} style={{ textAlign: "right" }}>
              <Toggle
                labelColor={"black"}
                checked={data.checked}
                value={data.optionValue}
                id={data.optionValue}
                onChange={(e) => onHandleChange(e)}
              />
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

const PartnerEcosystem = ({
  name,
  config,
  totalSteps,
  currentValues,
  clientId,
  userName
}: ISubComponentProps) => {
  let partnerEcoToggleList =
    config?.stepType === "QUESTIONS" && config.questions[0];

  const currentStepAnswer = useTypedSelector(
    (state) => state.saas.onboarding.currentAnswer
  );

  const getValue = (optionValue) => {
    let selectedOption = config.questions[0].options.find(
      (item) => item.optionValue === optionValue
    );
    return selectedOption;
  };

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingClientActions>>();

  const getSelectedOption = (event: any) => {
    let currentAnswer: IOnboardingClientOptionAnswer[] =
      (currentStepAnswer &&
        (currentStepAnswer?.answerData as IOnboardingClientOptionAnswer[])) ||
      [];
    let selectedValue = getValue(event.target.value);

  // GA-event for all the operation partner
    sendGA(
      "Onboarding-Partner",
      `Click on toggle option` +
        `${clientId ? clientId : ""} - ${userName ? userName : ""} / ${selectedValue && selectedValue.optionValue ? selectedValue.optionValue : ''}`
    );

    if (event.target.checked) {
      if (
        selectedValue &&
        currentStepAnswer !== null &&
        currentStepAnswer?.answerData?.find(
          (item) => item.answerData !== event.target.value
        )
      ) {
        currentAnswer.push({
          questionId: selectedValue.optionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: selectedValue.optionValue,
        });
      } else {
        currentAnswer.push({
          questionId: selectedValue.optionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: selectedValue.optionValue,
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
          (item) => item.answerData === event.target.value
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
      currentValues.questions.forEach((element) => {
        defaultAnswerData.push({
          questionId: element.questionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: element.answerData,
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
          <ToggleList
            list={partnerEcoToggleList.options}
            onHandleChange={getSelectedOption}
            defaultValue={currentValues}
          />
        </div>
      </div>
    </>
  );
};

export default PartnerEcosystem;
