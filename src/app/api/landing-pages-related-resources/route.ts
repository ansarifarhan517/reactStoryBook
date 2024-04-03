import { objectToQueryString } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (request: NextRequest) => {
  const { nextUrl } = request
  const { searchParams } = nextUrl
  const slug = searchParams.get('slug')

  try {
    const response = await fetch(
      `https://www.loginextsolutions.com/blog/wp-json/wp/v2/tags?slug=${slug}&_fields=id`
    )
    const data = await response.json()

    const [{ id }] = data

    const queryString = objectToQueryString({ tags: id })

    const res = await fetch(`https://www.loginextsolutions.com/blog/wp-json/wp/v2/posts?_embed&${queryString}`)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }

    const apipResponse = {
      total: res.headers.get('x-wp-total'),
      totalPages: res.headers.get('x-wp-totalpages'),
      data: await res.json(),
    }

    return NextResponse.json(apipResponse)
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}

export { GET }
