// Create a random ID
export const generateUEID = () => {
  const first: number = (Math.random() * 46656) | 0
  const second: number = (Math.random() * 46656) | 0
  return (
    ('000' + first?.toString(36)).slice(-3) +
    ('000' + second?.toString(36)).slice(-3)
  )
}

export const getObject = (
  value: string,
  array: any[],
  comparingString: string
) => {
  if (array && value) {
    const index = array?.findIndex((x: any) => x[comparingString] === value)
    return index !== -1 ? array[index] : false
  }
  return ' '
}

export const createNewArray = (
  arr: any[],
  keysValueToBeAdded: string,
  excludingValue?: string
) => {
  const a = arr.map((f) => {
    return f[keysValueToBeAdded] !== excludingValue ? f[keysValueToBeAdded] : ''
  })
  return a
}

export const arrayEquals = (a: any, b: any) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

export const removeObjectFromArray = (
  comparingValue: string,
  array: any[],
  comparingKey: string
) => {
  const temp = [...array]
  const index = temp.findIndex((x: any) => x[comparingKey] === comparingValue)
  temp.splice(index, 1)
  return temp
}

export const isElementPresent = (value: string, arr: string[]) => {
  return arr.indexOf(value) !== -1
}

export const createSavedFiterDropdown = (chipsArray: any[]) => {
  const tempArray: any[] = chipsArray.map((c) => {
    return {
      id: c.id,
      label: c.label,
      condition: c.condition,
      value: c.id
    }
  })
  return tempArray
}

export const getString = (value: any) => {
  if (Array.isArray(value)) {
    let temp = ''
    temp += value.map((m) => m.value)
    return temp
  } else if (typeof value === 'object') {
    return value.value
  } else {
    return value?.toString()
  }
}

export const PrepareFilterData = (
  filterConditions: any,
  HSetColumnData: any,
  type?: string,
  chips?: any[]
) => {
  const fConditions: any[] = []
  
  filterConditions?.forEach((f: any) => {
    const operationObject =
      f.operationalOptions?.options !== null &&
      typeof f?.operationalOptions?.value !== 'object'
        ? getObject(
            f?.operationalOptions?.value,
            f?.operationalOptions?.options,
            'labelKey'
          )
        : f?.operationalOptions?.value

    // convert date, multiselect and dropdown object to appropriate format
    let FilterData: any
    let filterDataLabel: any
    if (typeof f?.thirdElement?.value === 'string') {
      FilterData = f?.thirdElement?.value
      filterDataLabel = f?.thirdElement?.label
    } else if (f.fieldType === 'date' || f.fieldType === 'calendar') {
      FilterData =
        f?.thirdElement?.value[0]?.getTime() +
        ',' +
        f?.thirdElement?.value[1]?.getTime()
    } else if (Array.isArray(f?.thirdElement?.value)) {
      f?.thirdElement?.value?.map(
        (m: any) =>{
          FilterData = FilterData ? FilterData + ',' + m.value : m.value
          filterDataLabel = filterDataLabel ? filterDataLabel + ',' + m.label : m.label
        }
      )
    } else if (f.fieldType === 'select' || f.fieldType === 'dropdown') {
      FilterData =
        typeof f?.thirdElement?.value === 'object'
          ? f?.thirdElement?.value?.value
          : f?.thirdElement?.value
        filterDataLabel = typeof f?.thirdElement?.label === 'object'
          ? f?.thirdElement?.label.label : f?.thirdElement?.label
    } else {
      FilterData = f?.thirdElement?.value
      filterDataLabel = f?.thirdElement?.label
    }

    if (f?.dropdownOptions !== 'savedFilters') {
      fConditions.push({
        fieldId: f?.dropdownOptions,
        operationSymbol: operationObject?.operationSymbol,
        operationLabelKey: operationObject?.labelKey,
        fieldLabelKey:
          operationObject?.labelKey === 'savedFilterIs'
            ? 'savedFilterIs'
            : HSetColumnData[f?.dropdownOptions]?.label,
        labelValue: operationObject?.label,
        filterData: FilterData,
        filterDataLabel: filterDataLabel
      })
    } else {
      // debugger
      const filters = chips?.find((chip: any) => chip?.id === FilterData?.id)

      if (filters) {
        filters?.filters?.forEach((f: any) => {
          fConditions.push(f)
        })
      }
    }
  })

  if (type === 'apply') {
    return fConditions
  }
  return fConditions
}

/*********************************************************/
// handle Validations
/*********************************************************/
export const validateFiltersData = (
  chipsArray: any,
  filterData: any,
  filterConditions: any
) => {
  // check whether all conditions are nonempty
  let flag: boolean = filterConditions?.every((m: any) => {
    return m.dropdownOptions !== '' &&
      m?.operationalOptions.value !== '' &&
      m?.thirdElement.type !== '' &&
      m?.thirdElement.type === 'none'
      ? true
      : m?.thirdElement.value !== ''
  })

  let message: string = !flag ? 'Incomplete Information' : ''
  // check whether filterName is not empty
  flag = flag && filterData?.filterName?.length !== 0
  message =
    filterData?.filterName?.length === 0 ? 'Incomplete Information' : message
  // check whether filterName does not repeat for new filters
  if (flag && filterData.id === '') {
    flag =
      flag && chipsArray?.every((m: any) => m.label !== filterData.filterName)
    message = `Filter with the name '${filterData.filterName}' already exists`
  }
  if (filterConditions && filterConditions?.length < 1) {
    return {
      flag: false,
      message: 'Incomplete Information'
    }
  }
  return { flag: flag, message: message }
}

export const validateFilterData = (chipsArray: any, filterData: any) => {
  let flag = filterData?.filterName?.length !== 0
  let message: string = !flag ? 'Incomplete Information' : ''
  // check whether filterName is not empty
  message =
    filterData?.filterName?.length === 0 ? 'Incomplete Information' : message
  // check whether filterName does not repeat for new filters
  if (flag && filterData.id === '') {
    flag =
      flag &&
      chipsArray?.every((m: any) => m.filterName !== filterData.filterName)
    message = !flag
      ? `Filter with the name '${filterData.filterName}' already exists`
      : ''
  }
  return { flag: flag, message: message }
}

/*********************************************************/
// handle Filter conditions validation
/*********************************************************/

export const validateFilterConditions = (filterConditions: any) => {
  // check whether all conditions are nonempty
  const flag: boolean = filterConditions?.every((m: any) => {
    return m.dropdownOptions !== '' &&
      m?.operationalOptions.value !== '' &&
      m?.thirdElement.type !== '' &&
      m?.thirdElement.type === 'none'
      ? true
      : m?.thirdElement.value !== ''
  })

  const message: string = !flag ? 'Incomplete Information' : ''
  // // check whether filterName is not empty
  // flag = flag && filterData?.filterName?.length !== 0
  // message =
  //   filterData?.filterName?.length === 0 ? 'Incomplete Information' : message
  // // check whether filterName does not repeat for new filters
  // if (flag && filterData.id === '') {
  //   flag =
  //     flag && chipsArray?.every((m: any) => m.label !== filterData.filterName)
  //   message = `Filter with the name '${filterData.filterName}' already exists`
  // }
  if (filterConditions && filterConditions?.length < 1) {
    return {
      flag: false,
      message: 'Incomplete Information'
    }
  }
  return { flag: flag, message: message }
}

/*********************************************************/
// handle SORT Data validation
/*********************************************************/

export const validateHalfSortCriteria = (SortCriteriaData: any) => {
  const sortflag =
    SortCriteriaData.fieldId ||
    SortCriteriaData.fieldLabelKey ||
    SortCriteriaData.operationSymbol ||
    SortCriteriaData.operationLabelKey
  return !!sortflag
}

export const validateFullSortCriteria = (SortCriteriaData: any) => {
  const sortflag =
    SortCriteriaData.fieldId &&
    SortCriteriaData.fieldLabelKey &&
    SortCriteriaData.operationSymbol &&
    SortCriteriaData.operationLabelKey
  return !!sortflag
}

export const validateSort = (sort: any) => {
  const sortFlag =
    sort && sort.columnName && sort?.sortOrder?.label && sort?.sortOrder?.value
  return !!sortFlag
}

export const passValidationTest = (
  filterData: any,
  filterConditions: any,
  chipsArray: any,
  HSetColumnStructure: any
) => {
  const filters = PrepareFilterData(filterConditions, HSetColumnStructure)
  const columnName =
    typeof filterData?.sortable?.columnName === 'object'
      ? filterData?.sortable?.columnName.id
      : filterData?.sortable?.columnName
  const temp: any = {
    id: filterData.id,
    filterName: filterData.filterName || ' ',
    filters: filters,
    isFavourite: filterData.isFavourite,
    favouriteSections: filterData.favouriteSections,
    operationLogic: filterData?.filterMasterCondition,
    sortCriteria: [
      {
        fieldId: columnName,
        fieldLabelKey: HSetColumnStructure[columnName]?.label,
        operationLabelKey: filterData?.sortable?.sortOrder.value,
        operationSymbol: filterData?.sortable?.sortOrder.value
      }
    ]
  }

  const sortFlag = validateFullSortCriteria(temp?.sortCriteria[0])

  if (validateHalfSortCriteria(temp?.sortCriteria[0]) && !sortFlag) {
    return { flag: false, message: 'Incomplete Information' }
  } else {
    !sortFlag && delete temp?.sortCriteria
    const { flag, message } = validateFilterData(chipsArray, filterData)
    const { flag: Cflag, message: Cmessage } = validateFilterConditions(
      filterConditions
    )
    return {
      flag: flag,
      conditionFlag: Cflag,
      message: message,
      Conditionmessage: Cmessage
    }
  }
}
