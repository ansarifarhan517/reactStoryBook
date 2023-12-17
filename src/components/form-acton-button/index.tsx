import React from 'react'
import { Button } from '@base'

import './style.scss'

type IFormActionButtonProps = {
  listRoute?: string
  submitHandler: (e: React.FormEvent) => void
}

const FormActionButton: React.FC<IFormActionButtonProps> = ({ listRoute, submitHandler }) => (
  <div className="form-action-button">
    <Button asLink href={listRoute} category="secondary">Cancel</Button>
    &nbsp;&nbsp;
    <Button clickHandler={submitHandler} type="submit">Submit</Button>
  </div>
)

export default FormActionButton
