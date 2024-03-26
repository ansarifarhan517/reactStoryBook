import React, { useState, useEffect, useCallback } from "react";
import { Controller, ValidationRules } from "react-hook-form";
import { DropDown } from "ui-library";
import { IFormFieldProps } from "../../../../../utils/components/Form/interface";
import { errorTypeMapping } from "../../../../../utils/components/Form/FormField";
import { fetchDropdownOptions } from "../ConsentStatusReportForm/FormUtils";

export interface ISpecificFormFieldProps extends IFormFieldProps {
  validationRules?: ValidationRules;
  apiPayload?: any;
  optionsListData?: any;
  setResetConsentVersion?: any;
  reset?: boolean;
  consentNamePayload? :any
}

const ConsentDropdownFormField = (props: ISpecificFormFieldProps) => {
  const {
    name,
    meta,
    options,
    formInstance: { control, errors, watch, register },
    defaultValue,
    onChange,
    isSetSearchValue,
    requiredError,
    scrollToRef = false,
    isSortable = true,
    apiPayload,
    consentNamePayload
  } = props;

  const registerValidationRules = React.useMemo(() => {
    const obj: ValidationRules = {
      required: meta.required,
      maxLength: Number(meta.validation?.maxlength?.args),
      minLength: Number(meta.validation?.minlength?.args),
      min: Number(meta.validation?.min?.args),
      max: Number(meta.validation?.max?.args),
    };
    if (meta.validation?.pattern?.args) {
      obj.pattern = {
        value: new RegExp(
          String(meta.validation?.pattern?.args)?.substring(
            1,
            meta.validation?.pattern?.args?.length - 1
          ) || ""
        ),
        message: meta.validation?.pattern?.message || "",
      };
    }

    if (
      meta.validation?.phoneNumber ||
      meta.validation?.phonenumber ||
      meta.fieldType === "tel"
    ) {
      obj.pattern = {
        value: new RegExp("^[+]{0,1}[()-/0-9 ]*$"),
        message:
          meta.validation?.phoneNumber?.message ||
          meta.validation?.phonenumber?.message ||
          `Please enter valid ${meta.label}`,
      };
    }

    if (meta.fieldType === "email") {
      obj.pattern = {
        value:
          /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,63})[\W]*$/, //regex change to comma seprated email
        message: meta.validation?.email?.message || "Invalid Email address",
      };
    }
    return obj;
  }, [meta]);

  const validationRules = registerValidationRules;
  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      formInstance
      render={(props) => {
        // console.log('Dropdown: ', name, props.value)
        const [optionList, setOptionList] = React.useState<
          { value: any; label: string; title?: any; description?: any }[]
        >([]);
        const [editModeOptionList, setEditModeOptionList] = React.useState<
          { value: any; label: string }[]
        >([]);
        const [isDropdownLoading, setIsDropdownLoading] =
          useState<boolean>(false);
        const [isMenuOpen, setIsMenuOpen] = useState<boolean | undefined>(
          undefined
        );
        const [optionsMapping, setOptionsMapping] = useState<
          Record<string, any>
        >({});
        const [cacheValue, setCacheValue] = useState<string>("");
        const [isManuallyAdded, setIsManuallyAdded] = useState<boolean>(false);

        const thisDDComponentRef = scrollToRef
          ? React.useRef<HTMLDivElement>()
          : null;

        useEffect(() => {
          if (options && options?.length > 0) {
            setOptionList(options);
            const mapping = {};
            options?.forEach((option: any) => {
              mapping[`${option.id}`] = option;
            });
            setOptionsMapping(mapping);
          }
        }, [options]);

        React.useEffect(() => {
          if (props?.value?.id && (props?.value?.name || props?.value?.value)) {
            setEditModeOptionList([
              {
                value: props.value.id,
                label: props.value.name || props.value.value,
              },
            ]);
          } else if (
            defaultValue?.id &&
            (defaultValue?.name || defaultValue?.value)
          ) {
            setEditModeOptionList([
              {
                value: defaultValue.id,
                label: defaultValue.name || defaultValue.value,
              },
            ]);
          }

          if (meta.customField) {
            setOptionList(
              Object.keys(meta.dropdownValues || {}).map((key) => ({
                value: key,
                label: meta?.dropdownValues?.[key] || key,
              }))
            );
          }
        }, [props.value, meta.dropdownValues, defaultValue]);

        const handleMenuOpen = async () => {
          try {
            if(!props.value){
              const { options, mapping } = await  fetchDropdownOptions(
                meta.lookupType || "",
                "",
                apiPayload,consentNamePayload
              );

            setOptionsMapping(mapping);
            setOptionList(options);
            setIsDropdownLoading(false);
            }
          } catch (error) {
            setIsDropdownLoading(false);
          }
        };

        const handleMenuClose = () => {
          setIsMenuOpen(undefined);
          props.onBlur();
          if (cacheValue) {
            setIsManuallyAdded(true);
          } else {
            setIsManuallyAdded(false);
          }
        };

        const handleCrossReset = (inputValue: string) => {
          if (inputValue === null || inputValue === undefined) {
            setOptionList([]);
            resetDropDownOptions();
          }
        };

        const handleOnInputChange = (inputValue: string) => {
          if (inputValue === "") setCacheValue(inputValue);
        };
        const resetDropDownOptions = async () => {
          setIsDropdownLoading(true);
          const { options, mapping: optionsMapping } =
            await fetchDropdownOptions(meta.lookupType || "", "", apiPayload,consentNamePayload);
          setOptionsMapping(optionsMapping);
          setOptionList(options);
          setIsDropdownLoading(false);
        };

        const getDropDownOptions = async (inputValue: string) => {
          setIsDropdownLoading(true);

          const { options, mapping: optionsMapping } =
            await fetchDropdownOptions(meta.lookupType || "", "", apiPayload,consentNamePayload);
          setOptionsMapping(optionsMapping);
          setOptionList(options);
          setIsDropdownLoading(false);
        };

        return (
          <>
            {scrollToRef && (
              <span
                ref={thisDDComponentRef}
                style={{ position: "absolute", top: -100, left: 0 }}
              />
            )}
            <DropDown
              onInputChange={handleOnInputChange}
              required={meta.required}
              placeholder={
                defaultValue?.value ? defaultValue.value : meta.label
              }
              isSortable={isSortable}
              label={meta.label}
              variant="form-select"
              onChange={(value: string) => {
                setIsMenuOpen(undefined);
                if (value) {
                  value &&
                    meta?.handleBlurEvent &&
                    meta?.handleBlurEvent(optionsMapping[value].name, meta.id);
                  value &&
                    props.onChange(
                      meta.customField ? value : optionsMapping[value]
                    );
                  value && onChange && onChange(optionsMapping[value]);
                } else {
                  meta?.handleBlurEvent &&
                    meta?.handleBlurEvent(undefined, meta.id);
                  props.onChange(undefined);
                  onChange && onChange(optionsMapping[value]);
                  handleCrossReset(value);
                }
              }}
              optionList={
                optionList?.length === 0 ? editModeOptionList : optionList
              }
              loading={isDropdownLoading}
              isMenuOpen={isMenuOpen}
              disabled={!meta.editable}
              onMenuOpen={handleMenuOpen}
              onMenuClose={handleMenuClose}
              // {...scrollToRefFn(thisDDComponentRef)}
              showDescription={false}
              value={
                defaultValue?.value
                  ? defaultValue?.value
                  : meta.customField
                  ? props?.value
                  : props?.value?.id
              }
              error={
                requiredError || errors[name] || meta["customValidationError"]
              }
              errorMessage={
                requiredError
                  ? `${meta.label} is mandatory`
                  : meta["customValidationError"]
                  ? meta["customValidationErrorMessage"]
                  : meta.validation?.[errorTypeMapping[errors[name]?.type]]
                      ?.message
              }
              defaultValue={defaultValue?.value}
              tooltipMessage={
                meta.infoFlag && meta["infoTool"]
                  ? meta["infoTool"]?.[0]?.message
                  : ""
              }
              align={meta["align"] || "center"}
            />
          </>
        );
      }}
    />
  );
};

export default ConsentDropdownFormField;
