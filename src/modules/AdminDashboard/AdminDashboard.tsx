import React, { Dispatch, useEffect,useState } from 'react'
import {
    withPopup,
    withToastProvider,
    Box,
    BreadCrumb,
    Grid,
    IconButton,
    Tooltip,
    IconDropdown
    
} from "ui-library";
import { Tabs, IconDropdownStyle } from './AdminDashboard.styled.component'
import withRedux from '../../utils/redux/withRedux';
import { withThemeProvider } from '../../utils/theme';
// import { tabsData } from './AdminDashboard.mockdata'
import { useDispatch } from 'react-redux';
import { AdminDashboardActions } from './AdminDashboard.actions';
import ActiveClientWrapper from './pages/ActiveClients/ActiveClientWrapper';
import NoUsageWrapper from './pages/NoUsage/NoUsageWrapper';
import TableConatiner from './pages/PendingActivation/TableContainer';

import { useTypedSelector } from '../../utils/redux/rootReducer';
import { hybridRouteTo } from '../../utils/hybridRouting';
import useDynamicLabels from '../common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from "../common/DynamicLabels/dynamicLabels.mapping";
import firebaseRef from "../../utils/firebase";
import ModelTypeConversionSucessPopup   from "./SubComponent/ChangeModelType/ModelTypeConversionSucessPopup";
import { IRegion } from './AdminDashboard.models';

const AdminDashboard = (props:any) => {
    const dispatch = useDispatch<Dispatch<AdminDashboardActions>>();
    const dynamicLabels = useDynamicLabels(`${DYNAMIC_LABELS_MAPPING.adminDashboard}`);
    const pageLabel = useTypedSelector(state => state.pageLabels.client);
    const breadCrumbList = [{ id: "dashboard", label: "Dashboard", disabled: true }];
    const selectedTab = useTypedSelector(state => state.adminDashboard.adminDashboard.selectedTab || "activeClient");
    const tabsData = useTypedSelector(state=>state.adminDashboard.adminDashboard.tabData);
    const [showModelTypeConversionPopup,setShowModelTypeConversionPopup] = useState(false);
    const [clientName,setClientName] = useState("");
    const isMultiRegionSupported = false;
    const regionList = useTypedSelector(state => state.adminDashboard.adminDashboard.regionsList)
    const regionCount = useTypedSelector(state => state.adminDashboard.adminDashboard.regionsCount)
    const manipulatedRegionList = regionList.map((eachRegion) => {
        return {
            value: eachRegion.region,
            label: `${eachRegion.value}(${regionCount[eachRegion.region]})` 
        }
    });
    const [region, setRegion] = useState<IRegion>(manipulatedRegionList?.[0]?.value);
    const [regionLabel, setRegionLabel] = useState(manipulatedRegionList?.[0]?.label);

    useEffect(() => {
        setRegionLabel(regionList?.[0]?.value)
        localStorage.setItem("clientRegion", regionList?.[0]?.region)
    },[regionList])

    //Deprecated Code of multi-region
    // useEffect(() => {
    //     dispatch({
    //         type: "@@adminDashboard/FETCH_REGIONS_LIST"
    //     })
    // },[])

    useEffect(()=>{
        dispatch({
            type: "@@adminDashboard/FETCH_TABDATA",
            payload: {region}
        }),
        dispatch({
            type: "@@adminDashboard/CLIENT_DETAILS/FETCH_POD_DATA",
            payload: {region}
        }),
        dispatch({
            type: "@@adminDashboard/CLIENT_DETAILS/FETCH_DATA",
            payload: {region}
        }),
        dispatch({
            type: "@@adminDashboard/CLIENT_ACTIVITY/FETCH_DATA",
            payload: {region}
        })
    }, [region])

    useEffect(()=>{
        getSocketConnection()
    },[])


    const tabClick = (tab: string) => {
        dispatch(
            {
                type: "@@adminDashboard/SELECT_TAB",
                payload: tab
            }
        )
    }

    const onChangeRegion = (value) => {
        localStorage.setItem("clientRegion", value)
        setRegion(value)
        setRegionLabel(regionLabel)
    }

    const getSocketConnection = () => {
        let accessToken = localStorage.getItem('userAccessInfo');
        console.log('Connected to Firebase!!');
        let clientId = accessToken ? JSON.parse(accessToken).clientId : null;
        const driverCreateRef = firebaseRef.database().ref(`sockets/modeltypeconversionstatus/${clientId}`)

        driverCreateRef.on('value', function (snapshot) {
            console.log('on update:', snapshot.val());
            if (snapshot.val()) {
                var clientName = snapshot.val().value;
                if (clientName && clientName.length > 0) {
                    console.log("clientName ="+clientName);
                    setClientName(clientName);
                    setShowModelTypeConversionPopup(true);
                    driverCreateRef.set("")
                }
                driverCreateRef.off('value');
            }
        });
    }

    return (<>

        <Box display="flex" id="mainDiv" flexDirection='column' style={{ width: '100%', height: 'calc(100vh - 64px)', marginTop: '64px' }} px='15px' pb='15px'>
            <Box
                display="flex"
                justifyContent="space-between"
                style={{ width: "100%" }}
                py="15px"
                px="15px"
            >
                
                <BreadCrumb options={breadCrumbList}></BreadCrumb>
                <>
                <div style={{display: "flex"}}>
                {pageLabel?.buttons?.addClient && 
                <Tooltip
                        messagePlacement='end'
                        hover
                        message="Click here to add a client that has an existing Hubspot deal. Zoho customer and subscription will be automatically created through this action."
                        key="add"
                    >
                    <IconButton
                        id='admin_dashboard--actionbar--add'
                        intent="page"
                        data-tip
                        
                        data-for="tt_AddOrder"
                        iconVariant="icomoon-add"
                        onClick={() => {
                            hybridRouteTo("createAccount/");
                        }}
                    >

                        {dynamicLabels.add}
                    </IconButton>
                    </Tooltip>}

                    {isMultiRegionSupported ? 
                    (<IconDropdownStyle>
                        <IconDropdown
                            variant='date-picker'
                            optionList={manipulatedRegionList}
                            onChange={(value) => {
                                onChangeRegion(value)
                            }}
                            width='150px'
                            placeholder={regionLabel}
                            showDownArrow={true}
                            isMultiRegionStyled={true}
                        />
                    </IconDropdownStyle>) : null }
                </div>
                </>
            </Box>
            <Box display="flex" justifyContent="center" style={{ width: "100%" }}>
                <Grid container spacing="1em" style={{ margin: "0" }}>
                    <Grid spacing="" item lg={4}>
                        <Tabs title="Count of active versus total clients." onClick={() => tabClick("activeClient")} style={selectedTab == "activeClient" ? { background: "#5698d3", color: "#fff" } : {}}>
                            <h4>{tabsData.totalClientCount ? `${Number((tabsData.activeClientCount/tabsData.totalClientCount) *100).toFixed(2)}%` : 0  } {`(${(tabsData.activeClientCount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${(tabsData.totalClientCount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`}</h4>
                            <label>Active Clients</label>
                        </Tabs>
                    </Grid>
                    <Grid spacing="" item lg={4}>
                        <Tabs title="Count of active users of clients having status as active and not expired." onClick={() => tabClick("noUsage")} style={selectedTab == "noUsage" ? { background: "#5698d3", color: "#fff" } : {}}>
                            <h4>{tabsData.activeUserCount? (tabsData.activeUserCount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","): 0}</h4>
                            <label>Active Users</label>
                        </Tabs>
                    </Grid>
                    <Grid spacing="" item lg={4}>
                        <Tabs title="Count of clients who are yet to activate the product." onClick={() => tabClick("pendingAction")} style={selectedTab == "pendingAction" ? { background: "#5698d3", color: "#fff" } : {}}>
                            <h4>{tabsData.pendingActivationCount? (tabsData.pendingActivationCount)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0}</h4>
                            <label>Pending Activations</label>
                        </Tabs>
                    </Grid>
                </Grid>
            </Box>
            {
                selectedTab == "activeClient" && !!Object.keys(tabsData)?.length &&
                <>
                    <ActiveClientWrapper />
                </>
            }

            {
                selectedTab == "noUsage" &&
                <>
                    <NoUsageWrapper impersonateUser={props.impersonateUser} region={region}/>
                </>
            }

                {
                selectedTab == "pendingAction" &&
                <>
                    <TableConatiner impersonateUser={props.impersonateUser}/>
                </>
            }

        </Box>
        {showModelTypeConversionPopup && <ModelTypeConversionSucessPopup
            showModelTypeConversionPopup={showModelTypeConversionPopup}
            setShowModelTypeConversionPopup={(value: boolean) => setShowModelTypeConversionPopup(value)}
            clientName={clientName} />
        }
    </>
    )
}

export default withThemeProvider(
    withToastProvider(
        withRedux(
            withPopup(
                AdminDashboard
            )
        )
    )
)