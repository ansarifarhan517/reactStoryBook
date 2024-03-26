import React, { Dispatch, useEffect } from "react";
import SelectBox from "../../Component/SelectBox";
import first_mile_icon from "../../../../../../images/onboardingClient/ic-lastmile-1.svg";
import last_mile_icon from "../../../../../../images/onboardingClient/ic-fmlm.svg";
import first_last_mile_icon from "../../../../../../images/onboardingClient/ic-all-mile.svg";
import CardWithDetail from "../../Component/CardWithDetail";
import MediaPlayer from "../../Component/MediaPlayer";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import { useDispatch } from "react-redux";
import { IOnboardingClientActions} from "../../OnboardingSteps.model";
import { IOption } from "../../Component/SelectBox";
import { sendGA } from "../../../../../utils/ga";

const routeTypeList = [
  {
    title: "Delivery Only",
    description: `<p>Your operations involve taking care of the final delivery leg of an order, i.e., from a hub to the delivery location, without stops at any intermediate hubs.</p><p><strong>Example: </strong> Delivering a customer’s order from your hub in NYC to their address in NYC.</p>`,
    icon: first_mile_icon,
    id:"OPTION_LM_OPS"
  },
  {
    title: "Pickup Only",
    description: `<p>Your operations involve taking care of the pickup leg as well as the delivery leg of an order that requires only one intermediate hub stop. An order is picked up from its pickup location and deposited at a hub. Then, the order is picked up again from the same hub and delivered to the delivery location.</p><p><strong>Example: </strong>Picking up a customer’s order from a store in NYC, bringing it to your hub in NYC, and finally delivering it to the customer’s address in NYC.</p>`,
    icon: last_mile_icon,
    id:"OPTION_FMLM_OPS"
  },
  {
    title: "End to End",
    description: `<p>Your operations involve taking care of all the pickup and delivery legs of an order. That is, the end-to-end movement of an order, right from their pickup location to the delivery location, with stops at multiple intermediate hubs. </p><p><strong>Example: </strong>Picking up a customer’s order from a store in NYC, bringing it to your hub in NYC, then to your hub in Chicago, and finally delivering it to the customer’s address in Chicago.</p>`,
    icon: first_last_mile_icon,
    id:"OPTION_ALLMILE_OPS"
  },
];

const PrimaryOperation = ({
  name,
  config,
  totalSteps,
  clientId,
  currentValues,
  userName
}: ISubComponentProps) => {
  let routeTypeCardList =
    config?.stepType === "QUESTIONS" && config.questions[0];

  /** Redux Hooks */
  const dispatch = useDispatch<Dispatch<IOnboardingClientActions>>();


  const getSelectedOption = (value: IOption) => {
    // GA-event for all the model type
    sendGA(
      "Onboarding-ModelType",
      `Click on card` +
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
    dispatch({ type: "@@onboardingClient/SET_ANSWER_DATA", payload: payload });
  };

  useEffect(() => {
    if(currentValues){
      dispatch({ type: "@@onboardingClient/SET_ANSWER_DATA", payload: { answerDataType: 'optionValue', answerData: currentValues.questions} });
    }else{
      dispatch({ type: "@@onboardingClient/SET_ANSWER_DATA", payload: { answerDataType: 'optionValue', answerData: []} });
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
          <p>
            Make your selection carefully as we will configure the product based
            on your response.
          </p>
          <MediaPlayer
            clientId={clientId}
            url="https://loginext-media-bucket-demo.s3.ap-southeast-1.amazonaws.com/onboarding-media/Model+Type.mp4"
            styles={{
              width: "100%",
              height: "22rem",
              "background-color": "black",
              marginBottom: "2rem",
              marginTop: "1rem"
            }}
            id='order_dispatch_video'
          />
        </div>
        <div className="route__selection__wrapper">
          <SelectBox
            style={{
              display: "inline-block",
              width: "33.33%",
              padding: "0 5px",
              verticalAlign: "top",
            }}
            isOpeartionType={true}
            list={routeTypeCardList.options}
            defaultSelectedValue={currentValues}
            getSelectedOption={getSelectedOption}
            col={4}
            isIcon={true}
            icon={routeTypeList}
            isHTML={true}
          >
            <CardWithDetail />
          </SelectBox>
        </div>
      </div>
    </>
  );
};

export default PrimaryOperation;
