import styled from "styled-components";
import { Card, Grid } from "ui-library";

export const FilterSectionWrapper = styled(Card)`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 0px 0px 10px 0px;
  align-items: center;
  padding: 15px !important;
  background-color: #fff;

  button i {
    font-size: 12px !important;
    line-height: 12px !important;
    height: 12px !important;
  }
  & > div {
    margin: 0px 10px;
  }
  & > * {
    width: 100% !important;
  }
`;

export const TextInputStyled = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;

  & > div {
    width: 100%;
    & input {
      width: -webkit-fill-available;
      min-height: 40px;
      height: 40px;
    }
    & input.highlight-text-field-input,
    & input:focus {
      border: 1px solid ${({ theme }) => theme?.colors?.primary?.main};
      box-shadow: ${({ theme }) => `${theme?.shadows?.default}`};
      color: ${({ theme }) => theme?.colors?.primary?.main};
    }
    & input {
      margin: 15px 0px;
    }
  }
`;

export const WebHookHistoryWrapperStyled = styled.div``;
export const WebHookLowerSection = styled.div`
  display: block;
  width: 100%;
`;
export const EditorAreaStyled = styled.div`
  color: #767676;
  font-weight: lighter;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: fit-content;
  min-height: 100px;
  border-radius: 3px;
  background: #fbfbfb;
  width: 50%;
  display: inline-block;
  padding: 10px 10px 0px 0px;
  & > pre {
    max-height: 400px;
    overflow: auto;
    height: 400px;
    padding: 15px;
    word-break: normal;
  }
`;

export const WebHookDetailsStyled = styled(Grid)`
  margin: 10px 0px;
`;
export const WebHookHistoryHeading = styled.div`
  font-weight: 800;
  font-size: 14px;
`;
export const DetailBox = styled(Grid)`
  padding: 10px 10px 10px 0px;

  & > * {
    background-color: transparent;
    font-size: 14px;
    padding: 5px 0px;
  }
`;
export const DataWrapper = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;

  & > div {
    width: 100%;
  }
`;

export const AttemptsSectionWrapper = styled.div`
  width: 50%;
  height: auto;
  display: inline-block;
  vertical-align: top;
  border: 1px solid lightgray;
  padding: 15px;
  margin-top: 24px;
  max-height: 400px;
  height: 400px;
`;
export const WebHookButtonSection = styled.div`
  display:flex;
  width:100%;
  max-width:300px;
  justify-content: flex-start;
  margin:10px 0px;
  & button i {
    font-size: 12px;
    height: 12px;
    line-height: 12px;
  }
  & button:first-child {
    margin-right: 15px;
  }
`;
export const BreadCrumbWrapper = styled.div`
  & span {
    font-size: 14px;
    font-weight: 800;
    color: black;
  }
  & span button {
    font-size: 14px;
    font-weight: 800;
    color: black;
  }
  & button:hover {
    color: black !important;
  }
  & i {
    color: #aaaaaa !important;
  }
`;
export const DateRangeWrapper = styled.div`
  width: 100%;

  & input + div + div {
    margin: -3px 0px !important;
  }

  width: 100%;

  #eventDate_webhookHistory-input + div + div > div {
    min-height: auto !important;
  }
`;

export const SearchWrapper = styled.div`
  & button {
    line-height: 38px !important;
  }
`;
