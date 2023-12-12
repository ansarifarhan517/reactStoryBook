import React, { useState, Fragment } from 'react'
import { ISettingOption, IOption, ISubComponent } from '../interface'
import { StyledSettingOption, StyledImage } from '../StyledSettingBox'
import Toggle from '../../../atoms/Toggle'
import RadioGroup from '../../RadioGroup'
import { SwitchLabel } from '../../Toggle/Toggle.styled'
import { RadioLabel } from '../../Radio/Radio.styled'

const ToggleOption = ({
  settingOption,
  onChange,
  settingConfig,
  listOfDisabledTitle,
  disabled
}: ISubComponent) => {
  const [settings, setSettingOptions] = useState<ISettingOption>(settingOption)
  // for hatmap and marker- map mode , if both the values  dont have permission,dont show section or else show whatever have permission
  const { permission = true } = settings

  const handleChange = (entry: IOption) => {
    // selected toggled selection has to be changed,keeping existing toggle object same
    const newOption = settings.option.map((option: IOption) => {
      option.selected =
        option.name === entry.name ? !entry.selected : option.selected
      return option
    })
    // update new toggle option
    const toggleOptionGroup = { ...settings, option: newOption }
    setSettingOptions(toggleOptionGroup)

    // new option group will be updated in setting config to pass it to map
    const newSetting = settingConfig.map((option: ISettingOption) =>
      option.title === toggleOptionGroup.title ? toggleOptionGroup : option
    )
    // updated data config will be sent to body to send it to map component
    onChange(newSetting)
  }

  return permission ? (
    <StyledSettingOption>
      <div className='title'>{settings.label || settings.title}</div>
      <RadioGroup
        id='toggle'
        orientation
        spacing={10}
        variant='default'
        width='400px'
        label={settingOption.title}
        labelColor='black'
      >
        {settings.option.map(({ image, ...entry }: IOption) => {
          return (
            <div key={entry.name}>
              <Toggle
                id={entry.name}
                label={entry.label || entry.name}
                labelColor='black'
                checked={entry.selected}
                onChange={(_e) => handleChange(entry)}
                labelComponent={
                  <Fragment>
                    <StyledImage src={image} />
                    <SwitchLabel
                      color='black'
                      id={`${entry.name}-label`}
                      style={{ fontSize: '13px' }}
                      disabled={
                        !!(
                          disabled &&
                          entry?.name &&
                          listOfDisabledTitle?.includes(entry?.name)
                        )
                      }
                    >
                      <RadioLabel
                        style={{ fontSize: '13px' }}
                        htmlFor={entry.name}
                        color='black'
                      >
                        {entry.label || entry.name}
                      </RadioLabel>
                      {/* <div style={{ color: 'black', fontSize: '13px' }}>
                        {entry.name}
                      </div> */}
                    </SwitchLabel>
                  </Fragment>
                }
                disabled={
                  !!(
                    disabled &&
                    entry?.name &&
                    listOfDisabledTitle?.includes(entry?.name)
                  )
                }
              />
            </div>
          )
        })}
      </RadioGroup>
    </StyledSettingOption>
  ) : null
}
export default ToggleOption
