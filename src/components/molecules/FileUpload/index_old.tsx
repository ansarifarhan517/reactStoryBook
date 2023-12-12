import React from 'react'
import styled from 'styled-components'
import { ITextInputProps } from '../TextInput'
import InputField from '../../atoms/InputField'
import Position from '../Position'
import FontIcon from '../../atoms/FontIcon'
import InputLabel from '../InputLabel'
import ErrorTooltip from '../ErrorTooltip'
import IconButton from '../../atoms/IconButton'
import { IFileUploadProps } from './interfaces'

const FontIconStyled = styled.label`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  position: absolute;
  right: 0px;
  top: 0px;
  margin: 18px 0px;
  min-width: 42px;
  min-height: 42px;
  align-items: center;
  display: flex;
  justify-content: center;
`

const HiddenInput = styled(InputField)<ITextInputProps>`
  margin: 0px;
  visibility: hidden;
  border: none;
  width: 100%;
`
const FileUploadContainer = styled.label<IFileUploadProps>`
  margin: 18px 0px;
  min-height: 40px;
  padding: 0px;
  display: block;
  border: 1px solid
    ${({ error, theme }) =>
      error ? theme?.colors?.error?.main : theme?.colors?.grey?.A200};
`
const Placeholder = styled.div`
  font-size: 12px;
  left: 5px;
  position: absolute;
  top: calc(50% - 10px);
  padding: 3px;
  display: inline-flex;
  color: ${({ theme }) => theme?.colors?.grey['400']};
`
const CloseButtonStyled = styled(IconButton)`
  padding: 0px 5px 0px 10px;
  & i {
    margin-top: 2px;
  }
`
const FileNameContainer = styled(Placeholder)`
  // max-width: 150px;
  width: 90px;
  justify-content: space-between;
  vertical-align: middle;
  background-color: ${({ theme }) => theme?.colors.primary?.main};
  color: ${({ theme }) => theme?.colors.primary?.contrastText};
  border-radius: 2px;
`
const FileNameStyled = styled.span`
  // max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const FileUpload = React.forwardRef<HTMLInputElement, IFileUploadProps>(
  (
    {
      label,
      labelColor,
      required,
      id,
      name,
      className,
      error,
      errorMessage,
      placeholder,
      files = [],
      onFileClick = () => {},
      onFileRemove = () => {},
      ...rest
    },
    ref
  ) => {
    const containerRef = React.createRef<HTMLDivElement>()
    return (
      <Position type='relative' display='inline-block'>
        <FileUploadContainer htmlFor={`${id}-input-file-upload`} error={error}>
          <HiddenInput
            {...rest}
            type='file'
            id={`${id}-input-file-upload`}
            className={`${className}-input`}
            ref={ref}
            name={name}
            placeholder={placeholder}
            // onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            //   handleChange(event)
            // }
          />
          <Position type='absolute' top='10px' left='10px'>
            <InputLabel
              required={required}
              color={labelColor}
              id={`${id}-label`}
              className={`${className}-label`}
            >
              {label}
            </InputLabel>
          </Position>
          <FontIconStyled htmlFor={`${id}-input-file-upload`}>
            <FontIcon
              variant='icomoon-upload'
              color='primary.contrastText'
              size='md'
            />
          </FontIconStyled>
          {error && errorMessage && (
            <Position type='absolute' top='10px' right='-5px'>
              <ErrorTooltip message={errorMessage} />
            </Position>
          )}
          {files.length ? (
            <FileNameContainer ref={containerRef}>
              {files.map(({ id, label, ...rest }) => (
                <div
                  key={id}
                  onClick={() => onFileClick({ id, label, ...rest })}
                >
                  <FileNameStyled>{label}</FileNameStyled>
                  <CloseButtonStyled
                    onClick={() => onFileRemove({ id, label, ...rest })}
                    onlyIcon
                    iconVariant='close'
                    iconSize={10}
                    color='primary.contrastText'
                  />
                </div>
              ))}
            </FileNameContainer>
          ) : (
            <Placeholder>{placeholder}</Placeholder>
          )}
        </FileUploadContainer>
      </Position>
    )
  }
)
export default FileUpload
