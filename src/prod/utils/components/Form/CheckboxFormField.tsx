import React from 'react'
// import { CheckboxFieldGroup, Checkbox } from 'ui-library'
import { Checkbox, Box } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { Controller } from 'react-hook-form'

const CheckboxFormField = ({
  formInstance: { control }, name, meta }: ISpecificFormFieldProps) => {

  return (
    // <CheckboxFieldGroup id={name} label={meta.label}
    //   variant='form'
    //   required={meta.required}
    //   errorMessage={meta.validation?.required?.message}
    // >
    <Box display='flex' alignItems='center' fullHeight>
      <Controller
        control={control}
        name={name}
        render={props => {
          const handleChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
            props.onChange(checked ? 'Y' : 'N')
          }
          return <Checkbox
            id={name}
            label={meta.label}
            checked={props.value === 'Y'}
            checkboxSize='md'
            disabled={!meta.editable}
            onChange={handleChange}
          />
        }}
      />
    </Box>
    // </CheckboxFieldGroup>
  )
}

export default CheckboxFormField