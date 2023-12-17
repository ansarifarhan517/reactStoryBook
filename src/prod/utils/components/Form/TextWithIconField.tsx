import React from 'react'
import { TextInput } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { errorTypeMapping } from './FormField'

const TextWithIconField = ({
  formInstance: { errors, register, unregister },
  meta, name,
  handler,
  toolTipText,
  validationRules }: ISpecificFormFieldProps) => {
    // const renderCount = React.useRef(0)
    // console.log('Text Field Renderring: ', name, renderCount.current++)
    console.log(handler)

    React.useEffect(() => {
      return () => {
        unregister(name)
      }
    }, [])

  return <>
  <TextInput
    fullWidth
    name={name}
    // id={name}
    className={`formFieldWrapper-${name}`}
    placeholder={meta.label}
    label={meta.label}
    required={meta.required}
    id={name}
    onClick={() => meta.readOnly && handler && handler(name)}
    error={errors[name]}
    errorMessage={errors[name]?.type === 'pattern' ? errors[name]?.message : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
    ref={register(validationRules)}
    maxLength={Number(validationRules.maxLength) || 255}
    variant='withIcon'
    iconStyle={{ cursor: 'pointer' }}
    iconVariant={meta?.iconVariant || 'calender'}
    iconSize={meta.iconSize || 15}
    onIconClick={() => handler && handler(name)}
    title={meta.infoFlag && meta['infoTool'] ? meta['infoTool']?.[0]?.message : toolTipText}
    disabled={!meta.editable}
    tooltipMesaage={toolTipText}
    displayTootltipOnIcon={true}
    readOnly={meta.readOnly}
  />
  </>
}

export default TextWithIconField
