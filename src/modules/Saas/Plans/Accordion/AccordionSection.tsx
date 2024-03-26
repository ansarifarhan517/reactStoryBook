import React, { Fragment, useMemo, Dispatch, useEffect } from 'react'
import { accordionStructure } from '../PlansForm.utils'
import { Accordion, Box, TextInput, DropDown, DateRangePicker, FontIcon, useToast, Tooltip, NumberInput } from 'ui-library'
import { AccordionContent, AccordionHeaderTitle, StyledCustomFields, AccordionSectionStyled } from './StyledAccodion'
import uuid from 'uuid';
import { StyledSquare } from '../../../../utils/components/CellMapping/StyledCellMapping'
import { useDispatch } from 'react-redux'
import { IAddOn, IPlansFormActions, ISection } from '../PlansForm.model'
import { useTypedSelector } from '../../../../utils/redux/rootReducer'
import moment from 'moment'
import { roundingOfDigit } from '../../../../utils/helper';

interface IAccordionSection {
    addOnList: any
    allField: any
    subscriptionType: string
}

const intervalMap = {
    'Monthly': 1,
    'Quarterly': 3,
    'Half Yearly': 6,
    'Yearly': 12
}

const AccordionSection = ({ addOnList, allField, subscriptionType }: IAccordionSection) => {
    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<IPlansFormActions>>()
    const rowWiseTierData = useTypedSelector(state => state.saas.plans.rowWiseTierData)
    const isEditMode = useTypedSelector(state => state.saas.plans.isEditMode)
    const sectionData = useTypedSelector(state => state.saas.plans.sectionData)
    const planDetails = useTypedSelector(state => state.saas.plans.plansDetails)
    const selectedPlanRow = useTypedSelector(state => state.saas.plans.selectedPlanRow)
    const currencySign = useTypedSelector(state => state.saas.plans.currencySign)
    const billlingCycle = useTypedSelector(state => state.saas.plans.billlingCycle)

    const allowedOneTimeAddOn = ['CUSTOMIZATION', 'ONETIMEMILEINTEGRATION', 'SUPPORTCHANGE']
    const sections = Object.values(accordionStructure)
    const toast = useToast();
    const format = 'MM-DD-YYYY'
    const keys = Object.keys(accordionStructure)


    const expandedSections = useMemo(() => {
        const expandedObj = {}
        keys.forEach(key => {
            expandedObj[key] = false
        })
        return expandedObj
    }, [])
    const showStructure = allField.billingCurrency && allField.billingCurrency && allField.subscriptionType

    const getSectionData = () => {
        const data: any = {}
        const mapping = {
            oneTimeAddOn: addOnList?.oneTimeAddOn || [],
            recurringAddOn: addOnList?.recurringAddOn || [],
            planDetails: planDetails || []
        }
        // let planCount = 0; let onetimeCount = 0; let recurringAddon = 0

        // if (sectionData?.planDetails && planCount === 0 && isEditMode) {
        //     data.planDetails = {}
        //     planCount += 1
        //     if (planDetails) {
        //         const planUpdated = Object.values(sectionData?.planDetails).map(plan => {
        //             plan[0].options = planDetails
        //             return plan
        //         })
        //         const planKey = Object.keys(sectionData.planDetails)[0]
        //         data.planDetails[planKey] = planUpdated
        //     }
        // } if (sectionData?.oneTimeAddOn && onetimeCount === 0 && isEditMode) {
        //     onetimeCount += 1
        //     data.oneTimeAddOn = sectionData?.oneTimeAddOn
        // } if (sectionData?.recurringAddOn && recurringAddon === 0 && isEditMode) {
        //     recurringAddon += 1
        //     data.recurringAddOn = sectionData?.recurringAddOn
        // }
        // if (!sectionData?.planDetails || !sectionData?.oneTimeAddOn || !sectionData?.recurringAddOn) {
        sections.forEach(section => {
            let withAddOns = [...section.table.columns]
            // this is jst to check weather subscription got changed or not like if you get numberOfDeliveryAssociates count that means it was previously delivery associate and allField.subscriptionType tells you what is current 
            // if it is orders then field got changed or else it is not
            const isSubscriptionChanges = selectedPlanRow && (subscriptionType === 'orders' && selectedPlanRow?.find((plan: ISection) => plan.id === 'numberOfDeliveryAssociates')
                || subscriptionType === 'deliveryAssociates' && selectedPlanRow?.find((plan: ISection) => plan.id === 'numberOfOrders'))

            if (selectedPlanRow && section.id === 'planDetails' && !isSubscriptionChanges) {
                withAddOns = selectedPlanRow
                // withAddOns.splice(0, 0, { ...withAddOns['0'], price: selectedPlanRow.price, rate: selectedPlanRow.rate,planName:selectedPlanRow.planName, priceOption:selectedPlanRow.priceOption })
            }
            else if (section.id === 'oneTimeAddOn' || section.id === 'recurringAddOn' || section.id === 'planDetails') {
                const firstField = {
                    'id': section.id === 'planDetails' ? 'planName' : 'addOnName',
                    'label': section.id === 'planDetails' ? 'Plan Name' : 'Addon Name',
                    'fieldType': 'select',
                    'readOnly': false,
                    'options': mapping[section.id]
                }
                withAddOns.unshift(firstField)
                if (section.id === 'planDetails') {

                    const newField = subscriptionType === 'orders' ? {
                        'id': 'numberOfOrders',
                        'label': 'Number Of Orders',
                        'fieldType': 'number',
                        'readOnly': true

                    } : {
                        'id': 'numberOfDeliveryAssociates',
                        'label': 'Number Of Delivery Associates',
                        'fieldType': 'number',
                        'readOnly': true

                    }
                    withAddOns.splice(1, 0, newField)
                }

            }


            data[section.id] = {
                1: withAddOns
            }
        })
        // }
        return data
    }

    const [expanded, setExpanded] = React.useState(expandedSections)

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        const newExpandedSection = { ...expandedSections }
        newExpandedSection[accordianId] = isExpanded
        setExpanded(newExpandedSection)
    }

    const setSectionData = () => {
        const data: any = {}
        if (sectionData?.planDetails) {
            // data.planDetails = {}
            // if (planDetails) {
            //     const planUpdated = Object.values(sectionData?.planDetails).map(plan => {
            //         plan[0].options = planDetails
            //         return plan
            //     })
            //     const planKey = Object.keys(sectionData.planDetails)[0]
            //     data.planDetails[planKey] = planUpdated
            // }
            data.planDetails = sectionData.planDetails
        } if (sectionData?.oneTimeAddOn) {
            data.oneTimeAddOn = sectionData?.oneTimeAddOn || {}
        } if (sectionData?.recurringAddOn) {
            data.recurringAddOn = sectionData?.recurringAddOn || {}
        }
        return data
    }

    useEffect(() => {
        let count = 0
        let newSectionData = getSectionData()
        if (isEditMode && count === 0 && planDetails) {
            count += 1
            newSectionData = setSectionData()
        } else {
            newSectionData = getSectionData()
        }
        dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: newSectionData })

    }, [addOnList, planDetails, allField.subscriptionType, allField?.billingCurrency?.name])


    // const getTierPrice = (tierData: ITierData, selectedNoOFTransaction: number) => {
    //     let price: number | undefined = 0
    //     tierData && Object.values(tierData).forEach((tier: ITierData, index: number) => {
    //         const startingNo = tier?.startingNoOfTransaction ? Number(tier?.startingNoOfTransaction) : undefined
    //         const endingNo = tier?.endingNoOfTransaction ? Number(tier?.endingNoOfTransaction) : undefined
    //         const rate = tier?.price ? Number(tier?.price) : undefined
    //         // let say transaction number is 15, and end numbr is 14 which on last index, that means transaction number not falling in tiers
    //         if (endingNo && rate && startingNo && selectedNoOFTransaction > endingNo && Object.values(tierData).length - 1 === index) {
    //             price = undefined
    //         } else
    //             if (endingNo && rate && startingNo && endingNo <= selectedNoOFTransaction && price !== undefined) {
    //                 price = (price + (rate * (endingNo - startingNo + 1)))
    //             } else if (endingNo && rate && startingNo && startingNo <= selectedNoOFTransaction && endingNo >= selectedNoOFTransaction && price !== undefined) {
    //                 if (index == 0 && Object.values(tierData).length === 1) {
    //                     price = (price + (rate * (selectedNoOFTransaction)))
    //                 } else {
    //                     price = (price + (rate * (selectedNoOFTransaction - startingNo + 1)))
    //                 }
    //             }

    //     })
    //     return price
    // }


    const onAddClick = (id: string) => {
        if (sectionData) {
            const addBlankData = getSectionData()
            const randomId = uuid.v4();

            //{id, label, table:{column:[{},{}]}}
            const dummySection = { ...sectionData[id] }
            dummySection[randomId] = addBlankData[id]?.[1]

            dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: { ...sectionData, [id]: dummySection } })
        }

    }
    const onDeleteClick = (sectionInfoKey: any, sectionId: string) => {
        if (sectionData) {
            //{id, label, table:{column:[{},{}]}}
            const dummySection = { ...sectionData[sectionId] }
            delete dummySection[sectionInfoKey]
            dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: { ...sectionData, [sectionId]: dummySection } })
        }

    }
    const dateFormatter = React.useCallback((date: Date) => {
        return moment(date).format(format)
    }, [])

    const isAddonAlreadyAdded = (sectionData: { [key: string]: ISection[] } | undefined, addOnName: string | undefined) => {
        let repeatAddOn = false
        sectionData && Object.values(sectionData).forEach(row => {
            const addOnRowName = row?.[0]?.value
            if (addOnRowName && addOnName === addOnRowName) {
                repeatAddOn = true
            }
        })
        return repeatAddOn
    }

    const onChange = (value: string, columnName: string, rowId: string, section: string) => {
        const rowObj = sectionData && sectionData[section]?.[rowId]
        let repeatAddOn: boolean = false
        if (rowObj) {
            const newRowArray: any = []
            let selectedAddOn: IAddOn | undefined = undefined
            if (columnName === 'addOnName') {
                selectedAddOn = addOnList[section].find((addon: IAddOn) => addon.value === value)
                const addOnCode = selectedAddOn?.addonCode
                repeatAddOn = !!sectionData && isAddonAlreadyAdded(sectionData?.[section], addOnCode)
            }
            if (columnName === 'planName') {
                selectedAddOn = planDetails.find((addon: IAddOn) => addon.value === value)
            }
            Object.values(rowObj).forEach((element: any) => {
                if (repeatAddOn) {
                    if (element.id === 'addOnName') {
                        newRowArray.push({ ...element, value: "" })
                    } else {
                        newRowArray.push({ ...element, value: undefined })
                    }
                } else if (columnName === 'planName' || columnName === 'addOnName') {
                    if (element.id === 'numberOfTransaction' || element.id === 'numberOfOrders' || element.id === 'numberOfDeliveryAssociates') {
                        newRowArray.push({ ...element, value: 1 })
                    } else if (element.id === 'pricingOption') {
                        newRowArray.push({ ...element, value: selectedAddOn?.pricingScheme })
                    } else if (element.id === 'rate' || element.id === 'price') {
                        newRowArray.push({ ...element, value: (selectedAddOn?.price && selectedAddOn?.price > 0) ? roundingOfDigit(Number(selectedAddOn?.price), 3) : selectedAddOn?.price })
                    } else if (element.id === 'billingDate' && selectedAddOn) {
                        if (allowedOneTimeAddOn.includes(selectedAddOn.addonCode)) {
                            newRowArray.push({ ...element, value: ''});    
                        } else if (allField?.endOfTerm && allField?.nextBillingDate && allField?.endOfTerm === 'Y'){
                            const addValue = intervalMap[allField?.billingFrequency?.name] || 1;
                            const date = new Date(allField?.nextBillingDate)
                            const updateDate = moment(date.setMonth(date.getMonth() + addValue)).subtract(1, 'days').format(format);
                            newRowArray.push({ ...element, value: moment(allField?.nextBillingDate).format(format) + " - " + updateDate});
                        } else {
                            const addValue = intervalMap[allField?.billingFrequency?.name] || 1;
                            const currentDt = new Date();
                            let updateDate = moment(currentDt.setMonth(currentDt.getMonth() + addValue)).subtract(1, 'days').format(format);
                            if (allField?.nextBillingDate && moment(allField?.nextBillingDate).subtract(1, 'days').format(format) < updateDate) {
                                updateDate = moment(allField?.nextBillingDate).subtract(1, 'days').format(format);
                            }
                            newRowArray.push({ ...element, value: moment(new Date()).format(format) + " - " + updateDate});
                        }
                    } else if (element && element?.id === 'tiers') {
                        const sectionRowTierData = { ...rowWiseTierData }
                        sectionRowTierData?.[section]?.[rowId] && delete sectionRowTierData?.[section]?.[rowId];
                        dispatch({ type: '@@plansForm/SET_ROWWISE_TIER_DATA', payload: sectionRowTierData })
                        newRowArray.push(element)
                    }
                    else if (element && element?.id === columnName) {
                        newRowArray.push({ ...element, value })
                    } else {
                        newRowArray.push(element)
                    }
                } else if (columnName === 'rate' && element?.id === 'price') {
                    const numberOfOrders = rowObj.find((row: { id: string }) => (row.id === 'numberOfOrders' || row.id === 'numberOfDeliveryAssociates' || row.id === 'numberOfTransaction'))
                    //  const priceOption = rowObj.find((row: { id: string }) => (row.id === 'pricingOption'))
                    const price = roundingOfDigit((Number(numberOfOrders?.value) * Number(value)), 3)
                    newRowArray.push({ ...element, value: price })
                    // if (priceOption?.value === 'unit') {
                    //     newRowArray.push({ ...element, value: price })
                    // } else if (priceOption?.value === 'tier') {
                    //     const pp = getTierPrice(rowWiseTierData?.[section]?.[rowId], Number(numberOfOrders))
                    //     // write here logic to take data from rowWiseData and create price
                    //     newRowArray.push({ ...element, value: pp })
                    // }

                } else if ((columnName === 'numberOfOrders' || columnName === 'numberOfDeliveryAssociates') && element?.id === 'price' && section === 'planDetails') {
                    const rate = rowObj.find((row: { id: string }) => (row?.id === 'rate'))
                    newRowArray.push({ ...element, value: roundingOfDigit((Number(rate?.value) * Number(value)), 3) })
                    // for later use keeping code
                    // const priceOption = rowObj.find((row: { id: string }) => (row?.id === 'pricingOption'))
                    // if (priceOption?.value === 'unit') {
                    //     newRowArray.push({ ...element, value: (rate?.value * Number(value)) })
                    // } 
                    // else if (priceOption?.value === 'tier') {
                    //     const pp = getTierPrice(rowWiseTierData?.[section]?.[rowId], Number(value))
                    //     // write here logic to take data from rowWiseData and create price
                    //     newRowArray.push({ ...element, value: pp })
                    // }

                } else if (columnName === 'rate' && element?.id === 'price') {
                    const numberOfTransactionObj = rowObj.find((row: { id: string }) => row?.id === 'numberOfTransaction')
                    const price = roundingOfDigit((Number(numberOfTransactionObj?.value) * Number(value)), 3)
                    newRowArray.push({ ...element, value: price })

                } else if (columnName === 'numberOfTransaction' && element?.id === 'price') {
                    const rateObj = rowObj.find((row: { id: string }) => row?.id === 'rate')
                    // const priceOption = rowObj.find((row: { id: string }) => (row?.id === 'pricingOption'))
                    newRowArray.push({ ...element, value: roundingOfDigit((Number(value) * Number(rateObj?.value)), 3) })

                    // if (priceOption?.value === 'unit') {
                    //     newRowArray.push({ ...element, value: roundingOfDigit((Number(value) * Number(rateObj?.value)), 3) })
                    // } else if (priceOption?.value === 'tier') {
                    //     const pp = getTierPrice(rowWiseTierData?.[section]?.[rowId], Number(value))
                    //     // write here logic to take data from rowWiseData and create price
                    //     newRowArray.push({ ...element, value: pp })
                    // }
                    // newRowArray.push({ ...element, value: price })
                    // if changing pricing option then change price along with that, if 
                } else if (element?.id === 'price' && columnName === 'pricingOption') {
                    const rate = rowObj.find((row: { id: string }) => (row?.id === 'rate'))
                    const numberOfOrders = rowObj.find((row: { id: string }) => (row.id === 'numberOfOrders' || row.id === 'numberOfDeliveryAssociates' || row.id === 'numberOfTransaction'))
                    newRowArray.push({ ...element, value: roundingOfDigit((Number(rate?.value) * Number(numberOfOrders?.value)), 3) })
                    // if (value === 'unit') {
                    //     newRowArray.push({ ...element, value: (Number(rate?.value) * Number(numberOfOrders?.value)) })
                    // } else if (value === 'tier') {
                    //     const pp = getTierPrice(rowWiseTierData?.[section]?.[rowId], Number(numberOfOrders?.value))
                    //     // write here logic to take data from rowWiseData and create price
                    //     newRowArray.push({ ...element, value: rowWiseTierData?.[section]?.[rowId] ? pp : undefined })
                    // }
                }
                else if (element && element?.id === columnName) {
                    let _value: string | number = value
                    if (value && !isNaN(Number(value) ) ) {
                        _value = roundingOfDigit(Number(value), 3)
                    }

                    newRowArray.push({ ...element, value: _value })
                } else {
                    newRowArray.push(element)
                }
            });
            if (section === 'planDetails') {
                dispatch({ type: '@@plansForm/SET_SELECTED_PLAN', payload: newRowArray })
            }
            const dummySection = { ...sectionData }
            dummySection[section][rowId] = newRowArray
            dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: dummySection })
            if (repeatAddOn) {
                toast.add('Selected Addon is Already used', 'warning', false)
            }


        }
    }
    // const dateToString = (d: Date) => {
    //     return moment(d).format(format)
    // }

    const stringToDate = React.useCallback((str: string) => {
        return moment(str, format).toDate()
    }, [])
    const getAccordionField = (column: any, rowId: string, section: string) => {
        const rowObj = sectionData && sectionData[section]?.[rowId]
        const isBillingElibleIncluded = !!rowObj //&& allowedOneTimeAddOn.includes(rowObj[0]?.value)
        const _value = !isNaN(Number(column.value)) ? Number(roundingOfDigit(Number(column.value), 3)) : column.value

        // const price = getTierPrice(rowWiseTierData?.[section]?.[rowId], rowObj.price)
        // console.log(price,'pricepriceprice')
        const getField = () => {
            switch (column.fieldType) {
                case 'number':
                    return <NumberInput
                    className='number-class'
                    error={false}
                    onChange={(value) => onChange(value, column.id, rowId, section)}
                    variant='inline-edit'
                    style={{ borderBottom: '1px dashed black' }}
                    allowDecimal = {false}
                    value={_value || (Number(column.value) < 0 ? '' : column.value)}
                    initialValue={_value || (Number(column.value) < 0 ? '' : column.value)}
                    roundingoffDigit={3}
                    />
                case 'decimal':
                    return <input type="number" pattern="/^-?[0-9]\d*(\.\d+)?$/"
                     onChange={(e) => onChange(e.target.value, column.id, rowId, section)}
                    value={_value || (Number(column.value) < 0 ? '' : column.value)}
                    style={{ borderBottom: '1px dashed black',width:"100%",height:"24px" }}
                  />
                case 'text':
                    return <TextInput
                        className='text-class'
                        error={false}
                        onChange={(e) => onChange(e.target.value, column.id, rowId, section)}
                        variant='inline-edit'
                        style={{ borderBottom: '1px dashed black' }}
                        
                        value={column.value}
                    />
                case 'select':
                    return <DropDown
                        className='dropdown-class'
                        variant='dashed-dropdown'
                        optionList={(column.id === 'addOnName' || column.id === 'planName') ? column.options : (rowObj?.[0]?.value ? column.options : [])}
                        onChange={(value: string) => {
                            onChange(value, column.id, rowId, section)
                        }}
                        readOnly
                        width='100%'
                        disabled={false}
                        value={column?.value}
                        style={{ borderBottom: '1px dashed black' }}
                    />

                case 'calendar':
                    let startDate = new Date()
                    let endDate = new Date()
                    if (column.value) {
                        const splittedValue = column?.value?.split(' - ')
                        startDate = splittedValue[0] && moment(splittedValue[0]).toDate()
                        endDate = splittedValue[1] && moment(splittedValue[1]).toDate()
                    }
                    return <DateRangePicker
                        label=''
                        variant='daterange'
                        showTime={false}
                        startDate={startDate}
                        endDate={endDate}
                        style={{
                            position: 'absolute',
                            top: 'auto',
                            right: 'auto',
                            zIndex: 1,
                        }}
                        stringToDate={stringToDate}
                        fromDateFormatter={dateFormatter}
                        toDateFormatter={dateFormatter}
                        onApply={(range) => {
                            if (range) {
                                const newRowArray: any = []
                                const from = range[0]
                                const to = range[1]

                                from.setHours(0)
                                from.setMinutes(0)
                                from.setSeconds(0)
                                to.setHours(0)
                                to.setMinutes(0)
                                to.setSeconds(0)
                                const dummySection = { ...sectionData }
                                rowObj && Object.values(rowObj).forEach((row: any) => {
                                    if (row.id === 'billingDate') {
                                        newRowArray.push({ ...row, value: moment(from).format(format) + ' - ' + moment(to).format(format) })
                                    } else {
                                        newRowArray.push(row)
                                    }
                                })
                                dummySection[section][rowId] = newRowArray
                                dispatch({ type: '@@plansForm/SET_SECTION_DATA', payload: dummySection })


                            }
                        }}
                    >
                        {({ open, setOpen }) => {

                            const splittedValue = column?.value?.split(' - ')
                            return (
                                <div onClick={() => isBillingElibleIncluded && setOpen(!open)}>
                                    <TextInput
                                        iconVariant='calendar'
                                        // variant='withIcon'
                                        className='text-class'
                                        error={false}
                                        //onChange={(e) => onChange(e.target.value, column.id, rowId, section)}
                                        variant='inline-edit'
                                        value={isBillingElibleIncluded ? (column.value ? splittedValue[0] + ' - ' + splittedValue[1] : '') : ''}
                                        iconSize='md'
                                        style={isBillingElibleIncluded ? { borderBottom: '1px dashed black' } : {
                                            borderBottom: '1px dashed black', background: 'grey', opacity: '0.1'
                                        }}
                                        iconStyle={{ padding: '9px 9px 9px 9px' }}
                                        readOnly
                                    />
                                    <span style={{ position: 'absolute', right: '2%', top: '16%' }}><FontIcon variant='calendar' size='sm' color='primary.main' /></span>
                                </div>
                            )
                        }}
                    </DateRangePicker>

                case 'square': return <StyledSquare
                    disabled={false}
                    onClick={() => {
                        dispatch({ type: '@@plansForm/SET_SELECTED_ROW', payload: { rowId: rowId, section: section } })
                        //setShowTier(true)
                    }}
                    className='square-button'
                >
                    {rowWiseTierData && rowWiseTierData?.[section]?.[rowId.toString()] ? Object.values(rowWiseTierData?.[section]?.[rowId.toString()]).length : 0}
                </StyledSquare>
                default:
                    return <div style={{ width: '100px', textAlign: 'start' }}>{_value}</div>


            }
        }
        return <StyledCustomFields>{getField()}</StyledCustomFields>

    }

    return <AccordionSectionStyled showStructure={!!showStructure}
        id='accordion-section'>{sections.map((section, index) =>
            <Accordion key={section?.id + index} id={section?.id} expanded={!!expanded[section?.id]} onToggle={handleToggle}>
                {{
                    header: (
                        <>
                            <AccordionHeaderTitle>{section.label}</AccordionHeaderTitle>
                        </>
                    ),
                    content: (<>
                        <AccordionContent>
                            <div className="flex-container">
                                <div className='row'>
                                    {
                                        sectionData && sectionData[section.id] && Object.values(sectionData[section.id])?.map((column: any, headerIndex: number) => {
                                            const pricingOption = column?.find((element: any) => element.id === 'pricingOption')
                                            const pricingValue = pricingOption?.value
                                            if (headerIndex === 0) {
                                                return column?.map((element: any, elementIndex: number) => {
                                                    let label = element.label
                                                    if (element.id === 'tierRate') {
                                                        return
                                                    }
                                                    if ((element.id === 'rate' || element.id === 'tiers') && allField.billingCurrency) {
                                                        label = subscriptionType === 'deliveryAssociates' && section?.id === 'planDetails' ? `${billlingCycle} Rate(${currencySign})` : `Rate(${currencySign})`

                                                    }
                                                    // if choosing tier option then dont show rate
                                                    if ((pricingValue === 'tier') && element.id === 'rate') {
                                                        return
                                                    }
                                                    if ((pricingValue === 'unit' || pricingValue === undefined) && element.id === 'tiers') {
                                                        return
                                                    }
                                                    if (!isEditMode && (element.id === 'billingStartDate' || element.id === 'billingEndDate')) {
                                                        return
                                                    }
                                                    if (element.id === 'price' && allField.billingCurrency) {
                                                        label = subscriptionType === 'deliveryAssociates' && section?.id === 'planDetails' ? `${billlingCycle} ${element.label}(${currencySign})` : `${element.label}(${currencySign})`
                                                    }
                                                    if (section?.id !== 'planDetails' && element.id === 'rate') {
                                                        return <div className='child' key={element.id + elementIndex}>
                                                            <span style={{ marginRight: '5px' }}>{label}</span>
                                                            <Tooltip message={`For Orders, Emails, SMS & IVR Calls, Unit Rate(${currencySign}) is displayed.For Delivery Associates, ${billlingCycle} Rate(${currencySign}) is displayed.`} hover={true}>
                                                                <FontIcon variant='icomoon-warning-circled' size='sm' />
                                                            </Tooltip>
                                                        </div>
                                                    } else return <div className='child' key={element.id + elementIndex} title={element.label} >{label}</div>
                                                })
                                            }
                                            return

                                        })

                                    }

                                </div>
                                <div className='border-bottom'></div>
                                {
                                    //{1:[{}]}
                                    sectionData && showStructure && sectionData[section.id] && Object.values(sectionData[section.id]).map((sectionInfo: any, sectionIndex: number) => {

                                        const accordionDataKeys = Object.keys(sectionData[section.id])

                                        const pricingOption = sectionInfo?.find((element: any) => element.id === 'pricingOption')
                                        const pricingValue = pricingOption?.value
                                        // const aa=  sectionData[section.id]
                                        //[[{}],[{}]]
                                        const accodionData = sectionInfo && Object.values(sectionInfo)
                                        return <><div className='row'> {
                                            accodionData.map((column: any, index: number) => {
                                                if (column.id === 'tierRate') {
                                                    return
                                                }
                                                // if choosing tier option then dont show rate
                                                if ((pricingValue === 'tier') && column.id === 'rate') {
                                                    return
                                                }
                                                if ((pricingValue === 'unit' || pricingValue === undefined) && column.id === 'tiers') {
                                                    return
                                                }
                                                if (!isEditMode && (column.id === 'billingStartDate' || column.id === 'billingEndDate')) {
                                                    return
                                                }
                                                return <div
                                                    className='child'
                                                    key={column.id + index + index}
                                                    style={(column.id === 'price') && section?.isDelete ? { display: 'flex', alignItems: 'center' } : {}}
                                                >
                                                    {getAccordionField(column, accordionDataKeys[sectionIndex], section.id)}

                                                    {(column.id === 'price') && section?.isDelete ?
                                                        <span
                                                            onClick={() => onDeleteClick(accordionDataKeys[sectionIndex], section.id)}
                                                        >
                                                            <FontIcon
                                                                variant="icomoon-delete"
                                                                color='primary.main'
                                                                size={15}
                                                                style={{ marginBottom: '10px', marginRight: '10px' }}

                                                            />
                                                        </span> : <Fragment />}

                                                </div>



                                            })}
                                        </div>
                                            <div className='border-bottom'></div>
                                        </>


                                    })
                                }
                            </div>
                        </AccordionContent>
                        {section?.addLabel && <AccordionContent>
                            <Box style={{ border: '3px dashed #5698d3' }} display='flex'>
                                <div className='add-addon' onClick={() => {
                                    showStructure ? onAddClick(section?.id) : toast.add('Please Select Billing Cycle, Billing Frequency and Subscription Type', 'check-round', false)
                                }}>
                                    {section?.addLabel}
                                </div>
                            </Box> </AccordionContent>}
                    </>
                    )
                }}
            </Accordion>

        )}</AccordionSectionStyled >

}

export default AccordionSection