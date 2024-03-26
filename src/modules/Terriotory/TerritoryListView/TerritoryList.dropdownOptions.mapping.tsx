import apiMappings from "../../../utils/apiMapping"
import axios from "../../../utils/axios"
import store from "../../../utils/redux/store"
import { ICategoryData } from "./TerritoryList.models"

const TERRITORY_DROPDOWN_FILTER_OPTIONS_MAPPING = {
    geofenceCategory : async () => {
      let categoryList = store.getState().territory.listView.categoryList
      if (categoryList.length === 0) {
          const { data: categoryData } = await axios.get(apiMappings.geofenceMaster.listView.getCategoryList)
          categoryList = categoryData?.map((obj: ICategoryData) => {
              return {
                  label: obj?.name,
                  value: obj?.name,
                  id: obj?.id,
                  title: obj?.name
              }
          })

      }
      if (categoryList.length > 0) {
          return categoryList
      } else {
          return []
      }
    },
    isActiveFl: (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.active},
            {value: 'N', label: dynamicLabels.inactive}
        ]
    }
}

export default TERRITORY_DROPDOWN_FILTER_OPTIONS_MAPPING