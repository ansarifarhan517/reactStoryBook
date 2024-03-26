import React, { useEffect, useState } from "react";
import { LeafletMap, Modal, ModalHeader, Box, IconButton, Grid, useToast } from "ui-library"
import { settings } from '../../../utils/components/Map/settings'
import useDynamicLabels from '../../../modules/common/DynamicLabels/useDynamicLabels';
import DYNAMIC_LABELS_MAPPING from '../../../modules/common/DynamicLabels/dynamicLabels.mapping';
import { getGoogleAPIKey } from '../../../utils/components/Map/MapHelper';
import markerIcons from "../../../utils/map/icon.config"
import { Label } from "../OrderListView/StyledOrderListView";
import axios from "../../../utils/axios";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { tSearchFieldAddressInfo } from "../../../utils/components/Map/interface";
const GeocodingMapModal = (props: any) => {
    /** Redux Hooks */
    const { selectedRows, isGeocodeModal, setIsGeocodeModal } = props;
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
    const popupDynamicLabel = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mapPopups)
    const settingLabels = { ...popupDynamicLabel, ...dynamicLabels }
    const settingConfig = settings(settingLabels);
    const toast = useToast();
    const [position, setPosition] = React.useState([19.0759837, 72.8776559])
    const googleApiKey = getGoogleAPIKey()
    const [inTransitOrderCount, setInTransitOrderCount] = useState(0);
    const [assinedOrderCount, setAssinedOrderCount] = useState(0);
    const latLng ={
        lat: "",
        lng: ""
    }
    useEffect(() => {
        if (selectedRows.latitude){
            if (selectedRows.orderType === "DELIVER") {
                setPosition([selectedRows?.destLatitude, selectedRows?.destLongitude]);
            } else {
                setPosition([selectedRows?.originLatitude, selectedRows?.originLongitude]);
            }
        } 
    }, [selectedRows]);
    const updateStatus = async () => {
        let nodeIds = selectedRows.orderType == "DELIVER" ? selectedRows.destClientNodeId : selectedRows.originClientNodeId;

        const data = await axios.get(`ClientApp/clientnode/order/count?nodeIds=${nodeIds}`)
        if (data.data && data.data.length) {
            setAssinedOrderCount(data.data[0].assinedOrderCount);
            setInTransitOrderCount(data.data[0].inTransitOrderCount);
        } else {
            setIsGeocodeModal(false);
            updateLatLng();
        }

        return;

    }

    const updateLatLng = async () => {
        let nodeIds = selectedRows.orderType == "DELIVER" ? selectedRows.destClientNodeId : selectedRows.originClientNodeId;

        let formData = {
            'nodeId': nodeIds,
            'latitude': latLng.lat,
            'longitude': latLng.lng,
            'shipmentId': selectedRows.shipmentId
        }
     try{
        let data = await axios.put("/ClientApp/clientnode/updateLocation", formData);
        
        if (data.data) {
            toast.add(data.data?.message || "Success", "success", false);
        }
    }catch(e){
        toast.add(e.response.data.message|| "fail", "fail", false);
    }
       
    }

    return (


        <><Modal
            open={isGeocodeModal}
            width="1200px"
            onToggle={(value) => {
                setIsGeocodeModal(value);
            }}
            size='lg'
            children={{
                header: (
                    <ModalHeader
                        headerTitle='Update Customer Location'
                        handleClose={() => setIsGeocodeModal(false)}
                        imageVariant="icomoon-close"
                        headerStyle={{ fontSize: "15px", justifyContent: 'left' }}
                        width='100%'
                    />
                ),
                content: (<>
                    <Box>
                        {inTransitOrderCount > 0 && <Grid style={{ marginBottom: "10px" }}>

                            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
                                <img src="./../../../images/outline-block-error.svg"
                                    style={{ width: "15px", marginTop: " -3px" }} /> {dynamicLabels.thisAddressIsAttachedTo}
                                {inTransitOrderCount} {dynamicLabels.addressIntransitOrders}
                            </div>
                            <div style={{ fontSize: "13px" }}>{dynamicLabels.thisAddressCanNotBeUpdatedAsItIsUsedFor}
                                {inTransitOrderCount} {dynamicLabels.addressIntransitOrders}.
                                {dynamicLabels.pleaseCompleteTheseOrdersAndTryAgain}.
                            </div>


                        </Grid>}
                        {

                            (assinedOrderCount > 0 && inTransitOrderCount === 0) && <div>
                                <div style={{ fontSize: "13px" }}><img src="./../../../images/outline-warning_outline.svg"
                                    style={{ width: "15px", marginTop: " -3px" }} /> {dynamicLabels.proceedWarningMessage}
                                </div>
                            </div>
                        }
                        <Grid container>
                            <Grid item xs={3}>
                                <Label style={{ textTransform: "capitalize" }}>{dynamicLabels.order} No</Label>
                                <p>{selectedRows.orderNo}</p>
                            </Grid>
                            <Grid item xs={3}>
                                <Label>Customer Name</Label>
                                <p>{selectedRows.customerName}</p>
                            </Grid>
                            <Grid item xs={3}>
                                <Label>Contact Number</Label>
                                <p>{selectedRows.customerPhoneNo}</p>
                            </Grid>
                            <Grid item xs={3}>
                                <Label>Address Details</Label>
                                <p>{selectedRows.addressDetails}</p>
                            </Grid>
                        </Grid>
                    </Box>
                    <LeafletMap
                        id='leafletBaseMap'
                        classes='baseMap customBaseMap'
                        googleApiKey={googleApiKey}
                        settingConfig={settingConfig}
                        width="100%"
                        height="315px"
                        center={[position[0], position[1]]}
                        position={[position[0], position[1]]}
                        onEdit={(e) => console.log(e)}
                        iconsRef={markerIcons}
                        zoomControl
                        zoom={15}
                        locationSearch
                        geocoding={{
                            permission: true,
                            isSave: true,
                            searchText: "",
                            position: position,
                            onGeocodingSave: (e: any) => {
                                //we need to set postion here 
                                latLng.lat= e.position?.[0]
                                latLng.lng = e.position?.[1]

                                updateStatus();
                            },
                            sendLocationOutside: (address: tSearchFieldAddressInfo) => {
                                console.log(address, "ADDRESS");
                            }
                        }}
                        sendLocationOutside={(address: tSearchFieldAddressInfo) => {
                            setPosition([address.position[0], address.position[1]]);
                           
                        }}
                    />
                </>

                ),
                footer: (<>
                    <Box
                        horizontalSpacing="10px"
                        display="flex"
                        style={{ paddingRight: '15px', paddingBottom: '15px' }}
                        justifyContent="flex-end"
                    >
                        {/* <IconButton
                            iconVariant="icomoon-save"
                            iconSize={11}
                            primary
                            onClick={updateStatus}
                        >
                            Update
                    </IconButton> */}
                        <IconButton
                            iconVariant="icomoon-close"
                            iconSize={11}
                            onClick={() => {
                                setInTransitOrderCount(0);
                                setAssinedOrderCount(0);
                                // setAddress({});
                                setIsGeocodeModal(false)
                            }
                            }
                        >
                            Cancel
                    </IconButton>
                    </Box>
                </>
                )
            }}

        />
            {/* <InformationModal isShowModal={showInformationModal} /> */}
        </>


    )
}
export default GeocodingMapModal;
