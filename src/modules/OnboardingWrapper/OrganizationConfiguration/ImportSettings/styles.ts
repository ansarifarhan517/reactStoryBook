import styled from 'styled-components';

export const IconDropdownStyle = styled.div<{padding?: string}>`
  box-shadow: 0 2px 20px -10px #000;
  color: black;
  padding: ${({ padding }) => padding ? padding : "15px"};
  background-color: white;
  position: relative;
  left: 7.5px;
  margin: 0px 8px 0px 8px;
`;

export const BoxContainer = styled.div<{padding?: string}>`
  background: #fff;
  box-shadow: 0px 0px 20px -7px #000;
  height: 100%;
  width: 100%;
  border-radius: 3px;
  padding: ${(props : any) => props?.padding ? props.padding : "15px"};
  position: relative;
  margin-left: auto;
  margin-right: auto;
  overflow: auto;
`;

export const FormSelectDropdownWrapper = styled.div`
  color: #5698d3;
`;