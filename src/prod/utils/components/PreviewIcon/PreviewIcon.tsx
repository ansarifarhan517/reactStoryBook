import React, { ReactNode } from "react";
import styled from 'styled-components';

const PreviewContainer = styled.div`
    background: ${(props) => props.className?.includes("preview-container-active") ? "rgba(109, 168, 221, 0.33)" : "transparent"};
    padding: 0;
    border: ${(props) => props.className?.includes("preview-container-active") ? "solid 4px #5698d3" : "none"};
    border-radius: ${(props) => props.className?.includes("preview-container-active") ? "9px" : "unset"};
`;

const Preview = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;      
  min-height: 201px;
  height: auto;
  margin: 10px; 
  padding: 14px 63px 14px 64px;
  border: solid 1px #d1d1d1;
  background-color: #f1f3f4;
  cursor: pointer;
  overflow-y: auto;
`

interface IPreviewProps {
    children?: ReactNode
    className?: string;
    onClick: () => void;
}

const PreviewIcon = ({children, className, onClick}: IPreviewProps) => {
    return (
    <PreviewContainer onClick={onClick} className={`${className}`}>
        <Preview>
        {children}  
        </Preview>
    </PreviewContainer>
    )
}

export default PreviewIcon;