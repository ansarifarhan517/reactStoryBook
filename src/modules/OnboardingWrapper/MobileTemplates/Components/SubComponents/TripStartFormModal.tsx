import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, Toggle, TextInput, DropDown, AccordionHeaderSubTitle } from 'ui-library'
import { IconButton } from 'ui-library'
import { REGEXPS } from '../../../../../utils/constants'
import { ITripStartTimePayload } from '../../MobileTemplate.models'
import { TripFormCont } from '../../MobileTemplateStyledComponents'

interface ITripStartFormModal {
    isShowModal: boolean
    tripDetails: ITripStartTimePayload
    dynamicLabels: Record<string, string>
    setShowAddModal: (value: boolean) => void,
    fieldData: any,
    negativeCashAmount: number,
    allowNegativeCashAmount: boolean,
    onSave: (details) => void
}

const TripStartFormModal = ({ tripDetails, isShowModal, dynamicLabels, fieldData, setShowAddModal,negativeCashAmount,allowNegativeCashAmount, onSave }: ITripStartFormModal) => {
    const [startTime, setStartTime] = useState(tripDetails?.timeWindow || 0)
    const [timeUnit, setTimeUnit] = useState(0)
    const [error, setError] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [timeError, setTimeError] = useState<string>('')
    const [isTimeError, setIsTimeError] = useState<boolean>(false)
    const [isTripStartBeforeTime, setIsTripStartBeforeTime] = useState(tripDetails ? tripDetails?.active : true)

    const tripTimeUnits = ([
        { label: 'Minutes', value: 0 },
        { label: 'Hours', value: 1 },
        { label: 'Days', value: 2 },
    ]);

    useEffect(() => {
        if (tripDetails?.timeUnit) {
            const tripTimeIndex = tripTimeUnits.filter(time => time.label.toLowerCase() === tripDetails.timeUnit.toLowerCase())[0].value
            setTimeUnit(tripTimeIndex || 0)
        }
    }, [])

    const handleClosePopup = () => {
        setShowAddModal(false)
    }

    const handleSave = () => {
        const tripTimeLabel = tripTimeUnits.filter(time => time.value === timeUnit)[0]?.label
        let isValidationError = false
        if (!tripTimeLabel) {
            setIsTimeError(true)
            setTimeError('Invalid time unit')
            isValidationError = true
        }

        if (!REGEXPS.wholeNumber.test(startTime.toString())) {
            setError('Invalid start time')
            setIsError(true)
            isValidationError = true
        }

        if (!isValidationError) {
            const tripStartDetails = {
                timeWindow: startTime,
                timeUnit: tripTimeLabel,
                active: isTripStartBeforeTime,
                daNegativeAmount: negativeCashAmount,
                allowDaNegativeAmount: allowNegativeCashAmount
            }
            onSave(tripStartDetails)
            handleClosePopup()
        }
    }

    return <Modal
        open={isShowModal}
        onToggle={() => { }}
        width='599px'
        children={{
            header: (
                <ModalHeader
                    headerTitle={dynamicLabels && dynamicLabels.trip_start_time ? dynamicLabels.trip_start_time : "Early Trip Start Settings"}
                    handleClose={() => handleClosePopup()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <TripFormCont>
                    <Box style={{ marginBottom: '12px', fontSize: '15px', fontWeight: 400, color: '#000' }}>{dynamicLabels.trip_start_time}</Box>

                    <div className="row">
                        <span className="col-md-4  labelUnderlineWrapper"><div className="labelUnderline"></div></span>
                        <span className="col-md-8  labelLineWrapper"><div className="labelLine"></div></span>
                    </div>

                    <Box >
                        <Box display='flex'>
                            <Box fullWidth>
                                <TextInput
                                    id='field_key'
                                    fullWidth={true}
                                    required={false}
                                    placeholder={"Enter start time"}
                                    value={startTime}
                                    type="tel"
                                    maxLength={3}
                                    error={isError}
                                    style={{ margin: '0px' }}
                                    onChange={(e: any) => {
                                        setIsError(false)
                                        setStartTime(e.target.value)
                                    }}
                                />
                            </Box>
                            <Box fullWidth style={{ marginLeft: '8px' }}>
                                <DropDown
                                    variant='form-select'
                                    id='fieldType'
                                    optionList={tripTimeUnits}
                                    onChange={value => {
                                        setIsTimeError(false)
                                        setTimeUnit(value)
                                    }}
                                    placeholder='Select Unit'
                                    error={isTimeError}
                                    style={{ margin: '0px' }}
                                    value={timeUnit}
                                    required={true}
                                />
                            </Box>
                        </Box>
                        <Box display='flex' justifyContent='space-between'>
                            <Box style={{ color: 'red' }} fullWidth mt={"-16px"}>{isError ? error : null}</Box>
                            <Box style={{ color: 'red' }} fullWidth mt={"-16px"}>{isTimeError ? timeError : null}</Box> 
                        </Box>
                    </Box>

                    <Box display='flex' alignItems='flex-end' mt="0.6rem">
                        <Box style={{ marginRight: '12px', fontSize: '15px', fontWeight: 400 }}>{dynamicLabels.trip_start_before_time_warning}</Box>
                        <Toggle
                            checked={isTripStartBeforeTime}
                            onChange={() => setIsTripStartBeforeTime(isTripStartBeforeTime => !isTripStartBeforeTime)}
                        />
                    </Box>
                    <Box mt="0.6rem">
                        <AccordionHeaderSubTitle>{dynamicLabels && dynamicLabels.trip_start_before_time_warning_desc ?  dynamicLabels.trip_start_before_time_warning_desc : "Display a warning message to Delivery Associates if they attempt to start a trip before the Trip Start Time."}</AccordionHeaderSubTitle>
                    </Box>
                </TripFormCont>
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' pb="16px" pt="5px" px="15px">
                    <IconButton id='AddFormModal-actionBar-save' iconVariant='icomoon-save' primary onClick={() => handleSave()}>{dynamicLabels.save}</IconButton>
                    <IconButton id='AddFormModal-actionBar-cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => handleClosePopup()}>{dynamicLabels.cancel}</IconButton>
                </Box>
            ),
        }}


    />

}

export default TripStartFormModal
