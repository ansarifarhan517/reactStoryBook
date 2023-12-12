import React from 'react'
import {
  StyledModal,
  HeaderWrapper,
  Header,
  FontIconStyle
} from './StyledSettingBox'

export interface IHeader {
  headerStyle?: string
  handleClose?: () => void
  headerTitle: string
  width?: string
  imageVariant?: string
}

const ModalHeader = ({
  headerTitle,
  handleClose = () => {},
  width
}: IHeader) => {
  return (
    <StyledModal width={width}>
      <HeaderWrapper width={width}>
        <Header>{headerTitle}</Header>
        <span
          style={{ paddingRight: '10px', cursor: 'pointer', margin: 'auto' }}
          onClick={handleClose}
        >
          <FontIconStyle color='white' size={13} variant='close' />
        </span>
      </HeaderWrapper>
    </StyledModal>
  )
}

export default ModalHeader
