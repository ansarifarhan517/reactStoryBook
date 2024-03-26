import styled from 'styled-components'

interface IAccodionSection {
  showStructure: boolean
}
export const AccordionSectionStyled = styled.div<IAccodionSection>`

.flex-container {
  display: flex;
  flex-direction: column;

}
.row {
  display: flex;

}
.child{
  width: 33.3%;
  margin-left: 15px;
  margin-right: 10px;
}
header, .row {
  display: flex;  /* aligns all child elements (flex items) in a row */
}

.col {
  flex: 1;        /* distributes space on the line equally among items */
}
& div[class$='control'] {
 min-height: 28px;
}


.border-bottom {
  border-bottom:2px solid #dddddd;
  padding-bottom: 5px;
  z-index: 100;
  margin-bottom: 10px;
}
`

export const AccordionHeaderTitle = styled.div.attrs((props) => ({
  className: `accordion-header-title ${props.className || ''}`
}))`
    padding-bottom: 3px;
    font-size: 14px;
    letter-spacing: 0.3px;
    line-height: 17px;
  `

export const AccordionHeaderSubTitle = styled.div.attrs((props) => ({
  className: `accordion-header-sub-title ${props.className || ''}`
}))`
    font-size: 13px;
    opacity: 0.7;
    letter-spacing: 0.3px;
    margin-top: 2px;
    line-height: 17px;
  `

export const AccordionContent = styled.div.attrs((props) => ({
  className: `accordion-content ${props.className || ''}`
}))`
    padding: 7px 15px;
    background-color: white;
    .add-addon{
        margin-left: 50%;
        padding: 10px 10px;
        color:${({ theme }) => theme?.colors?.primary?.main};
    }
  `

export const StyledCustomFields = styled.div`
    text-align: center;
    .square-button{
      margin-bottom: -10px;
      margin-top: 5px;
    }
   
  `

export const StyledTable = styled.div`
font-size:13px;
margin-left:15px;
margin-top:5px;
th {
  font-family: 'Gotham-Rounded-Medium', Sans-Serif !important;
  color: #46465f;
  font-size: 13px;
  text-align: left;
  position: relative;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 10px;
}
table tbody:not(.milkrun-table-body) {
  max-height: 78vh !important;
  overflow: scroll !important;
}
table {
  border: none;
}
table:not(.menuLockTable) {
  width: 100% !important;
}
@media (min-width: 768px)
table:not(.secondSubMenuTable) {
  table-layout: fixed;
}
tbody:before {
  content: '';
  display: block;
  height: 20px;
}
td{
  font-size:12px;
  font-weight: lighter;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-bottom: 2px solid #e0e0e0;
  padding-right: 8px;
  padding-bottom: 10px;
  padding-top: 8px
}
`