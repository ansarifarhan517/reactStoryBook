import React, { Dispatch } from 'react'
import { ISpecificFormFieldProps } from './interface'
import { ShiftTimings, IShiftTimingsObject, TextInput, IconButton } from 'ui-library'
import { Controller } from 'react-hook-form'
import moment from 'moment-timezone'
import { tGlobalPopupAction } from '../../../modules/common/GlobalPopup/GlobalPopup.reducer'
import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../redux/rootReducer'
import { errorTypeMapping } from './FormField'

const timeToString = (d: Date | undefined) => {
  return moment(d).format('HH:mm')
}

const stringToTime = (timeString: string) => {
  return moment(timeString, 'HH:mm')?.toDate()
}

const cursorStyle = { cursor: 'pointer' }
const ShiftTimingFormField = ({
  name,
  timeInterval,
  meta: { label, validation, required },
  formInstance: { control, errors },
  validationRules,
  requiredError,
}: ISpecificFormFieldProps) => {
  const popupDispatch = useDispatch<Dispatch<tGlobalPopupAction>>()
  const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

  return (
    <Controller control={control} name={name} rules={validationRules}
      render={(props) => {
        const [shiftArray, setShiftArray] = React.useState<IShiftTimingsObject[] | undefined>(props.value)
        const [draftShiftArray, setDraftShiftArray] = React.useState<IShiftTimingsObject[] | undefined>(props.value)

        React.useEffect(() => {
          setShiftArray(props.value)
          setDraftShiftArray(props.value)
        }, [props.value])

        /** Create so that handleOk() always gets the latest value */
        const draftShiftArrayRef = React.useRef<IShiftTimingsObject[] | undefined>(draftShiftArray)

        React.useEffect(() => {
          draftShiftArrayRef.current = draftShiftArray
        }, [draftShiftArray])

        const displayValue = React.useMemo(() => {
          return shiftArray?.map((shift: IShiftTimingsObject) =>
            `${moment(shift.fromValue).format('HH:mm')}-${moment(shift.toValue).format('HH:mm')}`)
            .join(', ') || ''
        }, [shiftArray])

        const areTimeSlotsEqual = (slot1: Date | undefined, slot2: Date | undefined) => {
          return slot1?.getHours() === slot2?.getHours() && slot1?.getMinutes() === slot2?.getMinutes()
        }

        const handleOk = () => {
          const _shiftArray = draftShiftArrayRef.current?.filter((shift, i) =>
            shift.fromValue && shift.toValue &&
            draftShiftArrayRef.current?.findIndex((s, j) => {
              return j > i && areTimeSlotsEqual(shift.fromValue, s.fromValue) && areTimeSlotsEqual(shift.toValue, s.toValue) && shift.id !== s.id
            }
            ) === -1)

          setShiftArray(_shiftArray && _shiftArray.length && (_shiftArray[0].fromValue && (_shiftArray[0].toValue)) ? _shiftArray : undefined)
          props.onChange(_shiftArray)
          popupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })
        }

        const handleIconClick = () => {
          popupDispatch({
            type: '@@globalPopup/SET_PROPS', payload: {
              isOpen: true,
              title: label,
              content: <ShiftTimingModal
                value={shiftArray}
                onChange={setDraftShiftArray}
                timeInterval={timeInterval}
              />,
              footer: <>
                <IconButton iconVariant='icomoon-tick-circled' primary onClick={handleOk}>{dynamicLabels.ok}</IconButton>
                <IconButton iconVariant='icomoon-close' onClick={() => popupDispatch({ type: '@@globalPopup/CLOSE_POPUP' })}>{dynamicLabels.cancel}</IconButton>
              </>
            }
          })
        }

        return <TextInput
          title={displayValue}
          readOnly
          required={required}
          variant='withIcon'
          placeholder={label}
          value={displayValue}
          iconVariant='icomoon-add'
          iconSize={16}
          onIconClick={handleIconClick}
          onClick={handleIconClick}
          style={cursorStyle}
          iconStyle={cursorStyle}
          label={label}
          fullWidth
          error={requiredError || errors[name]}
          errorMessage={requiredError ? `${label} is mandatory`: errors[name]?.type === 'pattern' ? errors[name]?.message : validation?.[errorTypeMapping[errors[name]?.type]]?.message}
        />
      }} />
  )
}


interface IShiftTimingModalProps {
  value: IShiftTimingsObject[] | undefined
  onChange: (value: IShiftTimingsObject[] | undefined) => void
  timeInterval?: number
}

const ShiftTimingModal = ({ value, onChange, timeInterval }: IShiftTimingModalProps) => {
  const handleChange = (_: any, __?: string | undefined, ___?: Date | undefined, shiftTimingArray?: IShiftTimingsObject[] | undefined) => {
    /** If Empty 1st Row, No Shift Timing Array. Return Undefined */
    if ((shiftTimingArray?.length === 1 && !shiftTimingArray[0].fromValue && !shiftTimingArray[0].toValue) || !shiftTimingArray) {
      onChange(undefined)
      return
    }

    onChange(shiftTimingArray)
  }

  return <ShiftTimings
    fromLabel='From'
    toLabel='To'
    timeInterval={timeInterval || 30}
    timeToString={timeToString}
    stringToTime={stringToTime}
    selected={value?.length ? value : undefined}
    onChange={handleChange}
  />

}

export default ShiftTimingFormField