import React, { useState } from 'react'
import { Box, PasswordInput, Modal, ModalHeader, IconButton, ISelectedRows, useToast } from 'ui-library'
import apiMappings from '../../../../../utils/apiMapping'
import axios from '../../../../../utils/axios'
import { StyledChangePassword, StyledError } from '../StyledSubComponent'
import LabelMapping from '../../LabelMapping'
import { formatStringTillLength } from '../../../../../utils/helper'
import withRedux from '../../../../../utils/redux/withRedux'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'

interface IChangePassword {
    showChangePassword: boolean
    setShowChangePassword: (value: boolean) => void
    selectedRows: ISelectedRows
}
interface IpasswordField {
    text: string
    error: string
}
const ChangePassword = ({ showChangePassword, setShowChangePassword, selectedRows }: IChangePassword) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.deliveryMedium);

    const [newPassword, setNewPassword] = useState<IpasswordField>({ text: '', error: '' })
    const [confirmPassword, setConfirmPassword] = useState<IpasswordField>({ text: '', error: '' })
    const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");
    const toast = useToast()

    const handleSave = async () => {
        const payload = Object.values(selectedRows)?.map((row: any) => {
            return {
                mode: "MOBILE",
                newPassword: newPassword.text,
                userId: row?.userId,
                userName: row?.userName
            }

        })
        if (newPassword.text && confirmPassword.text && !(!!newPassword.error && !!confirmPassword.error)) {
            try {
                const { data: { status, message } } = await axios.post(apiMappings.deliveryMedium.listView.passwordChange, payload)
                if (status === 200) {
                    toast.add(message, 'check-round', false)
                    setShowChangePassword(false)
                    return
                }
                throw message

            }
            catch (errorMessage) {
                toast.add(typeof errorMessage === 'string' ? errorMessage : dynamicLabels?.somethingWendWrong, '', false)
            }

        }

    }

    const handleNewPassword = (value: string) => {
        const formattedValue = formatStringTillLength(14, value)
        let error = ''
        if (!pattern.test(value)) {
            error = LabelMapping.passwordMatchCriteria
            // confirmpassword should not be " " 
        } else if (confirmPassword.text && formattedValue !== confirmPassword.text) {
            setConfirmPassword({ ...confirmPassword, error: LabelMapping.passwordDoNotMatch })
        }
        setNewPassword({ ...newPassword, text: formattedValue, error })

    }
    const handleConfirmPassword = (value: string) => {
        const formattedValue = formatStringTillLength(14, value)
        let error = ''
        if (formattedValue !== newPassword.text ) {
            error = LabelMapping.passwordDoNotMatch
        }
        setConfirmPassword({ ...confirmPassword, text: formattedValue, error })
    }
    return <Modal open={showChangePassword} onToggle={(value) => {
        setNewPassword({ text: '', error: '' })
        setConfirmPassword({ text: '', error: '' })
        setShowChangePassword(value)
    }} width='600px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels?.changePassword || 'Change Password'}
                    handleClose={() => setShowChangePassword(false)}
                    imageVariant='icomoon-close'
                    headerStyle={{ fontSize: '15px' }}
                />
            ),
            content: (
                <StyledChangePassword>
                    <Box horizontalSpacing='5px' style={{ width: '100%' }}>
                        <div style={{ marginBottom: '15px' }} >
                            <PasswordInput
                                id='new-password'
                                name='new-password'
                                label={dynamicLabels?.newPassword || 'New Password'}
                                labelColor='text.inputLabel.default'
                                placeholder={dynamicLabels?.newPassword || 'New Password'}
                                fullWidth
                                value={newPassword.text}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNewPassword(e.target.value)}
                                errorMessage={newPassword.error}
                                error={!!newPassword.error}
                            />
                            <StyledError>{newPassword.error}</StyledError>
                        </div>
                        <PasswordInput
                            id='confirm-password'
                            name='confirm-password'
                            label={dynamicLabels?.confirmPassword || 'Confirm Password'}
                            labelColor='text.inputLabel.default'
                            placeholder={dynamicLabels?.confirmPassword || 'Confirm Password'}
                            value={confirmPassword.text}
                            errorMessage={confirmPassword.error}
                            fullWidth
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleConfirmPassword(e.target.value)}
                            error={!!confirmPassword.error}
                        />
                        <StyledError  > {confirmPassword.error}</StyledError>
                    </Box>
                </StyledChangePassword>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='10px'>
                    <IconButton
                         id='DA-ChangePassword-Modal-Save'
                        disabled={!!(confirmPassword.error || newPassword.error || !newPassword.text || !confirmPassword.text)}
                        iconVariant='icomoon-save'
                        primary
                        onClick={handleSave}
                    >{dynamicLabels?.Save || 'Save'}
                    </IconButton>
                    <IconButton  id='DA-ChangePassword-Modal-Cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => {
                        setNewPassword({ text: '', error: '' })
                        setConfirmPassword({ text: '', error: '' })
                        setShowChangePassword(false)
                    }}>{dynamicLabels.cancel}</IconButton>
                </Box>
            )
        }}
    />
}

export default withRedux(ChangePassword)