
import React from "react";
import { convertDateTimeZone } from "../helper";

export interface IDateProps {
    date: Date;
    timezone: string;
    dateformat: string;
}   
const DateConversion = ({date, timezone, dateformat}:IDateProps) => {
    return <>{convertDateTimeZone(date, timezone, dateformat)}</>;
}

export default DateConversion;