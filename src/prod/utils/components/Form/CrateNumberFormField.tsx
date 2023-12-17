import React from 'react'
import { TextInput, FontIcon } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { errorTypeMapping } from './FormField'

const CrateNumberFormField = ({
  formInstance: { errors, register, unregister, watch, setValue },
  meta, name,
  validationRules }: ISpecificFormFieldProps) => {
  // const renderCount = React.useRef(0)
  // console.log('Text Field Renderring: ', name, renderCount.current++)

  const value = watch(name)

  const allowedLength = React.useMemo(() => {
    return Number(meta?.validation?.max?.args?.length || meta.validation?.maxlength?.args || 15)
  }, [meta])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (value?.length + 1 > allowedLength) {
      e.preventDefault()
    }
  }

  const handleBlur = () => {
    if (value && meta.decimalPlaces) {
      const valueStr = String(value)
      const decimalIndex = valueStr.lastIndexOf('.')
      if (decimalIndex === -1 || valueStr.substr(decimalIndex, valueStr.length).length > meta.decimalPlaces) {
        setValue(name, Number(Number(value).toFixed(meta.decimalPlaces)))
      }
    }
  }

  React.useEffect(() => {
    return () => {
      unregister(name)
    }
  }, [])

  return <><TextInput
    type='number'
    fullWidth
    name={name}
    // id={name}
    onKeyPress={handleKeyPress}
    className={`formFieldWrapper-${name}`}
    placeholder={meta.label}
    label={meta.label}
    required={meta.required}
    id={name}
    error={errors[name] || meta['isError']}
    errorMessage={errors[name] ? meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message : meta.validation?.[errorTypeMapping[meta['errorType']]]?.message}
    ref={register(validationRules)}
    min={(meta.id !=='minTemperature' && meta.id !=='maxTemperature' && meta.id !=='crateMinTemperature' && meta.id !=='crateMaxTemperature') ? '0' : '-999'}
    max={meta?.validation?.max?.args || undefined}
    onBlur={handleBlur}
    readOnly={!meta.editable}
    tooltipMesaage={meta.infoFlag? meta.tooltipLabel:''}
    step='any'
    reg-ex={(meta.id !=='minTemperature' && meta.id !=='maxTemperature' && meta.id !=='crateMinTemperature' && meta.id !=='crateMaxTemperature') ? "^[0-9]+$" : "^-?[0-9]+$"}
  />
    <span onClick={() => setValue('refresh', true)}
      style={meta.icon ? {
        position: 'absolute',
        top: '40%',
        right: '6%'
      } : {}}>
      {meta.icon && <FontIcon
        variant={meta.icon}
        color='primary.main'
        size='sm'
      />}
    </span>
  </>
}

export default CrateNumberFormField