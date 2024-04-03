import { NextRequest, NextResponse } from 'next/server'

const GET = async (request: NextRequest) => {

  const apiBaseUrl = process.env.API_BASE_URL
  const response = await fetch(`${apiBaseUrl}/ClientApp/saas/client/getIndustryTypes?isDefault=false`)
  const data = await response.json()

  return NextResponse.json(data)
}

export {
  GET
}
