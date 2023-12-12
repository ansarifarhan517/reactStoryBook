import styled, { keyframes } from 'styled-components'
import FontIcon from '../../atoms/FontIcon'
import { tSizes } from '../../../utilities/types'
// import { BaseModalBackground } from 'styled-react-modal'
const BaseModalBackground = require('styled-react-modal').BaseModalBackground
interface IModalWrapperProp {
  width?: string
  size?: tSizes
  headerStyle?: string
  isContentPadding?: boolean
}
const slideIn = keyframes`
  from {
    transform: translateY(-30px);
    opacity: 0;
  }

  to {
    transform: translateY(0px);
    opacity: 1;
  }
`
const StyledModal: any = styled.div<IModalWrapperProp>`
  animation: ${slideIn} 0.15s linear;
  position: relative;
  width: ${({ theme, size }) => theme?.modal?.[size || 'md']};
  ${({ width }) => width && `width: ${width};`}
  height: auto;
  background-color: ${({ theme }) => theme?.colors?.primary?.contrastText};
`
const Header = styled.h4<IModalWrapperProp>`
  font-size: 15px;
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  opacity: 1;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 14px;
  font-weight: 500px;
  position: sticky;
  ${({ headerStyle }) => headerStyle}
`
const HeaderWrapper = styled.div<IModalWrapperProp>`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  height: 45px;
  display: flex;
  ${({ width }) => `width: ${width || 'inherit'};`}
`

const FontIconStyle = styled(FontIcon)`
  opacity: 0.6;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding-right: 14px;
`

const ContentWrapper = styled.div<IModalWrapperProp>`
  padding: ${({ isContentPadding }) =>
    isContentPadding ? '20px 15px 15px 14px' : '0px'};
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opactiy: 1;
  }
`
const FadingBackground = styled(BaseModalBackground)`
  animation: ${fadeIn} 0.15s linear;
  background-color: ${({ theme }) => theme?.colors?.popUpOverlay};
  z-index: ${({ theme }) => theme?.zIndex?.modal};
  align-items: flex-start;
  padding-top: 71px;
`

StyledModal.Header = Header
StyledModal.HeaderWrapper = HeaderWrapper
StyledModal.FontIconStyle = FontIconStyle
StyledModal.ContentWrapper = ContentWrapper
StyledModal.FadingBackground = FadingBackground

export default StyledModal
