import React from "react";
import {FontIcon }from "ui-library"
import DYNAMIC_LABELS_MAPPING from "../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../common/DynamicLabels/useDynamicLabels";
import { FieldIconContainer, FieldTypeContainer } from "../CustomFormsStyledComponents";
import styled from "styled-components";

interface IFieldTypesProps {
    iconVariant: string;
    label: string;
}
const FieldType = ({iconVariant, label}: IFieldTypesProps) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.customForms)
    return(
        <FieldTypeContainer className="field-type-container">
            <FieldIconContainer className="field-icon-container">
                {
                 dynamicLabels[label] !== 'Paragraph' ? (
                    <FontIcon
                    color="#5698d3"
                    size={12}
                    variant={iconVariant}
                    hoverColor="#FFF"
                    />
                ): <ParagraphIcon/>
                }
            </FieldIconContainer>
            <span>{dynamicLabels[label]}</span>
        </FieldTypeContainer>
    )
}


const StyledParagraphIcon = styled.svg`
    &:hover path {
        fill: #E4E9F1;
    }
    &:hover rect {
        fill: #5698d3;  
    }
   
`

const ParagraphIcon = () => {
    return (
        <StyledParagraphIcon width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="paragraph-svg">
            <rect x="0" y="0" width="36" height="36" fill="#F2F7FC" stroke="#E4E9F1" />
            <path d="M20.6 9H13.1333C12.0371 9 10.9858 9.45573 10.2106 10.2669C9.43547 11.0781 9 12.1784 9 13.3256C9 14.4728 9.43547 15.573 10.2106 16.3842C10.9858 17.1954 12.0371 17.6512 13.1333 17.6512H15.9333V20.5814C15.9333 20.6924 15.9755 20.7989 16.0505 20.8774C16.1255 20.9559 16.2272 21 16.3333 21C16.4394 21 16.5412 20.9559 16.6162 20.8774C16.6912 20.7989 16.7333 20.6924 16.7333 20.5814V9.83721H18.6V20.5814C18.6 20.6924 18.6421 20.7989 18.7172 20.8774C18.7922 20.9559 18.8939 21 19 21C19.1061 21 19.2078 20.9559 19.2828 20.8774C19.3579 20.7989 19.4 20.6924 19.4 20.5814V9.83721H20.6C20.7061 9.83721 20.8078 9.79311 20.8828 9.7146C20.9579 9.6361 21 9.52963 21 9.4186C21 9.30758 20.9579 9.20111 20.8828 9.12261C20.8078 9.0441 20.7061 9 20.6 9ZM15.9333 16.814H13.1333C12.2493 16.814 11.4014 16.4464 10.7763 15.7922C10.1512 15.138 9.8 14.2508 9.8 13.3256C9.8 12.4004 10.1512 11.5131 10.7763 10.8589C11.4014 10.2047 12.2493 9.83721 13.1333 9.83721H15.9333V16.814Z" fill="#5698D3" />
        </StyledParagraphIcon>
    )
}

export default FieldType;

