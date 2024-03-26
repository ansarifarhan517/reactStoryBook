import React, { useState } from 'react';
import { Accordion, AccordionHeaderTitle, FontIcon, AccordionContent, Grid, Box, withToastProvider } from 'ui-library'
import FormField from '../Form/FormField';
import { AddLineItemButtonWrapper, AddLineItemTextWrapper, CrateModalHeaderWrapper } from '../../../modules/Order/SubComponents/StyleComponents';
import DYNAMIC_LABELS_MAPPING from "../../../modules/common/DynamicLabels/dynamicLabels.mapping";
import { deepCopy } from '../../helper';
import useDynamicLabels from "../../../modules/common/DynamicLabels/useDynamicLabels";
import { updateAdditionalDetailsCount } from './AdditionalContactHelper';
import { IContactComponentProps } from './AdditionalDetails.modal';
import { IMongoField } from '../../mongo/interfaces';

const ContactsComponent = (props: IContactComponentProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.shipper)
    const [isExpanded, setExpanded] = useState<number>(0)
    const { baseStructure, addressformInstance, contactsData, setContactsData } = props
    const watcher = addressformInstance.watch();

    const addRemoveNewContact = (event: any, method: string, id: string | number, buttonClick?: string) => {
        let newContactsData = deepCopy(contactsData)
        if (method == 'add') {
            if (buttonClick) {
                event.keyCode = 13
            }
            if (event.keyCode == 13) {
                newContactsData.push({
                    contactName: '', contactEmail: '', contactPhoneNo: '', whatsappOptin: 'N', isDeleteFl: 'N'
                })
                updateAdditionalDetailsCount(newContactsData);
                setContactsData(newContactsData)
                event.target.value = '';
            }
        } else {
            newContactsData?.map((contact, index) =>{
                if (String(index) == id){
                    contact.isDeleteFl = 'Y'
                }
            })
            updateAdditionalDetailsCount(newContactsData);
            setContactsData(newContactsData)
        }
    }

    const handleToggle = (contactIndex: number) => {
        isExpanded == contactIndex ? setExpanded(0) : setExpanded(contactIndex)
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value?.length === 0) {
            addressformInstance.setValue(`contactWhatsappOptin_${index}`, 'N')
        }
    }

    return (
        <>
            <div id='toast-inject-here'></div>
            <Box bgColor='white'>
                {contactsData?.length ? contactsData?.map((contactsObj: any, contactIndex: number | string) => {
                    return (
                        <>
                            {contactsObj.isDeleteFl !== 'Y' &&
                                <Accordion id={contactIndex.toString()} expanded={isExpanded == contactIndex} onToggle={() => handleToggle(Number(contactIndex))}>
                                    {{
                                        header: (
                                            <>
                                                <CrateModalHeaderWrapper className="crate-modal-header-wrapper">
                                                    <div>
                                                        <AccordionHeaderTitle style={{ paddingTop: '10px' }}> {dynamicLabels && dynamicLabels.additionalContact ? dynamicLabels.additionalContact : "Additional Contact"} { contactsObj?.count ? contactsObj?.count :  Number(contactIndex) + 1}</AccordionHeaderTitle>
                                                    </div>
                                                    <div style={{ paddingTop: '5px' }} onClick={(e) => addRemoveNewContact(e, 'remove', contactIndex)}>
                                                        <FontIcon variant={'icomoon-delete-empty'} size={'sm'} />
                                                    </div>
                                                </CrateModalHeaderWrapper>
                                            </>
                                        ),
                                        content: (
                                            <AccordionContent>
                                                <Grid container spacing='10px' style={{ marginBottom: '15px', paddingTop: '15px' }}>
                                                    {baseStructure && Object.keys(baseStructure)?.map((obj: any) => {
                                                        const meta = baseStructure[obj]
                                                        meta.multipleFiles = false
                                                        if (obj === 'whatsappOptin') return null
                                                        else if (obj === 'contactMobileNumber') {
                                                            const whatsAppFieldMeta: IMongoField | undefined = baseStructure['whatsappOptin' as string];
                                                            const editable = watcher?.[obj + '_' + contactIndex]?.length > 0;
                                                            return (
                                                                <Grid item key={obj} xs={12} sm={4} md={4} className='grid-item'>
                                                                    <FormField
                                                                        name={obj+'_'+contactIndex}
                                                                        meta={meta}
                                                                        formInstance={addressformInstance}
                                                                        onChange={(e) => handlePhoneNumberChange(e, contactIndex as number)}
                                                                    />
                                                                    {whatsAppFieldMeta?.permission ?
                                                                        <Box mt='-5px' mb='8px' className='whatsapp-checkbox-wrapper'>
                                                                            <FormField
                                                                                name={'contactWhatsappOptin_'+contactIndex}
                                                                                meta={{ ...whatsAppFieldMeta, editable }}
                                                                                formInstance={addressformInstance}
                                                                            />
                                                                        </Box> : null
                                                                    }
                                                                </Grid>
                                                            )
                                                        }
                                                        return (
                                                            <>
                                                                <Grid item key={obj} xs={12} sm={4} md={4} className='grid-item'>
                                                                    <FormField name={obj+'_'+contactIndex} meta={meta} formInstance={addressformInstance} />
                                                                </Grid>
                                                            </>
                                                        )
                                                    })
                                                    }

                                                </Grid>
                                            </AccordionContent>
                                        )
                                    }}
                                </Accordion>
                            }
                        </>
                    )

                }) : <> </>}
                <AddLineItemButtonWrapper onClick={(event) => addRemoveNewContact(event, 'add', 0, 'buttonClick')} >
                    <Box style={{ display: "flex", cursor: "pointer" }}>
                        <FontIcon variant={'add'} color={'primary.main'} size={'xs'} />
                        <AddLineItemTextWrapper> {`${dynamicLabels && dynamicLabels.Add ? dynamicLabels.Add : "Add"}` + " Contact"} </AddLineItemTextWrapper>
                    </Box>
                </AddLineItemButtonWrapper>
            </Box>
        </>
    )
}
export default (withToastProvider(ContactsComponent, 'toast-inject-here'))