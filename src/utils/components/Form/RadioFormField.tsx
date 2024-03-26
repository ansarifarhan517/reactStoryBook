import React from 'react'
import { RadioGroup, Grid, Radio } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"
import { errorTypeMapping } from './FormField'

const RadioFormField = ({
  formInstance: { register, errors },
  meta, name, validationRules }: ISpecificFormFieldProps) => {
  
  return <RadioGroup id={name} variant='form' label={meta.label}
    required={meta.required}
    error={errors[name]}
    errorMessage={errors[name]?.type === 'pattern' ? errors[name]?.message : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
  >
    <Grid container>
      {meta?.options?.map((option) =>{
      
       return (
        <Grid item key={option}>
          {/* <input type='radio'
            id={option}  name={name} value={option}
            ref={register}
            defaultChecked={i===0}
          />
          <label htmlFor={option}>{option}</label> */}
          <Radio id={option} label={option} name={name} value={option} radioSize='md'
            style={{ fontSize: '12px' }}
            defaultChecked={option === meta?.value}
            color='inherit'
            // defaultChecked={i === 0}
            ref={register(validationRules)}
            disabled={!meta.editable}

          />
        </Grid>
      )})}
    </Grid>
  </RadioGroup >

}

export default RadioFormField