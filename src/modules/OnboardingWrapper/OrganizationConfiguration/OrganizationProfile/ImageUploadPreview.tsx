import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { Position, Tooltip, InputLabel, InputField } from 'ui-library';

interface IImageUploadProps {
  id?: string,
  className?: string,
  label?: string,
  name?: string,
  value?: string
  tooltipMesaage?: string,
  onChange: Function
}

export const UploadLogo = styled.label`
  position: relative;
  cursor: pointer;
  display: flex;
  margin: 15px 15px;
  height: 70px;
  box-sizing: content-box;

    ${InputField} {
      display: none;
    }

    ${() =>
    css`
      &:hover {
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        z-index: 3;
        text-overflow: hidden;
      }
      `}
`

export const InputContainer = styled.div`
  box-sizing: inherit;
  cursor: pointer;
  text-overflow: hidden;
  flex-grow: 1;
  display: flex;
  align-items: center;
  height: calc(100% - 2px);
  white-space: nowrap;
  border: 1px solid #979797;

  img {
    height: 50px;
  }

  i {
    color: white;
  }
`


const ImageUploadPreview = React.forwardRef<HTMLInputElement, IImageUploadProps>(
  (
    {
      label,
      id,
      name,
      className,
      value,
      tooltipMesaage,
      onChange = () => { },
      ...rest
    },
    ref
  ) => {

    const [hover, setHover] = useState<boolean>(false);

    const onFileInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e)
        e.target.value = ''
      },
      [onChange]
    )

    return (
      <UploadLogo>
        <InputContainer id="inputContainer" onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}  >
          <Position
          id="test1"
            type='absolute'
            top='-12px'
            left='10px'
            style={{ maxWidth: 'calc(100% - 20px)' }}
          >
            <Tooltip
              message={tooltipMesaage}
              hover
              hide={!tooltipMesaage}
              arrowPlacement={'center'}
              messagePlacement={'center'}
              tooltipDirection={'bottom'}
            >
              <InputLabel
                id={`${id}-label`}
                className={`${className}-label`}
              >
                {label}
              </InputLabel>
            </Tooltip>
          </Position>
          <InputField
            type='file'
            id={id}
            name={name}
            className={className}
            {...rest}
            ref={ref}
            accept="image/*"
            onChange={onFileInputChange}
          />
          <Position
            type='relative'
            id="org-img"
            style={{margin: "0 auto"}}
          >
            <img src={value}  style={{margin: "0 auto"}}/>
            <i className="logi-icon icon-Product-Icons_Edit-1" hidden={!hover}></i>
          </Position>
        </InputContainer>
      </UploadLogo>
    )
  })

export default ImageUploadPreview;