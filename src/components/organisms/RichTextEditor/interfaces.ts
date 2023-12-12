import { EditorProps } from 'react-draft-wysiwyg'
export interface IMentionSuggestion {
  text: string | JSX.Element
  value: string
  url?: string
}

export interface IRTEProps extends EditorProps {
  label: string
  id?: string
  className?: string
  hideToolbar?: boolean
  isStripPastedStyles?:boolean
}
