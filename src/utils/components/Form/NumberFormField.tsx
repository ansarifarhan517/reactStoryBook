import React from 'react'
import { TextInput, FontIcon } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { errorTypeMapping } from './FormField'

const NumberFormField = ({
  formInstance: { errors, register, unregister, watch, setValue },
  meta, name, defaultValue, messagePlacement, boundLeft,
  validationRules, requiredError }: ISpecificFormFieldProps) => {
  const value = watch(name)
  const allowedLength = React.useMemo(() => {
    return Number(meta?.validation?.max?.args?.length || meta.validation?.maxlength?.args || 15)
  }, [meta])

  const [error, setError] = React.useState<null | string>(null)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement> ) => {
    if(e.key === 'e') {
      e.preventDefault()
    }
    if(meta?.decimalPlaces) {
      let isDecimal = value?.indexOf('.') === -1
      if(!isDecimal && value?.split('.')[1]?.length > 1) {
        // setError(`${meta.label} length is greather than ${allowedLength - meta.decimalPlaces}`)
        e.preventDefault()
      } 
      // else if (e.key !== "." && value?.length + 1 > (allowedLength - meta.decimalPlaces - 1 )) {
        
      //   setError(`${meta.label} length is greather than ${allowedLength - (meta.decimalPlaces + 1)}`)
      // }
      else if(value !== "" && value !== undefined && value !== null && e.key !== "." && meta?.decimalPlaces && validationRules?.max && Number(value?.length + 1) > Number(validationRules?.max)){
        setError(`${meta.label} length is greather than ${allowedLength}`)
      }
    } else {
      if (value?.length + 1 > allowedLength || (meta?.removeDecimal && isNaN(parseInt(e?.key)))) {
        e.preventDefault()
      }
    }
    if(value<0 && (meta.id=="cancellationFees")){
      if(meta.id=="cancellationFees")
      setError("Cancellation Fees can not be less than 0")
      }
      else
      setError(null)
  }

  const handleBlur = () => {
    if(value && meta?.removeDecimal) {
      if(value % 1 !== 0)
        Number.isNaN(parseInt(value)) ? setError('Please Enter Valid Integer') : parseInt(value) < 0 ? setError('Please Enter Valid Integer') :  setError(null), setValue(name, parseInt(value))
    } else if (value && meta.decimalPlaces) {
      setError(null)
      const valueStr = String(value)
      const decimalIndex = valueStr.lastIndexOf('.')
      if (decimalIndex === -1 || valueStr.substr(decimalIndex, valueStr.length).length > meta.decimalPlaces) {
        setValue(name, Number(Number(value).toFixed(meta.decimalPlaces)))
      }
    } else if(!(value<0 && (meta.id=="cancellationFees"))){
      setError(null)
    }
    
  }


  

  React.useEffect(() => {
    return () => {
      unregister(name)
    }
  }, [])

  return (
    <>
      <TextInput
        type={'number'}
        fullWidth
        name={name}
        onKeyPress={handleKeyPress}
        className={`formFieldWrapper-${name}`}
        placeholder={meta?.placeholder || meta.label}
        label={meta.label}
        required={meta.required}
        id={name}
        error={
          error ||
          requiredError ||
          errors[name] ||
          meta['customValidationError']
        }
        errorMessage={
          (requiredError
            ? `${meta.label} is mandatory`
            : error
            ? error
            : meta.validation?.[errorTypeMapping[errors[name]?.type]]
                ?.message) ||
          meta['customValidationErrorMessage'] ||
          errors[name]?.message
        }
        ref={register(validationRules)}
        min={meta?.validation?.min?.args || undefined}
        max={meta?.validation?.max?.args || undefined}
        onBlur={handleBlur}
        defaultValue={defaultValue}
        readOnly={!meta.editable}
        tooltipMesaage={
          meta.infoFlag && meta['infoTool']
            ? meta['infoTool']?.[0]?.message
            : ''
        }
        step="any"
        messagePlacement={messagePlacement || 'center'}
        boundLeft={boundLeft}
        tooltipIsWordWrap={true}
      />
      <span
       onClick={() => (meta.icon && meta.message) ? console.log("on hover") : setValue('refresh', true)}
        style={
          meta.icon
            ? {
                position: 'absolute',
                top: '36%',
                right: '8%',
              }
            : {}
        }
      >
        {meta.icon &&
          (meta.message ? (
            <div className="hover-parent">
              <div className="hover-message">
               {meta.message}
              </div>
              <img src='images/infoTip.svg'  alt='information icon' className='section-info-header' />
            </div>
          ) : (
            <FontIcon variant={meta.icon} color="primary.main" size="sm" />
          ))}
      </span>
    </>
  )
}

export default NumberFormField