import React, { Dispatch, useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, IconButton, ISelectedRows, useToast, DropDown, TextInput } from 'ui-library'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { sendGA } from '../../../utils/ga'
import { useDispatch } from 'react-redux';
import { tDAListViewActions } from './DeliveryAssociate.actions';
import { tMoreOption } from './DeliveryAssociate.models';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import useDebounce from '../../../utils/useDebounce';


interface IMoreOptionConfirmation {
    moreOptionConfirmation: IMoreOption
    setMoreOptionConfirmation: (moreoption: IMoreOption) => void
    selectedRows: ISelectedRows
    landingPage: string
    fetchDataSilenty: () => void
    resetSelctedRows: () => void
}
interface IMoreOption {
    activeRequest: boolean
    selectionType: tMoreOption | string
    reason: string | undefined
}

const MoreOptionConfirmation = ({ moreOptionConfirmation, setMoreOptionConfirmation, selectedRows, fetchDataSilenty, resetSelctedRows }: IMoreOptionConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tDAListViewActions>>();
    const [title, setTitle] = useState<string>('')
    const [confirmationMessage, setConfrimationMessage] = useState<string[]>([])
    const [buttonNames, setButtonNames] = useState<string[]>([])
    const [inputVal, setInputVal] = React.useState(false);
    const debouncedValue = useDebounce(inputVal, 500)
    const toast = useToast()
    const [showReasonPopup, setShowReasonPopup] = useState<boolean>(false)
    const statusUpdateReasons = useTypedSelector(state => state.deliveryMedium.listView.statusUpdateReasons)
    const [showReasonTextbox, setShowReasonTextbox] = useState<boolean>(true);
    const [disableUpdate, setDisableUpdate] = useState<boolean>(false);
    const [reasonOtherMessage, setReasonOtherMessage] = useState<string>('')

    useEffect(() => {
    }, [debouncedValue])
    
    const handleChange = (value: string) => {
        if (value) {
            (value == "Other") ? setShowReasonTextbox(true) : setShowReasonTextbox(false);
            setMoreOptionConfirmation({...moreOptionConfirmation, reason: value})
            setDisableUpdate(false);
        }
        else{
            setDisableUpdate(true);
        }
    }
    const closeReasonModal = () => {
        setShowReasonPopup(false);
        setDisableUpdate(true);
        setShowReasonTextbox(false);
        setReasonOtherMessage("");
        fetchDataSilenty()
        resetSelctedRows()
        setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false, reason: dynamicLabels.Other })
    }
    // show only notify case
    const handleAttendence = async (type: tMoreOption) => {
        let statusData: any = {}
        const selectedRowArray = Object.values(selectedRows).map((row: any) => row?.deliveryMediumMasterId)
        const reason = (moreOptionConfirmation.reason && moreOptionConfirmation.reason !== dynamicLabels.Other) ? moreOptionConfirmation.reason : (moreOptionConfirmation.reason && moreOptionConfirmation.reason === dynamicLabels.Other && reasonOtherMessage) ? reasonOtherMessage : ''
        if (selectedRowArray.length > 200) {
            setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
            toast.add(dynamicLabels.bulkActionsNotAllowed, 'warning', false);
            return
        }
        /***
         * making active inactive always activeRequest api
         * absent,present mark api 
         */
        try {
            if (type === 'sendActivationLink') {
                sendGA('Event New','Delivery Associate -  Send Activation Link')
                statusData = await axios.post(apiMappings.deliveryMedium.listView.sendActivationLink, selectedRowArray)
            } else if (type === 'absent' || type === 'present') {
                sendGA('Event New','Delivery Associate -  change attendance confirmed')
                // if type os absent then choose only present candidates ,if type present then choose absent candidates
                const elligibleCandidate = Object.values(selectedRows).map(row => {
                    row.isAttandanceFl = type === 'absent' ? row.isAttandanceFl : !row.isAttandanceFl
                    return row
                })
                const payload = elligibleCandidate.map(row => {
                    return {
                        // attendanceSrc: "WEB",
                        deliveryMediumMasterId: row.deliveryMediumMasterId,
                        // isActiveFl: row.isActiveFl,
                        // type present then send true or else send false
                        isAttandanceFl: type === 'present',
                        reason: reason
                    }
                })
                statusData = await axios.put(apiMappings.deliveryMedium.listView.attendance, payload)

            } else if (type === 'inActive' || type === 'active') {
                sendGA('Event New','Delivery Associate -  active/inactive confirmed')
                // if type os inactive then choose only active candidates ,if type active then choose inactive candidates
                const elligibleCandidate = Object.values(selectedRows).map(row => {
                    row.isActiveFl = type === 'inActive' ? row.isActiveFl : !row.isActiveFl
                    return row
                })
                const payload = elligibleCandidate.map(row => {
                    dispatch({
                        type: '@@daListView/UPDATE_DATA',
                        payload: {
                            deliveryMediumMasterId: row.deliveryMediumMasterId,
                            isActiveFl: type === 'active',
                            reason: reason
                        },

                    });
                    return {
                        deliveryMediumMasterId: row.deliveryMediumMasterId,
                        // type active then send true or else send false
                        isActiveFl: type === 'active',
                        reason: reason
                    }
                })
                statusData = await axios.put(apiMappings.deliveryMedium.listView.activationRequest, payload)
            }
            const { data: { status, message } } = statusData
            if (status === 200) {
                toast.add(`${message}`, 'check-round', false)
                // fetch silently and then remove selection
                fetchDataSilenty()
                resetSelctedRows()
                setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
                return
            }
            throw message

        } catch (errorMessage) {
            //   setMoreOptionConfirmation(false)
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
    }
    const handleMessages = () => {
        let title = dynamicLabels?.statusConfirmation
        let confirmationMessage: string[] = []
        let buttonNames: string[] = ['ok', 'cancel']
        const selectedRow = Object.values(selectedRows)
        // const selectedRowsIntransitIncluded = selectedRow.filter((row: any) => row.statusCd === 'Intransit')
        const selectedRowsUnavailableIncluded = selectedRow.filter((row: any) => row.statusCd === 'Absent')
        const selectedRowsActiveIncluded = selectedRow.filter((row: any) => row.isActiveFl)
        //disable notify case 
        const selectedRowsInactiveIncluded = selectedRow.filter((row: any) => row.statusCd === 'Inactive')
        const selectedRowsAvailableIncluded = selectedRow.filter((row: any) => row.statusCd === 'Available')

        const withInactiveNotallowedTypes = ['absent', 'present']

        // if inactive row included and try to do unavailable or available show toast msg
        if (selectedRowsInactiveIncluded.length > 0 && withInactiveNotallowedTypes.includes(moreOptionConfirmation.selectionType)) {
            setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
            return toast.add(`You can't mark inactive ${dynamicLabels?.deliveryboy_s}`, 'check-round', false)
        } else if (moreOptionConfirmation.selectionType === 'sendActivationLink') {
            title = dynamicLabels?.confirmation
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToSendActivationLink]

        } else if (moreOptionConfirmation.selectionType === 'absent' || moreOptionConfirmation.selectionType === 'unAvailable') {
            const unavailableCount = selectedRowsUnavailableIncluded.length
            // if unavailable count entry not there that time selected count and unavailable count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsAbsent]
            setShowReasonPopup(true);
            // selected row count and no of unavailable count in selection not matching
            if (unavailableCount > 0 && unavailableCount !== selectedRow.length) {
                confirmationMessage = [`${unavailableCount} ${dynamicLabels?.deliveryMediumAlreadyAbsent} mode.`, dynamicLabels?.areYouSureYouWantToMarkAsAbsent]
            } else if (unavailableCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${unavailableCount} ${dynamicLabels?.deliveryMediumAlreadyAbsent} mode.`]
                buttonNames = ['ok']
                setShowReasonPopup(false);
            }
        } else if (moreOptionConfirmation.selectionType === 'present' || moreOptionConfirmation.selectionType === 'available') {
            const availableCount = selectedRowsAvailableIncluded.length
            // if available count entry not there that time selected count and available count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsPresent]
            setShowReasonPopup(true);
            // selected row count and no of available count in selection not matching
            if (availableCount > 0 && availableCount !== selectedRow.length) {
                confirmationMessage = [`${availableCount} ${dynamicLabels?.deliveryMediumAlreadyPresent} mode.`, dynamicLabels?.areYouSureYouWantToMarkAsPresent]
            } else if (availableCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${availableCount} ${dynamicLabels?.deliveryMediumAlreadyPresent} mode.`]
                buttonNames = ['ok']
                setShowReasonPopup(false);
            }

        } else if (moreOptionConfirmation.selectionType === 'inActive') {
            const inactiveCount = selectedRowsInactiveIncluded.length
            // if inactive count entry not there that time selected count and inactive count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsInactive]
            setShowReasonPopup(true);
            // selected row count and no of inactive count in selection not matching
            if (inactiveCount > 0 && inactiveCount !== selectedRow.length) {
                confirmationMessage = [`${inactiveCount} ${dynamicLabels.deliveryBoyAlreadyInActive}`, dynamicLabels?.areYouSureYouWantToMarkAsInactive]
            } else if (inactiveCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${inactiveCount} ${dynamicLabels.deliveryBoyAlreadyInActive}`]
                buttonNames = ['ok']
                setShowReasonPopup(false);
            }


        } else if (moreOptionConfirmation.selectionType === 'active') {

            const activeCount = selectedRowsActiveIncluded.length
            // if active count entry not there that time selected count and active count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsAcitve]
            setShowReasonPopup(true);
            // selected row count and no of active count in selection not matching
            if (activeCount > 0 && activeCount !== selectedRow.length) {
                confirmationMessage = [`${activeCount} ${dynamicLabels.deliveryBoyAlreadyActive}`, dynamicLabels?.areYouSureYouWantToMarkAsAcitve]
            } else if (activeCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${activeCount} ${dynamicLabels.deliveryBoyAlreadyActive}`]
                buttonNames = ['ok']
                setShowReasonPopup(false);
            }

        }
        setTitle(title)
        setConfrimationMessage(confirmationMessage)
        setButtonNames(buttonNames)

    }
    useEffect(() => {
        handleMessages()
    }, [moreOptionConfirmation.activeRequest, selectedRows])

    const gaForCancelEvent = () => {
        const eventActionMapping = {
            active: 'Delivery Associate - active/inactive cancelled',
            inActive: 'Delivery Associate - active/inactive cancelled',
            absent: 'Delivery Associate - change attendance cancelled',
            present: 'Delivery Associate - change attendance cancelled',
            sendActivationLink: 'Delivery Associate - Send Activation Link cancelled'
        }
        sendGA('Event New',eventActionMapping?.[moreOptionConfirmation?.selectionType])
    }

    return (
        <>
        {showReasonPopup ? ( <Modal
        open={showReasonPopup}
        onToggle={() => {
        }}
        size='md'
        children={{
            header: (
                <ModalHeader
                    headerTitle={'Select '+ dynamicLabels.statusUpdateReason}
                    handleClose={() =>closeReasonModal()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px", justifyContent: 'left' }}
                    width='100%'
                />
            ),
            content: (
                <><DropDown
                    optionList={statusUpdateReasons}
                    label={dynamicLabels.statusUpdateReason}
                    onChange={handleChange}
                    placeholder={"Select Reason"}
                    value={moreOptionConfirmation.reason}
                    required={true}

                />
                    {showReasonTextbox && <TextInput
                        id='id-reasonTextBox'
                        name='reasonTextBox'
                        value={reasonOtherMessage}
                        onChange={(e: { target: { value: string | undefined } }) => {
                            e.target.value && setReasonOtherMessage(e.target.value)
                        }}
                        label={'Enter '+ (dynamicLabels?.reason ? dynamicLabels?.reason : 'Reason')}
                        labelColor={'text.inputLabel.default'}
                        placeholder={'Enter Reason here'}
                        fullWidth={true}
                    />}
                </>

            ),
            footer: (<>
                <Box
                    horizontalSpacing="10px"
                    display="flex"
                    style={{ paddingRight: '15px', paddingBottom: '15px' }}
                    justifyContent="flex-end"
                >
                    <IconButton
                        iconVariant="icomoon-save"
                        disabled={disableUpdate}
                        iconSize={11}
                        primary
                        onClick={() => setShowReasonPopup(false)}
                    >
                        {dynamicLabels.save || "Save"}
                    </IconButton>
                    <IconButton
                        iconVariant="icomoon-close"
                        iconSize={11}
                        onClick={() => closeReasonModal()}
                    >
                        Cancel
                    </IconButton>
                </Box>
            </>
            )
        }}

    /> ): <Modal open={!!moreOptionConfirmation.activeRequest} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={title}
                imageVariant='icomoon-close'
                handleClose={() => setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })}
            />,

            content: <div>
                {confirmationMessage?.map((msg: string, index: number) => {
                    return <div key={msg + index} style={{ fontSize: '14px', marginBottom: '5px' }}>{msg}</div>
                })}</div>,
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                     {buttonNames.includes('ok') && <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => buttonNames.length > 1 && inputVal===false ? (handleAttendence(moreOptionConfirmation.selectionType as tMoreOption),setInputVal(true)) : setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })}>{dynamicLabels?.ok}</IconButton>}
                    {buttonNames.includes('cancel') && <IconButton iconVariant='icomoon-close' primary={false} onClick={() => {
                        setMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
                        gaForCancelEvent()
                    }}>
                        {dynamicLabels?.cancel}
                    </IconButton>}
                </Box>
            )
        }}
    </Modal>}
    </>)

}
export default MoreOptionConfirmation