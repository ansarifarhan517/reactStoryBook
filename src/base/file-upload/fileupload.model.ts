export type IFileuploadProps = {
  title?: string
  isRequired: boolean,
  validationMessage?: string,
  name: string
  id?: string
  accept?: string
  multiple?: boolean
  selectedFileName?: string[]
  className?: string
  onChangeHandler: (arg0: onChangeHandlerParameter) => void
}

type onChangeHandlerParameter = Record<string, FileList>
