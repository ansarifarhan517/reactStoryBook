import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Modal, ModalHeader, Box, Accordion, Radio, IconButton } from "ui-library";
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { ICrateDetails, ISelectedOrder } from "../OutscanOrderManifest.models";
import { isEmpty } from "../utils";
import { AccordianTitle, ConflictModalButtonContainer, CrateDetailsWrapper, NoteContainer, TableContent } from "./OutscanStyledComponent";
interface ISelectConflictingRecordsModalProps {
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean
    conflictsData: Record<string, any>
    onSelectConflictingOrder: Function
    scanSelectedType: ISelectedOrder
    setScanSelectedType: Dispatch<SetStateAction<ISelectedOrder>>;
    selectedAccordianType: string
    setSelectedAccordionType: Dispatch<SetStateAction<string>>
    scanId: string
}

const SelectConflictingRecordsModal = (props: ISelectConflictingRecordsModalProps) => {
    const { setModalOpen, isModalOpen, conflictsData, onSelectConflictingOrder, scanSelectedType, setScanSelectedType, selectedAccordianType, setSelectedAccordionType, scanId } = props;
    const [openAccordian, setAccordianOpen] = useState<string>('');
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.outscan);

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
                    return dynamicLabels.crateDetails || 'Crate Details.';
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
                                                    {conflictsData['manifest'].map((obj:ISelectedOrder, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj as any} /> </td>
                                                            <td title={obj.manifestName}>{ obj.manifestName }</td>
                                                            <td title={obj.hubScanStatus}>{ dynamicLabels[obj.hubScanStatus] }</td>
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
                                                    {conflictsData['awb'].map((obj:ISelectedOrder, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj as any} /> </td>
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
                                                    {conflictsData['order'].map((obj:ISelectedOrder, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj as any} /> </td>
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
                                                    {conflictsData['crate'].map((obj:ISelectedOrder, index: number) => {
                                                        return <tr key={index.toString()}>
                                                            <td> <Radio name="scanSelectedType" onChange={() => {setSelectedAccordionType(key); setScanSelectedType(obj)}} checked={scanSelectedType === obj} value={obj as any} /> </td>
                                                            <td title={obj.crates.find((crate:ICrateDetails) => crate.crateCd?.toString().toLowerCase() === scanId)?.crateCd}>{ obj.crates.find((crate: ICrateDetails) => crate.crateCd?.toString().toLowerCase() === scanId)?.crateCd }</td>
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
                        justifyContent="space-between"
                        p="15px"
                    >
                        <NoteContainer>{dynamicLabels.scanIDConflictDisclaimer}</NoteContainer>
                        <ConflictModalButtonContainer>
                        <IconButton
                            id='Outscan-conflictingRecords-modal-Confirm'
                            iconVariant="icomoon-tick-circled"
                            primary
                            iconSize={11}
                            disabled={isEmpty(scanSelectedType)}
                            onClick={() => {
                                onSelectConflictingOrder(scanSelectedType, selectedAccordianType);
                                setModalOpen(false);
                            }}
                        >
                            {dynamicLabels.confirm}
                        </IconButton>
                        <IconButton
                            id='Outscan-conflictingRecords-modal-Cancel'
                            iconVariant="cancel-button"
                            iconSize={11}
                            onClick={() => {
                                setModalOpen(false);
                            }}
                        >
                            {dynamicLabels.cancel}
                        </IconButton>
                        </ConflictModalButtonContainer>
                    </Box>
                ),
            }}
        />
    )
}

export default SelectConflictingRecordsModal;