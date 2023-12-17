import React from 'react'
import {
  Panel,
  Row, Column,
  TextInput,
  RichTextEditor,
  DropDown,
  Text,
} from '@base'
import {
  PageHeader,
  FormActionButton,
  AddDeleteRow,
} from '@components'
import { bemClass } from '@utils'
import { emptyField } from '@config/validation'
import { schema } from '../validation-schema'
import Speaker from '../components/speaker'
import { ICreate } from '@utils/common.models'

const options = {
  schema,
  formModel: {
    eventName: '',
    startDate: '',
    endDate: '',
    location: '',
    eventTitle: '',
    hbFormId: '',
    tags: 'tags',
    speakers: [{
      name: '',
      image: '',
      designation: '',
      imagePath: '',
    }],
  },
}

type ISpeaker = {
  name: string
  imageAlt: string
  designation: string
  imagePath: string
}

type IFormData = {
  eventName: string
  startDate: string
  endDate: string
  location: string
  eventTitle: string
  tags: string
  hbFormId: string
  speakers: ISpeaker []
}

interface IEventCreateProps extends ICreate {
  errorMap: {
    eventName: string
    startDate: string
    endDate: string
    location: string
    eventTitle: string
    tags: string
    hbFormId: string
    speakers: ISpeaker[]
  }
  formData: IFormData
}

const Create: React.FC<IEventCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
  formData,
  setFormData,
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

  const submitHandler = (e: React.FormEvent) => {
    formData.speakers.forEach((fields, index) => {
      if (index > 0) {
        options.schema.push(
          emptyField(`speakers[${index}].name`),
          emptyField(`speakers[${index}].designation`),
          emptyField(`speakers[${index}].image`),
          emptyField(`speakers[${index}].imagePath`),
        )
      }
    })
    onSubmitHandler(e)
  }

  const addHandler = () => {
    setFormData?.((prevState: IFormData) => ({
      ...prevState,
      speakers: [...prevState.speakers, {
        name: '',
        image: '',
        designation: '',
        imagePath: '',
      }],
    }))
  }

  const deleteHandler = (index: number) => {
    if (formData.speakers.length !== 1) {
      const speakers = [...formData.speakers]
      const updatedSpeakers = speakers.filter((__, ind) => +index !== ind)
      setFormData?.((prevState) => ({
        ...prevState,
        speakers: updatedSpeakers,
      }))
    }
  }
  return (
    <div>
      <PageHeader
        title="Create Events"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Events',
          routeUrl: '/event',
        }, {
          label: 'Create',
        }]}
      />
      <form>
        <Panel>
          <Row>
            <Column col={6}>
              <TextInput
                type="text"
                label="Event Name"
                name="eventName"
                isRequired
                invalid={!!errorMap.eventName}
                validationMessage={errorMap.eventName}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="date"
                label="Start Date"
                name="startDate"
                isRequired
                invalid={!!errorMap.startDate}
                validationMessage={errorMap.startDate}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="date"
                label="End Date"
                name="endDate"
                isRequired
                invalid={!!errorMap.endDate}
                validationMessage={errorMap.endDate}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Location"
                name="location"
                isRequired
                invalid={!!errorMap.location}
                validationMessage={errorMap.location}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Event Title"
                name="eventTitle"
                isRequired
                invalid={!!errorMap.eventTitle}
                validationMessage={errorMap.eventTitle}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <TextInput
                type="text"
                label="Hb Form Id"
                name="hbFormId"
                isRequired
                invalid={!!errorMap.hbFormId}
                validationMessage={errorMap.hbFormId}
                changeHandler={onChangeHandler}
              />
            </Column>
            <Column col={6}>
              <DropDown
                options={DropDownValues}
                changeHandler={onChangeHandler}
                name="category"
                value={formData.tags}
                label="Tags"
                isRequired
              />
            </Column>

            <Column col={12}>
              <Text tag="label" color="gray-darker" align="left"
                className={bemClass(['events-form', 'description'])}>Description</Text>
              <RichTextEditor />
            </Column>
          </Row>
        </Panel>
        <Panel title="Speaker Details">
          <AddDeleteRow
            addHandler={addHandler}
            deleteHandler={deleteHandler}
            data={formData.speakers}
          >
            <Speaker
              onChangeHandler={onChangeHandler}
              errorMap={errorMap}
              formData={formData}
              onSubmitHandler={onSubmitHandler}
            />
          </AddDeleteRow>
        </Panel>
        <FormActionButton submitHandler={submitHandler} />
      </form>
    </div>
  )
}

export { Create, options }
