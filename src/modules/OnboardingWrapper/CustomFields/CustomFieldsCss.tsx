import styled from 'styled-components'

export const DuplicateCont = styled.div`

.cf_span {
    position: absolute; 
    top: 23px;
    z-index: 1000; 
    left: 8px; 
    background: #efefef;
    padding: 0px 5px; 
    line-height: 30px;
    border-radius: 4px;
    opacity: 0.5;
}
.field_input {
    position: relative;
    margin-bottom: 10px;
}
.field_input input{
   margin-bottom: 5px;
}
`
export const ListViewCont =  styled.div`
.sc-pYNsO {
    white-space: nowrap;
    -ms-text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    overflow: hidden;
}
`
export const Toast = styled.div`

#toast-inject-here .message {
    margin-bottom: 10px;
}
#toast-inject-here .sc-qXhiz{
    width:50%;
    margin: 0 25%;
}
`
export const AddEditCont = styled.div`
.add-edit-modal-cont {
    max-height: calc(100vh - 250px);
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    padding: 15px;
    margin-right: 15px;
    padding-top: 0px;
}
.add-edit-modal-cont .section-title {
    color: #000;
    font-size: 15px;
    padding-top:5px;
    padding-bottom:10px;
    letter-spacing: 0.6px;
    text-transform: capitalize;
}
.add-edit-modal-cont .labelUnderlineWrapper .labelUnderline {
    background-color: #eee;
    width: 100%;
    padding: 0.2em 0px;
}
.add-edit-modal-cont .labelLineWrapper {
    margin-left: -15px;
    padding: 0;
    border: .5px solid #eee;
}
.min-max-cont {
    display : flex;
}
.error-label{
    color: red;white-space: nowrap; font-size: 12px;margin-top:-10px;position:absolute;
}
.multi-select{
    position: relative
}
.css-w7lbga-control{
    background-color: white;
}
.sc-pJurq {
    cursor: no-drop;
}
.css-1q5l3n-ValueContainer{
    flex-wrap:nowrap
}
`
export const CustomDropDown = styled.div`
.field-validation-cont {
    margin: 0px;
    margin-bottom: 30px;
}
.section-label {
    position: relative;
    background: white;
    font-size: 12px;
    top: 10px;
    z-index: 10;
    margin-left: 10px;
}
.dropdown-container {
    max-height: 200px;overflow-x: hidden;overflow-y: scroll;border: 1px solid gray;;padding: 15px;
}
.item-wrp {
    text-align: center;height: 34px;display: flex;flex-direction: row;align-items: center;
}
.item-img {
    height: 22px;cursor: move;transform: translate(-50%);margin-left: 50%;
}
.add-dropdown-btn {
    height: 40px;line-height: 37px;padding: 0px 15px;font-family: 'Gotham-Rounded';margin-top: 0px;color: #5698d3;
}
`