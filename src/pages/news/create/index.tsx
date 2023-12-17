import React from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  DropDown,
  Text,
  FileUpload,
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
    publisheddate: '',
    shortdesc: '',
    longdesc: '',
    sourcelink: '',
    source: '',
    category: 'productugrade',
    displayImagePath: '',
    displayFileUpload: '',
    displayImageAlt: '',
    ogImagePath: '',
    ogFileUpload: '',
    ogImageAlt: '',
  },
}

interface INewsCreateProps extends ICreate {
  errorMap: {
    title: string
    publisheddate: string
    longdesc: string
    shortdesc: string
    sourcelink: string
    source: string
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
    longdesc: string
    shortdesc: string
    sourcelink: string
    source: string
    category: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
  }
}

const Create: React.FC<INewsCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
  formData,
}) => {
  const DropDownValues = [{
    label: 'Product Upgrade',
    value: 'productugrade',
  },
  {
    label: 'Patnerships and Client Aquisition',
    value: 'patnershipsandclientaquisition',
  },
  {
    label: 'Growth Story',
    value: 'growthstory',
  },
  {
    label: 'Thought Leadership',
    value: 'thoughtleadership',
  },
  ]

  return (
    <div>
      <PageHeader
        title="Add News"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Add News',
          routeUrl: '/news',
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
          <Column col={6}>
            <TextInput
              type="text"
              label="Short Description"
              name="shortdesc"
              isTextArea
              invalid={!!errorMap.shortdesc}
              validationMessage={errorMap.shortdesc}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={6}>
            <TextInput
              type="text"
              label="Long Description"
              name="longdesc"
              isTextArea
              invalid={!!errorMap.longdesc}
              validationMessage={errorMap.longdesc}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={6}>
            <TextInput
              type="text"
              label="Source"
              name="source"
              invalid={!!errorMap.source}
              validationMessage={errorMap.source}
              changeHandler={onChangeHandler}
            />
          </Column>
          <Column col={6}>
            <TextInput
              type="text"
              label="Link"
              name="sourcelink"
              invalid={!!errorMap.sourcelink}
              validationMessage={errorMap.sourcelink}
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
