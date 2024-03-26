import { tMMODynamicFieldName } from './PrintAwb.models'

export const baseTemplate = `
  <!DOCTYPE html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.3/dist/JsBarcode.all.min.js"></script>
    </head>

    <body>
      :dynamic-content
      <script>JsBarcode('.barcode').init()</script>
    </body>
  </html>
`

/** Dynamic Field Tags */
export const htmlDynamicSymbolStart = '#@--'
export const htmlDynamicSymbolEnd = '--@#'
export const createHTMLDynamicFieldTag = (fieldName: string) => `${htmlDynamicSymbolStart}${fieldName}${htmlDynamicSymbolEnd}`

export const extractFieldsFromHTML = (htmlTemplate: string): Set<tMMODynamicFieldName> => {
  let fieldSet = new Set(htmlTemplate
    ?.split(htmlDynamicSymbolStart)
    .map(field => field.substring(0, field.indexOf(htmlDynamicSymbolEnd)))) 

  fieldSet.delete('')
  
  return fieldSet as Set<tMMODynamicFieldName>
}

export const replaceFieldWithData = (content: string, fieldName: string, data: string) => {
  return fieldName.startsWith('cf_') ? content.replace(createHTMLDynamicFieldTag(fieldName), data) : content.replace(new RegExp(createHTMLDynamicFieldTag(fieldName), 'g'), data)
}

/** Dynamic Field Labels */
export const htmlDynamicLabelStart = '@dynamicLabel('
export const htmlDynamicLabelEnd = ')'

export const createHTMLDynamicLabel = (fieldName: string) => `${htmlDynamicLabelStart}${fieldName}${htmlDynamicLabelEnd}`

export const extractDynamicLabelsFromHTML = (htmlTemplate: string): Set<string> => {
  let fieldSet = new Set(htmlTemplate
    .split(htmlDynamicLabelStart)
    .map(field => field.substring(0, field.indexOf(htmlDynamicLabelEnd))).slice(1)) 

  // if (fieldSet.size === 1) {
  //   return new Set<string>()
  // }
  
  fieldSet.delete('')
  return fieldSet as Set<string>
}


export const replaceDynamicLabelWithLabel = (content: string, fieldName: string, data: string) => {
  // return content.replace(new RegExp(createHTMLDynamicLabel(fieldName), 'g'), data)
  return content.replaceAll(createHTMLDynamicLabel(fieldName), data)
}