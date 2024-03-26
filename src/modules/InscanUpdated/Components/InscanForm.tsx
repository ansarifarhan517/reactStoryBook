import React, { Dispatch, useEffect, useState, SetStateAction, memo } from "react";
import { Box, Card, Grid, useToast, TextInput, IconButton, ButtonGroup } from "ui-library";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { isEmpty } from "../utils";
import SelectConflictingRecordsModal from "./SelectConficlitingRecordsModal";
import ContentWrapper from "./ContentWrapper";
import OrderInscanListview from "./OrderInscanListview";
import ManifestInscanListview from "./ManifestInscanListview";
import { tGlobalPopupAction } from "../../common/GlobalPopup/GlobalPopup.reducer";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import { InscanOrderManifestActions } from "../InscanOrderManifest.actions";
import useAudio from "../../../utils/useAudio";
import { IMongoFormStructure } from "../../../utils/mongo/interfaces";
import axios from "../../../utils/axios";
import apiMappings from "../../../utils/apiMapping";
import { deepCopy } from "../../../utils/helper";
import { PRODUCT_TYPE } from "../../../utils/constants";
import FormLoader from "../../../utils/components/FormLoader";
import FormField from "../../../utils/components/Form/FormField";
import { ButtonContainer, FormContainer, FormFieldWapper, TabButtonContainer } from "./InscanStyledComponent";
import { IStateService } from "angular-ui-router";
import { IExceptionRecord } from "../InscanOrderManifest.models";
import ExceptionListModal from "./ExceptionListModal";
import { ISelectedOrder } from "../../Outscan/OutscanOrderManifest.models";
import { userAccessInfo } from "../../../utils/constants"

interface IInscanFormProps {
    tableData: Array<any>
    setTabledata: Dispatch<SetStateAction<Array<any>>>;
    totalWeight: number;
    setTotalWeight: Dispatch<SetStateAction<number>>;
    totalVolume: number;
    setTotalVolume: Dispatch<SetStateAction<number>>;
    totalPendingOrders: number;
    setTotalPendingOrders: Dispatch<SetStateAction<number>>;
    scannedShipmentIds: Array<string>;
    setScannedShipmentIds: Dispatch<SetStateAction<Array<string>>>;
    totalcratecodes: number;
    setTotalCrates: Dispatch<SetStateAction<number>>;
    ngStateRouter: IStateService
    resetForm: Function
}

const InscanForm = (props: IInscanFormProps) => {
    // const { tableData, setTabledata, totalWeight, setTotalWeight, totalVolume, setTotalVolume, totalPendingOrders, setTotalPendingOrders, totalcratecodes, setTotalCrates, scannedShipmentIds, setScannedShipmentIds, ngStateRouter, resetForm } = props;
    const { ngStateRouter, resetForm } = props;
    const counters = ['totalInscannedOrders', 'totalCrateCodes'];
    const playSuccess = useAudio('sounds/success_beep.mp3');
    const playDuplicate = useAudio('sounds/Duplicate.wav');
    const playError = useAudio("sounds/Error.wav");
    const playFail = useAudio("sounds/beep_fail.wav");
    const playReturn = useAudio("sounds/Return.wav");

    const isFormLoading = useTypedSelector((state) => state.inscanUpdate.form.loading);
    const structure = useTypedSelector((state) => state.inscanUpdate.form.structure);
    const manifestList = useTypedSelector((state) => state.inscanUpdate.listview.manifestOfManifests.data.results);
    const isFormEditable = useTypedSelector((state) => state.inscanUpdate.form.isEditable);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.inscan);
    const defaultValues = {inscanBy: { 'clientRefMasterCd': 'Order', 'id': 'Order', 'name': userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels.mm_order_s ? dynamicLabels.mm_order_s : '' : dynamicLabels.order_s ? dynamicLabels.order_s : ''}, totalInscannedOrders: 0, totalCrateCodes: 0, totalWeight: 0, totalVolume: 0}
    const sectionKeys = !isEmpty(structure) ? Object.keys(structure) : [];
    const loaderRef = React.useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch<Dispatch<InscanOrderManifestActions>>();
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false, defaultValues: defaultValues });
    const toast = useToast();
    const { watch, setValue } = formInstance;

    const [scanId, setScanId] = useState<string>('');
    const [scanningInProgress, setScanningInProgress] = useState<boolean>(false);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [showSaveUpdate, setShowSaveUpdate] = useState<boolean>(true);
    const [conflictsData, setConflictsData] = useState<Record<string, any>>({});
    const [bagNum, setBagNum] = useState<number>(1);
    const [totalInscannedOrders, setTotalInscannedOrders] = useState<number>(0);
    const [existingShipments, setExistingShipment] = useState<Array<number>>([]);
    const [existingManifests, setExistingManifests] = useState<Array<number>>([]);
    const [manifestResponseData, setManifestResponseData] = useState<any>({});
    const [isConflict, setConflict] = useState<boolean>(false);
    const [exceptionModalOpen, setExceptionModalOpen] = useState<boolean>(false);
    const [exceptionList, setExceptionList] = useState<IExceptionRecord[]>([]);
    const [scanSelectedType, setScanSelectedType] = useState<any>({});
    const [selectedAccordionType, setSelectedAccordionType] = useState<string>('');
    const [scanApiPayload, setScanApiPayload] = useState<Record<string, any>>({});
    const [scanIdentifierText, setScanIdentifier] = useState<string>('');


    const [tableData, setTabledata] = useState<Array<any>>([]);
    const [totalcratecodes, setTotalCrates] = useState<number>(0);
    const [scannedShipmentIds, setScannedShipmentIds] = useState<Array<string>>([]);

    const cancelledOrderAllowedFl = watch('cancelledOrderAllowedFl', '');
    const [activeTab, setTabActive] = useState<string>('orders');
    // fetching intial form structure
    useEffect(() => {
        dispatch({ type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE' });
    }, []);

    const updateFormStructure = (structure: IMongoFormStructure) => {
        dispatch({ type: '@@inscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: structure })
    }

    /* setting values for counter fields */
    useEffect(() => {
        setValue("totalInscannedOrders", totalInscannedOrders < 0 ? 0 : totalInscannedOrders);
        setValue('totalCrateCodes', totalcratecodes < 0 ? 0 : totalcratecodes);
    }, [totalInscannedOrders, totalcratecodes]);
 /* setting values for counter fields */

 // dispatching scanned data to redux
    useEffect(() => {
        const orderTableData = {
            clientBranchId: 0,
            otherCount: 0,
            results: tableData,
            totalCount: tableData.length
        }
        if(!isFormEditable && manifestList) {
            setTotalInscannedOrders(tableData.length + manifestList.reduce((total: number, current:any) => total += current.orderCount || 0, 0))
        }
        setValue('totalInscannedOrders', totalInscannedOrders)
        dispatch({ type: '@@inscanOrderManifest/FETCH_SCANNED_ORDER_LIST_SUCCESS', payload: orderTableData });
        if(tableData.length === 0) {
            setScannedShipmentIds([]);
        }

    }, [tableData, isFormEditable]);

    // customizing exception listview rows based on exception type
    useEffect(() => {
        if (exceptionList.length > 0) {
            exceptionList.forEach((row: IExceptionRecord) => {
                const rowObj = row;
                if (row.exceptionType === "Restrictive") {
                    rowObj.editIconButtonProps = {
                        "style": {
                            "backgroundImage": "url(images/alert-for-list.svg)",
                            "backgroundSize": "contain",
                            "height": "10px",
                            "width": "10px",
                            "backgroundRepeat": "no-repeat",
                            "opacity": 1,
                            "margin": "7px 5px 8px"
                        },
                        "title": "Action Required",
                        "iconVariant": ''
                    }
                } else {
                    rowObj.editIconButtonProps = {
                        "style": {},
                        "title": "",
                        "iconVariant": ''
                    }
                }
                return rowObj
            })
            const exceptionData = {
                clientBranchId: 0,
                otherCount: 0,
                results: exceptionList,
                totalCount: exceptionList.length
            }
            dispatch({ type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA', payload: exceptionData });
        } else {
            const exceptionData = {
                clientBranchId: 0,
                otherCount: 0,
                results: [],
                totalCount: 0
            }
            dispatch({ type: '@@inscanOrderManifest/SET_EXCEPTION_LISTVIEW_DATA', payload: exceptionData });
        }
    }, [exceptionList])

    // fetching mainfest data by getting id from url
    useEffect(() => {
        if (ngStateRouter.params.id && !isEmpty(structure)) {
            dispatch({ type: '@@inscanOrderManifest/SET_FORM_EDITABLE', payload: true });
            dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_DATA_BY_ID', payload: ngStateRouter.params.id });
            const newStructure = deepCopy(structure);
            setTimeout(() => {
                newStructure['general details']["manifestId"].editable = false;
            }, 100);
            updateFormStructure(newStructure);
        }
    }, [ngStateRouter]);

    const playDuplicateBeep = () => {
        playFail();
        setTimeout(function () {
            playDuplicate();
        }, 500);
    }
 
    const buttonData = React.useMemo(() => {
            return [{
                id: "orders",
                label: `${dynamicLabels.orders}${tableData.length > 0 ? ` (${tableData.length})` :''}`,
                selected: activeTab === "orders"
            }, {
                id: "manifests",
                label: `${dynamicLabels.manifest}s${manifestList?.length > 0 ? ` (${manifestList?.length})` :''}`,
                selected: activeTab === "manifests"
            }]
    }, [activeTab, dynamicLabels, tableData, manifestList]);

    const handleBackendValidation = (response: any) => {
        if (response.status == 409) {
            playError();
            toast.add(response.message + ' ' + ((response.data && null !== response.data) ? response.data : ''), 'warning', false);
            return false;
        }

        if (response.hasError || response.data === null) {
            playError();
            toast.add(response.message, 'warning', false);
            return false;
        }

        return true
    }

    const disableFilters = async () => {
        if (tableData.length > 0 && !isEmpty(structure['general details'])) {
            const newStructure = deepCopy(structure);
            if(!isEmpty(newStructure) && !isEmpty(newStructure['general details'])) {
            setTimeout(() => {
                newStructure['general details']['inscanBy']['editable'] = false;
                updateFormStructure(newStructure) 
            }, 100);
        }

        } 
    }

    const handleSuccess = (ordersList: any, isCrate = false) => {
        const scanIdentifier = localStorage.getItem('scanIdentifier');
        playSuccess();
        if (isCrate) {
            const existingInscanOrderIndex = tableData.findIndex((o: any) => o.shipmentId === ordersList[0].shipmentId)
            const existingInscanOrder = existingInscanOrderIndex === -1 ? undefined : tableData[existingInscanOrderIndex]
            if (existingInscanOrder) {
                const crateCdAlreadyScanned = existingInscanOrder.scannedCrateCodes ? existingInscanOrder.scannedCrateCodes.has(scanIdentifier) : true
                if (crateCdAlreadyScanned) {

                } else {
                    const scannedCrateCodes = tableData[existingInscanOrderIndex].scannedCrateCodes
                    if (scannedCrateCodes) {
                        scannedCrateCodes.add(scanIdentifier)
                    } else {
                        tableData[existingInscanOrderIndex].scannedCrateCodes = new Set([scanIdentifier])
                        const newTableData = [...tableData, ...[{...tableData[existingInscanOrderIndex], ...tableData[existingInscanOrderIndex].scannedCrateCodes}]]
                        setTabledata(newTableData);
                    }
                    setTotalCrates((totalCratesCount) => totalCratesCount+1);
                }
            } else {
                setScannedShipmentIds([...scannedShipmentIds, ...ordersList.map((o: any) => o?.shipmentId.toString())])
                ordersList[0].scannedCrateCodes = new Set([localStorage.getItem('scanIdentifier')])
                setTabledata([...ordersList, ...tableData]);
                setTotalCrates((totalCratesCount) => totalCratesCount+1);
            }
        } else {
            setScannedShipmentIds([...scannedShipmentIds, ...ordersList.map((o: any) => o?.shipmentId.toString())])
            setTabledata([...ordersList, ...tableData])
            ordersList.forEach((o: any) => {
                setTotalCrates((totalCratesCount) => totalCratesCount += o?.crates ? (o?.totalCrates || o?.crates.length) : o?.totalCrates ? o?.totalCrates : 0);
            })
        }

        if (ordersList[0].orderState == 'RTM') {
            setTimeout(() => {
                playReturn();
            }, 500);
        }
    }

    const resetSaveAndNew = (category: string) => {
        setValue('scanId', '');
        setScanId('');
        setTabledata([]);
        formInstance.reset();
        setTotalCrates(0);
        setScannedShipmentIds([]);
        setExceptionList([]);
        setScanIdentifier('');
        localStorage.removeItem('scanIdentifier')
        dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0,  otherCount: 0, results: [], totalCount: 0} });
        setTimeout(() => {
            setValue('outscanBy', { 'clientRefMasterCd': "Order", 'id': "Order", 'name': dynamicLabels.order });
            setValue('manifestCategory', { 'clientRefMasterCd': category, 'id': category, 'name': category });
        },100)
     }

     const resetAndCancel = () => {
        setValue('scanId', undefined);
        setScanId('');
        setTabledata([]);
        formInstance.reset();
        setTotalCrates(0);
        setScannedShipmentIds([]);
        ngStateRouter.go('scannedOrders');
        setTimeout(() => {
            dispatch({ type: '@@inscanOrderManifest/SET_FORM_EDITABLE', payload: false });
            dispatch({ type: '@@inscanOrderManifest/RESET_MANIFEST_DATA' });
            dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0, otherCount: 0, results: [], totalCount: 0}});
        },100)
     }

    const onSelectConflictingOrder = (orderDetails: Record<string, any>, type: string) => {
        if (exceptionList.length > 0) {
            const filteredExceptions = exceptionList.filter((exception:IExceptionRecord) => type !== "manifest" ? exception.orderNo === orderDetails.orderNo : exception?.manifestId === orderDetails.manifestName);
            if(filteredExceptions?.length > 0) {
                setExceptionList(filteredExceptions);
                setExceptionModalOpen(true);
            } else {
                addScannedShipment(orderDetails)
            }
        } else {
            if (type === 'manifest') {
                addScannedShipment(orderDetails)
            } else {
                const scannedShipmentIdsSet = new Set(scannedShipmentIds)
                if(scannedShipmentIdsSet.has(orderDetails.shipmentId.toString())) {
                    if(tableData.find((order) => order.shipmentId === orderDetails.shipmentId)?.scannedCrateCodes.size < (orderDetails.crates.length || orderDetails.totalCrates)) {
                        handleSuccess([orderDetails], type === 'crate')
                    } else {
                        playDuplicateBeep()
                        toast.add(dynamicLabels.orderAlreadyScanned, 'warning', false);
                    }
                } else {
                    handleSuccess([orderDetails], type === 'crate')
                }
            }
        }
        setConflictsData({});
        setModalOpen(false);
    }


    const continueScanning = async (orderDetails: Record<string, any>, type: string) => {
        if (isConflict) {
            if (type === 'manifest') {
                handleSuccess([orderDetails.orders])
            } else {
                handleSuccess([orderDetails], type === 'crate')
            }
        } else {
                addScannedShipment(Object.keys(manifestResponseData).filter(key => key !== 'exceptionList').reduce((obj, key) => { obj[key] = manifestResponseData[key]; return obj; }, {}));
        }
        setExceptionList([]);
        setExceptionModalOpen(false)
    }

    const scanById = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event?.key === 'Enter') {
            const apiDataPayload: Record<string, any> = {
                scanIdentifier: event?.currentTarget.value,
                cancelledOrderAllowedFl: cancelledOrderAllowedFl === 'Y' ? true : false,
            }

            
            if (apiDataPayload.scanIdentifier != "" && !scanningInProgress) {
                setScanningInProgress(true);
                setScanApiPayload(apiDataPayload);
                try {
                    const { data: data } = await axios.get(`${apiMappings.inscanUpdate.form.getOrders}?scanIdentifier=${scanId}`);
                    setScanningInProgress(false)
                    setScanIdentifier(apiDataPayload.scanIdentifier.trim().toLowerCase())
                    localStorage.setItem("scanIdentifier", apiDataPayload.scanIdentifier.trim().toLowerCase());
                    dispatch({type: '@@inscanOrderManifest/SET_SEARCH_TEXT', payload: apiDataPayload.scanIdentifier.trim().toLowerCase()})
                    setScanId('');
                    disableFilters();
                    const backendValidationPassed = handleBackendValidation(data)
                    if (!backendValidationPassed) return

                    const responseData = data.data
                    if(responseData.hasOwnProperty('awb')) {
                        if(responseData.awb.filter((awb: ISelectedOrder) => !scannedShipmentIds.includes(awb.shipmentId.toString())).length > 0) {
                            responseData['awb'] = responseData.awb.filter((awb: ISelectedOrder) => !scannedShipmentIds.includes(awb.shipmentId.toString()))
                        } else {
                            delete responseData['awb']
                        }
                    }
                    setManifestResponseData(responseData);
                    let conflictsData = {}
                    if (Object.keys(responseData).length === 2 && responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order'))) && responseData.exceptionList.length > 0) {
                            setExceptionModalOpen(true);
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                    } else if(Object.keys(responseData).length > 1 && !responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order')))){
                        conflictsData = {
                            ...data.data,
                            ...(data.data.order ? { order: [data.data.order] } : {}),
                            ...(data.data.manifest ? { manifest: [data.data.manifest] } : {})
                        }
                    } else if (Object.keys(responseData).length === 1 && responseData.hasOwnProperty('awb') && responseData.awb.length > 1) {
                        conflictsData = { ...data.data }
                        setConflictsData({});
                        
                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }
                        setConflictsData(conflictsData);
                        setModalOpen(true);
                        setConflict(true);
                    } else if(Object.keys(responseData).length > 1 && responseData.hasOwnProperty('awb') && responseData.awb.length > 1) {
                        if(responseData.hasOwnProperty('awb') && responseData['awb'].length > 0) {
                            conflictsData = { ...data.data }
                            setConflictsData({});
                            
                            if (conflictsData.hasOwnProperty('exceptionList')) {
                                setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                                conflictsData = Object.keys(conflictsData).filter(key =>
                                    key !== 'exceptionList').reduce((obj, key) => {
                                        obj[key] = conflictsData[key];
                                        return obj;
                                    }, {}
                                    );
                            }
                        
                            if (conflictsData.hasOwnProperty('order') && scannedShipmentIds.includes(responseData.order.shipmentId.toString())) {
                                delete responseData['order'];
                                delete conflictsData['order'];
                            }
                            setConflictsData(conflictsData);
                            setModalOpen(true);
                            setConflict(true);
                        } 
                    } else {
                            addScannedShipment(responseData);
                        }

                    if (Object.keys(responseData).length > 1 || (responseData.crate && responseData.crate.length > 1)) {

                        if (Object.keys(responseData).length === 2 && responseData.hasOwnProperty('exceptionList') && ((responseData.hasOwnProperty('awb') || responseData.hasOwnProperty('manifest') || responseData.hasOwnProperty('order')))) {
                            if(responseData.hasOwnProperty('awb') && responseData['awb'].length > 0) {
                                setConflictsData(conflictsData);
                                // setModalOpen(true);
                                // setConflict(true);
                            } else {
                                setExceptionModalOpen(true);
                                setConflict(false);
                                setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            }
                        } else if(Object.keys(responseData).length === 2 && responseData.hasOwnProperty('manifest') && responseData.hasOwnProperty('order')) {
                            const scannedManifestIds = manifestList.map((manifest) => manifest.manifestId); 
                            const scannedManifestIdsSet = new Set(scannedManifestIds);
                            const scannedShipmentIds = tableData.map((order) => order.shipmentId); 
                            const scannedShipmentIdsSet = new Set(scannedShipmentIds);
                            conflictsData = {
                                ...(data.data.order && !scannedShipmentIdsSet.has(data.data.order.shipmentId) ? { order: [data.data.order] } : {}),
                                ...(data.data.manifest && !scannedManifestIdsSet.has(data.data.manifest.manifestId) ? { manifest: [data.data.manifest] } : {}),
                            }
                            setConflictsData({})
                            if(Object.keys(conflictsData).length > 1) {
                                
                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }
                                setConflictsData(conflictsData);
                                setModalOpen(true);
                                setConflict(true);
                            } else {
                                const key = Object.keys(conflictsData).toString()
                                let scanningData = {}
                                scanningData = {[key]: conflictsData[key][0] }
                                addScannedShipment(scanningData);
                            }
                        } else {
                        // Show Conflicting Resolution Popup
                        conflictsData = {
                            ...data.data,
                            ...(data.data.order ? { order: [data.data.order] } : {}),
                            ...(data.data.manifest ? { manifest: [data.data.manifest] } : {}),
                        }
                        setConflictsData({})
                        if(Object.keys(conflictsData)?.length > 1) {
                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }
                        setConflictsData(conflictsData);
                        setModalOpen(true)
                        setConflict(true);
                    }
                        }

                        if (conflictsData.hasOwnProperty('exceptionList')) {
                            setExceptionList(responseData.exceptionList.sort((a: IExceptionRecord, b: IExceptionRecord) => b.exceptionType.localeCompare(a.exceptionType)));
                            conflictsData = Object.keys(conflictsData).filter(key =>
                                key !== 'exceptionList').reduce((obj, key) => {
                                    obj[key] = conflictsData[key];
                                    return obj;
                                }, {}
                                );
                        }
                    }


                } catch (error) {
                    console.log(error)
                    setScanId('');
                    disableFilters();
                    setScanningInProgress(false)
                    toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
                }
            }
        }
    }

    const addScannedShipment = async (responseData: any) => {
        if(scanningInProgress) { return; }
        const scannedManifestIdsSet = new Set(manifestList.map((manifest) => manifest.manifestId))
        const scannedManifestParentIdsSet = new Set(manifestList.map((manifest) => manifest.hasOwnProperty('parentManifestId') ? manifest.parentManifestId : ''))
        const scannedManifests = new Set(manifestList?.map((manifest) => manifest.manifestName))
        const scannedOrders = new Set(tableData?.map((order) => order.hasOwnProperty('manifestId') ? order.manifestId : order.hasOwnProperty('outwardMFId') ? order.outwardMFId : null))
        const scannedShipmentIdsSet = new Set(scannedShipmentIds)
        if (!isEmpty(responseData) && responseData.hasOwnProperty('manifest') || (!responseData.hasOwnProperty('order') && !responseData.hasOwnProperty('awb') && !responseData.hasOwnProperty('crate'))) {
            if(scannedManifestIdsSet.has(responseData.manifest?.manifestId) || scannedManifestIdsSet.has(responseData.manifestId) || scannedOrders.has(responseData?.manifestName) || scannedOrders.has(responseData?.manifest?.manifestName) || scannedManifestIdsSet.has(responseData.parentManifestId) || scannedManifestIdsSet.has(responseData?.manifest?.parentManifestId) || scannedManifestParentIdsSet.has(responseData.manifestId) || scannedManifestParentIdsSet.has(responseData.manifest?.manifestId)) {
                playDuplicateBeep();    
                toast.add(dynamicLabels.manifestIdAlreadyScanned, 'warning', false);
                return
            }
            if(isEmpty(responseData) && !isEmpty(scannedShipmentIds)) {
                playDuplicateBeep();    
                toast.add(dynamicLabels.awbAlreadyScanned || 'This AWB Number is already scanned.', 'warning', false);
                return
            }

            const manifestTableData = responseData.hasOwnProperty('manifest') ? [responseData.manifest].map((manifest: any) => {

                manifest['numberOfOrders'] = manifest['orderCount']
                manifest['scanStatus'] = manifest['hubScanStatus']
                manifest['originHub'] = manifest['originBranch']
                manifest['destinationHub'] = manifest['destBranch']
                return manifest;
            }) : [responseData].map((manifest: any) => {

                manifest['numberOfOrders'] = manifest['orderCount']
                manifest['scanStatus'] = manifest['hubScanStatus']
                manifest['originHub'] = manifest['originBranch']
                manifest['destinationHub'] = manifest['destBranch']
                return manifest;
            })
            const manifestData = {
                clientBranchId: 0,
                otherCount: 0,
                results: manifestList?.length > 0 ? [ ...manifestList, ...manifestTableData] : manifestTableData,
                totalCount: manifestTableData.length
            }
            playSuccess();
            dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: manifestData });
            setTabActive("manifests");
            setTotalCrates((totalCratesCount) => totalCratesCount += responseData.hasOwnProperty('manifest') ? responseData.manifest.totalCrates || 0 : responseData.totalCrates);
            setTotalInscannedOrders((totalInscannedOrders) => totalInscannedOrders += responseData.hasOwnProperty('manifest') ? responseData.manifest.orderCount : responseData.orderCount);
        }
        Object.keys(responseData).forEach((key) => {

            switch (key) {

                case 'order':
                    {
                        if (scannedShipmentIdsSet.has(responseData[key].shipmentId.toString())) {
                            delete responseData[key]
                        }

                        const dataKeys = Object.keys(responseData)
                        if (!responseData[key] && dataKeys.length === 0 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                            playDuplicateBeep();
                            toast.add(dynamicLabels.orderAlreadyScanned, 'warning', false);
                            return
                        }
                        if (dataKeys.length === 1) {
                            handleSuccess([responseData[key]])
                        }
                    }
                    break;

                case 'awb':
                    {
                        responseData[key] = responseData[key].filter((orderObj: Record<string, any>) => !scannedShipmentIdsSet.has(orderObj.shipmentId.toString()))

                        if (responseData[key].length === 0) {
                            if (Object.keys(responseData).length === 1 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                                playDuplicateBeep()
                                toast.add(dynamicLabels.awbAlreadyScanned, 'warning', false);
                            }
                            delete responseData[key]
                            return
                        }

                        if (Object.keys(responseData).length === 1 && responseData[key].length === 1) {
                            handleSuccess(responseData[key])
                        }
                    }
                    break;

                case 'crate':
                    {
                        const scannedOrdersIndexMap = new Map();
                        tableData.forEach((ord: Record<string, any>, index: number) => {
                            scannedOrdersIndexMap.set(ord.shipmentId, index)
                        })

                        responseData[key] = responseData[key].filter((ord: Record<string, any>) => {
                            const index = scannedOrdersIndexMap.get(ord.shipmentId)
                            const crateCdAlreadyScannedForOrder =
                                index !== undefined &&
                                (tableData[index].scannedCrateCodes && tableData[index].crates ? (tableData[index].scannedCrateCodes.has(localStorage.getItem('scanIdentifier')))
                                    : true)

                            return !crateCdAlreadyScannedForOrder
                        })

                        if (responseData[key].length === 0) {
                            if (Object.keys(responseData).length === 1 || scannedManifests.has(responseData[key]?.manifestId || responseData[key]?.outwardMFId)) {
                                playDuplicateBeep()
                                toast.add(dynamicLabels.crateAlreadyScanned, 'warning', false);
                            }
                            delete responseData[key]
                            return
                        }

                        if (Object.keys(responseData).length === 1 && responseData[key].length === 1) {
                            handleSuccess(responseData[key], true)
                        }
                    }
                    break;
            }

        })
    }



    const saveManifest = function (action: string, updateFlag: boolean) {
            finalSubmit(action, updateFlag);
    }

    const submitAPICall = async (action: string, useExisting?: boolean) => {
        let payload: Record<string, any> = {}
        let dispatchNum = 0;
      
            const allShipments = tableData.map((obj: Record<string, any>) => { return obj.shipmentId })
            const allManifestList = manifestList.map((obj: any) => { return obj.manifestId });
            payload = {
                "shipmentIds": allShipments,
                "manifestIds": allManifestList
            }

            try {

                const { data } = await axios.post(apiMappings.inscanUpdate.form.create, payload)
                dispatchNum = data?.metaData?.dispatchNum;
                toast.add(data.message, 'check-round', false);
                if (action == 'saveAndAsign') {
                    resetSaveAndNew(payload.manifestCategory);
                    setBagNum((bagNum) => bagNum++);
                } else {
                    setTimeout(() => {
                        resetForm();
                    }, 1000)
                }
            } catch (error) {
                toast.add(dynamicLabels.somethingWendWrong, 'warning', false);
            }
        
    }


    const finalSubmit = async (action: string, updateFlag?: boolean) => {
        const partialCratesScannedShipments:string[] = []
        tableData.forEach(({ orderNo, orderNoMM, scannedCrateCodes, crates }) => {
            if (scannedCrateCodes && scannedCrateCodes.size !== crates.length) {
                partialCratesScannedShipments.push(PRODUCT_TYPE === 'allmile' ? orderNoMM : orderNo)
            }
        })
        if (partialCratesScannedShipments.length) {
            toast.add(dynamicLabels.scanAllCratesValidationMessage.replace(':1', partialCratesScannedShipments.join(', ')), 'warning', false)
            return
        }

        if (tableData.length || manifestList.length) {
            submitAPICall(action)
            return
        } 

    }


    return (
        <>
            <Box style={{ padding: 15, paddingBottom: 5, paddingTop: 0 }}>
                <Card>
                    {isFormLoading || sectionKeys.length === 0 ? (
                        <div ref={loaderRef}>
                            <FormLoader />
                        </div>
                    ) :
                        <FormContainer>
                            <Grid container spacing='15px' style={{ padding: "15px 5px" }}>
                                {sectionKeys.length > 0 && sectionKeys.map((sectioName) => {
                                    return Object.keys(structure[sectioName]).map((fieldName) => {
                                        const meta = structure[sectioName][fieldName];
                                        meta.multipleFiles = false;
                                        const { permission } = meta;
                                        if (!permission) {
                                            return undefined;
                                        }

                                        if (counters.includes(fieldName)) {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields'>
                                                    <Grid container style={{ padding: "0px" }}>
                                                        <Grid item xs={12} sm={5} md={5} className='grid-item form-fields pr-0'>
                                                            <FormFieldWapper>
                                                                {meta.label}
                                                            </FormFieldWapper>
                                                        </Grid>
                                                        <Grid item xs={12} sm={5} md={5} className='grid-item form-fields noLabel pl-0'>
                                                            <FormFieldWapper>
                                                                <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                            </FormFieldWapper>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            );
                                        } else {
                                            return (
                                                <Grid item key={fieldName} xs={12} sm={6} md={3} className='grid-item form-fields'>
                                                    <FormFieldWapper>
                                                        <FormField name={fieldName} meta={meta} formInstance={formInstance} />
                                                    </FormFieldWapper>
                                                </Grid>
                                            );
                                        }
                                    })
                                })
                                }
                            </Grid>
                            <Grid container spacing='15px' style={{ padding: "0 15px 15px 5px" }}>
                                <Grid item xs={12} sm={6} md={3} className='grid-item form-fields scanid'>
                                    <FormFieldWapper>
                                        <TextInput disabled={isFormEditable} name="scanId" label={dynamicLabels.scanId} placeholder={dynamicLabels.enterScanId} value={scanId} onKeyDown={(e) => scanById(e)} onChange={(e) => setScanId(e.target.value)} />
                                    </FormFieldWapper>
                                </Grid>
                            </Grid>
                        </FormContainer>}
                        <SelectConflictingRecordsModal setModalOpen={setModalOpen} isModalOpen={isModalOpen} conflictsData={conflictsData} onSelectConflictingOrder={onSelectConflictingOrder} scanSelectedType={scanSelectedType} setScanSelectedType={setScanSelectedType} selectedAccordionType={selectedAccordionType} setSelectedAccordionType={setSelectedAccordionType} scanId={localStorage.getItem('scanIdentifier') || ''} />
                </Card>
            </Box>
            <Box style={{ padding: 15 }}>
                <TabButtonContainer>
                    <ButtonGroup
                        data={buttonData}
                        onChange={(id) => { setTabActive(id) }}
                    />
                </TabButtonContainer>
                <ContentWrapper>
                    {activeTab === 'orders' ?
                        <OrderInscanListview
                            tableData={tableData}
                            setTabledata={setTabledata}
                            scannedShipmentIds={scannedShipmentIds}
                            setScannedShipmentIds={setScannedShipmentIds}
                            totalCrates={totalcratecodes}
                            setTotalCrates={setTotalCrates}
                            totalInscannedOrders={totalInscannedOrders}
                            setTotalInscannedOrders={setTotalInscannedOrders}
                        /> :
                        <ManifestInscanListview
                            tableData={tableData}
                            setTabledata={setTabledata}
                            scannedShipmentIds={scannedShipmentIds}
                            setScannedShipmentIds={setScannedShipmentIds}
                            totalCrates={totalcratecodes}
                            setTotalCrates={setTotalCrates}
                            totalInscannedOrders={totalInscannedOrders}
                            setTotalInscannedOrders={setTotalInscannedOrders}
                        />
                    }
                    <ButtonContainer>
                        {showSaveUpdate && <IconButton id="inscan--actionbar--save" disabled={isFormEditable ? (existingManifests.filter((ele: any) => { return manifestList?.indexOf(ele) < 0 }).length === 0) && (existingShipments.filter((ele: number) => { return tableData.map((obj: Record<string, any>) => { return obj.shipmentId }).indexOf(ele) < 0 }).length === 0)  : tableData.length == 0 && (manifestList && manifestList?.length === 0) && !isFormEditable} iconVariant='icomoon-save' primary onClick={() => saveManifest('save', isFormEditable)}>{isFormEditable ? dynamicLabels.update : dynamicLabels.save}</IconButton>}
                        {!isFormEditable && <IconButton id="inscan--actionbar--save_and_new" disabled={isFormEditable ? (tableData.length == 0) && (manifestList?.length === 0) : tableData.length == 0 && (manifestList && manifestList?.length === 2) && !isFormEditable} iconVariant='icomoon-save-and-assign' primary onClick={() => saveManifest('saveAndAsign', false)}>{dynamicLabels.manifestSaveAndNew}</IconButton>}
                        <IconButton id="inscan--actionbar--cancel" iconVariant='cancel-button' onClick={() => resetAndCancel()}>{dynamicLabels.cancel}</IconButton>
                    </ButtonContainer>
                </ContentWrapper>
            </Box>
            <ExceptionListModal isOpen={exceptionModalOpen} onClose={setExceptionModalOpen} scanSelectedType={scanSelectedType} selectedAccordionType={selectedAccordionType} continueScanning={continueScanning} scanApiPayload={scanApiPayload} setExceptionList={setExceptionList} />
        </>
    )
}

export default memo(InscanForm);