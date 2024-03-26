import React from "react";
import { IFieldSettings } from "../../CustomForms.models";
import { InputLabel, FontIcon, DropDown, Radio, Checkbox, TextInput, TextArea, NumInput, Box } from "ui-library";
import { deepCopy } from "../../../../../utils/helper";
import { FormFieldContainer, IconContainer, Epod, CameraIconContainer, FieldIconInside,BarcodeWrapper, BarcodeIcon, TextWrapper } from "../../CustomFormsStyledComponents";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
interface IFieldTypeElementsProps {
    formFields: IFieldSettings[]
    setFieldActive?: Function;
    removeField?: Function;
    setCurrentField?: Function
    setFormFields?: Function
}

const FieldTypeElements = (props: IFieldTypeElementsProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms);
    const { formFields, setFieldActive, removeField, setCurrentField, setFormFields } = props;

    const GetFieldSetting = (settingName: string, index: number) => {
        const currentField = deepCopy(formFields).splice(index, 1);
        if (currentField.length > 0) {
            return currentField[0]?.Settings?.find((setting: Record<string, any>) => setting.Name === settingName)
        } else return;
    }

    const isValidUrl = (url:string) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const checkIfURLAndLinkify = (text:string) => {
        const linkifiedText = text?.split(' ').map((word, index) => {
            if (isValidUrl(word)) {
                return (
                    `<a key={${index}} href=${word} style={{ color: 'blue' }} target="_blank">${word}</a> `
                );
            }
            return `${word} `;
        }).join('');
        return linkifiedText;
    }

    return (
        <>
            {formFields.length > 0 && formFields.sort((a,b) => a.fieldSequence - b.fieldSequence).map((field: IFieldSettings, index: number) => {
                switch (field.Type) {
                    case 'text':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type={field?.Type} variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        )
                    case 'email':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type={field?.Type} variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'date':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput  fullWidth type="text" variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                                <FieldIconInside className="field-icon-inside" ><FontIcon variant="calendar-thin" /></FieldIconInside>
                            </FormFieldContainer>
                        );
                    case 'time':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type="text" variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                                <FieldIconInside className="field-icon-inside" ><FontIcon variant="clock-outlined" /></FieldIconInside>
                            </FormFieldContainer>
                        );
                    case 'datetime':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type="text" variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                                <FieldIconInside className="field-icon-inside" ><FontIcon variant="calendar-thin" /></FieldIconInside>
                            </FormFieldContainer>
                        );
                    case 'number':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <NumInput fullWidth variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'decimal_number':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <NumInput fullWidth variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'perc_number':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <NumInput fullWidth variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'dropdown':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <DropDown variant="list-view" className='dropdown' optionList={GetFieldSetting('Options', index)?.Options} fullWidth id={field.Name.replace(' ', '_') + field.id} placeholder={field.Placeholder + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} showCrossIcon={false} showDropdownIndicator={false} />
                            </FormFieldContainer>
                        )
                    case 'radioGroup':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list radioGroup form-field active-field' : 'field-type-list radioGroup form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <InputLabel>{field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')}</InputLabel>
                                {GetFieldSetting('Options', index)?.Options?.map((option: Record<string, string>, index: number) => {
                                    return <Radio key={String(index)} label={option?.label} />
                                })}
                            </FormFieldContainer>
                        )
                    case 'checkbox':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list checkboxGroup form-field active-field' : 'field-type-list checkboxGroup form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <InputLabel>{field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')}</InputLabel>
                                {GetFieldSetting('Options', index)?.Options.map((option: Record<string, string>, index: number) => {
                                    return <Checkbox key={String(index)} label={option?.label} />
                                })}
                            </FormFieldContainer>
                        )
                    case 'geocode':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type="text" variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'esign':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <InputLabel>{field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')}</InputLabel>
                                <TextArea label={field.Placeholder} id={field.Name.replace(' ', '_') + field.id} />
                            </FormFieldContainer>
                        );
                    case 'phone_number':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <TextInput fullWidth type="text" variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                            </FormFieldContainer>
                        );
                    case 'epod':
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                <InputLabel>{field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')}</InputLabel>
                                <Epod><CameraIconContainer><FontIcon className="epod-icon" variant="camera-outline" />{dynamicLabels.camera}</CameraIconContainer></Epod>
                            </FormFieldContainer>
                        );
                    case 'barCode':
                            return (
                               
                                <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                    {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                    <BarcodeWrapper>
                                        <TextWrapper>
                                            <TextInput width={60} type={field?.Type} variant="inline-edit" label={field.Name + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} id={field.Name.replace(' ', '_') + field.id} placeholder={field.Placeholder + (GetFieldSetting('Validations', index)?.selected ? '*' : '')} />
                                        </TextWrapper>
                                        <BarcodeIcon className="field-icon-inside" ><FontIcon  color='primary.main' size="sm" variant="icomoon-back" /> </BarcodeIcon>
                                        <BarcodeIcon className="field-icon-inside" ><FontIcon  color='primary.main' size="sm" variant="scan-continue" /> </BarcodeIcon>
                                    </BarcodeWrapper>

                                </FormFieldContainer>
                        );   
                    case 'TextArea':
                        const fieldLabel =  field?.Settings?.length > 0 && field?.Settings?.find((setting: Record<string, any>) => setting.Name === "Field Label")?.Value;
                        const fieldValue =  field?.Settings?.length > 0 && field?.Settings?.find((setting: Record<string, any>) => setting.Name === "Field Value")?.Value;
                        return (
                            <FormFieldContainer onClick={() => setFieldActive && setFieldActive(field.id)} className={`${field.Active ? 'field-type-list form-field active-field' : 'field-type-list form-field'}`} key={String(index)}>
                                {field.Active && <IconContainer onClick={(e) => { e.stopPropagation(); removeField && removeField(field.id, formFields, setCurrentField, setFormFields) }}><FontIcon className="field-icon" variant="cancel-button" /></IconContainer>}
                                {fieldLabel && <Box mb="5px" style={{fontWeight: 700}}>{fieldLabel + (GetFieldSetting('Validations', index)?.selected ? '*' : '')}</Box>}
                                <Box dangerouslySetInnerHTML={{__html: checkIfURLAndLinkify(fieldValue.replace(/\n/g, '<br>')) + (GetFieldSetting('Validations', index)?.selected ? '*' : '') }} /> 
                            </FormFieldContainer>
                        );
                    default:
                        return <></>;
                }
            })}
        </>
    )
}

export default FieldTypeElements;