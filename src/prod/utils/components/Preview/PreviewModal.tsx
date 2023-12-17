import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Modal, ModalHeader } from 'ui-library';

interface IModalProps {
  isModalOpen: boolean;
  toggleHandler: Function;
  modalTitle: string;
  children?: ReactNode;
}

const ModalContainer = styled.div`
  background: rgba(12, 26, 31, 0.71);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  > div {
    > div {
      padding: 0;
      overflow: auto;
    }
  }
  .preview-content-wrapper header{
    position: relative;
    padding: 0px;
    height: auto;
  } 
`;

const ContentWrapper = styled.div`
  margin: 0 30px 30px;
  overflow: auto;
`;

const PreviewModal = ({
  isModalOpen,
  toggleHandler,
  modalTitle,
  children,
}: IModalProps) => {
  return (
    <ModalContainer className="preview-modal-container">
      <Modal
        width='100vw'
        open={isModalOpen}
        onToggle={() => toggleHandler(false)}
      >
        {{
          header: (
            <ModalHeader
              width='100vw'
              headerTitle={modalTitle}
              imageVariant='icomoon-close'
              handleClose={() => toggleHandler(false)}
            />
          ),
          content: <ContentWrapper className="preview-content-wrapper">{children}</ContentWrapper>,
        }}
      </Modal>
    </ModalContainer>
  );
};

export default PreviewModal;
