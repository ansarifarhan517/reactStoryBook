import React, { useState, useEffect } from "react";
// import { ISpecificFormFieldProps } from "./interface";
import {
  MultiSelect,
  TextInput,
  Position,
  FontIcon,
  IMultiSelectOptions,
} from "ui-library";
// import { fetchDropdownOptions } from "./utils";
import { Controller, ValidationRules } from "react-hook-form";
// import { errorTypeMapping } from "./FormField";
// import { IMultiselectEntity } from "../../mongo/interfaces";
import styled from "styled-components";
import { IFormFieldProps } from "../../../../../utils/components/Form/interface";
import { IMultiselectEntity } from "../../../../../utils/mongo/interfaces";
import { errorTypeMapping } from "../../../../../utils/components/Form/FormField";
import { fetchDropdownOptions } from "../ConsentStatusReportForm/FormUtils";

const maxSearchLimit = 2;

const emptyArray: any[] = [];

const MultiSelectWrapper = styled.div`
  div[class$="-MenuList"] {
    max-height: 180px !important;
  }
`;
export interface ISpecificFormFieldProps extends IFormFieldProps {
  validationRules?: ValidationRules;
  apiPayload? : any
  optionsListData? :any
  setResetConsentVersion?: any
  reset?: boolean
  consentNamePayload?: any
}
const ConsentMultiselectFormField = ({
  meta,
  formInstance: { control, errors, watch },
  name,
  // validationRules,
  isSetSearchValue = false,
  apiPayload,
  optionsListData,
  reset ,
  consentNamePayload
}: ISpecificFormFieldProps) => {
  // const defaultValue = watch(name)
  console.log(consentNamePayload,'consentNamePayload')
  const registerValidationRules = React.useMemo(() => {
    const obj: ValidationRules = {
      required: meta.required,
      maxLength: Number(meta.validation?.maxlength?.args),
      minLength: Number(meta.validation?.minlength?.args),
      min: Number(meta.validation?.min?.args),
      max: Number(meta.validation?.max?.args),
    }
    if (meta.validation?.pattern?.args) {
      obj.pattern = {
        value: new RegExp(String(meta.validation?.pattern?.args)
          ?.substring(1, meta.validation?.pattern?.args?.length - 1) || ''),
        message: meta.validation?.pattern?.message || ''
      }
    }

    if (meta.validation?.phoneNumber || meta.validation?.phonenumber || meta.fieldType === 'tel') {
      obj.pattern = {
        value: new RegExp("^[+]{0,1}[\(\)\-/0-9 ]*$"),
        message: meta.validation?.phoneNumber?.message || meta.validation?.phonenumber?.message || `Please enter valid ${meta.label}`
      }
    }

    if (meta.fieldType === 'email') {
      obj.pattern = {
        value: /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63})[\W]*$/,   //regex change to comma seprated email
        message: meta.validation?.email?.message || 'Invalid Email address'
      }
    }
    return obj
  }, [meta])

  const validationRules =registerValidationRules
  return (
    <Controller
      name={name}
      control={control}
      // defaultValue={defaultValue || []}
      rules={validationRules}
      render={(props) => {
        const [isMultiSelectLoading, setIsMultiSelectLoading] =
          useState<boolean>(false);
        const [optionList, setOptionList] = useState<
          { value: any; label: string }[]
        >([]);
        const [optionsMapping, setOptionsMapping] = useState({});
        const [selected, setSelected] = useState<IMultiSelectOptions[]>([]);

        const inputRef = React.useRef<HTMLDivElement>(null);
        const [hasOptionsPlacementTop, setHasOptionsPlacementTop] =
          React.useState<boolean>(false);
        const clientBranchId = watch(meta.clientBranchId || '')

        useEffect(() => {
          if(meta.matchParamLookup){
            meta.onLoad ? (meta.onLoad = false) : setSelected([]);setOptionList([])
          }
        }, [clientBranchId, clientBranchId?.id])

        useEffect(()=>{
            setSelected([])
        },[reset])

        const handleClick = async (
          openMenu: React.Dispatch<React.SetStateAction<boolean>>
        ) => {
          if (meta["pageName"] === "addServiceTypeForm") {
            setHasOptionsPlacementTop(
              window.innerHeight -
                (inputRef.current?.getBoundingClientRect()?.bottom || 0) <
                250
            );
          }
          // if (optionList?.length === 0) {
            let optionParam: any = '';
            if (!(meta.matchParamLookup && !(clientBranchId))) {
              optionParam = meta.lookUpOptionParam

              setIsMultiSelectLoading(true);
              if(optionsListData?.length > 0){
                const mapping ={}
                const options= optionsListData?.map((option: any) => {
                  mapping[`${option.id}`] = option;
                  return {
                    label: option.name,
                    value: option.id,
                  };
                })
                openMenu(true);
                setOptionList(options);
                setOptionsMapping(mapping);
              } 
              else{
                const { options, mapping } = await fetchDropdownOptions(
                  meta.lookupType || "", optionParam,apiPayload,consentNamePayload
                );
                openMenu(true);
                setOptionList(options);
                setOptionsMapping(mapping);
              }     
              setIsMultiSelectLoading(false);
            }
          // } else {
          //   openMenu((o) => !o);
          // }
        };

        const onInputChange = async (value: string) => {
          if (value.length >= maxSearchLimit && !meta.matchParamLookup) {
            
            setIsMultiSelectLoading(true);
            const { options, mapping } = await fetchDropdownOptions(

              meta.lookupType || "",
              value,apiPayload,consentNamePayload
            );
            setOptionList([...options]);
            setOptionsMapping(mapping);
            setIsMultiSelectLoading(false);
            console.log("Multi Select rendered", options);
          }
        };

        const resetDropDownOptions = async () => {
          console.log(meta.lookupType ,"WE CAN COMMENT THIS CODE BUT WE NEED TO CHECK MPACT HERE")
          
        };

       

        React.useEffect(() => {
          if (meta.customField) {
            setOptionList(
              Object.keys(meta.dropdownValues || {})?.map((key) => ({
                value: key,
                label: meta?.dropdownValues?.[key] || key,
              }))
            );
          }
        }, []);

        console.log(props?.value);

        return (
          <MultiSelectWrapper ref={inputRef}>
            <MultiSelect
              options={optionList}
              style={{
                position: "absolute",
                width: "94%",
                ...(hasOptionsPlacementTop
                  ? { bottom: "70px" }
                  : { top: "60px" }),
                zIndex: 1001,
              }}
              isLoading={isMultiSelectLoading}
              onChange={(event, value, isSelected, selectedOptions) => {
                event;
                value;
                isSelected;
                // setIsMenuOpen(undefined)
                props?.onChange(
                  meta?.customField
                    ? selectedOptions?.map((o) => o.label).join(",")
                    : selectedOptions?.map((o) => optionsMapping[o.value])
                );

                setSelected(selectedOptions as unknown as any);
              }}
              onInputChange={onInputChange}
              onOutsideClick={resetDropDownOptions}
              defaultSelected={
                selected
                  ? selected
                  : props?.value?.map((o: any) => ({
                      label: o?.name,
                      value: o?.id,
                    })) || emptyArray
              }
              selected={
                selected.length >= 1
                  ? selected
                  : !!props?.value
                  ? meta?.customField
                    ? props?.value
                        ?.split(",")
                        ?.map((o: string) => ({ label: o, value: o }))
                    : typeof props?.value !== "string"
                    ? props?.value?.map((o: any) => ({
                        label: o?.name,
                        value: o?.id,
                        description: o?.description,
                      }))
                    : []
                  : []
              }
              isEnableInternalSearch={false}
            >
              {({ optionSelected, openMenu, isMenuOpen }) => {
                const value = React.useMemo(
                  () =>
                    optionSelected?.length
                      ? optionSelected?.map(({ label }) => label).join(", ")
                      : meta?.customField
                      ? props?.value
                      : typeof props?.value !== "string"
                      ? props?.value
                          ?.map((o: IMultiselectEntity) => o?.name)
                          ?.join(",")
                      : "",
                  [optionSelected, props.value]
                );

                return (
                  <Position type="relative">
                    <TextInput
                      title={value}
                      placeholder={meta.label}
                      id={name}
                      name={name}
                      readOnly
                      label={meta.label}
                      required={meta.required}
                      fullWidth
                      onClick={() => handleClick(openMenu)}
                      disabled={!meta.editable}
                      style={{ cursor: "pointer" }}
                      // value={value}
                      value={
                        optionSelected.length || props?.value?.length
                          ? `${
                              optionSelected.length || props?.value?.length || 0
                            } Selected`
                          : ""
                      }
                      error={errors[name]}
                      errorMessage={
                        meta.validation?.[errorTypeMapping[errors[name]?.type]]
                          ?.message
                      }
                      tooltipMesaage={
                        meta.infoFlag && meta["infoTool"]
                          ? meta["infoTool"]?.[0]?.message
                          : ""
                      }
                      messagePlacement="start"
                      tooltipIsWordWrap={true}
                    />
                    {!isMenuOpen && (
                      <Position type="absolute" right="10px" top="40%">
                        <FontIcon
                          variant="triangle-down"
                          size={8}
                          color="black"
                        />
                      </Position>
                    )}
                  </Position>
                );
              }}
            </MultiSelect>
          </MultiSelectWrapper>
        );
      }}
    />
  );
};
export default ConsentMultiselectFormField;
