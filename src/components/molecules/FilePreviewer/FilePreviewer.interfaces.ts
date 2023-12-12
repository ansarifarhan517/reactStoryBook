import { IFileObject } from './../FileUpload/interfaces'
import { HTMLAttributes } from 'react'

export interface IFilePreviewObject extends IFileObject {
  url?: string
  extension?: string
}

export interface IFilePreviewerProps extends HTMLAttributes<HTMLDivElement> {
  files: IFilePreviewObject[]
  pageIndex?: number
  onPageChange?: (pageIndex: number) => void
}

export interface IThumbnailProps {
  selected?: boolean
}
