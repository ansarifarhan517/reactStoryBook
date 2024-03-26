import store from '../../../../utils/redux/store';
import { IShipperUnitSystemData } from './ShipperPreference.model';
export const generateShipperFormData = (data: IShipperUnitSystemData) => {
 const  UNITSYSTEM  = (data.find((prop:any) => prop.propertyKey=='UNITSYSTEM')).propertyValue
 let dataRes = {}
 Object.values(data).map((res: any) => {
  if(res.propertyKey === 'BASECOUNTRY'){
    const baseContry = setPropertyVal(res.propertyValue, 'countries')
    return dataRes[res.propertyKey] = baseContry ? baseContry :  { id: res.propertyKey, name: res.propertyValue }
  } if(res.propertyKey === 'DATEFORMAT'){
    const dateformat = setPropertyVal(res.propertyValue, 'dateformat')
    return dataRes[res.propertyKey] = dateformat ? dateformat :  { id: res.propertyKey, name: res.propertyValue }
  }
  if(res.propertyKey === 'BASELANGUAGE'){
    const baselang = setPropertyVal(res.propertyValue, 'baselang')
    return dataRes[res.propertyKey] = baselang ? baselang :  { id: res.propertyKey, name: res.propertyValue }
  }
  else {
    return dataRes[res.propertyKey] = { id: res.propertyKey, name: res.propertyKey=='DATEFORMAT' ? res?.propertyValue?.toUpperCase(): res.propertyValue }
  }
 }, dataRes)

  return {
    ...dataRes,
    UNITSYSTEM: {
      id: 'UNITSYSTEM',
    name: sysPropertyReverseMapping[UNITSYSTEM]
    }
   }
}

export const setUnitSystemResponse=(response:IShipperUnitSystemData, unitSystemType:string) =>{
  var data:IShipperUnitSystemData=[];
  let properties= ["DISTANCE","VOLUME","SPEED","WEIGHT","DIMENSION"];
 
        response.map((unit:IShipperUnitSystemData)=>{
          properties.map((prop:string)=>{
            if(unitSystemType+prop==unit.lookupType){
             data[prop] = {id:unit.lookupType, name: unit.lookupCd}
            }
          })
          
        })
  
  return data
}


export const sysPropertyReverseMapping = {
  "IMPERIALSYSTEM": "Imperial System (ml, mph, lb, cubic inches, inches)",
  "METRICSYSTEM": "Metric System (km, kmph, kg, cc, cm)",
  "USCUSTOMARYSYSTEM": "US Customary System (ml, mph, lb, cubic inches, inches)"
};

export const sysPropertyMapping = {
  "Imperial System (ml, mph, lb, cubic inches, inches)": "IMPERIALSYSTEM",
  "Metric System (km, kmph, kg, cc, cm)": "METRICSYSTEM",
  "US Customary System (ml, mph, lb, cubic inches, inches)": "USCUSTOMARYSYSTEM"
};

const setPropertyVal =(propertyVal: string, storeState: string )=>{ 
  const mapping = store.getState().shipper.preference[storeState]
  let propObj
  if(storeState === 'baselang'){
    propObj = mapping ? Object.values(mapping).filter((prop:any) =>{return prop.clientRefMasterCd === propertyVal}) : undefined;
  } else {
    propObj = mapping ? Object.values(mapping).filter((prop:any) =>{return prop.name === propertyVal}) : undefined;
  }
  return  propObj ? propObj[0] : undefined
}