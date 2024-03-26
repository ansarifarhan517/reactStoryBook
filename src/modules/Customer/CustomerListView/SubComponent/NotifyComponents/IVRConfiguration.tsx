import React from "react";
import NotifyRichTextEditor from "../NotifyRichTextEditor";
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

const IVRConfiguration = ({
  content,
  mentions,
  handleChange,
  active,
  dynamicNote,
  tags,
  setIvr,
}: any) => {
  const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING?.customer?.all_customers);
  return (
    <NotifyRichTextEditor
      label={dynamicLabels?.ivrMessage || "IVR Call"}
      placeholder={dynamicLabels?.enterIvrMessage || "Enter Ivr Message"}
      mentions={mentions}
      inputHTML={content?.ivrMessage}
      insertMentionsProgrammatically={true}
      handleChange={handleChange}
      active={active}
      dynamicNote={dynamicNote}
      skipHTMLTags={true}
      showCharCount={false}
      toolbar={false}
      tags={tags}
      setHTMLOutput={setIvr}
    />
  );
};
export default IVRConfiguration;
