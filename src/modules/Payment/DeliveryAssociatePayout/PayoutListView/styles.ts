import styled from 'styled-components';
import { Box, Card, Grid } from 'ui-library';

export const AddButtonWrapper = styled.div`
    position: absolute;
    top: 15px;
    right: 30px;

    .addFromButton {
        height: 30px;
        padding: 7px 10px 8px;
        box-shadow: 0 2px 11px -5px #000000;
    }
`

export const BodyGrid = styled(Grid)`
  flex-grow: 1;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-shadow: 0 2px 20px -10px #000;
  & button[disabled] {
    opacity: 0.2 !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar {
    width: 7px !important;
    height: 7px !important;
    cursor: grab !important;
  }

  .grid-customised-scroll-bar ::-webkit-scrollbar-track {
    -webkit-border-radius: 9px;
    border-radius: 9px;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 9px !important;
    border-radius: 9px !important;
    background-color: #dadce0 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:hover {
    background-color: #bdc1c6 !important;
  }
  .grid-customised-scroll-bar ::-webkit-scrollbar-thumb:active {
    background-color: #80868b !important;
  }
`;

export const BodyGridItem = styled(Grid)`
  display: flex;
  overflow: hidden;
  height: 100%;
`;

export const BodyCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding-right: 0;
  padding-bottom: 0;
`;

export const NoDataWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;


/////////

export const AlertProfilesMasterContainer = styled.div`
  [contenteditable=true]:focus {
    border: none;
  }

  .rdw-link-decorator-wrapper .rdw-link-decorator-icon {
    display: none;
  }

`



export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 60px;
  padding: 0 15px;
`;

export const BreadCrumbContainer = styled(Box)`
  margin: 20px 0;
  background-color: #fafafa;
  padding: 10px 0;
  label {
    white-space: nowrap;
  }
`;


export const PageHeader = styled.div.attrs(props => ({ className: `sc-page-header ${props.className || ''}` }))`
  padding: 20px 0px;
  font-weight: 700;
  font-size: 17px;
  `

export const StyledCard = styled(Card).attrs(props => ({ className: `sc-card ${props.className || ''}` }))`
  position: relative;
  background-color: white;
  height: 100%;
  width: 100%;
  padding: 15px;
`

export const ProfileDetailsCard = styled.div.attrs(props => ({ className: `sc-profile-details ${props.className || ''}` }))`
  background-color: white;
  border: 0.5px solid #d7d7d7;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  border-radius: 2px;

  .header {
    font-size: 14px;
    line-height: 15px;
    color: black;
    margin-bottom: 4px;
  }

  .description {
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.7);
  }

  .profile-actions {
    width: 30px;
    height: 30px;
    margin: 5px;
    display: flex;
    align-items: center;
  }
`

export const BorderButton = styled.div.attrs(props => ({ className: `sc-border-button ${props.className || ''}` }))`
  height: 40px;
  padding: 0px 15px;
  line-height: 38px;
  border-radius: 3px;
  border-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 2px dashed ${({ theme }) => theme?.colors?.primary?.main};
  cursor: pointer;
  background-white: transparent;
  text-align: center;

  &:hover {
    background-color: white;
  }
`