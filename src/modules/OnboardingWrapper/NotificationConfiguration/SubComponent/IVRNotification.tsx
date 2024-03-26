import React from "react";
import { Box, RichTextEditor, insertMention } from "ui-library";
import InputFieldHelpText from "../../../../utils/components/InputFieldHelpText";
import "./SubComponentStyles.scss";
import { tIVRNotificationProps } from "./Notification.model";
import AttachDynamicTags from "./AttachDynamicTags";

const IVRNotification = ({
  editorStateIVR,
  IVREditorOnChange,
  mentionSuggesstionsProp,
  dynamicLabels,
  tags,
  setEditorStateIVR,
}: tIVRNotificationProps) => {

  return (
    <>
      <Box mb="10px">
        <AttachDynamicTags
          onSelect={(label: string, value: string = "") => {
            setEditorStateIVR(
              insertMention(
                editorStateIVR,
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
              label={dynamicLabels?.ivrMessage || "IVR Message"}
              toolbarHidden
              placeholder={dynamicLabels?.ivrMessage || "IVR Message"}
              editorState={editorStateIVR}
              onEditorStateChange={IVREditorOnChange}
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
        </Box>
      </Box>
    </>
  );
};

export default IVRNotification;
