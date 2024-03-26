import { metricsConversion } from "../../utils/helper";
import store from "../../utils/redux/store";

export const isEmpty = (obj: object) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const usePagination = (data:Array<Record<string, any>>, currentPage: number, pageSize: number) => {
    const indexOfLastRecord = currentPage * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    const currentList = data.slice(indexOfFirstRecord, indexOfLastRecord);
   
    return currentList;
}    

export const convertVolume = (totalVolume: number) => {
    const clientMetric = store.getState().outscan.clientMetric;
    const clientObj = clientMetric?.find(c => c.name === 'volume');
    return Number(metricsConversion(totalVolume, 'GET', clientObj?.conversionFactor))?.toFixed(2).replace(/(\.0+|0+)$/, '')
}

export const convertWeight = (totalWeight: number) => {
    const clientMetric = store.getState().outscan.clientMetric;
    const clientObj = clientMetric?.find(c => c.name === 'weight');
    return Number(metricsConversion(totalWeight, 'GET', clientObj?.conversionFactor))?.toFixed(2).replace(/(\.0+|0+)$/, '')
}