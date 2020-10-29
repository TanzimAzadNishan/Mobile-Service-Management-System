import axios from 'axios'

const baseApi = axios.create({
    baseURL: `http://localhost:4000`,
    withCredentials: false, // This is the default
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: 10000
})

const multipartApi = axios.create({
  baseURL: `http://localhost:4000`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'multipart/form-data',
    'Content-Type': 'multipart/form-data'
  },
  timeout: 10000
})

export {baseApi, multipartApi}