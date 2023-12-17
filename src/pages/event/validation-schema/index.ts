import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('eventName'),
  emptyField('startDate'),
  emptyField('endDate'),
  emptyField('location'),
  emptyField('eventTitle'),
  emptyField('hbFormId'),
  emptyField('speakers[0].name'),
  emptyField('speakers[0].designation'),
  emptyField('speakers[0].image'),
  emptyField('speakers[0].imagePath'),
]
export { schema }
