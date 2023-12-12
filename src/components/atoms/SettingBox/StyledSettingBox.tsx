import styled from 'styled-components'
import FontIcon from '../FontIcon'

interface ISettingBox {
  width?: string
  disabled?: boolean
}
// need to check , how can i put media query here
// height: calc(100% - 70px);
// top: 47px;
export const StyledSettingBox = styled.div<ISettingBox>`
  width: 350px;
  background-color: white;
  position: absolute;
  right: 10px;
  z-index: 1500;
  label {
    display: inline-block;
  }
  box-shadow: 0 2px 11px -5px #000;
  height: calc(100% - 30px);
  top: 15px;
  .footer {
    span {
      font-size: 13px;
    }
  }
`

export const StyledSettingOption = styled.div<ISettingBox>`
  .title {
    font-size: 13px;
    color: ${({ theme }) => theme?.colors?.black};
    font-weight: bold;
    margin: 0px 0px 10px 5px;
  }
  &:hover {
    background-color: ${({ theme }) => theme?.colors?.grey['100']};
  }
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  ${({ disabled }) => {
    if (disabled) {
      return ' pointer-event: none; '
    }
    return ''
  }}
  padding: 20px 0px 10px 10px;
`
export const StyledImage = styled.img`
  width: 18px;
  height: 18px;
  margin: -10px 10px -5px 10px;
`
export const StyledIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  z-index: 1000;
  margin: 20px 10px;
`
// height: calc(100% - 15px);
export const StyledBody = styled.div`
  overflow: hidden scroll;
  height: calc(100% - 110px);
  background-color: white;
  input:disabled {
    opacity: 0 !important;
  }
`
export const StyledModal: any = styled.div<ISettingBox>`
  ${({ width }) => `width: ${width || 'inherit'};`}
  height: auto;
  background-color: ${({ theme }) => theme?.colors?.primary?.contrastText};
`

export const HeaderWrapper = styled.div<ISettingBox>`
  background-color: ${({ theme }) => theme?.colors?.primary?.main};
  display: flex;
  position: sticky;
  top: 15px;
  z-index: ${({ theme }) => theme?.zIndex?.snackbar};
  ${({ width }) => `width: ${width || 'inherit'};`}
  height: 40px;
`
export const FontIconStyle = styled(FontIcon)`
  opacity: 0.6;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
`
export const Header = styled.span<ISettingBox>`
  font-size: 13px;
  color: ${({ theme }) => theme?.colors?.primary?.contrastText};
  opacity: 1;
  width: 100%;
  display: flex;
  padding-left: 14px;
  font-weight: 500;
  position: sticky;
  margin: auto;
  justify-content: center;
`

export const StyledButton = styled.div`
  height: 35px;
  width: 35px;
  right: 15px;
  -o-transition: all;
  transition: all;
  -webkit-transition: all 0.3s ease-in-out;
  background-color: #5698d3;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
`
