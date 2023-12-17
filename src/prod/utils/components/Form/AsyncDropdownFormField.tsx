import React, { useState, useCallback } from 'react'
import { Controller } from 'react-hook-form'
import { AsyncFormSelect } from 'ui-library'
import { OptionsType } from 'react-select'
import { ISpecificFormFieldProps } from './interface'
import { fetchDropdownOptions } from './utils'
import { errorTypeMapping } from './FormField'

const AsyncDropdownFormField = ({
  name,
  meta,
  // defaultValue,
  validationRules,
  formInstance: { control, errors, watch },
  isSetSearchValue = false
}: ISpecificFormFieldProps) => {
  // const defaultValue = watch(name)
  return (<Controller
    name={name}
    control={control}
    // defaultValue={defaultValue || ''}
    rules={validationRules}
    render={(props) => {
      const [options, setOptions] = useState<{ value: any, label: string }[]>([])
      const [mapping, setMapping] = useState<Record<string, any>>({})
      const country = watch(meta.countryFieldName || '')
      const [cacheValue, setCacheValue] = useState<string>('')
      const [isManuallyAdded, setIsManuallyAdded] = useState<boolean>(false)
      const fieldArray = ['pickupAccountCode', 'returnAccountCode', 'AccountCode', 'deliverAccountCode']
      let timeout: number;

      function delay(ms: number) {
        return new Promise(resolve => timeout = setTimeout(resolve, ms));
      }

      const handleLoadOptions = useCallback(
        async (inputValue: string, callback: (options: OptionsType<any>) => void) => {
          console.log('setCacheValue', inputValue)
          setCacheValue(inputValue)
          try {
            let dynamicVar: any = ''
            if (meta.countryFieldName && meta.lookupType === 'getPincode') {
              dynamicVar = { pincode: inputValue, country: country?.id }
            } else {
              dynamicVar = inputValue
            }

            clearTimeout(timeout);
            await delay(1000)

            if (inputValue.length >= 3) {
              const dependentVar = watch('clientName')
              const { options, mapping: optionsMapping } = await fetchDropdownOptions(meta.lookupType || '', dynamicVar, dependentVar)
              setMapping(optionsMapping)
              setOptions(options)
              callback(options)
            } else {
              callback(options)
            }
          } catch (error) {
            console.log({ error })
          }
        }, [options, country, meta])

      const handleOnChange = (option: any) => {
        if (option) {
          setIsManuallyAdded(false)
        }
        setCacheValue('')
        props.onChange(mapping?.[option?.value])
        option?.label && meta?.handleBlurEvent && meta?.handleBlurEvent(option?.label , meta.id)
        var toolTipData = document.getElementsByClassName('ui-tooltip');
        if (toolTipData.length) {
          toolTipData[0].remove();
        }
      }

      const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
        if (isSetSearchValue && cacheValue !== '') {
          setIsManuallyAdded(true)
          setOptions(o => [...o, { value: cacheValue, label: cacheValue }])
          props.onChange({ name: cacheValue, id: cacheValue })
        } else if (cacheValue !== "" && meta.lookupType === "getPincode") {
          // https://www.quora.com/Are-all-postcodes-numeric
          props.onChange({ name: cacheValue, id: cacheValue })
          setIsManuallyAdded(true);
        } else {
          setIsManuallyAdded(false);
        }
        props.onBlur()
        event.stopPropagation()
      }, [cacheValue])

      return (
        <div onBlur={(event) => handleBlur(event)}>
          <AsyncFormSelect
          required={meta.required}
          loadOptions={handleLoadOptions}
          placeholder={meta.label}
          label={meta.label}
          onChange={handleOnChange}
          value={(props?.value?.id && props?.value?.name) ? { value: props?.value?.id, label: props?.value?.name } : null}
          showCrossIcon={fieldArray.indexOf(meta.id) !== -1 && isManuallyAdded ? false : true}
          error={errors[name]}
          disabled={!meta.editable}
          showDescription={meta.lookupType === 'getcustomer' ? true : false}
          errorMessage={meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
        />
        </div>
      )
    }}
  />)

}

export default AsyncDropdownFormField