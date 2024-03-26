import styled from "styled-components";

export const BreadCrumbWrapper = styled.div`
padding-top:24px;
text-transform: capitalize;
display: flex;
width: 100%;
justify-content: space-between;
align-items: center;
`
export const SchedulerFormWrapper=styled.div`
.sc-main-content-container{
    min-height: auto;
};
.flexBreaker{
padding:0px;
flex-basis: 100%;
width: 0;
};
.grid-item{
padding-bottom:0px
};
.datetimePickerInput-input{
    width: 100%;
}
.pl18{
    padding-left: 18px;
}
#selectDAFromListFl-CheckboxWrapper{
    font-size: 13px;
    color: #000;
}
#continueWithoutOwnedFleetFl-CheckboxWrapper{
    font-size: 13px;
    padding-left: 18px;
    color: #000;
    margin-bottom: 20px;
}
.fade-overlay{
    position: relative;
&:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffffff78;
    z-index: 1;
}
}
`
export const OrderTimeWindowNote= styled.div`
font-size:13px;
color:#000;
margin-top: 14px;
margin-bottom: 20px;
`

export const AttactToTerritoriesModalWrapper = styled.div`
.attachToTerritoriesInput{
    border-bottom:1px dashed #000;
}
td, th {
    padding: 1.5rem;
    border-bottom: 1px solid #bfbfbf;
}
tr.SelectedGeofence{
    background: rgba(86,152,211,0.188);
    border: 1px solid #5698d3;
    box-shadow: inset 0px 1px 0px 1px #5698d3;
    border-bottom: 1px solid #5698d3;
    input{
        background: transparent;
    }
}
`

export const RowSummary= styled.div`
margin: 0;
    padding: 10px;
    background: #efefef;
    border-radius: 3px;
    margin-bottom: 15px;
`

export const TableWrapper= styled.div`
    padding: 3px;
    max-height: 280px;
    overflow-y: scroll;
    overflow-x: hidden;
    table{
    border-radius: 2px !important;
    box-shadow: 0px 2px 20px -10px #000 !important;
    background: #fff !important;
    }
    th{
        font-family: "Gotham-Rounded-Medium";
    vertical-align: top;
    color: #000;
    font-size: 14px;
    padding: 15px 15px;
    };
`
export const ActionButton =styled.div`
display:flex;
`