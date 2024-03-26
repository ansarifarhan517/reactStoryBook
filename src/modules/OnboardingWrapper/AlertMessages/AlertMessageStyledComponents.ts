import styled from 'styled-components';
import { IconButton } from 'ui-library';

export const AddBrandProfileButtonWrapper = styled.div`

  .addFromButton {
    height: 30px;
    padding: 7px 10px 8px;
    box-shadow: 0 2px 11px -5px #000000;
  }
`;


export const SectionHeaderWrapper = styled.div`
  width: 100%;
  & > div {
    & > div {
      & > div {
        font-size: 15px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000000;
      }
    }
  }
`;


export const Preview = styled.div`
  padding: 15px 50px;
  background-color: #f0f0f0;
  height: 700px;
  overflow-y: auto;
`;


export const BlankPreview = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 700px;
    color: #939393;
    margin-right: 50px;
    font-size: 17px;
    background-color: #f0f0f0;
  `;

export const FormActionButton = styled(IconButton)`
  padding: 10px 11px 10px 8px;
  border-radius: 1px;
  box-shadow: 0 2px 11px -5px #000000;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
`;

export const PageHeader = styled.div`
  margin-bottom: 25px;
  margin-right: 10px;
  border-bottom: solid 1px #eeeeee;
  ::after {
    content: '';
    height: 5px;
    background-color: #eeeeee;
    width: 22%;
    position: absolute;
    margin-top: 10px
  }
`;

export const PageTitle = styled.h3`
  font-size: 15px;
  margin: 0;
  color: rgb(0 0 0 / 76%);
`;

export const SingleTabContainer = styled.div`
  .tabs__panels {
    overflow: hidden;
  }
  button:not(.tab-button--active) {
    display: none;
  }
  .tab-button--active {
    width: 100%;
  }
`;