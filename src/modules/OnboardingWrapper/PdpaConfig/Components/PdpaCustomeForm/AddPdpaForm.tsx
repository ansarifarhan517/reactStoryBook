import React, { Dispatch, useEffect, useState } from "react"
import DesignForm from "../../../CustomForms/SubComponents/DesignForm";
import { useHistory } from 'react-router-dom';
import { fieldSettings, ICurrentField, IFieldSettings, IFormFields } from "../../../CustomForms/CustomForms.models";
import { addElementConsent, addFormFieldsconset, toCamelCase } from "../../../CustomForms/utils";
import { useForm } from "react-hook-form";
import { closeSideMenu } from "../../../../../utils/helper";
import { useDispatch } from "react-redux";
import { PdpaConfigActions } from "../PdpaConfig.action";
import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormFieldPdpa from "./FormFiledPdpa";
import { useToast } from "ui-library";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import { isEqual } from "../../../../../utils/commonFunctions/lodashFunctions";


const AddPdpaForm = () => {
    //All the state variable should come under this
    const [currentField, setCurrentField] = useState<ICurrentField>({ id: 0, Name: '', Settings: [], Active: false });
    const [formFields, setFormFields] = useState<Array<IFieldSettings>>([]);
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const structure = useTypedSelector(state => state.consentHandling.Form.consetActForm.structure)
    const sectionKeys = Object.keys(structure);
    const { watch, handleSubmit, setValue } = formInstance;
    const dispatch = useDispatch<Dispatch<PdpaConfigActions>>();
    const history = useHistory()
    const watchAllFields = watch()
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    const toast = useToast()
    const customFormData =  useTypedSelector((state) => state.consentHandling.Form.consetActFormUpdate.customFormData);
    const [formId , setFormId] = useState('')
    const isUpdate = useTypedSelector((state) =>state.consentHandling.Form.isUpdate)
    //all the effect come under This only
    useEffect(() => {
        closeSideMenu();
        //cleanup function set the view to type to list if the user moves out of details page
       return () => {
            dispatch({
                type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
                payload:{viewType: "ListLoaded"}
               })
        }
    }, []);

    useEffect(() => {
        dispatch({ type: '@@PROTECTIONCONFIG/GET_FETCH_FORM' });
        return () => {
            dispatch({
                type:"@@PROTECTIONCONFIG/SET_PAGETYPE",
                payload:"listPage"
               })
        }
    }, []);

    useEffect(() =>{
        if(isUpdate === "FormLoaded" &&  customFormData && customFormData.customFormStructure['general details']){
        //Form fields To fill the Data
        setValue('version', customFormData['version']);
        setValue('name', customFormData['name']);
        setValue('consentTypeId', {id: customFormData['consentTypeId'], name: customFormData['consentType']});
        //setCustomeFields
        addFormFieldsconset(customFormData, fieldSettings, setCurrentField, setFormFields)
        setFormId(customFormData.id)
        }
    },[isUpdate , customFormData])

    //all the function should come under this
    const cloneFieldType = (currentItem: IFieldSettings) => {
        return { ...currentItem, Active: true }
    }
    const handleFormFieldDrag = (list: IFieldSettings[]) => {
        return list;
    }

    const handleCheckFieldsChanged = (oldDesignFormValues: any, newDesignFormValues: any) => {
        const newFormValues = formInstance.getValues();
        const isSameDetailsForm = customFormData['version'] === newFormValues.version && customFormData['consentTypeId'] === newFormValues.consentTypeId.id && customFormData['name'] === newFormValues.name;
        const isSameDesignFields = isEqual(Object.keys(oldDesignFormValues), Object.keys(newDesignFormValues));
        const isSameDesignForm = isSameDesignFields ? isEqual(oldDesignFormValues, newDesignFormValues) : false;        
        return isSameDetailsForm && isSameDesignForm;
    }

    const  saveForm = async(submitType: string, fields: IFormFields) => {

        let saveStructure = {};
        const dynamicFormData = new Array();
        let formStructure = {
            structure: {
                "general details": {}
            }
        };
        let isDuplicate = false;
        let isFiledEmpty = false
        const fieldNames: string[] = [];
       

        if (formFields.length === 0) {
            toast.add(dynamicLabels.errorNoFields, 'error', false);
        } else {
            formFields.forEach((val) => {
               

                if (!isDuplicate) {
                    let saveValidation = {};
                    const label = val.Type === "TextArea" ? val?.Settings?.find((setting: Record<string, any>) => setting.Name === "Field Label")?.Value : val.Name;
                    if (fieldNames.indexOf(label) > -1) {
                        isDuplicate = true;
                    } else {
                        fieldNames.push(label);
                    }
                    
                    if(val.Name === ""){
                        isFiledEmpty = true
                        toast.add(dynamicLabels.FiledLableEmpty ? dynamicLabels.FiledLableEmpty : "Field Label cannot be empty", 'error', false);
                    }
                    if (isDuplicate) {
                        toast.add(dynamicLabels.errorDuplicateFields, 'error', false);
                    } else {
                        val.Settings.forEach((e) => {
                            if (e.Name == "Validations") {
                                if (e.selected) {
                                    saveValidation["required"] = {
                                        // "function": null,
                                        // "args": null,
                                        "message": val.Name + " is Required."
                                    }
                                } else {
                                    e.Options[0].Value = false;
                                }
                            } else if (e.Name == "Min Character Length") {
                                saveValidation["minlength"] = {
                                    // "function": null,
                                    "args": e.Value.toString(),
                                    "message": "Min length of " + val.Name + " can be " + e.Value + " characters."
                                }
                            } else if (e.Name == "Max Character Length") {
                                saveValidation["maxlength"] = {
                                    // "function": null,
                                    "args": e.Value.toString(),
                                    "message": "Max length of " + val.Name + " can be " + e.Value + " characters."
                                }
                            } else if (e.Name == "Min Value") {
                                saveValidation["min"] = {
                                    // "function": null,
                                    "args": e.Value.toString(),
                                    "message": "Min value of " + val.Name + " cannot be less than " + e.Value + "."
                                }
                            } else if (e.Name == "Max Value") {
                                saveValidation["max"] = {
                                    // "function": null,
                                    "args": e.Value.toString(),
                                    "message": "Max value of " + val.Name + " cannot be more than " + e.Value + "."
                                }
                            }
                        })
                        // settings foreach ends here

                        if (val.Type == "decimal_number") {
                            saveValidation["pattern"] = {
                                // "function": null,
                                "args": '^(\\d{0,9}\\.\\d{1,4}|\\d{1,9})$',
                                "message": "Please enter a valid input"
                            }
                        }
                        if (val.Type == "perc_number") {
                            saveValidation["pattern"] = {
                                // "function": null,
                                "args": '^(\\d{0,9}\\.\\d{1,4}|\\d{1,9})$',
                                "message": "Please enter a valid input"
                            }
                        }
                        if (val.Type == "phone_number") {
                            saveValidation["phoneNumber"] = {
                                // "function": null,
                                // "args": null,
                                "message": "Please enter a valid phone number"
                            }
                        }

                        if (val.Type == "dropdown" || val.Type == "radioGroup" || val.Type == "checkbox") {
                            var dropdownValues = {}
                            val.Settings.forEach((k) => {
                                if (k.Name == dynamicLabels["Options"]) {
                                    k?.Options?.forEach((v: Record<string, string>) => {
                                        const value = v.value;
                                        const valueId = toCamelCase(v.label);
                                        dropdownValues[valueId] = value
                                    })
                                }
                            })
                            saveStructure[toCamelCase(val.Name)] = {
                                "label": val.Name,
                                "fieldName": val.Type,
                                "fieldType": val.Type,
                                "permission": true,
                                "editable": true,
                                "id": toCamelCase(val.Name),
                                "required": (val.Settings.length > 0 ? val.Settings.find((setting: Record<string, any>) => setting.Name === "Validations")?.Options.find((option: Record<string, any>) => option.Name === 'Mandatory').Value : false),
                                "validation": saveValidation,
                                "dropdownValues": dropdownValues
                            }
                        }  
                         else {
                            if (val.Type == "decimal_number" || val.Type == "perc_number") {
                                val.Type = "number";
                            }
                            if(val.Type !== "TextArea") {
                                saveStructure[toCamelCase(val.Name)] = {
                                    "label": val.Name,
                                    "fieldName": val.Type,
                                    "fieldType": val.Type,
                                    "permission": true,
                                    "editable": true,
                                    "id": toCamelCase(val.Name),
                                    "required": (val.Settings.length > 0 ? val.Settings.find((setting: Record<string, any>) => setting.Name === "Validations")?.Options.find((option: Record<string, any>) => option.Name === 'Mandatory').Value : false),
                                    "validation": saveValidation
                                }
                            }
                        }
                        if (val.Type == "TextArea") {
                            const fieldLabel = val?.Settings?.find((setting: Record<string, any>) => setting.Name === "Field Label")?.Value;
                            const fieldValue = val?.Settings?.find((setting: Record<string, any>) => setting.Name === "Field Value")?.Value;
                            saveStructure[toCamelCase(fieldLabel)] = {
                                "label": fieldValue,
                                "fieldName": fieldLabel,
                                "fieldType": val.Type,
                                "permission": true,
                                "editable": true,
                                "id": val.Name.substring(0,3),   // time .now need to add
                                "required": (val?.Settings?.length > 0 && val?.Settings?.find((setting: Record<string, any>) => setting.Name === "Validations")?.Options.find((option: Record<string, any>) => option.Name === 'Mandatory').Value) ?? false,
                                "validation": saveValidation,
                                
                            }
                        }
                    }
                }
            });

            formStructure.structure["general details"] = saveStructure;

            if (!isDuplicate && !isFiledEmpty) {
                let formData: Record<string, string> = {};
                Object.keys(structure).forEach((value) => {
                    if (value === 'general details') {
                        formData['consentTypeId'] = watchAllFields['consentTypeId']
                        formData['name'] = watchAllFields['name']
                        formData['version'] = watchAllFields['version']
                    } else {
                        dynamicFormData.push({
                            'consentTypeId': watchAllFields['consentTypeId']?.id ,
                            'name': watchAllFields['name'],
                            'version': watchAllFields['version'],
                            "customFormStructure": formStructure.structure,
                        })
                    }
                    
                });
                //if any issue occure this is the line
                isUpdate === "FormLoaded" && (dynamicFormData[0] =	{...dynamicFormData[0], 'id':formId})
            }

            if (!isDuplicate && !isFiledEmpty) {
                if (isUpdate === "FormLoaded" && submitType === "save") {
                    const oldDesignFormValues = Object.fromEntries(Object.keys(customFormData.customFormStructure['general details']).map(key => [
                        key,
                        {
                            label: customFormData.customFormStructure['general details'][key].label,
                            permission: customFormData.customFormStructure['general details'][key].permission,
                            validation: customFormData.customFormStructure['general details'][key].validation
                        }
                    ]));
                    const newDesignFormValues = Object.fromEntries(Object.keys(saveStructure).map(key => [
                        key,
                        {
                            label: saveStructure[key].label,
                            permission: saveStructure[key].permission,
                            validation: saveStructure[key].validation
                        }
                    ]));
                    const isSameValues = handleCheckFieldsChanged(oldDesignFormValues, newDesignFormValues);
                    if(isSameValues) { 
                        toast.add("Unable to Save as you have made No changes", "warning", false);
                        return; 
                    }
                }

                const url = isUpdate === "FormLoaded" ? submitType === "save" ? apiMappings.consent.form.updateform : apiMappings.consent.form.publishConsent : submitType === "save" ? apiMappings.consent.form.submitConsent : apiMappings.consent.form.publishConsent
                try {
                    const { data } = isUpdate !== "FormLoaded"  ?  await axios.post(url, dynamicFormData[0]) : submitType === "save"  ? await axios.put(url, dynamicFormData[0]) : await axios.post(url, dynamicFormData[0]) 
                    if (data.hasError) {
                        toast.add(dynamicLabels.formAlreadyExistForUserGroup, 'error', false);
                    } else {
                        if (data.status === 409) {
                            toast.add(dynamicLabels.formAlreadyExistForUserGroup, 'error', false);
                        } else {
                            toast.add(data.message, 'check-round', false);
                            dispatch({ type: "@@PROTECTIONCONFIG/SET_VIEW_TYPE", payload: { viewType: "List" } })
                            dispatch({
                                type:"@@PROTECTIONCONFIG/SET_CONSENT_FORM_VIEW_TYPE",
                                payload:{viewType: "ListLoaded"}
                            })
                            history.push('/')
                        }
                    }
                    throw data.message;
                } catch (errorMessage) {
                    toast.add(typeof errorMessage === 'string' ? errorMessage === "Some issue encountered in server" ? dynamicLabels.formAlreadyExistForUserGroup : errorMessage : dynamicLabels.somethingWendWrong, '', false);
                }
            }
            
        }
    }


    const setFieldActive = (id: number) => {
        const updatedFields = formFields.map((field) => {
            if (field.id === id) {
                return { ...field, 'Active': true }
            } else {
                return { ...field, 'Active': false }
            }
        });
        let newCurrentField = { Active: true, Name: "", Settings: [], id: id }
        setCurrentField(newCurrentField);
        setFormFields(updatedFields);
    }

    const handleDrag = (newState: IFieldSettings[]) => {
        newState.forEach((obj: any, index: number) => {
            if (formFields.length < newState.length) {
                obj.Active = formFields.filter((formField: IFieldSettings) => formField.id === obj.id).length > 0 ? false : true,
                    obj.fieldSequence = index + 1,
                    obj.id = index + 1
            } else {
                obj.fieldSequence = index + 1
            }
        });
        setFormFields(newState);
    }


    return (

        <React.Fragment>
            {sectionKeys.length > 0 &&
                sectionKeys.map((sectionName) => (
                    sectionName === 'designForm' ?
                        <DesignForm key={sectionName} sectionName={sectionName} cloneFieldType={cloneFieldType} addElement={addElementConsent} handleFormFieldDrag={handleFormFieldDrag} currentField={currentField} formFields={formFields} setFormFields={setFormFields} setCurrentField={setCurrentField} handleSubmit={handleSubmit} saveForm={saveForm} watchAllFields={watchAllFields} setFieldActive={setFieldActive} handleDrag={handleDrag} pageName={'AddConsent'}/> :
                        <FormFieldPdpa key={sectionName} sectionName={sectionName} structure={structure} formInstance={formInstance} />
                ))
            }
        </React.Fragment>
    )
}

export default AddPdpaForm