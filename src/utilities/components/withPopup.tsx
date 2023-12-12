import React, { ComponentType } from 'react'
import styled from 'styled-components'

const ModalProvider = require('styled-react-modal').ModalProvider
const BaseModalBackground = require('styled-react-modal').BaseModalBackground

export const FadingBackground = styled(BaseModalBackground)`
  opacity: 1;
  transition: opacity ease 200ms;
  z-index: 9050;
  background-color: ${({ theme }) => theme?.colors?.backdrop};
`

const withPopup = <P extends object = {}>(Component: ComponentType<P>) => ({
  ...rest
}: P) => {
  return (
    <ModalProvider backgroundComponent={FadingBackground}>
      <Component {...rest} />
    </ModalProvider>
  )
}

export default withPopup
