import { validationFunctionResult } from '@utils/common.models'
import {
  REGEX_CONTACT,
  REGEX_EMAIL,
  REGEX_EMPTY,
  REGEX_NUMBER,
  REGEX_PIN_CODE,
} from './constant'

const emptyField = (path: string): validationFunctionResult => ({
  path,
  pattern: REGEX_EMPTY,
  message: 'Required.',
  emptyCheck: true,
})

const contactField = (path: string): validationFunctionResult => ({
  path,
  pattern: REGEX_CONTACT,
  message: 'Phone No must be 10 digits',
  emptyCheck: true,
})

const emailField = (path: string): validationFunctionResult => ({
  path,
  pattern: REGEX_EMAIL,
  message: 'Invalid Emai',
  emptyCheck: true,
})

const numberField = (path: string): validationFunctionResult => ({
  path,
  pattern: REGEX_NUMBER,
  message: 'Invalid Number ',
  emptyCheck: true,
})

const pincodeField = (path: string): validationFunctionResult => ({
  path,
  pattern: REGEX_PIN_CODE,
  message: 'Invalid Pin Code ',
  emptyCheck: true,
})

export {
  emptyField,
  contactField,
  emailField,
  numberField,
  pincodeField,
}
