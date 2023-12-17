import { FileUpload, TextInput, Column, Panel, Row } from '@base'
import React from 'react'

interface SeoSettingProps {
  isDetailPage: boolean
  onChangeHandler: (valueObj: object) => void
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

const SeoSetting: React.FC<SeoSettingProps> = ({ isDetailPage, onChangeHandler, formData, errorMap }) => {
  console.log(formData)
  console.log(errorMap,'error')
  return (<Panel title="Seo Setting">
    <Row>
      <Column col={6}>
        <TextInput
          label="Meta Title"
          type="text"
          value={formData.metaTitle}
          name="metaTitle"
          invalid={!!errorMap.metaTitle}
          validationMessage={errorMap.metaTitle}
        />
      </Column>
      <Column col={6}>
        <TextInput
          label="Meta Description"
          type="text"
          value={formData.metaDescription}
          name="metaDescription"
          invalid={!!errorMap.metaDescription}
          validationMessage={errorMap.metaDescription}
        />
      </Column>

      {
        isDetailPage && (
          <>
            <Column col={6}>

              <TextInput
                label="Page Url"
                type="text"
                value={formData.pageUrl}
                name="pageUrl"
                invalid={!!errorMap.pageUrl}
                validationMessage={errorMap.pageUrl}
              />
            </Column>
            <Column col={6}>
              <FileUpload
                isRequired={false}
                title="Og Image"
                name="ogFileUpload"
                onChangeHandler={onChangeHandler}
              />
            </Column>
          </>
        )

      }
    </Row>
  </Panel>)
}

export default SeoSetting