import React, { Fragment, useEffect, useState } from 'react'
import Checkbox from '../../Checkbox'
import {
  CheckBoxLabel,
  StyledColorCircle
} from '../../Checkbox/Checkbox.styled'
import { IOption, ISettingOption, ISubComponent } from '../interface'
import { StyledSettingOption } from '../StyledSettingBox'

const CheckboxOption = ({
  settingOption,
  onChange,
  settingConfig,
  checkboxSubOption,
  heatMap
}: ISubComponent) => {
  const [settings, setSettingOptions] = useState<ISettingOption>(settingOption)
  const [options, setOptions] = useState(
    checkboxSubOption || settingOption?.option
  )
  // for hatmap and marker- map mode , if both the values  dont have permission,dont show section or else show whatever have permission
  const { permission = true } = settings

  useEffect(() => {
    setSettingOptions(settingOption)
    setOptions(checkboxSubOption)
  }, [settingOption, checkboxSubOption])

  const handleChange = (isChecked: boolean, entry: IOption) => {
    // once we change the parent we have to change whole data and send to parent settingbody
    // update parent radio selection in object
    const newOption = options.map((option: IOption) => {
      option.checked = option.id === entry.id ? isChecked : !!option.checked
      return option
    })
    setOptions(newOption)
    const toggleOption = { ...settings, option: newOption }
    setSettingOptions({ ...settings, option: newOption })
    // new option group will be updated in setting config to pass it to map
    const newSetting = settingConfig.map((option: ISettingOption) =>
      option.title === toggleOption.title ? toggleOption : option
    )

    // updated data config will be sent to body to send it to map component
    onChange(newSetting)
  }

  return settings.title && permission ? (
    <StyledSettingOption>
      <div className='title'>{settings.label || settings.title}</div>
      <div style={{ marginTop: '25px' }}>
        {options.map(({ image, permission = true, ...entry }: IOption) => {
          return permission ? (
            <div
              key={`${entry?.value}-${entry?.color}-${entry?.id}`}
              style={{
                marginLeft: '0.5em',
                marginBottom: '0.5em',
                marginTop: '0.5em'
              }}
            >
              <Checkbox
                id={entry.id}
                onChange={(_e) => {
                  handleChange(!entry.checked, entry)
                }}
                disabled={!!entry.disabled}
                checked={!!entry.checked}
                label=''
                checkboxSize={12}
                color={heatMap ? '#979797' : entry?.color}
                customStyle='border-radius:2px;'
                labelComponent={
                  <Fragment>
                    <StyledColorCircle
                      color={entry?.color}
                      disabled={!!entry.disabled}
                      checkboxSize='md'
                      checked={!!entry.checked}
                    />
                    <CheckBoxLabel
                      style={{ fontSize: '13px', marginBottom: '0.5em' }}
                      htmlFor={entry.id}
                    >
                      {`${entry.value} 
                      ${entry?.extraInfo ? `(${entry?.extraInfo})` : ''}`}
                    </CheckBoxLabel>
                  </Fragment>
                }
              />
            </div>
          ) : null
        })}
      </div>
    </StyledSettingOption>
  ) : null
}
export default CheckboxOption
