import React, { Fragment, useState } from 'react'
import Radio from '../../../atoms/Radio'
import { RadioLabel } from '../../Radio/Radio.styled'
import RadioGroup from '../../RadioGroup'
import { IOption, ISettingOption, ISubComponent } from '../interface'
import { StyledImage, StyledSettingOption } from '../StyledSettingBox'

const RadioOption = ({
  settingOption,
  onChange,
  settingConfig,
  disabled,
  listOfDisabledTitle = []
}: ISubComponent) => {
  const [settings, setSettingOptions] = useState<ISettingOption>(settingOption)
  // for hatmap and marker- map mode , if both the values  dont have permission,dont show section or else show whatever have permission
  const { permission = true } = settings

  const handleChange = (entry: IOption) => {
    // once we change the parent we have to change whole data and send to parent settingbody
    // update parent radio selection in object
    const newOption = settings.option.map((option: IOption) => {
      option.selected = option.name === entry.name
      return option
    })

    const radioOptionGroup = { ...settings, option: newOption }
    setSettingOptions(radioOptionGroup)
    // new option group will be updated in setting config to pass it to map
    const newSetting = settingConfig.map((option: ISettingOption) =>
      option.title === radioOptionGroup.title ? radioOptionGroup : option
    )
    // updated data config will be sent to body to send it to map component
    onChange(newSetting)
  }

  return permission ? (
    <StyledSettingOption
      disabled={disabled && listOfDisabledTitle.includes(settings.title)}
    >
      <div className='title'>{settings.label || settings.title}</div>
      <RadioGroup
        id='radio'
        orientation
        spacing={10}
        variant='default'
        width='400px'
        label={settings.title}
        labelColor='black'
      >
        {settings.option.map(
          ({ image, permission = true, ...entry }: IOption, index: number) => {
            if (permission) {
              return (
                <div key={`${entry?.name}-${index}-${entry?.id}`}>
                  <Radio
                    id={entry.name}
                    onChange={() => handleChange(entry)}
                    disabled={
                      disabled && listOfDisabledTitle.includes(settings.title)
                    }
                    checked={entry.selected}
                    name={entry.name}
                    value={entry.name}
                    label={entry.label || entry.name}
                    radioSize={13}
                    labelColor='black'
                    labelComponent={
                      <Fragment>
                        <StyledImage src={image} />
                        <RadioLabel
                          style={{ fontSize: '13px', marginBottom: '6px' }}
                          htmlFor={entry.name}
                          color='black'
                        >
                          {entry.label || entry.name}
                        </RadioLabel>
                      </Fragment>
                    }
                  />
                </div>
              )
            } else return <Fragment />
          }
        )}
      </RadioGroup>
    </StyledSettingOption>
  ) : null
}
export default RadioOption
