import React from "react";
import { CheckboxFieldGroup, Checkbox, Grid } from "ui-library";
import { ISpecificFormFieldProps } from "./interface";
import { Controller } from "react-hook-form";

const MultiCheckboxFormField = ({
  formInstance: { control, errors },
  validationRules,
  meta,
  name,
}: ISpecificFormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={validationRules}
      render={(props) => {
        const optionMap: Record<string, boolean> = {};
        if (props.value) {
          props.value?.split(",").forEach((label: string) => {
            optionMap[label] = true;
          });
        }

        return (
          <CheckboxFieldGroup
            id={name}
            label={meta.label}
            variant="form"
            required={meta.required}
            error={errors[name]}
            errorMessage={meta.validation?.required?.message}
          >
            <Grid container>
              {meta.options?.map((option) => {
                const optionParsed = JSON.parse(option);
                const key = optionParsed.key || optionParsed.label; // Use key if available, otherwise use label as key

                return (
                  <Grid item key={key}>
                    <Checkbox
                      id={key}
                      label={optionParsed.label}
                      checked={optionMap[key]}
                      checkboxSize="md"
                      disabled={optionParsed.disabled || false}
                      onChange={({ target: { checked } }) => {
                        if (!checked) {
                          delete optionMap[key];
                        } else {
                          optionMap[key] = true;
                        }

                        props.onChange(Object.keys(optionMap).join(","));
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CheckboxFieldGroup>
        );
      }}
    />
  );
};

export default MultiCheckboxFormField;
