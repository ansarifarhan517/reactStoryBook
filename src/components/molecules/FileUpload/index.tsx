import React, { useCallback } from 'react'
import { IFileUploadProps } from './interfaces'
import {
  InputContainer,
  Container,
  IconContainer,
  Chip,
  ChipsContainer,
  ShowMoreLabel,
  Placeholder
} from './FileUpload.styles'
import InputField from '../../atoms/InputField'
import FontIcon from '../../atoms/FontIcon'
import Position from '../Position'
import InputLabel from '../InputLabel'
import ErrorTooltip from '../ErrorTooltip'

const FileUpload = React.forwardRef<HTMLInputElement, IFileUploadProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      name,
      className,
      placeholder,
      error = false,
      errorMessage = '',
      files = [],
      onFileClick = () => {},
      onFileRemove = () => {},
      onChange = () => { },
      ...rest
    },
    ref
  ) => {
    // const [inputWidth, setInputWidth] = React.useState<number>(0)
    const inputContainerRef = React.useRef<HTMLDivElement | null>(null)
    const [showMore, setShowMore] = React.useState<boolean>(false)
    const [visibleFileCount, setVisibleFileCount] = React.useState<number>(
      files.length
    )

    React.useEffect(() => {
      setTimeout(() => {
        const inputContainerWidth =
          inputContainerRef.current?.getBoundingClientRect()?.width || 0
        const shouldShowMore = files.length * 105 > inputContainerWidth
        setShowMore(shouldShowMore)

        const _visibleCount = Math.floor((inputContainerWidth - 75) / 105)
        setVisibleFileCount(
          shouldShowMore
            ? _visibleCount < 0
              ? -_visibleCount
              : _visibleCount
            : files.length
        )
      }, 1000)
    }, [files])

    const onFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const duplicateFile = files.filter(
          (file) => file.filename === e.target?.files?.[0].name
        )

        if (duplicateFile.length) {
          e.target.value = ''
        }

        onChange(e)
        e.target.value = ''
      },
      [onChange]
    )

    return (
      <Container htmlFor={id}>
        <InputContainer ref={inputContainerRef} error={error}>
          <InputField
            type='file'
            id={id}
            name={name}
            className={className}
            {...rest}
            ref={ref}
            onChange={onFileInputChange}
          />
          <ChipsContainer>
            {files.length ? (
              files.map(
                (fileObj, i) =>
                  i < visibleFileCount && (
                    <Chip
                      key={fileObj.id}
                      onClick={(e) => {
                        e.preventDefault()
                        onFileClick(fileObj)
                      }}
                      style={!showMore ? { width: '100%' } : {}}
                    >
                      <div className='text'>{fileObj.filename}</div>
                      <div
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onFileRemove(fileObj)
                        }}
                      >
                        <FontIcon
                          variant='icomoon-close'
                          color='primary.contrastText'
                          size='sm'
                        />
                      </div>
                    </Chip>
                  )
              )
            ) : (
              <Placeholder>{placeholder}</Placeholder>
            )}
          </ChipsContainer>
          {showMore && (
            <ShowMoreLabel
              onClick={(e) => {
                e.preventDefault()
                onFileClick(files[visibleFileCount])
              }}
            >{`+${files.length - visibleFileCount} More`}</ShowMoreLabel>
          )}
          <Position
            type='absolute'
            top='-8px'
            left='10px'
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            <InputLabel
              required={required}
              color={labelColor}
              id={`${id}-label`}
              className={`${className}-label`}
            >
              {label}
            </InputLabel>
          </Position>
        </InputContainer>
        <IconContainer>
          <FontIcon
            variant='icomoon-upload'
            color='primary.contrastText'
            size='md'
          />
        </IconContainer>
        {error && errorMessage && (
          <Position type='absolute' top='-9px' right='-6px'>
            <ErrorTooltip message={errorMessage} />
          </Position>
        )}
      </Container>
    )
  }
)

export default FileUpload
