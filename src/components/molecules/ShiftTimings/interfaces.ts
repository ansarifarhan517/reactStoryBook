import { ITextInputProps } from '../TextInput'
import { tTimeFormat } from '../DatePicker/interfaces'
export interface ICustomTextInputProps extends ITextInputProps {
  value?: string
  onClick?: () => void
  onlyTime?: boolean
  name?: string
  textInputWidth?: string
}

export interface IShiftTimingsObject {
  id?: string
  fromValue?: Date
  toValue?: Date
}
// export type tTimeFormat = '12Hr' | '24Hr'

export interface IShiftTimingsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timeFormat?: tTimeFormat
  timeInterval?: number
  label?: string
  labelColor?: string
  required?: boolean
  onFromChange?: (id?: string, time?: string) => void
  onToChange?: (id?: string, time?: string) => void
  onRemove?: (id: string) => void
  onAdd?: (id: string) => void
  onChange?: (
    event: any,
    id?: string,
    time?: Date,
    shiftTimingArray?: IShiftTimingsObject[]
  ) => void
  fromLabel?: string
  toLabel?: string
  fromError?: boolean
  toError?: boolean
  fromErrorMessage?: string
  toErrorMessage?: string
  selected?: IShiftTimingsObject[]
  stringToTime?: (dateString: string) => Date | undefined
  timeToString?: (d: Date | undefined) => string
}
export interface ITimePickerProps {
  id: string
  label?: string
  errorMessage?: string
  error?: boolean
  placeholder?: string
  textInputWidth?: string
  timeFormat: tTimeFormat
  timeInterval: number
  time?: Date
  onChange: (id: string, time: Date | [Date, Date] | undefined) => void
  stringToTime?: (dateString: string) => Date | undefined
  timeToString?: (d: Date | undefined) => string
}

export interface IShiftTimingStateInterface {
  shiftTimingArray: IShiftTimingsObject[]
  id: string
  time?: Date
}
