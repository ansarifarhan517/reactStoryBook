import React, { useState } from 'react'
import {
  Row,
  Column,
  Panel,
  TextInput,
  FileUpload,
  CheckBox,
  Text,
  DropDown,

} from '@base'
import {
  PageHeader, FormActionButton, Collapsible, SeoSetting,
} from '@components'
import { bemClass } from '@utils'
import { schema } from '../validation-schema'
import './style.scss'
import { ICreate } from '@utils/common.models'

const checkboxes: Record<string, string[]> = {
  industry: ['retailAndEcommerce', 'manufacturing', 'quickServiceRestaurant', 'courierExpressParcel', 'cashManagement', 'oilGas'],
  solution: ['lastMileDeliveryOptimization', 'fieldWorkforceOptimization', 'onDemandDeliveryOptimization', 'transportManagementSystem'],
  feature: ['schedulePlanning',
    'permanentJourneyPlanning',
    'automatedAllocation',
    'capacityUtilization',
    'routeOptimization',
    'realTimeTracking',
    'SLACompliance',
    'dynamicETACalculation',
    'serviceTimeTracking',
    'onTimeDeliveries',
    'electronicProofOfDelivery',
    'feedbackCapture',
    'endToEndVisibility'],
}

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
    retailAndEcommerce: false,
    manufacturing: false,
    quickServiceRestaurant: false,
    courierExpressParcel: false,
    cashManagement: false,
    oilGas: false,
    lastMileDeliveryOptimization: false,
    fieldWorkforceOptimization: false,
    onDemandDeliveryOptimization: false,
    transportManagementSystem: false,
    schedulePlanning: false,
    permanentJourneyPlanning: false,
    automatedAllocation: false,
    capacityUtilization: false,
    routeOptimization: false,
    realTimeTracking: false,
    SLACompliance: false,
    dynamicETACalculation: false,
    serviceTimeTracking: false,
    onTimeDeliveries: false,
    electronicProofOfDelivery: false,
    feedbackCapture: false,
    endToEndVisibility: false,
    category: 'industry',
    metaDescription: '',
    metaTitle: '',
    ogImage: '',
  },
}

interface ICreateCaseStudyProps extends ICreate {
  errorMap: {
    title: string
    pageUrl: string
    description: string
    hbFormId: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
    pdfLink: string
    retailAndEcommerce: string
    manufacturing: string
    quickServiceRestaurant: string
    courierExpressParcel: string
    cashManagement: string
    oilGas: string
    lastMileDeliveryOptimization: string
    fieldWorkforceOptimization: string
    onDemandDeliveryOptimization: string
    transportManagementSystem: string
    schedulePlanning: string
    permanentJourneyPlanning: string
    automatedAllocation: string
    capacityUtilization: string
    routeOptimization: string
    realTimeTracking: string
    SLACompliance: string
    dynamicETACalculation: string
    serviceTimeTracking: string
    onTimeDeliveries: string
    electronicProofOfDelivery: string
    feedbackCapture: string
    endToEndVisibility: string
    metaDescription: string
    metaTitle: string
    ogImage?: string
  }
  formData: {
    title: string
    pageUrl: string
    description: string
    hbFormId: string
    displayImagePath: string
    displayFileUpload: string
    displayImageAlt: string
    ogImagePath: string
    ogFileUpload: string
    ogImageAlt: string
    pdfLink: string
    retailAndEcommerce: boolean
    manufacturing: boolean
    quickServiceRestaurant: boolean
    courierExpressParcel: boolean
    cashManagement: boolean
    oilGas: boolean
    lastMileDeliveryOptimization: boolean
    fieldWorkforceOptimization: boolean
    onDemandDeliveryOptimization: boolean
    transportManagementSystem: boolean
    schedulePlanning: boolean
    permanentJourneyPlanning: boolean
    automatedAllocation: boolean
    capacityUtilization: boolean
    routeOptimization: boolean
    realTimeTracking: boolean
    SLACompliance: boolean
    dynamicETACalculation: boolean
    serviceTimeTracking: boolean
    onTimeDeliveries: boolean
    electronicProofOfDelivery: boolean
    feedbackCapture: boolean
    endToEndVisibility: boolean
    category: string
    metaTitle: string
    metaDescription: string
    ogImage?: string
  }
}

const Create: React.FC<ICreateCaseStudyProps> = ({
  errorMap,
  onChangeHandler = () => {},
  onSubmitHandler = () => {},
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

  const [isexpanded, setIsExpanded] = useState(false)

  const DropDownChangeHandler = React.useCallback(
    (e: Record<string, string>): void => {
      Object.keys(checkboxes).forEach((category) => {
        if (category !== e.category) {
          checkboxes[category].forEach((key) => {
            setFormData?.((prevData) => ({ ...prevData, [key]: false }))
          })
        }
        onChangeHandler(e)
      })
    },
    [checkboxes, setFormData, onChangeHandler],
  )

  return (
    <div>
      <PageHeader
        title="Create Case Study"
        showBreadCrumb
        breadCrumbData={[{
          label: 'Case study',
          routeUrl: '/case-study',
        }, {
          label: 'Create',
        }]}
      />
      <form>
        <SeoSetting isDetailPage onChangeHandler={onChangeHandler} formData={formData} errorMap={errorMap}/>

        <Panel>
          <Row>
            <Column col={6}>
              <div>
                <strong>Categories</strong>
              </div>
            </Column>
            <Column col={6}>
              <strong>Sub-Categories</strong>
            </Column>
          </Row>
          <Row>
            <Column col={6}>
              <DropDown
                options={DropDownValues}
                changeHandler={DropDownChangeHandler}
                name="category"
                value={formData.category}
              />
            </Column>
            <Column col={6}>
              {Object.keys(checkboxes).map((key) => {
                if (key === formData.category) {
                  return checkboxes[key].map((category) => (
                    <CheckBox
                      key={category}
                      checked={!!formData[category as keyof typeof formData]}
                      id={category}
                      label={category}
                      name={category}
                      onChangeHandler={onChangeHandler}
                    />
                  ))
                }
                return null // Return null for keys that don't match formData.category
              })}

            </Column>

          </Row>
          <Row>
            <Column col={6}>
              <Collapsible
                title="Branches"
                isExpanded={isexpanded}
                onClickHandler={() => { setIsExpanded(!isexpanded) }}
              >
                <ul>
                  <li>Dubai</li>
                  <li>Dublin</li>
                </ul>
              </Collapsible>
            </Column>
          </Row>
        </Panel>

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
                invalid={!!errorMap.pageUrl}
                validationMessage={errorMap.pageUrl}
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
                invalid={!!errorMap.hbFormId}
                validationMessage={errorMap.hbFormId}
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
          <FormActionButton submitHandler={onSubmitHandler} />
        </Panel>
      </form>
    </div>
  )
}

export { Create, options }
