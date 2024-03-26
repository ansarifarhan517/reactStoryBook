import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, ModalHeader, Accordion, Box, IconButton } from 'ui-library';
import DYNAMIC_LABELS_MAPPING from "../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../common/DynamicLabels/useDynamicLabels";
import { AccordianTitle, CrateDetailsWrapper, NoDataAvailable, TableContent } from "./InscanStyledComponent";
interface ICrateDetailsModalProps {
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    crateDetails: Record<string, any>;
}
const CrateModal = (props: ICrateDetailsModalProps) => {
    const { isOpen, onClose, crateDetails } = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.inscan);
    const [isScannedCratesOpen, setScannedCrates] = useState<boolean>(false);
    const [openAccordian, setAccordianOpen] = useState<string>('');

    return (
        <Modal open={isOpen} onToggle={() => onClose(false)} size='md' width='750px'>
            {{
                header: <ModalHeader width='750px' headerTitle={dynamicLabels.crateDetails} handleClose={() => onClose(false)} />,

                content:
                    <CrateDetailsWrapper>
                        {Object.keys(crateDetails).map((key: string) => {
                            return <Accordion key={key} id={key} expanded={openAccordian === key} onToggle={() => setAccordianOpen(openAccordian === key ? '' : key)}>
                                {{
                                    header: (<AccordianTitle>{key === "scannedCrates" ? dynamicLabels.inscanned_s : dynamicLabels.not_inscanned_s}: {crateDetails[key].length}</AccordianTitle>),
                                    content: (
                                        <TableContent>
                                            {
                                                <table style={{ width: "100%" }}>
                                                    <tbody>
                                                        <tr>
                                                            <th className="noRadio">{dynamicLabels.crateCode}</th>
                                                            <th>{dynamicLabels?.['Crate Name']}</th>
                                                            <th>{dynamicLabels?.['Crate Type']}</th>
                                                        </tr>
                                                        {crateDetails[key].length > 0 ?
                                                            crateDetails[key].map((obj: any, index: number) => {

                                                                return (
                                                                    <tr key={index.toString()}>
                                                                        <td title={obj.crateCd}>{obj.crateCd}</td>
                                                                        <td title={obj.crateName}>{obj.crateName}</td>
                                                                        <td title={obj.crateType}>{obj.crateType}</td>
                                                                    </tr>
                                                                )
                                                            }) :
                                                            <tr>
                                                                <td className="empty"></td>
                                                                <td className="empty"><NoDataAvailable style={{fontSize: '13px!important'}}>{dynamicLabels.noDataAvailable}</NoDataAvailable></td>
                                                                <td className="empty"></td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            }
                                        </TableContent>
                                    )
                                }}
                            </Accordion>
                        })}
                    </CrateDetailsWrapper>,

                footer: <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>

                    <IconButton iconVariant='icomoon-close'
                        onClick={() => { onClose(false); }}>
                        {dynamicLabels.cancel}
                    </IconButton>
                </Box>

            }}
        </Modal>
    )
}


export default CrateModal;