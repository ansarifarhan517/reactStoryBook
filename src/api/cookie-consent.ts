import { post } from './'

const cookieConsent = async (payload: Record<string, any>) => {
  try {
    const { data: response } = await post('/api/cookie-consent', payload)
    console.log(response)
  } catch (error) {
    console.error('Error: ', error)
  }
}

export { cookieConsent }
