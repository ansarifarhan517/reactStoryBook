import React from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  DropDown,
  Text,
  FileUpload,
  RichTextEditor,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import './style.scss'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    title: '',
    publisheddate: '',
    category: 'industry',
    displayImagePath: '',
    displayFileUpload: '',
    displayImageAlt: '',
    ogImagePath: '',
    ogFileUpload: '',
    ogImageAlt: '',
  },
}

interface IMediaCreateProps extends ICreate {
  errorMap: {
    title: string
    publisheddate: string
    category: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
  }
  formData: {
    title: string
    publisheddate: string
    category: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
  }
}
const Create: React.FC<IMediaCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
  formData,
}) => {
  const DropDownValues = [{
    label: 'About Company',
    value: 'aboutcompany',
  },
  {
    label: 'Founders Bio',
    value: 'foundersbio',
  },
  ]

  return (
    <div>
      <PageHeader
        title="Add Media"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Add media',
          routeUrl: '/media',
        }, {
          label: 'Create',
        }]}
      />
      <Panel>
        <Row>
          <Column col={4}>
            <TextInput
              type="text"
              label="Title"
              name="title"
              invalid={!!errorMap.title}
              validationMessage={errorMap.title}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={4}>
            <DropDown options={DropDownValues} name="category" label="Category"
              changeHandler={onChangeHandler} value={formData.category} />
          </Column>
          <Column col={4}>
            <TextInput
              type="date"
              label="Published Date"
              name="publisheddate"
              invalid={!!errorMap.publisheddate}
              validationMessage={errorMap.publisheddate}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={12}>
            <Text tag="label" color="gray-darker" align="left"
              className={bemClass(['event-form', 'description'])}>Description</Text>
            <RichTextEditor />
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
              className={bemClass(['case-study-form', 'or'])}>
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
              transform="uppercase" className={bemClass(['case-study-form', 'or'])}>
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
      </Panel>
      <FormActionButton listRoute="/case-study-sub-category" submitHandler={onSubmitHandler} />
    </div>
  )
}

export {
  Create, options,
}
