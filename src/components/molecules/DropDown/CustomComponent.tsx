import React from 'react'
import { components } from 'react-select'
import ReactTooltip from 'react-tooltip'
import { ReactComponent as Loader } from '../../../assets/icons/loader.svg'
import { tIntent, tVariant } from '../../atoms/Button'
import FontIcon from '../../atoms/FontIcon'
import {
  IconButtonStyled,
  StyledColumnOption
} from '../../molecules/IconDropdown/StyledIconDropdown'
import {
  StyledDisabledlabel,
  ControlStyle,
  DescriptiveOption
} from './StyledDropDown'
import { OptionType } from './interface'

// static components like icon , button can be memoised as values not going to change

// down arrow shown on form select fields
/* eslint-disable */
export const DropdownIndicator = ({ showDropdownIndicator, selectProps, ...rest }: any) =>
  React.useMemo(() => {
    const {
      variant,
      value
    }: { variant: string; menuIsOpen: boolean, value: OptionType } = selectProps
    // theme object going inside of select component
    const color = variant === 'list-view' ? 'grey.800' : 'black'
    return (
      <components.DropdownIndicator {...rest}>
        {!value && showDropdownIndicator!==false ? (
          <FontIcon size={8} variant='triangle-down' color={color} />
        ) : (
            <div />
          )}
      </components.DropdownIndicator>
    )
  }, [selectProps.variant, selectProps.value])

// for bradcrumb down arrow being shown
/* eslint-disable */
export const DownArrowIndicator = (props: any) => {
  const color = 'grey[A800]'

  return (
    <components.DropdownIndicator {...props}>
      {props?.selectProps?.variant === 'bread-crumb' ? (
        <div></div>
      ) : (
          <FontIcon
            size={10}
            color={color}
            variant='angle-down'
            hoverColor={color}
          />
        )}
    </components.DropdownIndicator>
  )
}

// loader being shown when values yet to load or searching value from the list
export const LoadingIndicator = (props: any) =>
  React.useMemo(() => {
    return (
      // eslint-disable-next-line
      <components.DropdownIndicator {...props}>
        <Loader />
      </components.DropdownIndicator>
    )
  }, [])

// input is shown here
export const Control = ({ children, ...rest }: any) =>
  React.useMemo(() => {
    return (
      // eslint-disable-next-line
      <ControlStyle {...rest} cx='default-contorl'>
        <components.Control {...rest}>{children}</components.Control>
      </ControlStyle>
    )
  }, [children])

export const Option = (props: any) => {
  delete props.innerProps.onMouseMove
  delete props.innerProps.onMouseOver
  const optionComponent = props.selectProps.optionComponent
  const selectedOption = props?.options?.filter(
    (option: any) => option.value === props.value
  )
  return (
    <>
    {props.isDisabled ? (
      <div title={props.data?.title || undefined}>
      <components.Option
        {...props}
      >
            <StyledDisabledlabel><div
              data-tip={props.data?.tooltipText}
              data-for={`tt-${props.data?.value}`}
          style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
             >
          {props.showOptionIcon && <span style={{ marginRight: 5 }}>
            <FontIcon className='option-icon' variant={props.data.iconVariant} size={11} />
          </span>}
          {optionComponent 
            ? optionComponent({ selectedOption: selectedOption[0] })
            : props.children}
            </div>
       
        <DescriptiveOption className='option_description'> {props.showDescription && props?.data?.description}</DescriptiveOption>
        </StyledDisabledlabel>
        {props.data?.tooltipText && (
          <ReactTooltip
            id={`tt-${props.data.value}`}
            type='info'
            effect='solid'
            place='bottom'
          />
        )}
      </components.Option>
      </div>) : 
      ( <div title={props.data?.title || undefined}>
        <components.Option
          {...props}
        >
              <div
                data-tip={props.data?.tooltipText}
                data-for={`tt-${props.data?.value}`}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
               >
            {props.showOptionIcon && <span style={{ marginRight: 5 }}>
              <FontIcon className='option-icon' variant={props.data.iconVariant} size={11} />
            </span>}
            {optionComponent 
              ? optionComponent({ selectedOption: selectedOption[0] })
              : props.children}
              </div>
         
          <DescriptiveOption className='option_description'> {props.showDescription && props?.data?.description}</DescriptiveOption>
          {props.data?.tooltipText && (
            <ReactTooltip
              id={`tt-${props.data.value}`}
              type='info'
              effect='solid'
              place='bottom'
            />
          )}
        </components.Option>
  
      </div>)
    
    }
   </>
  )
}

/* eslint-disable */
export const SingleValue = ({ showCrossIcon, children, ...rest }: any) =>
  React.useMemo(() => {
    const color = 'white'
    const style = {
      padding: '3px',
      margin: '0 7px',
      display: 'flex',
      backgroundColor: '#5698d3',
      cursor: 'pointer'
    }

    return (
      <components.SingleValue {...rest}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '100%', justifyContent: 'space-between' }}>
          <span style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}> {children}</span>
          {showCrossIcon !== false ? 
            <div
              style={style}
              onMouseDown={(e: any) => e.stopPropagation()}
              onClick={() => rest.setValue(null)}
            >
              <FontIcon variant='close' size={7} color={color} />
            </div> : <div />
          }
        </div>
      </components.SingleValue>
    )
  }, [children])

/* eslint-disable */
export const ValueContainer = ({ selectProps, ...rest }: any) =>
  React.useMemo(() => {
    const {
      iconButtonDetails,
      primary,
      intent,
      menuIsOpen
    }: {
      iconButtonDetails: string[]
      primary: boolean
      intent: tVariant
      menuIsOpen: boolean
    } = selectProps
    return (
      <components.ValueContainer {...rest}>
        <IconButtonStyled
          disabled={false}
          primary={primary}
          intent={intent as tIntent}
          menuIsOpen={menuIsOpen}
          {...rest}
          id='select-triggered-component'
          cx='icon-button-container'
        >
          <FontIcon variant={iconButtonDetails[0]} />
          <span>{iconButtonDetails[1]}</span>
          <FontIcon variant={iconButtonDetails[2]} />
        </IconButtonStyled>
      </components.ValueContainer>
    )
  }, [
    selectProps?.iconButtonDetails,
    selectProps?.primary,
    selectProps?.intent,
    selectProps?.menuIsOpen
  ])

export const ColumnOption = (props: any) => {
  delete props.innerProps.onMouseMove
  delete props.innerProps.onMouseOver
  const { iconVariant } = props?.data
  return (
    <components.Option {...props}>
      <StyledColumnOption>
        <FontIcon variant={iconVariant} size={11} />
        <span>{props.children}</span>
      </StyledColumnOption>
    </components.Option>
  )
}

export const EditedDropdownIndicator = ({ selectProps, ...rest }: any) => {
  return (
    <components.DropdownIndicator {...rest}>
      <FontIcon
        variant='breadcrumb-down-thin'
        color='primary.main'
        size={12}
      />
    </components.DropdownIndicator>
  )
}