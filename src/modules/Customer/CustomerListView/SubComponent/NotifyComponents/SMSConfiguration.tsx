import React from 'react'
import NotifyRichTextEditor from '../NotifyRichTextEditor'
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";

const SMSConfiguration = ({ content, mentions, handleChange , active, dynamicNote, tags, setSms}: any) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING?.customer?.all_customers);
    return (
        <NotifyRichTextEditor
            label="SMS"
            placeholder={dynamicLabels?.enterSmsMessage || "Enter SMS Message"}
            mentions={mentions}
            inputHTML={content?.smsMessage}
            insertMentionsProgrammatically={true}
            handleChange={handleChange}
            active={active}
            dynamicNote={dynamicNote}
            skipHTMLTags={true}
            showCharCount={true}
            toolbar={false}
            tags={tags}
            setHTMLOutput={setSms}
        />
    )
}
export default SMSConfiguration



