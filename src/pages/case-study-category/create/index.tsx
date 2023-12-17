import React from 'react'
import {
  Row, Column, Panel, TextInput, Alert,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    caseStudycategoryName: '',
  },
}

interface ICaseStudyCategoryCreateProps extends ICreate {
  errorMap: {
    caseStudycategoryName: string
  }
}

const Create: React.FC<ICaseStudyCategoryCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler = () => {},
}) => (
  <div>
    <PageHeader
      title="Create category"
      showBreadCrumb
      breadCrumbData={[{
        label: 'Case study category',
        routeUrl: '/case-study-category',
      }, {
        label: 'Create',
      }]}
    />
    {Object.keys(errorMap).length > 0 && <Alert message="Please Fill all the Field" category="error" />}
    <Panel title="Category details">
      <Row>
        <Column col={4}>
          <TextInput
            type="text"
            label="Category name"
            name="caseStudycategoryName"
            invalid={!!errorMap.caseStudycategoryName}
            validationMessage={errorMap.caseStudycategoryName}
            changeHandler={onChangeHandler}
          />
        </Column>
      </Row>
    </Panel>
    <FormActionButton listRoute="/case-study-category" submitHandler={onSubmitHandler} />
  </div>
)

export { Create, options }
