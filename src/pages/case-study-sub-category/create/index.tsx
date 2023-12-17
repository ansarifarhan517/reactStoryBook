import React from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  DropDown,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    subCategoryName: '',
    category: 'industry',
  },
}

interface ICaseStudySubCategoryCreate extends ICreate {
  errorMap: {
    subCategoryName: string
  }
  formData: {
    subCategoryName: string
    category: string
  }
}

const Create: React.FC<ICaseStudySubCategoryCreate> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
  formData,
}) => {
  const DropDownValues = [{
    label: 'Industry',
    value: 'industry',
  },
  {
    label: 'Solution',
    value: 'solution',
  },
  {
    label: 'Feature',
    value: 'feature',
  }]

  return (
    <div>
      <PageHeader
        title="Create case ctudy sub category"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Case study sub category',
          routeUrl: '/case-study-sub-category',
        }, {
          label: 'Create',
        }]}
      />
      <Panel>
        <Row>
          <Column col={4}>
            <DropDown
              options={DropDownValues}
              name="category"
              label="Category"
              changeHandler={onChangeHandler}
              value={formData.category} />
          </Column>
          <Column col={4}>
            <TextInput
              type="text"
              label="Sub Category"
              name="subCategoryName"
              invalid={!!errorMap.subCategoryName}
              validationMessage={errorMap.subCategoryName}
              changeHandler={onChangeHandler}
            />
          </Column>
        </Row>
      </Panel>
      <FormActionButton listRoute="/case-study-sub-category" submitHandler={onSubmitHandler} />
    </div>
  )
}

export { Create, options }
