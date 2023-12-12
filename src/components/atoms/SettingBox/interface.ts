export interface ISettingBox {
  onChange: (newSetting: Array<ISettingOption>) => void
  width?: string
  settings?: Array<ISettingOption>
  isOpenStreet: boolean
  heatMap: boolean
}
export interface ISettingInputOption {
  [name: string]: ISettingOption
}
export type tMapButton = 'apply' | 'save'
export interface ISetting {
  onChange: (option: ISettingInputOption) => void
  width?: string
  settingOption: ISettingInputOption
  isOpenStreet?: boolean
  showModal: boolean
  handleShowModal: (showModal: boolean) => void
  setMarkers: (legends: any) => void
  heatMap: boolean
  settingButtonTitle?: string
  onSettingChange?: ((newSetting: any, type: tMapButton) => void) | undefined
  legend?: any
  setFocusSearchPlace: (isFocusedSearchPlace: boolean) => void
  geocoding?: any
}

export interface ISettingOption {
  title: string
  type: string
  option: Array<IOption>
  permission?: boolean
  label?: string
}
export interface IOption {
  name?: string
  selected?: boolean
  image?: any
  disabled?: boolean
  subOptions?: Array<IOption>
  title?: string
  id?: string
  color?: string
  checked?: boolean
  value?: string
  allow?: any
  permission?: boolean
  extraInfo?: any
  enablingToasterMessage?: string
  disablingToasterMessage?: string
  label?: string
}

export interface ISubComponent {
  settingOption: ISettingOption
  settingConfig: Array<ISettingOption>
  onChange: (settingConfig: Array<ISettingOption>) => void
  disabled?: boolean
  listOfDisabledTitle?: Array<string>
  checkboxSubOption?: any
  heatMap?: boolean
}
