import moment from "moment";
import React from "react";
import { stringToTime, isOvernightShift } from '../../utils';
interface ITimeConversionProps {
    time: string;
    values?: {
        [key: string]: any
    }
    isEndTime?: boolean
}

const TimeConversion = ({time, values, isEndTime}:ITimeConversionProps) => {
    return(
        <span>
            {moment(stringToTime(time)).format("HH:mm")} {isEndTime && isOvernightShift(moment(stringToTime(values?.startTime)).format("HH:mm"), moment(stringToTime(values?.endTime)).format("HH:mm")) && <sup>+1</sup>}
        </span>
    )
}

export default TimeConversion;