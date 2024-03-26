import React from "react";
interface IRenderComponentProps {
  name: string;
  data: any;
  mapping: any;
  totalSteps: number;
  clientId?: string;
  userName?: string;
  currentStepValue?: object;
  onHandleChange?: () => any;
  moveNextStep?: any;
  formInstance?: any;
  isValidEmail?: Function;
  formData?: Object;
  isLaunchClickdFunction?: Function;
}

const RenderComponent = ({
  name,
  data,
  mapping,
  totalSteps,
  currentStepValue,
  onHandleChange,
  moveNextStep,
  formInstance,
  isValidEmail,
  formData,
  isLaunchClickdFunction,
}: IRenderComponentProps) => {
  const userData = JSON.parse(localStorage.getItem("userAccessInfo") || "");
  if (
    mapping[name].component !== null &&
    typeof mapping[name].component !== "undefined"
  ) {
    return React.createElement(mapping[name].component, {
      name: name,
      config: data,
      totalSteps: totalSteps,
      clientId: userData['clientId'] || '',
      userName: userData['userName'] || '',
      currentValues : currentStepValue,
      onFormChange: moveNextStep,
      formInstance: formInstance,
      isValidEmail: isValidEmail,
      formData,
      isLaunchClickdFunction: isLaunchClickdFunction,
    });
  }
  // component doesn't exist yet
  return React.createElement(
    () => <div>The component {name} has not been created yet.</div>,
    { name: name }
  );
};

export default RenderComponent;
