import { emptyField, emailField } from '@/form-validation'

const schema = [
  emptyField('name'),
  emptyField('email'),
  emailField('email')
]

export { schema }
