// import { IFileObject, IFilePreviewObject } from 'ui-library';
import { IMongoField } from "../../mongo/interfaces";
import { UseFormMethods, ValidationRules } from "react-hook-form";
import { ChangeEvent } from "react";

export interface IFormFieldProps {
  name: string;
  meta: IMongoField;
  formInstance: UseFormMethods;
  handler?: Function;
  key?: string;
  toolTipText?: string;
  onChange?: ((event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  timeInterval?: number;
  iconVariant?: string | undefined;
  defaultValue?: any;
  options?: any;
  isSetSearchValue?: boolean;
  requiredError?: boolean;
  scrollToRef?: boolean;
  messagePlacement?: "start" | "end" | "center";
  isSortable ?: boolean;
  boundLeft?: number;
  validate?: any
}

export interface ISpecificFormFieldProps extends IFormFieldProps {
  validationRules: ValidationRules;
}

export interface IFetchedDropdownOptions {
  options: Array<{
    label: string;
    value: string;
  }>;
  mapping: Record<string, any>;
}

export interface IFileFormFieldObject {
  id: string;
  filename: string;
  index?: number;
  url?: string;
  shortUrl?: string;
  type?: "new" | "existing";
  data?: File;
}
export interface IFileFormField {
  newFiles: IFileFormFieldObject[];
  existingFiles: IFileFormFieldObject[];
  deletedFiles: IFileFormFieldObject[];
}

export interface IRHFControllerProps {
  onChange: (...event: any[]) => void;
  onBlur: () => void;
  value: any;
  name: string;
}
