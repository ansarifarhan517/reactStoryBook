import React from "react";

interface IMentionObj {
  labelValue: string | JSX.Element;
  value: string;
  url?: string;
  groupName?: string;
}
interface ICustomFieldsRichTextEditor {
  mentionObj: IMentionObj;
}

const CustomFieldsRichTextEditor = ({
  mentionObj,
}: ICustomFieldsRichTextEditor) => {
  return (
    <div className="sub-component__customFieldCont">
      <div className="customrow" title={mentionObj?.labelValue + " (Custom)"}>
        <div className="customlabel">{mentionObj?.labelValue}</div>
        <em className="customtext">{mentionObj?.groupName}</em>
      </div>
    </div>
  );
};

export default CustomFieldsRichTextEditor;
