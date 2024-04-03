'use client'

import dynamic from 'next/dynamic'
import { FormEvent, useState } from 'react'

import { bemClass, validatePayload } from '@/utils'

import { hubspotSubscribeToNewsLetter } from '@/api/hubspot-subscribe-to-news-letter'
import { verifyEmail } from '@/api/verify-email'
import { hubspotJoinPRList } from '@/api/hubspot-join-pr-list'

import TextInput from '../text-input'
import Button from '../button'

import { schema } from './validation/schema'

import './style.scss'

type formDataType = {
  name: string
  email: string
  publicationName: string
}

type subscribeToNewsLetterProps = {
  joinPRListPopup?: boolean
  successCallback?: () => void
  dataAutoId?: string
}

const PhoneInput = dynamic(() => import('@/components/phone-input'), {
  ssr: false
})

const blk = 'newsletter-pr-form'

const NewsletterPRForm = ({
  joinPRListPopup,
  successCallback = () => {},
  dataAutoId
}: subscribeToNewsLetterProps) => {
  const [formData, setFormData] = useState<formDataType>({
    name: '',
    email: '',
    publicationName: ''
  })
  const [contactData, setContactData] = useState<Record<string, any>>({
    isValid: true,
    value: '',
    countryName: '',
    dialCode: '',
    fullNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isContactValid, setIsContactValid] = useState(true)
  const [formError, setFormError] = useState<Record<string, string>>({})
  const [invalidEmail, setInvalidEmail] = useState<Record<string, any>>({ error: false,
    message: 'Please enter company email id' })

  const changeHandler = (valueObj: Record<string, string>) => {
    setFormData({
      ...formData,
      ...valueObj
    })
  }

  const onEmailBlurHandler = async () => {
    const { email } = formData
    const response = await fetch(`/api/verify-email?email=${email}`)
    const { code } = await response.json()
    if (code !== 200) {
      setFormError({
        ...formError,
        email: 'Please enter valid organization email id'
      })
    } else {
      setFormError({
        ...formError,
        email: ''
      })
    }
  }

  const submitForm = async () => {
    const { name, email, publicationName } = formData
    const { value, dialCode } = contactData

    const joinPRListReqBody = {
      name,
      email,
      phone: value,
      phoneExt: `+${dialCode}`,
      publicationName
    }
    const subscribeToNewsLetterReqBody = {
      name,
      email,
      phone: value,
      phoneExt: `+${dialCode}`,
      pageUrl: document.location.href,
      pageTitle: document.title,
    }

    if (joinPRListPopup) {
      await hubspotJoinPRList(joinPRListReqBody)
      successCallback()
    } else {
      const response = await hubspotSubscribeToNewsLetter(subscribeToNewsLetterReqBody)
      if (response?.status === 200) {
        successCallback()
      }
    }
    setIsLoading(false)
  }

  const contactChangeHandler = (valueObj: Record<string, string>) => {
    setContactData(valueObj)
  }

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault()
    let finalSchema
    finalSchema = joinPRListPopup ? schema : schema.filter((key) => key.path != 'publicationName')
    const { isValid, errorMap } = validatePayload(finalSchema, formData)
    setFormError(errorMap)
    setIsContactValid(contactData.isValid)

    if (!isValid || !contactData.isValid) {
      return
    }

    setIsLoading(true)
    const verifyEmailResponse: Record<string, any> = await verifyEmail(email)

    setInvalidEmail({
      error: verifyEmailResponse?.error,
      message: verifyEmailResponse?.message
    })

    if (verifyEmailResponse?.error) {
      return
    }

    submitForm()
  }

  const { name, email, publicationName } = formData

  return (
    <form
      className={bemClass([blk, 'form'])}
      onSubmit={onSubmitHandler}
    >
      <TextInput
        name="name"
        label="Name"
        value={name}
        invalid={!!formError['name']}
        errorMessage={'Please enter your name'}
        changeHandler={changeHandler}
        dataAutoId={`${dataAutoId}_name`}
      />
      <TextInput
        name="email"
        label="Email address"
        value={email}
        invalid={!!formError['email'] || invalidEmail?.error}
        errorMessage={invalidEmail?.message}
        changeHandler={changeHandler}
        dataAutoId={`${dataAutoId}_email`}
      />
      <PhoneInput
        name="phone"
        label="Contact"
        invalid={!isContactValid}
        errorMessage={'Please enter a valid mobile number'}
        changeHandler={contactChangeHandler}
        dataAutoId={`${dataAutoId}_contact`}
      />
      {joinPRListPopup ? (
        <TextInput
          name="publicationName"
          label="Publication Name"
          value={publicationName}
          invalid={!!formError['publicationName']}
          errorMessage={'Please enter your publication name'}
          changeHandler={changeHandler}
          dataAutoId={`${dataAutoId}_publication_name`}
        />) : null
      }
      <Button
        type="submit"
        category="primary"
        outline
        loading={isLoading}
        className={bemClass([blk, 'button'])}
        dataAutoId={`${dataAutoId}_submit`}
      >
        Submit
      </Button>
    </form>
  )
}

export default NewsletterPRForm
