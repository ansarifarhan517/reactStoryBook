import { NextRequest, NextResponse } from 'next/server'

const POST = async (request: NextRequest) => {

  const apiBaseUrl = process.env.API_BASE_URL
  const postData = await request.json()

  const response = await fetch(`${apiBaseUrl}/ClientApp/saas/client/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  const data = await response.json()

  return NextResponse.json(data)
}

export {
  POST
}
