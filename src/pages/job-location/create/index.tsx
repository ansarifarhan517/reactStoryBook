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
} from '@base'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'

const blk = 'job-location'
const options = {
  schema,
  formModel: {
    location: '',
  },
}

interface IJobCategoryCreateProps extends ICreate {
  errorMap: {
    location: string
  }
}

const Create: React.FC<IJobCategoryCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <>
    <PageHeader
      title="Create Job Location"
      showBreadCrumb
      breadCrumbData={[
        { label: 'Job location', routeUrl: '/job-location' },
        {
          label: 'create',
        }]}
    />
    <Panel>
      <form>
        <Row>
          <Column col={6}>
            <TextInput
              type="text"
              label="Location"
              name="location"
              isRequired
              invalid={!!errorMap.location}
              validationMessage={errorMap.location}
              changeHandler={onChangeHandler}
              className={bemClass([blk, ''])}
            />
          </Column>
        </Row>
      </form>
    </Panel>
    <FormActionButton submitHandler={onSubmitHandler} />

  </>
)

export {
  Create, options,
}
