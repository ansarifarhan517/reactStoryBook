import React from 'react'
import {
  Row, Column, Panel, TextInput,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    mediacategoryName: '',
  },
}

interface IMediaCategoryCreateProps extends ICreate {
  errorMap: {
    mediacategoryName: string
  }
}
const Create: React.FC<IMediaCategoryCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <div>
    <PageHeader
      title="Media category"
      showBreadCrumb
      breadCrumbData={[{
        label: 'Media category',
        routeUrl: '/media-category',
      }, {
        label: 'Create',
      }]}
    />
    <Panel title="Category details">
      <Row>
        <Column col={4}>
          <TextInput
            type="text"
            label="Category name"
            name="mediacategoryName"
            invalid={!!errorMap.mediacategoryName}
            validationMessage={errorMap.mediacategoryName}
            changeHandler={onChangeHandler}
          />
        </Column>
      </Row>
    </Panel>
    <FormActionButton listRoute="/media-category" submitHandler={onSubmitHandler} />
  </div>
)

export {
  Create, options,
}
