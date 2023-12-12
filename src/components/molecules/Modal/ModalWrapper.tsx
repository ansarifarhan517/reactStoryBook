import React from 'react'
// import Position from '../../molecules/Position'
import StyledModal from './StyledModal'
export interface IModalWrapper {
  header: React.ReactNode
  content: React.ReactNode
  footer?: React.ReactNode
  width?: string
  size?: string
  isContentPadding?: boolean
}

const ModalWrapper = ({
  width,
  header,
  content,
  footer,
  size = 'md',
  isContentPadding = true
}: IModalWrapper) => {
  return (
    <div id='modalwrapperid'>
      {/* <Position type='absolute' top='71px'> */}
      <div>
        <StyledModal width={width} size={size}>
          {header || null}
          {isContentPadding ? (
            <StyledModal.ContentWrapper
              id='modal-body-id'
              isContentPadding={isContentPadding}
            >
              {content || null}
            </StyledModal.ContentWrapper>
          ) : (
            content || null
          )}
          {footer || null}
        </StyledModal>
      </div>
      {/* </Position> */}
    </div>
  )
}

export default ModalWrapper
