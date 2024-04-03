'use client'
import React, { useEffect } from 'react'

const CarbonScripts = () => {

  useEffect(() => {

    const script = document.createElement('script')
    script.src = 'https://cdn.calconic.com/static/js/calconic.min.js'
    script.async = true
    script.setAttribute('data-calconic', 'true')
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <>
      <div
        className="calconic-calculator"
        data-calculatorid="62970bfc290c7d001ed7de61"
      />
    </>
  )
}

export default CarbonScripts
