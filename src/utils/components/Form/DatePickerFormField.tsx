import React from 'react'
import moment from 'moment-timezone'
import { DatePicker, TextInput } from 'ui-library'
import { ISpecificFormFieldProps } from './interface'
// import useClientProperties from '../../../modules/common/ClientProperties/useClientProperties'
import { Controller } from 'react-hook-form'
import { errorTypeMapping } from './FormField'
import { useTypedSelector } from '../../redux/rootReducer'

const DatePickerFormField = ({
  name,
  meta,
  onChange,
  formInstance: { control, errors },
  validationRules
}: ISpecificFormFieldProps) => {
  // const [selectedDate, setSelectedDate] = React.useState<Date>()
  // const defaultValue = watch(name)
  const [hasPickerPlacementTop, setHasPickerPlacementTop] = React.useState<boolean>(false)
  const [hasPickerPlacementRight, setHasPickerPlacementRight] = React.useState<boolean>(false)
  const inputRef = React.useRef<HTMLDivElement>(null)

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      // defaultValue={defaultValue || ''}
      render={props => {
        const clientProperties = useTypedSelector(state => state.clientProperties);
        const dateFormat_ls = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase();
        const timezone_ls = clientProperties?.TIMEZONE?.propertyValue;

        const handleChange = (d: Date | any) => {
          if (meta.customField) {
            const utcDate = moment.tz(d, timezone_ls).utc().format('YYYY-MM-DDTHH:mm:ss')
            props.onChange(utcDate)
          } else {
            props.onChange(d)
            onChange && onChange(d)
          }
        }
        return <DatePicker
          style={{ width: '100%', position: 'absolute', zIndex: '1300', left: 'auto', ...(hasPickerPlacementTop ? { bottom: '70px' } : { top: '60px' }), ...(hasPickerPlacementRight ? { right: '0' } : { left: 'auto' }), right:'auto'  }}
          variant='date'
          tillMinDate={ meta.minDate?new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes()
          ): null}
          selected={meta.customField && props.value ? moment.utc(props.value)?.toDate() : props.value}
          onChange={handleChange}
          disabled={!meta.editable}
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

                const parsedDate = moment(typedValue, dateFormat_ls)
                setTypedValue(undefined)
                if (parsedDate.isValid()) {
                  handleChange(parsedDate.toDate())
                }

              }
            }

            const handleTextClick = () => {
              setHasPickerPlacementTop(window.innerHeight - (inputRef.current?.getBoundingClientRect()?.bottom || 0) < 258)
              setHasPickerPlacementRight(window.innerWidth - (inputRef.current?.getBoundingClientRect()?.right || 0) < 258)
              if(meta.editable){
                setOpen(o => !o) 
              }
                
            }

            return <div ref={inputRef} style={{right: '0'}}>
              <TextInput
                value={typedValue !== undefined ? typedValue :
                  (props.value &&
                    (meta.customField ?
                      moment.utc(props.value).tz(timezone_ls).format(dateFormat_ls)
                      : moment(props.value).format(dateFormat_ls)))}
                onClick={handleTextClick}
                required={meta.required}
                // readOnly={open}
                variant='withIcon'
                iconVariant='calendar'
                onChange={handleTextChange}
                id={name}
                name={name}
                placeholder={meta.label}
                label={meta.label}
                fullWidth
                onBlur={handleTextBlur}
                error={errors[name]}
                iconStyle={{ cursor: 'pointer' }}
                iconSize={16}
                onIconClick={handleTextClick}
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

export default DatePickerFormField