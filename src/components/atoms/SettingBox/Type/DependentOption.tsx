import React, { useState, Fragment } from 'react'
import { ISettingOption, IOption, ISubComponent } from '../interface'
import { StyledSettingOption, StyledImage } from '../StyledSettingBox'
import Radio from '../../../atoms/Radio'
import RadioGroup from '../../RadioGroup'
import { RadioLabel } from '../../Radio/Radio.styled'

const DependentOption = ({
  settingOption,
  onChange,
  settingConfig
}: ISubComponent) => {
  const [settings, setSettings] = useState<ISettingOption>(settingOption)
  const [parentRadioSelection, setParentRadioSelection] = useState<
    IOption | undefined
  >(settings.option.find((selectedOption: IOption) => selectedOption.selected))

  // for hatmap and marker- map mode , if both the values  dont have permission,dont show section or else show whatever have permission
  const { permission = true } = settings

  const handleParentChange = (entry: IOption) => {
    // set the selected parent option so that we can choose child option on the basis of that
    setParentRadioSelection(entry)
    // once we change the parent we have to change whole data and send to parent settingbody
    // update parent radio selection in object
    const newOption = settings.option.map((option: IOption) => {
      option.selected = option.name === entry.name
      return option
    })
    const ParentOption = { ...settings, option: newOption }
    setSettings(ParentOption)

    // new option group will be updated in setting config to pass it to map
    const newSetting = settingConfig.map((option: ISettingOption) =>
      option.title === ParentOption.title ? ParentOption : option
    )
    // updated data config will be sent to body to send it to map component
    onChange(newSetting)
  }

  const handleChildChange = (subOptions: IOption) => {
    const newSubOption = parentRadioSelection?.subOptions?.map(
      (option: IOption) => {
        option.selected = option.name === subOptions.name
        return option
      }
    )
    // child selection updating
    const newOption = {
      ...parentRadioSelection,
      subOptions: newSubOption,
      selected: true
    }
    // parent selection updating with child
    const newSettingOption = settings.option.map((option: IOption) =>
      option.name === parentRadioSelection?.name ? newOption : option
    )
    // whole dependent varaint updating
    const ParentOption = { ...settings, option: newSettingOption }
    setSettings(ParentOption)

    // new option group will be updated in setting config to pass it to map
    const newSetting = settingConfig.map((option: ISettingOption) =>
      option.title === ParentOption.title ? ParentOption : option
    )
    // updated data config will be sent to body to send it to map component
    onChange(newSetting)
  }

  return permission ? (
    <div>
      <StyledSettingOption>
        <div className='title'>
          {settingOption.label || settingOption.title}
        </div>
        <RadioGroup
          id='parentRadioGroup'
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
                <Radio
                  id={entry.name}
                  onChange={() => handleParentChange(entry)}
                  disabled={entry.disabled}
                  checked={entry.selected}
                  name={entry.label || entry.name}
                  value={entry.name}
                  label={entry.name}
                  radioSize={13}
                  labelColor='black'
                  labelComponent={
                    <Fragment>
                      <StyledImage src={image} />
                      <RadioLabel
                        style={{ fontSize: '13px' }}
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
          })}
        </RadioGroup>
      </StyledSettingOption>
      <StyledSettingOption>
        <div className='title'> {parentRadioSelection?.title}</div>
        <RadioGroup
          id='childRadioGroup'
          orientation
          spacing={10}
          variant='default'
          width='400px'
          label={parentRadioSelection?.title}
          labelColor='black'
        >
          {parentRadioSelection?.subOptions?.map(
            ({ image, ...suboptions }: IOption) => {
              return (
                <div key={suboptions.name}>
                  <Radio
                    id={suboptions.name}
                    key={suboptions.name}
                    onChange={() => handleChildChange(suboptions)}
                    disabled={suboptions.disabled}
                    checked={suboptions.selected}
                    name={suboptions.name}
                    value={suboptions.name}
                    label={suboptions.name}
                    radioSize={13}
                    labelColor='black'
                    labelComponent={
                      <Fragment>
                        <StyledImage src={image} />
                        <RadioLabel
                          style={{ fontSize: '13px' }}
                          htmlFor={suboptions.name}
                          color='black'
                        >
                          {suboptions.name}
                        </RadioLabel>
                      </Fragment>
                    }
                  />
                </div>
              )
            }
          )}
        </RadioGroup>
      </StyledSettingOption>
    </div>
  ) : null
}
export default DependentOption
