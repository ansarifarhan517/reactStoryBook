import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, IconButton, DropDown } from 'ui-library'
import { sendGA } from '../../../../utils/ga'
import { IStatusList } from '../ShipperListView.models'
import { StyledFooter, StyledRejectList } from '../StyledShipperListView'
import { IActivationConfirmation } from './SubComponent.models'

const ActivationConfirmation = ({ shipperActivationRequest, title, setShipperActivationRequest, confirmationMessage, handleShipperActivation, dynamicLabels, deactivationReasonList }: IActivationConfirmation) => {
    const firstReason = deactivationReasonList?.[0]?.value
    const [reason, setReason] = useState<string>('')
    useEffect(() => {
        // modal whenevr getting open make reason blank
        if (shipperActivationRequest?.showModal) {
            setReason('')
        }
    }, [shipperActivationRequest?.showModal])

    return <Modal open={!!shipperActivationRequest?.showModal} onToggle={() => { }} size='md'>
        {{
            header: <ModalHeader
                headerTitle={title}
                imageVariant='icomoon-close'
                handleClose={() => {
                    shipperActivationRequest?.failureCallback && shipperActivationRequest?.failureCallback(!shipperActivationRequest.activeRequest);
                    setShipperActivationRequest();
                    setReason('')
                    sendGA('Event New','Shipper List View - Active Inactive cancel')
                }}
            />,

            content: (<StyledRejectList reason={firstReason === reason ? undefined : reason}>
                <Box horizontalSpacing='5px'>
                    <div style={{ fontSize: '13px', paddingBottom: '15px' }}>{confirmationMessage}</div>
                    {shipperActivationRequest?.activeRequest === false ? (
                        <DropDown
                            variant='form-select'
                            id='reasonlist'
                            optionList={deactivationReasonList}
                            label={dynamicLabels?.reason || 'Reason'}
                            onChange={(value: any) => {
                                setReason(value)
                            }}
                            placeholder={dynamicLabels?.deactivateShipperReasonSelectPlaceholder || 'Select A Reason For Deactivation'}
                            value={reason}
                            required
                        />) : <div />}
                </Box>
            </StyledRejectList>),
            footer: (
                <StyledFooter>
                    <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton
                            iconVariant='icomoon-tick-circled'
                            primary
                            onClick={() => {
                                sendGA('Event New','Shipper List View - Active Inactive confirmation')
                                const selectedReason = deactivationReasonList.find((entry: IStatusList) => entry.value === reason)
                                handleShipperActivation(selectedReason)
                            }
                            }
                            disabled={!!(!reason && !shipperActivationRequest?.activeRequest)}
                        >
                            <span style={{ fontSize: '13px' }}>{dynamicLabels?.ok || 'Ok'}</span>
                        </IconButton>
                        <IconButton
                            iconVariant='icomoon-close'
                            iconSize={11}
                            onClick={() => {
                                setShipperActivationRequest();
                                sendGA('Event New','Shipper List View - Active Inactive cancel')
                                shipperActivationRequest?.failureCallback && shipperActivationRequest?.failureCallback(!shipperActivationRequest.activeRequest);
                            }}
                        >
                            <span style={{ fontSize: '13px' }}>{dynamicLabels?.cancel || 'Cancel'}</span>
                        </IconButton>
                    </Box>
                </StyledFooter>
            )
        }}
    </Modal>

}
export default ActivationConfirmation