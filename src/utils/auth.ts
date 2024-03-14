import axios from 'axios'

const BASE_URL = 'https://localhost:3000/'

const Client = axios.create({ baseURL: BASE_URL })

export const Login = async (data: { email: string; password: string }) => {
  const response = await Client.post('auth/login', data)
  return response.data
}

export const Register = async (data: { email: string; password: string }) => {
  const response = await Client.post('auth/register', data)
  return response.data
}
