import { IMultiSelectOptions as tYearArray } from '../MultiSelect/interfaces'
import { createArrayofObjects } from '../DatePicker/Utils/functions'

export const defaultStatus = {
  available: {
    id: 'available',
    value: 'AVAILABLE',
    label: 'Suggested'
  },
  notAvailable: {
    id: 'notAvailable',
    value: 'FULL',
    label: 'notSuggested'
  }
}

export const year: tYearArray[] = createArrayofObjects(
  new Date().getFullYear() - 70,
  new Date().getFullYear() + 30
)

export const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' }
]

export const TodaysDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
)

export const highlightWithRanges = [
  {
    'react-datepicker__day--homeDate': [TodaysDate]
  }
]
