import React from 'react'
import { Controller } from 'react-hook-form'
import { Box, Toggle } from 'ui-library'
import { ISpecificFormFieldProps } from "./interface"

const ToggleFormField = ({
    formInstance: { control }, name, meta }: ISpecificFormFieldProps) => {
    return (
        <Box display='flex' alignItems='center' fullHeight mb='8px'>
            <Controller
                control={control}
                name={name}
                render={props => {
                    const handleChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
                        props.onChange(checked ? 'Y' : 'N')
                    }
                    return <Toggle
                        id={name}
                        label={meta.label}
                        checked={props.value === 'Y' || meta.value === 'Y'}
                        onChange={handleChange}
                        disabled={!meta.editable}

                    />
                }}
            />
        </Box>
    )

}

export default ToggleFormField
