import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import { Accordion, AccordionHeaderTitle, AccordionHeaderSubTitle, AccordionContent, Box, Toggle, IconButton, TextInput, DropDown } from "ui-library";
import { IMobileTemplateAccesses, IMobileTemplateAccessModules, IMobileTemplateAccessSections } from "../../MobileTemplate.models";
import { MobileTemplateAccessDescription, MobileTemplateStartTimeAccessDescription, MobileTemplateAccesses, MobileTemplateAccordionHeaderWrapper, MobileTemplateAccordionTitle, MobileTemplateChildAccess, MobileTemplateAccordionContainer, ConfigureButtonContainer, AccessContainer } from "../../MobileTemplateStyledComponents";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import { IMobileTemplateActions } from "../../MobileTemplate.actions";
import { sendGA } from '../../../../../utils/ga';
import { useHistory } from "react-router-dom";
import TripStartFormModal from "./TripStartFormModal";
import CashTransactionInput from "./CashTransactionInput";

interface IMobileTemplateAccordionProps {
    accessReferenceIds: Array<string | undefined>;
    handleToggleChange: (accessReferenceId: string, type: string, accessReferenceIds: Array<string | undefined>, section?: string, parentSectionName?: string, accessName?: string, subAccessName?: string) => void;
    saveFormValues: Function;
    accessProfileId?: string;
    negativeCashValue: number;
    setNegativeCashValue: (value: number) => void;
    negativeInput: boolean;
    setNegativeInput: (value: boolean) => void;
    cashTransaction: boolean;
    setCashTransaction: (value: boolean) => void;
    negativeCashTransaction: boolean;
    setNegativeCashTransaction: (value: boolean) => void;
}

const MobileTemplateAccordion = ({ accessReferenceIds, handleToggleChange, saveFormValues, accessProfileId, negativeCashValue, setNegativeCashValue, negativeInput, setNegativeInput, cashTransaction, setCashTransaction, negativeCashTransaction, setNegativeCashTransaction }: IMobileTemplateAccordionProps) => {
    const dispatch = useDispatch<Dispatch<IMobileTemplateActions>>();
    const history = useHistory();
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.mobileTemplates);

    const accordionStructure = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.accordionStructure);
    const mobileTemplate = useTypedSelector((state) => state.settingScreen.mobileTemplates.mobileTemplate);

    const isEditMode = useTypedSelector((state) => state.settingScreen.mobileTemplates.form.isEditMode);

    const [expanded, setExpanded] = useState<string>('0');


    const [showTripModal, setShowTripModal] = useState(false)

    const [childExpanded, setChildExpanded] = useState<string>('0');

    const [openAccordian, setAccordianOpen] = useState<string>('');

    const isTripStartLabel = (subSection, access) => {
        return subSection.sectionName + "_" + access?.accessName == 'TRIP_START_ALLOW_Label'
    }

    const handleToggle = (accordianId: string, isExpanded?: boolean) => {
        setExpanded(isExpanded ? accordianId : '')
    }

    const handleChildToggle = (accordianId: string, childExpanded?: boolean) => {
        setChildExpanded(childExpanded ? accordianId : '')
    }

    const handleChangeForCashTransaction =  (accessRefId,type,accessReferenceIds,sectionName) => {
        setCashTransaction(!cashTransaction);
        setNegativeCashTransaction(!cashTransaction);
        handleToggleChange(accessRefId,type,accessReferenceIds,sectionName);
    }

    const handleChangeForNegativeCashTransaction =(accessRefId,type,accessReferenceIds,sectionName)=>{
        setNegativeCashTransaction(!negativeCashTransaction);   
        if(!negativeCashTransaction){
            setCashTransaction(true);
            handleToggleChange(accessRefId,type,accessReferenceIds,sectionName,"CASH_TRANSACTION","NEGATIVE_CASH_TRANSACTION");
        }
    }

    return (
        <MobileTemplateAccordionContainer>
            {accordionStructure.accessModules.length > 0 &&
                accordionStructure.accessModules.map((module: IMobileTemplateAccessModules) => {
                    return (
                        module && module.accessSections && module.accessSections.length > 0 &&
                        module.accessSections.map((section: IMobileTemplateAccessSections, index: number) => {
                            return (
                                <Accordion key={String(index + 1)} id={String(index + 1)} expanded={expanded === String(Number(index + 1))} onToggle={handleToggle}>
                                    {{
                                        header: (
                                            <>
                                                <AccordionHeaderTitle>{section.sectionNameLabelValue}</AccordionHeaderTitle>
                                                <AccordionHeaderSubTitle>{section.sectionNameDescLabelValue}</AccordionHeaderSubTitle>
                                            </>
                                        ),
                                        content: (
                                            <AccordionContent>
                                                {section?.accessSections && section?.accessSections?.length > 0 &&
                                                    section.accessSections.map((subSection: IMobileTemplateAccessSections, index: number) => {
                                                        return (
                                                            <>
                                                            {/* Accordion for Negative Cash Transaction */}
                                                            {
                                                                subSection.sectionName === "CASH_TRANSACTION" ? <Accordion key={String(index + 1)} id={String(index + 1)} expanded={openAccordian === String(index + 1)} onToggle={() => setAccordianOpen(openAccordian === String(index + 1) ? '' : String(index + 1))}>
                                                                    {{
                                                                        header: (
                                                                            <MobileTemplateAccordionHeaderWrapper>
                                                                                <MobileTemplateAccordionTitle>
                                                                                    <AccordionHeaderTitle>{subSection.sectionNameLabelValue}</AccordionHeaderTitle>
                                                                                    <AccordionHeaderSubTitle>{subSection.sectionNameDescLabelValue}</AccordionHeaderSubTitle>
                                                                                </MobileTemplateAccordionTitle>
                                                                        
                                                                                <Box display="flex" style={{ marginRight: !subSection?.accesses?.length ? 30 : 0 }} className={childExpanded === String(Number(index + 1)) ? "active-accordion accordion-toggle-input" : 'inactive-accordian accordion-toggle-input'}>
                                                                                    <Toggle
                                                                                        id={subSection.accessRefId}
                                                                                        checked={cashTransaction}
                                                                                        onChange={() => handleChangeForCashTransaction(subSection.accessRefId, 'screen', accessReferenceIds, section.sectionName)}
                                                                                    />
                                                                                </Box>
                                                                            </MobileTemplateAccordionHeaderWrapper>
                                                                        ),
                                                                        content: (
                                                                            <AccordionContent>
                                                                                <MobileTemplateAccesses className="access-toggle" key="negative-cash-access-key">
                                                                                    <Box display="flex" fullWidth>
                                                                                        {
                                                                                            negativeCashTransaction ? setNegativeInput(true) : setNegativeInput(false)
                                                                                        }
                                                                                        <Toggle
                                                                                            id="negative-cash-access-id"
                                                                                            value="negative-cash-access-value"
                                                                                            label={dynamicLabels.NEGATIVE_CASH_ALLOW}
                                                                                            checked={negativeCashTransaction}
                                                                                            onChange={() => handleChangeForNegativeCashTransaction(subSection.accessRefId, 'screen', accessReferenceIds, section.sectionName)}
                                                                                        />
                                                                                        
                                                                                    </Box>
                                                                                    <Box display="flex" fullWidth>
                                                                                        <MobileTemplateAccessDescription className="accordion-sub_title">{dynamicLabels.NEGATIVE_CASH_ALLOW_DESC}</MobileTemplateAccessDescription>
                                                                                        <Box>
                                                                                            {
                                                                                                negativeInput && <CashTransactionInput 
                                                                                                negativeCashValue={negativeCashValue} 
                                                                                                setNegativeCashValue = {(value) => setNegativeCashValue(value)} />
                                                                                            }
                                                                                        </Box>
                                                                                    </Box>
                                                                                </MobileTemplateAccesses>
                                                                            </AccordionContent>
                                                                        ),
                                                                    }}
                                                                </Accordion>
                                                                :
                                                                <Accordion hideChevron={!subSection?.accesses?.length} key={String(index + 1)} id={String(index + 1)} expanded={childExpanded === String(Number(index + 1))} onToggle={!subSection?.accesses?.length ? () => { } : handleChildToggle}>
                                                                {{
                                                                    header: (  
                                                                        <MobileTemplateAccordionHeaderWrapper>
                                                                            <MobileTemplateAccordionTitle>
                                                                                <AccordionHeaderTitle>{subSection.sectionNameLabelValue}</AccordionHeaderTitle>
                                                                                <AccordionHeaderSubTitle>{subSection.sectionNameDescLabelValue}</AccordionHeaderSubTitle>
                                                                            </MobileTemplateAccordionTitle>
                                                                    
                                                                            <Box display="flex" style={{ marginRight: !subSection?.accesses?.length ? 30 : 0 }} className={childExpanded === String(Number(index + 1)) ? "active-accordion accordion-toggle-input" : 'inactive-accordian accordion-toggle-input'}>
                                                                                {subSection?.accessMode !== 'GROUP' &&
                                                                                    <>
                                                                                        {subSection?.sectionName === 'TRIP_START_ALLOW' &&
                                                                                            <Box mr={'2.3rem'} onClick={() => setShowTripModal(true)}>
                                                                                                {childExpanded === String(Number(index + 1)) ? <IconButton primary iconVariant="icomoon-setting" onlyIcon /> : <IconButton variant="button" style={{ color: '#525252' }} iconVariant="icomoon-setting" onlyIcon />}
                                                                                            </Box>
                                                                                        }
                                                                                        
                                                                                        <Toggle
                                                                                            id={subSection.accessRefId}
                                                                                            checked={accessReferenceIds.includes(subSection.accessRefId)}
                                                                                            onChange={() => handleToggleChange(subSection.accessRefId, 'screen', accessReferenceIds, section.sectionName)}
                                                                                        />
                                                                                    
                                                                                    </>
                                                                                }
                                                                            </Box>
                                                                        </MobileTemplateAccordionHeaderWrapper>
                                                                    ),
                                                                    content: (
                                                                        <AccordionContent>
                                                                            <>
                                                                                {
                                                                                    subSection?.accesses && subSection?.accesses.length > 0 &&
                                                                                    subSection?.accesses.map((access: IMobileTemplateAccesses) => {
                                                                                        return (
                                                                                            <MobileTemplateAccesses className={`${access.accessMode === 'SETTING' ? "end-row access-toggle" : "access-toggle"}`} key={access.accessId}>
                                                                                                {access.accessMode === 'SETTING' ?
                                                                                                    <>
                                                                                                        <AccessContainer className="access-container setting-toggle">
                                                                                                            <Box>
                                                                                                                <AccordionHeaderTitle>{access.accessNameLabelValue}</AccordionHeaderTitle>
                                                                                                                <MobileTemplateStartTimeAccessDescription className="accordion-sub_title">{access.accessNameDescLabelValue}</MobileTemplateStartTimeAccessDescription>
                                                                                                            </Box>
                                                                                                        </AccessContainer>
                                                                                                        <ConfigureButtonContainer className="access-button-container">
                                                                                                            <IconButton
                                                                                                                onClick={() => {
                                                                                                                    dispatch({ type: '@@mobileTemplates/SET_VIEW_TYPE', payload: 'configure-order-view' });
                                                                                                                    dispatch({ type: '@@mobileTemplates/SET_ORDER_TYPE', payload: subSection?.sectionNameLabelKey?.includes('COMPLETED') ? 'COMPLETED' : subSection.sectionNameLabelKey });
                                                                                                                    dispatch({ type: '@@mobileTemplates/SET_ORDER_CONFIGURING', payload: true });
                                                                                                                    dispatch({ type: '@@mobileTemplates/FETCH_DYNAMIC_ORDER_MASTER_STRUCTURE', payload: subSection?.sectionNameLabelKey?.includes('COMPLETED') ? 'COMPLETED' : subSection.sectionNameLabelKey })
                                                                                                                    saveFormValues();
                                                                                                                    sendGA('Event New', `Mobile Templates Add Form - Configure Card`)
                                                                                                                    isEditMode ? history.push(`/configureOrder/${accessProfileId}`) : history.push('/configureOrder')
                                                                                                                }}
                                                                                                                primary iconVariant="icomoon-setting">{dynamicLabels.Configure}</IconButton>
                                                                                                        </ConfigureButtonContainer>
                                                                                                    </> :
                                                                                                    <>
                                                                                                    {
                                                                                                        <>
                                                                                                            <Box display="flex" fullWidth>
                                                                                                                <Toggle
                                                                                                                    id={access.accessRefId}
                                                                                                                    value={access.accessRefId}
                                                                                                                    label={access.accessNameLabelValue}
                                                                                                                    checked={accessReferenceIds.includes(access.accessRefId)}
                                                                                                                    onChange={() => {
                                                                                                                        sendGA('Event New', `Mobile Templates Add Form - Toggle ${access.accessNameLabelValue}`)
                                                                                                                        handleToggleChange(access.accessRefId, 'setting', accessReferenceIds, section.sectionName, subSection.sectionName)
                                                                                                                    }}
                                                                                                                />
                                                                                                                
                                                                                                            </Box>
                                                                                                            <MobileTemplateAccessDescription className="accordion-sub_title">{access.accessNameDescLabelValue}</MobileTemplateAccessDescription>
                                                                                                        </>
                                                                                                    }
                                                                                                    </>
                                                                                                }

                                                                                                {access.accesses && access.accesses.length > 0 &&
                                                                                                    access?.accesses.map((subAccess: IMobileTemplateAccesses) => {
                                                                                                        return (
                                                                                                            <MobileTemplateChildAccess key={subAccess.accessId}>
                                                                                                                <Box display="flex" fullWidth>
                                                                                                                    <Toggle
                                                                                                                        id={subAccess.accessRefId}
                                                                                                                        value={subAccess.accessRefId}
                                                                                                                        label={subAccess.accessNameLabelValue}
                                                                                                                        checked={accessReferenceIds.includes(subAccess.accessRefId)}
                                                                                                                        className="access-toggle"
                                                                                                                        onChange={() => {
                                                                                                                            handleToggleChange(subAccess.accessRefId, 'action', accessReferenceIds, section.sectionName, subSection.sectionName, access.accessName, subAccess?.accessName);
                                                                                                                            sendGA('Event New', `Mobile Templates Add Form - Toggle ${subAccess.accessNameLabelValue}`)
                                                                                                                        }}
                                                                                                                    />
                                                                                                                </Box>
                                                                                                                <MobileTemplateAccessDescription className="accordion-sub_title">{subAccess.accessNameDescLabelValue}</MobileTemplateAccessDescription>
                                                                                                            </MobileTemplateChildAccess>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </MobileTemplateAccesses>
                                                                                        )
                                                                                    })
                                                                                }

                                                                            </>
                                                                        </AccordionContent>
                                                                    )
                                                                }}
                                                                </Accordion>
                                                            }
                                                                
                                                            </>
                                                        )
                                                    })
                                                }
                                            </AccordionContent>
                                        )
                                    }}
                                </Accordion>
                            )
                        })
                    )
                })
            }

            {showTripModal && <TripStartFormModal
                isShowModal={showTripModal}
                tripDetails={mobileTemplate.additionalDetails}
                dynamicLabels={dynamicLabels}
                setShowAddModal={(value) => setShowTripModal(value)}
                fieldData={{ mode: 'Trip Settings' }}
                negativeCashAmount = {negativeCashValue}
                allowNegativeCashAmount = {negativeInput}
                onSave={details => saveFormValues(details)}
            />}
        </MobileTemplateAccordionContainer>
    )
}

export default MobileTemplateAccordion;