import React from 'react'
import {
  PageHeader,
  FormActionButton,
} from '@components'
import {
  Panel,
  Row,
  Column,
  TextInput,
  DropDown,
} from '@base'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const blk = 'job-role'

const options = {
  schema,
  formModel: {
    title: '',
    description: '',
    location: 'mumbai',
  },
}

const dropDownData = [
  { label: 'Mumbai', value: 'mumbai' },
  { label: 'Pune', value: 'pune' },
  { label: 'Delhi', value: 'delhi' },

]

interface IJobRoleCreateProps extends ICreate {
  errorMap: {
    title: string
    description: string
    location: string
  }
  formData: {
    title: string
    description: string
    location: string
  }
}

const Create: React.FC<IJobRoleCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
  formData,
}) => (
  <>
    <PageHeader
      title="Create Job Role"
      showBreadCrumb
      breadCrumbData={[
        { label: 'Job Role', routeUrl: '/job-role' },
        {
          label: 'create',
        }]}
    />
    <>
      <Panel>
        <form>
          <Row>
            <Column col={6}>
              <TextInput
                type="text"
                label="Title"
                name="title"
                isRequired
                invalid={!!errorMap.title}
                validationMessage={errorMap.title}
                changeHandler={onChangeHandler}
                className={bemClass([blk, ''])}
              />
            </Column>
            <Column col={6}>
              <DropDown
                label="Location"
                options={dropDownData}
                name="location"
                value={formData.location}
                className={bemClass([blk, ''])}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Description"
                name="description"
                isTextArea
                isRequired
                invalid={!!errorMap.description}
                validationMessage={errorMap.description}
                changeHandler={onChangeHandler}
                className={bemClass([blk, ''])}
              />
            </Column>
          </Row>
        </form>
      </Panel>
      <FormActionButton submitHandler={onSubmitHandler} />
    </>
  </>
)

export {
  Create, options,
}
