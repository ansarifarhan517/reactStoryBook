import { cookies } from 'next/headers'

import CookieConsentContent from '../cookie-consent-content'

const CookieConsent = () => {
  const cookieStore = cookies()

  const isCookiePresent = cookieStore.has('cookie_consent')
  let lastConsentDate = ''

  if (isCookiePresent) {
    const { value: currentCookieValue = '' } = cookieStore.get('cookie_consent') || {}
    const { consent_date } = JSON.parse(currentCookieValue) || {}
    lastConsentDate = consent_date
  }

  return (
    <CookieConsentContent
      isCookiePresent={isCookiePresent}
      lastConsentDate={lastConsentDate}
    />
  )
}

export default CookieConsent
