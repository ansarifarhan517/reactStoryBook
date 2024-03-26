

import React, { Dispatch, useState, useEffect } from 'react'
import { Box, Modal, ModalHeader, IconButton, TextInput } from 'ui-library'
import DYNAMIC_LABELS_MAPPING from '../../common/DynamicLabels/dynamicLabels.mapping';
import useDynamicLabels from '../../common/DynamicLabels/useDynamicLabels';
import { IconButtonStyled } from './StyledPlans';
import uuid from 'uuid';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { useDispatch } from 'react-redux'
import { IPlansFormActions, ISection, ITierData } from './PlansForm.model'
import { roundingOfDigit } from '../../../utils/helper';

interface ITierPopup {
    showPopup: boolean
    setShowPopup: (showPopup: boolean) => void
    currency: string
    subscriptionType: string
}

const TierPopup = ({ showPopup, setShowPopup, currency, subscriptionType }: ITierPopup) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.saas.plans);
    const selectedRowId = useTypedSelector(state => state.saas.plans.selectedRow?.rowId)
    const selectedSectionId = useTypedSelector(state => state.saas.plans.selectedRow?.section)
    const rowWiseTierData = useTypedSelector(state => state.saas.plans.rowWiseTierData)
    const sectionData = useTypedSelector(state => state.saas.plans.sectionData)
    const currencySign = useTypedSelector(state => state.saas.plans.currencySign)
    const billlingCycle = useTypedSelector(state => state.saas.plans.billlingCycle)

    const dispatch = useDispatch<Dispatch<IPlansFormActions>>()


    const selectedRowObj = selectedSectionId && selectedRowId && sectionData?.[selectedSectionId]?.[selectedRowId]
    const validation = dynamicLabels?.toValueShouldBeGreaterThanFrom || `'To' value should be greater than 'From' value.`
    let selectedNoOFTransaction = selectedRowObj && Number(selectedRowObj.find((row: ISection) => row.id === 'numberOfTransaction')?.value)
    if (selectedSectionId === 'planDetails') {
        selectedNoOFTransaction = selectedRowObj && Number(selectedRowObj.find((row: ISection) => row.id === 'numberOfOrders' || row.id === 'numberOfDeliveryAssociates')?.value)
    }
    const fieldTitle = selectedSectionId === 'planDetails' ? subscriptionType === 'orders' ? 'Orders' : 'Delivery Associates' : 'Transactions'

    const firstTierData = {
        1: {
            id: '1',
            startingNoOfTransaction: 1,
            endingNoOfTransaction: undefined,
            price: undefined

        }
    }

    const [tierData, setTierData] = useState<ITierData | {}>(rowWiseTierData && selectedRowId && selectedSectionId ? rowWiseTierData?.[selectedSectionId]?.[selectedRowId.toString()] ?
        rowWiseTierData?.[selectedSectionId]?.[selectedRowId] : firstTierData : {})
    const [error, setError] = useState({})
    const [isEnable, setIsEnable] = useState<boolean>(true)

    useEffect(() => {
        if (showPopup && rowWiseTierData && selectedRowId && selectedSectionId) {
            setTierData(rowWiseTierData?.[selectedSectionId]?.[selectedRowId.toString()] ? rowWiseTierData?.[selectedSectionId]?.[selectedRowId.toString()] : firstTierData)
        }
    }, [selectedRowId, showPopup, selectedSectionId])

    const handleOkAction = () => {

        if (selectedRowId) {
            let errorFound = false
            let price = 0
            let isTierLessThanNoOfTransaction = false
            Object.values(tierData).forEach((tier: ITierData, index: number) => {
                const keys = Object.keys(tier)
                const startingNo = tier?.startingNoOfTransaction ? Number(tier?.startingNoOfTransaction) : undefined
                const endingNo = tier?.endingNoOfTransaction ? Number(tier?.endingNoOfTransaction) : undefined
                const rate = tier?.price ? Number(tier?.price) : undefined
                const errorObj = keys[index] === 'price' ? { price: dynamicLabels?.enterValidRate || 'Rate is mandatory.' } : { endingNoOfTransaction: validation }

                if (!endingNo || !startingNo || !rate) {
                    errorFound = true
                    let errorValue: { [key: string]: string } = { endingNoOfTransaction: validation }
                    // index 1 = startingNoOfTransaction , index 2 - endingNoOfTransaction, startingNo never be blank as auto populating it
                    if (!rate) {
                        errorValue = { price: dynamicLabels?.enterValidRate || 'Rate is mandatory.' }
                    }
                    setError({ ...error, [tier.id]: errorValue })
                    setIsEnable(false)

                }
                // else if (index === Object.values(tierData).length - 1 && endingNo < selectedNoOFTransaction) {
                //     errorFound = true
                //     // index 1 = startingNoOfTransaction , index 2 - endingNoOfTransaction, startingNo never be blank as auto populating it

                //     setError({ ...error, [tier.id]: errorObj })
                //     setIsEnable(false)
                // }
                else if (startingNo > endingNo || startingNo === endingNo) {
                    errorFound = true
                    setError({ ...error, [tier.id]: errorObj })
                    setIsEnable(false)

                }
                if (endingNo && rate && startingNo && selectedNoOFTransaction && endingNo < selectedNoOFTransaction) {
                    price = price + (rate * (endingNo - startingNo + 1))
                }
                // if last tier and outer transaction number is greter than ending no then go inside
                if (endingNo && rate && startingNo && selectedNoOFTransaction && endingNo < selectedNoOFTransaction && index === Object.values(tierData).length - 1) {
                    isTierLessThanNoOfTransaction = true
                    // price = price + (rate * (endingNo - startingNo + 1))
                } else if (endingNo && rate && startingNo && selectedNoOFTransaction && startingNo <= selectedNoOFTransaction && endingNo >= selectedNoOFTransaction) {
                    price = price + (rate * (selectedNoOFTransaction - startingNo + 1))
                }

            })
            if (!errorFound && selectedSectionId && selectedNoOFTransaction) {
                const newRowData = { ...rowWiseTierData, [selectedSectionId]: { ...rowWiseTierData[selectedSectionId], [selectedRowId]: tierData } }

                dispatch({ type: '@@plansForm/SET_ROWWISE_TIER_DATA', payload: newRowData })
                const dummySectionData = { ...sectionData }
                const indexOFPrice = selectedSectionId === 'planDetails' || selectedSectionId === 'recurringAddOn' ? 5 : 6
                const calculatedRate = price / selectedNoOFTransaction
                const roundedRate = roundingOfDigit(calculatedRate, 3)
                const newPrice = roundingOfDigit(roundedRate * selectedNoOFTransaction, 3)

                // 7 position price object always
                dummySectionData[selectedSectionId][selectedRowId][indexOFPrice] = { ...dummySectionData[selectedSectionId][selectedRowId][indexOFPrice], value: isTierLessThanNoOfTransaction ? undefined : newPrice }
                dummySectionData[selectedSectionId][selectedRowId][indexOFPrice + 1] = {
                    'id': 'tierRate',
                    'label': '',
                    'fieldType': 'number',
                    'readOnly': false, value: isTierLessThanNoOfTransaction ? undefined : newPrice
                }
                dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: dummySectionData })
                setShowPopup(false)
            }
        }

    }
    const onAdd = () => {
        const tierDataNew = { ...tierData }
        const keys = Object.keys(tierDataNew)
        const lastObjKey = keys[keys.length - 1]
        const lastObj = tierDataNew[lastObjKey]
        if (lastObj.endingNoOfTransaction && lastObj.startingNoOfTransaction && lastObj.price) {
            const startingNoOfTransaction = lastObj.startingNoOfTransaction ? Number(lastObj.startingNoOfTransaction) : undefined
            const endingNoOfTransaction = lastObj.endingNoOfTransaction ? Number(lastObj.endingNoOfTransaction) : undefined
            if (startingNoOfTransaction && endingNoOfTransaction && (startingNoOfTransaction > endingNoOfTransaction)) {
                setError({
                    ...error, [lastObjKey]: {
                        endingNoOfTransaction: validation
                    }
                })
            } else {
                const randomId = uuid.v4();
                const newStartingNoOfTransaction = lastObj.endingNoOfTransaction ? Number(lastObj.endingNoOfTransaction) + 1 : undefined

                tierDataNew[randomId] = {
                    id: randomId,
                    startingNoOfTransaction: newStartingNoOfTransaction,
                    endingNoOfTransaction: undefined,
                    price: undefined
                }
                setError({})
                setTierData(tierDataNew)

            }

        } else {
            setError({
                ...error, [lastObjKey]: {
                    startingNoOfTransaction: !lastObj.startingNoOfTransaction ? dynamicLabels?.mandatory || 'Starting no of transaction is mandatory.' : '',
                    endingNoOfTransaction: !lastObj.endingNoOfTransaction ? dynamicLabels?.mandatory || 'Ending no of transaction is mandatory.' : '',
                    price: !lastObj.price ? dynamicLabels?.mandatory || 'Rate is mandatory.' : ''
                }
            })
        }

    }
    const onDelete = (id: string) => {

        const keys = Object.keys(tierData)
        const indexOFSelection = keys.indexOf(id)
        const selectedObj = tierData[id]
        const values = Object.values(tierData)
        const newObj = { ...tierData }
        values.forEach((tier: ITierData, index: number) => {
            if (index === indexOFSelection + 1) {
                newObj[tier.id] = { ...tier, startingNoOfTransaction: selectedObj.startingNoOfTransaction }
            }

        })
        delete newObj[id]

        setTierData(newObj)
    }
    const onTextChange = (value: number, fieldId: string, tierId: string) => {
        if (!isEnable) {
            setIsEnable(true)
            setError({})
        }
        //const rowData = selectedRowId && rowWiseTierData?.[selectedRowId]
        let newValue = value ? Number(value) : undefined
        const keys = Object.keys(tierData)
        const indexOFSelection = keys.indexOf(tierId)
        // const selectedObj = tierData[tierId]
        const values = Object.values(tierData)
        const dummyTierData = { ...tierData }
        values.forEach((tier: ITierData, index: number) => {
            if (index === indexOFSelection) {
                if (fieldId === 'price' && newValue) {
                    newValue = roundingOfDigit(newValue, 3)
                }
                dummyTierData[tier.id] = { ...tier, [fieldId]: newValue }
            }
            if (index === indexOFSelection + 1 && fieldId === 'endingNoOfTransaction') {
                dummyTierData[tier.id] = { ...tier, startingNoOfTransaction: newValue ? newValue + 1 : undefined }
            }

        })
        setTierData(dummyTierData)

    }

    return <Modal open={showPopup} onToggle={(value) => { setShowPopup(value) }} size='lg'>
        {{
            header: <ModalHeader
                headerTitle='Tiers'
                imageVariant='icomoon-close'
                handleClose={() => setShowPopup(false)}
                width='100%'
            />,

            content: (
                <Box style={{ maxHeight: '280px' }}>
                    {Object.values(tierData).map((tier: any, index: number) => {
                        return <Box display='flex' key={index + tier.id} mt={index === 0 && error[tier.id] ? '31px' : '0px'} >
                            <Box display='flex' horizontalSpacing='10px' verticalSpacing='10px' fullWidth>
                                <TextInput
                                    type='number'
                                    fullWidth
                                    placeholder={`Starting Number Of ${fieldTitle}`}
                                    label={`Starting Number Of ${fieldTitle}`}
                                    required={false}
                                    error={error[tier.id] && error[tier.id].startingNoOfTransaction}
                                    errorMessage={error[tier.id] && error[tier.id].startingNoOfTransaction ? error[tier.id].startingNoOfTransaction : ''}
                                    readOnly
                                    value={tier.startingNoOfTransaction}
                                    onChange={(e: any) => onTextChange(e.target.value, 'startingNoOfTransaction', tier.id)}

                                />
                                <TextInput
                                    type='number'
                                    fullWidth
                                    placeholder={`Greater than ${tier.startingNoOfTransaction}`}
                                    label={`Ending Number Of ${fieldTitle}`}
                                    required={false}
                                    error={error[tier.id] && error[tier.id].endingNoOfTransaction}
                                    errorMessage={error[tier.id] && error[tier.id].endingNoOfTransaction ? error[tier.id].endingNoOfTransaction : ''}
                                    value={tier.endingNoOfTransaction}
                                    onChange={(e: any) => onTextChange(e.target.value, 'endingNoOfTransaction', tier.id)}

                                />
                                <TextInput
                                    type='number'
                                    fullWidth
                                    placeholder={currency ? `${subscriptionType === 'deliveryAssociates' && selectedSectionId === 'planDetails' ? billlingCycle : ''} Rate(${currencySign})` : 'Rate'}
                                    label={currency ? `${billlingCycle} Rate(${currencySign})` : 'Rate'}
                                    required={false}
                                    error={error[tier.id] && error[tier.id].price}
                                    errorMessage={error[tier.id] && error[tier.id].price ? error[tier.id].price : ''}
                                    value={tier.price}
                                    onChange={(e: any) => onTextChange(e.target.value, 'price', tier.id)}
                                />
                                <IconButtonStyled
                                    onClick={() => {
                                        onDelete(tier.id)
                                    }}
                                    onlyIcon
                                    style={(Object.values(tierData).length - 1 === 0 || index === 0) ? { visibility: 'hidden' } : {}}
                                    iconVariant='cross-circled'
                                    iconSize={15}
                                    hoverFeedback={false}
                                    color='#f44336'
                                    id={'remove' + index}
                                />

                                <IconButtonStyled
                                    onClick={() => {
                                        Object.values(tierData).length - 1 === index && onAdd()
                                    }}
                                    hoverFeedback={false}
                                    onlyIcon
                                    style={Object.values(tierData).length - 1 === index ? { marginLeft: '5px', marginBottom: '10px' } : { visibility: 'hidden', marginLeft: '5px', marginBottom: '10px' }}
                                    iconVariant='add'
                                    iconSize={10}
                                    color='#5698d3'
                                    id={'add'}
                                />
                            </Box>
                        </Box>


                    })
                    }
                </Box>),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                    <IconButton iconVariant='icomoon-tick-circled'
                        primary
                        onClick={handleOkAction}
                    >{dynamicLabels.ok}</IconButton>
                    <IconButton iconVariant='icomoon-close' iconSize={11}
                        onClick={() => {
                            setShowPopup(false)
                        }}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>
            )
        }}
    </Modal>

}
export default (TierPopup)