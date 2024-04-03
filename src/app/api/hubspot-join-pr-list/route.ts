import axios from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const POST = async (request: NextRequest) => {
  const cookieStore = cookies()
  const postData: any = await request.json()
  const { name, email, phone, phoneExt, publicationName } = postData

  const hubSpotToken = cookieStore.get('hubspotutk')
  const hsContext = {
    hutk: hubSpotToken?.value
  }

  const formData = new FormData()

  formData.append('email', email)
  formData.append('firstname', name)
  formData.append('phone', phone)
  formData.append('extension', phoneExt)
  formData.append('publication_name', publicationName)
  formData.append('hs_context', JSON.stringify(hsContext))

  try {
    const { data } = await axios.post('https://forms.hubspot.com/uploads/form/v2/2704626/732e0236-2eff-44f3-90f4-8a6831b1b68c', formData, {
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
