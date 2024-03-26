import React from 'react'

export const handleMinutesToHours = (minutes : number) => {
    let hourMinutes = minutes % 60;
    let hour = Math.trunc(minutes / 60);
 
    return [hour, hourMinutes];
 }

 export const colors = [
    "#C9C5C5",
     "#5698D3",
     "#e32022",
     "#99C9CA",
     "#006279"
  ]


  export const CustomTooltip = ({ active, payload, label } : any) => {
   if (active && payload && payload.length) {
     return (
       <div style={{backgroundColor: 'black', opacity: '0.85'}}>
         <p style={{fontSize: '12px', textAlign: 'left', color: 'white', paddingTop: '7px', paddingLeft: '7px'}}>{`${label}`}</p>
         <div>
           {payload.map((pld) => (
             <div style={{  padding: 10 }}>
               <div style={{borderStyle: 'solid', background: pld.fill, width: '10px', height:'10px', display:'inline-block', position: 'absolute', left:'7px'}}></div>
               <span style={{ color: 'white', textAlign: 'center', marginLeft: '45px',  marginRight: '45px'}}>{pld.dataKey}</span>
               <span style={{ color: pld.fill, position: 'absolute', right:'7px'}}>{pld.value}</span>
             </div>
           ))}
         </div>
       </div>
     );
   }
 
   return null;
 };

 export const percentCalculator = ( value, totalValue) => {
    if(totalValue != 0 ){
     return Math.trunc((value/totalValue)*100)
    }else{
      return 0
    }
 }

 export const distanceUnitFormatter = (value, unit) => {
   if(unit == 'KM'){
     return value;
   }else{
     return value * 0.621371;
   }
 }