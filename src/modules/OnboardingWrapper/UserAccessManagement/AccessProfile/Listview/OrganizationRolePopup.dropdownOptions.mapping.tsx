import store from '../../../../../utils/redux/store';
import apiMappings from '../../../../../utils/apiMapping';
import axios from '../../../../../utils/axios';

const ORGANIZATIONROLE_DROPDOWNOPTION_MAPPING= {
    persona: async (dynamicLabels: Record<string, string>) => {
        console.log(dynamicLabels)
        let personaList = store.getState().settings.organizationRole.listView.personaList
        if (personaList?.length === 0) {
            const { data } = await axios.get(apiMappings.organizationRole.listView.persona, {
                url: apiMappings.organizationRole.listView.persona,
                data: {},
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            })
  
            personaList = data.map((persona: any) => ({
                label: persona?.clientRefMasterDesc,
                value: persona?.clientRefMasterCd,
                id: persona?.id,
                title: persona?.name
            }))
  
        }
  
        if (personaList && personaList?.length > 0) {
            return personaList
        } else {
            return []
        }
      },
    orgRoleLandingPage: async ()=>{
        let landingPageList = store.getState().settings.organizationRole.listView.landingPageList
        if (landingPageList?.length === 0) {
            const userAccessInfo: string = localStorage.getItem('userAccessInfo') !== null && JSON.parse(localStorage.getItem('userAccessInfo') || '')
            const { data } = await axios.get(apiMappings.organizationRole.listView.orgRoleLandingPage+userAccessInfo['modelType'], {
                url: apiMappings.organizationRole.listView.orgRoleLandingPage+userAccessInfo['modelType'],
                data: {},
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: false
            })
  
            landingPageList = data.map((landingPage: any) => ({
                label: landingPage?.name,
                value: landingPage?.clientRefMasterCd,
                id: landingPage?.id,
                title: landingPage?.name
            }))
  
        }
        if (landingPageList && landingPageList?.length > 0) {
            return landingPageList
        } else {
            return []
        }
    },
    activeFl: async (dynamicLabels: Record<string, string>) => {
        return [
          { value: 'Y', label: dynamicLabels.active },
          { value: 'N', label: dynamicLabels.inactive }
        ]
      }
}

export default ORGANIZATIONROLE_DROPDOWNOPTION_MAPPING