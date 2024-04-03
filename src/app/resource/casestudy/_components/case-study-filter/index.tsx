'use client'

import { useState } from 'react'

import { bemClass } from '@/utils'

import CaseStudyFilterDropDown from '../case-study-filter-drop-down'

import './style.scss'

const platformOptions = [{
  key: 'industry',
  value: 'Industry'
},
{
  key: 'solution',
  value: 'Solution'
},
{
  key: 'feature',
  value: 'Feature'
}]

const industryOptions = [{
  key: 'industry-show-all',
  value: 'All',
  categories: [],
},
{
  key: 'industry-retail-and-e-commerce',
  value: 'Retail and E-commerce',
  categories: ['1', '8', '10', '0'],
},
{
  key: 'industry-manufacturing ',
  value: 'Manufacturing',
  categories: ['2', '5', '11', '12'],
},
{
  key: 'industry-quick-service-restaurant ',
  value: 'Quick Service Restaurant',
  categories: ['3'],
},
{
  key: 'industry-courier-express-parcel ',
  value: 'Courier, Express, & Parcel',
  categories: ['4', '9'],
},
{
  key: 'industry-cash-management',
  value: 'Cash Management',
  categories: ['6'],
},
{
  key: 'industry-oil-and-gas ',
  value: 'Oil and Gas',
  categories: ['7'],
}]

const solutionOptions = [{
  key: 'solution-show-all',
  value: 'All',
  categories: [],
},
{
  key: 'solution-last-mile-delivery-optimization',
  value: 'Last Mile Delivery Optimization',
  categories: ['1', '4', '5', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'solution-field-workforce-optimization',
  value: 'Field Workforce Optimization',
  categories: ['2', '5', '6', '0'],
},
{
  key: 'solution-on-demand-delivery-optimization',
  value: 'On-Demand Delivery Optimization',
  categories: ['3'],
},
{
  key: 'solution-transport-management-system',
  value: 'Transport Management System',
  categories: ['7', '11', '12'],
}]

const featureOptions = [{
  key: 'feature-show-all',
  value: 'All',
  categories: [],
},
{
  key: 'feature-schedule-planning',
  value: 'Schedule Planning',
  categories: ['1', '4', '7', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'feature-permanent-journey-planning',
  value: 'Permanent Journey Planning',
  categories: ['2', '6'],
},
{
  key: 'feature-automated-allocation',
  value: 'Automated Allocation',
  categories: ['1', '2', '3', '4', '6', '9'],
},
{
  key: 'feature-capacity-utilization',
  value: 'Capacity Utilization',
  categories: ['1', '3', '4', '6', '7', '8', '10', '11', '12', '0'],
},
{
  key: 'feature-route-optimization',
  value: 'Route Optimization',
  categories: ['1', '2', '4', '6', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'feature-real-time-tracking',
  value: 'Real-time Tracking',
  categories: ['1', '2', '3', '4', '6', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'feature-sla-compliance',
  value: 'SLA Compliance',
  categories: ['1', '3', '4', '6', '7', '8', '10', '11', '12', '0'],
},
{
  key: 'feature-dynamic-eta-calculation',
  value: 'Dynamic ETA Calculation',
  categories: ['1', '3', '4', '6', '7', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'feature-service-time-tracking',
  value: 'Service Time Tracking',
  categories: ['2', '3'],
},
{
  key: 'feature-on-time-deliveries',
  value: 'On-time Deliveries',
  categories: ['1', '3', '4', '7', '8', '9', '10', '11', '12', '0'],
},
{
  key: 'feature-electronic-proof-of-delivery ',
  value: 'Electronic Proof of Delivery',
  categories: ['1', '3', '4', '7', '9'],
},
{
  key: 'feature-feedback-capture',
  value: 'Feedback Capture',
  categories: ['1', '2', '3', '4'],
},
{
  key: 'feature-end-to-end-visibility',
  value: 'End-to-End Visibility',
  categories: ['1', '2', '3', '4', '6', '7', '8', '9', '10', '11', '12', '0'],
}]

const getOptionList = (platform: string) => {
  switch (platform) {
  case 'solution': {
    return solutionOptions
  }
  case 'feature': {
    return featureOptions
  }
  default: {
    return industryOptions
  }
  }
}

type caseStudyFilterProps = {
  onSelection: (categories: string[]) => void
  dataAutoId?: string
}

const blk = 'case-study-filter'

const CaseStudyFilter = ({ onSelection, dataAutoId }: caseStudyFilterProps) => {
  const [plarform, setPlatform] = useState<Record<string, string>>(platformOptions[0])
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>({})
  const dropDownOptions = getOptionList(plarform.key)

  const platFormChangeHandler = (valueObj: Record<string, any>) => {
    setPlatform(valueObj)
    setSelectedOption({})
    onSelection([])
  }

  const onOptionsSelection = (valueObj: Record<string, any>) => {
    setSelectedOption(valueObj)
    onSelection(valueObj.categories)
  }

  return (
    <div className={blk}>
      <CaseStudyFilterDropDown
        isMainMenu
        selected={plarform.key}
        selectedValue={plarform.value}
        options={platformOptions}
        selectHandler={platFormChangeHandler}
        dataAutoId={`${dataAutoId}_1`}
      />
      <CaseStudyFilterDropDown
        selected={selectedOption.key}
        selectedValue={selectedOption.value || `Select ${plarform.key}`}
        options={dropDownOptions}
        selectHandler={onOptionsSelection}
        className={bemClass([blk, 'sub-menu'])}
        dataAutoId={`${dataAutoId}_2`}
      />
    </div>
  )
}

export default CaseStudyFilter
