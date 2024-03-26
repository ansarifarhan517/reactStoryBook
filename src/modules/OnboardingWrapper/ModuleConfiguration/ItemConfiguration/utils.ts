import capacityConversion from '../../../Vehicle/VehicleListView/utils/capacityConversion';

export const preparePOSTData = (data:any, type:string, systemMetric:any ) => {
    const newData = {...data}
    const metricDimension = systemMetric?.find((obj:any) => obj?.name === 'dimension')
    const metricWeight = systemMetric?.find((obj:any) => obj?.name === 'weight')
    const metricVolume = systemMetric?.find((obj:any) => obj?.name === 'volume')
  
  
    newData.itemLength = newData.itemLength && capacityConversion(
      parseFloat(data.itemLength),
      type,
      metricDimension?.conversionFactor
    )
    newData.itemLength = type === 'GET' ? (newData.itemLength && isNaN(newData?.itemLength?.toFixed(2))) ? '' : newData?.itemLength?.toFixed(2) : newData.itemLength
  
    newData.itemHeight= newData.itemHeight && capacityConversion(
      parseFloat(data.itemHeight),
      type,
      metricDimension?.conversionFactor
    )
    newData.itemHeight = type === 'GET' ? (newData?.itemHeight && isNaN(newData?.itemHeight?.toFixed(2))) ? '' : newData?.itemHeight?.toFixed(2) : newData?.itemHeight

  
    newData.itemBreadth = newData.itemBreadth && capacityConversion(
      parseFloat(data.itemBreadth),
      type,
      metricDimension?.conversionFactor
    )
    newData.itemBreadth = type === 'GET' ? (newData?.itemBreadth && isNaN(newData?.itemBreadth?.toFixed(2))) ? '' : newData?.itemBreadth?.toFixed(2) : newData?.itemBreadth

  
    newData.itemWeight = newData.itemWeight && capacityConversion(
      parseFloat(data.itemWeight),
      type,
      metricWeight?.conversionFactor
    )
    newData.itemWeight = type === 'GET' ? (newData?.itemWeight && isNaN(newData?.itemWeight?.toFixed(2))) ? '' : newData?.itemWeight?.toFixed(2) : newData?.itemWeight

  
    newData.itemVolume = newData.itemVolume && capacityConversion(
      parseFloat(data.itemVolume),
      type,
      metricVolume?.conversionFactor
    )
    newData.itemVolume = type === 'GET' ? (newData?.itemVolume && isNaN(newData?.itemVolume?.toFixed(2))) ? '' : newData?.itemVolume?.toFixed(2) : newData?.itemVolume

    return newData
  }
  