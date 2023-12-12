import { ITextInputProps } from './../TextInput/index'
export interface IFileObject {
  id: string | number
  filename: string
  [key: string]: any
}
export interface IFileUploadProps extends ITextInputProps {
  placeholder?: string
  files?: IFileObject[]
  onFileClick?: (file: IFileObject) => void
  onFileRemove?: (file: IFileObject) => void
}
