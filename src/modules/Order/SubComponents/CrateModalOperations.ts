import { Dispatch } from "react";
import { useDispatch } from "react-redux";
import { deepCopy, generateRandomID } from "../../../utils/helper";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IAddOrderFormActions } from "../AddOrderForm/AddOrderForm.actions";
import { updateCounter } from "./CrateHelper";
import { ICrateData, ICrateItemData } from "../AddOrderForm/AddOrderForm.models";
import { useToast } from 'ui-library'

export const CrateModalOperations = () => {
    const toast = useToast();
    const crateData = useTypedSelector(state => state.orderForm.crateData)
    const crateType = useTypedSelector(state => state.orderForm.crateType)
    const AddDeleteCount = useTypedSelector(state => state.orderForm.AddDeleteCount)
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>()
    
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
                newCrateData.forEach((e: ICrateData) => {
                    // let itemlist: ICrateItemData[] = [];
                    if (String(e.id) == id) {
                        //                  var list = []

                        e.itemCounter = --e.itemCounter;
                        e['shipmentlineitems'].forEach((ee: ICrateItemData) => {
                            if (String(ee.id) == crateId) {

                                ee.isDeleteFl = 'Y'
                            }
                            // if (!ee.newItem || String(ee.id) != crateId){
                            //     itemlist.push(ee);
                            // }

                            //                    }
                            //                    list.push(ee)
                        })
                        // e['shipmentlineitems']=itemlist;
                    }
                })
                /* let crateItemFormInstance = {};
                newCrateData.forEach((value: object, index: number) => {
                    for (let key in value) {
                        if (key === 'shipmentlineitems') {
                            value[key].forEach((itemObj: object, itemIndex: number) => {
                                for (let itemKey in itemObj) {
                                    crateItemFormInstance[`${itemKey}-${index}-${itemIndex}`] = itemObj[itemKey]
                                }
                            })
                        }
                    }
                }) */
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

    const addRemoveNewCrate = ( event: any, method: string, id: string | undefined, buttonClick?: string) => {
        let newCrateData = deepCopy(crateData)
        if (crateType == 'a') {
            if (method == 'add') {
                if (buttonClick) {
                    // var val = "crate1"
                    event.keyCode = 13
                } else {
                    // val = event.target.value.trim()
                }

                if (event.keyCode == 13) {

                    if (newCrateData.length <= 4) {
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
                    } else {
                        toast.add(dynamicLabels.moreThan5ContactsNotAllowed, 'warning', false);
                    }
                }
            } else {
                // let list: ICrateData[] = [];
                newCrateData.forEach((e: ICrateData) => {
                    if (String(e.id) == id) {
                        e.isDeleteFl = 'Y'
                    }
                    // if(!e.newItem || String(e.id) != id){
                    //     list.push(e) 
                    // }
                })
                // newCrateData = list;
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });

                // let crateItemFormInstance = {};
                // newCrateData.forEach((value: ICrateData, index: number) => {
                //     for (let key in value) {
                //         if (key !== 'noOfUnits' && key !== 'shipmentlineitems') {
                //             crateItemFormInstance[`${key}-${index}`] = value[key]
                //         }
                //     }
                // })
            }
            updateCounter(newCrateData, 'crate');
        } else {
            if (method == 'add') {

                if (buttonClick) {
                    // var val = "crate1"
                    event.keyCode = 13
                }

                if (event.keyCode == 13) {

                    if (newCrateData.length <= 4) {
                        dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
                        newCrateData.push({

                            crateCd: "",
                            newItem: true,
                            itemCounter: 0,

                            id: generateRandomID(),

                            isDeleteFl: 'N'
                        })
                        event.target.value = '';
                    } else {
                        toast.add(dynamicLabels.moreThan5ContactsNotAllowed, 'warning', false);

                    }
                }

            } else {
                if(newCrateData.length === 1){
                    return
                }
                // var list;
                newCrateData.forEach( function (e: ICrateData) {
                    if (String(e.id) == id) {
                        e.isDeleteFl = 'Y'
                    }
                    // list.push(e)
                })
                // newCrateData = list;
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount - 1 });
            }
            updateCounter(newCrateData, 'crate');
        }
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: newCrateData });
    }

    return { addRemoveNewLineItem, addRemoveNewCrate }
}