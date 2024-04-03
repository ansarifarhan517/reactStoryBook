import { post } from '.'

const hubspotJoinPRList = async (payload: Record<string, string>) => {
  try {
    const response = await post('/api/hubspot-join-pr-list', payload)
    return response
  } catch (error) {
    console.error('Error: ', error)
  }
}

export {
  hubspotJoinPRList
}
