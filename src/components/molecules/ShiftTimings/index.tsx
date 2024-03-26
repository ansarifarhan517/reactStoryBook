import React, { useState } from 'react'
// import IconButton from '../../atoms/IconButton'
import TimePicker from './components/TimePicker'
import { IShiftTimingsProps, IShiftTimingStateInterface } from './interfaces'
import Position from '../../molecules/Position'
import {
  ShiftTimingSetStyled,
  ShiftTimingsContainer,
  IconButtonStyled
} from './styled'
import Grid from '../../atoms/Grid'
import InputLabel from '../InputLabel'

const defaultArray = [
  {
    id: new Date().getTime().toString(),
    fromValue: undefined,
    toValue: undefined
  }
]

const ShiftTimings = ({
  fromLabel,
  toLabel,
  fromError,
  toError,
  fromErrorMessage,
  toErrorMessage,
  timeFormat = 24,
  timeInterval = 15,
  onFromChange = () => {},
  onToChange = () => {},
  onRemove = () => {},
  onAdd = () => {},
  onChange = () => {},
  selected = defaultArray,
  stringToTime,
  timeToString,
  label = '',
  labelColor,
  required = false,
  id = '',
  maxSlabAllowed = Number.MAX_VALUE,
  ...rest
}: IShiftTimingsProps) => {
  const [shiftTimings, setShiftTimings] = useState<IShiftTimingStateInterface>({
    shiftTimingArray: selected,
    id: '',
    time: undefined
  })

  React.useEffect(() => {
    setShiftTimings({
      ...shiftTimings,
      shiftTimingArray: selected || defaultArray
    })
  }, [selected])

  React.useEffect(() => {
    onChange(
      'event',
      shiftTimings.id,
      shiftTimings.time,
      shiftTimings.shiftTimingArray
    )
  }, [shiftTimings])

  const handleTimeChange = (
    id: string,
    date: Date | [Date, Date] | undefined
  ) => {
    const time = Array.isArray(date)
      ? date[0]
      : date === null
      ? undefined
      : date
    const from = id.substring(0, 4) === 'From'
    const shiftTimingsId =
      id.substring(0, 4) === 'From'
        ? id.slice(4, id.length)
        : id.slice(2, id.length)
    setShiftTimings({
      id: id,
      time: time,
      shiftTimingArray: shiftTimings.shiftTimingArray.map((item) =>
        item.id === shiftTimingsId
          ? {
              id: item.id,
              fromValue: from ? time : item.fromValue,
              toValue: !from ? time : item.toValue
            }
          : { ...item }
      )
    })
  }
  const handleRemove = (id: string) => {
    shiftTimings.shiftTimingArray.length > 1 &&
      setShiftTimings({
        ...shiftTimings,
        shiftTimingArray: shiftTimings.shiftTimingArray.filter((item) => {
          return item.id !== id ? item : null
        })
      })
  }
  const handleAdd = () => {
    const temp = {
      id: new Date().getTime().toString(),
      fromValue: undefined,
      toValue: undefined
    }
    setShiftTimings({
      ...shiftTimings,
      shiftTimingArray: [...shiftTimings.shiftTimingArray, temp]
    })
  }
  return (
    <Position type='relative' display='block' {...rest}>
      <ShiftTimingsContainer>
        {shiftTimings.shiftTimingArray.map(
          ({ id, fromValue, toValue }, index) => {
            return (
              <ShiftTimingSetStyled key={id}>
                <Grid
                  container
                  // spacing='5px'
                  style={{ display: 'flex', alignItems: 'center' }}
                  className='gridContainer'
                >
                  <Grid item xs={5}>
                    <TimePicker
                      label={fromLabel}
                      error={fromError?.[index]}
                      errorMessage={fromErrorMessage?.[index]}
                      placeholder='From'
                      required={required}
                      // textInputWidth={textInputWidth}
                      timeFormat={timeFormat}
                      timeInterval={timeInterval}
                      id={'From' + id}
                      time={fromValue || undefined}
                      onChange={(id, time) => {
                        handleTimeChange(id, time)
                      }}
                      stringToTime={stringToTime}
                      timeToString={timeToString}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TimePicker
                      label={toLabel}
                      error={toError?.[index]}
                      errorMessage={toErrorMessage?.[index]}
                      placeholder='To'
                      // textInputWidth={textInputWidth}
                      timeFormat={timeFormat}
                      timeInterval={timeInterval}
                      id={'To' + id}
                      time={toValue || undefined}
                      onChange={(id, time) => {
                        handleTimeChange(id, time)
                      }}
                      stringToTime={stringToTime}
                      timeToString={timeToString}
                      required={required}
                    />
                  </Grid>
                  {shiftTimings.shiftTimingArray.length > 1 && (
                    <Grid item xs={1}>
                      <IconButtonStyled
                        onClick={() => {
                          handleRemove(id || new Date().getTime().toString())
                          onRemove('remove-' + id)
                        }}
                        onlyIcon
                        iconVariant='close'
                        iconSize={10}
                        hoverFeedback={false}
                        color='error.main'
                        id={'remove' + id}
                      />
                    </Grid>
                  )}
                  {shiftTimings?.shiftTimingArray?.length - 1 === index &&
                    shiftTimings?.shiftTimingArray?.length < maxSlabAllowed && (
                      <Grid item xs={1}>
                        <IconButtonStyled
                          onClick={() => {
                            handleAdd()
                            onAdd('add-' + id)
                          }}
                          hoverFeedback={false}
                          onlyIcon
                          iconVariant='add'
                          iconSize={10}
                          color='primary.main'
                          id={'add' + id}
                        />
                      </Grid>
                    )}
                </Grid>
              </ShiftTimingSetStyled>
            )
          }
        )}
      </ShiftTimingsContainer>
      <Position
        type='absolute'
        top='-8px'
        left='10px'
        style={{ maxWidth: 'calc(100% - 20px)' }}
      >
        <InputLabel
          // required={required}
          color={labelColor}
          id={`${id}-label`}
          // className={`${className}-label`}
        >
          {label}
        </InputLabel>
      </Position>
    </Position>
  )
}

export default ShiftTimings
