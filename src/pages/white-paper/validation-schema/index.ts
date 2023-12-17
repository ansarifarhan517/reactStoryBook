import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('title'),
  emptyField('landingPagePath'),
  emptyField('description'),
  emptyField('hbFormSnippet'),
  emptyField('displayImagePath'),
  emptyField('displayImageAlt'),
  emptyField('ogImagePath'),
  emptyField('ogImageAlt'),
  emptyField('pdfLink'),

]

export { schema }
