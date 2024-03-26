import React from 'react'
import { TextInput } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { errorTypeMapping } from './FormField'

const TextFormField = ({
  formInstance: { errors, register, unregister },
  meta, name, defaultValue, onChange = () => {},
  validationRules }: ISpecificFormFieldProps) => {
    // const renderCount = React.useRef(0)
    // console.log('Text Field Renderring: ', name, renderCount.current++)

    React.useEffect(() => {
      return () => {
        unregister(name)
      }
    }, [])
  return <TextInput
    fullWidth
    name={name}
    // id={name}
    tooltipMesaage={meta.infoFlag && meta['infoTool'] ? meta['infoTool']?.[0]?.message : ''}
    tooltipDirection="top"
    messagePlacement={meta?.messagePlacement || "center"}
    className={`formFieldWrapper-${name}`}
    placeholder={meta.label}
    label={meta.label}
    required={meta.required}
    disabled={!meta.editable}
    id={name}
    onChange={onChange}
    error={errors[name] || meta['isError']}
    errorMessage={errors[name] ? (errors[name]?.type === 'pattern' ? errors[name]?.message : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message) : meta.validation?.[errorTypeMapping[meta['errorType']]]?.message}
    ref={register(validationRules)}
    minLength={Number(validationRules.minLength) || undefined}
    maxLength={Number(validationRules.maxLength) || 255}
    onBlur={(e:any) => meta?.handleBlurEvent && meta?.handleBlurEvent(e.target.value,  meta.id)}
    defaultValue={defaultValue}
  />
}

export default TextFormField