import React, { Dispatch, ChangeEvent } from 'react';
import { Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, FontIcon, AccordionContent, Grid, Box, useToast, withToastProvider} from 'ui-library'
import FormField from '../../../utils/components/Form/FormField';
import { AddLineItemButtonWrapper, AddLineItemTextWrapper, CrateModalHeaderWrapper } from './StyleComponents';
import { deepCopy, generateRandomID } from '../../../utils/helper';
import apiMappings from '../../../utils/apiMapping';
import axios from '../../../utils/axios';
import { useDispatch } from 'react-redux';
import { IAddOrderFormActions } from '../AddOrderForm/AddOrderForm.actions';
import { ICrateData, ICrateItemData, IDragProps } from '../AddOrderForm/AddOrderForm.models';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { CrateModalOperations } from './CrateModalOperations'
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';
import { updateCounter } from './CrateHelper';

interface ICrateComponentProps {
    sectionKeys: string[]
    crateStructure: object
    crateFormInstance: UseFormMethods<FieldValues>
    itemKeys: string[]
    itemStructure: object
    formatCrateData: Function
}

const CrateComponent = (props: ICrateComponentProps) => {
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const toastMsg = useToast()
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    const crateType = useTypedSelector(state => state.orderForm.crateType)
    const isOptimizeFl = useTypedSelector(state => state.orderForm.isOptimizeFl)
    const crateData = useTypedSelector(state => state.orderForm.crateData)
    const crateExpanded = useTypedSelector(state => state.orderForm.crateExpanded)
    const itemExpanded = useTypedSelector(state => state.orderForm.itemExpanded)
    const AddDeleteCount = useTypedSelector(state => state.orderForm.AddDeleteCount)

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        dispatch({ type: '@@addOrderForm/SET_EXPANDED', payload: {key: 'crate', value: (isExpanded ? accordianId : '')} });
    }

    const handleToggleItems = (itemAccordianId: string, isExpanded?: boolean) => {
        dispatch({ type: '@@addOrderForm/SET_EXPANDED', payload: {key: 'item', value: (isExpanded ? itemAccordianId : '')} });
    }
    const {sectionKeys, crateStructure, crateFormInstance, itemKeys, itemStructure, formatCrateData} = props
    const { getValues, setValue, errors, clearErrors } = crateFormInstance; 
    // const { addRemoveNewLineItem } = CrateModalOperations()

    const getCrateName = async (value: ChangeEvent<HTMLInputElement>, crate: ICrateData, crateIndex: number) => {
        if(value){
            const crateId = crate.id
            try {
                const { data } = await axios.get(`${apiMappings.order.form.getCrateNameData}${value['name']}`)
                if (data) {
                    updateCrateDataByCrateName(crateId, data, crateIndex);
                }
            } catch (error) {
                toastMsg.add(error?.response?.data?.message || dynamicLabels.somethingWendWrong, 'warning', false)
            }
        }
    }

    const updateCrateDataByCrateName = (parentCrateId: string, responseData: ICrateData, index: number) => {
        const clonedCrateData = deepCopy(crateData)
        clonedCrateData.forEach((subValue: ICrateData)  => {
            if (subValue['id'] == parentCrateId) {
                subValue['crateType'] = responseData['cratetypecd'];
                subValue["crateWeight"] = responseData["capacityWeight"];
                subValue["crateVolume"] = responseData["capacityInVolume"];
                subValue["crateLength"] = responseData["crateLength"];
                subValue["crateBreadth"] = responseData["crateBreadth"];
                subValue["crateHeight"] = responseData["crateHeight"];
                subValue["crateMinTemperature"] = responseData["minTemperature"]; 
                subValue["crateMaxTemperature"] = responseData["maxTemperature"];
                subValue["crateTemperatureCategory"] = responseData["temperatureCategory"];
                subValue["temperatureCategorySelection"] = { name: responseData["temperatureCategory"], id: '1' };
                subValue["crateName"] = { name: responseData['crateName'], id: responseData['crateName'] };

            }
        });
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: clonedCrateData});
        formatCrateData(clonedCrateData)
    }

    const onDragEnd = (result: IDragProps) => {
        const { source, destination } = result;
        if (destination) {
            if (source.droppableId !== destination.droppableId) {
                const formData = getValues();
                const sourceIndex = source.droppableId.split('-')[1];
                const destinationIndex = destination.droppableId.split('-')[1]
                const newCrateData = deepCopy(crateData)
                const removed = newCrateData[sourceIndex].shipmentlineitems.splice(source.index, 1)
                newCrateData[destinationIndex].shipmentlineitems.push(removed[0]);
                dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: newCrateData });
                const newItemIndex = newCrateData[destinationIndex].shipmentlineitems.length - 1
                const selectedItemData = formData.crateData[sourceIndex].shipmentlineitems[source.index]
                for (let key in selectedItemData) {
                    setValue(`crateData[${destinationIndex}].shipmentlineitems[${newItemIndex}].${key}`, selectedItemData[key])
                }
            }
        }
    }

    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        background: isDragging ? 'grey' : '',
        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = (isDraggingOver: boolean) => ({
        background: isDraggingOver ? 'lightgrey' : ''
    });

    const getErrors = (index: number, field: string) => {
        let message;
        if (errors.crateData) {
          if (errors.crateData[index]) {
            if (errors.crateData[index][field]) {
              /* if (errors.friends[index][field]["message"]) {
                message = errors.friends[index][field]["message"];
              } */
              message = "Please enter value in " + field

            }
          }
        }
        if (message) {
            return true
        } else {
            return false;
        }
    };

    const getItemErrors = (crateIndex: number, itemIndex: number, field: string) => {
        if (errors.crateData && errors.crateData[crateIndex] && errors.crateData[crateIndex]['shipmentlineitems']) {
            if (errors.crateData[crateIndex]['shipmentlineitems'][itemIndex]?.[field]) {
                return true
            }
            else {
                return false
            }
        } else {
            return false
        } 
    }

    const setErrorType = (crateIndex: number, sectionName: string, meta: any) => {
        errors.crateData && errors.crateData[crateIndex] && errors.crateData[crateIndex][sectionName] ? meta['errorType'] =  errors.crateData[crateIndex][sectionName].type : meta['errorType'] = ''
    }

    const setItemErrorType = (crateIndex: number, itemIndex: number, itemKeyName: string, meta: any) => {
        errors.crateData && errors.crateData[crateIndex] && errors.crateData[crateIndex]['shipmentlineitems'] && errors.crateData[crateIndex]['shipmentlineitems'][itemIndex]?.[itemKeyName]  ? meta['errorType'] =  errors.crateData[crateIndex]['shipmentlineitems'][itemIndex][itemKeyName].type : meta['errorType'] = ''
    }

    const addRemoveNewCrate = ( event: any, method: string, id: string | undefined, buttonClick?: string) => {
        let newCrateData = deepCopy(crateData)
        if (crateType == 'a') {
            if (method == 'add') {
                if (buttonClick) {
                    event.keyCode = 13
                } else {
                    // val = event.target.value.trim()
                }

                if (event.keyCode == 13) {

                        dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount + 1 });
                        const crateId = generateRandomID();
                        if(newCrateData.length && newCrateData[0].shipmentDetailsId){
                            newCrateData.push({
                                crateCd: "",
                                newItem: true,
                                noOfUnits:0,
                                itemCounter: 0,
                                shipmentDetailsId:newCrateData[0].shipmentDetailsId,
                                id: crateId,
                                shipmentlineitems: [],
                                isDeleteFl: 'N'
                            });
                        } else{
                            newCrateData.push({
                                crateCd: "",
                                newItem: true,
                                itemCounter: 0,
                                noOfUnits:0,
                                id:crateId,
                                shipmentlineitems: [],
                                isDeleteFl: 'N'
                            })
                        }
                        event.target.value = '';
                        dispatch({ type: '@@addOrderForm/SET_EXPANDED', payload: {key: 'crate', value: crateId} });
                }
            } else {
                newCrateData.forEach((e: ICrateData, crateIndex: number) => {
                    if (String(e.id) == id) {
                        e.isDeleteFl = 'Y'
                        if (errors?.crateData && errors.crateData[crateIndex]) {
                            clearErrors(`crateData[${crateIndex}]`)
                        }
                    }
                })
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
            }
            updateCounter(newCrateData, 'crate');
        } else {
            if (method == 'add') {

                if (buttonClick) {
                    // var val = "crate1"
                    event.keyCode = 13
                }

                if (event.keyCode == 13) {

                        dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
                        newCrateData.push({

                            crateCd: "",
                            newItem: true,
                            itemCounter: 0,

                            id: generateRandomID(),

                            isDeleteFl: 'N'
                        })
                        event.target.value = '';
                }

            } else {
                if(newCrateData.length === 1){
                    return
                }
                newCrateData.forEach( function (e: ICrateData, crateIndex: number) {
                    if (String(e.id) == id) {
                        e.isDeleteFl = 'Y'
                        clearErrors(`crateData[${crateIndex}]`)
                    }
                })
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
            }
            updateCounter(newCrateData, 'crate');
        }
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: newCrateData });
    }

    const addRemoveNewLineItem = (id: string, method: string, crateId?: string) => {
        let newCrateData = deepCopy(crateData)
        if (crateType == 'a') {
            var itemId = '';
            if (method == 'add') {
                newCrateData.forEach((e: ICrateData) => {
                    if (String(e.id) == id) {
                        itemId = generateRandomID();
                        e.itemCounter = ++e.itemCounter;
                        if(newCrateData.length && newCrateData[0].shipmentDetailsId){
                            e['shipmentlineitems'].push({
                                itemCd: "",
                                itemName: "",
                                itemPrice: "",
                                itemQuantity: "",
                                itemType: '',
                                itemWeight: "",
                                minTemperature: "",
                                maxTemperature: "",
                                temperatureCategory: "",
                                newItem: true,
                                id: itemId,
                                isDeleteFl: 'N',
                                shipmentDetailsId: newCrateData[0].shipmentDetailsId,
                                shipmentLineItemId:""
                            });
                        } else {
                            e['shipmentlineitems'].push({
                                itemCd: "",
                                itemName: "",
                                itemPrice: "",
                                itemQuantity: "",
                                itemType: '',
                                itemWeight: "",
                                minTemperature: "",
                                maxTemperature: "",
                                temperatureCategory: "",
                                newItem: true,
                                id: itemId,
                                isDeleteFl: 'N'
                            });
                        }
                        dispatch({ type: '@@addOrderForm/SET_EXPANDED', payload: {key: 'item', value: itemId} });
                    }
                })
            } else {
                newCrateData.forEach((e: ICrateData, crateIndex: number) => {
                    if (String(e.id) == id) {
                        e.itemCounter = --e.itemCounter;
                        e['shipmentlineitems'].forEach((ee: ICrateItemData, itemIndex: number) => {
                            if (String(ee.id) == crateId) {
                                ee.isDeleteFl = 'Y';
                                if (errors?.crateData?.[crateIndex]?.['shipmentlineitems'] && errors.crateData[crateIndex]['shipmentlineitems'][itemIndex]) {
                                    clearErrors(`crateData[${crateIndex}][shipmentlineitems][${itemIndex}]`)
                                }
                            }
                        })
                    }
                })
            }
            updateCounter(newCrateData, 'item', id);

        } else {
            
            if (method == 'add') {
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount + 1 });

                newCrateData.push({
                    crateCd: '',
                    newItem: true,
                    id: generateRandomID(),
                    shipmentlineitems: [],
                    isDeleteFl: 'N'
                });
            } else {
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
                let newList;
                var activeCrate = false
                newCrateData.forEach((e: ICrateData) => {
                    if (String(e.id) == id) {
                        e.isDeleteFl = 'Y'
                    }
                    if (e.isDeleteFl == 'N') {
                        activeCrate = true
                        newList.push(e)
                    }
                })
                newCrateData = newList

                if (!activeCrate) {
                    activeCrate = false
                    newCrateData.push({
                        crateCd: '',
                        newItem: true,
                        id: generateRandomID(),
                        shipmentlineitems: [],
                        isDeleteFl: 'N'
                    });
                }
            }
            
        }
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: newCrateData });
    }
    
    
    return (
        <>
        <div id='toast-inject-here'></div>
        <Box bgColor='white'> 
            {crateData?.length ?       
                <DragDropContext onDragEnd={onDragEnd}>
                    {crateData?.length ? crateData?.map((crateObj: ICrateData, crateIndex: number) => {
                        return (
                            <Droppable droppableId={`droppable-${crateIndex}`} key={crateObj.id}>
                                {(provided: any, snapshot: any) => (
                                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                                        { crateObj.isDeleteFl !== 'Y' &&
                                            <Accordion id={crateObj.id} expanded={crateExpanded === crateObj.id} onToggle={handleToggle}>
                                            {{
                                                header: (
                                                <>
                                                    <CrateModalHeaderWrapper className="crate-modal-header-wrapper">
                                                    <div>
                                                        <AccordionHeaderTitle> {dynamicLabels.crate_s} {crateObj?.crateCounter ? crateObj.crateCounter : crateIndex + 1}</AccordionHeaderTitle>
                                                        <AccordionHeaderSubTitle>
                                                            Total No of {dynamicLabels.item_p} {crateObj.shipmentlineitems ? crateObj.shipmentlineitems.length : 0}
                                                        </AccordionHeaderSubTitle>
                                                    </div>
                                                    <div style={{paddingTop: '10px'}} onClick={(e) => addRemoveNewCrate(e,'remove',crateObj.id)}>
                                                        <FontIcon variant={'icomoon-delete-empty'} size={'sm'}/>
                                                    </div>
                                                    </CrateModalHeaderWrapper>
                                                </>
                                                ),
                                                content: (
                                                <AccordionContent>
                                                    <Grid container spacing='10px' style={{ marginBottom: '15px', paddingTop: '35px' }}>
                                                        {sectionKeys.length > 0 && sectionKeys.map((sectionName: string) => {
                                                            const meta = crateStructure[sectionName]
                                                            meta.multipleFiles = false
                                                            // meta.id = `${meta.id}-${crateIndex}` 
                                                            if (isOptimizeFl && sectionName === 'crateName') {
                                                                return (
                                                                    <>
                                                                        <Grid item key={sectionName} xs={12} sm={4} md={2} className='grid-item'>
                                                                        <FormField
                                                                            name={`crateData[${crateIndex}].${sectionName}`}
                                                                            meta={meta}
                                                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {getCrateName(e, crateObj, crateIndex)}}
                                                                            formInstance={crateFormInstance}/>
                                                                        </Grid>
                                                                    </>
                                                                )

                                                            } else {
                                                                return (
                                                                    <>
                                                                        <Grid item key={sectionName} xs={12} sm={4} md={2} className='grid-item'>
                                                                        <FormField name={`crateData[${crateIndex}].${sectionName}`} meta={meta} formInstance={crateFormInstance}/>
                                                                        { setErrorType(crateIndex, sectionName, meta) }
                                                                        { getErrors(crateIndex, sectionName) ? meta['isError'] = true :  meta['isError'] = false }
                                                                        </Grid>
                                                                    </>
                                                                )
                                                            }    
                                                        })}

                                                    </Grid>

                                                    {crateObj.shipmentlineitems && crateObj.shipmentlineitems.map((itemObj: ICrateItemData, itemIndex: number) => {
                                                        
                                                        return (
                                                            <Draggable key={String(itemObj.id)} draggableId={String(itemObj.id)} index={itemIndex}>
                                                                {(provided: any, snapshot: any) => (
                                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                                                                        {itemObj.isDeleteFl !== 'Y' &&
                                                                        <Accordion id={itemObj.id} key={itemObj.id} expanded={itemExpanded === itemObj.id} onToggle={handleToggleItems}>
                                                                            {{
                                                                                header: (
                                                                                <>
                                                                                    <CrateModalHeaderWrapper style={{paddingTop: '10px'}} className="crate-modal-header-wrapper">
                                                                                        <div style={{display: 'flex'}}>
                                                                                            <div style={{width: '20px'}}><img src="images/Drag_Drop-Gray.svg" className="item-img" style={{height: '25px'}}/></div>
                                                                                            <AccordionHeaderTitle>{dynamicLabels.item_s} {itemObj?.itemCount ? itemObj.itemCount : itemIndex + 1}</AccordionHeaderTitle>
                                                                                        </div>
                                                                                        <div onClick={() => addRemoveNewLineItem(crateObj.id,'remove',itemObj.id)}>
                                                                                            <FontIcon variant={'icomoon-delete-empty'} size={'sm'}/>
                                                                                        </div>
                                                                                    </CrateModalHeaderWrapper>
                                                                                </>
                                                                                ),
                                                                                content: (
                                                                                    <AccordionContent>
                                                                                        <Grid container spacing='10px' style={{ marginBottom: '15px', paddingTop: '35px' }}>
                                                                                            {itemKeys.length > 0 && itemKeys.map((itemKeyName : string) => {
                                                                                                const meta = itemStructure[itemKeyName]
                                                                                                meta.multipleFiles = false

                                                                                                return (
                                                                                                    <Grid item key={itemKeyName} xs={12} sm={4} md={2} className='grid-item'>
                                                                                                    <FormField name={`crateData[${crateIndex}].shipmentlineitems[${itemIndex}].${itemKeyName}`} meta={meta} formInstance={crateFormInstance}/>
                                                                                                    {setItemErrorType(crateIndex, itemIndex, itemKeyName, meta)}

                                                                                                    { getItemErrors(crateIndex, itemIndex, itemKeyName) ? meta['isError'] = true : meta['isError'] = false}
                                                                                                    </Grid>
                                                                                                )
                                                                                            })}
                                                                                        </Grid>
                                                                                    </AccordionContent>
                                                                                )
                                                                            }}
                                                                        </Accordion>
                                                                        }
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })}                                               
                                                    {crateType === 'a' && 
                                                        (<AddLineItemButtonWrapper onClick={() => {addRemoveNewLineItem(crateObj.id, 'add')}} className="add-line-item-button-wrapper" >
                                                            <Box style={{display: "flex", cursor: "pointer"}}>
                                                            <FontIcon variant={'add'} color={'primary.main'} size={'xs'}/>
                                                            <AddLineItemTextWrapper className="add-line-item-text-wrapper">{dynamicLabels.add} {dynamicLabels.item_s}</AddLineItemTextWrapper>
                                                            </Box>
                                                        </AddLineItemButtonWrapper>)
                                                    }
                                                </AccordionContent>
                                                )
                                            }}
                                            </Accordion>
                                        }
                                        {provided.placeholder}
                                    </div>

                                )}
                            </Droppable>
                        )
                        
                    }) : <> </>}
                </DragDropContext> : < > </>
            }
            <AddLineItemButtonWrapper onClick={(event) => addRemoveNewCrate(event,'add',undefined,'buttonClick')} >
                <Box style={{display: "flex", cursor: "pointer"}}>
                    <FontIcon variant={'add'} color={'primary.main'} size={'xs'} />
                    <AddLineItemTextWrapper>{dynamicLabels.add} {dynamicLabels.crate_s}</AddLineItemTextWrapper>
                </Box>
            </AddLineItemButtonWrapper>
        </Box>
        </>
    )
}
export default (withToastProvider(CrateComponent, 'toast-inject-here'))
