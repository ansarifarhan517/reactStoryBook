import React from 'react'
import StyledModal from '../Modal/StyledModal'

export interface IHeader {
  headerStyle?: any
  handleClose?: () => void
  headerTitle: string
  width?: string
  imageVariant?: string
  showIcon?: boolean
}

const ModalHeader = ({
  headerStyle,
  headerTitle,
  handleClose = () => {},
  width,
  showIcon = true
}: IHeader) => {
  return (
    <StyledModal width={width}>
      <StyledModal.HeaderWrapper width={width}>
        <StyledModal.Header headerStyle={headerStyle}>
          {headerTitle}
        </StyledModal.Header>
        {showIcon ? (
          <span
            style={{ padding: '15px', cursor: 'pointer' }}
            onClick={handleClose}
          >
            <StyledModal.FontIconStyle
              color='white'
              size={13}
              variant='close'
            />
          </span>
        ) : null}
      </StyledModal.HeaderWrapper>
    </StyledModal>
  )
}

export default ModalHeader
