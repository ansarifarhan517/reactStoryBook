import React from "react";
import { Box, TextInput, Toggle } from "ui-library";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { IAccountNames, IDropDownValue, ITriggerEvents } from "../CustomForms.models";
import { Divider } from "../CustomFormsStyledComponents";

interface ITriggerEventsFieldsProps {
    triggerEventsData: ITriggerEvents[]
    sendGA: Function
    handleMandatoryChange: Function
    handleActiveChange: Function
    subClients: IAccountNames[]

}
const TriggerEventsFields = (props: ITriggerEventsFieldsProps) => {
      /** General Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms);
    const serviceTypes = useTypedSelector((state) => state.customForms.listView.lookup.serviceTypes);
    const orderStates = useTypedSelector((state) => state.customForms.listView.lookup.orderStates);
    const { triggerEventsData, sendGA, handleMandatoryChange, handleActiveChange, subClients } = props;
    return( 
        <div>
        {triggerEventsData && triggerEventsData.length > 0 && triggerEventsData.map((item, index) => {
          return (
            <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Box display="flex">
              <div className='triggerIndex'><div className='triggerEventCount'>{index + 1}</div></div>
                <Box className='triggerElement' title={item['orderType']} horizontalSpacing='10px'>
                  <TextInput
                    id='orderType'
                    label={dynamicLabels.orderType}
                    value={item['orderType']}
                    fullWidth={false}
                    disabled={true}
                  />
                </Box>
                
                <Box className='triggerElement' title={item?.['orderStates']?.length > 0 ? item['orderStates'].map((orderState: string) => orderStates?.find(({clientRefMasterCd}: IDropDownValue) => clientRefMasterCd === orderState)?.name).toString() : ''} horizontalSpacing='10px'>
                  <TextInput
                    id='orderState'
                    label={dynamicLabels.orderState}
                    value={item?.['orderStates']?.length > 0 ? item['orderStates'].map((orderState: string) => orderStates?.find(({clientRefMasterCd}: IDropDownValue) => clientRefMasterCd === orderState)?.name).toString() : ''}
                    fullWidth={false}
                    disabled={true}
                  />
                </Box>
                <Box className='triggerElement' title={item['orderLocation']} horizontalSpacing='10px'>
                  <TextInput
                    id='orderLocation'
                    label={dynamicLabels.orderLocation}
                    value={item['orderLocation']}
                    fullWidth={false}
                    disabled={true}
                  />
                </Box>
               
              
                <Box className='triggerElement' title={item['triggerName']} horizontalSpacing='10px'>
                  <TextInput
                    label={dynamicLabels.triggerName}
                    value={item['triggerName']}
                    fullWidth={false}
                    disabled={true}
                  />
                </Box>
                <Box className='triggerToggle' horizontalSpacing='10px'>
                  <Toggle
                    checked={item['isMandatory']}
                    label={dynamicLabels.mandatory}
                    style={{ fontSize: '14px' }}
                    value={item['isMandatory'] ? "Y" : "N"}
                    onChange={() => {
                      sendGA('ListView Mandatory Action', `Custom Forms Toggle Change - Status - ` + item['isMandatory'] ? 'Mandatory' : 'NonMandatory')
                      handleMandatoryChange(item)
                    }}
                  />
                </Box>
                <Box className='triggerToggle' horizontalSpacing='10px'>
                  <Toggle
                    checked={item['isActiveFl']}
                    label={dynamicLabels.active}
                    style={{ fontSize: '14px' }}
                    onChange={() => {
                      sendGA('ListView Mandatory Action', `Custom Forms Toggle Change - Status - ` + item['isActiveFl'] ? 'Active' : 'Inactive')
                      handleActiveChange(item)
                    }}
                  />
                </Box>
              </Box>
              <Box display="flex" style={{width: '54%'}}>
              <div className='triggerIndex' style={{width: '15%'}}></div>
                <Box className='triggerElement' title={item?.['subClientIds']?.length > 0 ? item['subClientIds'].map((subClientId: number) => subClients?.find((accountName: IAccountNames) => accountName.id === subClientId)?.name).toString() : ''} horizontalSpacing='10px'>
                  <TextInput
                    label={dynamicLabels.shipper_s}
                    value={item?.['subClientIds']?.length > 0 ? item['subClientIds'].map((subClientId: number) => subClients?.find((accountName: IAccountNames) => accountName.id === subClientId)?.name) : ''}
                    fullWidth={false}
                    disabled={true}
                  />
                </Box>
                
                <Box className='triggerElement' title={item?.['serviceTypes']?.length > 0 ? item['serviceTypes'].map((serviceType: string) => serviceTypes?.find(({clientRefMasterCd}: IDropDownValue) => clientRefMasterCd === serviceType)?.name).toString() : ''} horizontalSpacing='10px'>
                  <TextInput
                    label={dynamicLabels.serviceType}
                    disabled={true}
                    fullWidth={false}
                    value={item?.['serviceTypes']?.length > 0 ? item['serviceTypes'].map((serviceType: string) => serviceTypes?.find(({clientRefMasterCd}: IDropDownValue) => clientRefMasterCd === serviceType)?.name).toString() : ''}
                  />
                </Box>
                <Box className='triggerElement' title={item['taskTypes'].toString()} horizontalSpacing='10px'>
                  <TextInput
                    label={dynamicLabels.skillSet}
                    disabled={true}
                    fullWidth={false}
                    value={item['taskTypes']}
                  />
                </Box>
              </Box>
            </div>
            {index < triggerEventsData.length - 1 && <Divider/>}
            </>
          )
        })
        }
      </div>
    )
}

export default TriggerEventsFields;