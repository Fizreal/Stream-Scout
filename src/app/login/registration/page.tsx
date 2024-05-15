'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { Profile } from '@/types'
import SubmitButton from '@/components/SubmitButton'
import Countries from '@/utils/services.json'
import { Country, Service } from '@/types'

type ProfileForm = {
  username: string
  country: string
  subscriptions: string[]
}

const RegistrationPage = () => {
  const { assignUser } = useUser()
  const socket = useSocket()
  const router = useRouter()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    username: '',
    country: '',
    subscriptions: []
  })
  const [uniqueUsername, setUniqueUsername] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    country: '',
    subscriptions: ''
  })
  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(
    null
  )
  const availableServices = useMemo(() => {
    if (!profileForm.country) return null

    return Countries.find(
      (country) => country.countryCode === profileForm.country
    )?.services
  }, [profileForm.country])

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === 'subscriptions') {
      let subscription = e.target.value
      if ((e.target as HTMLInputElement).checked) {
        setProfileForm((prev) => ({
          ...prev,
          subscriptions: [...prev.subscriptions, subscription]
        }))
      } else {
        setProfileForm((prev) => ({
          ...prev,
          subscriptions: prev.subscriptions.filter((s) => s !== subscription)
        }))
      }
    } else {
      setProfileForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      uniqueUsername &&
      profileForm.subscriptions.length > 0 &&
      profileForm.country
    ) {
      socket?.emit(
        'update profile',
        {
          username: profileForm.username,
          country: profileForm.country,
          subscriptions: profileForm.subscriptions
        },
        (res: Profile) => {
          assignUser(res)
          router.push('/')
        }
      )
    }
  }

  useEffect(() => {
    if (usernameTimer) clearTimeout(usernameTimer)
    setErrorMessages((prev) => ({ ...prev, username: '' }))
    setUniqueUsername(false)

    let validUsername = /^[a-zA-Z0-9]+$/.test(profileForm.username)
    if (profileForm.username.length > 4 && validUsername) {
      setUsernameTimer(
        setTimeout(() => {
          socket?.emit(
            'check username',
            { username: profileForm.username },
            (res: boolean) => {
              setUniqueUsername(res)
            }
          )
        }, 1000)
      )
    } else {
      setErrorMessages((prev) => ({
        ...prev,
        username: 'Username does not meet requirements'
      }))
    }
  }, [profileForm.username])

  return (
    <section>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={profileForm.username}
            onChange={handleFormChange}
          />
          <p>{errorMessages.username}</p>
        </fieldset>
        <fieldset>
          <label htmlFor="country">Country:</label>
          <select
            name="country"
            value={profileForm.country}
            onChange={handleFormChange}
          >
            <option value="" disabled>
              Select a country
            </option>
            {Countries.map((country: Country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.name}
              </option>
            ))}
          </select>
          <p>{errorMessages.country}</p>
        </fieldset>
        <fieldset>
          <legend>Subscriptions:</legend>
          {availableServices?.map((service: Service) => (
            <label key={service.id}>
              <input
                type="checkbox"
                name="subscriptions"
                value={service.id}
                onChange={handleFormChange}
              />
              {service.name}
            </label>
          ))}
          <p>{errorMessages.subscriptions}</p>
        </fieldset>
        <SubmitButton
          text="Create profile"
          disabled={
            profileForm.username &&
            profileForm.country &&
            profileForm.subscriptions.length
              ? false
              : true
          }
          loading={false}
        />
      </form>
    </section>
  )
}

export default RegistrationPage
