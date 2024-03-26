import moment from "moment-timezone";
import React from "react";
import {
    DateRangePicker,
    Position,
    TextInput
} from "ui-library";
import useClientProperties from '../../../../common/ClientProperties/useClientProperties';
import { TextInputStyled } from '../StyledSubComponent';
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";

interface IDateRangePickerComponent {
    startDate:Date
    endDate:Date
    setDateRangePickerText:(text:string) => void
    dateRangePickerText:string
    setStartDate:(date:Date) => void
    setEndDate:(date:Date) => void
}

const DateRangePickerComponent = (props: IDateRangePickerComponent) => {
    const { startDate, endDate, setDateRangePickerText, dateRangePickerText, setStartDate, setEndDate } = props
    const dateRangePickerRef = React.createRef<HTMLDivElement>();
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const format = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() ? clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase() : 'YYYY-MM-DD'
    const viewMode = useTypedSelector(state => state.deliveryMedium.listView.viewMode)

    const dateFormatter = (date: Date) => {
        return moment(date).format(`${format}`);
    }
   
    const convertStringToDate = (input: string) => {
       const isValidDateEntered= moment(input, format).isValid()
       if(isValidDateEntered){
           return moment(input, format).toDate()
       } 
       return undefined
      }
    return (

        <DateRangePicker
            variant="daterange"
            style={{ position: "absolute", right: viewMode === 'mapview' ? '-140px' : '45px', zIndex: 11 }}
            open={false}
            startDate={startDate}
            endDate={endDate}
            showTime={false}
            fromDateFormatter={dateFormatter}
            toDateFormatter={dateFormatter}
            timeFormat={24}
            stringToDate={convertStringToDate}
            onApply={(range) => {
                if (range) {
                    setStartDate(range[0])
                    setEndDate(range[1])
                    setDateRangePickerText(
                        `${moment(range[0]).format(
                            `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`
                        )} - ${moment(range[1]).format(
                            `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()}`
                        )}`
                    );

                }
            }}
        >
            {({ open, setOpen }) => {
                return (
                    <div ref={dateRangePickerRef}>
                        <Position
                            type="relative"
                            display="inline-block"
                        >
                            <TextInputStyled onClick={() => setOpen(!open)}>
                                <TextInput
                                    id="date-range-download"
                                    variant='withIcon'
                                    iconVariant='calendar'
                                    iconSize='xs'
                                    border={true}
                                    color="black"
                                    style={{ width: "525px" ,cursor:'pointer'}}
                                    fullWidth
                                    label=''
                                    labelColor='black'
                                    iconStyle={{ padding: "12px",cursor:'pointer' }}
                                    onChange={() => { }}
                                    onClick={() => {
                                        setOpen(true);
                                       
                                    }}
                                    value={dateRangePickerText}
                                />
                            </TextInputStyled>
                        </Position>
                    </div>
                );
            }}
        </DateRangePicker>

    );


}

export default DateRangePickerComponent