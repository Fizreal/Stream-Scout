'use client'

import { useState } from 'react'
import { Register } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import SubmitButton from '@/components/SubmitButton'
import Link from 'next/link'

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
    <section className="flex flex-col items-center pt-6 w-full">
      <form
        onSubmit={handleRegister}
        className="flex flex-col bg-PrimaryDark items-center w-4/5 max-w-md p-6 gap-1.5 rounded-lg shadow-lg"
      >
        <h1>Register Page</h1>
        <fieldset className="flex flex-col w-full gap-1.5">
          <label className="text-AccentLight">Name:</label>
          <input
            type="text"
            name="name"
            value={registerForm.name}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <fieldset className="flex flex-col w-full gap-1.5">
          <label className="text-AccentLight">Email:</label>
          <input
            type="email"
            name="email"
            value={registerForm.email}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <fieldset className="flex flex-col w-full gap-1.5">
          <label className="text-AccentLight">Password:</label>
          <input
            type="password"
            name="password"
            value={registerForm.password}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <fieldset className="flex flex-col w-full gap-1.5">
          <label className="text-AccentLight">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={registerForm.confirmPassword}
            onChange={handleChange}
            className="rounded-md py-1 px-2 hover:border-AccentLight focus:border-AccentLight transition-colors duration-300 ease-in-out border-2 
            w-full"
          />
        </fieldset>
        <SubmitButton
          text="Register"
          disabled={
            registerForm.name &&
            registerForm.email &&
            registerForm.password &&
            registerForm.confirmPassword
              ? false
              : true
          }
          loading={false}
        />
        <Link href="/login">Already have an account? Login</Link>
      </form>
    </section>
  )
}

export default SignUp
