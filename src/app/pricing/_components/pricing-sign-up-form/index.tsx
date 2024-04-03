'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FormEvent, useEffect, useState } from 'react'

import { bemClass, validatePayload } from '@/utils'

import Text from '@/components/text'
import TextInput from '@/components/text-input'
import Dropdown from '@/components/drop-down'
import Button from '@/components/button'

import { verifyEmail } from '@/api/verify-email'
import { verifyCompanyName } from '@/api/verify-company-name'
import { getIndustryType } from '@/api/industry-type'

import { companySizeList, designationList } from './_data'
import { schema } from './validation/schema'
import { formDataType } from '../../types'

import './style.scss'

const PhoneInput = dynamic(() => import('@/components/phone-input'), {
  ssr: false
})

const blk = 'pricing-signup-form'

type pricingSignUpFormProps = {
  setStep?: (value: string) => void
  isGrowthPlan: boolean
  signUpHandler?: (payload: formDataType) => void
  setGrowthPlanData?: (obj: formDataType) => void
  planType: string
  dataAutoId?: string
  signUpDataFormData?: formDataType
}

type industryListType = {
  clientRefMasterCd: string
  clientRefMasterDesc: string
  clientRefMasterId: number
  id: number
}

type industryDataType = {
  key: string,
  value: string
}

const PricingSignupForm = ({
  setStep, isGrowthPlan, signUpHandler, setGrowthPlanData, planType, dataAutoId,
  signUpDataFormData = {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    industry: '',
    employeeCount: '',
    designation: '',
    country: '',
    checked: false,
    phone: ''
  }
}: pricingSignUpFormProps) => {
  const [formData, setFormData] = useState<formDataType>(signUpDataFormData)
  const [contactData, setContactData] = useState<Record<string, any>>({
    isValid: false,
    value: '',
    countryName: '',
    dialCode: '',
    fullNumber: '',
  })
  const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false)
  const [formError, setFormError] = useState<Record<string, string>>({})
  const [isContactValid, setIsContactValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState<Record<string, any>>({ error: false,
    message: 'Please enter company email id' })
  const [invalidCompanyName, setInvalidCompanyName] = useState<Record<string, any>>({ error: false,
    message: 'Please enter the name of your company' })
  const [checkboxErrorMessage, setCheckboxErrorMessage] = useState<string>('')

  const { firstName, lastName, email, companyName, industry, employeeCount, designation, checked, phone } = formData
  const [industryData, setIndustryData] = useState<industryDataType[]>([])

  const submitForm = () => {
    if (isGrowthPlan) {
      setIsLoading(false)
      setStep?.('2')
      setGrowthPlanData?.({ ...formData,
        checked: isCheckboxChecked })
    } else {
      signUpHandler?.(formData)
    }
  }

  const continueClickHandler = async (event: FormEvent | any) => {
    event.preventDefault()
    const { isValid, errorMap } = validatePayload(schema, formData)
    setFormError(errorMap)
    setIsContactValid(contactData.isValid)
    !isCheckboxChecked ? setCheckboxErrorMessage('Please agree to the terms and conditions') : setCheckboxErrorMessage('')

    if (!isValid || !isCheckboxChecked || !contactData.isValid) {
      return
    }

    setIsLoading(true)
    const verifyEmailResponse: Record<string, any> = await verifyEmail(email)
    const verifyCompanyResponse: Record<string, any> = await verifyCompanyName(companyName, planType)

    setInvalidEmail({ error: verifyEmailResponse?.error,
      message: verifyEmailResponse?.message })
    setInvalidCompanyName({ error: verifyCompanyResponse?.error,
      message: verifyCompanyResponse?.message })
    if (verifyEmailResponse?.error || verifyCompanyResponse?.error) {
      setIsLoading(false)
      return
    }

    submitForm()
  }

  const changeHandler = async (valueObj: Record<string, string>) => {
    setFormData({
      ...formData,
      ...valueObj,
      name: firstName + ' ' + lastName,
    })
  }

  const handleIndustryType = async () => {
    const response = await getIndustryType()
    const industryList = response?.data?.data?.map((item: industryListType) => ({
      key: item?.clientRefMasterCd,
      value: item?.clientRefMasterDesc
    }))
    setIndustryData(industryList)
  }

  const blurHandler = (fieldName: string, value: string) => {
    if (!value) {
      const { errorMap } = validatePayload(schema, formData)
      setFormError(errorMap)
    }
  }

  const contactChangeHandler = (valueObj: Record<string, string>) => {
    setContactData(valueObj)
    setFormData({
      ...formData,
      country: valueObj?.countryName + ': +' + valueObj?.dialCode,
      mobileNumber: `+${valueObj?.dialCode}-${(valueObj?.value).split('-').join('')}`,
      phone: (valueObj?.value).split('-').join('')
    })
  }

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked)
  }

  useEffect(() => {
    handleIndustryType()
  }, [])

  useEffect(() => {
    checked && setIsCheckboxChecked(checked)
  }, [checked])

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'section'])}>
        <TextInput
          label="First Name"
          name="firstName"
          value={firstName}
          invalid={!!formError['firstName']}
          errorMessage={'Please enter your first name'}
          changeHandler={changeHandler}
          dataAutoId={`${dataAutoId}_first_name`}
        />
        <TextInput
          label="Last Name"
          name="lastName"
          value={lastName}
          invalid={!!formError['lastName']}
          errorMessage={'Please enter your last name'}
          changeHandler={changeHandler}
          dataAutoId={`${dataAutoId}_last_name`}
        />
      </div>
      <TextInput
        label="Official Email ID"
        name="email"
        value={email}
        invalid={!!formError['email'] || invalidEmail?.error}
        errorMessage={invalidEmail?.message}
        changeHandler={changeHandler}
        dataAutoId={`${dataAutoId}_email`}
      />
      <PhoneInput
        name="mobileNumber"
        label="Contact"
        invalid={!isContactValid}
        errorMessage={'Please enter a valid mobile number'}
        changeHandler={contactChangeHandler}
        dataAutoId={`${dataAutoId}_contact`}
        value={phone}
      />
      <TextInput
        label="Company Name"
        name="companyName"
        invalid={!!formError['companyName'] || invalidCompanyName?.error}
        errorMessage={invalidCompanyName?.message}
        value={companyName}
        changeHandler={changeHandler}
        dataAutoId={`${dataAutoId}_company_name`}
      />
      <div className={bemClass([blk, 'section'])}>
        <Dropdown
          label="Industry"
          name="industry"
          value={industry}
          list={industryData}
          invalid={!!formError['industry']}
          errorMessage={'The field is required.'}
          changeHandler={changeHandler}
          dataAutoId={`${dataAutoId}_industry`}
        />
        <Dropdown
          label="Company Size"
          name="employeeCount"
          value={employeeCount}
          list={companySizeList}
          invalid={!!formError['employeeCount']}
          errorMessage={'Please select your company size'}
          changeHandler={changeHandler}
          dataAutoId={`${dataAutoId}_company_size`}
        />
      </div>
      <Dropdown
        label="Designation"
        name="designation"
        value={designation}
        list={designationList}
        invalid={!!formError['designation']}
        errorMessage={'Please enter your designation'}
        changeHandler={changeHandler}
        dataAutoId={`${dataAutoId}_designation`}
      />
      <div className={bemClass([blk, 'terms-conditions'])}>
        <input
          type="checkbox"
          className={bemClass([blk, 'checkbox'])}
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
          data-auto-id={`${dataAutoId}_checkbox`}
        />
        <Text tag="p" typography="s" dataAutoId={`${dataAutoId}_checkbox_label`}>
          <>
            {'I agree to LogiNext Solutions '}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className={bemClass([blk, 'link'])}
              data-auto-id={`${dataAutoId}_tnc`}
            >
              Terms & Conditions
            </Link>
            {' and '}
            <Link
              href="/privacy-policy"
              target="_blank"
              className={bemClass([blk, 'link'])}
              data-auto-id={`${dataAutoId}_privacy_policy`}
            >
              Privacy Policy
            </Link>
          </>
        </Text>
      </div>
      <span className={bemClass([blk, 'error'])} data-auto-id={`${dataAutoId}_checkbox_error`}>
        {checkboxErrorMessage}
      </span>
      <Button
        category="primary"
        isBlock
        clickHandler={continueClickHandler}
        loading={isLoading}
        dataAutoId={isGrowthPlan ? `${dataAutoId}_continue` : `${dataAutoId}_free_sign_up`}
      >
        {isGrowthPlan ? 'Continue' : 'Sign up for free'}
      </Button>
    </div>
  )
}

export default PricingSignupForm
