import React, { useEffect } from 'react'
import { WebHookHistoryWrapperStyled, WebHookLowerSection, WebHookDetailsStyled, WebHookHistoryHeading, DetailBox,WebHookButtonSection } from './styled'
import { Card , InputLabel, IconButton} from 'ui-library'
import EditorArea from './EditorArea'
import AttemptSection from './AttemptSection'
import axios from '../../../../utils/axios'
import apiMappings from '../../../../utils/apiMapping'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'
import { sendGA } from '../../../../utils/ga'


const WebHookHistoryPage = ({data, handleCancel, isWebhookValid}:any) => {
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const eventTypeOptions =  useTypedSelector(state => state.settings_webhookHistory.listView.eventTypes['ALL'])
    const status = useTypedSelector(state => state.settings_webhookHistory.listView.HashMapStatus)
    const clientNameFromSubClients= JSON.parse(localStorage.getItem("userAccessInfo") || "{}")["subClients"][0]['name']
    const clientName = JSON.parse(localStorage.getItem("userAccessInfo") || "{}")?.clientName ? JSON.parse(localStorage.getItem("userAccessInfo") || "{}").clientName : clientNameFromSubClients ? clientNameFromSubClients : '';
    const [details, setDetails]= React.useState({
        history: data.history,
        attempts: data.attempts
    })

    useEffect(() => {
        if(isWebhookValid){
        setDetails({
            history: data.history,
            attempts: data.attempts
        })
    }else{
        const {
            history: {
              clientId,
              createdDate,
              data: historyData,
              entityId,
              entityName,
              geofenceId,
              module,
              notificationType,
              responseCode,
              responseMessage,
              status,
              statusHolder,
              url
            }
          } = data;
        
          // Create 'attemptsObject' using the destructured values
          const attemptsObject = {
            clientId,
            createdDate,
            data: historyData,
            entityId,
            entityName,
            eventDataList: [{
              clientId,
              createdDate,
              data: historyData,
              entityName,
              geofenceId,
              module,
              notificationType,
              responseCode,
              responseMessage,
              status,
              statusHolder,
              url
            }]
          };
        setDetails({
            history: data.history,
            attempts: attemptsObject
        }) 
        }
    },[data])


    const handleRetry = async () => {
        sendGA('ListView ActionBar','WebhookActivity - Retry-record')
        const isMongoId = data.history?.mongoId 
        const param = isMongoId ? {
            ...data.history,
        } : {
            ...data.history,
            mongoId: data.history.id
        }
  
        try {
            const { data: data } = await axios.post(apiMappings.webHookListView.listView.retry , [{...param}])
            if(data?.status === 200) {
                handleCancel(true)
               
            }
        } catch (errorMessage) {
            console.log('Failed to try webhook ', errorMessage)
        }
    }
    const d2 = moment.utc(details?.history?.updatedDate).tz(clientProperties?.TIMEZONE?.propertyValue)
    const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'
    const eventTypeName = React.useMemo(() => eventTypeOptions?.find((c:any) => {
    const module = c.clientRefMasterType?.replace('EVENT_TYPE_','')
       return c.clientRefMasterCd === details?.history?.notificationType && module === details?.history?.module?.toUpperCase()
    }),[details?.history?.notificationType,details?.history?.module])
    
    const isJson = (responseBody:any) => {
         try { 
             JSON.parse(responseBody); 
        } catch (e) { 
            return false; 
        } 
        return true; 
        }
    
    
    return (
    <Card style={{padding: '15px'}}>
        <WebHookHistoryWrapperStyled>
            <WebHookHistoryHeading>Webhook Details</WebHookHistoryHeading>
               
            <WebHookDetailsStyled container >  
                <DetailBox item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.ID}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={details?.history?.entityName}>{details?.history?.entityName}</TextOverflowEllipsis>
                    </InputLabel>
                </DetailBox>
                <DetailBox  item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.eventType}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={eventTypeName?.clientRefMasterDesc || details?.history?.notificationType}>{eventTypeName?.clientRefMasterDesc || details?.history?.notificationType}</TextOverflowEllipsis>                    
                    </InputLabel>
                </DetailBox>
                <DetailBox  item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.eventDate}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={d2.format(format1)}>{d2.format(format1)}</TextOverflowEllipsis>
                    </InputLabel>
                </DetailBox>
                <DetailBox  item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.status}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={status?.[details?.history?.status]?.clientRefMasterDesc || details?.history?.status}> {status?.[details?.history?.status]?.clientRefMasterDesc || details?.history?.status}</TextOverflowEllipsis>
                    </InputLabel>   
                </DetailBox>
                <DetailBox  item lg={3}>
                    {details?.history?.hasOwnProperty('branchName') ? 
                        <InputLabel bold>
                            {dynamicLabels.webhookBranch}
                        </InputLabel> : details?.history?.hasOwnProperty('subClientName') 
                        ?
                        <InputLabel bold>
                            {dynamicLabels.ShipperName}
                        </InputLabel> 
                        : !details?.history?.hasOwnProperty('subClientName') &&  !details?.history?.hasOwnProperty('branchName') 
                        ?  <InputLabel bold>
                           {dynamicLabels.organizationName}
                            </InputLabel> : ""
                    }
                        <InputLabel color='grey'>
                            <TextOverflowEllipsis title={details?.history?.hasOwnProperty('branchName') ? details?.history?.branchName : details?.history?.hasOwnProperty('subClientName') ? details?.history?.subClientName : !details?.history?.hasOwnProperty('subClientName') &&  !details?.history?.hasOwnProperty('branchName') ? clientName : ''}>{details?.history?.hasOwnProperty('branchName') ? details?.history?.branchName : details?.history?.hasOwnProperty('subClientName') ? details?.history?.subClientName : !details?.history?.hasOwnProperty('subClientName') &&  !details?.history?.hasOwnProperty('branchName') ? clientName : ''}</TextOverflowEllipsis>
                        </InputLabel>
                </DetailBox>
                <DetailBox item lg={3}>
                        <InputLabel bold>
                    {dynamicLabels.responseCode}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={details?.history?.responseCode}>{details?.history?.responseCode}</TextOverflowEllipsis>
                    </InputLabel>
                </DetailBox>
                <DetailBox  item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.responseMessage}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={details?.history?.responseMessage}>{details?.history?.responseMessage}</TextOverflowEllipsis>
                    </InputLabel>
                </DetailBox>
                <DetailBox  item lg={3}>
                    <InputLabel bold>
                        {dynamicLabels.url}
                    </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={details?.history?.url}>{details?.history?.url}</TextOverflowEllipsis>
                    </InputLabel>
                </DetailBox>
                </WebHookDetailsStyled>
            
        </WebHookHistoryWrapperStyled>
        <WebHookLowerSection>
            <EditorArea responseBody={isJson(details?.history?.data) ? JSON.parse(details?.history?.data) : details?.history?.data} label={dynamicLabels.requestBody}/>
                {/* attempts section*/}
            <AttemptSection attemptsObject={details?.attempts}/>
        </WebHookLowerSection>
        <WebHookButtonSection>
            <IconButton
                onClick={handleRetry}
                primary={true}
                disabled={false}
                intent='default'
                iconVariant='reload'
                children='Retry'
                iconSize='sm'
            />

            <IconButton
                onClick={()=> handleCancel(false)}
                intent='default'
                iconVariant='close'
                children='Cancel'
                iconSize='sm'
            />
        </WebHookButtonSection>
    </Card>
   
    )

}

export default WebHookHistoryPage