export interface ISetEditDetails {
    readonly type: '@@inlineEdit/SET_EDIT_DETAILS';
    payload: {
      rowId: string;
      columnId: string;
      value: any
      hasError?: boolean;
    };
  }

  export interface IClearEditDetails {
    readonly type: '@@inlineEdit/CLEAR_EDIT_DETAILS';
  }


  export type InlineEditActions =
  | ISetEditDetails
  | IClearEditDetails