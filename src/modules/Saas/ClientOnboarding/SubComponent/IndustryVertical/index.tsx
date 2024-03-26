import React, { Dispatch, useEffect, useState } from "react";
import { Grid } from "ui-library";
import CardWithIcon from "../../Component/CardWithIcon";
import "./industry.css";
import SelectBox from "../../Component/SelectBox";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import { IOption } from "../../Component/SelectBox";
import { useDispatch } from "react-redux";
import { IOnboardingClientActions } from "../../OnboardingSteps.model";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormField from "../../../../../utils/components/Form/FormField";
import { sendGA } from "../../../../../utils/ga";
import { useForm } from "react-hook-form";
import cardJson from "./IndustryCardList";
import { motion } from "framer-motion";

const dropDownIndustryStructure = {
  industryDropdown:  {
    allowed: false,
    childLength: 0,
    colSpan: 0,
    customField: false,
    editable: true,
    excelDropDownHidden: false,
    fieldName: "industryList",
    fieldType: "select",
    id: "industryList",
    infoFlag: false,
    label: "Industry",
    labelKey: "IndustryList",
    lookupType: "getIndustryTypes",
    options: [],
    permission: true,
    required: false,
    rowSpan: 0,
    searchable: false,
    sortable: false,
    url: "",
    validation: {},
  },
};

const animationConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

const IndustryVertical = ({
  config,
  totalSteps,
  currentValues,
  clientId,
  userName
}: ISubComponentProps) => {
  let industryCardList =
    config?.stepType === "QUESTIONS" && config.questions[0];

  const [isListSelected, setListSelected] = useState(false);
  const [selected, setSelected] = useState<IOption>();

  const getDefaultFromList = (industryCardList, selectedIndustry) => {
    let defaultIndustry = industryCardList.options.find(function (option) { return option.optionValue === selectedIndustry; });
    if(!defaultIndustry){
      return defaultOptionValue
    }
    return industryCardList.options.find(
      (option) => option.optionValue === selectedIndustry
    )
  }

  const [defaultOptionValue, setDefaultOptionValue] = useState(
    getDefaultFromList(industryCardList, industryCardList.defaultAnswer)
  );
  

  /** Type Selectors */
  const defaultIndustryType = useTypedSelector(
    (state) => state.saas.onboarding.defaultIndustry
  );

  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });
  const { setValue, reset } = formInstance;

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingClientActions>>();

  const onListChange = (value) => {
    let selected = {
      optionId: value.clientRefMasterId,
      optionLabel: value.clientRefMasterDesc,
      optionValue: value.clientRefMasterCd,
    };
    getSelectedOption(selected, true);
  };

  const getSelectedOption = (value: IOption, isListAction) => {
    // GA-event for all the industry card as well as industry hub spot list
    sendGA(
      "Onboarding-Industry",
      `Click on industry tile & list` +
        `${clientId ? clientId : ""} - ${userName ? userName : ""} / ${value.optionValue ? value.optionValue : ''}`
    );

    let payload = {
      answerDataType: "optionValue" as "optionValue",
      answerData: [
        {
          questionId: value.optionId,
          isLocked: false,
          answerDataType: "optionValue" as "optionValue",
          answerData: value.optionValue,
        },
      ],
    };

    setListSelected(isListAction);
    setSelected(value);
    if (!isListAction) {
      reset();
      setValue("industryList", {
        value: "",
        label: "",
        id: -1,
      });
    }
    dispatch({
      type: "@@onboardingClient/SET_ANSWER_DATA",
      payload: {
        answerDataType: "optionValue",
        answerData: payload.answerData,
      },
    });
  };

  useEffect(() => {
    dispatch({
      type: "@@onboardingClient/FETCH_DEFAULT_INDUSTRY",
    });
    if (currentValues && currentValues.questions.length > 0) {
      if (
        industryCardList.options.findIndex(
          (option) => option.optionId === currentValues.questions[0].questionId
        ) === -1
      ) {
        setValue("industryList", {
          value: currentValues.questions[0].answerData,
          label: currentValues.questions[0].answerData,
          id: currentValues.questions[0].questionId,
        });
      }
      dispatch({
        type: "@@onboardingClient/SET_ANSWER_DATA",
        payload: {
          answerDataType: "optionValue",
          answerData: currentValues.questions,
        },
      });
    } else {
      if (defaultIndustryType && defaultIndustryType !== '') {
        setDefaultOptionValue(getDefaultFromList(industryCardList,defaultIndustryType))
        getSelectedOption(getDefaultFromList(industryCardList,defaultIndustryType), false);
      }else if(defaultOptionValue){
        getSelectedOption(defaultOptionValue, false);
      }
    }
  }, [defaultIndustryType, defaultOptionValue]);

  return (
    <motion.div
      transition={animationConfig}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
    >
      <div className="card__selection__block">
        <div className="step__text">
          Step {config?.stepId - 1} of {totalSteps - 1}
        </div>
        <Grid container spacing={2} style={{ margin: "1rem 0 2rem 0" }}>
          <SelectBox
            style={{
              display: "inline-block",
              width: "25%",
              padding: "13px 13px",
              verticalAlign: "top",
            }}
            list={industryCardList.options}
            col={3}
            defaultSelectedValue={
              currentValues
                ? currentValues
                : {
                    questions: [
                      {
                        questionId: typeof selected?.optionId !== 'undefined' ? selected?.optionId : defaultOptionValue?.optionId,
                      },
                    ],
                  }
            }
            getSelectedOption={getSelectedOption}
            isIcon={true}
            icon={cardJson}
            type={"select"}
            isListSelected={isListSelected}
          >
            <CardWithIcon></CardWithIcon>
          </SelectBox>
        </Grid>
        <div className="form__control">
          <p>
            Didn’t find your industry above? Select from the following list:
          </p>
          <FormField
            name="industryList"
            meta={dropDownIndustryStructure.industryDropdown}
            formInstance={formInstance}
            id={"industry_select_field"}
            onChange={(data) => onListChange(data)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IndustryVertical;
