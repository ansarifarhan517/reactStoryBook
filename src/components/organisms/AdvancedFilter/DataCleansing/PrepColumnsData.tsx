import { tDropDownOptions } from '../interfaces'

const PrepColumnsData = (array: object) => {
  const columnStructure: tDropDownOptions[] = []
  const sortDropdown: tDropDownOptions[] = []
  let HSetColumnStructure: any

  Object.values(array).forEach((value) => {
    if (value.childLength && value.childLength !== 0) {
      Object.values(value.childNodes).forEach((v: any) => {
        const a = {
          id: v.id,
          label: value.label + v.label,
          value: v.labelKey,
          fieldType: v.fieldType?.toLowerCase()
        }
        v.searchable && columnStructure.push(a)
        v.sortable && sortDropdown.push(a)
        HSetColumnStructure = HSetColumnStructure
          ? {
              ...HSetColumnStructure,
              [v.id]: a
            }
          : { [v.id]: a }
      })
    } else {
      const a = {
        id: value.id,
        label: value.label,
        value: value.labelKey,
        fieldType: value.fieldType?.toLowerCase()
      }
      value.searchable && columnStructure.push(a)
      value.sortable && sortDropdown.push(a)
      HSetColumnStructure = HSetColumnStructure
        ? {
            ...HSetColumnStructure,
            [value.id]: a
          }
        : { [value.id]: a }
    }
  })

  // append saved Fiters Section
  const savedFilters = {
    id: 'savedFilters',
    label: 'saved Filters',
    value: 'savedFilterIs',
    fieldType: 'savedFilters'
  }

  HSetColumnStructure = {
    ...HSetColumnStructure,
    savedFilters
  }

  columnStructure.push(savedFilters)

  return [sortDropdown, columnStructure, HSetColumnStructure]
}

export default PrepColumnsData
