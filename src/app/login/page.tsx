'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Login } from '@/utils/auth'
import SubmitButton from '@/components/SubmitButton'

const LoginPage: React.FC = () => {
  const { login } = useUser()

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    let response = await Login(loginForm)
    console.log(response)
    if (response.status !== 200) {
      setLoginForm({ ...loginForm, password: '' })
    } else {
      let payload = response.data
      login(payload.token)
    }
  }

  return (
    <main>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <SubmitButton
          text="Login"
          disabled={loginForm.email && loginForm.password ? false : true}
          loading={false}
        />
      </form>
    </main>
  )
}

export default LoginPage
