'use client'

import { FormEvent, createContext } from 'react'

type videoDataType = {
  url: string
  trackingId: string
  title: string
}

const defaultValue = {
  signUpModal: false,
  toggleSigUpModal: (e?: FormEvent) => { e?.preventDefault() },
  scheduleDemo: false,
  toggleScheduleDemoModal: (e?: FormEvent) => { e?.preventDefault() },
  talkToUs: false,
  toggleTalkToUsModal: (e?: FormEvent) => { e?.preventDefault() },
  subscribeToNewsletter: false,
  toggleSubscribeToNewsletterModal: (e?: FormEvent) => { e?.preventDefault() },
  joinPrList: false,
  toggleJoinPrListModal: (e?: FormEvent) => { e?.preventDefault() },
  videoData: {
    url: '',
    trackingId: '',
    title: '',
  },
  setVideoData: (obj: videoDataType) => {},
  country: ''
}

const AppContext = createContext(defaultValue)

export default AppContext
