import { get } from './'

const getCountryCode = async () => {
  const { data: { ip } } = await get('https://api.ipify.org?format=json')
  const { data } = await get(`/api/country-code?ip=${ip}`)
  return data
}

export {
  getCountryCode,
}
