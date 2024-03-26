import React, { useState, Dispatch, useEffect, useMemo } from "react";
import { Box, FontIcon, RichTextEditor, insertMention } from "ui-library";
import InputFieldHelpText from "../../../../utils/components/InputFieldHelpText";
import "./SubComponentStyles.scss";
import AttachDynamicTags from "./AttachDynamicTags";
import { tSMSNotificationProps } from "./Notification.model";

const SMSNotification = ({
  editorStateSMS,
  SMSEditorOnChange,
  mentionSuggesstionsProp,
  dynamicLabels,
  tags,
  setEditorStateSMS,
}: tSMSNotificationProps) => {
  const [charCount, setCharCount] = useState<number>(0);

  useEffect(() => {
    setCharCount(
      editorStateSMS.getCurrentContent().getPlainText("\u0001").length
    );
  }, [editorStateSMS]);

  return (
    <>
      <Box mb="10px">
        <AttachDynamicTags
          onSelect={(label: string, value: string = "") => {
            setEditorStateSMS(
              insertMention(
                editorStateSMS,
                { text: label, value: value },
                false
              )
            );
          }}
          show={mentionSuggesstionsProp?.length > 0 ? undefined : false}
          tags={tags}
        >
          <div className="sub-component__notification-editor">
            <RichTextEditor
              label={dynamicLabels?.smsMessage || "SMS Message"}
              toolbarHidden
              placeholder={dynamicLabels?.smsMessage || "SMS Message"}
              editorState={editorStateSMS}
              onEditorStateChange={SMSEditorOnChange}
              mention={{
                separator: " ",
                trigger: "@",
                suggestions: mentionSuggesstionsProp,
              }}
            />
          </div>
        </AttachDynamicTags>
        <Box display="flex" justifyContent="space-between" fullWidth>
          <InputFieldHelpText>
            {"Type '@' to enter "}
            <Box color="primary.main" display="inline-block">
              @Dynamic Tags
            </Box>
            {" in messages."}
          </InputFieldHelpText>
          <InputFieldHelpText>
            <span style={{ marginRight: 5 }}>
              <FontIcon variant="chat" style={{ fontSize: "inherit" }} />
            </span>
            <span>{`${dynamicLabels.sms_s} Count: ${Math.ceil(
              charCount / 160
            )} (${charCount} Characters)`}</span>
          </InputFieldHelpText>
        </Box>
      </Box>
    </>
  );
};

export default SMSNotification;
