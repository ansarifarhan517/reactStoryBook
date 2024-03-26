import React, { useState } from "react";
import {
  Accordion,
  AccordionHeaderTitle,
  FontIcon,
} from "ui-library";
import {
  AccrodianContentWrapper,
  AddNewAlertButtonWrapper,
  AddNewAlertTextWrapper,
  StyledBox,
} from "../CheckpointsFormStyledComponent";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import PreferenceAccordian from "./PreferenceAccordian";
import { AccordionHeaderSubTitle } from "../../../Saas/Plans/Accordion/StyledAccodion";

const RestrictedAlertsAccordion = ({
  data,
  alertsFormInstance,
  structure,
  dispatch,
  toggleState,
  errorMappingArray,
  updatedToggleState,
  dynamicLabels,
  isCheckpointEditable,
}) => {
  // Redux data
  const { shiftTimings, checkpointData, saveAlertModalFlag } = useTypedSelector(
    (state) => state.checkpoints.form
  );

  // Destructured Params
  const {
    toggleLabelKey: accordianToggleKey,
    id: accordianId,
    fallbackLabel: accordianLabel,
    fallbackAccordianLabel
  } = data;
  // Local States
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedId, setExpandedId] = useState<string>();
  const [expandedPrefId, setExpandedPrefId] = useState<string>("");
  const [isPermitted, setIsPermitted] = useState(saveAlertModalFlag ?  updatedToggleState?.[accordianToggleKey] : toggleState?.[accordianToggleKey])

  const handleRestrictedExpandArrow = (_id: string, isExpanded: boolean = false) => {
    setExpandedId(isExpanded ? _id : "");
    isPermitted && setIsExpanded(isExpanded);
  };

  // const handleAccordionToggle = React.useCallback(
  //   (id: string, isExpanded?: boolean) => {
  //     setExpandedId(isExpanded ? id : "");
  //   },
  //   [setExpandedId]
  // );

  const handlePreferenceExpand = (prefId: string) => {
    prefId === expandedPrefId
      ? setExpandedPrefId("")
      : setExpandedPrefId(prefId);
  };

  const addPreference = () => {
    dispatch({
      type: "@@checkpointsForm/SET_SHIFT_TIMINGS",
      key: `pref${Object.keys(shiftTimings)?.length}`,
      payload: [{ id: new Date().toString() }],
    });
  };

  return (
    <Accordion
      expanded={expandedId === accordianId}
      id={accordianId}
      showToggleSwitch={true}
      onToggle={handleRestrictedExpandArrow}
      isToggleChecked={isPermitted}
      onToggleSwitch={(toggleFlag) => {
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: { key: accordianToggleKey, value: toggleFlag },
        });
        setIsExpanded(toggleFlag);
        setIsPermitted(!isPermitted);
      }}
      key={accordianId}
    >
      {{
        header: (
          <>
            <AccordionHeaderTitle>
              {dynamicLabels.accordionToggleKey
                ? dynamicLabels.accordionToggleKey
                : accordianLabel}
            </AccordionHeaderTitle>
            <AccordionHeaderSubTitle>
              {dynamicLabels.accordionLabelKey
                ? dynamicLabels.accordionLabelKey
                : fallbackAccordianLabel}
            </AccordionHeaderSubTitle>
          </>
        ),
        content: (
          <AccrodianContentWrapper isDisabled={!toggleState?.restrictedTime}>
            {
              Object.values(shiftTimings)?.map((_value, index) => {
                return (
                  <PreferenceAccordian
                    prefId={index.toString()}
                    isExpanded={expandedPrefId === index.toString()}
                    handleExpand={handlePreferenceExpand}
                    prefStructure={structure["alert details"]}
                    formInstance={alertsFormInstance}
                    errorMappingArray={errorMappingArray}
                    key={index.toString()}
                    dynamicLabels={dynamicLabels}
                    toggleState={toggleState}
                  />
                );
              })
            }
            {/* Add New Preference Button */}
            {Object.keys(shiftTimings)?.length < 3 && (
              <AddNewAlertButtonWrapper onClick={addPreference}>
                <StyledBox>
                  <FontIcon
                    variant={"add"}
                    color={"primary.main"}
                    size={"xs"}
                  />
                  <AddNewAlertTextWrapper>
                    {dynamicLabels.addNew ? dynamicLabels.addNew : "Add New"}
                  </AddNewAlertTextWrapper>
                </StyledBox>
              </AddNewAlertButtonWrapper>
            )}
          </AccrodianContentWrapper>
        ),
      }}
    </Accordion>
  );
};

export default RestrictedAlertsAccordion;
