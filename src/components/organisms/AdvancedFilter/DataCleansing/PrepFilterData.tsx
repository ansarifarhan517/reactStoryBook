import { IFilterData } from '../interfaces'

const PrepFilterData = (
  filterData: IFilterData[],
  appliedFilterId: string | undefined
) => {
  return filterData.map((f: IFilterData) => {
    let filters: any[] | undefined = f?.filters
    if (f?.advanceFilterTags) {
      const newFilter = f?.advanceFilterTags?.map((af: any) => {
        return {
          fieldId: 'savedFilters',
          fieldLabelKey: 'saved Filters',
          filterData: {
            condition: af.id,
            id: af.id,
            label: af.filterName,
            value: af.filterName
          },
          labelValue: '=',
          operationLabelKey: '=',
          operationSymbol: '='
        }
      })
      // console.log(data[index]['filters'], filters)
      filters = f?.filters ? [...f?.filters, ...newFilter] : [...newFilter]
    }
    return {
      id: f.id,
      label: f.filterName,
      condition: f?.operationLogic === 'AND' ? 'ALL' : 'ANY',
      dropdownData: filters?.map((conditions: any) => {
        return {
          customField: false,
          columnId: conditions.fieldId,
          columnName: conditions.fieldLabelKey,
          operationType: conditions.operationLabelKey,
          value: conditions.filterData,
          label: conditions.filterDataLabel
        }
      }),
      advanceFilterTagReferenceIds: f?.advanceFilterTagReferenceIds,
      isFavourite: f?.isFavourite,
      favouriteSections: f?.favouriteSections,
      filterApplied: appliedFilterId ? f.id === appliedFilterId : false,
      // filterSortable: f?.sortCriteria && f?.sortCriteria?.length !== 0,
      sortCriteria: f?.sortCriteria && {
        fieldId: f?.sortCriteria[0]?.fieldId,
        fieldLabelKey: f?.sortCriteria[0]?.fieldLabelKey,
        operationSymbol: f?.sortCriteria[0]?.operationSymbol,
        operationLabelKey: f?.sortCriteria[0]?.operationLabelKey
      }
    }
  })
}

export default PrepFilterData
