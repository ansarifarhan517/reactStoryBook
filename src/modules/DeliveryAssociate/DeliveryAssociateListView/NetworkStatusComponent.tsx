import React, { Dispatch, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { IconButton, Box,  useToast } from 'ui-library'
import firebaseRef from '../../../utils/firebase';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import store from '../../../utils/redux/store';
import withRedux from '../../../utils/redux/withRedux';
import { IDeviceStatusInfo, IRowData } from '../DeliveryAssociateListView/DeliveryAssociate.models';
import { tDAListViewActions } from './DeliveryAssociate.actions';

const NetworkStatusComp = ({ columnName }: { columnName: string }) => {
    const netWorkStatusTimer = useTypedSelector(state => state.deliveryMedium.listView.netWorkStatusTimer);
    const deviceStatusLoading = useTypedSelector(state => state.deliveryMedium.listView.deviceStatusLoading);

    const toast = useToast();

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tDAListViewActions>>()
    let networkStatusRef: any = null
        useEffect(() => {
            return ()=>{ networkStatusRef?.off()
                 }
        }, [])
  
    const resetNetworkStatus = (result: any) => {
        if (result.length > 0) {
            dispatch({
                type: '@@daListView/SET_DEVICE_STATUS',
                payload: {
                    deviceStatusLoading: true
                }
            })
            setTimeout(() => {
                dispatch({
                    type: '@@daListView/SET_DEVICE_STATUS',
                    payload: {
                        deviceStatusLoading: false
                    }
                })
            }, 6000)
        }
    }
    const initialAction = async () => {
        //first allow your component to show loader
        dispatch({
            type: '@@daListView/SET_DEVICE_STATUS',
            payload: {
                deviceStatusLoading: true
            }
        })
        // then set a time out to fetch data
        await new Promise(r => setTimeout(r, 6000));
        refreshGPSStatus()

    }
    const refreshGPSStatus = () => {
        const results = store.getState()?.deliveryMedium?.listView.data.results
        let lastResultObj: any = null
        // if no data dont show loader
        if (results.length > 0) {
            lastResultObj = results[results.length - 1]
        }
        let networkStatusList: any = {}
        results.forEach(async (row: IRowData) => {
            var rowUserId = row['userId']?.toString();
            try {
                const networkStatusRef = await firebaseRef.database().ref(`sockets/devicestatus/${rowUserId}/`)
                networkStatusRef.on('value', (snapshot) => {
                    let snapshotValue: { value: any } | null = snapshot.val()
                    let payload: IDeviceStatusInfo = {}
                    const value = snapshotValue ? snapshotValue?.value : null
                    // if websocket not working or fetching simply do network off
                    if (snapshotValue === null) {
                        networkStatusRef?.off()
                        resetNetworkStatus(results)
                        return
                    } else
                        // if value "" or spanshotValue null
                        if (!value) {
                            if (snapshot?.key && lastResultObj?.userId === parseInt(snapshot?.key)) {
                                networkStatusRef?.off()
                                networkStatusList[parseInt(snapshot?.key)] = value
                                payload.deviceStatusLoading = false
                                payload.networkStatusList = networkStatusList
                                dispatch({
                                    type: '@@daListView/SET_DEVICE_STATUS',
                                    payload
                                })
                            } else {
                                // add only those entries which has key
                                if (snapshot?.key) {
                                    networkStatusList[parseInt(snapshot?.key)] = value
                                }
                            }

                        } else {
                              // if last object value at iterator that time only send device status false and all value together
                            if (snapshot?.key && lastResultObj?.userId === parseInt(snapshot?.key)) {
                                networkStatusRef?.off()
                                networkStatusList[parseInt(snapshot?.key)] = value
                                payload.deviceStatusLoading = false
                                dispatch({
                                    type: '@@daListView/SET_DEVICE_STATUS',
                                    payload
                                })
                            }else{
                                 // add only those entries which has key
                                 if (snapshot?.key) {
                                    networkStatusList[parseInt(snapshot?.key)] = value
                                }
                            }
                        }

                })
            } catch (e) {
                networkStatusRef?.off()
                console.log(e, 'Error in fetching network status')
                dispatch({
                    type: '@@daListView/SET_DEVICE_STATUS',
                    payload: {
                        deviceStatusLoading: false
                    }
                })
            }

        })


    }


    const handleRefresh = async (column: any) => {
      
        if (column === "deviceStatus" ) {
            if(!netWorkStatusTimer.isClicked){
                dispatch({
                    type: '@@daListView/SET_NETWORK_STATUS_TIMER',
                    payload: {
                        time:(new Date().getTime() / 1000) + 60,
                        isClicked: true
                    }
                })
                initialAction()
            }else{
                const currentTimeStamp = new Date().getTime() / 1000// time in seconds
                const difference = netWorkStatusTimer?.time  ? (netWorkStatusTimer.time - currentTimeStamp)  : 0
                if(netWorkStatusTimer?.time && difference < 60 && difference > 0 && deviceStatusLoading ){
                    toast.add(`Refresh already in progress. Remaining time : ${Math.round(difference)}s`,'warning',false)
                }else{
                    dispatch({
                        type: '@@daListView/SET_NETWORK_STATUS_TIMER',
                        payload: { time: undefined,isClicked:false }
                    })
                }
            }
        }

    }

    return <Box display='flex' justifyContent='flex-end'>
        <IconButton
            iconSize='sm'
            onlyIcon
            iconVariant='reload'
            color='primary.main'
            onClick={() => {
                handleRefresh(columnName)
            }
            }
        />
    </Box>

}

export default React.memo(withRedux(NetworkStatusComp))