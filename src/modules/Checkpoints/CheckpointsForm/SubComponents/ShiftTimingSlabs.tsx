import moment from "moment";
import React from "react";
import { ShiftTimings } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { IShiftTimingsObject } from "../CheckpointsForm.models";
import { ShiftTimingWrapper } from "../CheckpointsFormStyledComponent";

const ShiftTimingSlabs = ({ errorMappingArray, prefId, handleShiftTimings }) => {

    // Redux Data
    const shiftTimings = useTypedSelector(
        (state) => state.checkpoints.form.shiftTimings
    );


    // Utils
  const timeToString = (d: Date | undefined) => {
    return moment(d).format("HH:mm");
  };

  const stringToTime = (timeString: string) => {
    return moment(timeString, "HH:mm")?.toDate();
  };

  const handleChange = (
    _: any,
    __?: string | undefined,
    ___?: Date | undefined,
    shiftTimingArray?: IShiftTimingsObject[] | undefined
  ) => {
    handleShiftTimings(prefId, shiftTimingArray);
  };

  return (
    <ShiftTimingWrapper>
      <ShiftTimings
        fromLabel="Start time"
        toLabel="Stop time"
        timeInterval={30}
        timeToString={timeToString}
        stringToTime={stringToTime}
        selected={shiftTimings[`pref${prefId}`]?.length? shiftTimings[`pref${prefId}`]: undefined}
        fromError={errorMappingArray?.map((slabErrors) => slabErrors?.startTime?.error)}
        toError={errorMappingArray?.map((slabErrors) => slabErrors?.endTime?.error)}
        fromErrorMessage={errorMappingArray?.map((slabErrors) => slabErrors?.startTime?.message)}
        toErrorMessage={errorMappingArray?.map((slabErrors) => slabErrors?.endTime?.message)}
        onChange={handleChange}
        maxSlabAllowed={3}
        required={true}
      />
    </ShiftTimingWrapper>
  );
};

export default ShiftTimingSlabs;
