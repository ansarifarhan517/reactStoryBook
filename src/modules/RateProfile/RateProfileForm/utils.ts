import capacityConversion from "../../Vehicle/VehicleListView/utils/capacityConversion";

const moduleNameMapping = {
  distance: 0.1,
  volume: 0.1,
  weight: 0.1,
  piece: 1,
  CODhandlingFees: 0.1,
  insurance: 0.1,
};

export const getConvertedData = (
  values: any,
  clientMetric: any,
  type: string,
  systemMetric:any
) => {
  let mainObj = {};
  if (values) {
    Object.keys(values)?.forEach((key: string) => {
      const arr = values[key];
      const metric = clientMetric?.[key];
      const stepper = moduleNameMapping?.[key];

      const metricName = systemMetric?.find((obj:any) => {
        return obj?.propertyKey?.toLowerCase() === key
      })
      console.log(metricName)

      if (!!metric) {
        const newArr = arr?.map((obj: any, index: number) => {

          let fromVal:number = capacityConversion(
            obj?.fromValue,
            type,
            metric?.conversionFactor
          );
          let toVal:number = capacityConversion(
            obj?.toValue,
            type,
            metric?.conversionFactor
          );
          if (index !== 0) {
            fromVal =
              capacityConversion(
                arr[index - 1]?.toValue,
                type,
                metric?.conversionFactor
              ) + stepper;
          }
         
          let rateT = obj?.rateType
          if(rateT !== 'Flat Rate' && !!metricName)  {
            let name = capitalize(metricName?.propertyValue) 
            rateT = `Per ${name} Rate`
          }
          return {
            ...obj,
            fromValue: type === 'POST' ?  fromVal : parseFloat(fromVal.toFixed(1)),
            toValue: index === arr.length -1 ? null : type === 'POST' ? toVal : parseFloat(toVal.toFixed(1)),
            rateType: rateT
          };
        });
        mainObj = {
          ...mainObj,
          [key]: newArr,
        };
      } else {
        mainObj = {
          ...mainObj,
          [key]: arr,
        };
      }
    });
    return mainObj;
  }
  return undefined;
};

export const dropdownOptionMapping = {
  rateTypeLookupDistance: "distance",
  rateTypeLookupWeight: "weight",
  rateTypeLookupVolume: "volume",
  rateTypeLookupPiece: "piece",
  rateTypeLookupNormal: "rateNormal",
};


export const capitalize = (word:string) => {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}

export const ConvertDropdownValues = (dropdowns: any, systemMetric:any[]) => {
  let mainObj = {};
  if(Object.keys(dropdowns)?.length > 0 && systemMetric?.length > 0) {
    Object.keys(dropdowns)?.forEach((key: string) => {
      const arr = dropdowns[key];
      const keyName = dropdownOptionMapping[key]
      const metricName = systemMetric?.find((obj:any) => {
        return obj?.propertyKey?.toLowerCase() === keyName
      })

      if (!!metricName) {
        const newArr = arr?.map((obj: any) => {
          let ogValue = obj?.clientRefMasterCd

          if(ogValue !== 'Flat Rate' && !!metricName)  {
            let name = capitalize(metricName?.propertyValue) 
            ogValue = `Per ${name} Rate`
          }
          return {
            ...obj,
            label: ogValue,
            value: ogValue,
            name: ogValue,
            id: ogValue
          };
        });

        mainObj = {
          ...mainObj,
          [key]: newArr,
        };

      } else {
        mainObj = {
          ...mainObj,
          [key]: arr,
        };
      }
    });
    console.log(mainObj)
    return mainObj;

  } return undefined

}