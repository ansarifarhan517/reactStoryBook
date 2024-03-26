import React, { Dispatch } from "react";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionContent,
  AccordionHeaderTitle,
  FontIcon,
} from "ui-library";
import { CheckpointsFormActions } from "../CheckpointsForm.actions";
import PrefFormFields from "./PrefFormFields";
import ShiftTimingSlabs from "./ShiftTimingSlabs";
import { HeaderWrapper } from "../CheckpointsFormStyledComponent";

const PreferenceAccordian = ({
  prefId,
  isExpanded,
  handleExpand,
  prefStructure,
  formInstance,
  errorMappingArray, 
  dynamicLabels,
  toggleState,
}) => {

  const dispatch = useDispatch<Dispatch<CheckpointsFormActions>>();

  const handleShiftTimings = (prefId, shiftTimeArray) => {
    dispatch({type: "@@checkpointsForm/SET_SHIFT_TIMINGS", key: `pref${prefId}`, payload: shiftTimeArray})
  };

  const deletePreference = (deleteIndex) => {
    dispatch({
        type: "@@checkpointsForm/REMOVE_SHIFT_TIMINGS",
        key: deleteIndex,
    });

    const {setValue, getValues} = formInstance;
    
    Array.from({ length: 2 - deleteIndex }, (_, i) => i + deleteIndex).forEach(i => {
      setValue(`fleetType${i}`, getValues(`fleetType${i + 1}`));
      setValue(`fleetType${i + 1}`, undefined);
    
      setValue(`vehicleType${i}`, getValues(`vehicleType${i + 1}`));
      setValue(`vehicleType${i + 1}`, undefined);
    });
  }


  return (
      <Accordion
      hideChevron={false}
      id={prefId}
      showToggleSwitch={false}
      onToggle={handleExpand}
      expanded={isExpanded}
    >
      {{
        header: (
          <HeaderWrapper>
            <AccordionHeaderTitle>
              {dynamicLabels.preference ? dynamicLabels.preference : "Preference"} {+prefId + 1}
            </AccordionHeaderTitle>
            <div
              onClick={() => {
                  deletePreference(+prefId);
              }}
            >
              <FontIcon variant={"icomoon-delete-empty"} size={"sm"} />
            </div>
          </HeaderWrapper>
        ),
        content: (
          <AccordionContent>
            {/* - Form Fields: Fleet and Vehicle */}
            <PrefFormFields
              prefStructure={prefStructure}
              prefId={prefId}
              formInstance={formInstance}
              // key={prefId}
            />
            {/* - Shift Slabs */}
            <ShiftTimingSlabs
              key={prefId}
              handleShiftTimings={handleShiftTimings}
              prefId={prefId}
              errorMappingArray={errorMappingArray[prefId]}
            />
          </AccordionContent>
        ),
      }}
    </Accordion>
  );
};

export default PreferenceAccordian;
