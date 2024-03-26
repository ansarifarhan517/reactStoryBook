import React, { useEffect, useState } from 'react'
import { Box, Modal, ModalHeader, MultiSelect , FontIcon , tMultiSelectChildren} from 'ui-library'
import {AddEditCont , CustomDropDown} from './CustomFieldsCss';
import {TextInput , Toggle , DropDown , IconButton, useToast } from 'ui-library'
import axios from '../../../utils/axios'
import apiMappings from '../../../utils/apiMapping'
import { sendGA } from '../../../utils/ga';
import {DraggableComponent} from '../../../utils/components/Draggable/DraggableComponent'

interface IEditFormModal {
    isShowModal: boolean
    dynamicLabels: Record<string, string>
    setShowEditModal: (value: boolean) => void,
    fieldData: any
    moduleList: any
    onClose?: () => void
}

const EditFormModal = ({ isShowModal, dynamicLabels , fieldData ,moduleList ,setShowEditModal ,  onClose = () => { }}: IEditFormModal) => {
const toast = useToast()
const [daTypes, setDaTypes] = useState<{ value: string, label: string }[] | undefined>(undefined)
const [selectedFieldType, setSelectedFieldType] = useState<string>("");
const [dropdownValues, setDropdownValues] = useState([ 
    { id: "1", name: "Dropdown Value 1" } ,  { id: "2", name: "Dropdown Value 2" } ])
const [errorObject, setErrorObject] = useState({errorMinmaxLength:"" ,errorMinmax:""})
const [customObj, setCustomObj] = useState(fieldData)
const [confirmSaveRequest , setConfirmSaveRequest] = useState(false)
const [disableSaveBtn , setDisableSaveBtn] = useState(false)
let isInvalid = {}
let emptyArr:any = []



useEffect(() => {
    setSelectedFieldType(fieldData && fieldData['customFieldType'])
    
    if(fieldData?.customFieldData?.dropdownValues){
        let selectedDropdown:any = []
        fieldData.customFieldData.dropdownValues.map((val: string , index : number) => {
                let obj = {
                    id : index.toString(),
                    name : val
                }
                selectedDropdown.push(obj)
  
        })
        selectedDropdown.length > 0 ? setDropdownValues(selectedDropdown) : setDropdownValues(dropdownValues)
    }
    setCustomObj(fieldData)
    if(fieldData?.attachedWithModules){
        let selectedModules:any = []
        fieldData['attachedWithModules'].map((module: string) => {
            moduleList && moduleList.map((moduleObj: any) => {
                if(module == moduleObj?.clientRefMasterCd){
                    selectedModules.push(moduleObj)
                }
            })
        })
        selectedModules.length > 0 ? setDaTypes(selectedModules) : undefined
    }
}, [selectedFieldType , customObj , fieldData])



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
    let fieldObject = fieldData?.customFieldData
    if(fieldObject){
        if (validationType == "minmax") {
            if (fieldObject['fieldType'] == "number") {
                if (fieldObject['minValue'] == null || fieldObject['minValue'] == undefined) {
                    isInvalid['minmax'] = "Minimum Value is mandatory";
                } else if (fieldObject['maxValue'] == null || fieldObject['maxValue'] == undefined) {
                    isInvalid['minmax'] = "Maximum Value is mandatory";
                } else if (!fieldObject['required'] && fieldObject['minValue'] < 0) {
                    isInvalid['minmax'] = "Minimum Value cannot be less than 0";
                } else if (fieldObject['required'] && fieldObject['minValue'] < 0) {
                    isInvalid['minmax'] = "Minimum Value cannot be less than 0";
                } else if (fieldObject['maxValue'] < 0) {
                    isInvalid['minmax'] = "Maximum Value cannot be less than 0";
                } else if (fieldObject['minValue'] && fieldObject['maxValue'] && (fieldObject['minValue'] >= fieldObject['maxValue'])) {
                    isInvalid['minmax'] = "Maximum Value cannot be same or less than min";
                }
            } else {
                isInvalid['minmax'] = false;
            }
            setErrorObject({...errorObject ,  errorMinmax : isInvalid['minmax'] ? isInvalid['minmax'] : ""})
        }
        if (validationType == "minmaxLength") {
            if (fieldObject['fieldType'] == "text") {
                if (fieldObject['minLength'] == null || fieldObject['minLength'] == undefined) {
                    isInvalid['minmaxLength'] = "Minimum Character Limit is mandatory";
                } else if (fieldObject['maxLength'] == null || fieldObject['maxLength'] == undefined) {
                    isInvalid['minmaxLength'] = "Maximum Character Limit is mandatory";
                } else if (!fieldObject['required'] && fieldObject['minLength'] < 0) {
                    isInvalid['minmaxLength'] = dynamicLabels.minimumCharLimitCannotBeLessThan + " 0";
                } else if (fieldObject['required'] && fieldObject['minLength'] < 1) {
                    isInvalid['minmaxLength'] = dynamicLabels.minimumCharLimitCannotBeLessThan + " 1";
                } else if (fieldObject['maxLength'] < 0) {
                    isInvalid['minmaxLength'] = dynamicLabels.maximumCharLimitCannotBeLessThan + " 0";
                } else if (fieldObject['minLength'] && fieldObject['maxLength'] && (fieldObject['minLength'] >= fieldObject['maxLength'])) {
                    isInvalid['minmaxLength'] = "Maximum Character Limit cannot be same or less than Minimum Character Limit";
                }
            } else {
                isInvalid['minmaxLength'] = false;
            }
            setErrorObject({...errorObject ,  errorMinmaxLength : isInvalid['minmaxLength'] ? isInvalid['minmaxLength'] : ""})
        }
    }
}


const saveField = async () => {
        let invalidValue = false;
        setDisableSaveBtn(true)
        
        if (dropdownValues && (customObj['customFieldType'] == "dropdown" || customObj['customFieldType'] == "multiselect" || customObj['customFieldType'] == "radio")) {
            let savedropdown : any = [];
            dropdownValues.map((value : any) => {
                savedropdown.push(value?.name)
                if (!invalidValue) {
                    if (!value?.name || !(/^[a-zA-Z0-9_@, ]*$/.test(value?.name))) {
                        invalidValue = true;
                    }
                }
            })

            if (invalidValue) {
                toast.add(dynamicLabels.dropdownValuesMandatoryAlphanumeric, 'warning', false)
                setConfirmSaveRequest(false)
            }
            if(!invalidValue){
                customObj['customFieldData']['dropdownValues'] = savedropdown;
            }
        }else{
            removeKeyFromObj('dropdownValues' , customObj)
        }
        let attachedWithModulesArray: any = [];
        if (daTypes) {
            customObj['attachedWithModules'] = []
            customObj['customFieldData']['attachedWithModules'] = []
            daTypes.map((eachModule , index) => {
                attachedWithModulesArray.push(eachModule['value']);
                let obj = {
                    id: index + 1,
                    label: eachModule['label'],
                    name: eachModule['label'],
                    value: eachModule['value']
                }
                customObj['customFieldData']['attachedWithModules'].push(obj)
            })
            customObj['attachedWithModules'] = attachedWithModulesArray;
        }

        if (fieldData && fieldData['customFieldData'] && fieldData?.customFieldData['infoTool'] && fieldData.customFieldData['infoTool'][0] && fieldData.customFieldData['infoTool'][0]['message']) {
            customObj['customFieldData']['infoFlag'] = true;
        }

        
        let payLoad = customObj;

        if(!invalidValue){
                const { data: { message, status , hasError } } = await axios.put(apiMappings.customFields.listView.saveCustomFields , payLoad)
                if (status === 200 && !hasError) {
                  toast.add(message, 'check-round', false)
                  setShowEditModal(false);
                  setConfirmSaveRequest(false);
                  setDisableSaveBtn(false)
                  onClose()
                  sendGA('Form and List Builder','Update Custom field - SAVE')
                  return
                }else if (hasError) {
                    toast.add(message , 'error', false)
                    setConfirmSaveRequest(false);
                }
              
        }


}
const removeKeyFromObj = (keyVal : string , fieldObj : any) => {
    delete fieldObj[keyVal] 
}
const handleClosePopup = () => {
    setShowEditModal(false)
    setDropdownValues([{ id: "1", name: "Dropdown Value 1" } ,  { id: "2", name: "Dropdown Value 2" }])
    setErrorObject({errorMinmaxLength: "" ,errorMinmax: ""})
    setDisableSaveBtn(false)

}

    return <Modal
        open={isShowModal}
        onToggle={() => {
            setShowEditModal(false);
        }}
        width='500px'
        children={{
            header: (
                <ModalHeader
                    headerTitle= "Edit Field"
                    handleClose={() => handleClosePopup()}
                    imageVariant="icomoon-close"
                    headerStyle={{ fontSize: "15px" }}
                    width='100%'
                />
            ),
            content: (
                <AddEditCont>
                    <Box className="add-edit-modal-cont" >
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
                            disabled={true}
                            required={true}
                            placeholder={dynamicLabels.fieldName}
                            maxLength={255}
                            error={false}
                            defaultValue={fieldData && fieldData['customFieldName']}
                            />

                        {/* Field key */}
                        <TextInput
                            id='field_key'
                            label= {dynamicLabels.customFieldKey}
                            fullWidth={true}
                            disabled={true}
                            required={true}
                            placeholder={dynamicLabels.customFieldKey}
                            maxLength={255}
                            error={false}
                            style={{ paddingLeft: '40px' }}
                            defaultValue={fieldData && fieldData['customFieldId']}
                            />
                        
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
                            defaultValue={fieldData?.customFieldData?.infoTool && fieldData['customFieldData']['infoTool'][0].message}
                            onChange={(e :  any) => {
                                if(e.target.value !== ""){
                                    let infoTool  = [{message: e.target.value}]
                                    fieldData['customFieldData']['infoTool'] = infoTool
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
                                        width: '45%'

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
                                checked={fieldData?.customFieldData?.required}
                                label={dynamicLabels.mandatory}
                                style={{fontSize: '14px'}}
                                onChange={() => {
                                    fieldData.customFieldData['required'] = !fieldData?.customFieldData?.required
                                    setCustomObj(fieldData)
                                    selectedFieldType === 'text' ? validateFields('minmaxLength') : validateFields('minmax')
                                }}
                             /></Box>
                              {/* field fieldType */} 
                            <div className='div-width'>
                                <DropDown
                                    variant='form-select'
                                    id='fieldType'
                                    optionList={emptyArr}
                                    label={dynamicLabels?.fieldType || 'Field Type'}
                                    placeholder={fieldData && fieldData['customFieldType']}
                                    value={fieldData && fieldData['customFieldType']}
                                    onChange={(value: any) => {
                                        setSelectedFieldType(value); 
                                    
                                    }}
                                    required={true}
                                    disabled={true}
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
                            defaultValue={selectedFieldType === 'number' ? fieldData?.customFieldData?.minValue : fieldData?.customFieldData?.minLength}
                            onChange={(e : any) => {
                                let minVal = e.target.value !== "" ? parseInt(e.target.value) : null
                                selectedFieldType === 'number' ? fieldData.customFieldData['minValue'] = minVal : fieldData.customFieldData['minLength'] = minVal
                                setCustomObj(fieldData)
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
                            defaultValue={selectedFieldType === 'number' ? fieldData?.customFieldData?.maxValue : fieldData?.customFieldData?.maxLength}
                            error={false}
                            onChange={(e : any) => {
                                let maxVal = e.target.value !== "" ? parseInt(e.target.value) : null
                                selectedFieldType === 'number' ? fieldData.customFieldData['maxValue'] = maxVal : fieldData.customFieldData['maxLength'] = maxVal
                                setCustomObj(fieldData)
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
                                <div className="col-md-12 col-sm-12 col-lg-12 dropdown-container">
                                <DraggableComponent 
                                        sort={true}
                                        list={dropdownValues}
                                        setList={(newState : any) => {setDropdownValues(newState); console.log(newState)}}
                                    >
                                    {dropdownValues.map((dropdownRow : any , index :number) => {
                                    return    <div className="dropdownOptionsWrapper" key={dropdownRow.id}>
                                                <div className='row' style={{ margin: '0px', marginBottom: '20px' }} >
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
                                    }</DraggableComponent>
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
                                    }</DraggableComponent>
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
                        <IconButton iconVariant='icomoon-tick-circled' disabled={disableSaveBtn} primary onClick={() => saveField()}>{dynamicLabels.ok}</IconButton>
                        <IconButton iconVariant='icomoon-close' iconSize={11} onClick={() => {setShowEditModal(true); setConfirmSaveRequest(false)}}>{dynamicLabels.cancel}</IconButton>
                        </Box>
                    )
                    }}
                </Modal>
                </AddEditCont>
                    
            ),
            footer: (
                <Box horizontalSpacing='10px' display='flex' justifyContent='flex-end' p='15px'>
              <IconButton id='UpdateForm-Modal-actionBar-save' iconVariant='icomoon-save'  primary disabled={errorObject?.errorMinmax !== "" || errorObject?.errorMinmaxLength !== ""} onClick={() => setConfirmSaveRequest(true)}>{dynamicLabels.save}</IconButton>
              <IconButton id='Update-Modal-actionBar-cancel' iconVariant='icomoon-close' iconSize={11} onClick={() => handleClosePopup()}>{dynamicLabels.cancel}</IconButton>
            </Box>
            ),
        }}


    />

}

export default EditFormModal
