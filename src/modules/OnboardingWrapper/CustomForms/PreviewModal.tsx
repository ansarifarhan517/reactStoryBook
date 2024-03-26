import React, { Dispatch } from 'react'
import { useDispatch } from 'react-redux';
import { Box, Modal, ModalHeader, } from 'ui-library'
import { deepCopy } from '../../../utils/helper';
import { PdpaConfigActions } from '../PdpaConfig/Components/PdpaConfig.action';
import { fieldSettings, IFieldSettings } from './CustomForms.models';
import { ListViewMobilePreview, PreviewModalContainer } from './CustomFormsStyledComponents';
import MobilePreviewComponent from './SubComponents/FieldTypeComponents/MobilePreviewComponent';
interface IPreviewModal {
    fromConsent?: boolean
    isShowModal: boolean
    dynamicLabels: Record<string, string>
    setShowPreviewModal: (value: boolean) => void
    previewData: Object
}
const PreviewModal = ({ fromConsent , isShowModal, dynamicLabels, setShowPreviewModal, previewData }: IPreviewModal) => {
    const dispatch = useDispatch<Dispatch<PdpaConfigActions>>();

    const formFields: IFieldSettings[] = [];
    if (isShowModal) {
        if (Object.keys(previewData).length > 0) {
            previewData['general details'] = fromConsent ? previewData['customFormStructure']['general details'] : previewData['structure']['general details']

            const fields = Object.keys(previewData['general details']).map((field, index) => {
                const fieldObj = previewData['general details'][field];
                let obj = {};
                let fieldLabel = {};
                let fieldValue = {};
                let validations = {};
                let minChar = {};
                let maxChar = {};
                let options = {};
                const settings:Array<Record<string, any>> = [];
                const validationInputs = ['date', 'time', 'geocode', 'phone_number', 'epod'];
                let fieldSequenceObj = fieldSettings.find((value) => value.Type === fieldObj.fieldType);
                if(fieldObj?.fieldType === "dropdown" || fieldObj?.fieldType === "checkbox" || fieldObj?.fieldType === "radioGroup") {
                    fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text"};
                    options = {Name: "Options", Type: "dropdown_increment", Options: Object.keys(fieldObj['dropdownValues']).map((option: string) => {return { label: fieldObj['dropdownValues'][option], value: fieldObj['dropdownValues'][option] } } )}
                    validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true}]};
                    settings.push(fieldLabel, validations, options)
                    obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: false }
                } else if(validationInputs.includes(fieldObj?.fieldType)) {
                    fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text"}
                    validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true}]};
                    settings.push(fieldLabel, validations);
                    obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: false }
                } else if (fieldObj?.fieldType === "TextArea") {
                    fieldLabel = { Name: "Field Label", Value: fieldObj.fieldName, Type: "text" }
                    fieldValue = { Name: "Field Value", Value: fieldObj.label, Type: "text" }
                    settings.push(fieldLabel, fieldValue);
                    obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.fieldType, Placeholder: fieldObj.fieldType, Active: false }
                } else {
                    fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text"}
                    validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true}]};
                    if(fieldObj.fieldType === "perc_number" || fieldObj.fieldType === "decimal_number" || fieldObj.fieldType === "number" ) {
                        minChar = {Name: "Min Value", Value: Number(fieldObj.validation?.min?.args), Type: "minVal"}
                        maxChar = {Name: "Max Value", Value: Number(fieldObj.validation?.max?.args), Type: "maxVal"}
                    } else if(fieldObj.fieldType === "email" || fieldObj.fieldType === "text"){
                        minChar = {Name: "Min Character Length", Value: Number(fieldObj.validation?.minlength?.args), Type: "min"}
                        maxChar = {Name: "Max Character Length", Value: Number(fieldObj.validation?.maxlength?.args), Type: "max"}
                    }
                    settings.push(fieldLabel, validations, minChar, maxChar);
                    obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: false }
                }
                return obj;
            });
            formFields.push(...deepCopy(fields));
        }
    }

   

    return <PreviewModalContainer className="PreviewModalContainer">
        <Modal
            open={isShowModal}
            onToggle={() => {
                fromConsent && (dispatch({
                         type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
                         payload:{viewType: "ListLoaded"}
                        }))
                setShowPreviewModal(false);
            }}
            size='md'
            children={{
                header: (
                    <ModalHeader
                        headerTitle={fromConsent? dynamicLabels.ConsentFormPreview : dynamicLabels.customFormPreview}
                        handleClose={() =>{
                            fromConsent && (dispatch({
                                type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
                                payload:{viewType: "ListLoaded"}
                               }))
                             setShowPreviewModal(false)
                            }
                            }
                        imageVariant="icomoon-close"
                        headerStyle={{ fontSize: "15px" }}
                        width='100%'
                    />
                ),
                content: (
                    <ListViewMobilePreview>
                        <MobilePreviewComponent disabled={true} formName={previewData?.['formName']} formFields={formFields} sectionName={dynamicLabels['general details']} />
                    </ListViewMobilePreview>
                ),
                footer: (
                    <Box
                        horizontalSpacing="10px"
                        display="flex"
                        style={{ paddingLeft: '15px', paddingBottom: '15px', paddingTop: '15px' }}
                    >
                        <div style={{ fontSize: 14, color: '#000' }}>{dynamicLabels.MISCommonMessage}</div>
                    </Box>
                ),
            }}


        /></PreviewModalContainer>

}

export default PreviewModal;