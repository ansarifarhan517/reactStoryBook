var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export function abbreviateNumber(number: number){
  if (typeof number === "number")
    return number.toLocaleString('en-US')
  else 
    return number+""
}

export function appendKTM(number: number, fixedDeci: number = 0){

     // what tier? (determines SI symbol)
     var tier = Math.log10(Math.abs(number)) / 3 | 0;

     // if zero, we don't need a suffix
     if(tier == 0) return number;
 
     // get suffix and determine scale
     var suffix = SI_SYMBOL[tier];
     var scale = Math.pow(10, tier * 3);
 
     // scale the number
     var scaled = number / scale;
     
     var withZeros = scaled.toFixed(fixedDeci)
    
     // format number and add suffix
     return rmvSameChar(withZeros) +  suffix;
 }
 
 function rmvSameChar(str: string) : string {
   if (str[str.length-1]==="0") {
     return rmvSameChar(str.substr(0, str.length-1))
   } else if (str[str.length-1]===".") {
     return str.substr(0,str.length-1)
   } else {
       return str
   }
 }
 