
const capacityConversion = (value: number, type:string, conversionFactor: any,) => {
  if(type === 'GET') {
    return value * conversionFactor
  } else if (type === 'POST') {
    return value / conversionFactor
  }
  return 0
}

export default  capacityConversion