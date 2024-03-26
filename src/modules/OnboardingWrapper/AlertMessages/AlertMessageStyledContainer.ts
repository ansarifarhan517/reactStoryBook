import styled from 'styled-components';

export const AlertMessageStyledContainer = styled.div`
.ace_tooltip {
    background-color: #ffcbc6;
    background-image: none;
    margin: 3px 204px 2px 0;
    padding: 3px 1px 7px;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.47);
    border: solid 1px #f05548;
    font-size: 12px;
    color: #f05548;
}
    
.ace_gutter-cell.ace_error {
    background-image: none;
}

.ace_gutter-cell.ace_error::before {
    content: '!';
    position: absolute;
    background: #f05548;
    left: 2px;
    color: #fff;
    z-index: 200;
    width: 14px;
    line-height: 14px;
    height: 14px;
    text-align: center;
    border-radius: 50px;
}    
#modalwrapperid > div > div > div:last-of-type {
    padding: 0px 15px 15px 14px!important;
} 

.test-email-container > div > div:last-of-type {
    z-index: 10;
}
`;