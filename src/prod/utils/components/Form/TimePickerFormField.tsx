import React from 'react'
import moment from 'moment-timezone'
import { DatePicker, TextInput } from 'ui-library'
import { ISpecificFormFieldProps } from './interface'
import { Controller } from 'react-hook-form'
import { errorTypeMapping } from './FormField'
// import useDebounce from '../../useDebounce'

const TimePickerFormField = ({
  name,
  meta,
  formInstance: { control, errors },
  validationRules,
  iconVariant,
  timeInterval,
  requiredError,
  onChange
}: ISpecificFormFieldProps) => {
  // const defaultValue = watch(name)

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={props => {
        const [hasPickerPlacementTop, setHasPickerPlacementTop] = React.useState<boolean>(false)
        const inputRef = React.useRef<HTMLDivElement>(null)
        const [typedValue, setTypedValue] = React.useState<string | undefined>()

        return <div ref={inputRef}><DatePicker
          label={meta.label}
          style={{ width: '100%', position: 'absolute', zIndex: '1300', left: 'auto', ...(hasPickerPlacementTop ? { bottom: '70px' } : { top: '60px' }) }}
          variant='time'
          timeInterval={timeInterval ? timeInterval : 30}
          selected={props.value}
          onChange={(d: Date | any) => {
            let value = (d && d?.toString()) ? d?.toString() : undefined
            setTypedValue(value)
            props.onChange(d)
            onChange && onChange(d)
          }
 }
          error={errors[name]}
          errorMessage={meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
        >
          {({ value, open, setOpen }) => {
            // const [typedValue, setTypedValue] = React.useState<string | undefined>()

            const handleTextChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              //key code
              e.persist();
              setTimeout(() => {
                setTypedValue(e.target.value)
              }, 0)
              props.onChange("")
            }, [typedValue])

            // TODO - commented function for blur
            
            // const handleTextBlur = () => {
            //   if (typedValue !== undefined) {

            //     if (typedValue === '') {
            //       props.onChange(undefined)
            //       return
            //     }

            //     setTypedValue(undefined)
            //     const parsedDate = moment(typedValue, 'HH:mm')
            //     if (parsedDate.isValid() && typedValue.length === 5) {
            //       props.onChange(parsedDate.toDate())
            //     }
            //     else{
            //       props.onChange("")
            //     }
            //   } else {
            //     props.onChange(undefined)
            //   }
            // }

            const handleTextClick = () => {
              setHasPickerPlacementTop(window.innerHeight - (inputRef.current?.getBoundingClientRect()?.bottom || 0) < 280)
              if(!meta.ShiftStartEndTimeVisiblity){
                setHasPickerPlacementTop(window.innerHeight - (inputRef.current?.getBoundingClientRect()?.bottom || 0) < 280)
                setOpen(o => !o)
              }
              if(meta['pageName'] === 'addServiceTypeForm'){
                setHasPickerPlacementTop(false)
              }
            }
            const timezone = JSON.parse(localStorage.getItem('userAccessInfo') || "{}")
            const zone = timezone.timezoneMode === "MYTIMEZONE" ? moment(value).tz(timezone?.timezone).format('HH:mm') : moment(value).format('HH:mm')
         // console.log("data", value, typedValue, timezone.timezoneMode === "MYTIMEZONE" ? moment(value).tz(timezone?.timezone).format('YYYY-MM-DD HH:mm') : moment(value).format('YYYY-MM-DD HH:mm'))
            return <TextInput
              value={typedValue !== undefined ? moment(typedValue).format('HH:mm') === "Invalid date" ? '' : moment(typedValue).format('HH:mm') : (typedValue !== '' ? value &&  zone === "Invalid date" ? '' : value &&  zone : '')}
              // value={typedValue !== undefined ? moment(typedValue).format('HH:mm') : (value &&  moment(value).format('HH:mm'))}
              onClick={handleTextClick}
              readOnly={open}
              variant='withIcon'
              iconVariant={iconVariant ? iconVariant : 'clock-history-outline'}
              iconStyle={{ cursor: 'pointer'}}
              iconSize={25}
              onIconClick={handleTextClick}
              onChange={handleTextChange}
              id={name}
              name={name}
              required={meta.required}
              placeholder={meta.label}
              label={meta.label}
              fullWidth
              // onBlur={handleTextBlur}
              error={requiredError || errors[name] || meta['customValidationError']}
              errorMessage={requiredError ? `${meta.label} is mandatory` : meta['customValidationError'] ? meta['customValidationErrorMessage'] : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
              autoComplete='off'
              disabled={meta.ShiftStartEndTimeVisiblity} // TODO: This is a generic Logic change this
            />
          }}
        </DatePicker></div>
      }}
    />
  )
}

export default TimePickerFormField