import axios from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const POST = async (request: NextRequest) => {
  const cookieStore = cookies()
  const postData: any = await request.json()
  const { name, email, phone, phoneExt, pageUrl, pageTitle } = postData

  const hubSpotToken = cookieStore.get('hubspotutk')
  const hsContext = {
    hutk: hubSpotToken?.value,
    pageUrl,
    pageName: pageTitle
  }

  const formData = new FormData()

  formData.append('email', email)
  formData.append('firstname', name)
  formData.append('phone', phone)
  formData.append('extension', phoneExt)
  formData.append('hs_context', JSON.stringify(hsContext))

  try {
    const { data } = await axios.post('https://forms.hubspot.com/uploads/form/v2/2704626/0bbf6f42-b5d2-4a77-96cf-5d026043e7c2', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message })
  }
}

export {
  POST
}
