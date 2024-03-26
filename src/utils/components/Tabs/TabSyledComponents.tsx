import styled from 'styled-components';


export interface ITabs {
  active: boolean;
}

export const Tabs = styled.div`
  overflow: hidden;
  background: #fff;
  font-family: Open Sans;
  height: 3em;
`;

export const Tab = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  width: 40%;
  position: relative;

  margin-right: 0.1em;
  font-size: 1em;
  border: ${(props: ITabs) => (props.active ? '1px solid #ccc' : '')};
  border-bottom: ${(props: ITabs) => (props.active ? 'none' : '')};
  background-color: ${(props: ITabs) => (props.active ? 'white' : 'lightgray')};
  height: ${(props: ITabs) => (props.active ? '3em' : '2.6em; top:.4em')};
  transition: background-color 0.5s ease-in-out;

  :hover {
    background-color: white;
  }
`;

export const Content = styled.div`
  ${(props: ITabs) => (props.active ? '' : 'display:none')}
`;

export const Button = styled.button.attrs((props) => ({
  className: `styled-tab-button ${props.className}`,
}))`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  background: #fff;
  line-height: normal;
  letter-spacing: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  width: 50%;
  color: ${(props) =>
    props.className.includes('tab-button--active') ? '#5698d3' : '#333333'};
  padding: 5px 10px;
  border-bottom: ${(props) =>
    props.className.includes('tab-button--active')
      ? '3px solid #5698d3'
      : '1px solid #cccccc'};
`;

export const TabContent = styled.div.attrs((props) => ({
  className: `styled-div-panel ${props.className}`,
}))`
  width: 100%;
  opacity: ${(props) =>
    props.className.includes('tab-panel--active') ? 1 : 0};
  display: ${(props) =>
    props.className.includes('tab-panel--active') ? 'block' : 'none'};
  padding: 15px;
  transition: opacity 0.3s;
`;

export const ContentContainer = styled.div.attrs((props) => ({
  className: `styled-content-container ${props.className}`,
}))`
  overflow: hidden;
  width: 100%;
  background: white;
  min-height: 50px;
`;

export const TabButtons = styled.div.attrs((props) => ({
  className: `styled-button-wrapper ${props.className}`,
}))`
  position: relative;
  z-index: 1;
  background: #ffffff;
`;

export const TabPanels = styled.div.attrs((props) => ({
  className: `styled-panel-wrapper ${props.className}`,
}))`
  overflow-y: auto;
  height: 655px;
  width: 100%;
  background: white;
`;

export const TabTracker = styled.div.attrs((props) => ({
  className: `styled-tab-tracker ${props.className}`,
}))`
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
`;

export const TabContainer = styled.div`
  width: 100%;
  margin: 0 0 1px;
  padding: 5px 0 10px;
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.23);
  background-color: #ffffff;
`;
