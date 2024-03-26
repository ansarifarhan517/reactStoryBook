import React from "react";
import { GroupOptions } from "react-sortablejs";
import { DraggableComponent } from "../../../../../utils/components/Draggable/DraggableComponent";
import { IFieldSettings, MobilePreviewImg } from "../../CustomForms.models";
import { FieldPreviewContainer, FormTitle, MobilePreview, PreviewSectionName } from "../../CustomFormsStyledComponents";
import FieldTypeElements from "./FieldTypeElements";

interface IMobilePreviewProps {
    formName: string
    formFields: Array<IFieldSettings>
    disabled: boolean
    setFieldActive?: Function
    removeField?: Function
    group?: string | GroupOptions
    handleDrag?: Function
    sectionName?: string
    setFormFields?: Function
    setCurrentField?: Function
}

const MobilePreviewComponent = (props: IMobilePreviewProps) => {
    const {formName, formFields, disabled, setFieldActive, removeField, handleDrag, group, sectionName, setFormFields, setCurrentField} = props;
    return (
        <MobilePreview className="mobile-preview">
            <img src={MobilePreviewImg} width="90%" />
            <FormTitle className="form-title">{formName}</FormTitle>
            <FieldPreviewContainer>
                    <DraggableComponent sort={disabled} group={group} list={formFields} setList={(newState: any) => handleDrag && handleDrag(newState)}>
                      {formFields.length > 0 && <FieldTypeElements formFields={formFields} setFieldActive={setFieldActive} removeField={removeField} setCurrentField={setCurrentField} setFormFields={setFormFields} />}
                    </DraggableComponent>
            </FieldPreviewContainer>
        </MobilePreview>
    )
}

export default MobilePreviewComponent;