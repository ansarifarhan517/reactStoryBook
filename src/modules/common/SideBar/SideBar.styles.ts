import styled from 'styled-components'

export const StyledAccordionHeaders = styled.div< { expanded?: boolean }>`
font-family: "Gotham-Rounded-Medium";
font-size: 14px;
letter-spacing: 0.3px;
 `

export const HeaderWrapper = styled.div`
color:#424242;
display:flex;
justify-content: space-between;
& > * {
    align-self:center;
}
&:hover{
    background-color: #fafafa;
    color:#5698d3;
}
`;

export const SideBarHeader = styled.div`
align-items: center;
justify-content: space-between;
padding:25px 15px;
border-bottom: 1px solid #eee;
`;

export const SideBarHeading = styled.div`
color: #000;
font-size: 17px;
`;
export const SideBarCollapse = styled.div`
.icon-angle-left{
font-size: 12px;
}
text-align: -webkit-right;
`;

export const SideBarWrapper = styled.div`
width: 315px;
box-shadow: 0px 1px 15px -7px #000;
background-color: #fff;

.accordian__container{
margin:'-10px -10px 10px';
box-shadow:none;

.accordion__header__container{
    &:hover{
    background-color: #fafafa;
    color:#5698d3;
}
}
}
.chevron{
font-size: 18px;
color: #5698d3;
}
.subLevelMenu{
color: #545454;
padding: 9px 15px 9px 10px;
cursor:pointer;
&.menu-disabled{
    opacity: 0.5;
    cursor: not-allowed;
}
&.active{
    background-color: #fafafa;
    color:#5698d3;
}
}
`;

export const SideBarContent = styled.div`
height: calc(100vh - 190px);
overflow-y: auto;
`;