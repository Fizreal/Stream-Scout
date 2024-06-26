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
  const [usernameCriteria, setUsernameCriteria] = useState({
    length: false,
    valid: false
  })
  const [usernameTimer, setUsernameTimer] = useState<NodeJS.Timeout | null>(
    null
  )

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === 'country') {
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

  const handleGenreChange = (id: string) => {
    if (profileForm.subscriptions.includes(id)) {
      setProfileForm({
        ...profileForm,
        subscriptions: profileForm.subscriptions.filter((sub) => sub !== id)
      })
    } else {
      setProfileForm({
        ...profileForm,
        subscriptions: [...profileForm.subscriptions, id]
      })
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
    setUniqueUsername(false)

    let validUsername = /^[a-zA-Z0-9]+$/.test(profileForm.username)
    let validLength = profileForm.username.length > 4
    setUsernameCriteria({ length: validLength, valid: validUsername })

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
    }
  }, [profileForm.username])

  return (
    <section className="flex flex-col items-center pt-6 w-full">
      <h2 className="text-2xl text-AccentLight mb-3">Create profile</h2>
      <ProfileUpdate
        profileForm={profileForm}
        uniqueUsername={uniqueUsername}
        usernameCriteria={usernameCriteria}
        handleFormChange={handleFormChange}
        handleGenreChange={handleGenreChange}
        handleSubmit={handleSubmit}
        submitText="Create profile"
      />
    </section>
  )
}

export default RegistrationPage
