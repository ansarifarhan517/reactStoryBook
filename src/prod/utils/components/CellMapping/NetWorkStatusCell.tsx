import React, { useEffect, useState } from 'react'
import { Cell } from 'react-table'
import TextOverflowEllipsis from '../TextOverflowEllipsis'
import { FontIcon } from 'ui-library'
import styled from 'styled-components'
import store from '../../redux/store'

const StyledLoader = styled.div`
    animation: fadeIn3 1s linear 0s infinite alternate;
    width: 13px;
    margin-left: 17px;
    .loadingDots {
        font-size: 15px;
        color: #5698d3;
    }
`
const Loader = () => {
    return <StyledLoader>
        <span className="loadingDots">...</span>
    </StyledLoader>
}

export default React.memo(({ value, column }: Cell<any>) => {
    const loadingstatus = store.getState().deliveryMedium.listView.deviceStatusLoading
    const [isLoading,setIsLoading] =useState<boolean>(loadingstatus)

    useEffect(()=>{
        setIsLoading(store.getState().deliveryMedium.listView.deviceStatusLoading)
    },[store.getState().deliveryMedium.listView.deviceStatusLoading])
    
    const colorMapping = {
        Offline: 'onlineStatus.offline',
        Online: 'primary.main',
        Idle: 'onlineStatus.idle',
        'Online Weak': 'onlineStatus.idle',
        'Online Strong': 'primary.main'
    }

    // temporary close btn change it later to star, color red for offline,green for online
    return isLoading && column.id === 'deviceStatus' ? <Loader /> : <TextOverflowEllipsis title={value} style={{ display: 'flex' }}>
        <FontIcon variant='star-filled' color={colorMapping[value]} size={12} />
        <span style={{ marginLeft: '5px' }}>{value}</span>
    </TextOverflowEllipsis>
}, (p, n) => p.value === n.value)

