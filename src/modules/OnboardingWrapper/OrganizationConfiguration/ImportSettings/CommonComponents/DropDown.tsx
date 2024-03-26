import React from 'react';
import { DropDown } from 'ui-library';

interface IOptionField {
    value: string, 
    label: string,
    title?: string,
    description?: string
}

interface IDropDown {
    variant: string,
    optionList: Array<IOptionField>
    label?: string
    required?: boolean,
    loading?: boolean,
    onChange: Function,
    error?: boolean,
    errorMessage?: string,
    placeholder: string | undefined,
    value: string,
    width: string,
    onMenuOpen?: boolean
    onMenuClose?: boolean
    showDescription?: string
    tooltipMessage?: string
    disabled?: boolean 
}

const DropDownComponent = ({
    variant,
    optionList,
    label,
    required,
    loading = false,
    onChange,
    error,
    errorMessage,
    placeholder,
    value,
    width,
    onMenuOpen,
    onMenuClose,
    showDescription,
    tooltipMessage,
    disabled     
} : IDropDown) => {
    return (
        <DropDown
            variant={variant}
            optionList={optionList}
            label={label}
            required={required}
            loading={loading}
            onChange={onChange}
            error={error}
            errorMessage={errorMessage}
            placeholder={placeholder}
            value={value}
            width={width}
            onMenuOpen={onMenuOpen}
            onMenuClose={onMenuClose}
            showDescription={showDescription}
            tooltipMessage={tooltipMessage}
            disabled={disabled}
        />
    )
}

export default DropDownComponent;