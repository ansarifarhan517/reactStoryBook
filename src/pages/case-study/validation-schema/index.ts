import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('title'),
  emptyField('pageUrl'),
  emptyField('description'),
  emptyField('hbFormId'),
  emptyField('displayImagePath'),
  emptyField('displayImageAlt'),
  emptyField('ogImagePath'),
  emptyField('ogImageAlt'),
  emptyField('pdfLink'),
  emptyField('metaTitle'),
  emptyField('metaDescription'),

]

export { schema }
