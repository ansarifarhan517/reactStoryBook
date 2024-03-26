import React, { Dispatch, useState, useEffect } from "react";
import { withReactOptimized } from "../../utils/components/withReact";
import OutscanForm from "./Components/OutscanForm";
import { BreadCrumb } from "ui-library";
import useDynamicLabels from "../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../common/DynamicLabels/dynamicLabels.mapping";
// import { hybridRouteTo } from "../../utils/hybridRouting";
import { BreadCrumbContainer, Header } from "./Components/OutscanStyledComponent";
import { IStateService } from "angular-ui-router";
import { useTypedSelector } from "../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { OutscanOrderManifestActions } from "./OutscanOrderManifest.actions";
import { deepCopy } from "../../utils/helper";
import { IManifestData } from "./OutscanOrderManifest.models";
import { convertVolume, convertWeight, isEmpty } from "./utils";
import { IMongoFormStructure } from "../../utils/mongo/interfaces";
import { userAccessInfo } from "../../utils/constants"
interface IOutscanEntryProps {
    ngStateRouter: IStateService
}

const OutscanEntry = ({ ngStateRouter }: IOutscanEntryProps) => {
    const [tableData, setTabledata] = useState<Array<any>>([]);
    const [totalCratesCount, setTotalCratesCount] = useState<number>(0);
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [totalVolume, setTotalVolume] = useState<number>(0);
    const [totalPendingOrders, setTotalPendingOrders] = useState<number>(0);
    const [scannedShipmentIds, setScannedShipmentIds] = useState<Array<string>>([]);
    const isFormEditable = useTypedSelector((state) => state.outscan.form.isEditable);
    const structure = useTypedSelector((state) => state.outscan.form.structure);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.outscan);
    const dispatch = useDispatch<Dispatch<OutscanOrderManifestActions>>();
    
    useEffect(() => {
        dispatch({ type: '@@outscanOrderManifest/GET_CLIENT_METRIC_SYSTEM'})
    }, []);
    
    const updateFormStructure = (newStructure: IMongoFormStructure) => {
        dispatch({ type: '@@outscanOrderManifest/FETCH_ADD_MANIFEST_FORM_STRUCTURE_SUCCESS', payload: newStructure })
        dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: false });
    }
    const breadCrumbOptions = React.useMemo(() => {
        if (isFormEditable) {
            return [
                {
                    id: 'MANIFEST',
                    label: dynamicLabels.manifest,
                    disabled: false,
                },
                {
                    id: 'UPDATE',
                    label: dynamicLabels?.['Update Manifest'],
                    disabled: true,
                }
            ]
        } else {
            return [
                {
                    id: 'MANIFEST',
                    label: dynamicLabels.manifest,
                    disabled: false,
                },
                {
                    id: 'CREATE',
                    label: dynamicLabels?.['Add Manifest'],
                    disabled: true,
                }
            ]
        }
    }, [dynamicLabels]);

    const resetForm = () => {
        ngStateRouter.go('manifest');
        setTabledata([])
        setTotalCratesCount(0);
        setTotalWeight(0);
        setTotalVolume(0);
        setTotalPendingOrders(0);
        setScannedShipmentIds([]);
        setTimeout(() => {
            dispatch({ type: '@@outscanOrderManifest/SET_FORM_EDITABLE', payload: false });
            dispatch({ type: '@@outscanOrderManifest/RESET_MANIFEST_DATA' });
            dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0, otherCount: 0, results: [], totalCount: 0 } });
            dispatch({ type: '@@outscanOrderManifest/SET_DISPATCH_NUMBER', payload: 0 });
        }, 100)
        if (!isEmpty(structure) && structure.hasOwnProperty('general details')) {
            const newStructure = deepCopy(structure);
                if (Object.keys(newStructure).length > 0) {
                        newStructure['general details'].serviceTypeFilter.editable = true;
                        newStructure['general details'].originBranchFilter.editable = true;
                        newStructure['general details'].nextBranchFilter.editable = true;
                        newStructure['general details'].selectDm.editable = true;
                        newStructure['general details'].selectTrip.editable = true;
                        newStructure['general details'].manifestCategory.editable = true;
                        newStructure['general details'].outscanBy.editable = true;
                        newStructure['general details'].cancelledOrderAllowedFl.editable = true;
                        newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                        newStructure['general details'].totalOutscannedOrders.permission = true;
                        updateFormStructure(newStructure);
                }
            }
    }

    const handleBreadCrumbChange = () => {
        resetForm();
    }

    useEffect(() => {
        if (!ngStateRouter.params.id) {
            setTabledata([])
            setTotalCratesCount(0);
            setTotalWeight(0);
            setTotalVolume(0);
            setTotalPendingOrders(0);
            setScannedShipmentIds([]);
            setTimeout(() => {
                dispatch({ type: '@@outscanOrderManifest/SET_FORM_EDITABLE', payload: false });
                dispatch({ type: '@@outscanOrderManifest/RESET_MANIFEST_DATA' });
                dispatch({ type: '@@outscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0, otherCount: 0, results: [], totalCount: 0 } });
                updateFormStructure({buttons:{}, columns:{}});
            }, 100)
        }
    }, [ngStateRouter]);

    const updateTripFields = (setValue?: Function, data?: IManifestData) => {
        if (structure.hasOwnProperty('general details') && !isEmpty(structure['general details'])) {
            const newStructure = deepCopy(structure);
            if (isFormEditable && setValue) {
                dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
                setTimeout(() => {
                    newStructure['general details'].selectTrip.permission = true;
                    newStructure['general details'].selectTrip.editable = false;
                    newStructure['general details'].selectDm.permission = true;
                    newStructure['general details'].selectDm.editable = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].cancelledOrderAllowedFl.editable = false;
                    newStructure['general details'].pendingForOutscan.permission = true;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].pendingForInscan.editable = false;
                    newStructure['general details'].tripStatus.permission = true;
                    newStructure['general details'].tripStatus.editable = false;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].manifestId.editable = false;
                    newStructure['general details'].outscanBy.editable = false;
                    newStructure['general details'].manifestCategory.editable = false;
                    updateFormStructure(newStructure);
                    setValue('manifestId', data?.manifestId);
                    setValue('outscanBy', { 'clientRefMasterCd': 'Trip', 'id': 'Trip', 'name': dynamicLabels.trip});
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl)
                    setTimeout(() => {
                        setValue('selectTrip', { 'clientRefMasterCd': data?.tripName, 'id': data?.tripId, 'name': data?.tripName, 'clientRefMasterDesc': data?.tripName })
                    },100)
                    setValue('selectDm', { 'id': 1, 'name': data?.deliveryBoy, 'deliveryMediumName': data?.deliveryBoy });
                    setValue('manifestCategory', { 'clientRefMasterCd': data?.manifestCategory, 'id': data?.manifestCategory, 'name': data?.manifestCategory });
                    setValue('tripStatus', dynamicLabels[data?.tripStatus]);
                    setValue('totalCrateCodes', data?.totalCrates)
                    setValue('totalVolume', data?.totalVolume ? convertVolume(data?.totalVolume) : 0)
                    setValue('totalWeight', data?.totalWeight ? convertWeight(data?.totalWeight ) : 0)
                    setValue('totalOutscannedOrders', data?.totalOrders)
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl ? 'Y' : 'N');
                }, 100);
            } else {
                    newStructure['general details'].selectCourier.permission = false;
                    newStructure['general details'].selectDm.permission = true;
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].selectTrip.editable = true;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].totalOutscannedOrders.permission = false;
                    newStructure['general details'].totalCrateCodes.permission = false;
                    newStructure['general details'].totalWeight.permission = false;
                    newStructure['general details'].totalVolume.permission = false;
                    updateFormStructure(newStructure);
            }
        }
    }

    const updateCourierFields = (setValue?: Function, data?: IManifestData) => {
        const newStructure = deepCopy(structure);
        if (Object.keys(newStructure).length > 0) {
            if (isFormEditable && setValue) {
                dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
                setTimeout(() => {
                    newStructure['general details'].selectCourier.permission = true;
                    newStructure['general details'].selectCourier.editable = false;
                    newStructure['general details'].cancelledOrderAllowedFl.editable = false;
                    newStructure['general details'].pendingForOutscan.permission = true;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].manifestId.editable = false;
                    newStructure['general details'].outscanBy.editable = false;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].pendingForInscan.editable = false;
                    newStructure['general details'].manifestCategory.editable = false;
                    updateFormStructure(newStructure);
                    setValue('manifestId', data?.manifestId);
                    setValue('outscanBy', { 'clientRefMasterCd': 'Courier', 'id': 'Courier', 'name': 'Courier' });
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl);
                    setValue('selectCourier', { 'clientRefMasterCd': 'Courier', 'id': 'Courier', 'name': data?.coLoader });
                    setValue('manifestCategory', { 'clientRefMasterCd': data?.manifestCategory, 'id': data?.manifestCategory, 'name': data?.manifestCategory });
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl ? 'Y' : 'N');
                }, 100);
            } else {
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].selectCourier.permission = true;
                    newStructure['general details'].totalOutscannedOrders.permission = false;
                    newStructure['general details'].totalCrateCodes.permission = false;
                    newStructure['general details'].totalWeight.permission = false;
                    newStructure['general details'].totalVolume.permission = false;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].selectDm.permission = false;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    updateFormStructure(newStructure);
            }

        }
    }

    const updateOrderFields = (setValue?: Function, data?: IManifestData) => {
        const newStructure = deepCopy(structure);
        if (Object.keys(newStructure).length > 0) {
            if (isFormEditable && setValue) {
                dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
                    newStructure['general details'].selectCourier.permission = false;
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].cancelledOrderAllowedFl.editable = false;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].pendingForOutscan.permission = false;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].totalOutscannedOrders.permission = true;
                    newStructure['general details'].totalCrateCodes.permission = true;
                    newStructure['general details'].totalWeight.permission = true;
                    newStructure['general details'].totalVolume.permission = true;
                    newStructure['general details'].outscanBy.editable = false;
                    newStructure['general details'].manifestCategory.editable = false;
                    newStructure['general details'].manifestId.editable = false;
                    newStructure['general details'].outscanBy.editable = false;
                    updateFormStructure(newStructure);
                    dispatch({type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true})
                        setTimeout(() => {
                            setValue('manifestId', data?.manifestId);
                            setValue('totalOutscannedOrders', data?.totalOrders)
                            setValue('outscanBy', { 'clientRefMasterCd': 'Order', 'id': 'Order', 'name': userAccessInfo.superType == "MIDDLEMILE" ? dynamicLabels.mm_order_s ? dynamicLabels.mm_order_s : '' : dynamicLabels.order_s ? dynamicLabels.order_s : ''});
                            setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl);
                            setValue('manifestCategory', { 'clientRefMasterCd': data?.manifestCategory, 'id': data?.manifestCategory, 'name': data?.manifestCategory });
                            setValue('totalCrateCodes', data?.totalCrates)
                            setValue('totalVolume', data?.totalVolume ? convertVolume(data?.totalVolume) : 0)
                            setValue('totalWeight', data?.totalWeight ? convertWeight(data?.totalWeight) : 0)
                            setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl ? 'Y' : 'N');
                        },0)
                         dispatch({type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: false})

            } else {
                    newStructure['general details'].selectDm.permission = false;
                    newStructure['general details'].totalCrateCodes.permission = true;
                    newStructure['general details'].totalWeight.permission = true;
                    newStructure['general details'].totalVolume.permission = true;
                    newStructure['general details'].totalOutscannedOrders.permission = true;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].pendingForOutscan.permission = false;
                    newStructure['general details'].selectCourier.permission = false;
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].originBranchFilter.permission = false;
                    newStructure['general details'].nextBranchFilter.permission = false;
                    newStructure['general details'].serviceTypeFilter.permission = false;
                    newStructure['general details'].tripNameFilter.permission = false;
                    
                    newStructure['general details'].manifestCategory.editable = true;
                    newStructure['general details'].outscanBy.editable = true;
                    newStructure['general details'].cancelledOrderAllowedFl.editable = true;
                    newStructure['general details'].totalVolume.editable = false;
                    newStructure['general details'].totalWeight.editable = false;
                    updateFormStructure(newStructure);
            }
        }
    }

    const updateBranchFields = (setValue?: Function, data?: IManifestData) => {
        const newStructure = deepCopy(structure);
        if (Object.keys(newStructure).length > 0) {
            if(isFormEditable && setValue) {
                dispatch({ type: '@@outscanOrderManifest/SET_FORM_LOADING', payload: true });
                    newStructure['general details'].selectCourier.permission = false;
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].cancelledOrderAllowedFl.editable = false;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].pendingForOutscan.permission = false;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].originBranchFilter.permission = true;
                    newStructure['general details'].nextBranchFilter.permission = true;
                    newStructure['general details'].serviceTypeFilter.permission = true;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].originBranchFilter.editable = false;
                    newStructure['general details'].nextBranchFilter.editable = false;
                    newStructure['general details'].serviceTypeFilter.editable = false;
                    newStructure['general details'].tripNameFilter.editable = false;
                    newStructure['general details'].selectDm.permission = true;
                    newStructure['general details'].selectTrip.permission = true;
                    newStructure['general details'].selectTrip.editable = false;
                    newStructure['general details'].selectDm.editable = false;
                    newStructure['general details'].manifestId.editable = false;
                    newStructure['general details'].outscanBy.editable = false;
                    newStructure['general details'].manifestCategory.editable = false;
                    newStructure['general details'].totalOutscannedOrders.permission = true;
                    updateFormStructure(newStructure);
                setTimeout(() => {

                    setValue('outscanBy', { 'clientRefMasterCd': 'Branch', 'id': 'Branch', 'name': dynamicLabels.branch_s} );
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl);
                    setValue('originBranchFilter', { id: '-1', name: data?.originBranchCd });
                    setValue('nextBranchFilter', { id: '-1', name: data?.destBranchCd });
                    setValue('serviceTypeFilter', { id: '-1', name: data?.serviceTypeCd });
                    setValue('manifestId', data?.manifestId);
                    setValue('totalOutscannedOrders', data?.totalOrders)
                    setValue('totalCrateCodes', data?.totalCrates)
                    setValue('totalVolume', data?.totalVolume ? convertVolume(data?.totalVolume) : 0)
                    setValue('totalWeight', data?.totalWeight ? convertWeight(data?.totalWeight) : 0)
                    setValue('manifestCategory', { 'clientRefMasterCd': data?.manifestCategory, 'id': data?.manifestCategory, 'name': data?.manifestCategory });
                    setValue('cancelledOrderAllowedFl', data?.cancelledOrderAllowedFl ? 'Y' : 'N');
                }, 0);
            } else {
                    newStructure['general details'].selectTrip.permission = false;
                    newStructure['general details'].selectCourier.permission = false;
                    newStructure['general details'].totalOutscannedOrders.permission = true;
                    newStructure['general details'].totalCrateCodes.permission = true;
                    newStructure['general details'].totalWeight.permission = true;
                    newStructure['general details'].totalVolume.permission = true;
                    newStructure['general details'].tripStatus.permission = false;
                    newStructure['general details'].pendingForInscan.permission = false;
                    newStructure['general details'].pendingForOutscan.permission = false;
                    newStructure['general details'].cancelledOrderAllowedFl.permission = true;
                    newStructure['general details'].selectDm.permission = false;
                    newStructure['general details'].originBranchFilter.permission = true;
                    newStructure['general details'].originBranchFilter.required = true;
                    newStructure['general details'].nextBranchFilter.permission = true;
                    newStructure['general details'].nextBranchFilter.required = true;
                    newStructure['general details'].serviceTypeFilter.permission = true;
                    newStructure['general details'].tripNameFilter.permission = false;
                    newStructure['general details'].selectDm.permission = true;
                    newStructure['general details'].selectTrip.permission = false;
                    updateFormStructure(newStructure);
            }

        }
    }

    return (
        <>
            <Header>
                <BreadCrumbContainer>
                    <BreadCrumb options={breadCrumbOptions} onClick={() => handleBreadCrumbChange()} />
                </BreadCrumbContainer>
            </Header>
            <OutscanForm
                tableData={tableData}
                setTabledata={setTabledata}
                totalCratesCount={totalCratesCount}
                setTotalCratesCount={setTotalCratesCount}
                totalWeight={totalWeight}
                setTotalWeight={setTotalWeight}
                totalVolume={totalVolume}
                setTotalVolume={setTotalVolume}
                totalPendingOrders={totalPendingOrders}
                setTotalPendingOrders={setTotalPendingOrders}
                scannedShipmentIds={scannedShipmentIds}
                setScannedShipmentIds={setScannedShipmentIds}
                ngStateRouter={ngStateRouter}
                resetForm={resetForm}
                updateTripFields={updateTripFields}
                updateCourierFields={updateCourierFields}
                updateOrderFields={updateOrderFields}
                updateBranchFields={updateBranchFields}
            />
        </>

    )
}

export default withReactOptimized(OutscanEntry);