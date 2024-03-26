import React from 'react'
import NotifyRichTextEditor from '../NotifyRichTextEditor'
import DYNAMIC_LABELS_MAPPING from "../../../../common/DynamicLabels/dynamicLabels.mapping";
import useDynamicLabels from "../../../../common/DynamicLabels/useDynamicLabels";


const EmailConfiguration = ({ content, mentions,handleBodyChange, handleSubjectChange ,active, dynamicNote, tags, setSubject, setBody}: any) => {
    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING?.customer?.all_customers);
    return (
        <div>
            <div className='sub-component__EmailSubjectContainer'>
                <NotifyRichTextEditor
                    label="Subject"
                    placeholder={dynamicLabels?.enterEmailSubject || "Enter Email Subject"}
                    mentions={mentions}
                    inputHTML={content?.emailSubject}
                    insertMentionsProgrammatically={true}
                    handleChange={handleSubjectChange}
                    active={active}
                    dynamicNote={dynamicNote}
                    skipHTMLTags={true}
                    toolbar={false}
                    tags={tags}
                    setHTMLOutput={setSubject}
                />
            </div>
            <NotifyRichTextEditor
                label="Body"
                placeholder={dynamicLabels?.enterEmailBody || "Enter Email Body"}
                mentions={mentions}
                inputHTML={content?.emailBody}
                insertMentionsProgrammatically={true}
                handleChange={handleBodyChange}
                active={active}
                dynamicNote={dynamicNote}
                skipHTMLTags={false}
                toolbar={true}
                tags={tags}
                setHTMLOutput={setBody}
            />
        </div>

    )
}


export default EmailConfiguration



