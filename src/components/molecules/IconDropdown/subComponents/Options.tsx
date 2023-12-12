import React from 'react'
import makeAnimated from 'react-select/animated'
import { components } from 'react-select'
import {
    OptionCheckboxStyled,
    StyledCheckBoxlabel
} from '../../MultiSelect/MutiSelect.styled'
import FontIcon from '../../../atoms/FontIcon'

export const Option = (props: any) => {
    return (
        <OptionCheckboxStyled onClick={() => props.onOptionClick(props.data)}>
            <components.Option {...props}>
                {props?.isSetFavourite && (
                    <span
                        onClick={(e) => {
                            props?.onSetAsFavourite(props?.data)
                            e.stopPropagation()
                        }}
                    >
                        <FontIcon
                            variant={props.isFavourite ? 'star-filled' : 'star-empty'}
                            color={props.isFavourite ? 'primary.main' : ''}
                            size={14}
                            className='favourite-icon'
                        />
                    </span>
                )}{' '}
                <StyledCheckBoxlabel
                    title={props.label}
                >
                    {props.label}
                </StyledCheckBoxlabel>
            </components.Option>
        </OptionCheckboxStyled>
    )
}

export const AnimatedComponents = makeAnimated()
