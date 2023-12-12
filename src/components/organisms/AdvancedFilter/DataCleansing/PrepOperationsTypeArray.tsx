// import { tFieldTypeObject } from 'ui-library'

const PrepOperationsTypeArray = (arr: any) => {
  let obj: any

  arr &&
    Object.keys(arr).forEach((key: string) => {
      const b = arr[key].map((element: any) => ({
        label: element.labelValue,
        labelKey: element.labelKey,
        value: element.labelValue,
        operation: element.operation,
        operationSymbol: element.operationSymbol
      }))

      obj = obj
        ? {
            ...obj,
            [key]: b
          }
        : { [key]: b }
    })
  if (obj) {
    obj.savedFilterIs = {
      operation: 'is',
      operationSymbol: '=',
      label: '=',
      value: 'savedFilterIs',
      labelKey: 'savedFilterIs'
    }
  }

  return obj
}

export default PrepOperationsTypeArray
