import React, { Dispatch, useState } from "react";
import { withReactOptimized } from "../../utils/components/withReact";
import InscanForm from "./Components/InscanForm";
import { BreadCrumb } from "ui-library";
import useDynamicLabels from "../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../common/DynamicLabels/dynamicLabels.mapping";
import { BreadCrumbContainer, Header } from "./Components/InscanStyledComponent";
import { IStateService } from "angular-ui-router";
import { useTypedSelector } from "../../utils/redux/rootReducer";
import { useDispatch } from "react-redux";
import { InscanOrderManifestActions } from "./InscanOrderManifest.actions";

interface IInscanEntryProps {
    ngStateRouter: IStateService
}

const InscanEntry = ({ ngStateRouter }: IInscanEntryProps) => {
    const [tableData, setTabledata] = useState<Array<any>>([]);
    const [totalWeight, setTotalWeight] = useState<number>(0);
    const [totalVolume, setTotalVolume] = useState<number>(0);
    const [totalCrates, setTotalCrates] = useState<number>(0);
    const [totalPendingOrders, setTotalPendingOrders] = useState<number>(0);
    const [scannedShipmentIds, setScannedShipmentIds] = useState<Array<string>>([]);
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.inscan);
    const dispatch = useDispatch<Dispatch<InscanOrderManifestActions>>();
    const breadCrumbOptions = React.useMemo(() => {
            return [
                {
                    id: 'SCAN ORDER',
                    label: dynamicLabels['Scan Orders'],
                    disabled: false,
                },
                {
                    id: 'INSCAN',
                    label: dynamicLabels['Inscan Orders'],
                    disabled: true,
                }
            ]
    }, [dynamicLabels]);

    const resetForm = () => {
        ngStateRouter.go('scannedOrders');
        setTabledata([])
        setTotalCrates(0);
        setTotalVolume(0);
        setTotalPendingOrders(0);
        setScannedShipmentIds([]);
        setTimeout(() => {
            dispatch({ type: '@@inscanOrderManifest/SET_FORM_EDITABLE', payload: false });
            dispatch({ type: '@@inscanOrderManifest/RESET_MANIFEST_DATA' });
            dispatch({ type: '@@inscanOrderManifest/FETCH_MANIFEST_OF_MANIFEST_LIST_SUCCESS', payload: { clientBranchId: 0, otherCount: 0, results: [], totalCount: 0}});
        },100)
    }

    const handleBreadCrumbChange = () => {
        resetForm();
    }

    return (
        <>
            <Header>
                <BreadCrumbContainer>
                    <BreadCrumb options={breadCrumbOptions} onClick={() => handleBreadCrumbChange()} />
                </BreadCrumbContainer>
            </Header>
            <InscanForm
                tableData={tableData}
                setTabledata={setTabledata}
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
                totalcratecodes={totalCrates}
                setTotalCrates={setTotalCrates}
            />
        </>

    )
}

export default withReactOptimized(InscanEntry);