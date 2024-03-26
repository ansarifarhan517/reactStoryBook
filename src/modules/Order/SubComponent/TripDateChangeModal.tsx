import React, {useState} from "react";
import {
    Box,
    FontIcon,
    IconButton,
    Modal,
    ModalHeader,
    DatePicker,
    TextInput,
    Checkbox,
    useToast
} from "ui-library";
import moment from 'moment';

import { 
    getNoTZFormatOfDate, 
    getUTCDateTZ
 } from '../../Order/OrderListOptionData/utils';
import axios from "../../../utils/axios";
import { useTypedSelector } from "../../../utils/redux/rootReducer";


const disabledDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes()
  )

const TripDateChangeModal = (props: any) => {
    const toast = useToast();
    const { showTripDateChangeModal, setShowTripDateChangeModal,neverShowTripDateChangePopup,setNeverShowTripDateChangePopup, tripData, dateFormat } = props
    const selectedDate = Object.keys(tripData).length ? moment(tripData[Object.keys(tripData)[0]].estimatedStartDate)?.toDate() : moment(new Date()).toDate();
    
    const [estimatedStartDate, setEstimatedStartDate] = useState(selectedDate);
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    const [confirmButtonDisable,setConfirmButtonDisable] = useState<boolean>(false);
    const closeConfirmationModal = () => {
        setShowTripDateChangeModal(false);
    }
    
    const setConfirm =async() => {
        if (moment(new Date()) > moment(estimatedStartDate)) {
            toast.add(dynamicLabels.estimatedStartdateValidation, "warning", false);
            return ;
        } 
        setConfirmButtonDisable(true);
        let convertedTripData:any = Object.values(tripData);
        const payload = [
            {
                milkrun: convertedTripData[0]?.milkRun,
                routePlanningId: -1,
                trips: [{
                    tripId: convertedTripData[0]?.tripId,
                     estimatedStartDate:estimatedStartDate && moment(estimatedStartDate, dateFormat + ' HH:mm')
                }]
            }
        ]
        const data = await axios.put('TripApp/trip/lmfm/update', payload );
        if(data.data){
            setShowTripDateChangeModal(false);
            toast.add(data.data.message, "success", false);
        }
        setConfirmButtonDisable(false);
        setShowTripDateChangeModal(false);
        
    }

    return <Modal
        open={showTripDateChangeModal}
        onToggle={(value: boolean) => {
            setShowTripDateChangeModal(value);
        }}
        width="600px"
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.reviewTripPlannedStartTime}
                    handleClose={() => setShowTripDateChangeModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                />
            ),
            content: (
                <div>
                    <Box horizontalSpacing="5px">
                        <p>
                            <FontIcon
                                color="primary.main"
                                variant="icomoon-puzzle-tick"
                                size={14}
                            /> {dynamicLabels?.orderSuccessfullyAssignedTo} - {Object.keys(tripData).length ? tripData[Object.keys(tripData)[0]].tripName : ""}
                        </p>
                        <hr />
                        <p>
                            {dynamicLabels?.currentPlannedStartTimeIs} - {estimatedStartDate && getNoTZFormatOfDate(estimatedStartDate)}
                        </p>
                        <DatePicker
                            onChange={(e: any) => {
                                    setEstimatedStartDate(e);
                                }
                            }
                            selected={estimatedStartDate}
                            variant='datetime'
                            tillMinDate={disabledDate}
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
                            {({ open, setOpen, value }) => (
                            
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
                                        value={value && getNoTZFormatOfDate(value)}
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
                            /> {dynamicLabels?.live_thisWillReviseETA}
                        </p>
                        <p>
                        <Checkbox
                        id='neverShowTripDateChangePopup'
                        name='neverShowTripDateChangePopup'
                        onChange={() => neverShowTripDateChangePopup? setNeverShowTripDateChangePopup(false): setNeverShowTripDateChangePopup(true)}
                        checked={neverShowTripDateChangePopup}
                        label={dynamicLabels?.donotShowThisPopupAfterEveryAssignment?dynamicLabels?.donotShowThisPopupAfterEveryAssignment:"Do not show this popup again after any assignment"}
                        checkboxSize='sm'
                        color="#5698d3"
                      />
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
                         id='TripDateChange-Modal-button-Save'
                        iconVariant="icomoon-save"
                        primary
                        onClick={() => setConfirm()}
                        disabled={confirmButtonDisable}
                    >
                        {dynamicLabels.save}
                    </IconButton>
                    <IconButton
                          id='TripDateChange-Modal-button-cancel'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeConfirmationModal()}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            ),
        }}
    />

}

export default TripDateChangeModal;

