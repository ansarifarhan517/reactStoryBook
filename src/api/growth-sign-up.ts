import { post } from './'

const growthSignUp = async (payload: Record<string, any>) => {
  try {
    const { data: response } = await post('/api/growth-sign-up', payload)
    const { data, hasError } = response
    const { url } = data
    if (!hasError) {
      return url
    }
  } catch (error) {
    console.error('Error: ', error)
  }
}

export { growthSignUp }
