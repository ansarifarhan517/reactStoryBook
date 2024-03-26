import styled from "styled-components";

export const BorderButton = styled.div.attrs(props => ({ className: `sc-border-button ${props.className || ''}` }))`
  height: 40px;
  padding: 0px 15px;
  line-height: 38px;
  border-radius: 3px;
  border-color: ${({ theme }) => theme?.colors?.primary?.main};
  color: ${({ theme }) => theme?.colors?.primary?.main};
  border: 2px dashed ${({ theme }) => theme?.colors?.primary?.main};
  cursor: pointer;
  text-align: center;
  width: 100%;
  margin-top: 16px;

  &:hover {
    background-color: white;
  }
`

export const CustomWrapper = styled.div`
.item-wrp {
  text-align: left;height: 34px;display: flex;flex-direction: row;align-items: center;
}
.item-img {
  height: 22px;cursor: move;transform: translate(-50%);
}
.tracker-delete-action {
    font-size: 17px !important;
    cursor: pointer;
    color: #5698d3;
  }
`

