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
import './style.scss'
import { ICreate } from '@utils/common.models'
import { schema } from '../validation-schema'

const options = {
  schema,
  formModel: {
    title: '',
    pageUrl: '',
    description: '',
    hbFormId: '',
    displayImagePath: '',
    displayFileUpload: '',
    displayImageAlt: '',
    ogImagePath: '',
    ogFileUpload: '',
    ogImageAlt: '',
    pdfLink: '',
  },
}

interface IWhitePaperCreateProps extends ICreate {
  errorMap: {
    title: string
    landingPagePath: string
    description: string
    hbFormSnippet: string
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

const Create: React.FC<IWhitePaperCreateProps> = ({
  errorMap,
  onChangeHandler,
  onSubmitHandler,
}) => (
  <div>
    <PageHeader
      title="Add White Paper"
      showBreadCrumb
      breadCrumbData={[{
        label: 'White paper',
        routeUrl: '/white-paper',
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
              label="Page URL"
              name="pageUrl"
              isRequired
              invalid={!!errorMap.landingPagePath}
              validationMessage={errorMap.landingPagePath}
              changeHandler={onChangeHandler}
            />
          </Column>
        </Row>
        <Row>
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
          <Column col={6}>
            <TextInput
              type="text"
              label="HubSpot Form Id"
              name="hbFormId"
              isRequired
              invalid={!!errorMap.hbFormSnippet}
              validationMessage={errorMap.hbFormSnippet}
              changeHandler={onChangeHandler}
            />
          </Column>
        </Row>
      </Panel>
      <Panel title="About">
        <Row>
          <Column col={6}>
            <TextInput
              type="text"
              label="Description"
              isTextArea
              name="description"
              isRequired
              invalid={!!errorMap.description}
              validationMessage={errorMap.description}
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
              className={bemClass(['white-paper-form', 'or'])}>
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
              transform="uppercase" className={bemClass(['white-paper-form', 'or'])}>
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

// Create.propTypes = {
//   errorMap: PropTypes.shape({
//     title: PropTypes.string,
//     landingPagePath: PropTypes.string,
//     description: PropTypes.string,
//     hbFormSnippet: PropTypes.string,
//     displayImagePath: PropTypes.string,
//     displayFileUpload: PropTypes.string,
//     displayImageAlt: PropTypes.string,
//     ogImagePath: PropTypes.string,
//     ogFileUpload: PropTypes.string,
//     ogImageAlt: PropTypes.string,
//     pdfLink: PropTypes.string,
//   }).isRequired,
//   onChangeHandler: PropTypes.func.isRequired,
//   onSubmitHandler: PropTypes.func.isRequired,
//   formData: PropTypes.shape({
//     title: PropTypes.string,
//     landingPagePath: PropTypes.string,
//     description: PropTypes.string,
//     hbFormSnippet: PropTypes.string,
//     displayImagePath: PropTypes.string,
//     displayFileUpload: PropTypes.string,
//     displayImageAlt: PropTypes.string,
//     ogImagePath: PropTypes.string,
//     ogFileUpload: PropTypes.string,
//     ogImageAlt: PropTypes.string,
//     pdfLink: PropTypes.string,
//     category: PropTypes.string,
//   }).isRequired,
// }

export {
  Create, options,
}
