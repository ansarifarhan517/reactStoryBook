
import React, { useEffect, useState } from 'react'
import { INotifyRichTextEditorProp, tGetNotifyTagsArray } from '../../CustomerListView.models'
import { EditorState, convertToRaw } from 'draft-js'
import { NotifyRichTextEditorStyled, StyledNote, BoxStyled } from '../../styled'
import { convertHTMLToDraftState, RichTextEditor, FontIcon, insertMention } from 'ui-library'
import AttachDynamicTags from '../../../../Order/SubComponent/AttachDynamicTags'
import CustomFieldsRichTextEditor from './CustomFieldsRichTextEditor'
import useDynamicLabels from '../../../../common/DynamicLabels/useDynamicLabels'
import DYNAMIC_LABELS_MAPPING from '../../../../common/DynamicLabels/dynamicLabels.mapping'
import draftToHtml from 'draftjs-to-html'

/** Mentions Text to Value map */
const mentionSuggesstionsValueMap: Record<string, string> = {}

// const stripParagraphTags = (str: string) => str.replaceAll('<p>', '').replaceAll('</p>', '').replaceAll('&nbsp;', '').replaceAll('<br>', '\n') 

const NotifyRichTextEditor = ({
    mentions,
    inputHTML,
    // handleChange,
    label,
    active,
    dynamicNote,
    // skipHTMLTags,
    showCharCount,
    toolbar,
    tags,
    setHTMLOutput,
    placeholder,
}: INotifyRichTextEditorProp) => {

    const dynamicLabels = useDynamicLabels(DYNAMIC_LABELS_MAPPING.contract)
    /** Initialize with empty state */
    const [editorState, setEditorState] = React.useState(
        EditorState.createEmpty()
    )
    const [charCount, setCharCount] = useState<number>(0)

    const mentionSuggesstionsProp = tags?.notificationKeys?.map(
        (mentionProp: tGetNotifyTagsArray) => {
          mentionSuggesstionsValueMap[mentionProp?.labelValue] = mentionProp?.key?.substring(
            1,
            mentionProp?.key?.length - 1
          );
          tags?.tagGroupMappingList?.map((group: any) => {
            if (mentionProp["tagGroupId"] == group?.value) {
              mentionProp["groupName"] = group?.label;
            }
          });
          return {
            text: mentionProp?.isCustomField ? (
              <CustomFieldsRichTextEditor mentionObj={mentionProp} />
            ) : (
              mentionProp?.labelValue
            ),
            value: mentionProp?.labelValue,
            url: mentionProp?.url,
          };
        }
      );
    

    /** Initializing the editor state from HTML */
    React.useEffect(() => {
        setEditorState(
            convertHTMLToDraftState(inputHTML || '', mentions)
        )
    }, [])


    // useEffect(() => {
    //     const output = HTMLOutput
    //     showCharCount && setCharCount(stripParagraphTags(output).length || 0)
    //     handleChange && skipHTMLTags ? handleChange(stripParagraphTags(output)) : handleChange && handleChange(output)


    // }, [editorState])

    // ---------------------------------------------------------------------------------------------
    useEffect(() => {
        setCharCount(editorState.getCurrentContent().getPlainText('\u0001').length)
      }, [editorState])
    //   --------------------------------------------------------------------------------------------

    const HTMLOutput = React.useMemo(
        () =>
            draftToHtml(
                convertToRaw(editorState.getCurrentContent()),
                undefined,
                false,
                (entity, _text) =>
                    mentionSuggesstionsValueMap[entity?.data?.value]
                    ? `<${mentionSuggesstionsValueMap[entity?.data?.value]}>`
                    : entity?.data?.value
            ),
        [editorState]
    )

    setHTMLOutput ? setHTMLOutput(HTMLOutput) : ""

    return (
        <NotifyRichTextEditorStyled>
            <AttachDynamicTags
                onSelect={(label: string, value: string = "") => {
                    setEditorState(
                    insertMention(
                        editorState,
                        { text: label, value: value },
                        false
                    )
                    );
                }}
                show={
                    mentionSuggesstionsProp?.length > 0 && active
                    ? undefined
                    : false
                }
                tags={tags}
                active={active}
            >
                <RichTextEditor
                    label={label}
                    id='NotifyRichTextEditor'
                    className='NotifyRichTextEditor'
                    editorState={editorState}
                    mention={{
                        separator: ' ',
                        trigger: '@',
                        suggestions: mentionSuggesstionsProp
                    }}
                    onEditorStateChange={(state) => setEditorState(state)}
                    placeholder={placeholder ? placeholder : dynamicLabels?.enterEmailBody || 'Enter Email Body'}
                    toolbarHidden={!toolbar}
                    readOnly={!active}
                />
            </AttachDynamicTags>
            <BoxStyled >
                <StyledNote>{active ? dynamicNote : ''} </StyledNote>
                {showCharCount &&
                    <StyledNote>
                        <FontIcon
                            variant='chat'
                            color='grey.A300'
                            size='xs'
                        /> SMS Count: {Math.ceil(charCount / 160)}({charCount}) Characters
                    </StyledNote>
                }
            </BoxStyled>
        </NotifyRichTextEditorStyled>
    )
}

export default NotifyRichTextEditor