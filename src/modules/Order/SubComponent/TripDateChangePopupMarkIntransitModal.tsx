import React, {useState} from "react";
import {
    Box,
    FontIcon,
    IconButton,
    Modal,
    ModalHeader,
    DatePicker,
    TextInput,
    useToast
} from "ui-library";
import moment from 'moment';

import axios from "../../../utils/axios";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import apiMappings from "../../../utils/apiMapping";
import useClientProperties from "../../common/ClientProperties/useClientProperties";


const TripDateChangePopupMarkIntransitModal = (props: any) => {
    // const clientProperties = useTypedSelector(state=>state.clientProperties);
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    const toast = useToast();
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const timeFormat = "HH:mm";
    const { showTripDateChangePopupMarkIntransitModal, setShowTripDateChangePopupMarkIntransitModal,selectedRows,handleFetchData ,fetchOptions} = props
    const [estimatedStartDate, setEstimatedStartDate] = useState(moment(new Date()).format("MM/DD/YYYY HH:mm"));
    const [selectedEstimatedStartDate, setselectedEstimatedStartDate] = useState<string | undefined>();
    const closeConfirmationModal = (value : boolean) => {
        setShowTripDateChangePopupMarkIntransitModal(value);
        setselectedEstimatedStartDate(undefined);
        setEstimatedStartDate(moment(new Date()).format("MM/DD/YYYY HH:mm"));
    }
    const startTripWithPastDate = async () => {
        var tripIds:any = []; //aaaa
        var statusInValid = false;
        Object.values(selectedRows).map(function (row:any) {
            console.log(row);
            if ((row.orderStatus == 'NOTDISPATCHED')) {
                if (tripIds.indexOf(row.tripId) < 0) tripIds.push(row.tripId);
            } else {
                statusInValid = true;
            }

        });
        if (!statusInValid) {
            var url;
            var startDate = selectedEstimatedStartDate ? estimatedStartDate : formatDate(moment(new Date()).format("MM/DD/YYYY HH:mm"))
            if (estimatedStartDate) {
                url = apiMappings.order.listView.startTrip + '?tripStartDt=' + startDate;
            } else {
                url = apiMappings.order.listView.startTrip;
            }
            try{
                const data = await axios.post(url, tripIds);
                if(data.data){
                    var response = data.data;
                    // var keys = '';
                    if (response.hasError) {
                        console.log(response);
                        // if (response.error && response.error.order_0 && response.error.order_0[0] && response.error.order_0[0].key) {
                        //     keys = response.error.order_0[0].key
                        //     var rows = response.error.order_0[0].key.split(',')
                        //     // var rows = response.error.key.split(',')
                        //     angular.forEach(rows, function (e, i) {
                        //         angular.element('tr[table-id="' + e.trim() + '"]').find('td').css({ background: '#dadada' })
                        //     })
                        //     toast.add(response.error.order_0[0].message[0], 'error',false);
                        // } else {
                        //     toast.add(response.message,'success', false);
                        // }
    
                    } else {
                        toast.add(response.message,'check-round',false);
                        setShowTripDateChangePopupMarkIntransitModal(false);
                        setselectedEstimatedStartDate(undefined);
                        setEstimatedStartDate(moment(new Date()).format("MM/DD/YYYY HH:mm"));
                        handleFetchData(fetchOptions);
                    }
                    
                    
                }
            } catch(error){
                setShowTripDateChangePopupMarkIntransitModal(false);
                toast.add(error.response.data.message,'error',false);
            }


        } else {
            setShowTripDateChangePopupMarkIntransitModal(false);
            setselectedEstimatedStartDate(undefined);
            setEstimatedStartDate(moment(new Date()).format("MM/DD/YYYY HH:mm"));
        }
    }
    const setTripDate =(e:string)=>{
        setEstimatedStartDate(formatDate(e));
        setselectedEstimatedStartDate(moment(new Date(e)).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`))
        setTimeout(()=>{
            console.log(estimatedStartDate);
        },500)
        console.log(e);
    }

    const formatDate = (dateVal:string)=>{
        const timeZone= clientProperties?.TIMEZONE?.propertyValue || JSON.parse(localStorage.getItem('userAccessInfo') || '{}').timezone;
        const timezoneMode = JSON.parse(localStorage.getItem('userAccessInfo') || '') ? (JSON.parse(localStorage.getItem('userAccessInfo') || '')['timezoneMode']) : '';
        let formattedDate = moment(dateVal).format("YYYY-MM-DD HH:mm:ss");
        if (timezoneMode == "LOCATIONTIMEZONE") {
            return moment.tz(dateVal, timeZone).utc().format('YYYY-MM-DD HH:mm:ss');
        } else {
            return moment.tz(formattedDate, timeZone).utc().format('YYYY-MM-DD HH:mm:ss');
        }
    }
    return <Modal
        open={showTripDateChangePopupMarkIntransitModal}
        onToggle={(value: boolean) => {
            setShowTripDateChangePopupMarkIntransitModal(value);
        }}
        width="600px"
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.statusChangeConfirmation}
                    handleClose={() => closeConfirmationModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                />
            ),
            content: (
                <div>
                    <Box horizontalSpacing="5px">
                        <p>
                            {dynamicLabels.changeTripIntransit}
                        </p>
                        <DatePicker
                            onChange={(e: any) => {
                                    setTripDate(e)
                                }
                            }
                            // selected={Object.keys(tripData).length ? moment(tripData[Object.keys(tripData)[0]].estimatedStartDate).toDate() : new Date()}
                            variant='datetime'
                            tillMinDate={ new Date(
                                new Date().getFullYear(),
                                new Date().getMonth(),
                                new Date().getDate(),
                                new Date().getHours(),
                                new Date().getMinutes()
                              )}
                            label={dynamicLabels['Planned Start Time']}
                            placeholder={dynamicLabels['Planned Start Time']}
                            timeInterval={15}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: "60px",
                                right: 'auto',
                                zIndex:'1'
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => setOpen(!open)}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['Planned Start Time']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['Planned Start Time']}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        value={selectedEstimatedStartDate ? selectedEstimatedStartDate : moment(new Date()).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} ${timeFormat}`)}
                                        // onChange={(e: any) => {
                                        //     setDate(e);
                                        // }
                                        // }
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}
                                        style={{ width: '281px' }}
                                    />
                                </div>
                            )}
                        </DatePicker>
                        <p>
                            <FontIcon
                                color="error.main"
                                variant="icomoon-warning-circled"
                                size={14}
                            /> {dynamicLabels?.notesMarkIntransit}
                        </p>
                    </Box>
                    <Box>

                    </Box>
                </div>
            ),
            footer: (
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        id='Order-TripMarkinTransit-Modal-Confirm'
                        iconVariant="icomoon-save"
                        primary
                        onClick={()=>startTripWithPastDate()}
                    >
                        {dynamicLabels.confirm}
                    </IconButton>
                    <IconButton
                         id='Order-TripMarkinTransit-Modal-Cancel'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeConfirmationModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),
        }}
    />

}

export default TripDateChangePopupMarkIntransitModal;

