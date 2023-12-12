import React from 'react'

import { ITimePickerProps } from '../../interfaces'
import TextInput from '../../../TextInput'
import { DatePicker } from '../../../DatePicker'
import { tDatePickerChildren } from '../../../DatePicker/interfaces'
import { TimePickerTextInputStyled } from './styled'

const parseTime = (timeString: string) => {
  const timeTokens = timeString.split(':')
  if (
    timeTokens.length === 2 &&
    !isNaN(Number(timeTokens[0])) &&
    !isNaN(Number(timeTokens[1]))
  ) {
    return new Date(`01/01/1970 ${timeTokens[0]}:${timeTokens[1]}:00`)
  }
  return undefined
}

const convertToString = (d: Date | undefined) =>
  d ? d.getHours() + ':' + d.getMinutes() : ''

const TimePicker = ({
  id,
  label,
  errorMessage,
  error,
  placeholder,
  timeFormat,
  timeInterval = 15,
  time,
  stringToTime = parseTime,
  timeToString = convertToString,
  onChange = () => {}
}: ITimePickerProps) => {
  const [typedValue, setTypedValue] = React.useState<string | undefined>()

  const handleTextChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTypedValue(e.target.value)
    },
    [setTypedValue]
  )

  const handleTextBlur = () => {
    if (typedValue !== undefined) {
      if (typedValue === '') {
        onChange(id, undefined)
        return
      }

      const parsedTime = stringToTime(typedValue)
      setTypedValue(undefined)
      if (parsedTime) {
        onChange(id, parsedTime)
      }
    }
  }

  return (
    <TimePickerTextInputStyled className='Apna-wrapper'>
      <DatePicker
        onChange={(date) => onChange(id, date)}
        label={label}
        variant='time'
        timeInterval={timeInterval}
        timeFormat={timeFormat}
        selected={time}
        style={{
          position: 'absolute',
          top: '60px',
          right: 'auto',
          zIndex:
            '1000' /* not able to add from theme here, added directly just because it was urgent */
        }}
      >
        {({ value, open, setOpen }: tDatePickerChildren) => {
          return (
            <TextInput
              id={id}
              label={label}
              error={error}
              errorMessage={errorMessage}
              className='someClassname'
              placeholder={placeholder}
              variant='withIcon'
              iconVariant='clock-history-outline'
              iconSize={25}
              iconStyle={{
                lineHeight: '16px',
                fontSize: '15px',
                cursor: 'pointer'
              }}
              onIconClick={() => setOpen(!open)}
              //do not change the content-box to border box
              style={{ boxSizing: 'content-box', minHeight: '38px' }}
              // iconSize='md'
              value={
                typedValue !== undefined
                  ? typedValue
                  : value && timeToString(value)
              }
              // iconStyle={{ padding: '9px 9px 9px 9px' }}
              onClick={() => setOpen(!open)}
              fullWidth
              onChange={handleTextChange}
              onBlur={handleTextBlur}
            />
          )
        }}
      </DatePicker>
    </TimePickerTextInputStyled>
  )
}
export default TimePicker