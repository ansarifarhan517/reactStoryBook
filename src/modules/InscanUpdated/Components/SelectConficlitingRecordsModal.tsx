import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal, ModalHeader, Box, Accordion, Radio, IconButton } from "ui-library";
import { toCapitalized } from "../../../utils/helper";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { isEmpty } from "../utils";
import { AccordianTitle, CrateDetailsWrapper, TableContent } from "./InscanStyledComponent";
interface ISelectConflictingRecordsModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean
    conflictsData: Record<string, any>
    onSelectConflictingOrder: Function 
    scanSelectedType: any
    setScanSelectedType: Dispatch<SetStateAction<any>>;
    selectedAccordionType: string
    setSelectedAccordionType: Dispatch<SetStateAction<string>>
    scanId: string
}

const SelectConflictingRecordsModal = (props: ISelectConflictingRecordsModalProps) => {
    const { setModalOpen, isModalOpen, conflictsData, onSelectConflictingOrder, scanSelectedType, setScanSelectedType, selectedAccordionType, setSelectedAccordionType, scanId } = props;
    const [openAccordian, setAccordianOpen] = useState<string>('');
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.inscan);

    useEffect(() => {
        if(!isEmpty(conflictsData)) {
            setAccordianOpen(Object.keys(conflictsData)[0].toString());
            setScanSelectedType({});
        }
    },[conflictsData])


    const getAccordianTitle = (key: string) => {
        if (key.length > 0) {
            switch (key) {
                case 'manifest':
                    return dynamicLabels.manifestDetails || 'Manifest Details.';
                    break;
                case 'awb':
                    return dynamicLabels.awbDetails || 'Airway Bill Details.';
                    break;
                case 'order':
                    return dynamicLabels.orderDetails || 'Order Details.';
                    break;
                case 'crate':
                    return dynamicLabels.crate_s || 'Crate Details.';
                    break;
                default:
                    return;

            }
        } else { return; };
    }
    return (
        <Modal
            onToggle={() => {
                setModalOpen(false)
            }}
            open={isModalOpen}
            width="1140px"
            children={{
                header: (
                    <ModalHeader
                        headerTitle={dynamicLabels.selectRecordOfScannedId}
                        width="1140px"
                        handleClose={() => {
                            setModalOpen(false)
                        }}
                        imageVariant="icomoon-close"
                        headerStyle={{ fontSize: "15px" }}
                    />
                ),
                content: (
                    <CrateDetailsWrapper>
                        {Object.keys(conflictsData).map((key: string) => {
                            return <Accordion key={key} id={key} expanded={openAccordian === key} onToggle={() => setAccordianOpen(openAccordian === key ? "" : key)} >
                                {{
                                    header: (<AccordianTitle>{getAccordianTitle(key)}</AccordianTitle>),
                                    content: (
                                        <TableContent>
                                            {key === 'manifest' &&
                                                conflictsData['manifest'].length > 0 &&
                                                <table style={{width: "100%"}}>
                                                      <tbody> 
                                                    <tr>
                                                        <th></th>
                                                        <th>{ dynamicLabels.manifest } { dynamicLabels.ID }</th>
                                                        <th>{ dynamicLabels.statusCd }</th>
                                                    </tr>
                                                    {conflictsData['manifest'].map((obj:any, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj} /> </td>
                                                            <td title={obj.manifestName}>{ obj.manifestName }</td>
                                                            <td title={obj.hubScanStatus}>{ obj.hubScanStatus }</td>
                                                        </tr>
                                                    })}   
                                                     </tbody> 
                                                </table>
                                            }

                                            {key === 'awb' &&
                                                conflictsData['awb'].length > 0 &&
                                                <table style={{width: "100%"}}>
                                                    <tbody> 
                                                    <tr>
                                                        <th></th>
                                                        <th>{dynamicLabels.mm_order_s} {dynamicLabels.number}</th>
                                                        <th>{dynamicLabels['Airway Bill Number']}</th>   
                                                        <th>{dynamicLabels.origin}</th> 
                                                        <th>{dynamicLabels.destinationName}</th> 
                                                        <th>{dynamicLabels.statusCd}</th>
                                                    </tr>
                                                    {conflictsData['awb'].map((obj:any, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj} /> </td>
                                                            <td title={obj.orderNo}>{ obj.orderNo }</td>
                                                            <td title={obj.awbNumber}>{ obj.awbNumber }</td>
                                                            <td title={obj.originAddress}>{ obj.originAddress }</td>
                                                            <td title={obj.destinationAddress}>{ obj.destinationAddress }</td>
                                                            <td title={dynamicLabels[obj.packageStatusCd]}>{ dynamicLabels[obj.packageStatusCd] }</td>
                                                        </tr>
                                                    })}   
                                                </tbody>
                                                </table>}

                                                {key === 'order' &&
                                                conflictsData['order'].length > 0 &&
                                                <table style={{width: "100%"}}>
                                                    <tbody> 
                                                    <tr>
                                                        <th></th>
                                                        <th>{dynamicLabels.mm_order_s} {dynamicLabels.number}</th>
                                                        <th>{dynamicLabels['Airway Bill Number']}</th>   
                                                        <th>{dynamicLabels.origin}</th> 
                                                        <th>{dynamicLabels.destinationName}</th> 
                                                        <th>{dynamicLabels.statusCd}</th>
                                                    </tr>
                                                    {conflictsData['order'].map((obj:any, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj} /> </td>
                                                            <td title={obj.orderNo}>{ obj.orderNo }</td>
                                                            <td title={obj.awbNumber}>{ obj.awbNumber }</td>
                                                            <td title={obj.originAddress}>{ obj.originAddress }</td>
                                                            <td title={obj.destinationAddress}>{ obj.destinationAddress }</td>
                                                            <td title={dynamicLabels[obj.packageStatusCd]}>{ dynamicLabels[obj.packageStatusCd] }</td>
                                                        </tr>
                                                    })}   
                                                </tbody>
                                                </table>}
                                                {key === 'crate' &&
                                                conflictsData['crate'].length > 0 &&
                                                <table style={{width: "100%"}}>
                                                    <tbody> 
                                                    <tr>
                                                        <th></th>
                                                        <th>{dynamicLabels.crateCode}</th>
                                                        <th>{dynamicLabels.mm_order_s} {dynamicLabels.number}</th>
                                                        <th>{dynamicLabels['Airway Bill Number']}</th>   
                                                        <th>{dynamicLabels.origin}</th> 
                                                        <th>{dynamicLabels.destinationName}</th> 
                                                        <th>{dynamicLabels.statusCd}</th>
                                                    </tr>
                                                    {conflictsData['crate'].map((obj:any, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj} /> </td>
                                                            <td title={obj.crates && obj.crates.length > 0 ? obj.crates.find((crate:any) => crate.crateCd?.toString().toLowerCase() === scanId)?.crateCd : toCapitalized(scanId)}>{ obj.crates && obj.crates.length > 0 ? obj.crates.find((crate:any) => crate.crateCd?.toString().toLowerCase() === scanId)?.crateCd : toCapitalized(scanId) }</td>
                                                            <td title={obj.orderNo}>{ obj.orderNo }</td>
                                                            <td title={obj.awbNumber}>{ obj.awbNumber }</td>
                                                            <td title={obj.originAddress}>{ obj.originAddress }</td>
                                                            <td title={obj.destinationAddress}>{ obj.destinationAddress }</td>
                                                            <td title={dynamicLabels[obj.packageStatusCd]}>{ dynamicLabels[obj.packageStatusCd] }</td>
                                                        </tr>
                                                    })}   
                                                </tbody>
                                                </table>}
                                        </TableContent>
                                    )
                                }}
                            </Accordion>
                        })}

                    </CrateDetailsWrapper>
                ),
                footer: (
                    <Box
                        horizontalSpacing="10px"
                        display="flex"
                        justifyContent="flex-end"
                        p="15px"
                    >
                        <IconButton
                            id='Inscan-conflictingRecords-modal-Confirm'
                            iconVariant="icomoon-tick-circled"
                            primary
                            iconSize={11}
                            disabled={isEmpty(scanSelectedType)}
                            onClick={() => {
                                onSelectConflictingOrder(scanSelectedType, selectedAccordionType);
                                setModalOpen(false);
                            }}
                        >
                            {dynamicLabels.confirm}
                        </IconButton>
                        <IconButton
                             id='Inscan-conflictingRecords-modal-Confirm'
                            iconVariant="cancel-button"
                            iconSize={11}
                            onClick={() => {
                                setModalOpen(false)
                            }}
                        >
                            {dynamicLabels.cancel}
                        </IconButton>
                    </Box>
                ),
            }}
        />
    )
}

export default SelectConflictingRecordsModal;