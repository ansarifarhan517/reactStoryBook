import React from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
} from '@base'
import {
  PageHeader,
  FormActionButton,
} from '@components'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const blk = 'job-category'
const options = {
  schema,
  formModel: {
    jobCategoryName: '',
  },
}

interface IJobCategoryCreateProps extends ICreate {
  errorMap: {
    jobCategoryName: string
  }
}

const Create: React.FC<IJobCategoryCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <div>
    <PageHeader
      title="Create category"
      showBreadCrumb
      breadCrumbData={[{
        label: 'Job category',
        routeUrl: '/job-category',
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
            name="jobCategoryName"
            invalid={!!errorMap.jobCategoryName}
            validationMessage={errorMap.jobCategoryName}
            changeHandler={onChangeHandler}
            className={bemClass([blk, ''])}
          />
        </Column>
      </Row>
    </Panel>
    <FormActionButton listRoute="/case-study-category" submitHandler={onSubmitHandler} />
  </div>
)

export {
  Create, options,
}
