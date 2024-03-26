import React from 'react'
import styled from 'styled-components';

interface ICustomFieldsGrouppedDropDown {
    customLabel : string ,
    customText : string
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
        display: inline-block;
        white-space: nowrap;
        border: 1px solid #edaa48;
        color: #edaa48;
        padding: 2px;
        font-size: 13px;
        border-radius: 3px;
        text-transform: uppercase;
    }
`
const CustomFieldsGrouppedDropDown = ({ customLabel , customText} : ICustomFieldsGrouppedDropDown) => {

    return (
        <CustomFieldCont>
            <div className="customrow" title={customLabel}>
                <div className="customlabel">{customLabel}</div>
                <div className="customtext">{customText}</div>
            </div>
        </CustomFieldCont>

    )
}


export default CustomFieldsGrouppedDropDown