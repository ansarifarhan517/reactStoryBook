'use client'

import Link from 'next/link'
import { useState } from 'react'

import { cookieConsent } from '@/api/cookie-consent'
import { bemClass } from '@/utils'

import Button from '../button'
import Text from '../text'

import './style.scss'

type cookieConsentContentProps = {
  isCookiePresent?: boolean
  lastConsentDate: string
}

const blk = 'cookie-consent-content'

const CookieConsentContent = ({
  isCookiePresent = true,
  lastConsentDate
}: cookieConsentContentProps) => {
  const [isCookieConsent, setIsCookieConsent] = useState(isCookiePresent)
  const [showMore, setShowMore] = useState(false)

  const toggleShowMore = () => {
    setShowMore(!showMore)
  }

  const acceptHandler = async () => {
    setIsCookieConsent(true)
    await cookieConsent({
      isAccept: true,
      lastConsentDate
    })
  }

  const declineHandler = async () => {
    setIsCookieConsent(true)
    await cookieConsent({
      isAccept: false,
      lastConsentDate
    })
  }

  if (isCookieConsent) {
    return null
  }

  return (
    <div className={blk}>
      <div className={bemClass([blk, 'content'])}>
        <Text tag="span" typography="s" color="white">
          <>
            {`In addition to cookies that are strictly necessary to operate this website, we use the
            following types of cookies to improve your experience and our services. `}
            {!showMore && (
              <Button
                category="primary"
                className={bemClass([blk, 'msg-btn'])}
                clickHandler={toggleShowMore}
                dataAutoId="cookie_consent_show_more"
              >
                Show more
              </Button>
            )}
          </>
        </Text>
        {showMore && (
          <Text tag="span" typography="s" color="white">
            <>
              <strong>Functional cookies</strong> to enhance your experience (e.g. remember settings),
              <strong> Performance cookies</strong> to measure the website&apos;s performance and improve your experience,
              <strong> Advertising/Targeting cookies</strong>, which are set by third parties with whom we execute advertising
              campaigns and allow us to provide you with advertisements relevant to you, <strong> Social media
              cookies</strong>, which allow you to share the content on this website on social media like LinkedIn.
            </>
          </Text>
        )}
        {showMore && (
          <div className={bemClass([blk, 'link-wrapper'])}>
            <Link href="/privacy-policy" className={bemClass([blk, 'link'])}>
              Review our cookie policy for more information
            </Link>
            <Button
              category="primary"
              className={bemClass([blk, 'msg-btn'])}
              clickHandler={toggleShowMore}
              dataAutoId="cookie_consent_show_less"
            >
              Show less
            </Button>
          </div>
        )}
      </div>
      <div className={bemClass([blk, 'action', { 'show-more': showMore }])}>
        <Button
          category="primary"
          className={bemClass([blk, 'btn'])}
          dataAutoId="accept_all"
          clickHandler={acceptHandler}
        >
          Accept All
        </Button>
        <Button
          category="primary"
          outline
          className={bemClass([blk, 'btn', ['decline']])}
          dataAutoId="decline_all"
          clickHandler={declineHandler}
        >
          Decline All
        </Button>
      </div>
    </div>
  )
}

export default CookieConsentContent
