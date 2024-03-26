import moment from "moment";
import store from "../../../../utils/redux/store";

const clientProperties = store?.getState()?.clientProperties;


export const filterDateFormatter = (date?: Date) => {
    const timezone = clientProperties?.TIMEZONE?.propertyValue ? clientProperties?.TIMEZONE?.propertyValue?.toUpperCase() : "";
    return moment.tz(date, timezone).utc().format("YYYY-MM-DD HH:mm:ss");
};



export const capacityConversion = (value: number, type: string, conversionFactor: any,) => {
    if (type === 'GET') {
        return value * conversionFactor
    } else if (type === 'POST') {
        return value / conversionFactor
    }
    return 0
}
