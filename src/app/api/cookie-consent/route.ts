import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  .replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })

const POST = async (request: NextRequest) => {
  const cookieStore = cookies()
  const currentDate = new Date()

  const postData = await request.json()
  const { lastConsentDate, isAccept } = postData

  const value: any = {
    categories: [],
    revision: 0,
    data: null,
    rfc_cookie: false,
    consent_date: currentDate,
    consent_uuid: uuid(),
  }

  if (isAccept) {
    value.categories = ['necessary', 'necessary', 'necessary', 'necessary']
  }

  if (lastConsentDate) {
    value.last_consent_update = lastConsentDate
  }

  const cookieValue = JSON.stringify(value)

  cookieStore.set('cookie_consent', cookieValue, {
    secure: true,
    maxAge: 31536000
  })

  return NextResponse.json({ status: isAccept ? 'accept' : 'decline',
    message: 'success' })
}

export {
  POST
}
