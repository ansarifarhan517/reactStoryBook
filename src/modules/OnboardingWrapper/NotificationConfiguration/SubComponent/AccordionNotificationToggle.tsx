import React from "react";
import { Toggle } from "ui-library";

interface IAccordionNotificationToggleProps {
  id: string;
  currentState: boolean;
  setCurrentState: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateState: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccordionNotificationToggle = ({
  id,
  currentState,
  setCurrentState,
  setUpdateState,
}: IAccordionNotificationToggleProps) => {
  const handleChange = () => {
    setUpdateState(true);
    setCurrentState((state) => !state);
  };
  return (
    <>
      <Toggle id={id} checked={currentState} onChange={handleChange} />
    </>
  );
};

export default AccordionNotificationToggle;
