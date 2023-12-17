import React from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  FileUpload,
  Text,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import { ICreate } from '@utils/common.models'
import './style.scss'

const options = {
  schema,
  formModel: {
    title: '',
    displayImagePath: '',
    displayFileUpload: '',
    displayImageAlt: '',
    ogImagePath: '',
    ogFileUpload: '',
    ogImageAlt: '',
    pdfLink: '',
  },
}
interface IInfographicCreateProps extends ICreate {
  errorMap: {
    title: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
    pdfLink: string
    category: string
  }
}
const Create: React.FC<IInfographicCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <div>
    <PageHeader
      title="Add InfoGraphic"
      showBreadCrumb
      breadCrumbData={[{
        label: 'Add infoGraphic',
        routeUrl: '/add-infoGraphic',
      }, {
        label: 'Create',
      }]}
    />
    <form>
      <Panel title="Basic Details">
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
            />
          </Column>
          <Column col={6}>
            <TextInput
              type="text"
              label="PDF Link"
              name="pdfLink"
              isRequired
              invalid={!!errorMap.pdfLink}
              validationMessage={errorMap.pdfLink}
              changeHandler={onChangeHandler}
            />
          </Column>
        </Row>
      </Panel>
      <Panel>
        <Row>
          <Column col={6}>
            <label>Display Image</label>
            <hr />
            <TextInput
              type="text"
              label="Image Path"
              name="displayImagePath"
              isRequired
              invalid={!!errorMap.displayImagePath}
              validationMessage={errorMap.displayImagePath}
              changeHandler={onChangeHandler}
            />
            <Text tag="div" color="gray-darker" align="center"
              className={bemClass(['infographic-form', 'or'])}>
              OR
            </Text>
            <FileUpload
              isRequired={false}
              name="displayFileUpload"
              onChangeHandler={onChangeHandler}
              multiple={false}
            />
            <TextInput
              type="text"
              label="Image Alt"
              name="displayImageAlt"
              isRequired
              invalid={!!errorMap.displayImageAlt}
              validationMessage={errorMap.displayImageAlt}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={6}>
            <label>OG Image</label>
            <hr />
            <TextInput
              type="text"
              label="Image Path"
              name="ogImagePath"
              isRequired
              invalid={!!errorMap.ogImagePath}
              validationMessage={errorMap.ogImagePath}
              changeHandler={onChangeHandler}
            />
            <Text tag="div" color="gray-darker" align="center"
              transform="uppercase" className={bemClass(['infographic-form', 'or'])}>
              or
            </Text>
            <FileUpload
              isRequired={false}
              name="ogFileUpload"
              onChangeHandler={onChangeHandler}
            />
            <TextInput
              type="text"
              label="Image Alt"
              name="ogImageAlt"
              isRequired
              invalid={!!errorMap.ogImageAlt}
              validationMessage={errorMap.ogImageAlt}
              changeHandler={onChangeHandler}
            />
          </Column>
        </Row>
        <FormActionButton submitHandler={onSubmitHandler} />
      </Panel>
    </form>
  </div>
)

export {
  Create, options,
}
