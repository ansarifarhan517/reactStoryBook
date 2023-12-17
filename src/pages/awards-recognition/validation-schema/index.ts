import { emptyField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('date'),
  emptyField('image'),
  emptyField('description'),
  emptyField('redirectUrl'),
  emptyField('imagePath'),
  emptyField('imageAlt'),
  emptyField('ogImagePath'),
  emptyField('ogImageAlt'),

]

export { schema }
