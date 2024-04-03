'use client'

import { useContext } from 'react'
import AppContext from '@/context'

type goToSignUpPageProps = {
  children: any;
}

const GoToSignUpPage = ({ children }: goToSignUpPageProps) => {
  const { country } = useContext(AppContext)
  if (country && country !== 'IN') {
    return children
  }
  return null
}

export default GoToSignUpPage
