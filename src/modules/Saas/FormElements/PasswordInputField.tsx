import React from "react";
import { TextInput } from "ui-library";

interface IPasswordInputFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  error: boolean;
  errorMessage: string;
  value: string;
  sx?: object;
  required?: boolean;
  type?: string;
  fullWidth: boolean;
  handleChange: any;
  onBlur?: ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined;,
  tabindex?: string
}

const PasswordInputField = ({
  id,
  name,
  type,
  label,
  placeholder,
  error,
  errorMessage,
  value = "",
  fullWidth = true,
  handleChange,
  required = false,
  onBlur,
  tabindex = "1",
  sx = {},
  ...props
}: IPasswordInputFieldProps) => {
  return (
    <TextInput
      id={id}
      name={name}
      label={label}
      labelColor="text.inputLabel.default"
      placeholder={placeholder}
      fullWidth={fullWidth}
      value={value}
      onChange={(e) => handleChange(e)}
      onBlur={(e) => onBlur?.(e)}
      errorMessage={errorMessage}
      error={error}
      className={`formFieldWrapper-${name}`}
      type={type}
      tooltipDirection="top"
      messagePlacement={"center"}
      style={{
        borderRadius: "5px",
        fontFamily: "Gotham-Rounded-Book",
        borderColor: "#C9C9C9",
        fontSize: "1.4rem",
        padding: "13px 15px 10px",
        marginBottom: "5px"
      }}
      {...props}
    >
     
    </TextInput>
  );
};

export default PasswordInputField;
