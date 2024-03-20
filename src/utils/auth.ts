import axios from 'axios'

export const BASE_URL = 'http://localhost:3001/'

const Client = axios.create({ baseURL: BASE_URL })

export const Login = async (data: { email: string; password: string }) => {
  const response = await Client.post('auth/login', data)
  return response
}

export const Register = async (data: {
  name: String
  email: string
  password: string
}) => {
  const response = await Client.post('auth/register', data)
  return response.data
}
