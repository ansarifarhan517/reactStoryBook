import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionHeaderTitle,
  AccordionHeaderSubTitle,
  Grid,
} from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import { deepCopy } from "../../../../utils/helper";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { StyledAccordionWrapper } from "../CheckpointsFormStyledComponent";

const MaxHaltTimeAccordion = ({
  data,
  alertsFormInstance,
  structure,
  dispatch,
  toggleState,
  isCheckpointEditable,
  updatedToggleState,
  dynamicLabels,
  setIsFormValid,
}) => {
  const [expandedId, setExpandedId] = useState<string>();
  const newStructure = deepCopy(structure);
  const { checkpointData, saveAlertModalFlag } = useTypedSelector((state)=>state.checkpoints.form);
  const { watch, setError, clearErrors  } = alertsFormInstance;
  const watchHrs = watch("hrs");
  const watchMins = watch("mins");
  const [customError, setCustomError] = useState({customValidationError: false, customValidationErrorMessage: ''})
  const [required, setRequired] = useState(false)

  useEffect(() => {
    if(parseInt(watchHrs) === 0 && parseInt(watchMins) === 0) {
      setIsFormValid(false);
      setRequired(true)
      setError("hrs", setCustomError({customValidationError: true, customValidationErrorMessage: dynamicLabels?.maxHaltWarning ? dynamicLabels?.maxHaltWarning : '0 hour and 0 minutes is not allowed'}));
      setError("mins", setCustomError({customValidationError: true, customValidationErrorMessage: dynamicLabels?.maxHaltWarning ? dynamicLabels?.maxHaltWarning : '0 hour and 0 minutes is not allowed'}));
      return;
    } 
    else {
      setRequired(true)
      setIsFormValid(true); 
      setCustomError({customValidationError: false, customValidationErrorMessage: ""})
      clearErrors("hrs");
      clearErrors("mins");
    }
  }, [watchHrs, watchMins])

  const handleMaximumHaltValidation = () => {
    if (!toggleState["maximumHaltTime"]) {
      newStructure["alert details"].hrs.required = false;
      newStructure["alert details"].hrs.validation = {};
      newStructure["alert details"].mins.required = false;
      newStructure["alert details"].mins.validation = {};
    } else if (toggleState["maximumHaltTime"]) {
      newStructure["alert details"].hrs.required = true;
      newStructure["alert details"].mins.required = true;
    }
  };

  const stripValidations = (structureData: any) => {
    const { validationObj, requiredVal, ...rest } = structureData;
    return { ...rest, required: false, validation: {}, editable:false };
  };

  const handleAccordionToggle = React.useCallback(
    (id: string, isExpanded?: boolean) => {
      setExpandedId(isExpanded ? id : "");
    },
    [setExpandedId]
  );

  return (
    <Accordion
      expanded={expandedId === data.id}
      id={data.id}
      onToggle={handleAccordionToggle}
      showToggleSwitch={true}
      onToggleSwitch={(toggleFlag) => {
        dispatch({
          type: "@@checkpointsForm/SET_TOOGLE_STATE",
          payload: { key: data.toggleLabelKey, value: toggleFlag },
        });
        handleMaximumHaltValidation();
      }}
      isToggleChecked={saveAlertModalFlag ? updatedToggleState[data?.toggleLabelKey] :  toggleState[data?.toggleLabelKey]}
    >
      {{
        
        header: (
          <>
            <AccordionHeaderTitle>{dynamicLabels[data.toggleLabelKey] ? dynamicLabels[data.toggleLabelKey] : data.fallbackLabel}</AccordionHeaderTitle>
            <AccordionHeaderSubTitle>{dynamicLabels[data.accordionLabelKey]? dynamicLabels[data.accordionLabelKey]: data.fallbackAccordianLabel}</AccordionHeaderSubTitle>
          </>
        ),
        content: (
            <StyledAccordionWrapper>
            {Object.keys(structure["alert details"]).map((fieldName) => {
              const meta = structure["alert details"][fieldName];
              if (toggleState?.maximumHaltTime) {
                const {customValidationError, customValidationErrorMessage} = customError;
                const customMeta = {...meta, customValidationError, customValidationErrorMessage, required}
                if (fieldName == "hrs") {
                  return (
                    <>
                      <Grid
                        item
                        key={fieldName}
                        xs={3}
                        sm={3}
                        md={3}
                      >
                        <FormField
                          name={fieldName}
                          meta={customMeta}
                          formInstance={alertsFormInstance}
                          boundLeft={560}
                        />
                      </Grid>
                    </>
                  );
                } else if (fieldName == "mins") {
                  return (
                    <>
                      <span className="mins-container">
                        :
                      </span>{" "}
                      <Grid
                        item
                        key={fieldName}
                        xs={3}
                        sm={3}
                        md={3}
                      >
                        <FormField
                          name={fieldName}
                          meta={customMeta}
                          formInstance={alertsFormInstance}
                        />
                      </Grid>{" "}
                    </>
                  );
                } else {
                  return null;
                }
              } else {
                const validationStriped = stripValidations(meta);
                if (fieldName == "hrs") {
                  return (
                    <>
                      <Grid
                        item
                        key={fieldName}
                        xs={3}
                        sm={3}
                        md={3}
                        className="accordionContentDisable"
                      >
                        <FormField
                          name={fieldName}
                          meta={validationStriped}
                          formInstance={alertsFormInstance}
                        />
                      </Grid>
                    </>
                  );
                } else if (fieldName == "mins") {
                  return (
                    <>
                      <span className="mins-container">
                        :
                      </span>{" "}
                      <Grid
                        item
                        key={fieldName}
                        xs={3}
                        sm={3}
                        md={3}
                        className="accordionContentDisable"
                        style={{opacity: 0.7}}
                      >
                        <FormField
                          name={fieldName}
                          meta={validationStriped}
                          formInstance={alertsFormInstance}
                        />
                      </Grid>{" "}
                    </>
                  );
                } else {
                  return null;
                }
              }
            })}
          </StyledAccordionWrapper>
        ),
      }}
    </Accordion>
  );
};

export default MaxHaltTimeAccordion;
