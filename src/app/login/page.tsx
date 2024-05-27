'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Login } from '@/utils/auth'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'

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
    <section className="flex flex-col items-center pt-6 w-full">
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-PrimaryDark items-center w-4/5 max-w-md p-6 gap-1.5 rounded-lg shadow-lg"
      >
        <h2 className="text-xl text-AccentLight">Login</h2>
        <fieldset className="flex flex-col w-full gap-1.5">
          <label className="text-AccentLight">Email:</label>
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <fieldset className="flex flex-col w-full gap-1.5 mb-2">
          <label className="text-AccentLight">Password:</label>
          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <SubmitButton
          text="Login"
          disabled={loginForm.email && loginForm.password ? false : true}
          loading={false}
        />
        <Link href="/signup" className="text-BaseLight">
          Don&apos;t have an account?{' '}
          <span className="text-AccentLight">Sign up</span>
        </Link>
      </form>
    </section>
  )
}

export default LoginPage
