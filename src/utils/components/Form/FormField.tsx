import React from 'react'
import { ValidationRules } from 'react-hook-form'
import { IFormFieldProps, ISpecificFormFieldProps } from './interface'
import TextFormField from './TextFormField'
import RadioFormField from './RadioFormField'
import MultiCheckboxFormField from './MultiCheckboxFormField'
import CheckboxFormField from './CheckboxFormField'
import MultiselectFormField from './MultiselectFormField'
import DropdownFormField from './DropdownFormField'
import AsyncDropdownFormField from './AsyncDropdownFormField'
import DatePickerFormField from './DatePickerFormField'
import TimePickerFormField from './TimePickerFormField'
import DateTimePickerFormField from './DateTimePickerFormField'
import ShiftTimingFormField from './ShiftTimingFormField'
import FileUploadFormField from './FileUploadFormField'
import NumberFormField from './NumberFormField'
import ToggleFormField from './ToggleFormField'
import TextWithIconField from './TextWithIconField'
import MultiNumberInput from './MultiNumberInputFormField'
import CrateNumberFormField from './CrateNumberFormField'
import { REGEXPS } from '../../constants'

export const errorTypeMapping = {
  required: 'required',
  pattern: 'pattern',
  minLength: 'minlength',
  maxLength: 'maxlength',
  min: 'min',
  max: 'max',
  
}

const FormField = (props: IFormFieldProps) => {
  const { meta, options ,validate} = props
  const registerValidationRules = React.useMemo(() => {
    const obj: ValidationRules = {
      required: meta.required,
      maxLength: Number(meta.validation?.maxlength?.args),
      minLength: Number(meta.validation?.minlength?.args),
      min: Number(meta.validation?.min?.args),
      max: Number(meta.validation?.max?.args),
      validate: validate &&  validate
    }
    if (meta.validation?.pattern?.args) {
      obj.pattern = {
        value: new RegExp(String(meta.validation?.pattern?.args)
          ?.substring(1, meta.validation?.pattern?.args?.length - 1) || ''),
        message: meta.validation?.pattern?.message || ''
      }
    }

    if (meta.validation?.phoneNumber || meta.validation?.phonenumber || meta.fieldType === 'tel') {
      obj.pattern = {
        value: new RegExp("^[+]{0,1}[\(\)\-/0-9 ]*$"),
        message: meta.validation?.phoneNumber?.message || meta.validation?.phonenumber?.message || `Please enter valid ${meta.label}`
      }
    }

    if (meta.fieldType === 'email') {
      obj.pattern = {
        value: /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63})[\W]*$/,   //regex change to comma seprated email
        message: meta.validation?.email?.message || 'Invalid Email address'
      }
    }

    if (meta.fieldType === 'text') {
      obj.pattern = {
        value: REGEXPS.htmltags,   //regex change to comma seprated email
        message: 'HTML Tags are not allowed'
      }
    }
    return obj
  }, [meta])

  const formFieldProps: ISpecificFormFieldProps = {
    ...props,
    validationRules: registerValidationRules,
  }

  let renderField;
  
  switch (meta.fieldType) {
    case 'number':
      if(meta.childLength === 0)  {
        renderField = <NumberFormField {...formFieldProps} />
      } else {
        renderField = <MultiNumberInput {...formFieldProps} />
      }
      
      break

    case 'email':
    case 'text':
      renderField = <TextFormField {...formFieldProps} />
      break

    case 'radio':
      renderField = (
        <RadioFormField {...formFieldProps} />
      )
      break

    case 'checkbox':
      renderField = (
        <CheckboxFormField {...formFieldProps} />
      )
      break
      
    case 'toggle':
      renderField = (
        <ToggleFormField {...formFieldProps} />
      )
      break

      case 'toggleBox':
        renderField = (
          <ToggleFormField {...formFieldProps}/>
        )
      break 

      case 'textWithIcon' :
        renderField = (
          <TextWithIconField {...formFieldProps} />
        )
      break  

    case 'multicheckbox':
      renderField = (
        <MultiCheckboxFormField {...formFieldProps} />
      )
      break

    case 'multiselect':
      renderField = (
        <MultiselectFormField {...formFieldProps} />
      )
      break

    case 'select':
    case 'dropdown':
      renderField = meta.lookupType === 'getPincode' ? (
        <AsyncDropdownFormField {...formFieldProps} />
      ) : ( 
          meta.lookupType === 'getBranches' || meta.lookupType === 'getDistributionCenter' || meta.lookupType === 'getDistributionCenterSubBranch' ||
          meta.lookupType === "getVehiclesList" || meta.lookupType === "getDAList" || meta.lookupType === "getDriversList" || meta.lookupType === "getTripsBetweenDates"
        ? (
              <DropdownFormField  isSetSearchValue options={options} {...formFieldProps} />
        ) : (
          <DropdownFormField options={options} {...formFieldProps} />
        )
        )
      break

    case 'validity':
    case 'dob':
    case 'date':
      renderField = (
        <DatePickerFormField  {...formFieldProps} />
      )
      break

    case 'time':
      renderField = (
        <TimePickerFormField  {...formFieldProps} />
      )
      break

    case 'datetime':
        renderField = (
          <DateTimePickerFormField  {...formFieldProps} />
        )
        break
  
    case 'moreValidity':
      renderField = (
        <DateTimePickerFormField  {...formFieldProps} />
      )
      break

    case 'shiftTiming':
      renderField = (
        <ShiftTimingFormField {...formFieldProps} />
      )
      break

    case 'file':
      renderField = (
        <FileUploadFormField {...formFieldProps} />
      )
      break

    case 'toggleBox':
      renderField = (
        <ToggleFormField {...formFieldProps}/>
      )
      break

    case 'textWithIcon' :
      renderField = (
        <TextWithIconField {...formFieldProps} />
      )
      break

    case 'autocomplete' :
      renderField = (meta.id === 'pickupAddressId' || meta.id === 'deliverAddressId' || meta.id === 'AddressId' || meta.id === 'returnAddressId') ? (
        <DropdownFormField {...formFieldProps} isSetSearchValue={meta.id === 'pickupAddressId' || meta.id === 'deliverAddressId' || meta.id === 'AddressId' || meta.id === 'returnAddressId' ? true : false} />
      ) :(
        <AsyncDropdownFormField {...formFieldProps} />
      )
      break

    case 'cratedropdown' : 
        renderField = (
          <DropdownFormField {...formFieldProps} />
        )
      break

    case 'cratenumber' : 
    case 'itemnumber' :
        renderField = (
          <CrateNumberFormField {...formFieldProps} />
        )
      break;

    default:
      renderField = <TextFormField {...formFieldProps} />
      break
  }
  return renderField
}

export default FormField
// export default React.memo(FormField, () => true)
