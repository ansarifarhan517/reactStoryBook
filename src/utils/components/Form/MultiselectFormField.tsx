import React, { useState, useEffect } from "react";
import { ISpecificFormFieldProps } from "./interface";
import {
  MultiSelect,
  TextInput,
  Position,
  FontIcon,
  IMultiSelectOptions,
} from "ui-library";
import { fetchDropdownOptions, fetchPostDropdownOptions } from "./utils";
import { Controller } from "react-hook-form";
import { errorTypeMapping } from "./FormField";
import { IMultiselectEntity } from "../../mongo/interfaces";
import styled from "styled-components";
import { debounce } from "../../commonFunctions/lodashFunctions";


const maxSearchLimit = 2;

const emptyArray: any[] = [];

const MultiSelectWrapper = styled.div`
  div[class$="-MenuList"] {
    max-height: 180px !important;
  }
`;

const MultiselectFormField = ({
  meta,
  formInstance: { control, errors, watch },
  name,
  validationRules,
  isSetSearchValue = false,
}: ISpecificFormFieldProps) => {
  // const defaultValue = watch(name)
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
        const branch = watch('branch' || '');

        useEffect(() => {
          if(meta.matchParamLookup){
            meta.onLoad ? (meta.onLoad = false) : setSelected([]);setOptionList([])
          }
        }, [clientBranchId, clientBranchId?.id])

        useEffect(() => {
          if(meta.lookupType === "getEndedTrips") {
            setSelected([]); 
            setOptionList([]);
          }
        },[branch])

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
          if (optionList.length === 0) {
            let optionParam: any = '';
            if (!(meta.matchParamLookup && !(clientBranchId))) {
              optionParam = meta.lookUpOptionParam

              setIsMultiSelectLoading(true);
              let options, mapping;
              if(meta.httpMethod === "POST") {
                const values = await fetchPostDropdownOptions(meta.lookupType || '', optionParam, meta.httpPostPayload)
                options = values.options; mapping = values.mapping;
              }else{
                const values = await fetchDropdownOptions(meta.lookupType || "", optionParam);
                options = values.options; mapping = values.mapping;
              }
              openMenu(true);
              setOptionList(options);
              setOptionsMapping(mapping);
              setIsMultiSelectLoading(false);
            }
          } else {
            openMenu((o) => !o);
          }
        };

        const onInputChange = debounce (async (value: string) => {
          if (value.length >= maxSearchLimit && !meta.matchParamLookup) {
            
            setIsMultiSelectLoading(true);
            let options, mapping;
              if(meta.httpMethod === "POST") {
                const values = await fetchPostDropdownOptions(meta.lookupType || '', {...meta.lookUpOptionParam, value}, meta.httpPostPayload)
                options = values.options; mapping = values.mapping;
              } else{
                const values = await fetchDropdownOptions(meta.lookupType || "", value);
                options = values.options; mapping = values.mapping;
              }
            setOptionList([...options]);
            setOptionsMapping(mapping);
            setIsMultiSelectLoading(false);
            console.log("Multi Select rendered", options);
          }
        }, 500)

        const resetDropDownOptions = async () => {
          console.log(meta.lookupType ,"WE CAN COMMENT THIS CODE BUT WE NEED TO CHECK MPACT HERE")
          // if (meta.lookupType === "weeklyOff" || meta.lookupType === "getBranches"  || meta.lookupType === "getDistributionCenterBranch" || meta.lookupType === "getUnlinkedTrackers"){} else{
          //   setIsMultiSelectLoading(true);
          //   const { options, mapping } = await fetchDropdownOptions(
          //     meta.lookupType || ""
          //   );
          //   setOptionList([...options]);
          //   setOptionsMapping(mapping);
          //   setIsMultiSelectLoading(false);
          // }
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
                zIndex: 200,
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
export default MultiselectFormField;
