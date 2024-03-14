import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Login } from '@/utils/auth'

const LoginPage: React.FC = async () => {
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
    if (response.status !== 200) {
      setError(response.data)
      setLoginForm({ ...loginForm, password: '' })
    } else {
      let payload = response.data
      login(payload)
    }
  }

  return (
    <main>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
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
        <button type="submit">Login</button>
      </form>
    </main>
  )
}

export default LoginPage
