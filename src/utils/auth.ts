import axios from 'axios'

const BASE_URL = 'https://localhost:3000/'

const Client = axios.create({ baseURL: BASE_URL })

export const Login = async (data: { email: string; password: string }) => {
  const response = await Client.post('auth/login', data)
  return response
}

export const Register = async (data: { email: string; password: string }) => {
  const response = await Client.post('auth/register', data)
  return response.data
}

export const CheckSession = async () => {
  const token = localStorage.getItem('token')
  if (token) {
    const response = await Client.get('auth/session', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } else {
    return null
  }
}
