import React, { ReactNode } from 'react';
import styled from 'styled-components';


const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MobileContainer = styled.section`
    border-left: 12px solid;
    border-top: 51px solid;
    border-bottom: 84px solid;
    border-right: 12px solid;
    height: 700px;
    width: 404px;
    overflow-y: scroll;
    border-radius: 37px;
    padding: 0px;
    min-height: unset;
    background: inherit !important;
    padding-top: 0px;
  ::-webkit-scrollbar-button {
    display: none;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(158, 158, 158, 0.3);
  }
  ::-webkit-scrollbar-track {
    background: #eee;
    box-shadow: inset 0px 0px 7px -5px #000;
  }
`;

interface IPreviewProps {
  children?: ReactNode;
}

const MobilePreview = ({ children }: IPreviewProps) => {
  return (
      <CenteredDiv>
          <MobileContainer>{children}</MobileContainer>
      </CenteredDiv>
  );
};

export default MobilePreview;
