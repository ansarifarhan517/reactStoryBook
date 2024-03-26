import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import store from '../../../utils/redux/store';

const CUSTOM_FIELDS_DROPDOWN_MAPPING = {
    
        isActiveFl: async (dynamicLabels: Record<string, string>) => {
            return [
              { value: 'Y', label: dynamicLabels.active },
              { value: 'N', label: dynamicLabels.inactive }
            ]
          
        },

        attachedWithModules : async () => {
          let moduleArr: any = [];
            moduleArr = store.getState().customFields.listView.modulesList
            if (moduleArr.length === 0) {
            const { data } = await axios.get(apiMappings.customFields.listView.moduleList, {
                url: apiMappings.customFields.listView.moduleList,
                data: {},
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            })
            moduleArr = data.map((fieldData: any) => ({
                        label: fieldData?.clientRefMasterDesc,
                        value: fieldData?.clientRefMasterCd
                        }))
            }
          if (moduleArr && moduleArr?.length > 0) {
              return moduleArr
          } else {
              return []
          }
        },
        customFieldType: async () => {
              let fieldTypeArr: any = [];
              fieldTypeArr = store.getState().customFields.listView.fieldTypeList
              if (fieldTypeArr.length === 0) {
              const { data } = await axios.get(apiMappings.customFields.listView.customFieldTypes, {
                  url: apiMappings.customFields.listView.customFieldTypes,
                  data: {},
                  params: {},
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  withCredentials: false
              })
              fieldTypeArr = data.map((fieldData: any) => ({
                label: fieldData.clientRefMasterDesc,
                value: fieldData.clientRefMasterCd
              }))
            }
          if (fieldTypeArr && fieldTypeArr?.length > 0) {          
              return fieldTypeArr
          } else {
              return []
          }
        },
        
}

export default CUSTOM_FIELDS_DROPDOWN_MAPPING