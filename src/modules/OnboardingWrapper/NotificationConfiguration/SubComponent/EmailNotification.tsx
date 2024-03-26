import React from "react";
import { Box, RichTextEditor, insertMention } from "ui-library";
import InputFieldHelpText from "../../../../utils/components/InputFieldHelpText";
import { tEmailNotificationProps } from "./Notification.model";
import AttachDynamicTags from "./AttachDynamicTags";

const EmailNotification = ({
  editorStateEmailSubject,
  EmailSubjectEditorOnChange,
  editorStateEmailBody,
  EmailBodyEditorOnChange,
  mentionSuggesstionsProp,
  dynamicLabels,
  tags,
  setEditorStateEmailBody,
  setEditorStateEmailSubject,
}: tEmailNotificationProps) => {

  return (
    <>
      <Box mb="10px">
        <AttachDynamicTags
          onSelect={(label: string, value: string = "") => {
            setEditorStateEmailSubject(
              insertMention(
                editorStateEmailSubject,
                { text: label, value: value },
                false
              )
            );
          }}
          show={mentionSuggesstionsProp?.length > 0 ? undefined : false}
          tags={tags}
        >
          <div className="sub-component__email-subject-container sub-component__notification-editor">
            <RichTextEditor
              id="notificationEmailSubject"
              label={dynamicLabels?.notificationEmailSubject || "Email Subject"}
              toolbarHidden
              placeholder={
                dynamicLabels?.notificationEmailSubject || "Email Subject"
              }
              editorState={editorStateEmailSubject}
              onEditorStateChange={EmailSubjectEditorOnChange}
              mention={{
                separator: " ",
                trigger: "@",
                suggestions: mentionSuggesstionsProp,
              }}
            />
          </div>
        </AttachDynamicTags>
        <AttachDynamicTags
          onSelect={(label: string, value: string = "") => {
            setEditorStateEmailBody(
              insertMention(
                editorStateEmailBody,
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
              id="notificationEmailBody"
              label={dynamicLabels?.notificationEmailBody || "Email Body"}
              toolbarHidden={false}
              placeholder={dynamicLabels?.notificationEmailBody || "Email Body"}
              editorState={editorStateEmailBody}
              onEditorStateChange={EmailBodyEditorOnChange}
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

export default EmailNotification;
