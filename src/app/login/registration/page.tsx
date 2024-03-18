'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { ProfileForm, Profile } from '@/types'
import { Countries } from '@/utils/rapid-api'

type Service = {
  id: string
  name: string
  homepage: string
  themeColorCode: string
  images: {
    lightThemeImage: string
    darkThemeImage: string
    whiteImage: string
  }
  supportedStreamingTypes: {
    addon: boolean
    buy: boolean
    free: boolean
    rent: boolean
    subscription: boolean
  }
}

type Country = {
  countryCode: string
  name: string
  services: Service[]
}

export const getStaticProps = async () => {
  const countryData = await Countries()

  const countries: Country[] = countryData.map((country: Country) => {
    return {
      countryCode: country.countryCode,
      name: country.name,
      services: Object.values(country.services)
    }
  })

  return {
    props: {
      countries
    }
  }
}

const RegistrationPage = ({ countries }: { countries: Country[] }) => {
  const { assignUser } = useUser()
  const socket = useSocket()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    username: '',
    country: '',
    services: []
  })
  const [uniqueUsername, setUniqueUsername] = useState(false)
  const [errorMessages, setErrorMessages] = useState({
    username: '',
    country: '',
    services: ''
  })
  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(
    null
  )
  const availableServices = useMemo(() => {
    return countries.find(
      (country) => country.countryCode === profileForm.country
    )?.services
  }, [profileForm.country])

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === 'services') {
      let service = e.target.value
      if ((e.target as HTMLInputElement).checked) {
        setProfileForm((prev) => ({
          ...prev,
          services: [...prev.services, service]
        }))
      } else {
        setProfileForm((prev) => ({
          ...prev,
          services: prev.services.filter((s) => s !== service)
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
      profileForm.services.length > 0 &&
      profileForm.country
    ) {
      socket?.emit(
        'update profile',
        {
          username: profileForm.username,
          country: profileForm.country,
          services: profileForm.services
        },
        (res: Profile) => {
          assignUser(res)
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
            profileForm.username,
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
    <main>
      <h1>Register Page</h1>
      <form>
        <fieldset>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            value={profileForm.username}
            onChange={handleFormChange}
          />
          <p>{errorMessages.username}</p>
        </fieldset>
        <fieldset>
          <label htmlFor="country">Country:</label>
          <select name="country" onChange={handleFormChange}>
            {countries.map((country: Country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.name}
              </option>
            ))}
          </select>
          <p>{errorMessages.country}</p>
        </fieldset>
        <fieldset>
          <legend>Services:</legend>
          {availableServices?.map((service: Service) => (
            <label key={service.id}>
              <input
                type="checkbox"
                name="services"
                value={service.id}
                onChange={handleFormChange}
              />
              {service.name}
            </label>
          ))}
          <p>{errorMessages.services}</p>
        </fieldset>
      </form>
    </main>
  )
}

export default RegistrationPage
