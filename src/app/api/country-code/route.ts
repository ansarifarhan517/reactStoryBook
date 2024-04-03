import { NextRequest, NextResponse } from 'next/server'

import { cookies } from 'next/headers'

const GET = async (request: NextRequest) => {
  const cookieStore = cookies()
  const { nextUrl } = request
  const { searchParams } = nextUrl

  const ip = searchParams.get('ip')

  const ipString = ip?.toString() || ''

  const countryCode = cookieStore.get(ipString)?.value
  if (countryCode) {
    return NextResponse.json({
      countryCode: countryCode,
      origin: 'internal'
    })
  } else {
    const response = await fetch(`http://www.geoplugin.net/json.gp?ip=${ip}`)
    const { geoplugin_countryCode } = await response.json()

    const oneMonth = 7 * 24 * 60 * 60 * 1000
    cookieStore.set(ipString, geoplugin_countryCode, {
      secure: true,
      httpOnly: true,
      path: '/',
      expires: Date.now() + oneMonth
    })

    return NextResponse.json({
      countryCode: geoplugin_countryCode,
      origin: 'external'
    })
  }
}

export {
  GET
}
