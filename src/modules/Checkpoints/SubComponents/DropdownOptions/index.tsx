import store from "../../../../utils/redux/store"

const CHECKPOINTS_DROPDOWN_MAPPING = {
       
    isActiveFl: async (dynamicLabels: Record<string, string>) => {
        if (dynamicLabels) {
          return [
            { value: 'Y', label: dynamicLabels.active },
            { value: 'N', label: dynamicLabels.inactive },
          ]
        } else {
          return []
        }
      },
      shapeType: async () => {
        return [
          { value: "CIRCLE", label: "CIRCLE" },
          { value: "POLYGON", label: "POLYGON" },
        ];
      },
    checkpointCategory :async () => {
      let categoryList = store.getState().checkpoints.listView.categoryList
      if(categoryList?.length >0){
        return categoryList
      }
      else{
        return[]
      }
    }
}



export default CHECKPOINTS_DROPDOWN_MAPPING


