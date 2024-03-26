import styled from 'styled-components';
import { Card } from 'ui-library'

export const AlertProfilesMasterContainer = styled.div`
  [contenteditable=true]:focus {
    border: none;
  }

  .rdw-link-decorator-wrapper .rdw-link-decorator-icon {
    display: none;
  }

`


export const PageHeader = styled.div.attrs(props => ({ className: `sc-page-header ${props.className || ''}` }))`
  padding: 20px 0px;
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