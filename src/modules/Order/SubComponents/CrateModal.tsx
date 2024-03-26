import React, { Dispatch, useEffect, useState } from "react";
import { Box, IconButton, Modal, ModalHeader, useToast } from "ui-library";
import apiMappings from "../../../utils/apiMapping";
import { deepCopy, emailIsValid, generateRandomID } from '../../../utils/helper'
import axios from "../../../utils/axios";
import { CrateModalWrapper} from './StyleComponents'
import { useForm } from "react-hook-form";
import CrateComponent from "./CrateComponent";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { IAddOrderFormActions } from "../AddOrderForm/AddOrderForm.actions";
import { ICrateData, ICrateItemData } from "../AddOrderForm/AddOrderForm.models";
import useClientProperties from '../../common/ClientProperties/useClientProperties';

interface ICrateModalProps {
    showCrateModal : boolean
    setShowCrateModal: Function
    value: Array<ICrateData>
    currentPage: string
    formatCrateData: Function
}

const CrateModal = (props: ICrateModalProps) => {

    let {showCrateModal, setShowCrateModal, value, currentPage, formatCrateData} = props;
    let itemRequiredArray = [];
    let emailValid = false;
    let emailOrContact = false;
    const toast = useToast();
    const dispatch = useDispatch<Dispatch<IAddOrderFormActions>>() 
    const dynamicLabels = useTypedSelector(state => state.orderForm.dynamicLabels)
    const crateData = useTypedSelector(state => state.orderForm.crateData)
    const isOptimizeFl = useTypedSelector(state => state.orderForm.isOptimizeFl)
    const crateType = useTypedSelector(state => state.orderForm.crateType)
    const AddDeleteCount = useTypedSelector(state => state.orderForm.AddDeleteCount)
    const clientProperties = useClientProperties(["CRATESTRUCTURE"]);

    const [sectionKeys, setSectionKeys] = useState<Array<string>>([]);
    const [itemKeys, setItemKeys] = useState<Array<string>>([]);
    const [crateStructure, setCrateStructure] = useState<Object>({});
    const [itemStructure, setItemStructure] = useState<Object>({})
    const crateFormInstance = useForm<Record<string, any>>({
        mode: 'all', shouldUnregister: false
    })
    console.log(crateFormInstance.formState.isDirty) // make sure formState is read before render to enable the Proxy
    const {handleSubmit: handleSubmit2, reset } = crateFormInstance; 

    useEffect(() => {
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: value });
        const _resetData = {... {crateData: crateData}}
        reset({..._resetData});
        getValidationJson();
    },[value])

    const closeConfirmationModal = () => {
        let data = [];
        data = crateData && crateData.length ? crateData?.filter(o => o.newItem !== true) : [];
        if (data.length) {
            data.forEach(obj => {
                delete obj['crateCounter'];
                if (obj.isDeleteFl === 'Y') {
                    obj.isDeleteFl = 'N'
                }
                if (obj.shipmentlineitems) {
                    obj.shipmentlineitems.forEach(itemObj => {
                        delete itemObj['itemCount']
                        if (itemObj.isDeleteFl === 'Y') {
                            itemObj.isDeleteFl = 'N'
                        }
                    })
                    obj.shipmentlineitems = obj.shipmentlineitems.length ? obj.shipmentlineitems?.filter(o => o.newItem !== true) : []
                }
            })
        }
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: data });
        setShowCrateModal(false);
    }
    const setConfirm = () => {
        setShowCrateModal(false);
    }

    const getValidationJson = async () => {
        const newCrateData = crateData ? deepCopy(crateData) : []
        let url = '';
        let crateUrl = '';
        if (crateType === 'a') {
            if (currentPage == 'booking') {
                url = apiMappings.order.form.getBookingCrateItemList;
            } else {
                if(isOptimizeFl){
                    url = apiMappings.order.form.getOptimizeCrateItemList+"&restrictColumns=false";
                }
                else {
                    url = apiMappings.order.form.getCrateItemList+"&restrictColumns=false";
                }
                crateUrl = apiMappings.order.form.getCrateList+"&restrictColumns=false";
            }
            if (newCrateData.length <= 0) {
                newCrateData.push({
                    crateCd: '',
                    crateType: '',
                    noOfUnits: '',
                    crateAmount: '',
                    crateWeight: '',
                    crateVolume: '',
                    crateLength: '',
                    crateBreadth: '',
                    crateHeight: '',
                    crateMinTemperature: '',
                    crateMaxTemperature: '',
                    temperatureCategory: '',
                    newItem: true,
                    id: generateRandomID(),
                    shipmentlineitems: [],
                    itemCounter: 0,
                    isDeleteFl: 'N'
                })
            }
        } else if (crateType == 'additionalContactDetails') {
            url = apiMappings.order.form.getContactList;
            if (currentPage == 'shipper') {
                url = apiMappings.shipper.getContactList;
            }
            if (newCrateData.length <= 0) {
                newCrateData.push({
                    customerName: '',
                    newItem: true,
                    id: generateRandomID(),
                    shipmentlineitems: [],
                    isDeleteFl: 'N'
                });
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount + 1 });
            }
        } else {
            url = apiMappings.order.form.getCrateList;
            if (newCrateData.length <= 0) {
                newCrateData.push({
                    crateCd: '',
                    newItem: true,
                    id: generateRandomID(),
                    shipmentlineitems: [],
                    isDeleteFl: 'N'
                });
                dispatch({ type: '@@addOrderForm/SET_COUNT', payload: AddDeleteCount + 1 });
            }
        }
        dispatch({ type: '@@addOrderForm/SET_EXPANDED', payload: {key: 'crate', value: newCrateData[0].id} });
        dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: newCrateData });
        if (crateType == 'a') {
            const { data } = await axios.get(crateUrl);
            if (data && data.columns) {
                for (let i in data.columns) {
                    if (data.columns[i].fieldType == 'text') {
                        data.columns[i].fieldType = 'cratetext'
                        if (i === 'crateType' && isOptimizeFl) {
                            data.columns[i].editable = !isOptimizeFl;
                        }
                    } else if (data.columns[i].fieldType == 'number') {
                        data.columns[i].fieldType = 'cratenumber';
                        if (isOptimizeFl && i !== "noOfUnits" && i !== "crateAmount") {
                            data.columns[i].editable = !isOptimizeFl;
                        }
                        if (i == "noOfUnits" || i == "crateAmount") {
                            data.columns[i].required = false;
                        }
                    } else if (data.columns[i].fieldType == 'dropdown' || data.columns[i].fieldType == 'select') {
                        data.columns[i].fieldType = 'cratedropdown';
                    }
                   
                    if (isOptimizeFl && data.columns[i].id === 'crateName') {
                        data.columns[i].fieldType = 'cratedropdown';
                        data.columns[i].required = false;
                        data.columns[i]['lookupType'] = 'crateNameList';
                        data.columns[i].editable = isOptimizeFl;
                    }
                    if (isOptimizeFl && data.columns[i].id === "temperatureCategory") {
                        data.columns[i].fieldType = 'cratetext';
                        data.columns[i].id = 'crateTemperatureCategory';
                        // data.columns[i].editable = !isOptimizeFl;
                    }
                    if (data.columns[i].id == 'crateMinTemperature' || data.columns[i].id == 'crateMaxTemperature') {
                        data.columns[i].fieldType = 'cratenumber';
                    }
                }
                setCrateStructure(data.columns);
                const sectionKeyArray = Object.keys(data.columns);
                setSectionKeys(sectionKeyArray)
            }
        }

        const { data } = await axios.get(url);
        if (data && data.columns) {
            if (data && data.columns) {
                for (let i in data.columns) {
                    if (crateType != 'a') {
                        if (data.columns[i].fieldType == 'text') {
                            data.columns[i].fieldType = 'cratetext'
                        } else if (data.columns[i].fieldType == 'number') {
                            data.columns[i].fieldType = 'cratenumber'
                        } else if (data.columns[i].fieldType == 'dropdown' || data.columns[i].fieldType == 'select') {
                            data.columns[i].fieldType = 'cratedropdown';
                        }
                        if (isOptimizeFl && data.columns[i].id === 'crateName') {
                            data.columns[i].fieldType = 'cratedropdown';
                            data.columns[i].required = false;
                            data.columns[i]['lookupType'] = 'crateNameList';
                            data.columns[i].editable = isOptimizeFl;
                        }
                        if (isOptimizeFl && data.columns[i].id === "temperatureCategory") {
                            data.columns[i].fieldType = 'cratetext';
                            data.columns[i].id = 'crateTemperatureCategory';
                            data.columns[i].editable = !isOptimizeFl;
                        }
                        if (data.columns[i].id == 'crateMinTemperature' || data.columns[i].id == 'crateMaxTemperature') {
                            data.columns[i].fieldType = 'cratenumber';
                        }
                        setCrateStructure(data.columns);
                        const sectionKeyArray = Object.keys(data.columns);
                        setSectionKeys(sectionKeyArray)
                    } else {
                        if (data.columns[i].fieldType == 'text') {
                            data.columns[i].fieldType = 'itemtext'
                        } else if (data.columns[i].fieldType == 'number') {
                            data.columns[i].fieldType = 'itemnumber'
                        } //else if (data.columns[i].fieldType == 'dropdown' || data.columns[i].fieldType == 'select') {
                        //     data.columns[i].fieldType = 'itemdropdown';
                        // }
                        if (data.columns[i].id == 'minTemperature' || data.columns[i].id == 'maxTemperature') {
                            data.columns[i].fieldType = 'itemnumber';
                        }
                        if (data.columns[i].required) {
                            itemRequiredArray.push(data.columns[i].id);
                        }
                        setItemStructure(data.columns);
                        const itemKeys = Object.keys(data.columns);
                        setItemKeys(itemKeys);
                    }
                }
            }
        }
    }

    const duplicate_barcode_check_result = () => {
        emailValid = true;
        emailOrContact = true;
        var all_crates_barcodes = document.getElementsByClassName('crateBarcodeInput');
        var all_crates_contact_number = document.getElementsByClassName('itemsCrate  contact-number-input');
        var all_crates_email_ids = document.getElementsByClassName('itemsCrate  contact-email-input');
        var total_barcodes_count = all_crates_barcodes.length;
        var duplicates_found = false;
        var barcodes_array = new Array();
        var duplicate_fields = [];

        var contact_number_array = new Array();
        // var duplicate_fields = [];

        var contact_email_array = new Array();
        // var duplicate_fields = [];

        if (crateType == "additionalContactDetails") {
            for (var i = 0; i < total_barcodes_count; i++) {
                if (crateData && crateData[i]['isDeleteFl'] == 'N') {
                    var val = (all_crates_barcodes[i] as HTMLInputElement).value;
                    var contactVal = (all_crates_contact_number[i] as HTMLInputElement).value;
                    var emailVal = (all_crates_email_ids[i] as HTMLInputElement).value;
                    if (!emailVal && !contactVal) {
                        duplicates_found = true;
                        duplicate_fields.push(val);
                        emailOrContact = false;
                    } else if ((val && barcodes_array.indexOf(val) != -1) || (contactVal && contact_number_array.indexOf(contactVal) != -1) || (emailVal && contact_email_array.indexOf(emailVal) != -1)) {
                        duplicates_found = true;
                        duplicate_fields.push(val);
                    } else if (emailVal && !emailIsValid(emailVal)) {
                        duplicates_found = true;
                        duplicate_fields.push(val);
                        emailValid = false;
                    }
                    barcodes_array.push(val);
                    contact_number_array.push(contactVal);
                    contact_email_array.push(emailVal);
                }
            }
        } else {
            for (var i = 0; i < total_barcodes_count; i++) {
                var val = (all_crates_barcodes[i] as HTMLInputElement).value;
                if (barcodes_array.indexOf(val) != -1) {
                    duplicates_found = true;;
                    duplicate_fields.push(val);
                }

                barcodes_array.push(val);
            }
        }

        var elems = document.querySelectorAll(".crate-flex-header");

        elems.forEach.call(elems, function(el) {
            el.classList.remove("duplicate");
        });

        for (var i = 0; i < total_barcodes_count; i++) {
            var val = (all_crates_barcodes[i] as HTMLInputElement).value;
            if (duplicate_fields.indexOf(val) != -1) {
                // var field = (all_crates_barcodes[i] as HTMLInputElement);
            }

        }
        return duplicates_found;
    }

    const saveOrderCrates = (data: Record<string, ICrateData[]>) => {
        var sendSaveCrateCall = true
        const newCrateData = deepCopy(crateData);
        if (data?.crateData?.length && newCrateData.length) {
            data.crateData.forEach((obj: ICrateData, index: number) => {
                for (let key in obj) {
                    if (key !== 'shipmentlineitems' && key !== 'isDeleteFl') {
                        newCrateData[index][key] = obj[key]
                    } else if (key === 'shipmentlineitems' && obj[key]?.length) {
                        obj[key]?.forEach((item: ICrateItemData, i: number) => {
                            for (let str in item) {
                                if (str !== 'isDeleteFl') {
                                    newCrateData[index]['shipmentlineitems'][i][str] = item[str]
                                }
                            }
                            delete newCrateData[index]['shipmentlineitems'][i]['newItem']
                            delete newCrateData[index]['shipmentlineitems'][i]['itemCount']
                        })
                    }
                }
                delete newCrateData[index]['newItem'];  
                delete newCrateData[index]['crateCounter'];
            })
        }

        if (duplicate_barcode_check_result()) {
            if (!emailValid) {
                toast.add(dynamicLabels.notValidEmail, 'warning', false);
            } else if (!emailOrContact) {
                toast.add(dynamicLabels.contactOrEmailRequired, 'warning', false);
            } else {
                if (crateType == 'additionalContactDetails') {
                    toast.add(dynamicLabels.duplicateEntriesNotAllowed, 'warning', false);
                } else {
                    toast.add(dynamicLabels.duplicateCrateNamesNotAllowed, 'warning', false);
                }
            }
        } else {
            if (crateType == 'a') {
                // if (invalidForm) {
                //     highlightCrateValidations();
                // }
            }
            if (!crateFormInstance.formState.isValid) {
                data?.crateData?.forEach((crates: ICrateData) => {
                    if(crates.isDeleteFl !== "Y"){
                        if(clientProperties?.CRATESTRUCTURE && clientProperties?.CRATESTRUCTURE?.propertyValue == 'CRATEITEM' && !(crates?.shipmentlineitems && crates?.shipmentlineitems?.length)){
                            toast.add((dynamicLabels && dynamicLabels.create_order_line_item_mandatory) ? dynamicLabels.create_order_line_item_mandatory : 'Crate items are mandatory.', 'warning', false);
                            sendSaveCrateCall = false;
                        }
                    }
                })
                // sendSaveCrateCall = false;
            } else {
                data?.crateData?.forEach((crates: ICrateData) => {
                    if(crates.isDeleteFl !== "Y"){
                        if(clientProperties?.CRATESTRUCTURE && clientProperties?.CRATESTRUCTURE?.propertyValue == 'CRATEITEM' && !(crates?.shipmentlineitems && crates?.shipmentlineitems?.length)){
                            toast.add((dynamicLabels && dynamicLabels.create_order_line_item_mandatory) ? dynamicLabels.create_order_line_item_mandatory : 'Crate items are mandatory.', 'warning', false);
                            sendSaveCrateCall = false;
                        }
                        if (!crates.temperatureCategorySelection) {
                            crates.temperatureCategorySelection = crates.crateTemperatureCategory
                        }
                        if (crates.temperatureCategorySelection && crates.temperatureCategorySelection.name) {
                            crates.crateTemperatureCategory = crates.temperatureCategorySelection.name;
                        }
                        if (crates.noOfUnits && crates.noOfUnits % 1 != 0) {
                            toast.add((dynamicLabels && dynamicLabels.crate_Quantity) ? dynamicLabels.crate_Quantity : 'Crate quantity cannot be decimal.', 'warning', false);
                            sendSaveCrateCall = false;
                        } else if (isNaN(parseFloat(crates.crateMinTemperature)) && !isNaN(parseFloat(crates.crateMaxTemperature))) {
                            toast.add((dynamicLabels && dynamicLabels.crateMinTemp) ? dynamicLabels.crateMinTemp : 'Please enter crate Minimum temperature', 'warning', false);
                            sendSaveCrateCall = false;
                        } else if (isNaN(parseFloat(crates.crateMaxTemperature)) && !isNaN(parseFloat(crates.crateMinTemperature))) {
                            toast.add((dynamicLabels && dynamicLabels.crateMaxTemp) ? dynamicLabels.crateMaxTemp : 'Please enter crate Maximum temperature', 'warning', false);
                            sendSaveCrateCall = false;
                        } else if (parseFloat(crates.crateMaxTemperature) <= parseFloat(crates.crateMinTemperature)) {
                            toast.add((dynamicLabels && dynamicLabels.crateMinTempMaxtemp) ? dynamicLabels.crateMinTempMaxtemp : 'crate Minimum temperature should be less then crate Maximum temperature.', 'warning', false);
                            sendSaveCrateCall = false;
                        } else if (!isOptimizeFl && crates.shipmentlineitems && crates.shipmentlineitems.length) {
                            crates.shipmentlineitems.forEach(function(lineItem: ICrateItemData) {
                                if(lineItem.isDeleteFl !== "Y") {
                                    if (Number(lineItem.itemQuantity) % 1 != 0) {
                                        toast.add((dynamicLabels && dynamicLabels.item_Quantity) ? dynamicLabels.item_Quantity : 'Item quantity cannot be decimal.', 'warning', false);
                                        sendSaveCrateCall = false;
                                    } else if (isNaN(parseFloat(lineItem.minTemperature)) && !isNaN(parseFloat(lineItem.maxTemperature))) {
                                        toast.add((dynamicLabels && dynamicLabels.itemMinTemp) ? dynamicLabels.itemMinTemp : 'Please enter item Minimum temperature', 'warning', false);
                                        sendSaveCrateCall = false;
                                    } else if (isNaN(parseFloat(lineItem.maxTemperature)) && !isNaN(parseFloat(lineItem.minTemperature))) {
                                        toast.add((dynamicLabels && dynamicLabels.itemMaxTemp) ? dynamicLabels.itemMaxTemp : 'Please enter item Maximum temperature', 'warning', false);
                                        sendSaveCrateCall = false;
                                    } else if (parseFloat(lineItem.maxTemperature) <= parseFloat(lineItem.minTemperature)) {
                                        toast.add((dynamicLabels && dynamicLabels.itemMinTempMaxtemp) ? dynamicLabels.itemMinTempMaxtemp : 'Item Minimum temperature should be less then item Maximum temperature.', 'warning', false);
                                        sendSaveCrateCall = false;
                                    } else if(isOptimizeFl){
                                        if (!((lineItem.itemBreadth == "" || lineItem.itemBreadth == undefined || lineItem.itemBreadth == null) && (lineItem.itemHeight == "" || lineItem.itemHeight == undefined || lineItem.itemHeight == null) 
                                        && (lineItem.itemLength == "" || lineItem.itemLength == undefined || lineItem.itemLength == null))) {
                                            if(!(lineItem.itemBreadth && lineItem.itemHeight && lineItem.itemLength)){
                                                toast.add((dynamicLabels && dynamicLabels.itemDimensionRequired) ? dynamicLabels.itemDimensionRequired : 'Item dimension are mandatory for packing optimization', 'warning', false);
                                                sendSaveCrateCall = false;
                                            }
                                            
                                        }else if(!lineItem.itemWeight && ((lineItem.itemBreadth == "" || lineItem.itemBreadth == undefined || lineItem.itemBreadth == null) && (lineItem.itemHeight == "" || lineItem.itemHeight == undefined || lineItem.itemHeight == null) 
                                        && (lineItem.itemLength == "" || lineItem.itemLength == undefined || lineItem.itemLength == null))){
                                            toast.add((dynamicLabels && dynamicLabels.weightDimensionsMandatoryMsg) ? dynamicLabels.weightDimensionsMandatoryMsg : 'Item weight and item dimensions are mandatory for packing optimization.', 'warning', false);
                                            sendSaveCrateCall = false;
                                        }
                                    }
                                    if (lineItem.temperatureCategory && lineItem.temperatureCategory.name) {
                                        lineItem.temperatureCategory = lineItem.temperatureCategory.name;
                                    }
                                    delete lineItem.newItem;
                                }
                            })
                        }
                        delete crates.newItem;
                     }
                })
            }
        }

        if (sendSaveCrateCall) {
            const newData = newCrateData?.length ? newCrateData.filter((o: any )=> o.isDeleteFl !== 'Y') : [];
            const crateItemsData = newData?.length ? newData.filter((o: any )=> {
                if (o.shipmentlineitems?.length) {
                    o.shipmentlineitems = o.shipmentlineitems.filter((i: any) => i.isDeleteFl !== 'Y');
                }
                return o;
            }) : [];
            dispatch({ type: '@@addOrderForm/SET_CRATE_DATA', payload: crateItemsData });
            formatCrateData(crateItemsData);
            setConfirm();
        }
        
    }

    return (
        <Modal
            open={showCrateModal}
            onToggle={(value: boolean) => {
                setShowCrateModal(value);
            }}
            width='1245px'
            children = {{
                header : (
                    <ModalHeader
                        headerTitle={dynamicLabels.enterItemDetails}
                        handleClose={() => setShowCrateModal(false)}
                        imageVariant="icomoon-close"
                        headerStyle={{ fontSize: "15px" }}
                        width='100%'
                    />
                ),
                content:(
                    <CrateModalWrapper className="crate-modal-wrapper">
                        <div id='toast-inject-here'></div>
                        <CrateComponent sectionKeys={sectionKeys} crateStructure={crateStructure} crateFormInstance={crateFormInstance} itemKeys={itemKeys} itemStructure={itemStructure} formatCrateData={formatCrateData}></CrateComponent>
                    </CrateModalWrapper>
                ),
                footer: (
                    <Box horizontalSpacing="10px" display="flex" justifyContent="flex-end" p="15px">
                        <IconButton id="crate-modal-save" iconVariant="icomoon-save" primary onClick={handleSubmit2((data) => saveOrderCrates(data))}> {dynamicLabels.save} </IconButton>
                        <IconButton id="crate-modal-cancel" iconVariant="icomoon-close" iconSize={11} onClick={() => closeConfirmationModal()}> {dynamicLabels.cancel} </IconButton>
                    </Box>
                )
            }}
        />
    )
}
export default CrateModal
