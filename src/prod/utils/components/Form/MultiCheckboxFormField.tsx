import React from 'react'
import { CheckboxFieldGroup, Checkbox, Grid } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { Controller } from 'react-hook-form'

const MultiCheckboxFormField = ({
  formInstance: { control, errors },
  validationRules,
  meta, name }: ISpecificFormFieldProps) => {

  return (
    <Controller
      control={control}
      name={name}
      defaultValue=''
      rules={validationRules}
      render={props => {

        const optionMap: Record<string, boolean> = {}
        if (props.value) {

          props.value?.split(',').forEach((label: string) => {
            optionMap[label] = true
          })
        }

        return <CheckboxFieldGroup id={name} label={meta.label}
          variant='form'
          required={meta.required}
          error={errors[name]}
          errorMessage={meta.validation?.required?.message}
        >

          <Grid container>
            {meta.options?.map((option) => {
              const optionParsed = JSON.parse(option)

              return (
                <Grid item key={optionParsed.label}>

                  <Checkbox
                    id={optionParsed.label}
                    label={optionParsed.label}
                    checked={optionMap[optionParsed.label]}
                    checkboxSize='md'
                    disabled={optionParsed.disabled || false}
                    onChange={({ target: { checked } }) => {
                      if (!checked) {
                        delete optionMap[optionParsed.label]
                      } else {
                        optionMap[optionParsed.label] = true
                      }

                      props.onChange(Object.keys(optionMap).join(','))
                    }}
                  />

                </Grid>
              )
            })}
          </Grid>
        </CheckboxFieldGroup>
      }}
    />)
}


export default MultiCheckboxFormField