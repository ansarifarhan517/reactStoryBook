import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('title'),
  emptyField('description'),
  emptyField('location'),
]

export { schema }
