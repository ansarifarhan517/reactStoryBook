import {IEventTypes} from '../WebHookListView.models'


export const PrepareEventArray = (moduleType:any, eventType:any) => {
    let mainArray = {
        'ALL': eventType
    }
    moduleType.forEach((m:any)=> {
        const key = 'EVENT_TYPE_'+m.clientRefMasterCd.toUpperCase()
        const newArray:any = []
        eventType?.forEach((m:any)=> {
           if (m.clientRefMasterType === key) {
                newArray.push(m) 
           }
        })
        mainArray = {
            ...mainArray,
            [m.clientRefMasterCd.toUpperCase()] : newArray
        }
    })
   
    return mainArray
}

export const PrepareHashObject = (array: any) => {
    let finalArray = {}

    array?.forEach((m:any) => {
        finalArray = {
            ...finalArray,
            [m.clientRefMasterCd]: {
                ...m
            }
        }
    })
   
    return finalArray
    
}

export const getEventObj = (array:IEventTypes[], value:string | IEventTypes) => {
        const eventObj = array?.find((m:any) => m.clientRefMasterCd === value) 
        return eventObj?.clientRefMasterCd+'_'+eventObj?.clientRefMasterType || undefined
} 