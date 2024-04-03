import { NextRequest, NextResponse } from 'next/server'

const GET = async (request: NextRequest) => {
  const { nextUrl } = request
  const { searchParams } = nextUrl

  const email = searchParams.get('email')

  const apiBaseUrl = process.env.API_BASE_URL
  const response = await fetch(`${apiBaseUrl}/ClientApp/saas/client/verify/email?useremail=${email}`)
  const data = await response.json()

  return NextResponse.json(data)
}

export {
  GET
}
