'use client'

import {
  ReactElement, FormEvent, useState, useEffect
} from 'react'

import { HubspotProvider } from 'next-hubspot'

import { getCountryCode } from '@/api/country-check'

import AppContext from './index'

type appProviderProps = {
    children: ReactElement | string | number | null | undefined;
}

type videoDataType = {
  url: string
  trackingId: string
  title: string
}

const AppProvider = ({ children }: appProviderProps) => {
  const [signUpModal, setSignUpModal] = useState<boolean>(false)
  const [scheduleDemo, setScheduleDemoModal] = useState<boolean>(false)
  const [talkToUs, setTalkToUsModal] = useState<boolean>(false)
  const [country, setCountry] = useState<string>('')
  const [subscribeToNewsletter, setSubscribeToNewsletterModal] = useState<boolean>(false)
  const [joinPrList, setJoinPrListModal] = useState<boolean>(false)
  const [videoData, setVideoData] = useState<videoDataType>({
    url: '',
    trackingId: '',
    title: '',
  })

  useEffect(() => {
    const getCountry = async () => {
      try {
        const { countryCode = 'IN' } = await getCountryCode()
        setCountry(countryCode)
      } catch (error) {
        setCountry('IN')
      }
    }
    getCountry()
  }, [])

  const toggleSigUpModal = (e?: FormEvent) => {
    e?.preventDefault()
    setSignUpModal(!signUpModal)
  }

  const toggleScheduleDemoModal = (e?: FormEvent) => {
    e?.preventDefault()
    setScheduleDemoModal(!scheduleDemo)
  }

  const toggleTalkToUsModal = (e?: FormEvent) => {
    e?.preventDefault()
    setTalkToUsModal(!talkToUs)
  }

  const toggleSubscribeToNewsletterModal = (e?: FormEvent) => {
    e?.preventDefault()
    setSubscribeToNewsletterModal(!subscribeToNewsletter)
  }

  const toggleJoinPrListModal = (e?: FormEvent) => {
    e?.preventDefault()
    setJoinPrListModal(!joinPrList)
  }

  const providerValue = {
    signUpModal,
    toggleSigUpModal,
    scheduleDemo,
    toggleScheduleDemoModal,
    talkToUs,
    toggleTalkToUsModal,
    subscribeToNewsletter,
    toggleSubscribeToNewsletterModal,
    joinPrList,
    toggleJoinPrListModal,
    videoData,
    setVideoData,
    country,
  }

  return (
    <AppContext.Provider value={providerValue}>
      <HubspotProvider>
        {children}
      </HubspotProvider>
    </AppContext.Provider>
  )
}

export default AppProvider

