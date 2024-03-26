import styled from 'styled-components';

export const Label = styled.div`
color: #000;
font-family: "Gotham-Rounded-Medium";
font-size: 13px;
display: block;
margin-bottom: 5px;
`

export const Divider = styled.div`
border: 1px solid #c8c8c8;
padding: 0;
width: 100%;
margin: 20px 0;`

export const MessageContainer = styled.div`
border: 1px solid #e7e7e7;
border-radius: 4px;
background: #f6f6f6;
padding: 10px 10px 0 10px;
width: 100%;
`
export const FileContainer = styled.div`
background:rgba(86,152,211,0.031);
border: 1px dashed #5697d3;
border-radius: 30px;
padding: 5px 30px 5px 5px;
display: inline-block;
color: #5697d3;
width: 200px;
margin: 5px;
white-space: nowrap;
overflow: hidden;
position: relative;
text-overflow: ellipsis;
`
export const FileNameContainer = styled.div`
overflow: hidden;
position: relative;
text-overflow: ellipsis;
width: 100px;
display: inline-block;
vertical-align: middle;
margin-left: 3px;
`
export const RemoveFileButton = styled.div`
border-radius: 50%;
background: rgb(86,152,211);
color: rgb(255,255,255);
width: 15px;
height: 15px;
text-align: center;
position: absolute;
top: 4px;
right: 6px;
cursor: pointer
`

export const AttachmentFileName = styled.div`
    color: rgb(150, 208, 238);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        color: #5698d3;
        background-color: transparent;
    }
`

export const DetailValue = styled.p`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

`