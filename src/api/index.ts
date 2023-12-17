import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://logiCms.com/api/v1',
})

const get = async (URL: string) => await axiosClient.get(URL).then((response) => response)

const post = async (URL: string, payload: object) => await axiosClient.post(URL, payload).then((response) => response)

const patch = async (URL: string, payload: object) => await axiosClient.patch(URL, payload).then((response) => response)

const remove = async (URL: string, payload: object) => await axiosClient.delete(URL).then((response) => response)

export {
  get,
  post,
  patch,
  remove,
}
