import { post } from './'

const hubspotSubscribeToNewsLetter = async (payload: Record<string, string>) => {
  try {
    const response = await post('/api/hubspot-subscribe-to-news-letter', payload)
    return response
  } catch (error) {
    console.error('Error: ', error)
  }
}

export {
  hubspotSubscribeToNewsLetter
}
