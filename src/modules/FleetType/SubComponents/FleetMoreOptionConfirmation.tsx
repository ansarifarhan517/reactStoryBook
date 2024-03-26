import React, { Dispatch, useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, IconButton, ISelectedRows, useToast } from 'ui-library'
import apiMappings from '../../../utils/apiMapping'
import axios from '../../../utils/axios'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { sendGA } from '../../../utils/ga'
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { tFleetTypeListViewAcions } from '../FleetTypeListView.actions';


interface IFleetMoreOptionConfirmation {
    moreOptionConfirmation: IMoreOption
    setFleetMoreOptionConfirmation: (moreoption: IMoreOption) => void
    resetSelctedRows: () => void
}
export type tMoreOption = 'active' | 'inactive'
interface IMoreOption {
    activeRequest: boolean
    selectionType: tMoreOption | string

}

const FleetMoreOptionConfirmation = ({ moreOptionConfirmation, setFleetMoreOptionConfirmation, resetSelctedRows }: IFleetMoreOptionConfirmation) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.fleet);
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<tFleetTypeListViewAcions>>();
    const fetchOptions = useTypedSelector(state => state.fleet.listView.fetchOptions)
    const selectedRows = useTypedSelector(state => state.fleet.listView.selectedRows)

    const [title, setTitle] = useState<string>('')
    const [confirmationMessage, setConfrimationMessage] = useState<string[]>([])
    const [buttonNames, setButtonNames] = useState<string[]>([])
    const toast = useToast()
    // show only notify case
    const handleActivation = async (type: tMoreOption) => {
        let statusData: any = {}
        try {
            sendGA('Event New' ,`Fleet type master - Toggle ${type === 'active' ? 'Active' : 'Inactive'}`)
            const activeValues = Object.values(selectedRows as ISelectedRows).filter(row => row?.isActiveFl)
            const inactiveValues = Object.values(selectedRows as ISelectedRows).filter(row => !row?.isActiveFl)

            const payload = type === 'active' ? inactiveValues.map(row => Number(row.id)) : activeValues.map(row => Number(row.id))
            statusData = await axios.put(apiMappings.fleet.listView.activationRequest,
                payload, {
                params: { isActive: type === 'active' }
            }
            )

            const { data: { status, message } } = statusData
            if (status === 200) {
                setFleetMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
                toast.add(`${message}`, 'check-round', false)
                resetSelctedRows()
                // fetch silently and then remove selection
                dispatch({
                    type: '@@fleetTypeListView/FETCH_DATA',
                    payload: {
                        pageNumber: fetchOptions?.pageNumber,
                        pageSize: fetchOptions?.pageSize,
                        searchBy: fetchOptions?.filterOptions?.searchBy,
                        searchText: fetchOptions?.filterOptions?.searchText,
                        sortBy: fetchOptions?.sortOptions?.sortBy,
                        sortOrder: fetchOptions?.sortOptions?.sortOrder,
                        isLoading: true
                    }
                })
                dispatch({ type: '@@fleetTypeListView/SET_FLEET_ACTIVATION', payload: undefined })
                return
            }
            throw message

        } catch (errorMessage) {
            setFleetMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
            toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels.somethingWendWrong, '', false)
        }
    }
    const handleMessages = () => {
        let title = dynamicLabels?.statusConfirmation
        let confirmationMessage: string[] = []
        let buttonNames: string[] = ['ok', 'cancel']
        const selectedRow = Object.values(selectedRows as ISelectedRows)
        const selectedRowsActiveIncluded = selectedRow.filter(row => row.isActiveFl)
        //disable notify case 
        const selectedRowsInactiveIncluded = selectedRow.filter(row => !row.isActiveFl)

        if (moreOptionConfirmation.selectionType === 'inactive') {
            const inactiveCount = selectedRowsInactiveIncluded.length
            // if inactive count entry not there that time selected count and inactive count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsInactive]
            // selected row count and no of inactive count in selection not matching
            if (inactiveCount > 0 && inactiveCount !== selectedRow.length) {
                confirmationMessage = [`${inactiveCount} ${dynamicLabels.fleet_s} already inactive`, dynamicLabels?.areYouSureYouWantToMarkAsInactive]
            } else if (inactiveCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${inactiveCount} ${dynamicLabels.fleet_s} already inactive.`]
                buttonNames = ['ok']
            }

        } else if (moreOptionConfirmation.selectionType === 'active') {

            const activeCount = selectedRowsActiveIncluded.length
            // if active count entry not there that time selected count and active count will also not match that time show below msg
            confirmationMessage = [dynamicLabels?.areYouSureYouWantToMarkAsAcitve]
            // selected row count and no of active count in selection not matching
            if (activeCount > 0 && activeCount !== selectedRow.length) {
                confirmationMessage = [`${activeCount} ${dynamicLabels.fleet_s} already active`, dynamicLabels?.areYouSureYouWantToMarkAsAcitve]
            } else if (activeCount === selectedRow.length) {
                // if count is matching then
                confirmationMessage = [`${activeCount} ${dynamicLabels.fleet_s} already active.`]
                buttonNames = ['ok']
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
            active: 'Fleet type master - active/inactive cancelled',
            inactive: 'Fleet type master - active/inactive cancelled',
        }
        sendGA('Event New' ,eventActionMapping?.[moreOptionConfirmation?.selectionType])
    }

    return <Modal open={!!moreOptionConfirmation.activeRequest} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={title}
                imageVariant='icomoon-close'
                handleClose={() => setFleetMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })}
            />,

            content: <div>
                {confirmationMessage?.map((msg: string, index: number) => {
                    return <div key={msg + index} style={{ fontSize: '14px', marginBottom: '5px' }}>{msg}</div>
                })}</div>,
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    {buttonNames.includes('ok') && <IconButton iconVariant='icomoon-tick-circled' primary onClick={() => buttonNames.length > 1 ? handleActivation(moreOptionConfirmation.selectionType as tMoreOption) : setFleetMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })}>{dynamicLabels?.ok}</IconButton>}
                    {buttonNames.includes('cancel') && <IconButton iconVariant='icomoon-close' primary={false} onClick={() => {
                        setFleetMoreOptionConfirmation({ ...moreOptionConfirmation, activeRequest: false })
                        gaForCancelEvent()
                    }}>
                        {dynamicLabels?.cancel}
                    </IconButton>}
                </Box>
            )
        }}
    </Modal>

}
export default FleetMoreOptionConfirmation