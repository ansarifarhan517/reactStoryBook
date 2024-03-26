export interface IFlexContainer {
    fontSize?: string;
    padding?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    color?: string;
    margin?: string;
    gap?: string;
    height?: string;
    width?: string;
  }

  export type tAddressType = {
    label: string;
    value: string;
    id: string | number;
    title: string;
  }

  export type tDropdown = {
    label: string
    value: number | string
    [key: string]: any
  }

export interface tInlineEdits<T = any> {
    [key: string]: {
      [key: string]: T
    }
  }
  
  export type tLoadingKey = 'structure' | 'data';