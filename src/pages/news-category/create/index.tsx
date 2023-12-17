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
    newscategoryName: '',
  },
}

interface INewsCategoryCreateProps extends ICreate {
  errorMap: {
    newscategoryName: string

  }
}

const Create: React.FC<INewsCategoryCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <div>
    <PageHeader
      title="News category"
      showBreadCrumb
      breadCrumbData={[{
        label: 'News category',
        routeUrl: '/news-category',
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
            name="newscategoryName"
            invalid={!!errorMap.newscategoryName}
            validationMessage={errorMap.newscategoryName}
            changeHandler={onChangeHandler}
          />
        </Column>
      </Row>
    </Panel>
    <FormActionButton listRoute="/news-category" submitHandler={onSubmitHandler} />
  </div>
)

export {
  Create, options,
}
