import React from "react";
import { SortableEvent } from "sortablejs";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { SectionHeader, Grid, Button, FontIcon  } from "ui-library";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { fieldSettings, fieldTypeGroup, ICurrentField, IFieldSettings, IFormFields, sortableGroup } from "../CustomForms.models";
import { ButtonContainer, DesignFormGrid, FormContainer, MobilePreviewContainer, PreviewTitle, SectionHeaderContainer } from "../CustomFormsStyledComponents";
import { addNewOption, ChangeFieldSetting, removeFieldConsent, removeOption, updateOption } from "../utils";
import FieldProperties from "./FieldProperties";
import MobilePreviewComponent from "./FieldTypeComponents/MobilePreviewComponent";
import FieldTypeContainer from "./FieldTypeContainer";

interface IDesignFormsProps {
    sectionName: string
    pageName: string
    cloneFieldType: (currentItem: IFieldSettings, evt: SortableEvent) => IFieldSettings;
    addElement: (ele: IFieldSettings, currentField: ICurrentField, formFields:IFieldSettings[], setFormFields: Function, setCurrentField: Function, idx?: number | undefined) => void;
    handleFormFieldDrag: Function
    currentField: ICurrentField
    formFields: IFieldSettings[]
    setFormFields: Function
    setCurrentField: Function
    handleSubmit: Function
    saveForm: Function
    watchAllFields: Record<string, string>
    setFieldActive: Function
    handleDrag: Function
}
const DesignForm = (props: IDesignFormsProps) => {
    const {sectionName, cloneFieldType, addElement, handleFormFieldDrag, currentField, formFields, setFormFields, setCurrentField, handleSubmit, saveForm, watchAllFields, setFieldActive, handleDrag, pageName} = props;
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms);
    const isDisableSaveButton = useTypedSelector((state) => state.customForms.listView.form.isDisableSaveButton);

    return (
        <FormContainer key={sectionName}>
            <SectionHeaderContainer><SectionHeader headerTitle={dynamicLabels[sectionName]} /></SectionHeaderContainer>
            <Grid container spacing='15px' style={{ marginBottom: '15px' }}>
                <DesignFormGrid item spacing='0px' xs={12} sm={6} md={4} className='designForm grid-item'>
                    <FieldTypeContainer group={fieldTypeGroup} onClone={cloneFieldType} disabled={false} fieldTypes={fieldSettings} onChange={addElement} handleFormFieldDrag={handleFormFieldDrag} currentField={currentField} formFields={formFields} setFormFields={setFormFields} setCurrentField={setCurrentField} />
                    <ButtonContainer>
                        <Button id={`${pageName}-actionBar-save`} variant="button" className="save-btn" disabled={isDisableSaveButton} primary onClick={handleSubmit((data: IFormFields) => saveForm('save', data))}><FontIcon variant='icomoon-save' /> {dynamicLabels.create}</Button>
                        <Button id={`${pageName}-actionBar-publish`} variant="button" className="white" disabled={isDisableSaveButton} onClick={handleSubmit((data: IFormFields) => saveForm('publish', data))}><FontIcon variant='publish' /> {dynamicLabels.publish}</Button>
                    </ButtonContainer>

                </DesignFormGrid>
                <MobilePreviewContainer id="mobile-preview" item spacing='0px' xs={12} sm={6} md={4} className='designForm grid-item field-type-list mobile-preview-container'>
                    <PreviewTitle className="preview-title"><h6>{dynamicLabels.preview}</h6></PreviewTitle>
                    <MobilePreviewComponent formFields={formFields} disabled={true} formName={watchAllFields['formName']} setFieldActive={setFieldActive} removeField={removeFieldConsent} group={sortableGroup} handleDrag={handleDrag} sectionName={dynamicLabels['general details']} setCurrentField={setCurrentField} setFormFields={setFormFields} />
                </MobilePreviewContainer>
                <DesignFormGrid item spacing='0px' xs={12} sm={6} md={4} className='designForm grid-item'>
                    {formFields && formFields.length > 0 && <FieldProperties fieldType={formFields.find((field) => field.Active === true)?.Type} ChangeFieldSetting={ChangeFieldSetting} id={currentField.id} formFields={formFields} addNewOption={addNewOption} removeOption={removeOption} updateOption={updateOption} setFormFields={setFormFields} />}
                </DesignFormGrid>

            </Grid>
        </FormContainer>
    )
}

export default DesignForm;