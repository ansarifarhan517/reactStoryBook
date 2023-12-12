import React from 'react'
// import Modal from 'styled-react-modal'
import ModalWrapper from './ModalWrapper'
import { tSizes } from '../../../utilities/types'
import StyledModal from './StyledModal'
// import { ModalProvider } from 'styled-react-modal'
const Modal = require('styled-react-modal').default
const ModalProvider = require('styled-react-modal').ModalProvider

export interface IModalProps {
  open: boolean
  isContentPadding?: boolean
  onToggle: (value: boolean) => void
  children: {
    header: React.ReactNode
    content: React.ReactNode
    footer?: React.ReactNode
    triggerComponent?: React.ReactNode
  }
  /** 'sm' | 'md' | 'lg' */
  size?: tSizes
  width?: string
}

const ModalComponent = ({
  open = false,
  children,
  width,
  onToggle,
  size = 'md',
  isContentPadding = true,
}: IModalProps) => {
  const { header, content, footer, triggerComponent } = children

  return (
    <ModalProvider backgroundComponent={StyledModal.FadingBackground}>
      {triggerComponent || null}
      <Modal
        isOpen={open}
        onBackgroundClick={() => onToggle(false)}
        onEscapeKeydown={() => onToggle(false)}
      >
        <ModalWrapper
          width={width}
          header={header}
          footer={footer}
          content={content}
          size={size}
          isContentPadding={isContentPadding}
        />
      </Modal>
    </ModalProvider>
  )
}

export { ModalComponent as default }
