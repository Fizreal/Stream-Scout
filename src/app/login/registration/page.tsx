'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { Profile } from '@/types'
import ProfileUpdate from '@/components/ProfileUpdate'

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
  const [errorMessage, setErrorMessage] = useState('')
  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(
    null
  )

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
    } else if (e.target.name === 'country') {
      setProfileForm({
        ...profileForm,
        country: e.target.value,
        subscriptions: []
      })
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
    setErrorMessage('')
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
      setErrorMessage('Username does not meet requirements')
    }
  }, [profileForm.username])

  return (
    <section>
      <h2>Register Page</h2>
      <ProfileUpdate
        profileForm={profileForm}
        handleFormChange={handleFormChange}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        submitText="Create profile"
      />
    </section>
  )
}

export default RegistrationPage
