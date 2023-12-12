import { ReactNode } from 'react'
import { IMultiSelectOptions as tYearArray } from '../MultiSelect/interfaces'

export interface ITimeWindowPrefrencesDropdown {
  id: string /* unit */
  label: string /* Units */
  value: string /* Units */
  availableSlotObjectKey: string /* availableNumberOfItems */
  totalSlotObjectKey: string /* totalNumberOfItems */
}

export interface ISlots {
  startTimeWindow: number
  endTimeWindow: number
  dayOfWeek: string
  referenceId: string
  serviceZoneMasterId: number
  timeSlotCapacityId: number
  [key: string]: string | number
}

export interface IDateTimeSlots {
  date: number
  slots: ISlots[]
}

export interface IDateTimeSlotPickerStatus {
  available: {
    id: string
    value: string
    label: string
  }
  notAvailable: {
    id: string
    value: string
    label: string
  }
}

export interface IMonthsArray {
  label: string
  value: string
}
export interface IDateTimeSlotPickerChildren {
  value: ISlotPickerValue | undefined
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface IDateTimeSlotPicker {
  date: Date
  timeWindowPrefrenceDropdown: ITimeWindowPrefrencesDropdown[]
  DateTimeSlots: IDateTimeSlots[] | undefined
  status: IDateTimeSlotPickerStatus
  children: ({ value, open, setOpen }: IDateTimeSlotPickerChildren) => ReactNode
  isOpen: boolean
  months?: IMonthsArray[]
  years?: tYearArray[]
  title?: string
  preferenceDropdownLabel?: string
  style?: React.CSSProperties
  onChange: (value: ISlotPickerValue) => void
  ApplyLabel?: string
  CancelLabel?: string
}

export interface IHighlightDates {
  available: Date[]
  notAvailable: Date[]
}
export interface IStyledStatusColorProps {
  color: string
  selected: boolean
}
export interface ISlotPickerDateObject {
  startTimeWindow: number
  endTimeWindow: number
}

export interface ISlotSelected {
  selected: boolean
}

export interface ISlotPickerValue {
  startTimeWindow: Date
  endTimeWindow: Date
}
