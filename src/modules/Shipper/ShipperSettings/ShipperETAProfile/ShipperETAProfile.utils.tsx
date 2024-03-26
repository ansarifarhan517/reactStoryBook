import { IShipperData } from './ShipperETAProfile.model';

export const generateShipperFormData = (data: IShipperData) => {
  const ETAWINDOW= data.filter((properties:any) =>{ 
    properties.propertyKey == 'ETAWINDOW'
    if(properties.propertyKey == 'ETAWINDOW'){
     return properties
    }
   });
  return {
    OPTION_ETAWINDOW:{
      id:ETAWINDOW[0]?.propertyKey,
      name: (ETAWINDOW[0]?.propertyValue) ? ETAWINDOW[0]?.propertyValue / 60 +' Hour' : '',
      ...ETAWINDOW[0]
    }
   }
}

