import React, { ReactNode } from 'react';
import styled from 'styled-components';

const DesktopContainer = styled.section`
  border: 20px solid;
  height: calc(100vh - 180px);
  overflow-y: scroll;
  border-radius: 7px;
  padding: 0px;
  min-height: unset;
  background: inherit !important;
  padding-top: 0px;
  color: #46465f;
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

const DesktopBase = styled.div`
  display: flex;
  width: 100%;
  height: max-content;
  align-items: center;
  flex-direction: column;
  margin-top: -10px;
`;

const Neck = styled.div`
  height: 30px;
  width: 240px;
  background: #45485e;
  box-shadow: inset 0px 15px 8px -2px #000000d4;
`;

const Base = styled.div`
  height: 20px;
  width: 400px;
  border-radius: 10px;
  background: #45485e;
`;

interface IPreviewProps {
  children?: ReactNode;
}

const DeskopPreview = ({ children }: IPreviewProps) => {
  return (
    <>
      <DesktopContainer>{children}</DesktopContainer>
      <DesktopBase>
        <Neck />
        <Base />
      </DesktopBase>
    </>
  );
};

export default DeskopPreview;
