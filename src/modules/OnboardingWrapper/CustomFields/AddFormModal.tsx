import React, { useState } from 'react'
import { Box, Modal, ModalHeader, MultiSelect , FontIcon , tMultiSelectChildren} from 'ui-library'
import {AddEditCont , CustomDropDown , DuplicateCont} from './CustomFieldsCss';
import {TextInput , Toggle , DropDown , IconButton, useToast } from 'ui-library'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { sendGA } from '../../../utils/ga';
import {DraggableComponent} from '../../../utils/components/Draggable/DraggableComponent'

interface IAddFormModal {
    isShowModal: boolean
    dynamicLabels: Record<string, string>
    setShowAddModal: (value: boolean) => void,
    moduleList: any
    fieldTypesList: any
    fieldData: any
    onClose?: () => void
}

const AddFormModal = ({ isShowModal, dynamicLabels , moduleList, fieldTypesList , fieldData ,setShowAddModal ,  onClose = () => { }}: IAddFormModal) => {
const toast = useToast()
const [daTypes, setDaTypes] = useState<{ value: string, label: string }[] | undefined>(undefined)
const [selectedFieldType, setSelectedFieldType] = useState('text');
const [dropdownValues, setDropdownValues] = useState([ 
    { id: "1", name: "Dropdown Value 1" } ,  { id: "2", name: "Dropdown Value 2" } ])
const [errorObject, setErrorObject] = useState({errorLabel : "" , errorIdType:"" , errorInfotip:"" ,errorMinmaxLength:"" ,errorMinmax:""})
const [customObj, setCustomObj] = useState({})
const [confirmSaveRequest , setConfirmSaveRequest] = useState(false)
const [disableSaveBtn , setDisableSaveBtn] = useState(true)
let isInvalid = {};



const deleteClickVal = (key :number) => {
    let dummy  = [...dropdownValues]
    dummy.splice(key, 1);
    setDropdownValues(dummy)
}
const addClickVal = () => {
    let dummy  = [...dropdownValues]
    let emptyExist = false
    dummy.map((val) => {
        if(val.name === ""){
            emptyExist = true;
            toast.add("Please fill already existing empty dropdown value(s) before adding a new one", 'warning', false)
        }
    })
    if(!emptyExist){
        dummy.push({id : (dropdownValues.length + 1).toString() , name : ""})
    }
    setDropdownValues(dummy)
}
/** validate fields */
const validateFields = (validationType : string) => {
    if (validationType == "minmax") {
        if (fieldData['fieldType'] == "number") {
            if (fieldData['minValue'] == null || fieldData['minValue'] == undefined) {
                isInvalid['minmax'] = "Minimum Value is mandatory";
            } else if (fieldData['maxValue'] == null || fieldData['maxValue'] == undefined) {
                isInvalid['minmax'] = "Maximum Value is mandatory";
            } else if (!fieldData['required'] && fieldData['minValue'] < 0) {
                isInvalid['minmax'] = "Minimum Value cannot be less than 0";
            } else if (fieldData['required'] && fieldData['minValue'] < 0) {
                isInvalid['minmax'] = "Minimum Value cannot be less than 0";
            } else if (fieldData['maxValue'] < 0) {
                isInvalid['minmax'] = "Maximum Value cannot be less than 0";
            } else if (fieldData['minValue'] && fieldData['maxValue'] && (fieldData['minValue'] >= fieldData['maxValue'])) {
                isInvalid['minmax'] = "Maximum Value cannot be same or less than min";
            }
        } else {
            isInvalid['minmax'] = false;
        }
        setErrorObject({...errorObject ,  errorMinmax : isInvalid['minmax'] ? isInvalid['minmax'] : ""})
    }

    if (validationType == "minmaxLength") {
        if (fieldData['fieldType'] == "text") {
            if (fieldData['minLength'] == null || fieldData['minLength'] == undefined) {
                isInvalid['minmaxLength'] = "Minimum Character Limit is mandatory";
            } else if (fieldData['maxLength'] == null || fieldData['maxLength'] == undefined) {
                isInvalid['minmaxLength'] = "Maximum Character Limit is mandatory";
            } else if (!fieldData['required'] && fieldData['minLength'] < 0) {
                isInvalid['minmaxLength'] = dynamicLabels.minimumCharLimitCannotBeLessThan + " 0";
            } else if (fieldData['required'] && fieldData['minLength'] < 1) {
                isInvalid['minmaxLength'] = dynamicLabels.minimumCharLimitCannotBeLessThan + " 1";
            } else if (fieldData['maxLength'] < 0) {
                isInvalid['minmaxLength'] = dynamicLabels.maximumCharLimitCannotBeLessThan + " 0";
            } else if (fieldData['minLength'] && fieldData['maxLength'] && (fieldData['minLength'] >= fieldData['maxLength'])) {
                isInvalid['minmaxLength'] = "Maximum Character Limit cannot be same or less than Minimum Character Limit";
            }
        } else {
            isInvalid['minmaxLength'] = false;
        }
        setErrorObject({...errorObject ,  errorMinmaxLength : isInvalid['minmaxLength'] ? isInvalid['minmaxLength'] : ""})
    }
    if (validationType == "infotip") {
        if (fieldData['infoTool'] && fieldData['infoTool'][0] && fieldData['infoTool'][0]['message'] && fieldData['infoTool'][0]['message'].length) {
            var msg = fieldData['infoTool'][0]['message']
            if (!(/^[a-zA-Z0-9_@., ]*$/.test(msg))) {
                isInvalid['infotip'] = dynamicLabels.infotipShouldBeAlphanumeric;
            }
        }
        setErrorObject({...errorObject ,  errorInfotip : isInvalid['infotip'] ?  isInvalid['infotip'] : ""})
    }
    if (validationType == "label") {
        if (fieldData && fieldData['customFieldTypeModel'] && fieldData['customFieldTypeModel']['label'] && fieldData['customFieldTypeModel']['label'].length) {
            if (!(/^[a-zA-Z0-9_@., ]*$/.test(fieldData['customFieldTypeModel']['label']))) {
                isInvalid['label'] = dynamicLabels.labelShouldBeAlphanumeric;
            }
        }else{
            isInvalid['label'] = dynamicLabels.fieldNameMandatory;
        }
        setErrorObject({...errorObject ,  errorLabel : isInvalid['label'] ?  isInvalid['label'] : ""})
    }
    if (validationType == 'id') {
        if (fieldData['id'] && fieldData['id'].length) {
            if (!(/^[a-zA-Z_]*$/.test(fieldData['id']))) {
                isInvalid['id'] = dynamicLabels.fieldCannotHaveSpaces;
            }
        } else {
            isInvalid['id'] = dynamicLabels.fieldKeyMandatory;
        }
        setErrorObject({...errorObject ,  errorIdType : isInvalid['id'] ? isInvalid['id'] : ""})
    }
    if(validationType == ""){
        setErrorObject({errorLabel : "" , errorIdType:"" , errorInfotip: "" ,errorMinmaxLength: "" ,errorMinmax: ""})
        setDisableSaveBtn(false)
    }
}


/** Add validation to the object */
const setFieldValidationMessages = (field : any) => {

        field['validation'] = {};

    if (!field['validation']['required']) {
        field['validation']['required'] = {};
    }
    if (!field['validation']['minlength']) {
        field['validation']['minlength'] = {};
    }
    if (!field['validation']['maxlength']) {
        field['validation']['maxlength'] = {};
    }
    if (!field['validation']['min']) {
        field['validation']['min'] = {};
    }
    if (!field['validation']['max']) {
        field['validation']['max'] = {};
    }
    if (field['required'] && field['validation']['required']) {
        field['validation']['required'] = {
            "message": field['customFieldTypeModel']['label'] + " is mandatory."
        }
    }
    if (field['minLength'] !== undefined && field['validation']['minlength']) {
        field['validation']['minlength'] = {
            "message": field['customFieldTypeModel']['label'] + " length must be more than " + field['minLength'] + " characters."
        }
    }
    if (field['maxLength'] !== undefined && field['validation']['maxlength']) {
        field['validation']['maxlength'] = {
            "message": field['customFieldTypeModel']['label'] + " length must be less than " + field['maxLength'] + " characters."
        }
    }

    if (field['minValue'] !== undefined && field['validation']['min']) {
        field['validation']['min'] = {
            "message": field['customFieldTypeModel']['label'] + "  must be greater than " + field['minValue']
        }
    }
    if (field['maxValue'] !== undefined && field['validation']['max']) {
        field['validation']['max'] = {
            "message": field['customFieldTypeModel']['label'] + "  must be less than " + field['maxValue']
        }
    }
    setCustomObj(fieldData);
}
const saveField = async () => {
    console.log(dropdownValues , "--" )
        let invalidValue = false;
        if(customObj){
           removeKeyFromObj('mode' , customObj)
        }
        customObj['fieldType'] = customObj['fieldType'].toLowerCase();
        if (customObj['id'] && customObj['id'].indexOf("cf_") < 0) {
            let str = customObj['id']
            str = str.trim();
            str = "cf_" + str;
            customObj['id'] = str;
        } 
        // else if(customObj && customObj['customFieldTypeModel'] && customObj['customFieldTypeModel']['id']){
        //     customObj['id'] = customObj['customFieldTypeModel']['id'].trim();
        // }
        if (customObj['customFieldTypeModel']['label']) {
            customObj['label'] = customObj['customFieldTypeModel']['label'];
        }
        

        let attachedWithModulesArray: any = [];
        if (daTypes) {
            customObj['attachedWithModules'] = []
            daTypes.map((eachModule , index) => {
                attachedWithModulesArray.push(eachModule['value']);
                let obj = {
                    id: index + 1,
                    label: eachModule['label'],
                    name: eachModule['label'],
                    value: eachModule['value']
                }
                customObj['attachedWithModules'].push(obj)
            })
        }

        if (dropdownValues && customObj['fieldType'] == "radio"){
            let saveObj : any = []
            dropdownValues.map((value : any) => {
                saveObj.push(value.name)
            })    
            customObj['options'] = saveObj;   
        }

        if (dropdownValues && (customObj['fieldType'] == "dropdown" || customObj['fieldType'] == "multiselect")) {
            let savedropdown : any = [];
            dropdownValues.map((value : any) => {
                savedropdown.push(value?.name)
                if (!invalidValue) {
                    if (!value?.name || !(/^[a-zA-Z0-9_@, ]*$/.test(value.name))) {
                        invalidValue = true;
                    }
                }
            })

            if (invalidValue) {
                toast.add(dynamicLabels.dropdownValuesMandatoryAlphanumeric, 'warning', false)
                setConfirmSaveRequest(false)
            }
            if(!invalidValue){
                customObj['dropdownValues'] = savedropdown
            }
        }else{
            removeKeyFromObj('dropdownValues' , customObj)
        }
        
        customObj['minLength'] ?  customObj['minLength'] = parseInt(customObj['minLength']) : 0
        customObj['maxLength'] ? customObj['maxLength'] =  parseInt(customObj['maxLength']) : 255
        customObj['minValue'] ?  customObj['minValue'] = parseInt(customObj['minValue']) : 0
        customObj['maxValue'] ? customObj['maxValue'] =  parseInt(customObj['maxValue']) : 255

        if (customObj['infoTool'] && customObj['infoTool'][0] && customObj['infoTool'][0]['message']) {
            customObj['infoFlag'] = true;
        }
        customObj['customField'] = true;
        if(customObj){
            removeKeyFromObj('mode' , customObj)

            fieldTypesList.map((field : any) => {
                if(field['clientRefMasterCd'] == customObj['fieldType']){
                    customObj['customFieldTypeModel']['id'] = field['id']  
                }
            })
         }
        let customFieldDTO = {
            "attachedWithModules": attachedWithModulesArray,
            "customFieldName": customObj['customFieldTypeModel']['label'],
            "customFieldId": customObj['id'],
            "customFieldType": customObj['fieldType'],
            "customFieldData": customObj
        }
        let payLoad = customFieldDTO
        if(!invalidValue){
                const { data: { message, status , hasError } } = await axios.post(apiMappings.customFields.listView.saveCustomFields , payLoad)
                if (status === 200 && !hasError) {
                  toast.add(message, 'check-round', false)
                  setShowAddModal(false);
                  setConfirmSaveRequest(false);
                  sendGA('Form and List Builder','Create Custom field - SAVE')
                  onClose()
                  handleClosePopup()
                  return
                }else if (hasError) {
                    toast.add(message , 'error', false)
                    setSelectedFieldType('text')
                }
              
        }


}
const removeKeyFromObj = (keyVal : string , fieldObj : any) => {
    delete fieldObj[keyVal] 
}
const handleClosePopup = () => {
    setShowAddModal(false)
    setDropdownValues([{ id: "1", name: "Dropdown Value 1" } ,  { id: "2", name: "Dropdown Value 2" }])
    setErrorObject({errorLabel : "" , errorIdType:"" , errorInfotip: "" ,errorMinmaxLength: "" ,errorMinmax: ""})
    setDaTypes([])
    setSelectedFieldType('text')
    setDisableSaveBtn(true)

}


    return <Modal
        open={isShowModal}
        onToggle={() => {}}
        width='500px'
        children={{
            header: (
                <ModalHeader
                    headerTitle= {fieldData && fieldData.mode ? fieldData.mode : undefined}
                    handleClose={() => handleClosePopup()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <AddEditCont>
                    <Box className="add-edit-modal-cont" id="add-edit-modal-cont">
                       <div className="section-title">
                            {dynamicLabels.fieldProperties}
                        </div>
                        <div className="row" style={{marginBottom: '15px'}}>
                            <span className="col-md-5  labelUnderlineWrapper"><div className="labelUnderline"></div></span>
                            <span className="col-md-7  labelLineWrapper"><div className="labelLine"></div></span>
                        </div>
                        <Box className="form-cont">
                        {/* Field label */}
                        <TextInput
                            id='field_label'
                            label= {dynamicLabels.fieldName}
                            fullWidth={true}
                            disabled={false}
                            required={true}
                            placeholder={dynamicLabels.fieldName}
                            maxLength={255}
                            error={false}
                            onChange={(e :  any) => {
                                fieldData.customFieldTypeModel['label'] = e.target.value
                                fieldData['customFieldTypeModel']['name'] = e.target.value
                                setCustomObj(fieldData)
                                
                                e.target.value ==  "" || fieldData['id'] === undefined || fieldData['id'] == "" ? setDisableSaveBtn(true) : setDisableSaveBtn(false)
                            }}
                            onBlur={() => {
                                validateFields('label')
                            }}
                            />
                        { errorObject  && errorObject['errorLabel'] ?  <div className="col-md-12 col-sm-12 col-lg-12" style={{paddingLeft : '0px'}} ><p className="error-label">{errorObject['errorLabel']}</p></div> : "" }

                        {/* Field key */}
                        <DuplicateCont>
                        <Box className="field_input">
                        <span title="Custom Field prefix" className="cf_prefix cf_span">cf_</span>
                        <TextInput
                            id='field_key'
                            label= {dynamicLabels.customFieldKey}
                            fullWidth={true}
                            disabled={false}
                            required={true}
                            placeholder={dynamicLabels.customFieldKey}
                            maxLength={255}
                            error={false}
                            style={{ paddingLeft: '40px' }}
                            onChange={(e :  any) => {
                                fieldData['id'] = e.target.value
                                setCustomObj(fieldData)
                                fieldData['customFieldTypeModel']['name'] == "" || e.target.value == "" ? setDisableSaveBtn(true) : setDisableSaveBtn(false)
                            }}
                            onBlur={() => {
                                validateFields('id')
                            }}
                            />
                        </Box>
                        { errorObject && errorObject['errorIdType']  ?  <div className="col-md-12 col-sm-12 col-lg-12" style={{paddingLeft : '0px'}} ><p className="error-label">{errorObject['errorIdType']}</p></div> : "" }
                        </DuplicateCont>   

                        {/* Field Infotip */}
                        <TextInput
                            id='field_key'
                            label= {dynamicLabels.fieldInfotip}
                            fullWidth={true}
                            disabled={false}
                            required={false}
                            placeholder={"Enter " + dynamicLabels.fieldInfotip}
                            maxLength={255}
                            error={false}
                            onChange={(e :  any) => {
                                if(e.target.value !== ""){
                                    let infoTool  = [{message: e.target.value}]
                                    fieldData['infoTool'] = infoTool
                                    setCustomObj(fieldData)
                                }
                            }}
                            onBlur={() => {
                                validateFields('infotip')
                            }}
                            />
                       { errorObject && errorObject['errorInfotip']  ?  <div className="col-md-12 col-sm-12 col-lg-12" style={{paddingLeft : '0px'}} ><p className="error-label">{errorObject['errorInfotip']}</p></div> : "" }
                        {/* Field multiSelect */}
                        <Box className="multi-select"> <MultiSelect
                                    options={moduleList}
                                    onChange={(_event, _value, _isSelected, selectedOption: any) => setDaTypes(selectedOption)}
                                    style={{
                                        position: 'absolute',
                                        top: 'auto',
                                        left: 'auto',
                                        marginTop: '-18px',
                                        width: '45%',
                                        zIndex: 100000

                                    }}
                                    maximumSelected={10}
                                    menuOpen={false}
                                    selected={daTypes}
                                    allowSelectAll={false}
                                    searchableKeys={['label']}
                                    isLoading={false}

                                >
                                    {({ optionSelected, isMenuOpen, openMenu }: tMultiSelectChildren) => (
                                        <>
                                            <TextInput
                                                id='skill-set'
                                                className='multiselct'
                                                label={dynamicLabels?.attachWithModules || 'Attact with Module(s)'}
                                                labelColor='black'
                                                placeholder='Select'
                                                onClick={() => {
                                                    openMenu(!isMenuOpen)
                                                }}
                                                style={{
                                                    position: 'relative',
                                                }}
                                                value={
                                                    optionSelected && optionSelected?.length > 0
                                                        ? optionSelected?.length + ' Selected'
                                                        : 'Select'
                                                }
                                                fullWidth
                                                read-only

                                            />
                                            <span style={{position:'absolute',right:'2%',top:'40%'}}
                                                onClick={() => {
                                                    openMenu(!isMenuOpen)
                                                }}>
                                                <FontIcon variant='triangle-down' size={8} />
                                            </span>
                                        </>
                                    )}

                                </MultiSelect> </Box>

                            {/* field validations */}
                            <div className="section-title">
                                {dynamicLabels.fieldValidations}
                            </div>
                            <div className="row" style={{marginBottom: '15px'}}>
                                <span className="col-md-5  labelUnderlineWrapper"><div className="labelUnderline"></div></span>
                                <span className="col-md-7  labelLineWrapper"><div className="labelLine"></div></span>
                            </div>
                            <Box className="valid-cont">
                             {/* field toggle */} 
                             <Box  style={{marginBottom: '30px'}}><Toggle
                                checked={fieldData.required}
                                label={dynamicLabels.mandatory}
                                style={{fontSize: '14px'}}
                                onChange={() => {
                                    fieldData.required = !fieldData.required
                                    setCustomObj(fieldData)
                                    setFieldValidationMessages(fieldData)
                                    selectedFieldType === 'text' ? validateFields('minmaxLength') : validateFields('minmax')
                                }}
                             /></Box>
                              {/* field fieldType */} 
                            <div className='div-width'>
                                <DropDown
                                    variant='form-select'
                                    id='fieldType'
                                    optionList={fieldTypesList}
                                    label={dynamicLabels?.fieldType || 'Field Type'}
                                    onChange={(value: string) => {
                                        setSelectedFieldType(value); 
                                        fieldData['fieldType'] = value
                                        fieldData['customFieldTypeModel']['value'] = value
                                        fieldData['customFieldTypeModel']['id'] = value
                                        setCustomObj(fieldData)
                                        setFieldValidationMessages(fieldData)
                                        setDropdownValues([{ id: "1", name: "Dropdown Value 1" } ,  { id: "2", name: "Dropdown Value 2" }])
                                        if(value == 'radio') {setDropdownValues([{ id: "1", name: "Yes" } ,  { id: "2", name: "No" }])}
                                        value ? validateFields('') : setDisableSaveBtn(true)
                                    }
                                    }
                                        placeholder='text'
                                        value={selectedFieldType}
                                        required={true}
                                />
                            </div>                    
                            </Box>
                        </Box>
                       { (selectedFieldType === 'text' || selectedFieldType === 'number') ?
                       <Box className="min-max-cont">
                            {/* Field Infotip */}
                        <Box  style={{flex: '1'}} ><TextInput
                            id='field_key'
                            label= { selectedFieldType === 'number' ? dynamicLabels.minimumValue : dynamicLabels.minimumCharacterLimit}
                            fullWidth={true}
                            disabled={false}
                            required={true}
                            placeholder={selectedFieldType === 'number' ? dynamicLabels.minimumValue : dynamicLabels.minimumCharacterLimit}
                            maxLength={255}
                            error={false}
                            style={{width: '95%'}}
                            defaultValue={fieldData.minLength}
                            onChange={(e : any) => {
                                let minVal = e.target.value !== "" ? parseInt(e.target.value) : null
                                selectedFieldType === 'text' ? fieldData.minLength = minVal : fieldData.minValue = minVal
                                setCustomObj(fieldData)
                                setFieldValidationMessages(fieldData)
                            }}
                            onBlur={() => {
                                selectedFieldType === 'text' ? validateFields('minmaxLength') : validateFields('minmax') 
                            }}
                            />
                            </Box>                          
                        <Box  style={{flex: '1'}}><TextInput
                            id='field_key'
                            label= {selectedFieldType === 'number' ? dynamicLabels.maximumValue : dynamicLabels.maximumCharacterLimit}
                            fullWidth={true}
                            disabled={false}
                            required={true}
                            placeholder={selectedFieldType === 'number' ? dynamicLabels.maximumValue : dynamicLabels.maximumCharacterLimit}
                            defaultValue={fieldData.maxLength}
                            error={false}
                            onChange={(e : any) => {
                                let maxVal = e.target.value !== "" ? parseInt(e.target.value) : null
                                selectedFieldType === 'text' ? fieldData.maxLength = maxVal : fieldData.maxValue = maxVal
                                setCustomObj(fieldData)
                                setFieldValidationMessages(fieldData)
                            }}
                            onBlur={() => {
                                selectedFieldType === 'text' ? validateFields('minmaxLength') : validateFields('minmax') 
                            }}
                            />
                            </Box> 
                        </Box>                    
                        : undefined 
                        }
                        {selectedFieldType === 'number' && errorObject && errorObject['errorMinmax']  ?  <div className="col-md-12 col-sm-12 col-lg-12" style={{paddingLeft : '0px'}} ><p className="error-label">{errorObject['errorMinmax']}</p></div> : "" }
                        {selectedFieldType === 'text' && errorObject && errorObject['errorMinmaxLength']  ? <div className="col-md-12 col-sm-12 col-lg-12" style={{paddingLeft : '0px'}} ><p className="error-label">{errorObject['errorMinmaxLength'] }</p></div> : ""  }
                        <CustomDropDown>
                        {   (selectedFieldType === 'multiselect' || selectedFieldType === 'dropdown') ? 
                        <div className='row field-validation-cont'>
                                <label className="dropdownValuesLabel section-label">{dynamicLabels.dropdownValues}</label>
                              
                                <div className="col-md-12 col-sm-12 col-lg-12 dropdown-container" >
                                <DraggableComponent
                                        sort={true}
                                        list={dropdownValues}
                                        setList={(newState : any) => {setDropdownValues(newState)}}
                                    >
                                    {dropdownValues.map((dropdownRow : any , index :number) => {
                                    return    <div className="dropdownOptionsWrapper" key={dropdownRow.id}>
                                                <div  className='row'  style={{ margin: '0px', marginBottom: '20px' }}  >
                                                    <div className="col-md-1 item-wrp" key={dropdownRow.id}>
                                                        <img src="images/Drag_Drop-Gray.svg" className="item-img"/>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <input className="form-control"  type="text" onChange={(e : any) => {
                                                            let tempArr = [...dropdownValues]
                                                            tempArr[index]['name'] = e.target.value
                                                            setDropdownValues(tempArr)
                                                        }} defaultValue={dropdownRow.name} />
                                                    </div>
                                                    {dropdownValues.length > 1 && <div className="col-md-1 item-wrp" onClick={() => deleteClickVal(index)}>
                                                        <i style={{color: 'red'}} className="logi-icon icon-delete"></i>
                                                    </div>}
                                                </div>
                                        </div>
                                    })
                                    }
                                    </DraggableComponent>
                                <div className="addToTable text-center add-dropdown-btn" onClick={() => addClickVal()}>
                                        <i className="logi-icon icon-Product-Icons_Add"></i>
                                        <span style={{textDecoration: 'underline'}}>{dynamicLabels.addNewValue}</span>
                                </div>
                            </div>
                          
                            </div> : undefined }
                        {/* radio */}
                        { selectedFieldType === 'radio' ? 
                        <div className='row field-validation-cont'>
                                <label className="dropdownValuesLabel section-label">{dynamicLabels.dropdownValues}</label>
                                <div className="col-md-12 col-sm-12 col-lg-12 dropdown-container">
                                <DraggableComponent
                                        sort={true}
                                        list={dropdownValues}
                                        setList={(newRadio : any) => {setDropdownValues(newRadio)}}
                                    >
                                    {dropdownValues.map((radioRow : any , index : number) => {
                                    return    <div className="dropdownOptionsWrapper" >
                                                <div className='row' style={{ margin: '0px', marginBottom: '20px' }} >
                                                    <div className="col-md-1 item-wrp">
                                                        <img src="images/Drag_Drop-Gray.svg" className="item-img"/>
                                                    </div>
                                                    <div className="col-md-10">
                                                        <input className="form-control"  type="text" onChange={(e : any) => {
                                                            let tempArr = [...dropdownValues]
                                                            tempArr[index]['name'] = e.target.value
                                                            setDropdownValues(tempArr)
                                                        }}  defaultValue={radioRow.name} />
                                                    </div>
                                                </div>
                                        </div>
                                    })
                                    }
                                    </DraggableComponent>
                            </div>
                            </div> : undefined }
                        </CustomDropDown>

                    </Box>
                        {/* SAVEFIELD CONFIRMATION MODAL */}
                        <Modal open={!!confirmSaveRequest} onToggle={() => { }} size='md'>
                    {{
                    header: <ModalHeader
                        headerTitle={dynamicLabels?.areYouSure}
                        imageVariant='icomoon-close'
                        handleClose={() => {
                        setConfirmSaveRequest(false)
                        }}
                    />,

                    content: (
                        <>
                        <div style={{ fontSize: '14px' , lineHeight: '20px'}}>{dynamicLabels?.customFieldsSaveConfirmation}</div>
                        </>),
                    footer: (
                        <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
                        <IconButton iconVariant='icomoon-tick-circled'  primary onClick={() => saveField()}>{dynamicLabels.ok}</IconButton>
                        <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {setShowAddModal(true); setConfirmSaveRequest(false)}}>{dynamicLabels.cancel}</IconButton>
                        </Box>
                    )
                    }}
                </Modal>
                </AddEditCont>
                    
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='AddFormModal-actionBar-save' iconVariant='icomoon-save'  primary disabled={disableSaveBtn || (errorObject?.errorLabel !== "" || errorObject?.errorIdType !== "" || errorObject?.errorInfotip !== "" || errorObject?.errorMinmax !== "" || errorObject?.errorMinmaxLength !== "")} onClick={() => setConfirmSaveRequest(true)}>{dynamicLabels.save}</IconButton>
              <IconButton id='AddFormModal-actionBar-cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => handleClosePopup()}>{dynamicLabels.cancel}</IconButton>
            </Box>
            ),
        }}


    />

}

export default AddFormModal
