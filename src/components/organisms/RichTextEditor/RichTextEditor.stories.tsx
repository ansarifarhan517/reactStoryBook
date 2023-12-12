import React from 'react'

import { path } from '..'
import RichTextEditor from '.'
import ThemeWrapper from '../../../utilities/components/ThemeWrapper'
import { EditorState, convertToRaw } from 'draft-js'
import { insertMention, convertHTMLToDraftState } from './apis'
import draftToHtml from 'draftjs-to-html'
import Box from '../../atoms/Box'
import Button from '../../atoms/Button'
import { boolean } from '@storybook/addon-knobs'

interface IMainComponentProps {
  showHTMLOutput?: boolean
  showJSONOutput?: boolean
  insertMentionsProgrammatically?: boolean
  initializeFromHTML?: boolean
}

export default {
  title: `${path}/RichTextEditor`,
  component: RichTextEditor
}

/** Mentions structure from API */
const mentionSuggestionsFromAPI = [
  { text: 'Delivery Associate Name', value: 'dmmName', url: '#' },
  { text: 'Alert Date', value: 'time', url: '#' },
  { text: 'Account Name', value: 'accountname', url: '#' },
  { text: 'Account Code', value: 'accountCode', url: '#' },
  { text: 'Collected Value', value: 'collectedValue', url: '#' },
  { text: 'Package Value', value: 'actualvalue', url: '#' },
  { text: 'Currency', value: 'currency', url: '#' },
  { text: 'AWB Number', value: 'awbnumber', url: '#' }
]

/** Mentions Text to Value map */
const mentionSuggesstionsValueMap: Record<string, string> = {}

/** Text & Value should have same content when sent to React-Draft */
const mentionSuggesstionsProp = mentionSuggestionsFromAPI.map((m) => {
  mentionSuggesstionsValueMap[m.text] = m.value
  return { text: m.text, value: m.text, url: m.url }
})

const inputHTML =
  '<p style="text-align:left;"><span style="color: rgb(0,0,0);font-size: 16px;font-family: Verdana;">Dear recipient,</span></p> <p><span style="color: rgb(0,0,0);font-size: 16px;font-family: Verdana;">Order </span><awbnumber><span style="color: rgb(0,0,0);font-size: 16px;font-family: Verdana;"> is arriving, should reach your destination at </span><time><span style="color: rgb(0,0,0);font-size: 16px;font-family: Verdana;">. </span></p>'

const MainCompoonent = ({
  initializeFromHTML,
  showHTMLOutput,
  showJSONOutput,
  insertMentionsProgrammatically
}: IMainComponentProps) => {
  /** Initialize with empty state */
  const [editorState, setEditorState] = React.useState(
    EditorState.createEmpty()
  )

  const JSONOutput = React.useMemo(
    () => JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    [editorState]
  )

  const HTMLOutput = React.useMemo(
    () =>
      draftToHtml(
        convertToRaw(editorState.getCurrentContent()),
        undefined,
        false,
        (entity, _text) =>
          `<${mentionSuggesstionsValueMap[entity?.data?.value]}>`
      ),
    [editorState]
  )

  /** Programmatically insert Mentions - Either at last cursor or at End */
  const handleClick = () => {
    setEditorState(insertMention(editorState, mentionSuggesstionsProp[0], true))
  }

  /** Initializing the editor state from HTML */
  React.useEffect(() => {
    initializeFromHTML &&
      setEditorState(
        convertHTMLToDraftState(inputHTML || '', mentionSuggestionsFromAPI)
      )
  }, [])

  return (
    <>
      {insertMentionsProgrammatically && (
        <Button onClick={handleClick}>Insert Mention</Button>
      )}
      <br />
      <br />
      <RichTextEditor
        label='Email Body'
        id='emailBody'
        className='emailBody'
        isStripPastedStyles={true}
        // defaultEditorState={EditorState.createEmpty()}
        editorState={editorState}
        mention={{
          separator: ' ',
          trigger: '@',
          suggestions: mentionSuggesstionsProp
        }}
        onEditorStateChange={setEditorState}
        placeholder='Enter Email Body'
        hideToolbar={boolean('hideToolbar', false)}
      />
      {/* {editorState.getCurrentContent().getPlainText().length} */}
      {showJSONOutput && (
        <>
          <br />
          <br />
          <Box style={{ backgroundColor: 'lightgrey' }} p='10px'>
            <code>{JSONOutput}</code>
          </Box>
        </>
      )}
      {showHTMLOutput && (
        <>
          <br />
          <br />
          <Box style={{ backgroundColor: 'lightgrey' }} p='10px'>
            <code>{HTMLOutput}</code>
          </Box>
        </>
      )}
    </>
  )
}

export const Default = () => {
  return (
    <ThemeWrapper>
      <MainCompoonent
        showHTMLOutput={boolean('showHTMLOutput', false)}
        showJSONOutput={boolean('showJSONOutput', false)}
        insertMentionsProgrammatically={boolean(
          'insertMentionsProgrammatically',
          false
        )}
        initializeFromHTML={boolean('initializeFromHTML', false)}
      />
    </ThemeWrapper>
  )
}
