import React, { useCallback, memo, ChangeEvent } from 'react'
import { Icon } from '@base'
import { bemClass } from '@utils'
import { IFileuploadProps } from './fileupload.model'
import './style.scss'

const blk = 'file-upload'

const FileUpload: React.FC <IFileuploadProps> = ({
  title,
  name,
  id,
  accept,
  multiple,
  selectedFileName,
  className,
  onChangeHandler,
  isRequired = false,
  validationMessage,
}) => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        onChangeHandler({ [name]: e.target.files })
      }
    },
    [name, onChangeHandler],
  )

  return (
    <>
      <div className={bemClass([blk, 'message-container', {}])}>
        <label>
          {title} {/* Removed computed property name */}
          {isRequired && <span className={bemClass([blk, 'star'])}>*</span>}
        </label>
        <span className={bemClass([blk, 'validation-message'])}>{validationMessage}</span>
      </div>
      <div className={bemClass([blk])}>
        <div className={bemClass([blk, 'icon'])}>
          <Icon name="cloud-upload" size="medium" />
        </div>
        <input
          type="file"
          name={name}
          id={id}
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className={bemClass([blk, 'input', className])} />
        { selectedFileName && selectedFileName.length > 0
          ? selectedFileName.map((fileName) => (
            <label htmlFor={id} className={bemClass([blk, 'label'])}>
              {fileName}
            </label>
          ))
          : <label htmlFor={id} className={bemClass([blk, 'label'])}>Drag your file here</label>}
      </div>
    </>

  )
}

export default memo(FileUpload)
