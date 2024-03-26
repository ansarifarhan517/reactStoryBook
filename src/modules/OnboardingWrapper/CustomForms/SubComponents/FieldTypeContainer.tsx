import React from "react";
import { SortableEvent, GroupOptions } from "react-sortablejs";
import { ICurrentField, IFieldSettings } from "../CustomForms.models";
import { FieldContainer, FieldContainerHeader } from "../CustomFormsStyledComponents";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import FieldType from "./FieldType";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { DraggableComponent } from "../../../../utils/components/Draggable/DraggableComponent";
interface IFieldTypesProps {
    fieldTypes: IFieldSettings[];
    onChange: (ele: IFieldSettings, currentField: ICurrentField, formFields:IFieldSettings[], setFormFields: Function, setCurrentField: Function, idx?: number | undefined) => void; 
    group?: string | GroupOptions
    disabled?: boolean;
    onClone?: (currentItem: IFieldSettings, evt: SortableEvent) => IFieldSettings;
    handleFormFieldDrag: Function
    setFormFields: Function
    setCurrentField: Function
    currentField: ICurrentField
    formFields: IFieldSettings[]
}
const FieldTypeContainer = ({fieldTypes, onChange, disabled, onClone, group, handleFormFieldDrag, setFormFields, setCurrentField, currentField, formFields}: IFieldTypesProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    const isDisableSaveButton = useTypedSelector((state) => state.customForms.listView.form.isDisableSaveButton);
    return(
        <FieldContainer> 
            <FieldContainerHeader><h6>{dynamicLabels.addFieldHeader}</h6></FieldContainerHeader>
            <ul>
            <DraggableComponent group={group} onClone={onClone} sort={disabled} list={fieldTypes} setList={(newState: any) => {handleFormFieldDrag(newState)} }>
                {fieldTypes && fieldTypes.length > 0 &&
                     fieldTypes.map((field:IFieldSettings, index: number) => {
                        return <li className="field-type-list" key={String(index)} onClick={() => {!isDisableSaveButton? onChange(field, currentField, formFields, setFormFields, setCurrentField):""}}> <FieldType iconVariant={field.className} label={field.Name} /></li>
                    })
                }
            </DraggableComponent>
            </ul>
        </FieldContainer>
    )
}

export default FieldTypeContainer;