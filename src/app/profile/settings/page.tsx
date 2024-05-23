'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { Profile, ProfileForm } from '@/types'
import { useRouter } from 'next/navigation'
import ProfileUpdate from '@/components/ProfileUpdate'
import SubmitButton from '@/components/SubmitButton'

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
      setProfileForm({
        country: e.target.value,
        subscriptions: []
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
      <h2>Update profile</h2>
      <ProfileUpdate
        profileForm={profileForm}
        errorMessage=""
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
        submitText="Update profile"
      />
      <SubmitButton
        text="Discard changes"
        onClick={() => router.push('/profile')}
        width="fit"
        loading={false}
        disabled={false}
      />
    </section>
  )
}

export default SettingsPage
