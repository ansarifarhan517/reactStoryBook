'use client'

import { useState, useEffect, ReactElement } from 'react'

type LoadExternalScriptProps ={
  children : ReactElement
  delay?: number
}

const LoadExternalScript = ({ children, delay = 4000 }: LoadExternalScriptProps ) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, delay)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}

export default LoadExternalScript
