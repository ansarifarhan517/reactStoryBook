import React, {Dispatch, useState, useEffect} from "react";
import {
    Box,
    FontIcon,
    IconButton,
    Modal,
    ModalHeader,
    DatePicker,
    TextInput,
    Checkbox, useToast
} from "ui-library";
import moment from 'moment';

import { getFormattedDate } from '../AddOrderForm/AddOrderForm.utils';
/* import useDynamicLabels from '../../../../src/modules/common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../../src/modules/common/DynamicLabels/dynamicLabels.mapping' */
import useClientProperties from "../../common/ClientProperties/useClientProperties";
import { tGlobalToastActions } from '../../common/GlobalToasts/globalToast.reducer';
import { useDispatch } from 'react-redux';
import { hybridRouteTo } from '../../../utils/hybridRouting';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping'
import { useTypedSelector } from "../../../utils/redux/rootReducer";

const TripDateChangeModal = (props: any) => {
    const { showTripDateChangeModal, setShowTripDateChangeModal, tripData, dateFormat } = props
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT"]);
    const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
    const [estimatedStartDate, setEstimatedStartDate] = useState<Date>(new Date());
    const toast = useToast();
    useEffect(() => {
        if(tripData && Object.keys(tripData)?.length && tripData[Object.keys(tripData)[0]]?.estimatedStartDate){
            setEstimatedStartDate(moment.utc(tripData[Object.keys(tripData)[0]].estimatedStartDate).tz(clientProperties?.TIMEZONE?.propertyValue).toDate())
        }
      }, [tripData]);
    const closeConfirmationModal = () => {
        toastDispatch({type: '@@globalToast/add', payload: {message: dynamicLabels.orderAddedSuccessfully, icon: 'check-round', remove: false}})
        hybridRouteTo('order')
        setShowTripDateChangeModal(false);
    }
    const setConfirm = async () => {
        setShowTripDateChangeModal(false);
        toastDispatch({type: '@@globalToast/add', payload: {message: dynamicLabels.orderAddedSuccessfully, icon: 'check-round', remove: false}})
        hybridRouteTo('order')
        const saveDataObj = [{
            "milkRun": tripData && Object.keys(tripData)?.length && tripData[Object.keys(tripData)[0]]?.routeName,
            "routePlanningId": tripData && Object.keys(tripData)?.length && tripData[Object.keys(tripData)[0]]?.routePlanningId,
            "trips": [{
                "tripId": tripData && Object.keys(tripData)?.length && tripData[Object.keys(tripData)[0]]?.tripId,
                "estimatedStartDate": estimatedStartDate && JSON.parse(JSON.stringify(moment(estimatedStartDate, dateFormat + ' HH:mm').toDate())),
            }]
        }];
            try {
                const {data} = await axios.put(apiMappings.order.form.updateTrip, saveDataObj)
                if (data && data.hasError) {
                    toast.add(data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
                } else {
                    toast.add(dynamicLabels.live_tripsUpdatedSuccessfully, 'warning', false)
                }
            } catch(error) {
                toast.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
            }
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
                            {dynamicLabels?.currentPlannedStartTimeIs} - {Object.keys(tripData).length ? getFormattedDate(tripData[Object.keys(tripData)[0]].estimatedStartDate, clientProperties?.DATEFORMAT?.propertyValue) : ""}
                        </p>
                        <DatePicker
                            selected={estimatedStartDate ? estimatedStartDate : Object.keys(tripData).length ? moment(tripData[Object.keys(tripData)[0]].estimatedStartDate).toDate() : new Date()}
                            variant='datetime'
                            label={dynamicLabels['Planned Start Time']}
                            placeholder={dynamicLabels['Planned Start Time']}
                            timeInterval={15}
                            timeFormat={24}
                            style={{
                                position: 'absolute',
                                top: -200,
                                right: 'auto',
                            }}
                            onChange={(e: Date | any) =>
                                { 
                                    setEstimatedStartDate(e)
                                }
                               }
                        >
                            {({ value, open, setOpen }) => (
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
                                        value={moment(value).format(dateFormat?.propertyValue?.toUpperCase())}
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
                            id='myCheckbox'
                            onChange={() => {}}
                            disabled={false}
                            label={dynamicLabels.donotShowThisPopupAfterEveryAssignment}
                            checkboxSize={'md'}
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
                          id='TripDateChange-OrderModal-button-Save'
                        iconVariant="icomoon-save"
                        primary
                        onClick={() => setConfirm()
                        }
                    >
                        {dynamicLabels.save}
                    </IconButton>
                    <IconButton
                          id='TripDateChange-OrderModal-button-Save'
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
