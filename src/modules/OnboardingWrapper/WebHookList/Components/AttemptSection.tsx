import React, { useEffect } from 'react'
import { InputLabel, BreadCrumb } from 'ui-library'
import { DataWrapper, DetailBox, AttemptsSectionWrapper, BreadCrumbWrapper} from './styled'
import useClientProperties from '../../../common/ClientProperties/useClientProperties'
import moment from 'moment-timezone'
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import { IAttempts} from '../WebHookListView.models'


const AttemptSection = ({ attemptsObject }:any) => {
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)
    const status = useTypedSelector(state => state.settings_webhookHistory.listView.HashMapStatus)

    const [attpObj, setAttpObj] = React.useState(attemptsObject)
    const [data, setData] = React.useState(attemptsObject?.eventDataList && attemptsObject?.eventDataList[attpObj?.eventDataList?.length - 1] || {})
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const [breadcrumbOptions, setBreadcrumbOptions] = React.useState<any>([
        {
            id: '1',
            label: 'Response from URL',
            value: 'responseFromURL',
            
        },
        {
            id: `attempt_${attpObj?.eventDataList?.length}`,
            label: `Attempt ${attpObj?.eventDataList?.length}`,
            value: `attempt_${attpObj?.eventDataList?.length}`,
            disabled: false,
        }
    ])

    const [isEventDataList, setEventDataList] = React.useState(false)

    useEffect(()=> {
        
        if(!!attemptsObject?.eventDataList) {
            setEventDataList(true)
            setAttpObj(attemptsObject)
            setData(attemptsObject?.eventDataList[attemptsObject?.eventDataList?.length - 1])
        }
        setBreadcrumbOptions([
            {
                id: '1',
                label: 'Response from URL',
                value: 'responseFromURL',
                
            },
            {
                id: `attempt_${attemptsObject?.eventDataList?.length}`,
                label: `Attempt ${attemptsObject?.eventDataList?.length}`,
                value: `attempt_${attemptsObject?.eventDataList?.length}`,
                disabled: false,
            }
        ])
       
        
    },[attemptsObject])

    const optionList: IAttempts[] = []
    let count = 0;
    attpObj?.eventDataList?.forEach(() => {
        count++;
        optionList.push({
            id: `attempt_${count}`,
            label: `Attempt ${count}`,
            value: `attempt_${count}`,
        })
    })
    const d2 = moment.utc(data?.createdDate).tz(clientProperties?.TIMEZONE?.propertyValue)
    const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'
    let statusObject:any = status[data?.status]
   

    return (isEventDataList ? <AttemptsSectionWrapper>
        <BreadCrumbWrapper>
           <BreadCrumb
            options={breadcrumbOptions}
            onClick={(id:any) => {
                const attemptsId = id.charAt(id.length-1)
                const data = attpObj?.eventDataList[parseInt(attemptsId)-1]
                setData(data)
            }}
            
            optionList={optionList}
            width='200px'
        />
        </BreadCrumbWrapper>
         <DataWrapper>
                <DetailBox> 
                    <InputLabel bold>{dynamicLabels.http_status}</InputLabel>
                    <TextOverflowEllipsis title={statusObject && statusObject?.clientRefMasterDesc}> {statusObject && statusObject?.clientRefMasterDesc}</TextOverflowEllipsis> 
                  
                </DetailBox>    
                <DetailBox>
                    {/* confirm with Anees */}
                    <InputLabel bold> {dynamicLabels.requested_time} </InputLabel>
                    <InputLabel color='grey'>
                        <TextOverflowEllipsis title={d2.format(format1)}>{d2.format(format1)}</TextOverflowEllipsis>
                    </InputLabel> 
                    {/* moment.utc(timing.startTime).tz(clientProperties?.TIMEZONE?.propertyValue).toDate() */}
                </DetailBox>
        </DataWrapper>
    </AttemptsSectionWrapper> : <div></div>)
}
export default AttemptSection