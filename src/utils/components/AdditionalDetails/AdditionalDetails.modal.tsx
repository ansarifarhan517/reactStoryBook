import { IMongoFormStructure } from "../../mongo/interfaces";
import { UseFormMethods } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types/form';

export interface IContactComponentProps {
    sectionKeys: string[]
    baseStructure: any
    addressformInstance: UseFormMethods<FieldValues>
    contactsData?: Array<IListOfContactDetails>
    setContactsData: Function
}

export interface IListOfContactDetails {
    contactName?: String;
    contactEmail?: String;
    contactMobileNumber?: number | string;
    isDeleteFl?: String;
    count?: number;
    whatsappOptin?: string;
}

export interface IContactDetailsModalProps {
    showAdditionalContacts: boolean;
    setShowAdditionalContacts: Function;
    addressformInstance: UseFormMethods<FieldValues>;
    selectedAddressAccordion?: number | string
    setListOfContactDetails?: Function
    listOfContactDetails?: Array<IListOfContactDetails>
    additinalContactDetailsStructure?: IMongoFormStructure
}