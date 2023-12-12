import React, { Fragment, useEffect, useState } from 'react'
import { useLeaflet } from 'react-leaflet'
import { ISettingBox, ISettingOption } from './interface'
import { StyledBody } from './StyledSettingBox'
import {
  CheckboxOption,
  DependentOption,
  RadioOption,
  ToggleOption
} from './Type'

const SettingBody = ({
  settings,
  onChange,
  isOpenStreet,
  heatMap
}: ISettingBox) => {
  const [_settingOption, setSettingOption] = useState(settings)
  const { map } = useLeaflet()

  useEffect(() => {
    setSettingOption(settings)
    if (map) {
      // disable zoom option when u click on legend
      map?.doubleClickZoom.disable()
      map?.boxZoom.disable()
      map?.scrollWheelZoom.disable()
      map?.dragging.disable()
    }
  }, [settings, map])

  const body = _settingOption?.map((options: ISettingOption, index: number) => {
    const OptionType = {
      radio: (
        <RadioOption
          key={options.title + index}
          settingOption={options}
          settingConfig={_settingOption}
          onChange={(newSetting: Array<ISettingOption>) => onChange(newSetting)}
          disabled={isOpenStreet}
          listOfDisabledTitle={['Map Theme']}
        />
      ),
      toggle: (
        <ToggleOption
          key={options.title + index}
          settingOption={options}
          settingConfig={_settingOption}
          disabled={isOpenStreet}
          onChange={(newSetting: Array<ISettingOption>) => onChange(newSetting)}
          listOfDisabledTitle={['Point of interest', 'Traffic']}
        />
      ),
      dependent: (
        <DependentOption
          key={options.title + index}
          settingOption={options}
          settingConfig={_settingOption}
          onChange={(newSetting: Array<ISettingOption>) => onChange(newSetting)}
        />
      ),
      checkbox: (
        <CheckboxOption
          key={options.title + index}
          settingOption={options}
          checkboxSubOption={options.option}
          settingConfig={_settingOption}
          onChange={(newSetting: Array<ISettingOption>) => onChange(newSetting)}
          heatMap={heatMap}
        />
      )
    }
    return (
      <Fragment key={options.title + index}>
        {OptionType[options.type] || ''}
      </Fragment>
    )
  })
  return <StyledBody id='settingBody'>{body}</StyledBody>
}
export default SettingBody
