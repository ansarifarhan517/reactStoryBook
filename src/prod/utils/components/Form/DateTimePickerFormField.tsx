import React from 'react'
import moment from 'moment-timezone'
import { DatePicker, TextInput } from 'ui-library'
import { ISpecificFormFieldProps } from './interface'
import { Controller } from 'react-hook-form'
import { errorTypeMapping } from './FormField'
import { useTypedSelector } from '../../redux/rootReducer'

const DateTimePickerFormField = ({
  name,
  meta,
  formInstance: { control, errors },
  validationRules
}: ISpecificFormFieldProps) => {
  // const clientProperties = useClientProperties(['DATEFORMAT'])
  // const defaultValue = watch(name)
  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      // defaultValue={defaultValue || ''}
      render={props => {
        const clientProperties = useTypedSelector(state => state.clientProperties)

        const [hasPickerPlacementTop, setHasPickerPlacementTop] = React.useState<boolean>(false)
        const [hasPickerPlacementRight, setHasPickerPlacementRight] = React.useState<boolean>(false)
        const inputRef = React.useRef<HTMLDivElement>(null)

        const handleChange = (d: Date | any) => {
          if (meta.customField) {
            const utcDate = moment(d).utc().format('YYYY-MM-DDTHH:mm:ss')
            props.onChange(utcDate)
          } else {
            props.onChange(d)
          }
        }

        return <DatePicker
        tillMinDate={ meta.minDate?new Date(
          new Date(meta.minDate).getFullYear(),
          new Date(meta.minDate).getMonth(),
          new Date(meta.minDate).getDate(),
          new Date(meta.minDate).getHours(),
          new Date(meta.minDate).getMinutes()
        ): null}
          label={meta.label}
          style={{ width: 'auto', position: 'absolute', zIndex: '1600', left: 'auto', ...(hasPickerPlacementTop ? { bottom: '70px' } : { top: '60px' }), ...(hasPickerPlacementRight ? { right: '0' } : { left: 'auto' }) }}
          variant='datetime'
          timeInterval={meta.timeInterval? meta.timeInterval: 30}
          selected={meta.customField && props.value ? moment.utc(props.value).tz(clientProperties?.TIMEZONE?.propertyValue)?.toDate() : props.value}
          onChange={handleChange}
          error={errors[name]}
          errorMessage={meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
        >
          {({ setOpen }) => {
            const [typedValue, setTypedValue] = React.useState<string | undefined>()

            const handleTextChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
              setTypedValue(e.target.value)
            }, [setTypedValue])

            const handleTextBlur = () => {
              if (typedValue !== undefined) {
                setTimeout(() => {
                  setOpen(false)
                }, 250)
                if (typedValue === '') {
                  props.onChange(undefined)
                  setTypedValue(undefined)
                  return
                }

                const parsedDate = moment(typedValue, `${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
                setTypedValue(undefined)
                if (parsedDate.isValid()) {
                  handleChange(parsedDate.toDate())
                }
              }
              props.onBlur()
            }

            const handleTextClick = () => {
              setHasPickerPlacementTop(window.innerHeight - (inputRef.current?.getBoundingClientRect()?.bottom || 0) < 280)
              setHasPickerPlacementRight(window.innerWidth - (inputRef.current?.getBoundingClientRect()?.right || 0) < 258)
              setOpen(o => !o)
            }

            return <div ref={inputRef}>
              <TextInput
                // value={typedValue !== undefined ? typedValue : (value && moment(value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`))}
                value={typedValue !== undefined ? typedValue :
                  (props.value &&
                    (meta.customField ?
                      moment.utc(props.value).tz(clientProperties?.TIMEZONE?.propertyValue).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)
                      : moment(props.value).format(`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`)))}
                onClick={handleTextClick}
                // readOnly={open}
                variant='withIcon'
                iconVariant='calendar'
                required={meta.required}
                iconStyle={{ cursor: !meta.editable? 'no-drop' :'pointer'  }}
                iconSize={16}
                onIconClick={()=>{ !meta.editable ? null :  handleTextClick()}}
                onChange={handleTextChange}
                id={name}
                name={name}
                placeholder={meta.label}
                label={meta.label}
                fullWidth
                onBlur={handleTextBlur}
                error={errors[name]}
                errorMessage={meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
                autoComplete='off'
                disabled={!meta.editable}
              />
            </div>
          }}
        </DatePicker>
      }}
    />
  )
}

export default DateTimePickerFormField
