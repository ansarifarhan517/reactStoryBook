import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('title'),
  emptyField('publisheddate'),
  emptyField('displayImagePath'),
  emptyField('displayImageAlt'),
  emptyField('ogImagePath'),
  emptyField('ogImageAlt'),
]

export { schema }
