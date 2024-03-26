import React, { useEffect, useState } from "react";
// { useState }

import {
  useFieldArray,
  // useForm
} from "react-hook-form";
import {
  Grid,
  IconButton,
  MultiSelect,
  tMultiSelectChildren,
  Position,
  TextInput,
  FontIcon,
} from "ui-library";
import FormField from "../Form/FormField";
import {
  GroupFieldsWrapper,
  RepeatButtonsWrapper,
  SectionWrapper,
} from "./styled";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import { IMultiselectEntity } from "../../../utils/mongo/interfaces";

const GroupRepeatable = ({
  data,
  // handleModalShow,
  moduleName,
  // handleData,
  formInstance,
  currencySymbol
}: any) => {
  const structure = data;
  const { getValues, setValue } = formInstance;
  const [currSymbol, setCurrSymbol] = useState('$')

  useEffect(() => {
    setCurrSymbol(currencySymbol)
   
  },[currencySymbol])

  let { fields, append, remove } = useFieldArray({
    control: formInstance.control,
    name: moduleName,
  });

  React.useEffect(() => {
    if (fields?.length === 0 && moduleName === 'handlingFees') {
      append({ rate: "", skillSet: [] });
    } else if (fields?.length === 0 && moduleName === 'taxMappings') {
      append({ taxName: "", taxRate: "" });
    }
  }, [fields]);

  const serviceTypes = useTypedSelector(
    (state: any) => state.rateProfile.form.skillSet
  );


  const formatedServiceTypes = serviceTypes?.map((option: any) => {
    return {
      id: option.name,
      label: option.name,
      value: option.name,
    };
  });


  const getOptions = (serv: any, ser_index: number) => {
    const current = getValues();
    const skillsSelected = current?.["handlingFeesSkillset"];
    const srtTypes: any = [];

    skillsSelected &&
      Object.values(skillsSelected)?.length &&
      Object.values(skillsSelected)?.map((keys: any, index: number) => {
        if (index !== ser_index) {
          if (Object.keys(keys)?.includes("skillSet")) {
            const current = getValues();
            console.log(
              "current.[handlingFeesSkillset][index]?.['skillSet']",
              current?.["handlingFeesSkillset"][index]?.["skillSet"]
            );
            current?.["handlingFeesSkillset"][index]?.["skillSet"]
              ? srtTypes.push(
                  ...current?.["handlingFeesSkillset"][index]?.["skillSet"]
                )
              : null;
          }
        }
      });

    const selectedIds = srtTypes.map((ser: any) => ser?.value);
    return serv.filter((service: any) => !selectedIds.includes(service.id));
  };

  const handleSetValues = (index: number, selectedOptions: any) => {
    const values = getValues();
    const selectedSkillsArray: any = [];
    selectedSkillsArray[index] = { skillSet: selectedOptions };

    values["handlingFees"][index]["skillSet"] = selectedOptions;

    setValue("handlingFeesSkillset", {
      ...values["handlingFeesSkillset"],
      ...selectedSkillsArray,
    });
    console.log("all set values", getValues());
  };

  const handleGetSelected =  (index:number) => {

    const data = getValues()
    
    // console.log(data?.handlingFeesSkillset?.[index]?.skillset)
    return data?.handlingFeesSkillset?.[index]?.skillSet
  }
  

  return (
    <SectionWrapper>
      {currSymbol && fields.map((props: any, index: number) => {
        return (
          <GroupFieldsWrapper key={props.id}>
            <Grid
              container
              style={{ marginBottom: "5px", justifyContent: "flex-start" }}
            >
              {Object.keys(structure).map((key: any) => {
                const meta = structure[key];
                if(meta.id === 'handlingFeeRate') {
                  meta.label = `Rate (in ${currSymbol})`
                  meta.labelKey = ''
                }
                if (!meta?.permission) {
                  return undefined;
                }

                if (meta.fieldName === "skillSet") {
                  return (
                    <Grid
                      item
                      key={`${moduleName}[${index}].${meta.fieldName}`}
                      xs={12}
                      sm={6}
                      md={3}
                      className="grid-item rateProfileForm"
                    >
                      
                      <MultiSelect
                        
                        key={`${moduleName}[${index}].${meta.fieldName}`}
                        // name={`${moduleName}[${index}].${meta.fieldName}`}
                        options={getOptions(formatedServiceTypes, index)}
                        onChange={(
                          _event,
                          _value,
                          _isSelected,
                          selectedOptions
                        ) => {
                          selectedOptions?.map(
                            (o) => formatedServiceTypes[o.value]
                          );
                          handleSetValues(index, selectedOptions);
                        }}
                        selected={
                         handleGetSelected(index)
                        }
                        style={{
                          position: "absolute",
                          width: "94%",
                          marginTop: "-15px",
                        }}
                        maximumSelected={10}
                        menuOpen={false}
                        allowSelectAll={false}
                        searchableKeys={["label"]}
                        isLoading={false}
                      >
                        {({
                          optionSelected,
                          isMenuOpen,
                          openMenu,
                        }: tMultiSelectChildren) => {
                          const value = React.useMemo(
                            () =>
                              optionSelected.length
                                ? optionSelected
                                    ?.map(({ label }: any) => label)
                                    .join(", ")
                                : meta.customField
                                ? props?.value
                                : props?.value
                                    ?.map((o: IMultiselectEntity) => o?.name)
                                    .join(","),
                            [optionSelected, props.value]
                          );
                          return (
                            <>
                              <Position type="relative">
                                <TextInput
                                  key={`${moduleName}[${index}].${meta.fieldName}`}
                                  title={value}
                                  name={`${moduleName}[${index}].${meta.fieldName}`}
                                  // name={meta?.fieldName + index}
                                  className="multiselct"
                                  label={meta.label}
                                  required={meta.required}
                                  fullWidth
                                  style={{
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                  placeholder="Select"
                                  onClick={() => {
                                    openMenu(!isMenuOpen);
                                  }}
                                  value={
                                    optionSelected.length ||
                                    props?.value?.length
                                      ? `${
                                          optionSelected.length ||
                                          props?.value?.length ||
                                          0
                                        } Selected`
                                      : ""
                                  }
                                  readOnly
                                />

                                {!isMenuOpen && (
                                  <Position
                                    type="absolute"
                                    right="10px"
                                    top="40%"
                                  >
                                    <FontIcon
                                      variant="triangle-down"
                                      size={8}
                                      color="black"
                                    />
                                  </Position>
                                )}
                              </Position>
                            </>
                          );
                        }}
                      </MultiSelect>
                    </Grid>
                  );
                } else {
                  return (
                    <Grid
                      item
                      key={`${moduleName}[${index}].${meta.fieldName}`}
                      xs={12}
                      sm={6}
                      md={3}
                      className="grid-item rateProfileForm"
                    >
                      <FormField
                        key={`${moduleName}[${index}].${meta.fieldName}`}
                        name={`${moduleName}[${index}].${meta.fieldName}`}
                        meta={meta}
                        formInstance={formInstance}
                        // optionList={optionList}
                        defaultValue={
                          meta?.fieldType === "select"
                            ? { label: props.value, value: props.value }
                            : meta?.fieldType === "number"
                            ? parseFloat(props?.[meta?.fieldName]).toFixed(2)
                            : props?.[meta?.fieldName]
                        }
                      />
                    </Grid>
                  );
                }
              })}

              {/* <input
              ref={formInstance.register()}
              hidden
              key={`${moduleName}[${index}].id`}
              defaultValue={props.id}
            /> */}

              <Grid
                item
                xs={3}
                sm={2}
                md={2}
                className="grid-item rateProfileForm"
              >
                <RepeatButtonsWrapper>
                  {fields.length != 1 && (
                    <IconButton
                      onClick={() => {
                        
                        remove(index)
                      }}
                      color="red"
                      disabled={false}
                      iconVariant="icomoon-close"
                      iconSize="xs"
                      onlyIcon
                      className="icon-Remove"
                    />
                  )}
                  {(fields.length == 1 || fields.length - 1 == index) && (
                    <IconButton
                      onClick={() => append({})}
                      color="green"
                      disabled={false}
                      iconVariant="add"
                      iconSize="xs"
                      onlyIcon
                      className="icon-Add"
                    />
                  )}
                </RepeatButtonsWrapper>
              </Grid>
            </Grid>
          </GroupFieldsWrapper>
        );
      })}
    </SectionWrapper>
  );
};

export default GroupRepeatable;
