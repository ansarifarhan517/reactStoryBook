import React from "react";
import {
  ErrorTooltip,
  InputLabel,
  Position,
  TextInput,
  Tooltip,
} from "ui-library";
import { ISpecificFormFieldProps } from "./interface";
import styled from "styled-components";

const MultiNumberInputWrapper = styled(Position)`
  div[data-testid="tooltipTitle"] {
    font-size: 11px !important;
  }
`;

const TextFieldStyled = styled.div`
  border: 1px solid #979797;
  display: flex;
  align-items: center;
  &::placeholder {
    color: grey;
  }
  & input {
    margin: 0px;
  }
`;

const MultiNumberInput = ({
  formInstance: { errors, register, unregister, watch, setValue },
  meta,
  name,
  validationRules,
}: ISpecificFormFieldProps) => {
  const childNodes = meta?.childNodes && Object.values(meta?.childNodes);
  const value = watch();

  const handleKeyPress = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    // if (value.length + 1 > allowedLength) {
    //   e.preventDefault()
    // }
  };

  const handleBlur = (child_name: string) => {
    if (value[child_name] && meta.decimalPlaces) {
      const valueStr = String(value[child_name]);
      const decimalIndex = valueStr.lastIndexOf(".");
      if (
        decimalIndex === -1 ||
        valueStr.substr(decimalIndex, valueStr.length).length >
          meta.decimalPlaces
      ) {
        setValue(
          child_name,
          Number(Number(value[child_name]).toFixed(meta.decimalPlaces))
        );
      }
    }
  };

  React.useEffect(() => {
    return () => {
      childNodes?.map((c) => {
        unregister(c?.id);
      });
    };
  }, []);

  // make true Error
  const trueErrorArray: any[] = [];
  meta?.childNodes &&
    Object.keys(errors)?.forEach((errorKey: any) => {
      if (!!meta?.childNodes?.[errorKey]) {
        trueErrorArray.push(errors?.[errorKey]);
      }
    });

  const errorArray = Object.values(errors);
  const errorNames = Object.keys(errors);

  // console.log(error,meta,errors,errorTypeMapping)

  return (
    <MultiNumberInputWrapper
      type="relative"
      fullWidth
      display={"block"}
      alignItems="stretch"
      className="MultiNumberInputWrapper"
    >
      <TextFieldStyled>
        {meta?.childLength &&
          meta?.childLength > 0 &&
          childNodes?.map((c: any) => {
            const newValidationRules = {
              ...validationRules,
              required: c.required,
            };
            return (
              <TextInput
                type="number"
                fullWidth
                name={c.id}
                border={false}
                onKeyPress={handleKeyPress}
                className={`formFieldWrapper-${name}`}
                placeholder={c.required ? c.fieldName + "*" : c.fieldName}
                key={c.id}
                required={c.required}
                isChildNode={true}
                id={c.id}
                disabled={meta?.disabled}
                // error={errors[c.id]}
                // errorMessage={c.validation?.[errorTypeMapping[errors[c.id]?.type]]?.message}
                ref={register(newValidationRules)}
                min={c?.validation?.min?.args || undefined}
                max={c?.validation?.max?.args || undefined}
                onBlur={() => handleBlur(c.id)}
              />
            );
          })}
      </TextFieldStyled>

      <Position
        type="absolute"
        top={"-10px"}
        left="10px"
        style={{ maxWidth: "calc(100% - 20px)" }}
      >
        {/* <Tooltip
          message={meta.label}
          hover
          hide={!meta.label}
          arrowPlacement={"center"}
          messagePlacement={"center"}
          tooltipDirection={"bottom"}
        > */}
        <InputLabel
          required={meta.required}
          color={"grey.800"}
          id={`${name}-label`}
          className={`formFieldWrapper-${name}`}
        >
          {meta.label}
        </InputLabel>
        {/* </Tooltip> */}
      </Position>

      {
        // error.error ? (
        //   <Position
        //     type='absolute'
        //     top={meta.label === '' || meta.label === undefined ? '-7.5px' : '-7.5px'}
        //     right='-6.5px'
        //   >
        //     <ErrorTooltip message={error.message} />
        //   </Position>
        // ) :
        trueErrorArray?.length > 0 && (
          <Position
            type="absolute"
            top={
              meta.label === "" || meta.label === undefined
                ? "-7.5px"
                : "-7.5px"
            }
            right="-6.5px"
          >
            <ErrorTooltip
              message={
                trueErrorArray[0].type === "required"
                  ? meta?.validation?.[trueErrorArray[0].type]?.message
                    ? meta?.validation?.[trueErrorArray[0].type]?.message
                    : meta?.childNodes?.[errorNames?.[0]]?.validation?.[
                        trueErrorArray?.[0]?.type
                      ]?.message || "Please enter required value."
                  : meta?.childNodes?.[errorNames?.[0]]?.validation?.[
                      trueErrorArray?.[0]?.type
                    ]?.message || "Please enter a valid value."
              }
              isWordWrap={true}
            />
          </Position>
        )
      }
    </MultiNumberInputWrapper>
  );
};

export default MultiNumberInput;
