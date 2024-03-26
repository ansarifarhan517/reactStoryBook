import { sendGA } from '../../../utils/ga';
import { getQueryParams } from '../../../utils/hybridRouting';
import { SortingRule } from 'react-table'

export const handleActionBarButtonClick = (id: string,
    setShowDeletionConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
    switch (id) {
        case 'delete':
          sendGA('ListView ActionBar','Territory List - Button Click - Delete')
            setShowDeletionConfirmation(true);
            break;
        case 'update':
          sendGA('ListView ActionBar','Territory List - Button Click - Update')
            setEditMode(true);
            break;
    }
}

// HANDLE QUERY PARAMS FOR HISTORY RENTENTION
export const handleQueryParams = (setSort: React.Dispatch<React.SetStateAction<SortingRule<object>[] | undefined>>, setFilters: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>) => {
    const filterData: Record<string, string> = getQueryParams();
    /** Initialize Sort Options from Query Params */
    let sortBy = filterData?.sortBy?.split('#@#')
    let sortOrder = filterData?.sortOrder?.split('#@#')

    let sort: SortingRule<object>[] = [];
    sortBy?.forEach((element: string, index: number) => {
      let temp = {
        id: element,
        desc: sortOrder[index] === 'DESC'
      }
      sort.push(temp)
    });
    sort && setSort(sort)

    /** Initialize Filter from Query Params */
    let searchBy = filterData?.searchBy?.split('#@#');
    let searchText = filterData?.searchText?.split('#@#');

    let temp: Record<string, string> = {}
    searchBy && searchText &&
      searchBy?.forEach((s, index) => {
        temp[s] = searchText[index]
      })
    setFilters(temp)
}