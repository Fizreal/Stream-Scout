'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { Profile, ProfileForm } from '@/types'
import { useRouter } from 'next/navigation'
import ProfileUpdate from '@/components/ProfileUpdate'

const SettingsPage = () => {
  const socket = useSocket()
  const { user, assignUser } = useUser()
  const router = useRouter()

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    country: user ? user.country : '',
    subscriptions: user ? user.subscriptions : []
  })

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileForm({
      country: e.target.value,
      subscriptions: []
    })
  }

  const handleGenreChange = (id: string) => {
    if (profileForm.subscriptions.includes(id)) {
      let updatedSubs = profileForm.subscriptions.filter((sub) => sub !== id)
      console.log('remove', updatedSubs)
      setProfileForm({
        ...profileForm,
        subscriptions: updatedSubs
      })
    } else {
      let updatedSubs = [...profileForm.subscriptions, id]
      console.log('add', updatedSubs)
      setProfileForm({
        ...profileForm,
        subscriptions: [...profileForm.subscriptions, id]
      })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    if (profileForm.subscriptions.length > 0 && profileForm.country) {
      socket?.emit(
        'update profile',
        {
          username: user.username,
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
    if (user) {
      setProfileForm({
        country: user.country,
        subscriptions: user.subscriptions
      })
    }
  }, [user])

  return (
    <section>
      <h2 className="text-2xl text-AccentLight mb-3">Update profile</h2>
      <ProfileUpdate
        profileForm={profileForm}
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
        handleGenreChange={handleGenreChange}
        handleDiscard={() => router.push('/profile')}
        submitText="Update profile"
      />
    </section>
  )
}

export default SettingsPage
