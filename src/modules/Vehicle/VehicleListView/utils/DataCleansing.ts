import { IMongoField } from '../../../../utils/mongo/interfaces' 

interface IColumnStructure {
  [key:string]: IMongoField
}
 
const polishedVehicleColumns = (columns:IColumnStructure) => {
    let HSetColumnStructure: IColumnStructure = {}
    
    Object.values(columns).forEach((value:IMongoField) => {
      if (value.childLength && value.childLength !== 0) {
        value.childNodes && Object.values(value.childNodes).forEach((v: any) => {
          const a = {
            ...v,
            label: value.label + v.label
          }
          HSetColumnStructure = HSetColumnStructure
            ? {
                ...HSetColumnStructure,
                [v.id]: a
              }
            : { [v.id]: a }
        })
      } else {
        HSetColumnStructure = HSetColumnStructure
          ? {
              ...HSetColumnStructure,
              [value.id]:  {...value},
              
            }
          : { [value.id]: { ...value} }
      }
    })
    return HSetColumnStructure
  }
  export default polishedVehicleColumns
  