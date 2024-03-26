import { emptyField, IDynamicCardTileList } from "./MobileTemplate.models";

export const onlyUnique = (array: (string | undefined)[]) => {
    return array.reduce((unique: (string | undefined)[], item) => unique?.includes(item) ? unique : [...unique, item], []);
}

export const removeEmptyFields = (list: IDynamicCardTileList) => {
  return Object.keys(list.structure.columns).sort((a,b) => list.structure.columns[a].fieldSequence - list.structure.columns[b].fieldSequence).reduce((object, key) => {
    if (key.includes('empty') && Object.keys(list.structure.columns).splice(Object.keys(list.structure.columns).indexOf('empty'), Object.keys(list.structure.columns).length).every((fieldName) => fieldName.includes('empty'))) {
        delete list.structure.columns[key]
    } else {
        object[key] = list.structure.columns[key]
    }
    return object
  }, {});
}

export const addMissingFields = (list: IDynamicCardTileList) => {

  if(Object.keys(list.structure.columns).length < 8 ) {
  
    const diff = 8 - Object.keys(list.structure.columns).length;

     const missingFields = Array.from(Array(diff).keys()).reduce((obj, key) => {
        const emptyFiled = { ...emptyField };
        ((a: { allowedProperties?: string[] }) => { delete a.allowedProperties })(emptyFiled)

        const styleProperties = {
          backgroundColor: "None",
          bold: "bold",
          color: "black",
          fontSize: 15
        }

        if(key === 0) {
          obj['empty'] = {...emptyFiled, ...styleProperties, fieldSequence: 8 - diff+1 } 
        } else {
          obj[`empty${Math.floor(Math.random() * 1000)}`] = {...emptyFiled, ...styleProperties, fieldSequence: 8 - key+1}
        }
        return obj;
    }, {});
    
    const updatedList = {...list, structure: {columns: {...list.structure.columns, ...missingFields}}}
    return updatedList;
  } else {
    return list;
  }
}