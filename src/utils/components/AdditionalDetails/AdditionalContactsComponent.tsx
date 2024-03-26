import React, { useEffect, useState  } from 'react'
import { Modal, ModalHeader, Box, IconButton, useToast } from 'ui-library';
import DYNAMIC_LABELS_MAPPING from "../../../modules/common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../modules/common/DynamicLabels/useDynamicLabels";
import { IContactDetailsModalProps, IListOfContactDetails } from './AdditionalDetails.modal';
import ContactsComponent from './ContactsComponent';

const AdditionalContactsComponent = (props: IContactDetailsModalProps) => {
    const { showAdditionalContacts, setShowAdditionalContacts, addressformInstance, setListOfContactDetails, listOfContactDetails, additinalContactDetailsStructure} = props;
    const toast = useToast()
    const { setValue, getValues } = addressformInstance;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customer.all_customers);
    const [contactsData, setContactsData] = useState<Array<IListOfContactDetails>>([{ contactName: '', contactEmail: '', contactMobileNumber: '', whatsappOptin: 'N', isDeleteFl: 'N', count : 0}])

    useEffect(() => {
        if(listOfContactDetails?.length != 0){
            listOfContactDetails?.map((contact, index) =>{
                if(contact.isDeleteFl === 'N'){
                    setValue(`contactName_${index}`, listOfContactDetails[index]?.contactName)
                    setValue(`contactMobileNumber_${index}`, listOfContactDetails[index]?.contactMobileNumber)
                    setValue(`contactEmail_${index}`, listOfContactDetails[index]?.contactEmail)
                    setValue(`contactWhatsappOptin_${index}`, listOfContactDetails[index]?.whatsappOptin)
                }
            })
            setContactsData(listOfContactDetails as IListOfContactDetails[]);
        }  
    },[listOfContactDetails])

    const handleSaveContacts = () => {        
        const contactsPayload: Array<Object> = [];
        let isError : boolean = false;
        contactsData?.map((contact, index) => {
            const contactsObj = {
                contactName: getValues(`contactName_${index}`),
                contactMobileNumber: getValues(`contactMobileNumber_${index}`),
                contactEmail: getValues(`contactEmail_${index}`),
                whatsappOptin: getValues(`contactWhatsappOptin_${index}`) ?? 'N',
                isDeleteFl: contact.isDeleteFl
            }
            if(contactsObj && contactsObj?.isDeleteFl === 'N') {
                if(contactsObj?.contactName){
                    if(contactsObj?.contactMobileNumber || contactsObj?.contactEmail){
                        contactsPayload.push(contactsObj)
                    }else{
                        toast.add(dynamicLabels?.contactMobileEmail_Mandatory ? dynamicLabels?.contactMobileEmail_Mandatory : 'Contact Email/Phone Number is Mandatory','warning', false);
                        isError=true
                    }
                }else{
                    isError=true
                    toast.add(dynamicLabels?.contactName_Mandatory ? dynamicLabels?.contactName_Mandatory : 'Contact Name is Mandatory','warning', false);
                }
            } else if (contactsObj && contactsObj?.isDeleteFl === 'Y') {
                contactsPayload.push(contactsObj)
            }
        })
        if(!isError){
            setListOfContactDetails?.(contactsPayload)
            setShowAdditionalContacts(false);
        }
        
    }

    return (
        <Modal open={showAdditionalContacts} onToggle={(value: boolean) => {
            setShowAdditionalContacts(false);
        }} width='750px'>
            {{
                header: <ModalHeader width='750px' headerTitle={'Additional Contact Details'} handleClose={() => setShowAdditionalContacts(false)} />,
                content: (
                    <div>
                        <div id='toast-inject-here'></div>
                        <ContactsComponent
                            baseStructure={additinalContactDetailsStructure}
                            addressformInstance={addressformInstance}
                            contactsData={contactsData}
                            setContactsData={setContactsData}>
                        </ContactsComponent>
                    </div>
                    // </ContactsModalWrapper>
                ),
                footer: (
                    <Box horizontalSpacing="10px" display="flex" justifyContent="flex-end" p="15px">
                        <IconButton id="contact-modal-save" iconVariant="icomoon-save" primary onClick={handleSaveContacts}> {dynamicLabels.save} </IconButton>
                        <IconButton id="crate-modal-cancel" iconVariant="icomoon-close" iconSize={11} onClick={() => setShowAdditionalContacts()}> {dynamicLabels.cancel} </IconButton>
                    </Box>
                )
            }}
        </Modal>
    )
}


export default AdditionalContactsComponent;