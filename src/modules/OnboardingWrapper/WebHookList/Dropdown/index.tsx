// import React from 'react'
import apiMappings from '../../../../utils/apiMapping';
import axios from '../../../../utils/axios';
import store from '../../../../utils/redux/store';

const WEBHOOK_DROPDOWN_MAPPING = {

        status : async () => {
          let status = store.getState().settings_webhookHistory.listView.status
          if (status?.length === 0) {
              const { data } = await axios.get(apiMappings.webHookListView.listView.status )
    
              status = data.map((status: any) => ({
                    id: status?.id,
                  label: status?.name,
                  value: status?.clientRefMasterCd,
                  title: status?.name,
                  ...status
              }))
    
          }
    
          if (status && status?.length > 0) {
              return status
          } else {
              return []
          }
        },


        responseCode : async () => {
          let responseCode = store.getState().settings_webhookHistory.listView.responseCode
          if (responseCode?.length === 0) {
              const { data } = await axios.get(apiMappings.webHookListView.listView.responseCode, {
                  url: apiMappings.webHookListView.listView.responseCode,
                  data: {},
                  params: {},
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  withCredentials: false
              })
    
              responseCode = data.map((status: any) => ({
                  id: status?.id,
                  label: status?.name,
                  value: status?.clientRefMasterCd,
                  title: status?.name,
                  ...status
              }))
          }
    
          if (responseCode && responseCode?.length > 0) {
              return responseCode
          } else {
              return []
          }
        },

        notificationType : async () => {
            let eventType;
            let module = store.getState().settings_webhookHistory.listView.currentModule;
            let data = store.getState().settings_webhookHistory.listView.eventTypes[module]

            if (data?.length === 0) {
                const { data } = await axios.get(apiMappings.webHookListView.listView.eventType)
            
                eventType = data?.map((status: any) => ({
                    label: status?.name,
                    value: status?.id,
                    title: status?.clientRefMasterDesc,
                    ...status
                }))
                
            } else {
   
                eventType = data?.map((status: any) => ({
                    label: status?.name,
                    value: status?.id,
                    title: status?.clientRefMasterDesc,
                    ...status
                }))
                
            }

            if (eventType) {
                return eventType
            } else {
                return []
            }
          },
}

export default WEBHOOK_DROPDOWN_MAPPING