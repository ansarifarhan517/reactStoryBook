import { emptyField, emailField } from '@/form-validation'

const schema = [
  emptyField('firstName'),
  emptyField('lastName'),
  emptyField('email'),
  emailField('email'),
  emptyField('mobileNumber'),
  emptyField('companyName'),
  emptyField('industry'),
  emptyField('employeeCount'),
  emptyField('designation'),
]

export { schema }
