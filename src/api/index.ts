
type payloadType = {
    [key: string]: any
}

const get = async (URL: string, queryParams: payloadType = {}) => {
  const axios = (await import('axios')).default
  return axios.get(URL, queryParams).then((response) => response)
}

const post = async (URL:string, payload: payloadType) => {
  const axios = (await import('axios')).default
  return axios.post(URL, payload).then((response) => response)
}

export {
  get,
  post
}

