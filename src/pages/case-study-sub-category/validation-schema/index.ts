import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('subCategoryName'),
  emptyField('metaTitle'),
  emptyField('metaDescription'),
  emptyField('pageUrl'),
]

export { schema }
