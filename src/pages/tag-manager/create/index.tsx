import React from 'react'

import {
  Row, Column, Panel, TextInput, Alert,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import schema from '../validation-schema'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    tagName: '',
  },
}

interface ITagManagerCreateProps extends ICreate {
  errorMap: {
    tagName: string
  }
}

const Create: React.FC<ITagManagerCreateProps> = ({
  errorMap,
  onSubmitHandler,
  onChangeHandler,

}) => (
  <div>
    <PageHeader
      title="Tag Manager"
      showBreadCrumb
      breadCrumbData={[
        {
          label: 'Tag Manager',
          routeUrl: '/tag-manager',
        },
        {
          label: 'Create',
        },
      ]}
    />
    {Object.keys(errorMap).length > 0 && <Alert message="Please Fill all the Field" category="error" />}
    <Panel title="Tag details">
      <Row>
        <Column col={4}>
          <TextInput
            type="text"
            label="Tag name"
            invalid={!!errorMap?.tagName}
            name="tagName" changeHandler={onChangeHandler} />
        </Column>
      </Row>
    </Panel>
    <FormActionButton listRoute="/tag-manager" submitHandler={onSubmitHandler} />
  </div>
)

export {
  Create, options,
}
