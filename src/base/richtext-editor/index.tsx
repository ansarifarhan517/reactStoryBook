import React, { memo, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './style.scss'

type IRichTextEditorProps = {
  value?: string
  onChange?: (html: string) => void
  className?: string
}

const RichTextEditor: React.FC<IRichTextEditorProps> = ({ value, onChange, className }) => {
  const handleChange = useCallback((html: string): void => {
    onChange?.(html)
  }, [onChange])

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    ['link', 'image', 'video'],
    [{ align: [] }],
    ['clean'],
  ]

  const modules = {
    toolbar: toolbarOptions,
  }

  return (
    <div>
      <ReactQuill
        theme="snow"
        placeholder="Enter Some Text..."
        modules={modules}
        className={className}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default memo(RichTextEditor)
