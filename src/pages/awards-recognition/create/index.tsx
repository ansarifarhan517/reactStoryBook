import React, { useState } from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  FileUpload,
  DropDown,
  Text,
  MultiSelectDropdown,
} from '@base'
import { PageHeader, FormActionButton } from '@components'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import './style.scss'
import { ICreate, IMultiDropdownOptions } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    date: '',
    image: '',
    description: '',
    redirectUrl: '',
    tags: '',
    awardTags: [],
  },
}

interface ICreateAwardsRecognitionProps extends ICreate {
  errorMap: {
    date: string
    image: string
    imagePath: string
    imageAlt: string
    ogImagePath: string
    ogImageAlt: string
    description: string
    redirectUrl: string
    tags: string
  }
}

const Create: React.FC<ICreateAwardsRecognitionProps> = ({
  onChangeHandler = () => {},
  onSubmitHandler = (e) => { e.preventDefault() },
  errorMap,
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

  const [multiDropDown, setMultiDropDown] = useState<IMultiDropdownOptions[]>([
    { label: 'Residential', value: 'residential' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Industrial', value: 'industrial' },
    { label: 'Govermental', value: 'govermental' },
    { label: 'Hospitals', value: 'hospitals' },
  ])

  return (
    <div>
      <PageHeader
        title="Create Awards"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Awards and Recognition',
          routeUrl: '/award-recognition',
        }, {
          label: 'Create',
        }]}
      />
      <form>
        <Panel title="Seo Details">
          <Row>
            <Column col={6}>
              <MultiSelectDropdown
                options={multiDropDown}
                title="Tags"
                name="awardTags"
                onChangeHandler={onChangeHandler}
                setOptions={setMultiDropDown}
                isRequired

              />
            </Column>
          </Row>
        </Panel>
        <Panel title="Awards Details">
          <Row>
            <Column col={6}>
              <TextInput
                type="date"
                label="Date"
                name="date"
                invalid={!!errorMap.date}
                validationMessage={errorMap.date}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Description"
                name="description"
                invalid={!!errorMap.description}
                validationMessage={errorMap.description}
                changeHandler={onChangeHandler}

              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Redirect Url"
                name="redirectUrl"
                invalid={!!errorMap.redirectUrl}
                validationMessage={errorMap.redirectUrl}
                changeHandler={onChangeHandler}

              />
            </Column>
            <Column col={6}>
              <DropDown
                options={DropDownValues}
                name="tags"
                label="Tags"
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <Text
                tag="label"
                color="gray-darker"
                align="left"
              >
                Award Image
              </Text>
              <hr />
              <TextInput
                type="text"
                label="Image Path"
                name="imagePath"
                isRequired
                invalid={!!errorMap.imagePath}
                validationMessage={errorMap.imagePath}
                changeHandler={onChangeHandler}
              />
              <Text tag="div" color="gray-darker" align="center"
                className={bemClass(['award-form', 'or'])}>
                OR
              </Text>
              <FileUpload
                isRequired={false}
                name="image"
                multiple={false}
                onChangeHandler={onChangeHandler}
              />
              <TextInput
                type="text"
                label="Image Alt"
                name="imageAlt"
                isRequired
                invalid={!!errorMap.imageAlt}
                validationMessage={errorMap.imageAlt}
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
              <Text
                tag="div"
                color="gray-darker"
                align="center"
                transform="uppercase"
                className={bemClass(['award-form', 'or'])}
              >
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
        <FormActionButton submitHandler={onSubmitHandler} />
      </form>

    </div>
  )
}

export {
  Create, options,
}
