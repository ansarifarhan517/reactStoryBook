import apiMappings from "../../../../../utils/apiMapping"
import axios from "../../../../../utils/axios"
import store from "../../../../../utils/redux/store"
// import { ICategoryData } from "./.models"

const ITEM_CONFIGURATION_FILTER_OPTIONS_MAPPING = {
    temperatureCategoryCd : async () => {
      let temperatureCategory = store.getState().itemConfiguration.listView.temperatureCategory
      if (!temperatureCategory || temperatureCategory?.length === 0) {
          const { data: payload } = await axios.get(apiMappings.common.lookup.temperatureCategory)
          temperatureCategory = payload?.map((obj: any) => {
              return {
                  label: obj?.name,
                  value: obj?.name,
                  id: obj?.id,
                  title: obj?.name
              }
          })

      }
      if (temperatureCategory && temperatureCategory?.length > 0) {
          return temperatureCategory
      } else {
          return []
      }
    },
    isActiveFl: (dynamicLabels: Record<string, string>) => {
        return [
            {value: 'Y', label: dynamicLabels.active},
            {value: 'N', label: dynamicLabels.inactive}
        ]
    },
    
}

export default ITEM_CONFIGURATION_FILTER_OPTIONS_MAPPING