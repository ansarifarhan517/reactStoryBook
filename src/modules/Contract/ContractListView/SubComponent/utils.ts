import moment from 'moment'

export const manipulateData = (search:any, columnName:string[], timezone:string) => {

   const sBArray = search?.searchBy?.split('#@#')
   const sTArray = search?.searchText?.split('#@#')

   columnName.forEach((c:string) => {
     const index = sBArray.findIndex((element:string) => element === c)
     let value = index != -1 ? sTArray[index] : undefined
     let valueArray = value ? value.split('$@$') : undefined
     if(valueArray) {
        valueArray[0] =  moment(valueArray[0]).startOf('day')
        valueArray[1] = moment(valueArray[1]).startOf('day')
     }
 
     
     let vA = valueArray && valueArray.map((a:any) => {
        const date = timezone ? moment.tz(a,timezone).utc().format('YYYY-MM-DD+HH:mm:ss') : moment(parseInt(a)).format('YYYY-MM-DD+HH:mm:ss') 
        return date 
    })

    if(index != -1) {
        sTArray[index] = vA?.join('$@$')
    }

   })

   return {
       searchBy : search.searchBy as string,
       searchText: sTArray.join('#@#') as string
   }



}



