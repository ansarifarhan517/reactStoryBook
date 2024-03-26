import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import { useTypedSelector } from "../../../../utils/redux/rootReducer";
import { CustomFormsActions } from "../CustomForms.actions";
import uuid from "uuid";
import { useToast } from "ui-library";
import { useForm } from "react-hook-form";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import { ITriggerEventsStructure, ICurrentField, fieldSettings, IFieldSettings, ICustomFormRouteParams, ITriggerEvents, IDropDownOptions, IAccountNames, IDropDownValue, IFormFields, ICustomFormData, rowData } from "../CustomForms.models";
import { addElement, addFormFields, addTriggerEvent, findPartialKeyName, isEmpty, toCamelCase } from "../utils";
import { closeSideMenu, deepCopy } from "../../../../utils/helper";
import axios from "../../../../utils/axios";
import apiMappings from '../../../../utils/apiMapping';
import FormLoader from "../../../../utils/components/FormLoader";
import TriggerEvents from "./TriggerEvents";
import FormFields from "./FormFields";
import DesignForm from "./DesignForm";
// import { IMongoField } from "../../../../utils/mongo/interfaces";

const AddCustomForm = () => {
    /* General Hooks */
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false });
    const { watch, handleSubmit, setValue, clearErrors } = formInstance;
    const watchAllFields = watch()
    const toast = useToast()
    const history = useHistory()
    const {customFormGroupId} = useParams<ICustomFormRouteParams>();

    /** Redux Hooks */
    const dispatch = useDispatch<Dispatch<CustomFormsActions>>()
    const structure = useTypedSelector((state) => state.customForms.listView.form.structure);
    const isFormLoading = useTypedSelector((state) => state.customForms.listView.form.loading);
    const triggerEventsList = useTypedSelector((state) => state.customForms.listView.form.triggerEventsList);
    const isFormEditable = useTypedSelector((state) => state.customForms.listView.form.isFormEditable);
    const customFormData = useTypedSelector((state) => state.customForms.listView.form.customFormData);
    
    const orderTypes = useTypedSelector((state) => state.customForms.listView.lookup.orderTypes); 
    const orderStates = useTypedSelector((state) => state.customForms.listView.lookup.orderStates); 
    const orderLocations = useTypedSelector((state) => state.customForms.listView.lookup.orderLocations); 
    const triggerElements = useTypedSelector((state) => state.customForms.listView.lookup.triggerElements); 
    const serviceTypes = useTypedSelector((state) => state.customForms.listView.lookup.serviceTypes); 
    const deliveryTypes = useTypedSelector((state) => state.customForms.listView.lookup.deliveryTypes); 
    const subClients = useTypedSelector((state) => state.customForms.listView.lookup.subClients);
    
    const sectionKeys = Object.keys(structure);
    const [formFields, setFormFields] = useState<Array<IFieldSettings>>([]);
    const [currentField, setCurrentField] = useState<ICurrentField>({ id: 0, Name: '', Settings: [], Active: false });
    const [isTriggerEventTouched, setTriggerEventTouched] = useState<boolean>(false);
    const loaderRef = React.useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        closeSideMenu();
    }, []);

    useEffect(() => {
        if (!isFormEditable && Object.keys(structure).length > 0 && structure.hasOwnProperty('triggerEvents')) {
            const meta = deepCopy(structure['triggerEvents'])
            let { childNodes } = meta['triggerEvents'];

                childNodes = Object.keys(meta['triggerEvents']['childNodes']).reduce((obj,field) => {    
                if(field === 'isMandatory') {
                obj[field] = {...meta['triggerEvents']['childNodes'][field], value: 'Y'}
                } else {
                obj[field] = {...meta['triggerEvents']['childNodes'][field]}
                }
                return obj;
            }, {});

            if (childNodes && Object.keys(childNodes).length > 0 && !isFormEditable) dispatch({ type: '@@customForms/SET_TRIGGER_EVENTS_LIST', payload: [childNodes] })
        }
    }, [structure, isFormEditable]);

    useEffect(() => {
        if(customFormGroupId && customFormGroupId?.length > 0) {
            dispatch({ type: '@@customForms/FETCH_FORM_STRUCTURE' });
            dispatch({type: "@@customForms/FETCH_TRIGGER_EVENTS_BY_ID", payload: Number(customFormGroupId)});
            dispatch({type: "@@customForms/SET_FORM_EDITABLE", payload: true});
            dispatchEventList([]);
        }
    },[customFormGroupId]);

    useEffect(() => {
        if(isFormEditable && structure && structure['triggerEvents'] && !isEmpty(structure) && !isEmpty(structure?.['triggerEvents']['triggerEvents']) && !isTriggerEventTouched && triggerEventsList.length > 0 && orderTypes.length > 0 && orderStates.length > 0 && orderLocations.length > 0 && triggerElements.length > 0 && deliveryTypes.length > 0 && subClients.length > 0) {
      
            setValue('formName', `${customFormData['formName']}_Copy`);
            setValue('formDescription', customFormData['formDescription']);
            setValue('userGroup', {id: customFormData['userGroupId'], name: customFormData['userGroupName']});
            customFormData.triggerEventsData.map((event:ITriggerEvents) => {
                const id = event.id;
                setValue(`orderType-${id}`, orderTypes.find((order: IDropDownOptions) => order.clientRefMasterCd ===  event.orderType));
                setValue(`orderState-${id}`, event.orderStates.length > 0 ? event.orderStates.map((orderState: string) => orderStates.find((dropDownOrderState: IDropDownOptions) =>  dropDownOrderState.clientRefMasterCd === orderState)): []);
                setValue(`orderLocation-${id}`, orderLocations.find((orderLocation: IDropDownOptions) => orderLocation.clientRefMasterCd === event.orderLocation));
                setValue(`triggerElement-${id}`, triggerElements.find((triggerElement: IDropDownOptions) => triggerElement.clientRefMasterCd === event.triggerName));
                setValue(`isMandatory-${id}`, event.isMandatory ? "Y" : "N");
                setValue(`accountName-${id}`, event.subClientIds.length > 0 ? event.subClientIds.map((subClientId: number) => subClients.find((accountName: IAccountNames) =>  accountName.id === subClientId)) : []);
                setValue(`serviceType-${id}`, event.serviceTypes.length > 0 ? event.serviceTypes.map((serviceType: string) => serviceTypes.find((dropDownOrderState: IDropDownOptions) =>  dropDownOrderState.clientRefMasterCd === serviceType)) : []);
                setValue(`taskType-${id}`, event.taskTypes.length > 0 ? event.taskTypes.includes("DEFAULT") ? [] : event.taskTypes.map((taskType: string) => deliveryTypes.find((dropDownOrderState: IDropDownOptions) =>  dropDownOrderState.clientRefMasterCd === taskType)) : []);
            })
            addFormFields(customFormData, fieldSettings, setCurrentField, setFormFields);
           
        }
    },[isFormEditable, orderTypes, orderStates, orderLocations, triggerElements, serviceTypes, deliveryTypes, subClients, triggerEventsList]);

    useEffect(() => {
        if(isFormEditable && Object.keys(structure).length > 0 && [structure['triggerEvents']?.['triggerEvents']?.['childNodes']].length > 0 && customFormData.triggerEventsData.length > 0 && triggerEventsList.length < customFormData.triggerEventsData.length) {
            dispatchEventList([]);
            dispatch({type: '@@customForms/SET_FORM_LOADING', payload: true});
            const childNodes = structure['triggerEvents']?.['triggerEvents']?.['childNodes']
            let newList = []
            for(let i = 0; i < customFormData.triggerEventsData.length; i++) {
                let lastField = triggerEventsList.length > 1 ? [triggerEventsList[triggerEventsList.length - 1]] : triggerEventsList;
                newList.push(...addTriggerEvent(lastField,triggerEventsList.length,isFormEditable,customFormData.triggerEventsData[i].id, childNodes));
            }
            dispatchEventList(newList);
        }
    },[isFormEditable, customFormData, triggerEventsList, structure])

    const dispatchEventList = (payload: ITriggerEventsStructure[]) => {
        dispatch({ type: '@@customForms/SET_TRIGGER_EVENTS_LIST', payload: payload });
        setTimeout(() => {
            dispatch({ type: '@@customForms/SET_FORM_LOADING', payload: false })
        },1000)
    }

    const dispatchCustomFormData = (payload: ICustomFormData) => {
        dispatch({ type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS', payload: payload });
        dispatch({ type: '@@customForms/SET_FORM_LOADING', payload: false })
    }

    const AddTriggerEvents = () => {
        if(isFormEditable) {
            setTriggerEventTouched(true);
        }
        let lastField = triggerEventsList.length > 1 ? [triggerEventsList[triggerEventsList.length - 1]] : triggerEventsList;
        let newList = addTriggerEvent(lastField,triggerEventsList.length);
        let fields = [...triggerEventsList, ...newList];
        dispatchEventList(fields);
    }

    const DeleteAddTriggerEvent = (triggerEventsList: ITriggerEventsStructure[], deletedField: ITriggerEventsStructure) => {
        if(isFormEditable) {
            setTriggerEventTouched(true);
        }
        let id = Object.keys(deletedField)[0].split(Object.keys(deletedField)[0].split('-')[0])[1].replace('-','');
        const updatedList = deepCopy(triggerEventsList)
        clearErrors(Object.keys(deletedField));
        updatedList.forEach((opItem: {}) => {
            if (Object.keys(opItem)[Object.keys(opItem).length - 2] === Object.keys(deletedField)[Object.keys(deletedField).length - 2]) {
                Object.keys(opItem).forEach(field => {
                    setValue(field, undefined)
                    if (opItem[field] && opItem[field].label) {
                        delete opItem[field]
                    }
                })
            }
        });
        
        const newList = updatedList.filter((item: ITriggerEventsStructure) => Object.keys(item).length > 0);
        const updatedTriggerData = customFormData.triggerEventsData.filter((triggerEvent:ITriggerEvents) => triggerEvent?.id !== id);
        const updatedCustomData = {...customFormData, triggerEventsData: updatedTriggerData}
        dispatchCustomFormData(updatedCustomData);
        dispatchEventList(newList);
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
            if(formFields.length < newState.length) {
             obj.Active = formFields.filter((formField: IFieldSettings) => formField.id === obj.id).length > 0 ? false : true,
             obj.fieldSequence = index + 1,
             obj.id = index + 1
            } else {
                obj.fieldSequence = index + 1
            }
        });
        setFormFields(newState);
    }
    
    const cloneFieldType = (currentItem: IFieldSettings) => {
        return { ...currentItem, Active: true }
    }

    const handleFormFieldDrag = (list: IFieldSettings[]) => {
        return list;
    }

    const saveForm = async (submitType: string, fields: IFormFields) => {
        let saveStructure = {};
        const dynamicFormData = new Array();
        let formStructure = {
            structure: {
                "general details": {}
            }
        };
        let isDuplicate = false;
        const fieldNames:string[] = [];
        const currentTimeStamp = new Date().getTime();
        if(formFields.length === 0) {
            toast.add(dynamicLabels.errorNoFields, 'error', false);
        } else {
            formFields.forEach((val) => {
                if(!isDuplicate) {
                    let saveValidation = {};
                    if(fieldNames.indexOf(val.Name) > -1){
                        isDuplicate = true;
                    } else{
                        fieldNames.push(val.Name); 
                    }

                    if(isDuplicate){
                        toast.add(dynamicLabels.errorDuplicateFields, 'error', false);
                    } else {
                        val.Settings.forEach((e) => {
                            if (e.Name == "Validations") {
                                if (e.selected) {
                                    saveValidation["required"] = {
                                        "function": null,
                                        "args": null,
                                        "message": val.Name + " is Required."
                                    }
                                } else {
                                    e.Options[0].Value = false;
                                }
                            } else if (e.Name == "Min Character Length") {
                                saveValidation["minlength"] = {
                                    "function": null,
                                    "args": e.Value,
                                    "message": "Min length of " + val.Name + " can be " + e.Value + " characters."
                                }
                            } else if (e.Name == "Max Character Length") {
                                saveValidation["maxlength"] = {
                                    "function": null,
                                    "args": e.Value,
                                    "message": "Max length of " + val.Name + " can be " + e.Value + " characters."
                                }
                            } else if (e.Name == "Min Value") {
                                saveValidation["min"] = {
                                    "function": null,
                                    "args": e.Value,
                                    "message": "Min value of " + val.Name + " cannot be less than " + e.Value + "."
                                }
                            } else if (e.Name == "Max Value") {
                                saveValidation["max"] = {
                                    "function": null,
                                    "args": e.Value,
                                    "message": "Max value of " + val.Name + " cannot be more than " + e.Value + "."
                                }
                            }
                        })
                        // settings foreach ends here

                        if (val.Type == "decimal_number") {
                            saveValidation["pattern"] = {
                                "function": null,
                                "args": '^(\\d{0,9}\\.\\d{1,4}|\\d{1,9})$',
                                "message": "Please enter a valid input"
                            }
                        }
                        if (val.Type == "number") {
                            saveValidation["pattern"] = {
                                "function": null,
                                "args": '^-?\\d+$',
                                "message": "Please enter a valid input"
                            }
                        }
                        if (val.Type == "perc_number") {
                            saveValidation["pattern"] = {
                                "function": null,
                                "args": '^(\\d{0,9}\\.\\d{1,4}|\\d{1,9})$',
                                "message": "Please enter a valid input"
                            }
                        }
                        if (val.Type == "phone_number") {
                            saveValidation["phoneNumber"] = {
                                "function": null,
                                "args": null,
                                "message": "Please enter a valid phone number"
                            }
                        }

                        if (val.Type == "dropdown" || val.Type == "radioGroup" || val.Type == "checkbox") {
                            var dropdownValues = {}
                            val.Settings.forEach((k) => {
                                if (k.Name == "Options") {
                                    k.Options.forEach((v: Record<string, string>) => {
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
                                "required": (val.Settings.length > 0 ? val.Settings.find((setting: Record<string, any>) => setting.Name === "Validations")?.Options.find((option:Record<string, any>) => option.Name === 'Mandatory').Value : false),
                                "validation": saveValidation,
                                "dropdownValues": dropdownValues
                            }
                        } else {
                            if (val.Type == "decimal_number" || val.Type == "perc_number") {
                                val.Type = "number";
                            }
                            saveStructure[toCamelCase(val.Name)] = {
                                "label": val.Name,
                                "fieldName": val.Type,
                                "fieldType": val.Type,
                                "permission": true,
                                "editable": true,
                                "id": toCamelCase(val.Name),
                                "required": (val.Settings.length > 0 ? val.Settings.find((setting: Record<string, any>) => setting.Name === "Validations")?.Options.find((option:Record<string, any>) => option.Name === 'Mandatory').Value : false),
                                "validation": saveValidation
                            }
                        }
                    }
                }
            });

            formStructure.structure["general details"] = saveStructure;

            if(!isDuplicate) {
                let formData: Record<string, string> = {};
                Object.keys(structure).forEach((value) => {
                    if(value === 'form details') {
                        formData['formName'] = watchAllFields['formName']
                        formData['userGroupId'] = watchAllFields['userGroup']?.id
                        formData['formDescription'] = watchAllFields['formDescription']
                    } else if(value === 'triggerEvents') {
                        triggerEventsList.forEach((subValue: ITriggerEventsStructure, subKey: number) => {
                        dynamicFormData.push({
                            'customFormGroupId': currentTimeStamp,
                            'triggerEventGroupId': uuid.v4(),
                            'formDescription': formData?.formDescription,
                            'formName': formData?.formName,
                            'sectionName': fields[isFormEditable ? `${findPartialKeyName(subValue, `triggerElement-`)}` : subKey === 0 ? `triggerElement` : `${findPartialKeyName(subValue, `triggerElement-`)}`][`clientRefMasterCd`],
                            'pageNames': fields[isFormEditable ? `${findPartialKeyName(subValue, `taskType-`)}` : subKey === 0 ? `taskType` : `${findPartialKeyName(subValue, `taskType-`)}`] ? fields[isFormEditable ? `${findPartialKeyName(subValue, `taskType-`)}` :subKey === 0 ? `taskType` : `${findPartialKeyName(subValue, `taskType-`)}`].map((task: IDropDownValue) => task.clientRefMasterCd) : [],
                            'subClientIds': fields[isFormEditable ? `${findPartialKeyName(subValue, `accountName-`)}` :subKey === 0 ? `accountName` : `${findPartialKeyName(subValue, `accountName-`)}`] ? fields[isFormEditable ? `${findPartialKeyName(subValue, `accountName-`)}`: subKey === 0 ? `accountName` : `${findPartialKeyName(subValue, `accountName-`)}`].map((account: IDropDownValue) => account.id) : [],
                            'orderStates': fields[isFormEditable ? `${findPartialKeyName(subValue, `orderState-`)}` :subKey === 0 ? `orderState` : `${findPartialKeyName(subValue, `orderState-`)}`] ? fields[isFormEditable ? `${findPartialKeyName(subValue, `orderState-`)}`: subKey === 0 ? `orderState` : `${findPartialKeyName(subValue, `orderState-`)}`].map((orderState: IDropDownValue) => orderState.clientRefMasterCd): [],
                            'serviceTypes': fields[isFormEditable ? `${findPartialKeyName(subValue, `serviceType-`)}` : subKey === 0 ? `serviceType` : `${findPartialKeyName(subValue, `serviceType-`)}`] ? fields[isFormEditable ? `${findPartialKeyName(subValue, `serviceType-`)}`: subKey === 0 ? `serviceType` : `${findPartialKeyName(subValue, `serviceType-`)}`].map((serviceType: IDropDownValue) => serviceType.clientRefMasterCd): [],
                            'userGroupId': formData?.userGroupId,
                            'orderType': fields[isFormEditable ? `${findPartialKeyName(subValue, `orderType-`)}` : subKey === 0 ? `orderType` : `${findPartialKeyName(subValue, `orderType-`)}`][`clientRefMasterCd`],
                            'orderLocation': fields[isFormEditable ? `${findPartialKeyName(subValue, `orderLocation-`)}` : subKey === 0 ? `orderLocation` :  `${findPartialKeyName(subValue, `orderLocation-`)}`][`clientRefMasterCd`],
                            'isMandatory': !fields[isFormEditable ?`${findPartialKeyName(subValue, `isMandatory-`)}` : subKey === 0 ? `isMandatory` : `${findPartialKeyName(subValue, `isMandatory-`)}`] ? true : fields[isFormEditable ? `${findPartialKeyName(subValue, `isMandatory-`)}` : subKey === 0 ? `isMandatory` : `${findPartialKeyName(subValue, `isMandatory-`)}`] === 'Y'  ? true : false,
                            "type": "CUSTOMFORM",
                            "modelType": JSON.parse(String(localStorage.getItem('userAccessInfo')))['modelType'],
                            "structure": formStructure.structure
                        });
                    })
                   } else {
                    formData[value] = formInstance[value];
                   }
                });
                try {
                    const { data } = await axios.post(`${apiMappings.customForms.form.create}${submitType === 'publish' ? '?publish=true' : ''}`, dynamicFormData);
                    if(data.hasError) {
                        toast.add(dynamicLabels.formAlreadyExistForUserGroup, 'error', false);
                    }  else {
                        if(data.status === 409) {
                            toast.add(dynamicLabels.formAlreadyExistForUserGroup, 'error', false);
                        } else {
                            toast.add(data.message, 'check-round', false);
                            dispatch({ type: "@@customForms/SET_VIEW_TYPE", payload: "list-view" });
                            dispatch({ type: '@@customForms/SET_FORM_EDITABLE', payload: false });
                            dispatch({ type: '@@customForms/FETCH_TRIGGER_EVENTS_BY_ID_SUCCESS', payload: rowData });
                            dispatch({ type: '@@customForms/SET_TRIGGER_EVENTS_LIST', payload: []})
                            history.push('/')
                        }
                    }
                    throw data.message;
                  } catch (errorMessage) {
                    toast.add( typeof errorMessage === 'string' ? errorMessage === "Some issue encountered in server" ? dynamicLabels.formAlreadyExistForUserGroup : errorMessage : dynamicLabels.somethingWendWrong, '', false);
                  }
            }
        }
    }

    return (
        isFormLoading || sectionKeys.length === 0 ? (
            <div ref={loaderRef}>
              <FormLoader />
            </div>
          ) :
        <>
            {sectionKeys.length > 0 &&
                sectionKeys.map((sectionName) => (
                    sectionName === 'triggerEvents' ?
                        <TriggerEvents key={sectionName} sectionName={sectionName} AddTriggerEvents={AddTriggerEvents} triggerEventsList={triggerEventsList} DeleteAddTriggerEvent={DeleteAddTriggerEvent} formInstance={formInstance} structure={structure} />
                    : sectionName === 'designForm' ?
                        <DesignForm key={sectionName} sectionName={sectionName} cloneFieldType={cloneFieldType} addElement={addElement} handleFormFieldDrag={handleFormFieldDrag} currentField={currentField} formFields={formFields} setFormFields={setFormFields} setCurrentField={setCurrentField} handleSubmit={handleSubmit} saveForm={saveForm} watchAllFields={watchAllFields} setFieldActive={setFieldActive} handleDrag={handleDrag} pageName={'AddCustomForm'}/>
                    :   <FormFields key={sectionName} sectionName={sectionName} structure={structure} formInstance={formInstance} /> 
                ))
            }
        </>
    )
}
export default AddCustomForm;