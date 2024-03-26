import moment from "moment";
import React, { useEffect, useState } from "react";
import { Box, IconButton, Modal, ModalHeader,DatePicker,TextInput, useToast} from "ui-library";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import DAListView from './DAListView';

const AssignDAModal = (props: any) => {
    const { showAssignDAModal, setAssignDAModal, manualAssignFunc, manualAssignClick,isMarkAsIntransit,tripDate, setTripDate} = props
    const dynamicLabels = useTypedSelector(state=>state.dynamicLabels);
    const clientProperties= useTypedSelector(state=>state.clientProperties);
    const toast = useToast();
    const [disableTripDate, setDisableTripDate]= useState(false);
    useEffect(() => {
        setAssignDAModal(showAssignDAModal)
    }, [showAssignDAModal])


    const handleAssign = (row: any) => {
        Object.values(row).map((value:any)=>{
            setDisableTripDate(value?.tripStatus == "STARTED")
        })
        manualAssignFunc(row);
    }
    return <Modal
        open={showAssignDAModal}
        onToggle={(value: boolean) => {
            setAssignDAModal(value);
        }}
        width='1200px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels.assignDeliveryAssociates}
                    handleClose={() => setAssignDAModal(false)}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (<div style={{maxHeight: "400px"}}><DAListView handleAssign={handleAssign} />
                {isMarkAsIntransit && <><DatePicker
                            onChange={(e: any) => {
                                if(moment(e).isAfter(new Date())){
                                    let now = moment().format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} hh:mm`);
                                    toast.add(`Please select date/time before ${now}`,"warning",false);
                                }
                                setTripDate(moment(e).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`));
                                }
                            }
                            variant='datetime'
                            label={dynamicLabels['selectDate']}
                            placeholder={dynamicLabels['selectDate']}
                            timeFormat={24}
                            tillMinDate={new Date()}
                            tillMaxDate={new Date()}
                            disabled={true}
                            style={{
                                position: 'absolute',
                                top: "-266px",
                                right: 'auto',
                                zIndex: 999
                            }}
                        >
                            {({ open, setOpen }) => (
                                <div onClick={() => {if(!disableTripDate) setOpen(!open)}}>
                                    <TextInput
                                        id='transactionDate'
                                        name='transactionDate'
                                        label={dynamicLabels['tripStartTime']}
                                        labelColor='text.inputLabel.default'
                                        className='transactionDate'
                                        placeholder={dynamicLabels['tripStartTime']}
                                        disabled={disableTripDate}
                                        variant='withIcon'
                                        iconVariant='calendar'
                                        iconSize='md'
                                        style={{width:"240px"}}
                                        value={tripDate}
                                        onChange={() => { }}
                                        iconStyle={{ padding: '8px 8px 8px 8px' }}

                                    />
                                </div>
                            )}
                        </DatePicker>
                        <p>{dynamicLabels.notesMarkIntransit}</p></>}
                        <Box
                    horizontalSpacing="10px"
                    display="flex"
                    justifyContent="flex-end"
                    p="15px"
                >
                    <IconButton
                        id='AssignDA-Modal-button-Assign'
                        iconVariant="icomoon-puzzle-tick"
                        primary
                        onClick={manualAssignClick}
                    >
                        {'Assign'}
                    </IconButton>
                    <IconButton
                        id='AssignDA-Modal-button-Close'
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => setAssignDAModal(false)}
                    >
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            </div>
                    
                ),

            // footer: (
            //     <Box
            //         horizontalSpacing="10px"
            //         display="flex"
            //         justifyContent="flex-end"
            //         p="15px"
            //     >
            //         <IconButton
            //             iconVariant="icomoon-puzzle-tick"
            //             primary
            //             onClick={manualAssignClick}
            //         >
            //             {'Assign'}
            //         </IconButton>
            //         <IconButton
            //             iconVariant="icomoon-close"
            //             iconSize={11}
            //             onClick={() => setAssignDAModal(false)}
            //         >
            //             {dynamicLabels.cancel}
            //         </IconButton>
            //     </Box>
            // ),

        }}

    />


}

export default AssignDAModal