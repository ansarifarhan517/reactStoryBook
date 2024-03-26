import React from 'react';
import { Controller, UseFormMethods, ValidationRules } from 'react-hook-form';
import { DropDown } from 'ui-library';
import { errorTypeMapping } from '../../../../utils/components/Form/FormField';
import { IMongoField } from '../../../../utils/mongo/interfaces';

interface IDropdownProps {
    name: string
    meta: IMongoField
    dropdownOptions: any[]
    requiredError?: boolean
    formInstance: UseFormMethods
    handleChange: (value: string) => void
    handleMenuOpen: () => void
    handleMenuClose: () => void
    menuIsOpen?: boolean
    isDropdownLoading?: boolean
}
const DropDownComponent = ({name,
    meta,
    dropdownOptions,
    requiredError,
    formInstance: { control, errors },
    handleChange,
    handleMenuOpen,
    handleMenuClose,
    menuIsOpen,
    isDropdownLoading
    } : IDropdownProps) => {
        const registerValidationRules = React.useMemo(() => {
            const obj: ValidationRules = {
              required: meta.required,
              maxLength: Number(meta.validation?.maxlength?.args),
              minLength: Number(meta.validation?.minlength?.args),
              min: Number(meta.validation?.min?.args),
              max: Number(meta.validation?.max?.args),
            }
            return obj
        }, [meta])

        return(<Controller
            name={name}
            control={control}
            rules={registerValidationRules}
            formInstance
            render={props => {
            return (
                <DropDown
                    required={meta.required}
                    placeholder={meta.label}
                    label={meta.label}
                    variant={'form-select'}
                    onChange={(value: string) => {
                          handleChange(value);
                    }}
                    optionList={dropdownOptions}
                    loading={isDropdownLoading}
                    error={requiredError || errors[name]}
                    errorMessage={requiredError ? `${meta.label} is mandatory` : meta.validation?.[errorTypeMapping[errors[name]?.type]]?.message}
                    value={meta.customField ? props?.value : props?.value?.id}
                    isMenuOpen={menuIsOpen}
                    width={'100%'}
                    onMenuOpen={handleMenuOpen}
                    onMenuClose={handleMenuClose}
                    disabled={!meta.editable}
                    limitOptionsList={50}
                />
            )
        }}
        />)
}

export default DropDownComponent