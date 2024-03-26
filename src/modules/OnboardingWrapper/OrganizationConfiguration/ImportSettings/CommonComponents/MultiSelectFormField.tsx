import React, { useState, useEffect } from 'react';
import axios from '../../../../../utils/axios';
import { MultiSelect, TextInput, IMultiSelectOptions, Position, FontIcon, Tooltip } from 'ui-library';
import { fetchValueLabel } from '../Mappings/valueLabelMapping';
import { Controller, ValidationRules, UseFormMethods } from "react-hook-form";

interface IMultiSelectFormField {
    name: string,
    formInstance: UseFormMethods;
    validationRules?: ValidationRules
}

interface IMultiSelectDropDown extends IMultiSelectFormField  {
    id: string,
    apiUrl: string,
    label?: string;
    labelColor?: string;
    width?: string;
    isLoading?: boolean;
    isNoOption?: boolean;
    menuOpen?: boolean;
    selected?: Array<IMultiSelectOptions>;
    allowSelectAll?: boolean;
    maximumSelected?: number;
    defaultSelected?: Array<IMultiSelectOptions>;
    searchableKeys: Array<string>;
    placeholder?: string,
    error?: boolean;
    errorMessage?: string;
    disabled?: boolean;
}

const MultiSelectFormField = ({
    id,
    apiUrl,
    width,
    isLoading,
    isNoOption,
    menuOpen,
    selected,
    allowSelectAll,
    maximumSelected,
    defaultSelected,
    searchableKeys,
    label,
    labelColor,
    placeholder,
    error,
    errorMessage,
    disabled,
    formInstance: { control, setValue },
    name,
    validationRules
} : IMultiSelectDropDown) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            rules={validationRules}
            render={(_) => {
                const [options, setOptions] = useState<any>([]);
                const [optionsSelected, setOptionsSelected] = useState<any>([]);
                const [isMenuOpen, setIsOpenMenu] = useState<boolean>(false);
    
                const fetchOptions = async () => {
                    try {
                        let response = await axios.get(apiUrl);
                        let data = response?.data?.data;
                        
                        if(data === undefined) return;
            
                        let options = data?.map((option : any) => {
                            return fetchValueLabel(id, option);
                        });
            
                        setOptions(options);
                    } catch (err) {
                        console.log(`${apiUrl}: `,err);
                    }
                }

                const showMessage = () => {
                    if(optionsSelected && optionsSelected?.length > 0) {
                        let size = optionsSelected.length;
                        let message = "";
                        for(let optionIdx = 0; optionIdx < size; optionIdx++) {
                            if(optionIdx === size - 1) {
                                message = message + optionsSelected[optionIdx]?.label;
                            } else {
                                message = message + optionsSelected[optionIdx]?.label + ", ";
                            }
                        }
                        return message;
                    }
                    return "";
                }

                const processOptions = (selectedOption : any, type : string) => {
                    let newOptions = options.filter((option : any) => {
                        return option.value !== selectedOption.value && option.label !== selectedOption.label;
                    });
                    if(type === "top") {
                        return [selectedOption, ...newOptions];
                    }
                    return [...newOptions, selectedOption];
                }
            
                useEffect(() => {
                    fetchOptions();
                }, []);

                return (
                    <MultiSelect
                        id={id}
                        width={width}
                        options={options}
                        onChange={(event, value, isSelected, selectedOptions) => {
                            event;
                            value;
                            isSelected;
                            setValue(name, selectedOptions);
                            let size = selectedOptions?.length || 0;
                            let newSelectedOptions = options;
                            if(optionsSelected.length < size) {
                                if(size > 0 && selectedOptions) {
                                    newSelectedOptions = processOptions(selectedOptions[size - 1], "top");
                                }
                            } else {
                                let selectedOption = {};
                                for(let option of optionsSelected) {
                                    if(!selectedOptions?.includes(option)) {
                                        selectedOption = option;
                                        break;
                                    }
                                }
                                if(size > 0 && Object.keys(selectedOption).length > 0) {
                                    newSelectedOptions = processOptions(selectedOption, "bottom");
                                }                                
                            }
                            setOptions(newSelectedOptions);
                            setOptionsSelected(selectedOptions);
                        }}
                        style={{ position: 'absolute', top: 'auto', left: 'auto', width: "100%" }}
                        isLoading={isLoading}
                        isNoOption={isNoOption}
                        menuOpen={menuOpen}
                        selected={selected}
                        allowSelectAll={allowSelectAll}
                        maximumSelected={maximumSelected}
                        defaultSelected={defaultSelected}
                        searchableKeys={searchableKeys}
                    >
                        {({ optionSelected, isMenuOpen, openMenu }) => {
                            React.useMemo(() => {
                                setIsOpenMenu(isMenuOpen);
                            }, [isMenuOpen]);

                            return <Position type="relative">
                                <TextInput
                                    title={showMessage()}
                                    label={label}
                                    labelColor={labelColor}
                                    placeholder={placeholder}
                                    error={error}
                                    errorMessage={errorMessage}
                                    disabled={disabled}
                                    fullWidth
                                    onClick={() => openMenu(!isMenuOpen)}
                                    value={
                                        optionSelected && optionSelected?.length > 0
                                        ? optionSelected?.length + ' Selected'
                                        : 'Select'
                                    }
                                    onChange={() => {}}
                                    read-only
                                    tooltipMesaage={showMessage()}
                                    messagePlacement="start"
                                    tooltipIsWordWrap={true}
                                />
                                {!isMenuOpen && (
                                    <Position type="absolute" right="10px" top="30%">
                                        <FontIcon
                                            variant="triangle-down"
                                            size={10}
                                            color="black"
                                        />
                                    </Position>
                                )}
                            </Position>
                        }}
                    </MultiSelect>
                )
            }} 
        />
    )
}

export default MultiSelectFormField;