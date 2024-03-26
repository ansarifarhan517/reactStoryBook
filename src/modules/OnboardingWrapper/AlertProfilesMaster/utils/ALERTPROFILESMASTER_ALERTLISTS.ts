
import apiMappings from '../../../../utils/apiMapping'
import axios from '../../../../utils/axios'
import store from '../../../../utils/redux/store'
import { IAlertCategoryLookupResponse } from '../AlertProfilesMaster.models'


const ALERTPROFILESMASTER_ALERTLISTS = {
  alertCategory: async () => {
    let statusList = store.getState().settings.alertProfilesMaster.AlertCategoryLookup;
    if(statusList.length === 0){
    const { data } = await axios.get<IAlertCategoryLookupResponse[]>(apiMappings.settings.alertProfiles.lookups.alertCategories)
    const dropdownOptions = data?.map((category) => ({ value: category.clientRefMasterDesc, label: category.clientRefMasterDesc }))
    return dropdownOptions;
    }else{
      return statusList

    }
  },
  isAlertActive: async (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.YES && dynamicLabels.NO) {
      return [
        { value: 'Y', label: dynamicLabels.YES, title: dynamicLabels.YES },
        { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
      ]
    } else {
      return []
    }
  },
  isEmailActive: async (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.YES && dynamicLabels.NO) {
      return [
        { value: 'Y', label: dynamicLabels.YES, title: dynamicLabels.YES },
        { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
      ]
    } else {
      return []
    }
  },
  isSmsActive: async (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.YES && dynamicLabels.NO) {
      return [
        { value: 'Y', label: dynamicLabels.YES, title: dynamicLabels.YES },
        { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
      ]
    } else {
      return []
    }
  },
  isIvrActive: async (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.YES && dynamicLabels.NO) {
      return [
        { value: 'Y', label: dynamicLabels.YES, title: dynamicLabels.YES },
        { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
      ]
    } else {
      return []
    }
  },
  isWhatsAppActive:  async (dynamicLabels: Record<string, string>) => {
    if (dynamicLabels.YES && dynamicLabels.NO) {
      return [
        { value: 'Y', label: dynamicLabels.YES, title: dynamicLabels.YES },
        { value: 'N', label: dynamicLabels.NO, title: dynamicLabels.NO }
      ]
    } else {
      return []
    }
  }
}

export default ALERTPROFILESMASTER_ALERTLISTS