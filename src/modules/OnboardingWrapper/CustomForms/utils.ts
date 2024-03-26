import { deepCopy } from "../../../utils/helper";
import { IMongoField } from "../../../utils/mongo/interfaces";
import { IConsentFormData } from "../PdpaConfig/Components/PdpaConfig.models";
import { ICurrentField, ICustomFormData, IFieldSettings, ITriggerEventsStructure } from "./CustomForms.models";

export const addTriggerEvent = (lastField: any, length?: number, isFormEditable?: boolean, id?: string, structure?:Record<string, IMongoField>) => {
    const currentTimeStamp = new Date().getTime();
    let newList = [];
    if (isFormEditable) {
        if ([structure].length > 0) {
            newList = [structure].map((field: any) => {
                let newField = {}
                if(!isEmpty(field)) {
                    let keys = Object.keys(field);
                     newField = {
                        [`orderType-${id}`]: { ...field[keys[0]], id: `orderType-${id}`, fieldName: `orderType-${id}`, labelKey: `orderType-${id}`, permission: true },
                        [`orderState-${id}`]: { ...field[keys[1]], id: `orderState-${id}`, fieldName: `orderState-${id}`, labelKey: `orderState-${id}`, permission: true },
                        [`orderLocation-${id}`]: { ...field[keys[2]], id: `orderLocation-${id}`, fieldName: `orderLocation-${id}`, labelKey: `orderLocation-${id}`, permission: true },
                        [`triggerElement-${id}`]: { ...field[keys[3]], id: `triggerElement-${id}`, fieldName: `triggerElement-${id}`, labelKey: `triggerElement-${id}`, permission: true },
                        [`isMandatory-${id}`]: { ...field[keys[4]], id: `isMandatory-${id}`, fieldName: `isMandatory-${id}`, labelKey: `isMandatory-${id}`, permission: true, value: 'Y' },
                        [`accountName-${id}`]: { ...field[keys[5]], id: `accountName-${id}`, fieldName: `accountName-${id}`, labelKey: `accountName-${id}`, permission: true },
                        [`serviceType-${id}`]: { ...field[keys[6]], id: `serviceType-${id}`, fieldName: `serviceType-${id}`, labelKey: `serviceType-${id}`, permission: true },
                        [`taskType-${id}`]: { ...field[keys[7]], id: `taskType-${id}`, fieldName: `taskType-${id}`, labelKey: `taskType-${id}`, permission: true },
                    };
                }
                return newField;
            });
        }
    } else {
        newList = lastField.map((field: any) => {
            let newField = {}
            if(!isEmpty(field)) {
             let keys = Object.keys(field);
             let lastIndex = keys[0].split("-")[1];
             newField = {
                [`orderType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[0]], id: `orderType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `orderType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `orderType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`orderState-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[1]], id: `orderState-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `orderState-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `orderState-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`orderLocation-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[2]], id: `orderLocation-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `orderLocation-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `orderLocation-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`triggerElement-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[3]], id: `triggerElement-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `triggerElement-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `triggerElement-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`isMandatory-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[4]], id: `isMandatory-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `isMandatory-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `isMandatory-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true, value: 'Y' },
                [`accountName-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[5]], id: `accountName-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `accountName-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `accountName-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`serviceType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[6]], id: `serviceType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `serviceType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `serviceType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
                [`taskType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`]: { ...field[keys[7]], id: `taskType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, fieldName: `taskType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, labelKey: `taskType-${Number(lastIndex) === length ? Number(lastIndex) + currentTimeStamp : length}`, permission: true },
            };
        }
            return newField;
        });
    }
    return newList;
}

export const toCamelCase = (str: string) => {
    if (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/[\s+.]/g, '');
    } else {
        return str;
    }
};

export const findPartialKeyName = (obj: ITriggerEventsStructure, partialKey: string) => {
    return Object.keys(obj).find((key) => key.includes(partialKey));
}


export const insert = (arr: Array<Record<string, string>>, index: number, newItem: Record<string, string>) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
];

export const ChangeFieldSetting = (Value: string, SettingName: string, idx: number, formFields: IFieldSettings[], setFormFields: Function) => {
    const currentField = deepCopy(formFields).find((field: IFieldSettings) => field.id === idx);
    const isMultipleTextInputs = currentField?.Settings?.length > 0 && currentField?.Settings?.filter(setting => setting.Type === "text")?.length > 1
    switch (SettingName) {
        case 'Field Label':
        case "Field Value":
            if (Value != "" && !Value && currentField) {
                Value = currentField?.Name;
            } 
            else if(currentField && isMultipleTextInputs) {
                const settings = currentField.Settings.find((setting: Record<string, string>) => setting.Name === SettingName)
                const settingIndex = currentField.Settings.indexOf(settings);
                const updatedSettings = { ...settings, Value: Value }
                const updatedField = { ...currentField, id: idx, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSettings], ...currentField.Settings.slice(settingIndex+1)] } }
                const oldFields = formFields.filter((field: IFieldSettings) => field.id !== idx);
                const updatedFormFields = oldFields.length > 0 ? [...[updatedField], ...oldFields] : [updatedField];
                setFormFields(updatedFormFields);
            }
            else if (currentField) {
                const updatedField = { ...currentField, Name: Value, Placeholder: Value }
                const oldFields = formFields.filter((field: IFieldSettings) => field.id !== idx);
                const updatedFormFields = oldFields.length > 0 ? [...oldFields, ...[updatedField]] : [updatedField];
                setFormFields(updatedFormFields);
            }
            break;
        case 'Validations':
            if (Value != "" && !Value && currentField) {
                Value = currentField?.Name;
            }
            else if (currentField) {
                const settings = currentField.Settings.find((setting: Record<string, string>) => setting.Name === SettingName)
                const settingIndex = currentField.Settings.indexOf(settings);
                const updatedOptions = settings?.Options.map((option: Record<string, string>) => { return { Name: option.Name, Value: !option.Value } })
                const updatedSettings = { ...settings, selected: !settings?.selected, ...{ Options: updatedOptions } }
                const updatedField = { ...currentField, id: idx, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSettings], ...currentField.Settings.slice(settingIndex+1)] } }

                const oldFields = formFields.filter((field: IFieldSettings) => field.id !== idx);
                const updatedFormFields = oldFields.length > 0 ? [...[updatedField], ...oldFields] : [updatedField];
                setFormFields(updatedFormFields);
            }

            break;
        case 'Min Character Length':
        case "Min Value":
            if (Value != "" && !Value && currentField) {
                Value = currentField?.Name;
            }
            else if (currentField) {
                const settings = currentField.Settings.find((setting: Record<string, string>) => setting.Name === SettingName)
                const settingIndex = currentField.Settings.indexOf(settings);
                const updatedSettings = { ...settings, Value: Number(Value) }
                const updatedField = { ...currentField, id: idx, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSettings], ...currentField.Settings.slice(settingIndex+1)] } }
                const oldFields = formFields.filter((field: IFieldSettings) => field.id !== idx);
                const updatedFormFields = oldFields.length > 0 ? [...[updatedField], ...oldFields] : [updatedField];
                setFormFields(updatedFormFields);
            }

            break;
        case 'Max Character Length':
        case 'Max Value':
            if (Value != "" && !Value && currentField) {
                Value = currentField?.Name;
            }
            else if (currentField) {
                const settings = currentField.Settings.find((setting: Record<string, string>) => setting.Name === SettingName)
                const settingIndex = currentField.Settings.indexOf(settings);
                const updatedSettings = { ...settings, Value: Number(Value) }
                const updatedField = { ...currentField, id: idx, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSettings], ...currentField.Settings.slice(settingIndex+1)] } }
                const oldFields = formFields.filter((field: IFieldSettings) => field.id !== idx);
                const updatedFormFields = oldFields.length > 0 ? [...oldFields, ...[updatedField]] : [updatedField];
                setFormFields(updatedFormFields);
            }
            break;
        default:
            null;
    }
};

export const addNewOption = (id: number, formFields: IFieldSettings[], setFormFields: Function) => {
    const currentField = deepCopy(formFields).find((field: IFieldSettings) => field.id === id);
    const unselectedFields = deepCopy(formFields).filter((field: IFieldSettings) => field.id !== id);
    if (currentField && Object.keys(currentField).length > 0) {
        const setting = currentField?.Settings.find((setting: Record<string, string>) => setting.Name === 'Options');
        const settingIndex = currentField.Settings.indexOf(setting);
        const options = setting.Options;
        const updatedOptions = [...options, ...[{ label: "Options" + parseInt(options.length + 1), value: "Options" + parseInt(options.length + 1) }]]
        const updatedSetting = { ...setting, ...{ Options: updatedOptions } }
        const updatedField = { ...currentField, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSetting], ...currentField.Settings.slice(settingIndex+1)] } }

        setFormFields([...unselectedFields, ...[updatedField]]);
    }
}

export const removeOption = (id: number, index: number, formFields: IFieldSettings[], setFormFields: Function) => {
    const currentField = deepCopy(formFields).find((field: IFieldSettings) => field.id === id);
    const unselectedFields = deepCopy(formFields).filter((field: IFieldSettings) => field.id !== id);
    if (currentField && Object.keys(currentField).length > 0) {
        const setting = currentField?.Settings.find((setting: Record<string, string>) => setting.Name === 'Options');
        const settingIndex = currentField.Settings.indexOf(setting);
        const options = setting.Options;
        const updatedOptions = options.filter((option: Record<string, string>) => options.indexOf(option) !== index);
        const updatedSetting = { ...setting, ...{ Options: updatedOptions } }
        const updatedField = { ...currentField, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSetting], ...currentField.Settings.slice(settingIndex+1)] } }

        setFormFields([...unselectedFields, ...[updatedField]]);
    }
}

export const updateOption = (id: number, idx: number, value: string, formFields: IFieldSettings[], setFormFields: Function) => {
    const currentField = deepCopy(formFields).find((field: IFieldSettings) => field.id === id);
    const unselectedFields = deepCopy(formFields).filter((field: IFieldSettings) => field.id !== id);
    if (currentField && Object.keys(currentField).length > 0) {
        const setting = currentField?.Settings.find((setting: Record<string, string>) => setting.Name === 'Options');
        const settingIndex = currentField.Settings.indexOf(setting);

        const options = setting.Options.filter((option: Record<string, string>) => setting.Options.indexOf(option) !== idx);
        const updatedOptions = insert(options, idx, { label: value, value: value });
        const updatedSetting = { ...setting, ...{ Options: updatedOptions } }
        const updatedField = { ...currentField, ...{ Settings: [...currentField.Settings.slice(0, settingIndex), ...[updatedSetting], ...currentField.Settings.slice(settingIndex+1)] } }
        
        setFormFields([...unselectedFields, ...[updatedField]]);
    }
}


const createNewField = (formFields: IFieldSettings[]) => {
    return {
        'id': formFields.length + 1,
        'Name': '',
        'Settings': [],
        'Active': true
    };
}

export const addElement = (ele: IFieldSettings, currentField: ICurrentField, formFields: IFieldSettings[], setFormFields: Function, setCurrentField: Function, idx?: number) => {
    let currentFieldClone = deepCopy(currentField);
    currentFieldClone['Active'] = false;
    currentFieldClone['selected'] = true;
    if (formFields.length > 0) {
        let prevField = formFields[formFields.length - 1];
        prevField["Active"] = false;
        prevField["selected"] = true;
        let newUpdateFields = [...formFields, ...[prevField]];
        setFormFields(newUpdateFields)
    }
    let newCurrentField = createNewField(formFields);
    setCurrentField(newCurrentField);

    //Merge setting from template object
    let newField = { ...currentField, ...ele, Active: true, id: formFields.length + 1, fieldSequence: formFields.length + 1 }
    if (typeof idx == 'undefined') {
        let newFields = [...formFields, ...[newField]];
        setFormFields(newFields)
    } else {
        setFormFields(formFields.splice(idx, 0, newField))
    }
};

export const removeField = (id: number, formFields: IFieldSettings[], setCurrentField: Function, setFormFields: Function) => {
    const filteredFields = formFields.filter((field) => field.id !== id);
    let newCurrentField = { Active: true, Name: "", Settings: [], id: id === 1 ? 1 : id - 1, fieldSequence: id === 1 ? 1 : id - 1 }
    setCurrentField(newCurrentField);
    if (filteredFields.length > 0) {
        const updatedFields = filteredFields.map((field, index) => {
            if (index === filteredFields.length - 1) {
                return { ...field, 'Active': true }
            } else {
                return { ...field, 'Active': false }

            }
        });
        setFormFields(updatedFields);
    } else {
        setFormFields(filteredFields);
    }
}

export const addFormFields = (customFormData: ICustomFormData, fieldSettings: IFieldSettings[], setCurrentField: Function, setFormFields: Function) => {

    const fields = Object.keys(customFormData.structure['general details']).map((field, index) => {
        const fieldObj = customFormData.structure['general details'][field];
        let obj = {};
        let fieldLabel = {};
        let validations = {};
        let minChar = {};
        let maxChar = {};
        let options = {};
        const settings: Array<Record<string, any>> = [];
        const validationInputs = ['date', 'time', 'geocode', 'phone_number', 'epod'];
        let fieldSequenceObj = fieldSettings.find((value) => value.Type === fieldObj.fieldType);
        if (fieldObj?.fieldType === "dropdown" || fieldObj?.fieldType === "checkbox" || fieldObj?.fieldType === "radioGroup") {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" };
            options = { Name: "Options", Type: "dropdown_increment", Options: Object.keys(fieldObj['dropdownValues']).map((option: string) => { return { label: fieldObj['dropdownValues'][option], value: fieldObj['dropdownValues'][option] } }) }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            settings.push(fieldLabel, options, validations)
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.structure['general details']).length === index + 1 ? true : false }
        } else if (validationInputs.includes(fieldObj?.fieldType)) {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            settings.push(fieldLabel, validations);
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.structure['general details']).length === index + 1 ? true : false }
        } else {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            if (fieldObj.fieldType === "perc_number" || fieldObj.fieldType === "decimal_number" || fieldObj.fieldType === "number") {
                minChar = { Name: "Min Value", Value: Number(fieldObj.validation?.min?.args), Type: "minVal" }
                maxChar = { Name: "Max Value", Value: Number(fieldObj.validation?.max?.args), Type: "maxVal" }
            } else if (fieldObj.fieldType === "email" || fieldObj.fieldType === "text") {
                minChar = { Name: "Min Character Length", Value: Number(fieldObj.validation?.minlength?.args), Type: "min" }
                maxChar = { Name: "Max Character Length", Value: Number(fieldObj.validation?.maxlength?.args), Type: "max" }
            }
            settings.push(fieldLabel, validations, minChar, maxChar);
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.structure['general details']).length === index + 1 ? true : false }
        }
        return obj;
    });

    const formFields: IFieldSettings[] = deepCopy(fields);
    let lastField = { ...formFields[formFields.length - 1] };
    if (lastField) {
        let newCurrentField = { Active: true, Name: lastField.Name, Settings: [], id: lastField.id }
        setCurrentField(newCurrentField);
    }
    setFormFields(formFields);
}

export const addElementConsent = (ele: IFieldSettings, currentField: ICurrentField, formFields: IFieldSettings[], setFormFields: Function, setCurrentField: Function, idx?: number) => {
    let newCurrentField = createNewField(formFields);
    setCurrentField(newCurrentField);

    let newField = { ...currentField, ...ele, Active: true, id: formFields.length + 1, fieldSequence: formFields.length + 1 }
    const updatedFields = formFields.map((field) => {return { ...field, Active: false }});
    let newFormFields = [...updatedFields, ...[newField]];
    setFormFields(newFormFields)
};

export const removeFieldConsent = (id: number, formFields: IFieldSettings[], setCurrentField: Function, setFormFields: Function) => {
    const filteredFields = formFields.filter((field) => field.id !== id);
    let newCurrentField = { Active: true, Name: "", Settings: [], id: filteredFields.length, fieldSequence: filteredFields.length }
    setCurrentField(newCurrentField);
    if (filteredFields.length > 0) {
        const updatedFields = filteredFields.map((field, index) => {
            if (index === filteredFields.length - 1) {
                return { ...field, id: index + 1, fieldSequence: index + 1, Active: true }
            } else {
                return { ...field, id: index + 1, fieldSequence: index + 1, Active: false }
            }
        });
        setFormFields(updatedFields);
    } else {
        setFormFields(filteredFields);
    }
}

export const addFormFieldsconset = (customFormData: IConsentFormData, fieldSettings: IFieldSettings[], setCurrentField: Function, setFormFields: Function) => {
    const fields = Object.keys(customFormData?.customFormStructure['general details'])?.map((field, index) => {
        const fieldObj = customFormData?.customFormStructure['general details'][field];
        let obj = {};
        let fieldLabel = {};
        let fieldValue= {};
        let validations = {};
        let minChar = {};
        let maxChar = {};
        let options = {};
        const settings: Array<Record<string, any>> = [];
        const validationInputs = ['date', 'time', 'geocode', 'phone_number', 'epod'];
        let fieldSequenceObj = fieldSettings.find((value) => value.Type === fieldObj.fieldType);
        if (fieldObj?.fieldType === "dropdown" || fieldObj?.fieldType === "checkbox" || fieldObj?.fieldType === "radioGroup") {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" };
            options = { Name: "Options", Type: "dropdown_increment", Options: fieldObj['dropdownValues'] && Object.keys(fieldObj['dropdownValues']).map((option: string) => { return { label: fieldObj['dropdownValues'][option], value: fieldObj['dropdownValues'][option] } }) }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            settings.push(fieldLabel, options, validations)
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.customFormStructure['general details']).length === index + 1 ? true : false }
        } else if (validationInputs?.includes(fieldObj?.fieldType)) {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            settings.push(fieldLabel, validations);
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.customFormStructure['general details']).length === index + 1 ? true : false }
        } else if(fieldObj?.fieldType === "TextArea") {
            fieldLabel = { Name: "Field Label", Value: fieldObj.fieldName, Type: "text" }
            fieldValue = { Name: "Field Value", Value: fieldObj.label, Type: "text" }
            settings.push(fieldLabel,fieldValue);
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.fieldType, Placeholder: fieldObj.fieldType, Active: Object.keys(customFormData.customFormStructure['general details']).length === index + 1 ? true : false }
        } else {
            fieldLabel = { Name: "Field Label", Value: fieldObj.label, Type: "text" }
            validations = { Name: "Validations", Type: "radioZone", selected: fieldObj.required, Options: [{ Name: "Mandatory", Value: fieldObj.required }, { Name: "Not Mandatory", Value: fieldObj.required ? false : true }] };
            if (fieldObj.fieldType === "perc_number" || fieldObj.fieldType === "decimal_number" || fieldObj.fieldType === "number") {
                minChar = { Name: "Min Value", Value: Number(fieldObj.validation?.min?.args), Type: "minVal" }
                maxChar = { Name: "Max Value", Value: Number(fieldObj.validation?.max?.args), Type: "maxVal" }
            } else if (fieldObj.fieldType === "email" || fieldObj.fieldType === "text") {
                minChar = { Name: "Min Character Length", Value: Number(fieldObj.validation?.minlength?.args), Type: "min" }
                maxChar = { Name: "Max Character Length", Value: Number(fieldObj.validation?.maxlength?.args), Type: "max" }
            }
            settings.push(fieldLabel, validations, minChar, maxChar);
            obj = { ...fieldSequenceObj, id: index + 1, fieldSequence: Number(fieldObj['fieldSequence']), Settings: settings, Name: fieldObj.label, Placeholder: fieldObj.label, Active: Object.keys(customFormData.customFormStructure['general details']).length === index + 1 ? true : false }
        }
        return obj;
    });

    const formFields: IFieldSettings[] = deepCopy(fields);
    let lastField = { ...formFields[formFields.length - 1] };
    if (lastField) {
        let newCurrentField = { Active: true, Name: lastField.Name, Settings: [], id: lastField.id }
        setCurrentField(newCurrentField);
    }
    setFormFields(formFields);
}
export const isEmpty = (obj: object) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}