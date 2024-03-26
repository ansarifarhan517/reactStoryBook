import React from "react";
import styled from 'styled-components';

export const CenteredContentWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;
export const NumberCountWrapper = styled.div`
    background: #5698d3;
    color: #fff;
    line-height: initial;
    vertical-align: middle;
    padding: 3px 3px;
    padding: 3px 5px;
    border-radius: 2px;
    cursor: pointer;
    &.disabled-number-count {
        background: #dadada !important;
        cursor: not-allowed !important;
    }
`

interface INumberCount {
    value: number | undefined;
    onClick: () => void;
}

const NumberCount = ({ value, onClick }: INumberCount) => {
    return <CenteredContentWrapper onClick={() => onClick()}><NumberCountWrapper className={!value ? 'disabled-number-count' : "number-count"}>{!value ? 0 : value}</NumberCountWrapper></CenteredContentWrapper>
}

export default NumberCount;