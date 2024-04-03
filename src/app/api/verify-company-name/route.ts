import { NextRequest, NextResponse } from 'next/server'

const GET = async (request: NextRequest) => {
  const { nextUrl } = request
  const { searchParams } = nextUrl

  const companyname = searchParams.get('companyname')
  const planType = searchParams.get('planType')

  const apiBaseUrl = process.env.API_BASE_URL
  const response = await fetch(`${apiBaseUrl}/ClientApp/saas/client/verify/company?companyname=${companyname}&planType=${planType}`)
  const data = await response.json()

  return NextResponse.json(data)
}

export {
  GET
}
