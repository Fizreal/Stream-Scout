'use client'

import { useState } from 'react'
import { Register } from '@/utils/auth'
import { useRouter } from 'next/navigation'

const SignUp: React.FC = () => {
  const router = useRouter()
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setRegisterForm({
        ...registerForm,
        password: '',
        confirmPassword: ''
      })
      return
    }

    let response = await Register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    })
    if (response.status !== 200) {
      setError(response.data)
      setRegisterForm({ ...registerForm, password: '', confirmPassword: '' })
    } else {
      router.push('/login')
    }
  }

  return (
    <main>
      <h1>Register Page</h1>
      <form onSubmit={handleRegister}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={registerForm.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={registerForm.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={registerForm.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={registerForm.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </main>
  )
}

export default SignUp
