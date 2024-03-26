import React, { useEffect, useState, Dispatch } from "react";
import { FieldContainer, FieldContainerHeader, FieldPropertyEntries, OptionContainer, RadioGroupGrid } from "../CustomFormsStyledComponents";
import { RadioGroup, Grid, Radio, TextInput, NumberInput, InputLabel, IconButton } from "ui-library";
import { IFieldSettings, fieldSettings } from "./../CustomForms.models";
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { useDispatch } from 'react-redux';
import { CustomFormsActions } from "../CustomForms.actions";
interface IFieldPropertiesProps {
    fieldType: string | undefined
    id: number;
    ChangeFieldSetting: Function
    setFormFields: Function
    formFields: IFieldSettings[]
    addNewOption: Function
    removeOption: Function
    updateOption: Function
}

const FieldProperties = (props: IFieldPropertiesProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    const dispatch = useDispatch<Dispatch<CustomFormsActions>>()

    const [fieldProperties, setFieldProperties] = useState<Record<string, any> | undefined>({});
    const [isFieldTouched, setFieldTouched] = useState<boolean>(false);
    const [isValidationTouched, setValidationTouched] = useState<boolean>(false);
    const [isMinTouched, setMinTouched] = useState<boolean>(false);
    const [isMaxTouched, setMaxTouched] = useState<boolean>(false);
    const [isMinValTouched, setMinValTouched] = useState<boolean>(false);
    const [isMaxValTouched, setMaxValTouched] = useState<boolean>(false);
    const [minValue, setMinValue] = useState<Number>(0);
    const [maxValue, setMaxValue] = useState<Number>(255);
    const [maxValValue, setMaxValValue] = useState<Number>(100);
    const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
    
   
    const isFormEditable = window.location.hash.includes('consent') ?  useTypedSelector((state) =>state.consentHandling.Form.isUpdate)=== "FormLoaded" ?  true : false  : useTypedSelector((state) => state.customForms.listView.form.isFormEditable)
    const { fieldType, ChangeFieldSetting, id, formFields, addNewOption, removeOption, updateOption, setFormFields } = props;
    const findFieldProperties = (fieldType: string) => {
        if (fieldType && fieldType.length > 0) {
            const fieldProperty = isFormEditable ? formFields.filter((field) => field.Type === fieldType).length > 0 ? formFields.find((field) => field.Type === fieldType) : fieldSettings.find((field) => field.Type === fieldType) : fieldSettings.find((field) => field.Type === fieldType);
            setFieldProperties(fieldProperty);
        }
    }

    useEffect(() => {
        fieldType && findFieldProperties(fieldType);
    });

    return (
        <FieldContainer>
            <FieldContainerHeader><h6>{dynamicLabels.fieldPropertiesHeader}</h6></FieldContainerHeader>
            <FieldPropertyEntries>
                {fieldProperties && Object.keys(fieldProperties).length > 0 && fieldProperties?.Settings.map((field: IFieldSettings) => {
                    switch (field?.Type) {
                        case 'text':
                            const isTextArea = fieldProperties?.Type === "TextArea" && field?.Name === "Field Value";
                            const isMultipleTextInputs = fieldProperties?.Settings?.length > 0 && fieldProperties?.Settings?.filter(setting => setting.Type === "text")?.length > 1
                            return (
                                <>
                                    <InputLabel className="fieldLabel">{field.Name}</InputLabel>
                                    {isTextArea ?
                                        <textarea
                                            id={field?.Name.replace(' ', '_')}
                                            className="no-margin field-label field-property field-property-textarea"
                                            placeholder={
                                                !isFieldTouched ? isFormEditable 
                                                ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value 
                                                : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                            value={!isFieldTouched ? isFormEditable 
                                                ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value 
                                                : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                            onChange={(e) => { 
                                                setFieldTouched(true);
                                                ChangeFieldSetting(e.target.value, field?.Name, id, formFields, setFormFields);
                                            }}
                                        />  :   
                                        <TextInput
                                            id={field?.Name.replace(' ', '_')}
                                            className="no-margin field-label field-property"
                                            maxLength={255}
                                            {...(!isMultipleTextInputs ? {
                                                placeholder: !isFieldTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Name : field?.Value : formFields.find((field) => field.id === id)?.Name,
                                                value: !isFieldTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Name : field?.Value : formFields.find((field) => field.id === id)?.Name
                                            } : {
                                                placeholder:
                                                    !isFieldTouched ? isFormEditable 
                                                    ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value 
                                                    : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value,
                                                value:!isFieldTouched ? isFormEditable 
                                                    ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value 
                                                    : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value
                                            })}
                                            onChange={(e) => { 
                                                setFieldTouched(true);
                                                ChangeFieldSetting(e.target.value, field?.Name, id, formFields, setFormFields);
                                            }}
                                            pattern=" ^[^./]*$"
                                            fullWidth={true}
                                        />
                                    }                              
                                </>
                            );
                        case 'dropdown':
                            return (
                                <>

                                    {formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options?.map((option: Record<string, string>, index: number) => {
                                            return (
                                                <>
                                                    {index === 0 && <InputLabel className="fieldLabel">{field.Name}</InputLabel>}
                                                    <OptionContainer className="options-container">
                                                        <TextInput className="dropdown-option no-margin field-property" name={`${index}-${option.value}`} id={`${index}-${option.value}`} value={option.value} placeholder={option.label} onChange={(e) => updateOption(id, index, e.target.value, formFields, setFormFields)} pattern="^[^./]*$" />
                                                        {formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options.length === 1 ?
                                                            <>
                                                                {/* <IconButton className="options-icons" iconVariant="icomoon-minus" onClick={() => removeOption(id, index, formFields, setFormFields)} /> */}
                                                                <IconButton className="options-icons" iconVariant="add" onClick={() => addNewOption(id, formFields, setFormFields)} />
                                                            </> : index === formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options.length - 1 &&
                                                            <>
                                                                <IconButton className="options-icons" iconVariant="icomoon-minus" onClick={() => removeOption(id, index, formFields, setFormFields)} />
                                                                <IconButton className="options-icons" iconVariant="add" onClick={() => addNewOption(id, formFields, setFormFields)} />
                                                            </>
                                                        }
                                                    </OptionContainer>
                                                </>
                                            )
                                        })
                                    }
                                </>

                            );
                        case 'dropdown_increment':
                            return (
                                <>
                                    {formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options?.map((option: Record<string, string>, index: number) => {
                                            return (
                                                <>
                                                    {index === 0 && <InputLabel className="fieldLabel">{field.Name}</InputLabel>}
                                                    <OptionContainer className="options-container">
                                                        <TextInput className="dropdown-option no-margin field-property" name={`${index}-${option.value}`} id={`${index}-${option.value}`} value={option.value} placeholder={option.label} onChange={(e) => updateOption(id, index, e.target.value, formFields, setFormFields)} pattern="^[^./]*$" />
                                                        {formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options.length === 1 ?
                                                            <> 
                                                                 {/* <IconButton className="options-icons" iconVariant="icomoon-minus" onClick={() => removeOption(id, index, formFields, setFormFields)} /> */}
                                                                <IconButton className="options-icons" iconVariant="add" onClick={() => addNewOption(id, formFields, setFormFields)} />
                                                            </> : index === formFields.find((field) => field.id === id)?.Settings.find((setting) => setting.Name === "Options")?.Options.length - 1  &&
                                                            <>
                                                                <IconButton className="options-icons" iconVariant="icomoon-minus" onClick={() => removeOption(id, index, formFields, setFormFields)} />
                                                                <IconButton className="options-icons" iconVariant="add" onClick={() => addNewOption(id, formFields, setFormFields)} />
                                                            </>
                                                        }
                                                    </OptionContainer>
                                                </>
                                            )
                                        })
                                    }
                                </>

                            );
                        case 'radioZone':
                            return (
                                <>
                                    <FieldContainerHeader className="validation-header"><h6>{dynamicLabels.validationHeader}</h6></FieldContainerHeader>
                                    <RadioGroup
                                        id='select-mandatory'
                                        variant='form'
                                        orientation={true}
                                    >
                                        <Grid container spacing="10px">
                                            {field?.Options?.map((option: any, index: number) => {
                                                return <RadioGroupGrid className="radio-group" item>
                                                    <Radio
                                                        id={`${index}-${option.Name}`}
                                                        key={option?.Name}
                                                        label={option?.Name}
                                                        name={option?.Name}
                                                        value={!isValidationTouched ? option?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Options[index].Value}
                                                        radioSize='lg'
                                                        style={{ fontSize: '12px' }}
                                                        checked={!isValidationTouched ? option?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Options[index].Value}
                                                        onChange={(e) => { setValidationTouched(true); ChangeFieldSetting(e.target.value, field?.Name, id, formFields, setFormFields) }}
                                                    />
                                                </RadioGroupGrid>
                                            })}
                                        </Grid>
                                    </RadioGroup>
                                </>
                            );
                        case 'min':
                            return (
                                <>
                                    <InputLabel className="fieldLabel">{field.Name}</InputLabel>
                                    <NumberInput
                                        id={field.Type.replace(' ', '_')}
                                        className="no-margin minRange field-property"
                                        name={field.Name}
                                        min={0}
                                        max={255}
                                        fullWidth={true}
                                        placeholder={!isMinTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        value={!isMinTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        onChange={(e) => { setMinTouched(true); ChangeFieldSetting(e, field?.Name, id, formFields, setFormFields) }}
                                        onBlur={(e:any)=>{ 
                                            setMinValue(e.target.value); 
                                            if(e.target.value>maxValue)
                                            {
                                                setIsErrorMessage(true);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: true });
                                            }
                                            else
                                            {
                                                setIsErrorMessage(false)
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: false });
                                            }
                                          }}
                                    />
                                </>
                            );
                        case 'max':
                            return (
                                <>
                                    <InputLabel className="fieldLabel">{field.Name}</InputLabel>
                                    <NumberInput
                                        id={field.Type.replace(' ', '_')}
                                        className="no-margin maxRange field-property"
                                        name={field.Name}
                                        min={1}
                                        max={255}
                                        placeholder={!isMaxTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        value={!isMaxTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        onChange={(e) => { setMaxTouched(true); ChangeFieldSetting(e, field?.Name, id, formFields, setFormFields) }}
                                        onBlur={(e:any)=>{ 
                                            setMaxValue(e.target.value);
                                            if(minValue>e.target.value)
                                            {
                                                setIsErrorMessage(true);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: true });
                                            }
                                            else
                                            {
                                                setIsErrorMessage(false);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: false });
                                            }
                                        }}
                                        fullWidth={true}
                                        error={isErrorMessage}
                                    />
                                    {isErrorMessage ? <span style={{ color: 'red'}}>{dynamicLabels.fieldsValidationMessage}</span> : <span></span>} 
                                </>
                            );
                        case 'minVal':
                            return (
                                <>
                                    <InputLabel className="fieldLabel">{field.Name}</InputLabel>
                                    <NumberInput
                                        id={field.Type.replace(' ', '_')}
                                        className="no-margin minRange field-property"
                                        name={field.Name}
                                        min={0}
                                        max={99999999}
                                        placeholder={!isMinValTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        value={!isMinValTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value : field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        onChange={(e) => { setMinValTouched(true); ChangeFieldSetting(e, field?.Name, id, formFields, setFormFields) }}
                                        onBlur={(e:any)=>{ 
                                            setMinValue(e.target.value);
                                            if(e.target.value>maxValValue)
                                            {
                                                setIsErrorMessage(true);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: true });
                                            }
                                            else
                                            {
                                                setIsErrorMessage(false);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: false });
                                            }
                                        }}
                                        fullWidth={true}
                                    />
                                </>
                            );
                        case 'maxVal':
                            return (
                                <>
                                    <InputLabel className="fieldLabel">{field.Name}</InputLabel>
                                    <NumberInput
                                        id={field.Type.replace(' ', '_')}
                                        className="no-margin maxRange field-property"
                                        name={field.Name}
                                        min={1}
                                        max={99999999}
                                        placeholder={!isMaxValTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        value={!isMaxValTouched ? isFormEditable ? formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value :  field?.Value : formFields.find((field) => field.id === id)?.Settings.find((setting: Record<string, string>) => setting.Name === field.Name)?.Value}
                                        onChange={(e) => { setMaxValTouched(true); ChangeFieldSetting(e, field?.Name, id, formFields, setFormFields) }}
                                        onBlur={(e:any)=>{ 
                                            setMaxValValue(e.target.value);
                                            if(minValue>e.target.value)
                                            {
                                                setIsErrorMessage(true);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: true });
                                            }
                                            else
                                            {
                                                setIsErrorMessage(false);
                                                dispatch({ type: '@@customForms/DISABLE_SAVE_BUTTON', payload: false });
                                            }
                                        }}
                                        fullWidth={true}
                                        error={isErrorMessage}
                                    />
                                    {isErrorMessage ? <span style={{ color: 'red'}}>{dynamicLabels.fieldsValidationMessage}</span> : <span></span>} 

                                </>
                            )
                        default:
                            return null;

                    }
                })}
            </FieldPropertyEntries>

        </FieldContainer>
    )
}

export default FieldProperties;