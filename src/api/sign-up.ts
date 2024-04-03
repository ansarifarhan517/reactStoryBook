import { post } from './'

const signUp = async (payload: Record<string, any>) => {
  try {
    const response = await post('/api/sign-up', payload)
    return response
  } catch (error) {
    console.error('Error: ', error)
  }
}

export { signUp }
