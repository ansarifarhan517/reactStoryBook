import { EditorState, Modifier, ContentState, convertFromRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { IMentionSuggestion } from './interfaces'

export const insertMention = (
  editorStateParam: EditorState,
  mentionSuggestion: IMentionSuggestion,
  atEnd?: boolean
) => {
  const editorState = atEnd
    ? EditorState.moveFocusToEnd(editorStateParam)
    : editorStateParam
  const currentContent = editorStateParam.getCurrentContent()
  const currentSelection = editorState.getSelection()

  const { text, value, url } = mentionSuggestion
  const stateWithEntity = currentContent.createEntity('MENTION', 'IMMUTABLE', {
    text,
    value,
    url
  })
  const entityKey = stateWithEntity.getLastCreatedEntityKey()
  const stateWithText = Modifier.insertText(
    stateWithEntity,
    currentSelection,
    '@' + text,
    editorState.getCurrentInlineStyle(),
    entityKey
  )
  return EditorState.push(editorState, stateWithText, 'apply-entity')
}

export const convertHTMLToDraftState = (
  html: string,
  mentionSuggestions?: IMentionSuggestion[]
) => {
  let newHtml: string = html
  if (mentionSuggestions?.length) {
    mentionSuggestions.forEach((suggestion) => {
      newHtml = newHtml.replace(
        `<${suggestion.value}>`,
        `<a href="${suggestion.url}" class="wysiwyg-mention" data-mention data-value="${suggestion.text}">@${suggestion.text}</a>`
      )
    })
  }
  const blocksFromHtml = htmlToDraft(newHtml)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap
  )
  return EditorState.createWithContent(contentState)
}

export const generateEditorStateFromJSONString = (jsonString: string) => {
  const json = jsonString ? JSON.parse(jsonString) : {}
  return EditorState.createWithContent(
    convertFromRaw({ ...json, entityMap: { ...(json?.entityMap || {}) } })
  )
}
