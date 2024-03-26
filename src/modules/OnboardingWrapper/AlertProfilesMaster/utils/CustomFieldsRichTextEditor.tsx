import React from 'react'
import styled from 'styled-components';

interface IMentionObj{
    text: string | JSX.Element
    value: string
    url?: string,
    groupName?:string
}
interface ICustomFieldsRichTextEditor {
    mentionObj : IMentionObj
  }

export const CustomFieldCont = styled.div`
    position : relative;
    .customrow{
        display : flex;
        align-items: center;
    }
    .customlabel{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 10px;
        flex-grow: 1;
        padding: 1px 0px;
    }
    .customtext{
        color: #a8a8a8;
        display: inline-block;
        white-space: nowrap;
        margin-right: 10px; 
    }
`
const CustomFieldsRichTextEditor = ({ mentionObj} : ICustomFieldsRichTextEditor) => {

    return (
        <CustomFieldCont>
            <div className="customrow" title={mentionObj?.text + ' (Custom)'}>
                <div className="customlabel">{mentionObj?.text}</div>
                <em className="customtext">{mentionObj?.groupName}</em>
            </div>
        </CustomFieldCont>

    )
}


export default CustomFieldsRichTextEditor