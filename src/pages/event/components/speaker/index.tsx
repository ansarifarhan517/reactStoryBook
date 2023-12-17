import React from 'react'
import update from 'immutability-helper'

import {
  FileUpload,
  Column,
  Row,
  TextInput,
  Text,
} from '@base'
import { bemClass } from '@utils'
import { ICreate } from '@utils/common.models'
import './style.scss'

interface ISpeakerProps extends ICreate {
  index?: number
  errorMap: {
    eventName: string
    startDate: string
    endDate: string
    location: string
    eventTitle: string
    tags: string
    hbFormId: string
    speakers: Array<{
      name: string
      designation: string
      imagePath: string
      imageAlt: string
    }>
  }
  data?: {
    name: string
    designation: string
    imagePath: string
    imageAlt: string
  }
  formData: {
    eventName: string
    startDate: string
    endDate: string
    location: string
    eventTitle: string
    tags: string
    hbFormId: string
    speakers: Array<{
      name: string
      designation: string
      imagePath: string
      imageAlt: string
    }>
  }

}

const Speaker: React.FC<ISpeakerProps> = ({
  index = 0,
  errorMap = {},
  onChangeHandler,
  data,
  formData,
}) => {
  const changeHandler = (valueObj: object) => {
    const updatedObject = update(formData, {
      speakers: {
        [index]: {
          $merge: valueObj,
        },
      },
    })
    onChangeHandler(updatedObject)
  }

  return (
    <Row className={bemClass(['events-form', 'speaker-section'])}>
      <Column col={6}>
        <TextInput
          type="text"
          label="Name"
          name="name"
          isRequired
          invalid={!!errorMap[`speakers[${index}].name` as keyof typeof errorMap]}
          validationMessage={errorMap[`speakers[${index}].name` as keyof typeof errorMap]}
          changeHandler={changeHandler}
          value={data?.name}
        />
      </Column>
      <Column col={6}>
        <TextInput
          type="text"
          label="Designation"
          name="designation"
          isRequired
          invalid={!!errorMap[`speakers[${index}].designation` as keyof typeof errorMap]}
          validationMessage={errorMap[`speakers[${index}].designation` as keyof typeof errorMap]}
          changeHandler={changeHandler}
          value={data?.designation}
        />
      </Column>
      <Column col={6}>
        <TextInput
          type="text"
          label="Image Path"
          name="imagePath"
          isRequired
          invalid={!!errorMap[`speakers[${index}].imagePath` as keyof typeof errorMap]}
          validationMessage={errorMap[`speakers[${index}].imagePath` as keyof typeof errorMap]}
          changeHandler={changeHandler}
          value={data?.imagePath}

        />
        <Text tag="div" color="gray-darker" align="center"
          className={bemClass(['events-form', 'or'])}>
          OR
        </Text>
        <FileUpload
          isRequired={false}
          name="speakerFileUpload"
          onChangeHandler={changeHandler}
          multiple={false}
        />
      </Column>
    </Row>
  )
}

export default Speaker
