import { IDropdown, IFormFields } from "./CompartmentConfiguration.models";
import { metricsConversion } from '../../../../utils/helper';

export const preparePayload = (formInputs: IFormFields, clientMetric: any) => {
  const volume = clientMetric && clientMetric?.find(c => c.name === 'volume')
  const weight = clientMetric && clientMetric?.find(c => c.name === 'weight')

  const {
    compartmentName,
    breadth,
    capacityInUnits,
    capacityInVolume,
    capacityInWeight,
    height,
    length,
    temperatureCategoryCd,
    minTemperature,
    maxTemperature,
    crateIds
  } = formInputs;
  const payload = {
    compartmentName: compartmentName,
    breadth: breadth ? breadth : null,
    height: height ? height : null,
    length: length ? length : null,
    capacityInUnits: capacityInUnits ? parseInt(capacityInUnits) : null,
    capacityInVolume: capacityInVolume ? metricsConversion(parseFloat(capacityInVolume), 'POST', volume?.conversionFactor)?.toFixed(4) : 0,
    capacityInWeight: capacityInWeight ? metricsConversion(parseFloat(capacityInWeight), 'POST', weight?.conversionFactor)?.toFixed(4) : 0,
    temperatureCategoryCd: temperatureCategoryCd ? temperatureCategoryCd.clientRefMasterCd : '',
    minTemperature: minTemperature ? minTemperature : null,
    maxTemperature: maxTemperature ? maxTemperature : null,
    crateIds: crateIds && crateIds.length > 0 ? crateIds.map((crate: IDropdown) => crate.id) : []
  };
  return payload;
};
